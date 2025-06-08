import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PostForm from '../components/posts/PostForm';
import PostItem from '../components/posts/PostItem';

const DashboardPage = () => {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserPosts = async () => {
    if (!user) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/posts', config);
      setUserPosts(data.filter(post => post.user._id === user._id));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user posts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  const handlePostSuccess = () => {
    fetchUserPosts();
  };

  if (loading) return <div className="text-center text-xl">Loading dashboard...</div>;
  if (error) return <div className="text-center text-xl text-red-500">{error}</div>;
  if (!user) return <div className="text-center text-xl">Please log in to view your dashboard.</div>;
  if (!user.isBlogAdmin) return <div className="text-center text-xl text-red-500">You are not authorized to view this dashboard.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Welcome, {user.username}!</h1>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Create New Post</h2>
        <PostForm onSuccess={handlePostSuccess} />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Posts</h2>
        {userPosts.length === 0 ? (
          <p className="text-gray-600">You haven't created any posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {userPosts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;