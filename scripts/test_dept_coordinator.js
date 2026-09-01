/**
 * OfferDesk Role Test Script: Department Coordinator (HOD)
 * Validates 100% of Dept Coordinator features: Student branch clearance, non-placement pathways, drive spaces.
 */

const {
  BASE_EXPRESS_URL,
  apiRequest,
  createStatsTracker,
  getSysAdminToken,
  createAndActivateTenant,
  createUserAndLogin
} = require('./test_helper');

async function testDeptCoordinatorRole() {
  const stats = createStatsTracker('DeptCoordinator');
  console.log('\n==================================================');
  console.log('🎓 TESTING ROLE: DEPT COORDINATOR (HOD)');
  console.log('==================================================');

  try {
    const sysToken = await getSysAdminToken();
    const tenantId = await createAndActivateTenant(sysToken, `DC_${Date.now()}`);
    const hod = await createUserAndLogin(sysToken, tenantId, 'dept_coordinator');
    const student = await createUserAndLogin(sysToken, tenantId, 'student');

    // 1. Fetch Dept Student Roster
    const rosterRes = await apiRequest(`${BASE_EXPRESS_URL}/api/dept/students`, 'GET', null, hod.token);
    stats.recordTest('Fetch Dept Student Roster', rosterRes.status === 200 && Array.isArray(rosterRes.data.students));

    // 2. Student Branch Clearance Sign-Off
    if (student.user.id) {
      const verifyRes = await apiRequest(`${BASE_EXPRESS_URL}/api/dept/students/${student.user.id}/verify`, 'PATCH', {}, hod.token);
      if (verifyRes.status !== 200) console.log('DEBUG verifyRes:', verifyRes);
      stats.recordTest('Student Branch Clearance Sign-Off', verifyRes.status === 200 && verifyRes.data.student?.verifiedByDept, JSON.stringify(verifyRes.data));
    }

    // 3. Create Dynamic Non-Placement Pathway
    const pathRes = await apiRequest(`${BASE_EXPRESS_URL}/api/non-placement/pathways`, 'POST', {
      department: 'CSE Department',
      domainKey: 'HIGHER_STUDIES_GATE',
      title: 'GATE CSE Masterclass & Research Track',
      description: 'Structured semester preparation blueprint.'
    }, hod.token);
    stats.recordTest('Create Dynamic Non-Placement Pathway', pathRes.status === 201 && !!pathRes.data.pathway);

    // 4. Create Geofence Drive Space
    const spaceRes = await apiRequest(`${BASE_EXPRESS_URL}/api/spaces`, 'POST', {
      spaceId: `space_${Date.now()}`,
      name: 'CSE Mock Technical Training Hall',
      type: 'TECHNICAL',
      venueLat: 12.9716,
      venueLon: 77.5946,
      radiusMeters: 250
    }, hod.token);
    stats.recordTest('Create Geofence Drive Space', spaceRes.status === 201 && !!spaceRes.data.space);

    // Cleanup
    await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}`, 'DELETE', null, sysToken);
  } catch (err) {
    stats.recordTest('DeptCoordinator Execution', false, err.message);
  }

  return stats;
}

if (require.main === module) {
  testDeptCoordinatorRole();
}

module.exports = testDeptCoordinatorRole;
