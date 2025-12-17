import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = searchParams.get('bid');
    
    if (bookingId) {
      toast.error(`Payment cancelled for booking #${bookingId}`);
    } else {
      toast.error('Payment was cancelled');
    }

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/player');
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment Cancelled
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. You can try again later.
        </p>
        <button
          onClick={() => navigate('/player')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Venues
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;