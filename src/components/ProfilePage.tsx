import React, { useState, useEffect } from 'react';
import { Tabs, Avatar, Text } from '@mantine/core';
import Post from './Post';
import './ProfilePage.css';

interface PostData {
  _id: string;
  title: string;
  content: string;
  nickname: string;
  createdAt: Date;
  comments: any[];
  likes: number;
  dislikes: number;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>('posts');
  const [posts, setPosts] = useState<PostData[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostData[]>([]);
  const [commentedPosts, setCommentedPosts] = useState<PostData[]>([]);
  const [nickname, setNickname] = useState<string>('zayan19');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nickname) {
      fetchData(activeTab);
    }
  }, [nickname, activeTab]);


  const fetchData = async (tab: string | null) => {
    setLoading(true);
    setError(null);
    try {
      switch (tab) {
        case 'posts':
          await fetchPosts();
          break;
        case 'comments':
          await fetchCommentedPosts();
          break;
        case 'likes':
          await fetchLikedPosts();
          break;
      }
    } catch (error) {
      console.error(`Failed to fetch ${tab}:`, error);
      setError(`Failed to load ${tab}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    const response = await fetch(`/api/posts?nickname=${nickname}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    const data = await response.json();
    setPosts(data);
  };
  
  const fetchLikedPosts = async () => {
    const response = await fetch(`/api/users/${nickname}/likes`);
    if (!response.ok) throw new Error('Failed to fetch liked posts');
    const data = await response.json();
    setLikedPosts(data);
  };
  
  const fetchCommentedPosts = async () => {
    const response = await fetch(`/api/users/${nickname}/comments`);
    if (!response.ok) throw new Error('Failed to fetch commented posts');
    const data = await response.json();
    setCommentedPosts(data);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!nickname) {
    return <div>Loading...</div>;
  }

  const handleAddComment = async (postId: string, content: string, author: string, parentCommentId?: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, content, author, parentCommentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      // Refresh the current tab data after adding a comment
      await fetchData(activeTab);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Avatar size="xl" radius="xl" />
        <Text size="xl" weight={700}>Zeynep Ayan</Text>
        <Text size="sm" color="dimmed">u/{nickname}</Text>
      </div>
      <Tabs value={activeTab} onTabChange={(value) => setActiveTab(value as string | null)}>
      <Tabs.List>
          <Tabs.Tab value="posts">Posts</Tabs.Tab>
          <Tabs.Tab value="comments">Comments</Tabs.Tab>
          <Tabs.Tab value="likes">Likes</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="posts">
          {posts.map((post) => (
            <Post key={post._id} {...post} onAddComment={() => {}} />
          ))}
          </Tabs.Panel>
  
          <Tabs.Panel value="comments">
            {commentedPosts.map((comment) => (
              <div key={comment._id} className="comment-item">
                <Text size="sm">Commented on: {comment.postTitle}</Text>
                <Text>{comment.content}</Text>
                <Text size="xs" color="dimmed">{new Date(comment.createdAt).toLocaleString()}</Text>
              </div>
            ))}
          </Tabs.Panel>
  
          <Tabs.Panel value="likes">
            {likedPosts.map((post) => (
              <Post key={post._id} {...post} onAddComment={() => {}} />
            ))}
          </Tabs.Panel>
        </Tabs>
      </div>
    );
  };

export default ProfilePage;