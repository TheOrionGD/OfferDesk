/**
 * OfferDesk Role Test Script: SysAdmin (SaaS Super Admin)
 * Validates 100% of SysAdmin features: Onboarding requests, provisioning, status updates, REST logs, DB stats.
 */

const {
  BASE_EXPRESS_URL,
  apiRequest,
  createStatsTracker,
  getSysAdminToken
} = require('./test_helper');

async function testSysAdminRole() {
  const stats = createStatsTracker('SysAdmin');
  console.log('\n==================================================');
  console.log('🛡️ TESTING ROLE: SYSADMIN (SaaS Super Admin)');
  console.log('==================================================');

  try {
    // 1. SysAdmin Login & Token Issuance
    const token = await getSysAdminToken();
    stats.recordTest('System Admin Login & Token Issuance', !!token);

    // 2. Guest Tenant Onboarding Request
    const reqRes = await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/request`, 'POST', {
      institutionName: 'SysAdmin Test University',
      institutionCode: `SATU_${Date.now()}`,
      institutionDomain: 'satu.edu.in',
      contactName: 'Admin User',
      adminEmail: 'admin@satu.edu.in'
    });
    stats.recordTest('Guest Tenant Onboarding Request', reqRes.status === 201 && reqRes.data.success);

    // 3. Provision New Institution Tenant
    const code = `SYS_${Date.now()}`;
    const provRes = await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants`, 'POST', {
      name: `SysAdmin Provisioned Institution ${code}`,
      code,
      domain: `sysadmin_${code.toLowerCase()}.edu.in`,
      plan: 'ENTERPRISE',
      placementOfficerName: 'Officer SysAdmin',
      contactEmail: `tpo@sysadmin_${code.toLowerCase()}.edu.in`
    }, token);

    const tenantId = provRes.data?.tenant?.tenantId;
    stats.recordTest('Provision Institution Tenant', provRes.status === 201 && !!tenantId, `TenantId: ${tenantId}`);

    // 4. Update Tenant Status to ACTIVE
    if (tenantId) {
      const actRes = await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}/status`, 'PATCH', {
        status: 'ACTIVE'
      }, token);
      stats.recordTest('Activate Tenant Status', actRes.status === 200 && actRes.data.tenant?.status === 'ACTIVE');
    }

    // 5. Inspect REST Logs
    const logsRes = await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/rest-logs`, 'GET', null, token);
    stats.recordTest('Inspect REST Logs', logsRes.status === 200 && Array.isArray(logsRes.data.logs));

    // 6. Inspect Database Stats
    const dbRes = await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/database-stats`, 'GET', null, token);
    stats.recordTest('Inspect Database Stats', dbRes.status === 200 && Array.isArray(dbRes.data.collections));

    // 7. Cleanup Tenant
    if (tenantId) {
      const delRes = await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}`, 'DELETE', null, token);
      stats.recordTest('Cascade Delete Test Tenant', delRes.status === 200 && delRes.data.success);
    }
  } catch (err) {
    stats.recordTest('SysAdmin Execution', false, err.message);
  }

  return stats;
}

if (require.main === module) {
  testSysAdminRole();
}

module.exports = testSysAdminRole;
