import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ post }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        <Link to={`/posts/${post._id}`} className="hover:text-blue-600">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-600 text-sm mb-2">
        By {post.user.username} on {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }}
      ></div>
      <Link to={`/posts/${post._id}`} className="text-blue-500 hover:underline mt-4 inline-block">
        Read More
      </Link>
    </div>
  );
};

export default PostItem;