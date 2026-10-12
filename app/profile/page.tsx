'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  ShoppingBag, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Navigation, 
  Save, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  Plus,
  Sparkles,
  Copy,
  Check,
  Languages,
  ChevronRight,
  ChevronDown,
  Bike,
  Truck,
  RefreshCw,
  Star,
  KeyRound,
  Bell
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useTranslation } from '@/lib/translations';
import { useLanguageStore } from '@/lib/store/languageStore';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { Booking } from '@/types';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'orders' | 'profile' | 'support') || 'orders';

  const { user, isLoggedIn, logout, updateUser } = useAuthStore();
  const { t, isHindi } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { addToast } = useNotificationStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'support'>(initialTab);

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders' || tab === 'profile' || tab === 'support') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<'today' | 'week' | 'all'>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Rating & Review states for completed bookings
  const [ratingCardId, setRatingCardId] = useState<string | null>(null);
  const [activeStarRating, setActiveStarRating] = useState<number>(5);
  const [hoverStarRating, setHoverStarRating] = useState<number>(0);
  const [commentNote, setCommentNote] = useState<string>('');
  const [isSavingRating, setIsSavingRating] = useState<boolean>(false);

  const toggleExpandCard = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const handleOpenRating = (b: Booking) => {
    if (ratingCardId === b.bookingId) {
      setRatingCardId(null);
    } else {
      setRatingCardId(b.bookingId);
      setActiveStarRating(b.rating || 5);
      setHoverStarRating(0);
      setCommentNote(b.reviewComment || '');
    }
  };

  const handleSelectStar = (bookingId: string, stars: number) => {
    setActiveStarRating(stars);
    try {
      const ratedAt = new Date().toISOString();
      const existing = bookings.find((b) => b.bookingId === bookingId);
      const note = existing?.reviewComment || commentNote;

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `doorstep_rating_${bookingId}`,
          JSON.stringify({ rating: stars, comment: note, ratedAt })
        );
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId
            ? { ...b, rating: stars, reviewComment: note, ratedAt }
            : b
        )
      );

      fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: stars, reviewComment: note }),
      }).catch(() => {});

      addToast({
        title: isHindi ? `${stars} स्टार रेटिंग दर्ज हुई` : `${stars}-Star Rating Saved`,
        message: isHindi
          ? 'आप नीचे एक समीक्षा नोट या टिप्पणी भी लिख सकते हैं।'
          : 'You can also add a comment note below.',
        type: 'success',
        duration: 3000,
      });
    } catch {}
  };

  const handleSaveCommentNote = async (bookingId: string) => {
    setIsSavingRating(true);
    try {
      const ratedAt = new Date().toISOString();
      const note = commentNote.trim();

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `doorstep_rating_${bookingId}`,
          JSON.stringify({ rating: activeStarRating, comment: note, ratedAt })
        );
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId
            ? { ...b, rating: activeStarRating, reviewComment: note, ratedAt }
            : b
        )
      );

      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: activeStarRating, reviewComment: note }),
      });

      setRatingCardId(null);

      addToast({
        title: isHindi ? 'समीक्षा सुरक्षित हुई' : 'Review Note Saved',
        message: isHindi
          ? 'आपकी रेटिंग और समीक्षा सुरक्षित हो गई है। धन्यवाद!'
          : 'Your rating and review note have been saved. Thank you!',
        type: 'success',
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingRating(false);
    }
  };

  // Filter helper functions (checks both scheduledDate and placed/createdAt date)
  const isMatchToday = (b: Booking) => {
    const today = new Date();
    const todayStr = today.toDateString();
    const isSched = new Date(b.scheduledDate).toDateString() === todayStr;
    const isCreated = b.createdAt ? new Date(b.createdAt).toDateString() === todayStr : false;
    return isSched || isCreated;
  };

  const isMatchWeek = (b: Booking) => {
    const today = new Date();
    const bd = new Date(b.scheduledDate);
    const diff = (today.getTime() - bd.getTime()) / (1000 * 60 * 60 * 24);
    const isSchedWeek = diff <= 7 && diff >= -7;
    const createdDiff = b.createdAt ? (today.getTime() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24) : 999;
    const isCreatedWeek = createdDiff <= 7 && createdDiff >= 0;
    return isSchedWeek || isCreatedWeek;
  };

  // Filtered bookings based on active chip
  const filteredBookings = bookings.filter((b) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'today') return isMatchToday(b);
    if (orderFilter === 'week') return isMatchWeek(b);
    return true;
  });

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Auto-recover session if customer placed a booking but user is not in state
  useEffect(() => {
    if (!user?.phone && typeof window !== 'undefined') {
      try {
        const lastPhone = localStorage.getItem('doorstep_last_customer_phone');
        if (lastPhone) {
          const clean = lastPhone.replace(/\D/g, '').slice(-10);
          useAuthStore.getState().login({
            name: 'Doorstep Customer',
            phone: clean,
            pin: '1234',
            email: '',
          });
        }
      } catch {}
    }
  }, [user?.phone]);

  // Fetch bookings when user is present
  useEffect(() => {
    if (user?.phone) {
      setName(user.name || '');
      setEmail(user.email || '');
      fetchCustomerData(user.phone);
    }
  }, [user?.phone]);

  const fetchCustomerData = async (phone: string, showToast = false) => {
    setIsLoadingBookings(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '').slice(-10);
      let recentIds: string[] = [];
      let lastBookingId = '';
      try {
        recentIds = JSON.parse(localStorage.getItem('doorstep_recent_bookings') || '[]');
        lastBookingId = localStorage.getItem('doorstep_last_booking_id') || '';
      } catch {}

      const recentQuery = recentIds.length > 0 ? `&recentIds=${recentIds.join(',')}` : '';
      const res = await fetch(`/api/customer/profile?phone=${cleanPhone}${recentQuery}`);
      const data = await res.json();

      let fetchedBookings: Booking[] = [];
      if (data.success && Array.isArray(data.bookings)) {
        fetchedBookings = data.bookings;
      }

      // Direct fallback: if lastBookingId was placed in this browser but not in fetched list, fetch it
      if (lastBookingId && !fetchedBookings.some((b) => b.bookingId === lastBookingId)) {
        try {
          const singleRes = await fetch(`/api/bookings/${lastBookingId}`);
          const singleData = await singleRes.json();
          if (singleData.success && singleData.booking) {
            fetchedBookings = [singleData.booking, ...fetchedBookings];
          }
        } catch {}
      }

      // Attach any locally saved ratings and reviews
      if (typeof window !== 'undefined') {
        fetchedBookings = fetchedBookings.map((b) => {
          if (!b.rating) {
            try {
              const saved = localStorage.getItem(`doorstep_rating_${b.bookingId}`);
              if (saved) {
                const parsed = JSON.parse(saved);
                return {
                  ...b,
                  rating: parsed.rating || b.rating,
                  reviewComment: parsed.comment !== undefined ? parsed.comment : b.reviewComment,
                  ratedAt: parsed.ratedAt || b.ratedAt,
                };
              }
            } catch {}
          }
          return b;
        });
      }

      setBookings(fetchedBookings);

      if (data.profile?.name && (!user?.name || user.name === 'Doorstep Customer')) {
        updateUser({ name: data.profile.name, email: data.profile.email });
      }

      if (showToast) {
        addToast({
          title: isHindi ? 'बुकिंग सूची ताज़ा की गई' : 'Bookings Refreshed',
          message: isHindi 
            ? `कुल ${fetchedBookings.length} बुकिंग डेटा सिंक और अप-टू-डेट है।` 
            : `${fetchedBookings.length} booking(s) synced and up to date.`,
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleCopyBookingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast({
      title: isHindi ? 'बुकिंग आईडी कॉपी हुई' : 'Booking ID Copied',
      message: `#${id}`,
      type: 'info',
      duration: 2500,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.phone) return;

    setIsSavingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateUser({ name: name.trim(), email: email.trim() });
        setProfileSuccessMsg(isHindi ? 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!');
        addToast({
          title: isHindi ? 'प्रोफ़ाइल सहेजी गई' : 'Profile Updated',
          message: isHindi ? 'आपका नाम व विवरण अपडेट हो गया है।' : 'Your contact details have been updated.',
          type: 'success',
        });
        setTimeout(() => setProfileSuccessMsg(''), 4000);
      } else {
        setProfileErrorMsg(data.message || (isHindi ? 'अपडेट विफल रहा' : 'Update failed'));
        addToast({
          title: isHindi ? 'अपडेट विफल' : 'Update Failed',
          message: data.message || 'Error saving changes',
          type: 'error',
        });
      }
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Network error while updating profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // If not logged in, prompt customer to login
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {isHindi ? 'ग्राहक खाता लॉगिन' : 'Customer Account Access'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            {isHindi 
              ? 'अपनी बुकिंग देखने और प्रोफाइल प्रबंधित करने के लिए अपने व्हाट्सएप नंबर व 4-अंकों के पिन से लॉगिन करें।' 
              : 'Log in with your WhatsApp number & 4-digit PIN to manage your bookings and profile.'}
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full py-3 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/40 font-bold text-sm transition-colors shadow-xs"
            >
              {isHindi ? 'व्हाट्सएप व पिन से लॉगिन करें' : 'Sign In with WhatsApp & PIN'}
            </Link>
            <Link
              href="/track"
              className="block w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              {isHindi ? 'बुकिंग आईडी से गाड़ी ट्रैक करें' : 'Track single wash using Booking ID'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{isHindi ? 'समीक्षा में (लंबित)' : 'Review Pending'}</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{t.orderStatusConfirmed}</span>
          </span>
        );
      case 'en_route':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950 text-amber-400 border border-amber-400/40 animate-pulse shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{isHindi ? 'रास्ते में है (On My Way)' : t.orderStatusEnRoute}</span>
          </span>
        );
      case 'arrived':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{isHindi ? 'वैन पहुँच गई है (Arrived)' : 'Van Arrived'}</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{t.orderStatusLive}</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t.orderStatusCompleted}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{t.orderStatusCancelled}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  const getTranslatedServiceInfo = (serviceName: string) => {
    const s = (serviceName || '').toLowerCase();
    
    if (s.includes('complete') || (s.includes('vacuum') && s.includes('rotator'))) {
      return {
        name: isHindi ? 'कम्प्लीट लग्जरी वॉश + वैक्यूम + रोटेटर शाइन' : 'Complete Wash + Interior Vacuum + Rotator Shine',
        features: isHindi 
          ? ['हाई-प्रेशर बॉडी वॉश', 'इंटीरियर डीप वैक्यूम', 'मशीन रोटेटर शाइन', 'फ्री कार परफ्यूम स्प्रे']
          : ['High-Pressure Jet Wash', 'Interior Deep Vacuum', 'Rotator Machine Shine', 'Free Car Freshener'],
        badge: isHindi ? 'सर्वश्रेष्ठ पैक' : 'Best Seller'
      };
    }
    if (s.includes('rotator') || (s.includes('shampoo') && s.includes('shine'))) {
      return {
        name: isHindi ? 'प्रेशर वॉश + शैम्पू व रोटेटर शाइन' : 'Pressure Wash + Shampoo & Rotator Shine',
        features: isHindi
          ? ['जेट प्रेशर वॉश', 'गाढ़ा एक्टिव शैम्पू', 'रोटेटर शाइन', 'टायर ड्रेसिंग']
          : ['Jet Pressure Wash', 'Active Foam Shampoo', 'Rotator Machine Shine', 'Tyre Dressing'],
        badge: isHindi ? 'बेस्ट वैल्यू' : 'Best Value'
      };
    }
    if (s.includes('pressure') && s.includes('bike')) {
      return {
        name: isHindi ? 'बाइक प्रेशर वॉश' : 'Bike Pressure Wash',
        features: isHindi
          ? ['जेट प्रेशर वॉश', 'इंजन व मडगार्ड सफाई', 'माइक्रोफाइबर वाइप']
          : ['Jet Pressure Wash', 'Engine & Mudguard Cleaning', 'Microfiber Wipe'],
        badge: isHindi ? 'पॉपुलर' : 'Popular'
      };
    }
    if (s.includes('bike') && (s.includes('detail') || s.includes('chain') || s.includes('lube'))) {
      return {
        name: isHindi ? 'बाइक फुल डिटेल + चेन लूब' : 'Bike Full Detail + Chain Lube',
        features: isHindi
          ? ['प्रेशर वॉश', 'फोम शैम्पू', 'चेन लूब्रिकेशन', 'पॉलिश']
          : ['Pressure Wash', 'Foam Shampoo', 'Chain Lubrication', 'Polish'],
        badge: isHindi ? 'फुल सर्विस' : 'Full Service'
      };
    }
    if (s.includes('bike')) {
      return {
        name: isHindi ? 'बाइक साधारण धुलाई' : 'Bike Basic Wash',
        features: isHindi
          ? ['पानी से धुलाई', 'माइक्रोफाइबर सफाई', 'टायर वाइप']
          : ['Water Wash', 'Microfiber Wipe', 'Tyre Wipe'],
        badge: isHindi ? 'किफायती' : 'Budget'
      };
    }
    if (s.includes('pressure') || s.includes('jet')) {
      return {
        name: isHindi ? 'कार प्रेशर वॉश' : 'Car Pressure Wash',
        features: isHindi
          ? ['हाई-प्रेशर जेट वॉश', 'कीचड़ व मैल सफाई', 'ग्लास वाइप', 'टायर क्लीन']
          : ['High Pressure Jet', 'Mud & Dirt Removal', 'Glass Wipe', 'Tyre Clean'],
        badge: isHindi ? 'पॉपुलर' : 'Popular'
      };
    }
    if (s.includes('bucket') || s.includes('hand')) {
      return {
        name: isHindi ? 'कार बकेट वॉश' : 'Car Bucket Wash',
        features: isHindi
          ? ['सॉफ्ट स्पंज हाथ धुलाई', 'माइक्रोफाइबर वाइप', 'पानी की बचत']
          : ['Soft Sponge Hand Wash', 'Microfiber Wipe', 'Water Saver'],
        badge: isHindi ? 'किफायती' : 'Budget'
      };
    }
    return {
      name: serviceName,
      features: [],
      badge: undefined
    };
  };

  const formatBookingDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const today = new Date();
      if (d.toDateString() === today.toDateString()) {
        return isHindi ? 'आज (Today)' : 'Today';
      }
      return d.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatPlacedTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-2 sm:pt-4 pb-16 px-3 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Tab 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-2.5 sm:space-y-3">
            {/* Header + Refresh + Quick Book */}
            <div className="flex items-center justify-between gap-2 px-1">
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {t.ordersHeading}
                </h1>
                <p className="text-[11px] text-slate-500">
                  {isHindi ? 'अपनी वर्तमान व पिछली सभी कार धुलाई बुकिंग देखें' : 'View your active and past wash appointments'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchCustomerData(user.phone, true)}
                  disabled={isLoadingBookings}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isLoadingBookings ? 'animate-spin' : ''}`} />
                  <span>{t.refreshBtn}</span>
                </button>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/30 text-xs font-bold transition-colors shadow-xs shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'नई बुकिंग' : '+ Book Wash'}</span>
                </Link>
              </div>
            </div>

            {/* Filter Chips - Compact 3-Option Segmented Control (Zero horizontal scroll/overflow) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {(['today', 'week', 'all'] as const).map((f) => {
                const label = f === 'today'
                  ? (isHindi ? 'आज' : "Today")
                  : f === 'week'
                  ? (isHindi ? '7 दिन' : '7 Days')
                  : (isHindi ? 'सभी बुकिंग' : 'All Bookings');
                const count = f === 'all'
                  ? bookings.length
                  : bookings.filter((b) => (f === 'today' ? isMatchToday(b) : isMatchWeek(b))).length;
                const isActive = orderFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 border-slate-950 text-amber-400 shadow-xs font-black'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                      isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-600'
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Arrival / En Route Alert Banners for Customer */}
            {bookings.some((b) => b.status === 'arrived') && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center font-black shrink-0 shadow-sm">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm sm:text-base">
                      {isHindi ? '🚨 वाश एक्सपर्ट आपके पते पर पहुँच चुके हैं!' : '🚨 Wash Expert Has Arrived at Doorstep!'}
                    </h4>
                    <p className="text-xs text-amber-100">
                      {isHindi ? 'धुलाई शुरू करने के लिए अपना Start OTP एक्सपर्ट को बताएं:' : 'Share your Start OTP with technician to start washing:'}
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/40 self-center sm:self-auto text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider block text-amber-100">
                    {isHindi ? 'स्टार्ट OTP' : 'Start OTP'}
                  </span>
                  <span className="font-mono text-2xl font-black text-white tracking-widest">
                    {bookings.find((b) => b.status === 'arrived')?.startOtp || '1234'}
                  </span>
                </div>
              </div>
            )}

            {isLoadingBookings ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center text-slate-500 text-xs sm:text-sm shadow-xs flex flex-col items-center justify-center">
                <RefreshCw className="w-6 h-6 text-amber-600 animate-spin mb-2" />
                <span>{isHindi ? 'आपकी बुकिंग लोड हो रही हैं...' : 'Loading your bookings...'}</span>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {bookings.length > 0 ? (isHindi ? 'इस फ़िल्टर में कोई बुकिंग नहीं' : 'No bookings in this filter') : t.noOrdersTitle}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  {t.noOrdersSub}
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/40 font-bold text-xs shadow-xs transition-colors"
                >
                  <span>{t.bookNewWashBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              filteredBookings.map((booking) => {
                const svcInfo = getTranslatedServiceInfo(booking.service?.name || '');
                const isCod = (booking.paymentMethod || '').toLowerCase() === 'cod';
                const isPaid = (booking.paymentStatus || '').toLowerCase() === 'paid';
                const isExpanded = expandedCardId === booking.bookingId;
                const isBike = Boolean(
                  booking.vehicle.type?.toLowerCase().includes('bike') ||
                  booking.vehicle.type?.toLowerCase().includes('scooter') ||
                  booking.vehicle.type?.toLowerCase().includes('two_wheeler')
                );

                return (
                  <div
                    key={booking.bookingId}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 hover:shadow-xs transition-all overflow-hidden"
                  >
                    {/* Compact Card View */}
                    <div className="p-3 sm:p-4">
                      
                      {/* Row 1: Vehicle, Plate, Package, Price, Status Badge */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-950 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                            {isBike ? (
                              <Bike className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            ) : (
                              <Car className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {booking.vehicle.make} {booking.vehicle.model}
                              </h3>
                              {booking.vehicle.plateNumber && (
                                <span className="px-1.5 py-0.2 rounded border border-slate-200 bg-slate-50 font-mono font-bold text-[10px] text-slate-700">
                                  {booking.vehicle.plateNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] sm:text-xs font-semibold text-amber-800 truncate mt-0.5">
                              {svcInfo.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-xs sm:text-sm font-black text-slate-900">
                            ₹{booking.totalAmount}
                          </span>
                          <div className="mt-0.5 scale-90 sm:scale-95 origin-right">
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Schedule date/time, short address, and inline Start OTP if active */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600 py-1.5 px-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-2.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800 shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          {formatBookingDate(booking.scheduledDate)}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 text-slate-600 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {booking.timeSlot}
                        </span>
                        <span className="text-slate-300 hidden xs:inline">•</span>
                        <span className="inline-flex items-center gap-1 text-slate-600 truncate max-w-[150px] sm:max-w-[240px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{booking.address.street}, {booking.address.city}</span>
                        </span>

                        {/* High-priority Compact Start OTP Chip (when confirmed / en_route / arrived) */}
                        {booking.startOtp && ['confirmed', 'en_route', 'arrived'].includes(booking.status) && (
                          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] shrink-0">
                            <KeyRound className="w-3 h-3 text-amber-600" />
                            <span>OTP: <strong className="font-mono text-xs">{booking.startOtp}</strong></span>
                          </span>
                        )}
                      </div>

                      {/* Row 3: Action Toolbar (Booking ID, Quick Call, Track Van, Details toggle) */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-500">
                            #{booking.bookingId}
                          </span>
                          <button
                            onClick={() => handleCopyBookingId(booking.bookingId)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                            title={t.orderCopyId}
                          >
                            {copiedId === booking.bookingId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {/* Quick Call if Technician assigned and on way / arrived */}
                          {booking.assignedTechnician && ['en_route', 'arrived', 'in_progress'].includes(booking.status) && (
                            <a
                              href={`tel:${booking.assignedTechnician.phone}`}
                              className="inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                              title={t.orderCallDriver}
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span className="hidden xs:inline">{isHindi ? 'कॉल' : 'Call'}</span>
                            </a>
                          )}

                          {/* Track Van CTA or Completed Wash Rating Option */}
                          {booking.status === 'completed' ? (
                            booking.rating ? (
                              <button
                                type="button"
                                onClick={() => handleOpenRating(booking)}
                                className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs shadow-2xs hover:bg-amber-100 transition-colors"
                                title={booking.reviewComment ? `"${booking.reviewComment}"` : (isHindi ? 'समीक्षा नोट देखें या बदलें' : 'View or edit review note')}
                              >
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3 h-3 ${
                                        s <= (booking.rating || 0)
                                          ? 'fill-amber-400 text-amber-500'
                                          : 'text-slate-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] font-black text-amber-900 ml-0.5">
                                  {booking.rating}/5
                                </span>
                                {booking.reviewComment && (
                                  <MessageSquare className="w-3 h-3 text-amber-700 ml-0.5" />
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenRating(booking)}
                                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-2xs transition-all animate-pulse"
                              >
                                <Star className="w-3.5 h-3.5 fill-white text-white" />
                                <span>{isHindi ? 'रेटिंग दें' : 'Rate Wash'}</span>
                              </button>
                            )
                          ) : (
                            <Link
                              href={`/track?id=${booking.bookingId}`}
                              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/30 font-bold text-xs shadow-2xs transition-colors"
                            >
                              <Navigation className="w-3 h-3 animate-pulse" />
                              <span>{t.orderTrackBtn}</span>
                            </Link>
                          )}

                          {/* Accordion Toggle: Details / विवरण */}
                          <button
                            onClick={() => toggleExpandCard(booking.bookingId)}
                            className="inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                          >
                            <span>{isExpanded ? (isHindi ? 'कम करें' : 'Less') : (isHindi ? 'विवरण' : 'Details')}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* COMPLETED WASH: Star Rating Selection & Comment Note Form */}
                      {booking.status === 'completed' && ratingCardId === booking.bookingId && (
                        <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 border border-amber-200 text-xs animate-in fade-in duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800 flex items-center gap-1.5">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                              <span>{isHindi ? 'कार वॉश अनुभव को रेटिंग दें:' : 'Rate Your Wash Experience:'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setRatingCardId(null)}
                              className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
                            >
                              ✕
                            </button>
                          </div>

                          {/* 5 Interactive Stars */}
                          <div className="flex items-center gap-1.5 mb-2.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleSelectStar(booking.bookingId, star)}
                                onMouseEnter={() => setHoverStarRating(star)}
                                onMouseLeave={() => setHoverStarRating(0)}
                                className="p-1 hover:scale-125 active:scale-95 transition-transform"
                                title={`${star} Star`}
                              >
                                <Star
                                  className={`w-6 h-6 transition-colors ${
                                    star <= (hoverStarRating || activeStarRating)
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'text-slate-300 hover:text-amber-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-black text-amber-900 ml-1.5">
                              {activeStarRating > 0 ? (
                                activeStarRating === 5 ? (isHindi ? 'शानदार (5/5)' : 'Excellent (5/5)') :
                                activeStarRating === 4 ? (isHindi ? 'बहुत अच्छा (4/5)' : 'Very Good (4/5)') :
                                activeStarRating === 3 ? (isHindi ? 'अच्छा (3/5)' : 'Good (3/5)') :
                                activeStarRating === 2 ? (isHindi ? 'औसत (2/5)' : 'Fair (2/5)') :
                                (isHindi ? 'सुधार चाहिए (1/5)' : 'Poor (1/5)')
                              ) : ''}
                            </span>
                          </div>

                          {/* Comment Note Input */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 block">
                              {isHindi ? 'समीक्षा नोट / फीडबैक लिखें (वैकल्पिक):' : 'Add a Review Note or Comment (Optional):'}
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                value={commentNote}
                                onChange={(e) => setCommentNote(e.target.value)}
                                placeholder={
                                  isHindi
                                    ? 'उदा. शानदार सफाई, समय पर वैन पहुंची, उत्तम सेवा...'
                                    : 'e.g. Great car shine, polite technician, arrived on time...'
                                }
                                className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveCommentNote(booking.bookingId);
                                  }
                                }}
                              />
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveCommentNote(booking.bookingId)}
                                  disabled={isSavingRating}
                                  className="flex-1 sm:flex-initial px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs shrink-0"
                                >
                                  {isSavingRating ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    isHindi ? 'नोट सेव करें' : 'Save Note'
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRatingCardId(null)}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                                >
                                  {isHindi ? 'बंद करें' : 'Close'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* COMPLETED WASH: Fixed Rating Stars Display with Comment Note */}
                      {booking.status === 'completed' && booking.rating && ratingCardId !== booking.bookingId && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 mb-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= booking.rating!
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                              <span className="text-xs font-black text-amber-900 ml-1">
                                {booking.rating}/5
                              </span>
                              <span className="text-[10px] text-amber-700 font-semibold">
                                • {isHindi ? 'फिक्स्ड रेटिंग' : 'Fixed Rating'}
                              </span>
                            </div>
                            {booking.reviewComment ? (
                              <p className="text-xs text-slate-700 italic truncate sm:text-clip mt-0.5">
                                &ldquo;{booking.reviewComment}&rdquo;
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {isHindi ? 'कोई टिप्पणी नोट नहीं जोड़ा गया' : 'No comment note added'}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenRating(booking)}
                            className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline shrink-0 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3 text-amber-700" />
                            <span>{booking.reviewComment ? (isHindi ? 'नोट बदलें' : 'Edit Note') : (isHindi ? '+ नोट जोड़ें' : '+ Add Note')}</span>
                          </button>
                        </div>
                      )}

                      {/* COMPLETED WASH: Unrated Quick Rate Strip */}
                      {booking.status === 'completed' && !booking.rating && ratingCardId !== booking.bookingId && (
                        <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 flex items-center justify-between gap-2">
                          <span className="text-xs text-amber-950 font-medium flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                            <span>{isHindi ? 'धुलाई पूर्ण हुई! रेटिंग दें:' : 'Wash completed! Rate experience:'}</span>
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  handleOpenRating(booking);
                                  handleSelectStar(booking.bookingId, s);
                                }}
                                className="p-0.5 hover:scale-125 transition-transform"
                                title={`Rate ${s} stars`}
                              >
                                <Star className="w-4 h-4 text-amber-400 hover:fill-amber-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Accordion Drawer: Full Details (shown on click) */}
                    {isExpanded && (
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-3 bg-slate-50/70 border-t border-slate-100 space-y-2.5 text-xs">
                        
                        {/* Complete Address */}
                        <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-700 block mb-0.5">{t.orderAddress}:</span>
                            <span className="text-slate-600">{booking.address.street}, {booking.address.city} - {booking.address.pincode}</span>
                            {booking.address.landmark && (
                              <span className="block text-slate-500 text-[11px] mt-0.5">
                                {t.orderLandmarkLabel}: {booking.address.landmark}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Package Features Checklist */}
                        {svcInfo.features && svcInfo.features.length > 0 && (
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                            <span className="font-bold text-slate-700 block mb-1.5">
                              {isHindi ? 'शामिल सेवाएं (Features):' : 'Included Service Features:'}
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                              {svcInfo.features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] text-slate-700">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                                  <span className="truncate">{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Assigned Specialist Contact Card */}
                        {booking.assignedTechnician && (
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {booking.assignedTechnician.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-slate-900">{booking.assignedTechnician.name}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                                    <span>{booking.assignedTechnician.rating}</span>
                                    <span>• {t.orderVerifiedTag}</span>
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600">
                                  {isHindi ? 'वैन यूनिट:' : 'Van Unit:'} {booking.assignedTechnician.vehicleNo}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${booking.assignedTechnician.phone}`}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{t.orderCallDriver}</span>
                              </a>
                              <a
                                href={`https://wa.me/${booking.assignedTechnician.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  isHindi
                                    ? `नमस्ते, मेरी कार वॉश बुकिंग ID ${booking.bookingId} के बारे में जानकारी चाहिए।`
                                    : `Hi, I am inquiring about my car wash booking ID ${booking.bookingId}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Payment & Placed Timestamp */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">{t.orderPayment}:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800">{isCod ? t.orderCodLabel : t.orderOnlineLabel}</span>
                              <span className={`px-1.5 py-0.2 rounded-full font-bold text-[10px] ${
                                isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {isPaid ? t.orderPaidBadge : t.orderPendingBadge}
                              </span>
                            </div>
                          </div>

                          {booking.createdAt && (
                            <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">{isHindi ? 'बुकिंग का समय:' : 'Placed At:'}</span>
                              <span className="font-semibold text-slate-700">{formatPlacedTime(booking.createdAt)}</span>
                            </div>
                          )}
                        </div>

                        {/* Customer Rating & Review Display inside Accordion */}
                        {booking.status === 'completed' && booking.rating && (
                          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span>{isHindi ? 'आपकी दी गई रेटिंग व समीक्षा:' : 'Your Rating & Review:'}</span>
                              </span>
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                                {booking.rating} / 5 Stars
                              </span>
                            </div>
                            {booking.reviewComment ? (
                              <p className="text-xs text-slate-700 italic bg-white p-2 rounded-lg border border-amber-200/60 mt-1">
                                &ldquo;{booking.reviewComment}&rdquo;
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">
                                {isHindi ? 'केवल स्टार रेटिंग दी गई' : 'Star rating submitted without comment'}
                              </p>
                            )}
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: MY PROFILE & LANGUAGE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Top Navigation Row: Back to Orders & Logout */}
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => setActiveTab('orders')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isHindi ? '← मेरी बुकिंग्स देखें (My Orders)' : '← Back to My Orders'}</span>
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
                <span>{isHindi ? 'लॉगआउट' : 'Logout'}</span>
              </button>
            </div>

            {/* Rocky Profile Details Card inside My Account */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-950 text-amber-400 border border-amber-400/40 flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                        {user.name || 'Rocky'}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{t.profileBadge}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        +91 {user.phone}
                      </span>
                      {user.email && (
                        <span className="hidden xs:flex items-center gap-1 truncate max-w-[190px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/30 text-xs font-bold transition-colors shadow-xs shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.bookNewWashBtn}</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-8">
              <div className="max-w-xl">
                
                {/* Language Selection Card in My Account */}
                <div className="mb-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t.languageSectionTitle}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  {t.languageSectionSub}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      language === 'en'
                        ? 'border-amber-500 bg-white ring-2 ring-amber-400/20 shadow-xs'
                        : 'border-slate-200 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">🇬🇧 English</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Active</div>
                    </div>
                    {language === 'en' && <Check className="w-4 h-4 text-amber-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage('hi')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      language === 'hi'
                        ? 'border-amber-500 bg-white ring-2 ring-amber-400/20 shadow-xs'
                        : 'border-slate-200 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">🇮🇳 हिंदी (Hindi)</div>
                      <div className="text-[10px] text-emerald-700 font-bold mt-0.5">आसान भाषा</div>
                    </div>
                    {language === 'hi' && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                {t.personalDetailsHeading}
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                {t.personalDetailsSub}
              </p>

              {profileSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {profileErrorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.fullName}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rajesh Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {/* WhatsApp Mobile */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.whatsAppNumber}
                    </label>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.verifiedLoginId}</span>
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                      +91
                    </div>
                    <input
                      type="text"
                      value={user.phone}
                      disabled
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.emailOptional}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajesh@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-black text-amber-400 border border-amber-400/40 disabled:opacity-50 font-bold text-xs tracking-wide shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingProfile ? (isHindi ? 'सुरक्षित हो रहा है...' : 'Saving Changes...') : t.saveProfileBtn}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: HELP & SUPPORT WITH CALL TO ACTION */}
      {activeTab === 'support' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Top Navigation Row: Back to Orders */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setActiveTab('orders')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isHindi ? '← मेरी बुकिंग्स देखें (My Orders)' : '← Back to My Orders'}</span>
            </button>
          </div>
          
          {/* Urgent / Direct Support Action Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-400/40 rounded-2xl p-5 sm:p-8 text-white shadow-md">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isHindi ? 'तत्काल सहायता हेल्पलाइन • इंदौर' : 'Instant Support Hotline • Indore'}</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1.5 text-white">
                  {t.supportBannerTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                  {t.supportBannerSub}
                </p>

                {/* Direct Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  
                  {/* Direct Phone Call Button */}
                  <a
                    href="tel:+919685232340"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    <Phone className="w-4 h-4 text-slate-950 fill-current shrink-0" />
                    <span>{t.callHelplineBtn}</span>
                  </a>

                  {/* Direct WhatsApp Chat Button */}
                  <a
                    href="https://wa.me/919685232340?text=Hi%2C%20I%20need%20support%20with%20my%20car%20wash%20booking%20in%20Indore."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                    <span>{t.chatWhatsAppBtn}</span>
                  </a>

                </div>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-8">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3">
                {t.faqHeading}
              </h3>

              <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                
                <div className="py-3">
                  <div className="font-bold text-slate-800 mb-1">
                    {isHindi ? 'क्या मुझे पानी या बिजली देनी होगी?' : 'Do I need to supply water or electricity for the wash?'}
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {isHindi
                      ? 'बिल्कुल नहीं! हमारी मोबाइल वैन पूरी तरह आत्मनिर्भर है। वैन में अपना पानी का टैंक, जनरेटर, हाई प्रेशर मोटर और स्टीम मशीन पहले से मौजूद होती है।'
                      : 'No! Our mobile wash van comes 100% self-powered with an onboard generator, water reservoir, pressure washer, and eco-friendly steam equipment.'}
                  </p>
                </div>

                <div className="py-3">
                  <div className="font-bold text-slate-800 mb-1">
                    {isHindi ? 'तारीख या समय का स्लॉट कैसे बदलें?' : 'How do I reschedule or change my booking slot?'}
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {isHindi
                      ? 'अपनी बुकिंग आईडी के साथ हमारे इंदौर हेल्पलाइन नंबर +91 9685232340 पर कॉल या व्हाट्सएप करें। आपकी बुकिंग बिना किसी चार्ज के री-शेड्यूल कर दी जाएगी।'
                      : 'Simply call or send a quick WhatsApp message to our Indore helpline at +91 9685232340 with your Booking ID, and our dispatch manager will update your slot free of charge.'}
                  </p>
                </div>

                <div className="py-3">
                  <div className="font-bold text-slate-800 mb-1">
                    {isHindi ? 'भुगतान कब और कैसे करना है?' : 'What payment methods are supported?'}
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {isHindi
                      ? 'गाड़ी की पूरी धुलाई और आपके संतुष्ट होने के बाद आप नकद (कैश) या किसी भी यूपीआई (Google Pay, PhonePe, Paytm) से सीधे वैन ऑपरेटर को भुगतान कर सकते हैं।'
                      : 'You can pay Cash on Delivery (COD) or via any UPI app (Google Pay, PhonePe, Paytm) directly to the technician once the wash is completed and inspected to your satisfaction.'}
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function CustomerProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-28 text-center text-xs text-slate-500">Loading customer account...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
