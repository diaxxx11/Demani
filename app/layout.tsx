'use client';
import '@mantine/core/styles.css';
import '@/styles/globals.css';
import '@/styles/fonts.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { useState } from 'react';
import Layout from '@/components/Layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  const toggleColorScheme = () => {
    setColorScheme(current => (current === 'dark' ? 'light' : 'dark'));
  };

  const theme = createTheme({
    colorScheme,
  });

  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
          <Layout colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            {children}
          </Layout>
        </MantineProvider>
      </body>
    </html>
  );
}