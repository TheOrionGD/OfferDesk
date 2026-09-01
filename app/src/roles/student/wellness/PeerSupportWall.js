import React, { useState, useEffect, useCallback } from 'react';
import { FaHandsHelping, FaPaperPlane, FaHeart, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { CapacitorService } from '../../../services/capacitorService';
import { useTenant } from '../../../context/TenantContext';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function PeerSupportWall() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchPosts = useCallback(async () => {
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wellness/peer-wall`);
      if (res.data && res.data.posts) {
        setPosts(res.data.posts);
      }
    } catch (e) {
      setErrorMsg('⚠️ Service Disconnected: Unable to fetch peer wall posts. Backend REST API on port 5001 is offline.');
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newMsg) return;
    if (!currentTenant?.tenantId) {
      setErrorMsg('⚠️ Tenant Context Required: Please select an onboarded university tenant.');
      return;
    }
    CapacitorService.triggerHapticPulse();
    try {
      await axios.post(`${API_BASE_URL}/api/wellness/peer-wall`, {
        tenantId: currentTenant.tenantId,
        author: user?.name || user?.email || '',
        authorId: user?.id || user?._id,
        authorRole: user?.role,
        postedBy: user?.name,
        postedByRole: user?.role,
        text: newMsg,
        likes: 1
      });
      setNewMsg('');
      fetchPosts();
    } catch (e) {
      setErrorMsg('⚠️ Failed to post note: Backend REST service is offline.');
    }
  };

  const handleLike = async (id) => {
    CapacitorService.triggerHapticPulse();
    try {
      await axios.post(`${API_BASE_URL}/api/wellness/peer-wall/${id}/like`);
      fetchPosts();
    } catch (e) {
      setErrorMsg('⚠️ Failed to like post: Backend REST service is offline.');
    }
  };

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-slate-900/90 text-white shadow-xl space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-950/90 border border-rose-600 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <FaExclamationTriangle className="text-rose-400 text-base shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      <div className="flex justify-between items-center flex-wrap gap-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-950 border border-indigo-700 rounded-xl text-indigo-400">
            <FaHandsHelping className="text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Peer Encouragement & Motivation Wall</h3>
            <p className="text-xs text-gray-400">Moderated positive community wall to eliminate toxic placement stress</p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-slate-800 border border-gray-700 text-gray-300 text-xs rounded font-semibold flex items-center gap-1">
          <FaShieldAlt className="text-indigo-400" /> Moderated Peer Environment
        </span>
      </div>

      <form onSubmit={handlePost} className="flex gap-2">
        <input 
          type="text" 
          placeholder="Share encouragement, drive tips, or positive vibes..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1 bg-slate-800 border border-gray-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button 
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-md"
        >
          <FaPaperPlane /> Post Note
        </button>
      </form>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 bg-slate-800/40 rounded-xl">No peer wall notes posted yet. Be the first to share an encouraging note!</div>
        ) : (
          posts.map(post => (
            <div key={post._id || post.id} className="p-4 rounded-xl bg-slate-800/60 border border-gray-700/80">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-indigo-300">{post.author}</span>
                <span className="text-[10px] text-gray-400 font-mono">{new Date(post.timestamp || Date.now()).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-gray-200 mb-3">{post.text}</p>
              <button 
                onClick={() => handleLike(post._id || post.id)}
                className="flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-semibold bg-pink-950/40 border border-pink-800 px-2.5 py-1 rounded-full"
              >
                <FaHeart /> {post.likes} Support Encouragements
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PeerSupportWall;
