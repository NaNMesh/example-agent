import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'nanmesh-example-agent',
  description: 'Demo agent for nanmesh-check GitHub Action.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
