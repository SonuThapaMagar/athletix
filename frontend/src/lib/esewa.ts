// src/lib/esewa.ts
const ESEWA_CONFIG = {
  uat: true, // Toggle for prod
  merchantCode: process.env.REACT_APP_ESEWA_MERCHANT_CODE || 'EPAYTEST',
  secretKey: process.env.REACT_APP_ESEWA_SECRET_KEY || '8cfc35d5f5594c7cb5c7', // Test key
  baseUrl: 'https://uat.esewa.com.np', // Prod: https://esewa.com.np
};

// Generate eSewa URL + Signature (v2)
export const generateEsewaUrl = (bookingId: number, amount: number, successUrl: string, failureUrl: string): string => {
  const params = new URLSearchParams({
    amt: amount.toFixed(2),
    pdc: '0',
   psc: '0',
    txAmt: '0',
    tAmt: amount.toFixed(2),
    pid: `B${bookingId}`, // Prefix for booking
    scd: ESEWA_CONFIG.merchantCode,
    su: successUrl,
    fu: failureUrl,
  });

  // HMAC signature (v2: amt + pid + scd)
  const message = `${amount.toFixed(2)}${params.get('pid')}${ESEWA_CONFIG.merchantCode}`;
  const signature = generateHmacSignature(message);

  params.append('sHash', signature);

  return `${ESEWA_CONFIG.baseUrl}/epay/main?${params.toString()}`;
};

// HMAC SHA256 (client-side)
const generateHmacSignature = (message: string): string => {
  // Use Web Crypto API (modern browsers)
  const encoder = new TextEncoder();
  const keyData = encoder.encode(ESEWA_CONFIG.secretKey);
  const data = encoder.encode(message);

  return crypto.subtle
    .importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    .then((key) => crypto.subtle.sign('HMAC', key, data))
    .then((sig) => btoa(String.fromCharCode(...new Uint8Array(sig))))
    .catch(() => ''); // Fallback
};