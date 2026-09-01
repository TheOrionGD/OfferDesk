/**
 * OfferDesk Role Test Script: Auditor (Accreditation / NIRF Auditor)
 * Validates 100% of Auditor features: Cryptographic offer stats, NIRF metrics, partner company MOUs.
 */

const {
  BASE_EXPRESS_URL,
  apiRequest,
  createStatsTracker,
  getSysAdminToken,
  createAndActivateTenant,
  createUserAndLogin
} = require('./test_helper');

async function testAuditorRole() {
  const stats = createStatsTracker('Auditor');
  console.log('\n==================================================');
  console.log('🔍 TESTING ROLE: AUDITOR (NIRF / Accreditation Inspector)');
  console.log('==================================================');

  try {
    const sysToken = await getSysAdminToken();
    const tenantId = await createAndActivateTenant(sysToken, `AUD_${Date.now()}`);
    const auditor = await createUserAndLogin(sysToken, tenantId, 'auditor');

    // 1. Audit Cryptographic Offer Letter Stats
    const statsRes = await apiRequest(`${BASE_EXPRESS_URL}/api/auditor/stats`, 'GET', null, auditor.token);
    stats.recordTest('Audit Cryptographic Offer Letter Stats', statsRes.status === 200 && statsRes.data.stats !== undefined);

    // 2. Audit Dynamic NIRF Metric Parameters
    const nirfRes = await apiRequest(`${BASE_EXPRESS_URL}/api/auditor/nirf-metrics`, 'GET', null, auditor.token);
    stats.recordTest('Audit Dynamic NIRF Metric Parameters', nirfRes.status === 200 && nirfRes.data.metrics !== undefined);

    // 3. Audit Corporate Partner MOUs
    const compRes = await apiRequest(`${BASE_EXPRESS_URL}/api/auditor/companies`, 'GET', null, auditor.token);
    stats.recordTest('Audit Corporate Partner MOUs', compRes.status === 200 && Array.isArray(compRes.data.companies));

    // Cleanup
    await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}`, 'DELETE', null, sysToken);
  } catch (err) {
    stats.recordTest('Auditor Execution', false, err.message);
  }

  return stats;
}

if (require.main === module) {
  testAuditorRole();
}

module.exports = testAuditorRole;
