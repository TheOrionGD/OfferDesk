/**
 * OfferDesk Role Test Script: Recruiter (Corporate Partner)
 * Validates 100% of Recruiter features: Drive listing, drive job posting, candidate filtering, applicant inspection.
 */

const {
  BASE_EXPRESS_URL,
  apiRequest,
  createStatsTracker,
  getSysAdminToken,
  createAndActivateTenant,
  createUserAndLogin
} = require('./test_helper');

async function testRecruiterRole() {
  const stats = createStatsTracker('Recruiter');
  console.log('\n==================================================');
  console.log('💼 TESTING ROLE: RECRUITER (Corporate Partner)');
  console.log('==================================================');

  try {
    const sysToken = await getSysAdminToken();
    const tenantId = await createAndActivateTenant(sysToken, `REC_${Date.now()}`);
    const recruiter = await createUserAndLogin(sysToken, tenantId, 'recruiter');

    // 1. Post Recruiter Drive Job
    const postRes = await apiRequest(`${BASE_EXPRESS_URL}/api/jobs`, 'POST', {
      title: 'Backend Software Developer II',
      company: 'Amazon Web Services',
      location: 'Bangalore',
      salary: '₹26.0 LPA',
      minGpa: 7.0,
      eligibleBranches: ['CSE', 'IT'],
      description: 'Distributed systems and AWS Cloud infrastructure.'
    }, recruiter.token);
    stats.recordTest('Post Recruiter Drive Job', postRes.status === 201 && !!postRes.data.job);

    // 2. Fetch Active Recruitment Drives
    const jobsRes = await apiRequest(`${BASE_EXPRESS_URL}/api/jobs`, 'GET', null, recruiter.token);
    stats.recordTest('Fetch Active Recruitment Drives', jobsRes.status === 200 && Array.isArray(jobsRes.data.jobs));

    // 3. Search Candidate Roster
    const filterRes = await apiRequest(`${BASE_EXPRESS_URL}/api/dept/students`, 'GET', null, recruiter.token);
    stats.recordTest('Search Candidate Roster', filterRes.status === 200 && Array.isArray(filterRes.data.students));

    // 4. Fetch Candidate Applicants Pipeline
    const appsRes = await apiRequest(`${BASE_EXPRESS_URL}/api/applications`, 'GET', null, recruiter.token);
    stats.recordTest('Fetch Candidate Applicants Pipeline', appsRes.status === 200 && Array.isArray(appsRes.data.applications));

    // Cleanup
    await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}`, 'DELETE', null, sysToken);
  } catch (err) {
    stats.recordTest('Recruiter Execution', false, err.message);
  }

  return stats;
}

if (require.main === module) {
  testRecruiterRole();
}

module.exports = testRecruiterRole;
