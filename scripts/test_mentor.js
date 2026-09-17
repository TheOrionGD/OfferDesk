/**
 * OfferDesk Role Test Script: Mentor (Alumni / Industry Guide)
 * Validates 100% of Mentor features: Scheduling mentorship coaching sessions, session directories.
 */

const {
  BASE_EXPRESS_URL,
  apiRequest,
  createStatsTracker,
  getSysAdminToken,
  createAndActivateTenant,
  createUserAndLogin
} = require('./test_helper');

async function testMentorRole() {
  const stats = createStatsTracker('Mentor');
  console.log('\n==================================================');
  console.log('🤝 TESTING ROLE: MENTOR (Alumni / Industry Guide)');
  console.log('==================================================');

  try {
    const sysToken = await getSysAdminToken();
    const tenantId = await createAndActivateTenant(sysToken, `MEN_${Date.now()}`);
    const mentor = await createUserAndLogin(sysToken, tenantId, 'mentor');
    const student = await createUserAndLogin(sysToken, tenantId, 'student');

    // 1. Schedule Mentorship Technical Coaching Session
    const mentRes = await apiRequest(`${BASE_EXPRESS_URL}/api/mentorships`, 'POST', {
      alumniId: mentor.user.id,
      studentId: student.user.id,
      topic: 'System Design & Mock Technical Architecture Interview',
      scheduledDate: '2026-08-25',
      scheduledTime: '11:00 AM'
    }, mentor.token);
    stats.recordTest('Schedule Mentorship Session', mentRes.status === 201 && !!mentRes.data.session);

    // 2. Fetch Mentorship Sessions Directory
    const listRes = await apiRequest(`${BASE_EXPRESS_URL}/api/mentorships`, 'GET', null, mentor.token);
    stats.recordTest('Fetch Mentorship Sessions Directory', listRes.status === 200 && Array.isArray(listRes.data.sessions));

    // Cleanup
    await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}`, 'DELETE', null, sysToken);
  } catch (err) {
    stats.recordTest('Mentor Execution', false, err.message);
  }

  return stats;
}

if (require.main === module) {
  testMentorRole();
}

module.exports = testMentorRole;
