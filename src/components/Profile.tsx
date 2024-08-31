import React from 'react';
import { IconChevronRight, IconUser, IconSettings, IconMoonStars, IconLogout } from '@tabler/icons-react';
import { Group, Avatar, Text, Menu, UnstyledButton } from '@mantine/core';
import './Profile.css';
import Link from 'next/link';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const UserButton = React.forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      className="profile-button"
      {...others}
    >
      <Group>
        <Avatar color="blue" radius="xl">ZA</Avatar>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>
          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>
        {icon || <IconChevronRight size="1rem" />}
      </Group>
    </UnstyledButton>
  )
);

const Profile: React.FC = () => {
  return (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <Group className="profile-button" spacing="xs">
          <Avatar color="blue" radius="xl">ZA</Avatar>
          <div>
            <Text size="xs" fw={200}>Zeynep Ayan</Text>
            <Text c="dimmed" size="xs">zeynep.ayan@navlungo.com</Text>
          </div>
          <IconChevronRight size="0.8rem" />
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>User</Menu.Label>
        <Menu.Item component={Link} href="/profile">
          Profile
        </Menu.Item>
        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
        <Menu.Item icon={<IconMoonStars size={14} />}>Dark Mode</Menu.Item>
        <Menu.Divider />
        <Menu.Label>Account</Menu.Label>
        <Menu.Item icon={<IconLogout size={14} />}>Log out</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default Profile;