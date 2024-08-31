import React, { useState, useEffect } from 'react';
import './TopSection.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Input, Button, ActionIcon, Menu, Avatar, Text, Switch, useMantineTheme, rem } from '@mantine/core';
import { IconBell, IconPlus, IconChevronDown, IconSearch, IconSun, IconMoonStars } from '@tabler/icons-react';
import Profile from './Profile';
import PostModal from './PostModal';



const TopSection: React.FC<{ refreshPosts: () => Promise<void>, toggleColorScheme: () => void, colorScheme: 'light' | 'dark' }> = ({ refreshPosts, toggleColorScheme, colorScheme }) => {
  const theme = useMantineTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      console.log('Fetched posts:', data);
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePostSubmit = async (title: string, content: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, author: 'Zeynep A.', nickname: 'zayan19' }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      await refreshPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const sunIcon = (
    <IconSun
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.yellow[4]}  
    />
  );

  const moonIcon = (
    <IconMoonStars 
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.blue[6]}
    />
  );

  return (
    <header className="top-section">
      <Link href="/" className="logo-link">
        <h1>Demani</h1>
      </Link>
      <form onSubmit={handleSearch}>
      <Input
        icon={<IconSearch size="0.9375rem" />}
        radius="xl"
        placeholder="Search Dems"
        className="search-input"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
      />
    </form>
      <div className="button-group">
        <ActionIcon variant="subtle" color="gray" size="lg">
          <IconBell size="1.2rem" />
        </ActionIcon>
        <PostModal onSubmit={handlePostSubmit} refreshPosts={refreshPosts} fetchPosts={fetchPosts} />        
        <Menu shadow="md" width={200}>
          <Menu.Target>
          <Button variant="subtle" rightSection={<IconChevronDown size="1rem" />}>              
          <Avatar color="blue" radius="md" className="circular-avatar">ZA</Avatar>
          <Text size="sm" ml="xs">Zeynep A.</Text>
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item component={Link} href="/profile">Profile</Menu.Item>
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item>
              <Switch
                size="md"
                color="dark.4"
                onLabel={sunIcon}
                offLabel={moonIcon}
                onChange={toggleColorScheme}
                checked={colorScheme === 'dark'}
              />
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red">Log out</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </header>
  );
};

export default TopSection;