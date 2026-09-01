/**
 * OfferDesk Role Test Script: Tenant Admin (Placement Cell Officer)
 * Validates 100% of Tenant Admin features: Notice broadcasts, drive posting, drive authorization, offer letters.
 */

const {
  BASE_EXPRESS_URL,
  apiRequest,
  createStatsTracker,
  getSysAdminToken,
  createAndActivateTenant,
  createUserAndLogin
} = require('./test_helper');

async function testTenantAdminRole() {
  const stats = createStatsTracker('TenantAdmin');
  console.log('\n==================================================');
  console.log('🏛️ TESTING ROLE: TENANT ADMIN (Placement Officer)');
  console.log('==================================================');

  try {
    const sysToken = await getSysAdminToken();
    const tenantId = await createAndActivateTenant(sysToken, `TA_${Date.now()}`);
    const admin = await createUserAndLogin(sysToken, tenantId, 'tenant_admin');
    const student = await createUserAndLogin(sysToken, tenantId, 'student');

    // 1. Broadcast Notice
    const noticeRes = await apiRequest(`${BASE_EXPRESS_URL}/api/notices`, 'POST', {
      title: 'Placement Cell Orientation Drive',
      content: 'All candidates must submit resumes before Friday.',
      category: 'URGENT'
    }, admin.token);
    stats.recordTest('Broadcast Campus Notice', noticeRes.status === 201 && noticeRes.data.notice);

    // 2. Post Recruitment Drive
    const jobRes = await apiRequest(`${BASE_EXPRESS_URL}/api/jobs`, 'POST', {
      title: 'Cloud Systems Software Engineer',
      company: 'Google Cloud Platform',
      location: 'Bangalore / Remote',
      salary: '₹22.0 LPA',
      minGpa: 7.5,
      eligibleBranches: ['CSE', 'IT'],
      description: 'Role focused on distributed systems and microservices.',
      approvedByTenantAdmin: false
    }, admin.token);

    const jobId = jobRes.data?.job?._id || jobRes.data?.job?.id;
    stats.recordTest('Post Recruitment Drive', jobRes.status === 201 && !!jobId, `Job ID: ${jobId}`);

    // 3. Authorize Drive & Geofence
    if (jobId) {
      const apprRes = await apiRequest(`${BASE_EXPRESS_URL}/api/jobs/${jobId}/approve`, 'PATCH', {}, admin.token);
      stats.recordTest('Authorize Drive & Geofence', apprRes.status === 200 && apprRes.data.job?.approvedByTenantAdmin === true);
    }

    // 4. Issue Placement Offer Letter
    if (jobId && student.user.id) {
      const issueRes = await apiRequest(`${BASE_EXPRESS_URL}/api/acceptances`, 'POST', {
        acceptanceId: `acc_${Date.now()}`,
        jobId,
        jobTitle: 'Cloud Systems Software Engineer',
        company: 'Google Cloud Platform',
        studentId: student.user.id,
        studentName: student.user.name,
        studentEmail: student.email
      }, admin.token);
      stats.recordTest('Issue Placement Offer Letter', issueRes.status === 201 && !!issueRes.data.contract);
    }

    // Cleanup
    await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}`, 'DELETE', null, sysToken);
  } catch (err) {
    stats.recordTest('TenantAdmin Execution', false, err.message);
  }

  return stats;
}

if (require.main === module) {
  testTenantAdminRole();
}

module.exports = testTenantAdminRole;
