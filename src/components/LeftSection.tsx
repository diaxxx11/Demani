import React from 'react';
import './LeftSection.css';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs } from '@mantine/core';

const LeftSection: React.FC = () => {
  return (
    <aside className="left-section">
      <Tabs defaultValue="home" orientation="vertical" classNames={{
        tab: 'custom-tab',
        tabLabel: 'custom-tab-label',
      }}>
        <Tabs.List>
          <Tabs.Tab value="home" leftSection={<Image src="/home.png" alt="Home" width={15} height={15} />}>
            <Link href="/">Home</Link>
          </Tabs.Tab>
          <Tabs.Tab value="popular" leftSection={<Image src="/popular.png" alt="Popular" width={15} height={15} />}>
            <Link href="/popular">Popular</Link>
          </Tabs.Tab>
          <Tabs.Tab value="explore" leftSection={<Image src="/explore.png" alt="Explore" width={15} height={15} />}>
            <Link href="/explore">Explore</Link>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </aside>
  );
};

export default LeftSection;