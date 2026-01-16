import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MdCheck, MdClose, MdPerson } from 'react-icons/md';
import requests from '@/helper/requests';
import PlayerProfileModal from './PlayerProfileModal';
import type { MatchRequestResponse } from '@/types/match.types';

interface MatchRequestsManagerProps {
  matchId: number;
}

const MatchRequestsManagerWithProfile = ({ matchId }: MatchRequestsManagerProps) => {
  const [matchRequests, setMatchRequests] = useState<MatchRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<number | null>(null);
  
  // Player profile modal state
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    requestId: number;
    action: 'accept' | 'reject';
  } | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [matchId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await requests.player.matchmaking.getMatchRequests(matchId);
      if (response.data.success) {
        setMatchRequests(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load match requests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId: number) => {
    setSelectedPlayerId(userId);
    setIsProfileModalOpen(true);
  };

  const handleRespond = async (requestId: number, action: 'accept' | 'reject') => {
    setResponding(requestId);
    try {
      const response = await requests.player.matchmaking.respondToRequest(
        requestId,
        action
      );

      if (response.data.success) {
        toast.success(
          action === 'accept' 
            ? '✅ Request accepted! Player has been notified via email and in-app.' 
            : 'Request rejected'
        );
        
        // Refresh the requests list
        fetchRequests();
        
        // Close modal and reset pending action
        setIsProfileModalOpen(false);
        setPendingAction(null);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to ${action} request`
      );
    } finally {
      setResponding(null);
    }
  };

  // Handle accept/reject from profile modal
  const handleModalAccept = () => {
    if (pendingAction) {
      handleRespond(pendingAction.requestId, 'accept');
    }
  };

  const handleModalReject = () => {
    if (pendingAction) {
      handleRespond(pendingAction.requestId, 'reject');
    }
  };

  // Open profile modal with pending action
  const openProfileAndPrepareAction = (request: MatchRequestResponse, action: 'accept' | 'reject') => {
    setSelectedPlayerId(request.player.userId);
    setPendingAction({ requestId: request.requestId, action });
    setIsProfileModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const pendingRequests = matchRequests.filter(r => r.status === 'PENDING');

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Match Requests ({pendingRequests.length})
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending requests
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.requestId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {request.player.name}
                      </h4>
                      <button
                        onClick={() => handleViewProfile(request.player.userId)}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        title="View full profile"
                      >
                        <MdPerson className="w-4 h-4" />
                        View Profile
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600">{request.player.email}</p>
                    {request.player.location && (
                      <p className="text-sm text-gray-500">📍 {request.player.location}</p>
                    )}
                    {request.message && (
                      <p className="text-sm text-gray-700 mt-2 italic bg-gray-50 p-2 rounded">
                        "{request.message}"
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Requested: {new Date(request.requestedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleRespond(request.requestId, 'accept')}
                      disabled={responding === request.requestId}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      title="Accept immediately"
                    >
                      <MdCheck className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(request.requestId, 'reject')}
                      disabled={responding === request.requestId}
                      className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      title="Reject immediately"
                    >
                      <MdClose className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Section */}
        {matchRequests.filter(r => r.status !== 'PENDING').length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-gray-700 mb-3">Request History</h4>
            <div className="space-y-2">
              {matchRequests
                .filter(r => r.status !== 'PENDING')
                .map((request) => (
                  <div
                    key={request.requestId}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {request.player.name}
                      </span>
                      <button
                        onClick={() => handleViewProfile(request.player.userId)}
                        className="text-blue-600 hover:text-blue-700 text-xs"
                      >
                        <MdPerson className="w-4 h-4" />
                      </button>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          request.status === 'ACCEPTED'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {request.status === 'ACCEPTED' ? '✅ Accepted' : '❌ Rejected'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {request.respondedAt && 
                        new Date(request.respondedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Player Profile Modal */}
      {selectedPlayerId && (
        <PlayerProfileModal
          userId={selectedPlayerId}
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setPendingAction(null);
          }}
          onAccept={pendingAction ? handleModalAccept : undefined}
          onReject={pendingAction ? handleModalReject : undefined}
          showActions={!!pendingAction}
        />
      )}
    </>
  );
};

export default MatchRequestsManagerWithProfile;
