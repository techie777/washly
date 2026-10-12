import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account & Bookings | Washly Doorstep Car Care',
  description: 'Manage your doorstep car wash bookings, vehicles, and wash history with Washly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
