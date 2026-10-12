import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Live Mobile Van | Washly Doorstep Car Care',
  description: 'Track your mobile car wash van live in Indore. Real-time updates, technician details, and Start OTP verification.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
