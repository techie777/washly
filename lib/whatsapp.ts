export const WHATSAPP_PHONE = '919685232340';

export interface WhatsAppOrderParams {
  serviceName?: string;
  price?: number | string;
  vehicleType?: 'car' | 'bike';
  vehicleModel?: string;
  customerName?: string;
  phone?: string;
  address?: string;
  slot?: string;
  date?: string;
  bookingId?: string;
  notes?: string;
  paymentMethod?: string;
  isHindi?: boolean;
}

/**
 * Builds a clean, professional, structured WhatsApp message for ordering.
 */
export function generateWhatsAppMessage(params: WhatsAppOrderParams = {}): string {
  const {
    serviceName = 'Doorstep Car Wash',
    price,
    vehicleType = 'car',
    vehicleModel,
    customerName,
    phone,
    address,
    slot,
    date,
    bookingId,
    notes,
    paymentMethod = 'cod',
    isHindi = false,
  } = params;

  const paymentTextHi = paymentMethod === 'cod' ? 'कैश / ऑन-स्पॉट UPI पेमेंट' : 'ऑनलाइन यूपीआई (GPay/PhonePe/Paytm)';
  const paymentTextEn = paymentMethod === 'cod' ? 'Cash / On-Spot UPI Payment' : 'Online UPI (GPay/PhonePe/Paytm)';

  const formatHumanDate = (rawDate?: string) => {
    if (!rawDate) return isHindi ? 'कल' : 'Tomorrow';
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch {}
    return rawDate;
  };

  const humanDate = formatHumanDate(date);

  if (isHindi) {
    let msg = `✨ *WASHLY डोरस्टेप कार केयर - नया ऑर्डर (इंदौर)* ✨\n`;
    msg += `------------------------------------------\n`;
    if (bookingId) msg += `📋 *बुकिंग आईडी:* #${bookingId}\n`;
    msg += `📦 *वॉश पैकेज:* ${serviceName}\n`;
    if (price) msg += `💰 *कुल राशि:* ₹${price}\n`;
    if (vehicleModel) msg += `🚘 *गाड़ी:* ${vehicleModel} (${vehicleType === 'car' ? 'कार' : 'बाइक'})\n`;
    if (customerName) msg += `👤 *ग्राहक का नाम:* ${customerName}\n`;
    if (phone) msg += `📞 *मोबाइल नंबर:* ${phone}\n`;
    if (address) msg += `📍 *डोरस्टेप पता (इंदौर):* ${address}\n`;
    msg += `📅 *तारीख व समय:* ${humanDate} ${slot ? `(${slot})` : ''}\n`;
    msg += `💳 *भुगतान का तरीका:* ${paymentTextHi}\n`;
    if (notes) msg += `📝 *विशेष निर्देश:* ${notes}\n`;
    msg += `⚡💧 *पानी व बिजली:* ग्राहक द्वारा वॉशिंग के दौरान उपलब्ध (ऑन-बोर्ड सुविधा भविष्य में प्रस्तावित)\n`;
    msg += `------------------------------------------\n`;
    msg += `✅ *नमस्ते Washly टीम! कृपया मेरी डोरस्टेप वॉश बुकिंग की पुष्टि (Confirm) करें।*`;
    return msg;
  }

  let msg = `✨ *WASHLY DOORSTEP CAR CARE - NEW ORDER (INDORE)* ✨\n`;
  msg += `------------------------------------------\n`;
  if (bookingId) msg += `📋 *Booking ID:* #${bookingId}\n`;
  msg += `📦 *Wash Package:* ${serviceName}\n`;
  if (price) msg += `💰 *Total Amount:* ₹${price}\n`;
  if (vehicleModel) msg += `🚘 *Vehicle:* ${vehicleModel} (${vehicleType.toUpperCase()})\n`;
  if (customerName) msg += `👤 *Customer Name:* ${customerName}\n`;
  if (phone) msg += `📞 *Mobile:* ${phone}\n`;
  if (address) msg += `📍 *Doorstep Address:* ${address}\n`;
  msg += `📅 *Date & Slot:* ${humanDate} ${slot ? `(${slot})` : ''}\n`;
  msg += `💳 *Payment Method:* ${paymentTextEn}\n`;
  if (notes) msg += `📝 *Notes:* ${notes}\n`;
  msg += `⚡💧 *Water & Power:* Provided by customer during wash (onboard planned for future)\n`;
  msg += `------------------------------------------\n`;
  msg += `✅ *Hello Washly Team! Please confirm my doorstep wash reservation.*`;
  return msg;
}

/**
 * Returns the full wa.me direct link with URL-encoded message
 */
export function getWhatsAppOrderUrl(params: WhatsAppOrderParams = {}): string {
  const text = generateWhatsAppMessage(params);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * Safely opens WhatsApp order chat in a new tab
 */
export function openWhatsAppOrder(params: WhatsAppOrderParams = {}) {
  const url = getWhatsAppOrderUrl(params);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
