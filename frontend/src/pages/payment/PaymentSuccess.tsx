import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { parseEsewaSuccessParams, extractBookingId } from '@/lib/esewa';
import { VERIFY_PAYMENT_ACTION } from '@/redux/actions/user/venueBooking.actions';
import { Loader2, CheckCircle2 } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Parse eSewa callback parameters
        const params = parseEsewaSuccessParams(searchParams);
        
        if (!params) {
          toast.error('Invalid payment parameters');
          navigate('/player/bookings');
          return;
        }

        // Extract booking ID from transaction UUID
        const bookingId = extractBookingId(params.transaction_uuid);
        
        if (!bookingId) {
          toast.error('Invalid booking ID');
          navigate('/player/bookings');
          return;
        }

        // Verify payment with backend
        await VERIFY_PAYMENT_ACTION({
          bookingId,
          refId: params.transaction_code,
          amt: params.total_amount,
          signature: params.signature,
        });

        setSuccess(true);
        toast.success('Payment verified successfully!');
        
        // Redirect to bookings after 2 seconds
        setTimeout(() => {
          navigate('/player/bookings');
        }, 2000);

      } catch (error: any) {
        console.error('Payment verification failed:', error);
        toast.error(error.message || 'Payment verification failed');
        setTimeout(() => {
          navigate('/player/bookings');
        }, 2000);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {verifying ? (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your booking has been confirmed. Redirecting...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-3xl">✕</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600">
              Redirecting to bookings...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;