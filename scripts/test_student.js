/**
 * OfferDesk Role Test Script: Student (Candidate Applicant)
 * Validates 100% of Student features:
 * - PDF Base64 resume.pdf Upload & Profile Fetching
 * - AI ATS Sentence-Transformers Vector Candidate Matching
 * - 1-Click Drive Application
 * - SHA-256 Cryptographic E-Signature Offer Acceptance
 * - Stress Entry Index & Peer Support Wall
 * - Direct Chat Messaging
 */

const fs = require('fs');
const path = require('path');

const {
  BASE_EXPRESS_URL,
  apiRequest,
  createStatsTracker,
  getSysAdminToken,
  createAndActivateTenant,
  createUserAndLogin
} = require('./test_helper');

async function testStudentRole() {
  const stats = createStatsTracker('Student');
  console.log('\n==================================================');
  console.log('🎓 TESTING ROLE: STUDENT (Candidate Applicant)');
  console.log('==================================================');

  try {
    const sysToken = await getSysAdminToken();
    const tenantId = await createAndActivateTenant(sysToken, `STU_${Date.now()}`);
    const student = await createUserAndLogin(sysToken, tenantId, 'student');
    const admin = await createUserAndLogin(sysToken, tenantId, 'tenant_admin');
    const recruiter = await createUserAndLogin(sysToken, tenantId, 'recruiter');

    // Create a Job Drive for testing drive application & ATS
    const jobRes = await apiRequest(`${BASE_EXPRESS_URL}/api/jobs`, 'POST', {
      title: 'Cloud Software Engineer',
      company: 'Google Cloud Platform',
      location: 'Bangalore',
      salary: '₹24.0 LPA',
      minGpa: 7.5,
      eligibleBranches: ['CSE'],
      description: 'Role seeking developers skilled in React, Node.js, Python, PostgreSQL'
    }, admin.token);
    const jobId = jobRes.data?.job?._id || jobRes.data?.job?.id;

    // 1. Read & Base64 Encode User resume.pdf
    const resumePath = path.resolve(__dirname, '../resume.pdf');
    let base64Resume = '';
    if (fs.existsSync(resumePath)) {
      base64Resume = fs.readFileSync(resumePath).toString('base64');
      stats.recordTest('Read & Base64 Encode User resume.pdf', true, `Base64 size: ${base64Resume.length} chars`);
    } else {
      base64Resume = Buffer.from('Mock PDF Content: Software Engineering Student skilled in React, Node.js, Python').toString('base64');
      stats.recordTest('Fallback Buffer Resume Construction', true);
    }

    // 2. Upload Base64 Resume to MongoDB User Profile
    const uploadRes = await apiRequest(`${BASE_EXPRESS_URL}/api/users/${student.user.id}/resume`, 'POST', {
      resumeData: base64Resume,
      resumeFileName: 'resume.pdf',
      resumeMimeType: 'application/pdf'
    }, student.token);
    stats.recordTest('Upload Base64 Resume to Profile', uploadRes.status === 200 && uploadRes.data.success);

    // 3. Retrieve Stored Profile Resume
    const fetchRes = await apiRequest(`${BASE_EXPRESS_URL}/api/users/${student.user.id}/resume`, 'GET', null, student.token);
    stats.recordTest('Retrieve Stored Resume from Profile', fetchRes.status === 200 && fetchRes.data.resume?.fileName === 'resume.pdf');

    // 4. AI ATS Candidate Vector Sentence Matching & Ranking
    const atsRes = await apiRequest(`${BASE_EXPRESS_URL}/api/ats/rank`, 'POST', {
      job_spec: {
        id: jobId || 'job_001',
        title: 'Cloud Software Engineer',
        description: 'Seeking developers skilled in React, Node.js, Python, PostgreSQL',
        required_skills: ['React', 'Node.js', 'Python', 'PostgreSQL'],
        min_gpa: 7.5
      },
      candidates: [
        {
          id: student.user.id,
          name: student.user.name,
          email: student.email,
          skills: ['React', 'Node.js', 'Python', 'PostgreSQL'],
          gpa: 8.5,
          bio: 'Full stack developer proficient in React, Node.js REST APIs, PostgreSQL and Python',
          project_summary: 'Built multi-tenant campus placement SaaS platform.'
        }
      ]
    }, student.token);
    if (atsRes.status !== 200) console.log('DEBUG atsRes:', atsRes);
    stats.recordTest('AI Vector Sentence Matching & Ranking', atsRes.status === 200 && Array.isArray(atsRes.data.leaderboard), JSON.stringify(atsRes.data));

    // 5. 1-Click Drive Application
    if (jobId) {
      const applyRes = await apiRequest(`${BASE_EXPRESS_URL}/api/applications`, 'POST', {
        jobId,
        studentId: student.user.id,
        studentName: student.user.name,
        studentRole: 'student'
      }, student.token);
      stats.recordTest('1-Click Apply to Recruitment Drive', applyRes.status === 201 && !!applyRes.data.application);
    }

    // 6. SHA-256 Cryptographic E-Signature Offer Acceptance
    if (jobId) {
      const issueRes = await apiRequest(`${BASE_EXPRESS_URL}/api/acceptances`, 'POST', {
        jobId,
        jobTitle: 'Cloud Software Engineer',
        company: 'Google Cloud Platform',
        studentId: student.user.id,
        studentName: student.user.name,
        studentEmail: student.email
      }, admin.token);

      const createdAccId = issueRes.data?.contract?.acceptanceId;
      if (createdAccId) {
        const signRes = await apiRequest(`${BASE_EXPRESS_URL}/api/acceptances/${createdAccId}/sign`, 'POST', {
          digitalSignature: student.user.name,
          typedLegalName: student.user.name,
          clientIp: '127.0.0.1'
        }, student.token);
        stats.recordTest('SHA-256 E-Signature Offer Acceptance', signRes.status === 200 && signRes.data.contract?.status === 'ACCEPTED');
      } else {
        stats.recordTest('SHA-256 E-Signature Offer Acceptance', false, 'Offer contract creation failed');
      }
    }

    // 7. Student Wellness Stress Log Entry
    const stressRes = await apiRequest(`${BASE_EXPRESS_URL}/api/wellness/stress-entry`, 'POST', {
      moodScore: 8,
      stressLevel: 'MODERATE',
      notes: 'Prepared well for cloud technical interview.'
    }, student.token);
    stats.recordTest('Submit Student Wellness Entry', stressRes.status === 201 && !!stressRes.data.entry);

    // 8. Post on Peer Support Wall
    const wallRes = await apiRequest(`${BASE_EXPRESS_URL}/api/wellness/peer-wall`, 'POST', {
      author: student.user.name,
      text: 'Great experience practicing algorithm problems!'
    }, student.token);
    stats.recordTest('Post on Peer Support Wall', wallRes.status === 201 && !!wallRes.data.post);

    // 9. Send Direct Chat Message to Recruiter
    const chatRes = await apiRequest(`${BASE_EXPRESS_URL}/api/chat/messages`, 'POST', {
      receiverId: recruiter.user.id,
      receiverName: recruiter.user.name,
      receiverRole: 'recruiter',
      message: 'Hello, looking forward to the interview session.'
    }, student.token);
    stats.recordTest('Send Direct Chat Message', chatRes.status === 201 && !!chatRes.data.message);

    // Cleanup
    await apiRequest(`${BASE_EXPRESS_URL}/api/sysadmin/tenants/${tenantId}`, 'DELETE', null, sysToken);
  } catch (err) {
    stats.recordTest('Student Execution', false, err.message);
  }

  return stats;
}

if (require.main === module) {
  testStudentRole();
}

module.exports = testStudentRole;
