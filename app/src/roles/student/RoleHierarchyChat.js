import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { FaComments, FaPaperPlane, FaUserShield, FaExclamationTriangle, FaBan, FaRobot, FaStar } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function RoleHierarchyChat() {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [lockoutAlert, setLockoutAlert] = useState(null);

  // Fetch users in same tenant
  const fetchTenantUsers = useCallback(async () => {
    if (!currentTenant?.tenantId || !user?.id) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.users) {
        const others = res.data.users.filter(u => (u._id || u.id) !== user.id);
        setUsersList(others);
        if (others.length > 0 && !selectedUser) {
          setSelectedUser(others[0]);
        }
      }
    } catch (e) {
      setErrorMsg('⚠️ Service Currently Unavailable: Backend REST API is offline.');
    }
  }, [currentTenant, user, selectedUser]);

  const fetchMessages = useCallback(async () => {
    if (!currentTenant?.tenantId || !user?.id || !selectedUser) return;
    try {
      const otherId = selectedUser._id || selectedUser.id;
      const res = await axios.get(`${API_BASE_URL}/api/chat/messages?tenantId=${currentTenant.tenantId}&userId=${user.id}&receiverId=${otherId}`);
      if (res.data && res.data.messages) {
        setMessages(res.data.messages);
      }
    } catch (e) {
      console.warn('Chat fetch warning:', e.message);
    }
  }, [currentTenant, user, selectedUser]);

  useEffect(() => {
    fetchTenantUsers();
  }, [fetchTenantUsers]);

  useEffect(() => {
    fetchMessages();
    const timer = setInterval(fetchMessages, 4000);
    return () => clearInterval(timer);
  }, [fetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsgText.trim() || !selectedUser) return;
    setLockoutAlert(null);
    setErrorMsg(null);

    const otherId = selectedUser._id || selectedUser.id;

    try {
      await axios.post(`${API_BASE_URL}/api/chat/messages`, {
        tenantId: currentTenant.tenantId,
        senderId: user?.id || user?._id,
        senderName: user?.name || user?.email?.split('@')[0],
        senderRole: user?.role,
        receiverId: otherId,
        receiverName: selectedUser.name || selectedUser.email.split('@')[0],
        receiverRole: selectedUser.role || '',
        message: newMsgText
      });

      setNewMsgText('');
      fetchMessages();
    } catch (err) {
      if (err.response?.data?.isBlocked || err.response?.status === 403) {
        setLockoutAlert(err.response.data.error || '');
      } else {
        setErrorMsg(err.response?.data?.error || '');
      }
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-purple-500/30 bg-slate-900/90 text-white shadow-2xl space-y-6">
      {/* Service Error / Lockout Alert Banners */}
      {lockoutAlert && (
        <div className="p-4 bg-rose-950/95 border-2 border-rose-500 text-rose-100 rounded-xl font-bold text-xs flex items-center gap-3 shadow-2xl animate-pulse">
          <FaBan className="text-2xl text-rose-400 shrink-0" />
          <div>
            <div className="text-sm font-black uppercase text-rose-300">AI Toxicity Safety Lockout Active</div>
            <div>{lockoutAlert}</div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-amber-950/90 border border-amber-600 text-amber-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-amber-400 shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="p-5 border-l-4 border-purple-500 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 rounded-xl border border-gray-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-950 border border-purple-700 text-purple-300 text-xs font-bold rounded-full uppercase">
              Multi-Tenant Role Hierarchy & Peer Chat Engine
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-white flex items-center gap-2">
            <FaComments className="text-purple-400" /> Multi-Role Communications ({currentTenant?.name})
          </h2>
          <p className="text-xs text-gray-300 mt-1">Tenant-isolated messaging strictly monitored by AI toxicity moderation with automated 3-day lockout penalties.</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-gray-700 rounded-lg text-xs">
          <FaStar className="text-amber-400" />
          <span>My AI Progress Rating: <strong className="text-emerald-400 font-bold">{user?.aiRating !== null && user?.aiRating !== undefined ? `${user.aiRating} / 5.0` : 'Not yet rated'}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
        {/* Left Column: Tenant Users Contact List */}
        <div className="p-4 rounded-xl border border-gray-800 bg-slate-900/80 flex flex-col space-y-3 overflow-hidden">
          <h3 className="text-xs font-bold uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
            <FaUserShield /> Contacts ({currentTenant?.code})
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {usersList.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400 bg-slate-800/40 rounded-lg">No other users registered in this tenant yet.</div>
            ) : (
              usersList.map(u => {
                const uid = u._id || u.id;
                const isSel = (selectedUser?._id || selectedUser?.id) === uid;
                return (
                  <div
                    key={uid}
                    onClick={() => setSelectedUser(u)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${isSel ? 'bg-purple-950/70 border-purple-500 text-white shadow-lg' : 'bg-slate-800/60 border-gray-700 text-gray-300 hover:bg-slate-800'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs">{u.name}</span>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-950 border border-purple-800 text-purple-300 uppercase">{u.role}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">{u.department || u.email}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Conversation Stream */}
        <div className="md:col-span-2 p-4 rounded-xl border border-gray-800 bg-slate-900/80 flex flex-col justify-between space-y-4">
          {selectedUser ? (
            <>
              <div className="pb-3 border-b border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Message: <strong className="text-purple-300">{selectedUser.name}</strong>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 border border-gray-700 text-gray-300 uppercase">{selectedUser.role}</span>
                  </h3>
                  <p className="text-[10px] text-gray-400">{selectedUser.department || selectedUser.email}</p>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <FaRobot /> AI Safety Guard Active
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400 bg-slate-800/30 rounded-lg">
                    No messages yet with {selectedUser.name}. Start the conversation!
                  </div>
                ) : (
                  messages.map(m => {
                    const isMe = m.senderId === user.id;
                    return (
                      <div key={m._id || m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-xl text-xs max-w-sm ${isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-800 text-gray-200 border border-gray-700 rounded-bl-none'} ${m.isFlagged ? 'bg-rose-950 border-2 border-rose-600 text-rose-200' : ''}`}>
                          <div className="text-[10px] font-bold opacity-75 mb-1">{isMe ? 'You' : m.senderName} ({m.senderRole})</div>
                          <p>{m.message}</p>
                          {m.isFlagged && (
                            <span className="text-[9px] font-bold text-rose-400 block mt-1">⚠️ Flagged by AI Safety Moderator</span>
                          )}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-1 font-mono">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-gray-800">
                <input 
                  type="text" 
                  required
                  placeholder={`Type a message to ${selectedUser.name}...`}
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  className="flex-1 bg-slate-800 border border-gray-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md"
                >
                  <FaPaperPlane /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex justify-center items-center text-xs text-gray-400">
              Select a user from the contact list to open chat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleHierarchyChat;
