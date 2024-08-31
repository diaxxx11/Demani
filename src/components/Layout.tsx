import React, { useState, useEffect } from 'react';
import TopSection from './TopSection';
import HomePage from './HomePage';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import CustomCursor from './CustomCursor';

import './Layout.css';
import { useMantineColorScheme } from '@mantine/core';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [posts, setPosts] = useState<PostData[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Fetched data is not an array:', data);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  return (
    <div className="layout">
      <CustomCursor />
      <TopSection refreshPosts={refreshPosts} toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} fetchPosts={fetchPosts} />
      <div className="main-content">
        <LeftSection />
        <main style={{ backgroundColor: 'var(--main-background)' }}>
          {React.cloneElement(children as React.ReactElement, { posts, setPosts, fetchPosts })}
        </main>
        <RightSection />
      </div>
    </div>
  );
};

export default Layout;