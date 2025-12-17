import CryptoJS from 'crypto-js';

const ESEWA_CONFIG = {
  uat: true,
  merchantCode: import.meta.env.VITE_ESEWA_MERCHANT_CODE,
  secretKey: import.meta.env.VITE_ESEWA_SECRET_KEY,

  // get baseUrl() {
  //   return this.uat
  //     ? 'https://rc-epay.esewa.com.np'
  //     : 'https://epay.esewa.com.np';
  // }
  get baseUrl() {
    return this.uat
      ? 'https://rc-epay.esewa.com.np'  // ← Correct UAT base URL
      : 'https://epay.esewa.com.np';
  }
};

interface EsewaPaymentParams {
  bookingId: number;
  amount: number;
  successUrl: string;
  failureUrl: string;
}

const generateHmacSignature = (message: string): string => {
  const hash = CryptoJS.HmacSHA256(message, ESEWA_CONFIG.secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
};

export const submitEsewaPayment = ({
  bookingId,
  amount,
  successUrl,
  failureUrl,
}: EsewaPaymentParams) => {
  const transactionUuid = `B${bookingId}`;
  const totalAmount = amount.toFixed(1); // Must be ONE decimal

  // ⚠️ Exact field order, no spaces
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_CONFIG.merchantCode}`;
  const signature = generateHmacSignature(message);

  // Build POST form
  const form = document.createElement("form");
  form.method = "POST";
  // form.action = `${ESEWA_CONFIG.baseUrl}/api/epay/main/v2/form`;

  form.action = `${ESEWA_CONFIG.baseUrl}/api/epay/main/v2/form`;

  const fields: Record<string, string> = {
    amount: totalAmount,
    tax_amount: "0",
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: ESEWA_CONFIG.merchantCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  console.log("Message for signature:", message);
  console.log("Generated signature:", signature);
  console.log("Total amount sent:", totalAmount);
  form.submit();
};

export const verifyEsewaSignature = (
  data: Record<string, string>,
  receivedSignature: string
): boolean => {
  const signedFields = data.signed_field_names?.split(',') || [];
  const messageParts = signedFields.map(field => `${field}=${data[field] || ''}`);
  const message = messageParts.join(',');
  const expectedSignature = generateHmacSignature(message);
  return expectedSignature === receivedSignature;
};

export interface EsewaSuccessParams {
  transaction_uuid: string;
  transaction_code: string;
  total_amount: string;
  status: string;
  signature?: string;
}

export const parseEsewaSuccessParams = (
  searchParams: URLSearchParams
): EsewaSuccessParams | null => {
  const transaction_uuid = searchParams.get('transaction_uuid');
  const transaction_code = searchParams.get('transaction_code');
  const total_amount = searchParams.get('total_amount');
  const status = searchParams.get('status');
  const signature = searchParams.get('signature') || undefined;

  if (!transaction_uuid || !transaction_code || !total_amount || !status) {
    return null;
  }

  return { transaction_uuid, transaction_code, total_amount, status, signature };
};

export const extractBookingId = (transactionUuid: string): number | null => {
  const match = transactionUuid.match(/^B(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

export default {
  submitEsewaPayment,
  verifyEsewaSignature,
  parseEsewaSuccessParams,
  extractBookingId,
};