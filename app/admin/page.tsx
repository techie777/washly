import React from 'react';
import type { Metadata } from 'next';
import { getAllBookings, getAllJrAdmins } from '@/lib/db';
import SuperAdminDashboard from '@/components/admin/SuperAdminDashboard';

export const metadata: Metadata = {
  title: 'Super Admin Operations Command | Doorstep Car Wash Indore',
  description: 'Central fleet operations, booking review & confirmation, Jr Admin dispatch, customer data, and telemetry.',
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 0;

export default async function AdminPage() {
  const bookings = await getAllBookings();
  const jrAdmins = getAllJrAdmins();

  return (
    <SuperAdminDashboard
      initialBookings={bookings}
      initialJrAdmins={jrAdmins}
    />
  );
}
