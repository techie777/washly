import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Login | Washly Doorstep Car Care',
  description: 'Log in to your Washly doorstep car and bike care account in Indore to view past washes and quick re-book.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
