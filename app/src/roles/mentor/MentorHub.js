import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUserGraduate, FaCalendarAlt, FaVideo,
  FaExclamationTriangle, FaLaptopCode, FaNewspaper, FaFileSignature, FaUsers,
  FaQuestionCircle, FaShareAlt, FaUserEdit, FaUniversity, FaAddressBook, FaMapMarkedAlt
} from 'react-icons/fa';
import axios from 'axios';

import MentorOverviewPage from "./MentorOverviewPage";
import MentorSchedulerPage from "./MentorSchedulerPage";
import MentorSessionBookingPage from "./MentorSessionBookingPage";
import MentorSandboxPage from "./MentorSandboxPage";
import MentorExperienceFeedPage from "./MentorExperienceFeedPage";
import MentorResumeReviewPage from "./MentorResumeReviewPage";
import MentorDirectoryPage from "./MentorDirectoryPage";
import MentorQnaPage from "./MentorQnaPage";
import MentorReferralsPage from "./MentorReferralsPage";
import MentorProfilePage from "./MentorProfilePage";
import MentorContactDeptPage from "./MentorContactDeptPage";
import MentorMenteeGpsPage from "./MentorMenteeGpsPage";
import MentorMenteeAcceptancePage from "./MentorMenteeAcceptancePage";

export function MentorHub() {
  const { currentTenant, backendError: tenantError } = useTenant();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sessions, setSessions] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchMentorships = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_URL}/api/mentorships?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.sessions) setSessions(res.data.sessions);
    } catch (e) {
      setErrorMsg('⚠️ Service Currently Unavailable: Unable to fetch mentorship sessions. Backend REST API on port 5001 is offline.');
    }
  }, [currentTenant, API_URL]);

  const fetchReferrals = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    try {
      const res = await axios.get(`${API_URL}/api/users?tenantId=${currentTenant.tenantId}`);
      if (res.data?.users) {
        setReferrals(res.data.users.filter(u => u.role === 'student' && u.referralStatus === 'SUBMITTED'));
      }
    } catch { /* referral count stays 0 */ }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchMentorships();
    fetchReferrals();
  }, [fetchMentorships, fetchReferrals]);

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!newTopic) return;
    if (!currentTenant?.tenantId) return;
    try {
      await axios.post(`${API_URL}/api/mentorships`, {
        tenantId: currentTenant.tenantId,
        mentorId: user?.assignedMentorId || user?.id || user?._id,
        studentId: user?.id || user?._id,
        userName: user?.name,
        userRole: user?.role,
        topic: newTopic,
        scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        scheduledTime: '04:00 PM',
        status: 'BOOKED'
      });
      setNewTopic('');
      setShowBooking(false);
      fetchMentorships();
    } catch (e) {
      setErrorMsg('⚠️ Session booking failed: REST API offline.');
    }
  };

  const navItems = [
    { key: 'overview',   title: '1. Hub Overview',        icon: <FaUserGraduate /> },
    { key: 'scheduler',  title: '2. Scheduler',            icon: <FaCalendarAlt /> },
    { key: 'booking',    title: '3. Booking Manager',      icon: <FaVideo /> },
    { key: 'sandbox',    title: '4. Mock Sandbox',         icon: <FaLaptopCode /> },
    { key: 'feed',       title: '5. Experience Feed',      icon: <FaNewspaper /> },
    { key: 'resume',     title: '6. Resume Review',        icon: <FaFileSignature /> },
    { key: 'directory',  title: '7. Mentor Directory',     icon: <FaUsers /> },
    { key: 'qna',        title: '8. Mentee Q&A',           icon: <FaQuestionCircle /> },
    { key: 'mentee_gps',  title: '9. Mentee Training GPS',  icon: <FaMapMarkedAlt /> },
    { key: 'mentee_acc',  title: '10. Mentee Offer Status', icon: <FaFileSignature /> },
    { key: 'referrals',   title: '11. Referral Hub',        icon: <FaShareAlt /> },
    { key: 'profile',     title: '12. Mentor Profile',      icon: <FaUserEdit /> },
    { key: 'contact',     title: '13. Contact mentor',      icon: <FaAddressBook /> },
  ];

  return (
    <div className="space-y-4">

      {/* ── Role Identity Banner (Purple / Violet) ──────────────────────── */}
      <div className="role-banner role-banner--mentor">
        <div className="role-banner-left">
          <span className="role-badge role-badge--mentor">
            <FaUserGraduate /> Mentor
          </span>
          <div>
            <div className="role-banner-name">{user?.name || 'Mentor'}</div>
            <div className="role-banner-tenant">
              <FaUniversity style={{ fontSize: '0.6rem' }} />
              {currentTenant?.name || currentTenant?.code || 'No Institution Selected'}
            </div>
          </div>
        </div>
        <div className="role-banner-right">
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#6d28d9' }}>
            {sessions.length} Sessions Booked
          </span>
        </div>
      </div>

      {/* Service Alert Banner */}
      {(errorMsg || tenantError) && (
        <div className="p-4 neu-card bg-rose-50 border-rose-300 text-rose-800 font-semibold text-xs flex items-center gap-3">
          <FaExclamationTriangle className="text-rose-500 text-lg shrink-0" />
          <div>{errorMsg || tenantError}</div>
        </div>
      )}

      {/* 13 Sub-Page Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-300 text-xs font-bold">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === item.key ? 'neu-chip-active--mentor' : 'neu-chip-inactive'
            }`}
          >
            {item.icon} {item.title}
          </button>
        ))}
      </div>

      {/* Render Active Sub-Page */}
      {activeTab === 'overview' && (
        <MentorOverviewPage sessions={sessions} referrals={referrals} onOpenBooking={() => setShowBooking(true)} />
      )}
      {activeTab === 'scheduler' && <MentorSchedulerPage sessions={sessions} />}
      {activeTab === 'booking' && <MentorSessionBookingPage />}
      {activeTab === 'sandbox' && <MentorSandboxPage />}
      {activeTab === 'feed' && <MentorExperienceFeedPage />}
      {activeTab === 'resume' && <MentorResumeReviewPage />}
      {activeTab === 'directory' && <MentorDirectoryPage />}
      {activeTab === 'qna' && <MentorQnaPage />}
      {activeTab === 'mentee_gps' && <MentorMenteeGpsPage />}
      {activeTab === 'mentee_acc' && <MentorMenteeAcceptancePage />}
      {activeTab === 'referrals' && <MentorReferralsPage />}
      {activeTab === 'profile' && <MentorProfilePage />}
      {activeTab === 'contact' && <MentorContactDeptPage />}

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="p-6 neu-card max-w-md w-full bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-800">Request 1-on-1 Mentorship Session</h3>
            <form onSubmit={handleBookSession} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Session Topic / Goals</label>
                <input 
                  type="text" required
                  placeholder="e.g. Mock Technical System Design & Resume Prep" 
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowBooking(false)} className="neu-btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="neu-btn-primary text-xs font-bold">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorHub;
