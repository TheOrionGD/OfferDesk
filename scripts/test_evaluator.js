/**
 * OfferDesk Role Test Script: Evaluator (Interview Panelist)
 * Validates 100% of Evaluator features: MongoDB QuestionBank management (GET, POST, DELETE), Rubric Scorecards.
 */

const {
  BASE_EXPRESS_URL,
  apiRequest,
  createStatsTracker,
  getSysAdminToken,
  createAndActivateTenant,
  createUserAndLogin
} = require('./test_helper');

async function testEvaluatorRole() {
  const stats = createStatsTracker('Evaluator');
  console.log('\n==================================================');
  console.log('📝 TESTING ROLE: EVALUATOR (Interview Panelist)');
  console.log('==================================================');

  try {
    const sysToken = await getSysAdminToken();
    const tenantId = await createAndActivateTenant(sysToken, `EV_${Date.now()}`);
    const evaluator = await createUserAndLogin(sysToken, tenantId, 'evaluator');
    const student = await createUserAndLogin(sysToken, tenantId, 'student');

    // 1. Add Technical Interview Question to MongoDB QuestionBank
    const qRes = await apiRequest(`${BASE_EXPRESS_URL}/api/evaluator/question-bank`, 'POST', {
      category: 'DSA',
      q: 'Explain how LRU Cache is implemented using Doubly Linked List and Hash Map.',
      difficulty: 'Medium'
    }, evaluator.token);
    const questionId = qRes.data?.question?._id;
    stats.recordTest('Add Question to MongoDB QuestionBank', qRes.status === 201 && !!questionId);

    // 2. Fetch Question Bank
    const bankRes = await apiRequest(`${BASE_EXPRESS_URL}/api/evaluator/question-bank`, 'GET', null, evaluator.token);
    stats.recordTest('Fetch Dynamic Question Bank', bankRes.status === 200 && Array.isArray(bankRes.data.questions));

    // 3. Delete Question from Bank
    if (questionId) {
      const delQRes = await apiRequest(`${BASE_EXPRESS_URL}/api/evaluator/question-bank/${questionId}`, 'DELETE', null, evaluator.token);
      stats.recordTest('Delete Question from QuestionBank', delQRes.status === 200 && delQRes.data.success);
    }

    // 4. Submit Candidate Technical Rubric Scorecard
    const evalRes = await apiRequest(`${BASE_EXPRESS_URL}/api/evaluations`, 'POST', {
      jobId: `job_${Date.now()}`,
      studentId: student.user.id,
      technicalScore: 9,
      communicationScore: 8,
      problemSolvingScore: 9,
      overallRating: 9,
      feedback: 'Strong understanding of data structures and clean OOP design.',
      decision: 'RECOMMEND'
    }, evaluator.token);
    stats.recordTest('Submit Technical Rubric Scorecard', evalRes.status === 201 && !!evalRes.data.evaluation);

    // Cleanup
    await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}`, 'DELETE', null, sysToken);
  } catch (err) {
    stats.recordTest('Evaluator Execution', false, err.message);
  }

  return stats;
}

if (require.main === module) {
  testEvaluatorRole();
}

module.exports = testEvaluatorRole;
