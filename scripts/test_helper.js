/**
 * OfferDesk Test Helper Utilities
 * Shared helper functions for modular role test scripts
 */

const BASE_EXPRESS_URL = process.env.EXPRESS_URL || 'http://127.0.0.1:5001';
const BASE_ML_URL = process.env.ML_URL || 'http://127.0.0.1:8000';

async function apiRequest(url, method = 'GET', body = null, token = null, headers = {}) {
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };
  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers: finalHeaders
  };

  if (body) {
    if (typeof body === 'string') {
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, options);
  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return { status: res.status, data };
}

function createStatsTracker(roleName) {
  return {
    roleName,
    total: 0,
    passed: 0,
    failed: 0,
    recordTest(description, isPassed, details = '') {
      this.total++;
      if (isPassed) {
        this.passed++;
        console.log(`  ✅ [PASS] ${roleName}: ${description}`);
      } else {
        this.failed++;
        const detailStr = details || 'Unexpected response status or payload';
        console.error(`  ❌ [FAIL] ${roleName}: ${description} -> ${detailStr}`);
      }
    }
  };
}

async function getSysAdminToken() {
  const loginRes = await apiRequest(`${BASE_EXPRESS_URL}/api/auth/login`, 'POST', {
    email: 'sysadmin@offerdesk.io',
    password: 'sysadmin_secure_pass_2026',
    role: 'sysadmin',
    tenantId: 'SYSTEM'
  });
  if (loginRes.status === 200 && loginRes.data.token) {
    return loginRes.data.token;
  }
  throw new Error('Failed to obtain SysAdmin token');
}

async function createAndActivateTenant(sysadminToken, tenantCode = null) {
  const code = tenantCode || `TENANT_${Date.now()}`;
  const provRes = await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants`, 'POST', {
    name: `University Tenant ${code}`,
    code,
    domain: `univ_${code.toLowerCase()}.edu.in`,
    plan: 'ENTERPRISE',
    placementOfficerName: 'Placement Cell Officer',
    contactEmail: `tpo@univ_${code.toLowerCase()}.edu.in`
  }, sysadminToken);

  if (provRes.status !== 201 || !provRes.data.tenant?.tenantId) {
    throw new Error(`Failed to provision tenant: ${JSON.stringify(provRes.data)}`);
  }

  const tenantId = provRes.data.tenant.tenantId;

  await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}/status`, 'PATCH', {
    status: 'ACTIVE'
  }, sysadminToken);

  return tenantId;
}

async function createUserAndLogin(sysadminToken, tenantId, role, emailPrefix = null) {
  const email = `${emailPrefix || role}_${Date.now()}@univ.edu.in`;
  const name = `Test ${role.toUpperCase()} User`;
  
  const createRes = await apiRequest(`${BASE_EXPRESS_URL}/api/users`, 'POST', {
    email,
    name,
    role,
    department: 'CSE Department',
    gpa: role === 'student' ? 8.5 : undefined,
    academicYear: role === 'student' ? 4 : undefined
  }, sysadminToken, { 'X-Tenant-ID': tenantId });

  if (createRes.status !== 201 || !createRes.data.user) {
    throw new Error(`Failed to create user ${role}: ${JSON.stringify(createRes.data)}`);
  }

  const user = createRes.data.user;

  const loginRes = await apiRequest(`${BASE_EXPRESS_URL}/api/auth/login`, 'POST', {
    email,
    password: 'dev_password_2026',
    role,
    tenantId
  });

  if (loginRes.status !== 200 || !loginRes.data.token) {
    throw new Error(`Failed to login user ${role}: ${JSON.stringify(loginRes.data)}`);
  }

  return {
    user,
    token: loginRes.data.token,
    email
  };
}

module.exports = {
  BASE_EXPRESS_URL,
  BASE_ML_URL,
  apiRequest,
  createStatsTracker,
  getSysAdminToken,
  createAndActivateTenant,
  createUserAndLogin
};
