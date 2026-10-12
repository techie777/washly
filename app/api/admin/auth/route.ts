import { NextRequest, NextResponse } from 'next/server';
import { getAdminPassword, getAllJrAdmins } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, username, password, phone, pin } = body;

    // Super Admin login
    if (role === 'admin') {
      const correctPassword = getAdminPassword();
      const enteredPassword = (password || '').trim();

      if (!enteredPassword) {
        return NextResponse.json(
          { success: false, message: 'Password is required for Super Admin login.' },
          { status: 400 }
        );
      }

      if (enteredPassword !== correctPassword) {
        return NextResponse.json(
          { success: false, message: 'Incorrect Super Admin password. Please check and re-enter.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        role: 'admin',
        user: {
          name: 'Super Admin Command',
          role: 'admin',
          username: username || 'admin',
        },
        message: 'Super Admin logged in successfully!',
      });
    }

    // Jr Admin login
    if (role === 'jr_admin') {
      const cleanPhone = (phone || '').replace(/\D/g, '');
      const cleanUsername = (username || '').trim().toLowerCase();
      const enteredSecret = (password || pin || '').trim();

      if (!cleanPhone && !cleanUsername) {
        return NextResponse.json(
          { success: false, message: 'Username or WhatsApp phone number is required.' },
          { status: 400 }
        );
      }

      if (!enteredSecret) {
        return NextResponse.json(
          { success: false, message: 'Password or 4-digit PIN is required.' },
          { status: 400 }
        );
      }

      const allJr = getAllJrAdmins();
      const matched = allJr.find(
        (j) =>
          (cleanPhone && j.phone === cleanPhone) ||
          (cleanUsername && j.username?.toLowerCase() === cleanUsername) ||
          (cleanUsername && j.name.toLowerCase() === cleanUsername)
      );

      if (!matched) {
        return NextResponse.json(
          { success: false, message: 'No Jr Admin account found with this username or phone number.' },
          { status: 404 }
        );
      }

      const isPasswordValid =
        (matched.password && matched.password === enteredSecret) ||
        (matched.pin && matched.pin === enteredSecret);

      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Incorrect Password or PIN for this Wash Expert account.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        role: 'jr_admin',
        user: {
          id: matched.id,
          name: matched.name,
          username: matched.username,
          phone: matched.phone,
          vehicleNo: matched.vehicleNo,
          rating: matched.rating,
          status: matched.status,
          totalJobs: matched.totalJobs,
          role: 'jr_admin',
        },
        message: `Welcome back ${matched.name}! Wash Expert workspace loaded.`,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid role specified. Must be 'admin' or 'jr_admin'." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
