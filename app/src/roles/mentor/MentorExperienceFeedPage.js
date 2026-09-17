import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "../../context/TenantContext";
import { useAuth } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

export function MentorExperienceFeedPage() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchPosts = useCallback(async () => {
    if (!currentTenant?.tenantId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/notices?tenantId=${currentTenant.tenantId}`);
      if (res.data && res.data.notices) {
        const mapped = res.data.notices.map((n, idx) => ({
          id: n._id || n.id || idx,
          // Only use fields that exist in the database record
          author: n.postedBy || "",
          title: n.title,
          content: n.content,
          postedAt: n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-IN") : "",
        }));
        setPosts(mapped);
      } else {
        setPosts([]);
      }
    } catch (e) {
      console.error("Failed to fetch experience feed:", e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [currentTenant, API_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    const optimistic = {
      id: Date.now().toString(),
      author: user?.name || "",
      title: newPost.title,
      content: newPost.content,
      postedAt: new Date().toLocaleDateString("en-IN"),
    };
    // Optimistic update — add to UI immediately
    setPosts((prev) => [optimistic, ...prev]);
    setNewPost({ title: "", content: "" });

    try {
      await axios.post(`${API_URL}/api/notices`, {
        tenantId: currentTenant.tenantId,
        title: newPost.title,
        content: newPost.content,
        category: "INSIGHT",
        postedBy: user?.name,
        postedByRole: user?.role,
      });
      fetchPosts(); // refresh to get server-assigned id
    } catch (e) {
      // Optimistic post already visible; silently keep it
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <span className="neu-chip-active">PAGE 5 OF 11 • EXPERIENCE FEED</span>
        <h1 className="text-xl font-bold text-slate-800 mt-1">Career Insights &amp; Experience Feed</h1>
        <p className="text-xs text-slate-500">
          Share corporate interview tips &amp; industry trends with students of {currentTenant?.name || "your institution"}
        </p>

        <form onSubmit={handleCreatePost} className="p-4 neu-card space-y-3">
          <input
            type="text"
            required
            placeholder="Insight Title (e.g. How I cracked the Amazon SDE Interview)"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
          />
          <textarea
            rows={3}
            required
            placeholder="Share your key takeaways, tips, and prep advice for students..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full neu-input p-3 text-xs font-semibold focus:outline-none"
          />
          <button type="submit" className="neu-btn-primary text-xs font-bold flex items-center gap-2">
            <FaPlus /> Post Insight
          </button>
        </form>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold animate-pulse">Loading experience feed...</div>
        ) : posts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 font-semibold neu-card">
            No insights shared yet. Be the first to post above!
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {posts.map((p) => (
              <div key={p.id} className="p-5 neu-card space-y-2">
                <h4 className="text-sm font-bold text-slate-800">{p.title}</h4>
                <p className="text-xs text-slate-600">{p.content}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  {p.author && <>Posted by: {p.author}</>}
                  {p.author && p.postedAt && " · "}
                  {p.postedAt}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorExperienceFeedPage;
