import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { VERIFY_PAYMENT_ACTION } from "@/redux/actions/user/venueBooking.actions";
import { FETCH_ALL_VENUES_ACTION } from "@/redux/actions/user/playerVenue.actions";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { extractBookingId } from "@/lib/esewa";

interface EsewaCallbackData {
  transaction_uuid: string;
  transaction_code: string;
  total_amount: string | number;
  status: string;
  product_code: string;
  signature?: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Step 1: Collect all URL parameters for debugging
        const allParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          allParams[key] = value;
        });

        console.log("=".repeat(60));
        console.log("🔍 PAYMENT SUCCESS PAGE - DEBUGGING");
        console.log("=".repeat(60));
        console.log("Full URL:", window.location.href);
        console.log("All URL Parameters:", JSON.stringify(allParams, null, 2));

        setDebugInfo({
          url: window.location.href,
          params: allParams,
          timestamp: new Date().toISOString(),
        });

        let params: EsewaCallbackData | null = null;

        // Step 2: Check for Base64 encoded 'data' parameter (eSewa v2 standard)
        const encodedData = searchParams.get("data");

        if (encodedData) {
          console.log("✅ Found 'data' parameter (Base64 encoded)");
          console.log("Encoded value:", encodedData.substring(0, 50) + "...");

          try {
            const decodedString = atob(encodedData);
            console.log("✅ Decoded Base64:");
            console.log(decodedString);

            params = JSON.parse(decodedString);
            console.log("✅ Parsed JSON:");
            console.log(JSON.stringify(params, null, 2));
          } catch (decodeError) {
            console.error("❌ Failed to decode/parse Base64:", decodeError);
            setError("Failed to decode payment data");
            toast.error("Invalid payment data format");
            setTimeout(() => navigate("/player"), 3000);
            return;
          }
        } else {
          // Step 3: Try individual query parameters (alternative format)
          console.log("⚠️  No 'data' parameter found, trying individual parameters");

          const transaction_uuid = searchParams.get("transaction_uuid");
          const transaction_code = searchParams.get("transaction_code");
          const total_amount = searchParams.get("total_amount");
          const status = searchParams.get("status");

          console.log("Individual parameters:");
          console.log("  transaction_uuid:", transaction_uuid);
          console.log("  transaction_code:", transaction_code);
          console.log("  total_amount:", total_amount);
          console.log("  status:", status);

          if (transaction_uuid && transaction_code && total_amount && status) {
            params = {
              transaction_uuid,
              transaction_code,
              total_amount,
              status,
              product_code: searchParams.get("product_code") || "",
              signature: searchParams.get("signature") || undefined,
            };
            console.log("✅ Constructed params from individual fields");
          }
        }

        // Step 4: Validate we got the data
        if (!params) {
          console.error("❌ NO PAYMENT PARAMETERS FOUND");
          console.log("This means eSewa did not send any payment data!");
          console.log("Possible causes:");
          console.log("1. Success URL in backend is incorrect");
          console.log("2. eSewa is not redirecting properly");
          console.log("3. Payment was cancelled before completion");

          setError("No payment data received from eSewa");
          toast.error("Payment data not received");

          setTimeout(() => {
            navigate("/player");
          }, 3000);
          return;
        }

        console.log("=".repeat(60));
        console.log("✅ PAYMENT DATA EXTRACTED SUCCESSFULLY");
        console.log("=".repeat(60));
        console.log("Transaction UUID:", params.transaction_uuid);
        console.log("Transaction Code:", params.transaction_code);
        console.log("Total Amount:", params.total_amount);
        console.log("Status:", params.status);
        console.log("=".repeat(60));

        // Step 5: Check payment status
        if (params.status !== "COMPLETE") {
          console.error("❌ Payment status is not COMPLETE:", params.status);
          setError(`Payment status: ${params.status}`);
          toast.error(`Payment incomplete: ${params.status}`);
          setTimeout(() => navigate("/player"), 3000);
          return;
        }

        // Step 6: Extract booking ID
        const bookingId = extractBookingId(params.transaction_uuid);

        if (!bookingId) {
          console.error("❌ Invalid transaction UUID format:", params.transaction_uuid);
          console.log("Expected format: B{bookingId}, e.g., B123");
          setError(`Invalid transaction UUID: ${params.transaction_uuid}`);
          toast.error("Invalid booking reference");
          setTimeout(() => navigate("/player"), 3000);
          return;
        }

        console.log("✅ Extracted Booking ID:", bookingId);
        console.log("✅ Booking ID type:", typeof bookingId);

        // Ensure bookingId is a number
        const bookingIdNum = Number(bookingId);
        if (isNaN(bookingIdNum) || bookingIdNum <= 0) {
          console.error("❌ Invalid booking ID:", bookingId);
          setError(`Invalid booking ID: ${bookingId}`);
          toast.error("Invalid booking reference");
          setTimeout(() => navigate("/player"), 3000);
          return;
        }

        // Step 7: Verify with backend
        console.log("🔵 Calling backend verification...");

        const amountStr =
          typeof params.total_amount === "number"
            ? params.total_amount.toString()
            : params.total_amount;

        console.log("Verification payload:");
        console.log({
          bookingId: bookingIdNum,
          refId: params.transaction_code,
          amt: amountStr,
        });

        const verifiedBooking = await VERIFY_PAYMENT_ACTION({
          bookingId: bookingIdNum,
          refId: params.transaction_code,
          amt: amountStr,
        });

        console.log("=".repeat(60));
        console.log("✅✅✅ PAYMENT VERIFIED SUCCESSFULLY! ✅✅✅");
        console.log("=".repeat(60));

        setSuccess(true);
        toast.success("Payment verified successfully!");

        // Refresh venue list to update booking counts
        try {
          await FETCH_ALL_VENUES_ACTION({ page: 1, perPage: 6 });
          console.log("✅ Venue list refreshed after payment verification");
        } catch (err) {
          console.error("Failed to refresh venue list:", err);
        }

        // Navigate to booking page to show venue details
        setTimeout(() => {
          if (verifiedBooking?.venueId) {
            // Navigate to booking page with venue ID and booking ID as query param
            navigate(`/player/booking/${verifiedBooking.venueId}?bookingId=${bookingId}`);
          } else {
            // Fallback to bookings list if venue ID not available
            navigate("/player/bookings");
          }
        }, 2000);
      } catch (error: any) {
        console.error("=".repeat(60));
        console.error("❌❌❌ PAYMENT VERIFICATION FAILED ❌❌❌");
        console.error("=".repeat(60));
        console.error("Error:", error);
        console.error("Error message:", error?.message);
        console.error("Error response:", error?.response?.data);
        console.error("=".repeat(60));

        setSuccess(false);
        setError(error?.message || "Payment verification failed");
        toast.error(error.message || "Payment verification failed");

        setTimeout(() => {
          navigate("/player/bookings");
        }, 3000);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
        {/* Main Status */}
        <div className="text-center mb-6">
          {verifying ? (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Verifying Payment
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your payment with eSewa...
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
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-4">
                {error || "We couldn't verify your payment"}
              </p>
              <button
                onClick={() => navigate("/player")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Venues
              </button>
            </>
          )}
        </div>

        {/* Debug Information */}
        {debugInfo && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Debug Information</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(debugInfo, null, 2)
                  );
                  toast.success("Debug info copied!");
                }}
                className="ml-auto text-blue-600 hover:text-blue-700 text-xs"
              >
                Copy
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
              <div className="text-xs font-mono space-y-2">
                <div>
                  <span className="text-gray-600">URL:</span>
                  <div className="text-gray-900 break-all mt-1">
                    {debugInfo.url}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <span className="text-gray-600">Parameters:</span>
                  <pre className="text-gray-900 mt-1 whitespace-pre-wrap">
                    {JSON.stringify(debugInfo.params, null, 2)}
                  </pre>
                </div>

                <div className="pt-2 border-t">
                  <span className="text-gray-600">Timestamp:</span>
                  <div className="text-gray-900 mt-1">{debugInfo.timestamp}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>
                <strong>Next steps if payment fails:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Copy the debug information above</li>
                <li>Check your browser console (F12) for detailed logs</li>
                <li>Check backend logs for verification attempts</li>
                <li>Contact support with the debug information</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;