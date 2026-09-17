/**
 * OfferDesk Master Automated Test Suite Orchestrator
 * Sequentially executes all 8 modular role test scripts in scripts/ directory:
 * 1. test_sysadmin.js
 * 2. test_tenant_admin.js
 * 3. test_dept_coordinator.js
 * 4. test_recruiter.js
 * 5. test_evaluator.js
 * 6. test_mentor.js
 * 7. test_student.js
 * 8. test_auditor.js
 */

const testSysAdminRole = require('./test_sysadmin');
const testTenantAdminRole = require('./test_tenant_admin');
const testDeptCoordinatorRole = require('./test_dept_coordinator');
const testRecruiterRole = require('./test_recruiter');
const testEvaluatorRole = require('./test_evaluator');
const testMentorRole = require('./test_mentor');
const testStudentRole = require('./test_student');
const testAuditorRole = require('./test_auditor');

async function runAllRoleTests() {
  console.log('\n==============================================================================');
  console.log('🚀 OFFERDESK MASTER E2E MODULAR ROLE-BASED AUTOMATED TEST SUITE');
  console.log('==============================================================================');

  const roleResults = [];

  // Execute each role test script sequentially
  roleResults.push(await testSysAdminRole());
  roleResults.push(await testTenantAdminRole());
  roleResults.push(await testDeptCoordinatorRole());
  roleResults.push(await testRecruiterRole());
  roleResults.push(await testEvaluatorRole());
  roleResults.push(await testMentorRole());
  roleResults.push(await testStudentRole());
  roleResults.push(await testAuditorRole());

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  console.log('\n==============================================================================');
  console.log('📊 FINAL ROLE-BY-ROLE TEST EXECUTION SUMMARY');
  console.log('==============================================================================');
  console.log(' ROLE                     TOTAL    PASSED    FAILED   STATUS');
  console.log('------------------------------------------------------------------------------');

  for (const r of roleResults) {
    totalTests += r.total;
    totalPassed += r.passed;
    totalFailed += r.failed;
    const status = r.failed === 0 ? '✅ PASSED 100%' : '❌ FAILED';
    console.log(` ${r.roleName.padEnd(24)} ${String(r.total).padEnd(8)} ${String(r.passed).padEnd(9)} ${String(r.failed).padEnd(8)} ${status}`);
  }

  console.log('==============================================================================');
  console.log(` TOTAL ACROSS ALL ROLES:  ${totalTests} TOTAL | ${totalPassed} PASSED ✅ | ${totalFailed} FAILED ❌`);
  console.log('==============================================================================\n');

  if (totalFailed > 0) {
    process.exitCode = 1;
  }
}

runAllRoleTests().catch(err => {
  console.error('Fatal Test Orchestration Error:', err);
  process.exit(1);
});
