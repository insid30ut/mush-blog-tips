import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PostForm from '../components/posts/PostForm';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`/api/posts/${id}`, config);
        navigate('/');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Error deleting post');
      }
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    // Re-fetch the post to show updated content
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError('Failed to fetch post after update');
      }
    };
    fetchPost();
  };

  if (loading) return <div className="text-center text-xl">Loading post...</div>;
  if (error) return <div className="text-center text-xl text-red-500">{error}</div>;
  if (!post) return <div className="text-center text-xl">Post not found.</div>;

  const isAuthor = user && post.user && user._id === post.user._id;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {isEditing ? (
        <PostForm post={post} onSuccess={handleUpdateSuccess} />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
          <p className="text-gray-600 text-sm mb-4">
            By {post.user.username} on {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div
            className="prose lg:prose-xl max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          {isAuthor && (
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit Post
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;