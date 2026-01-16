import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  MdClose, 
  MdLocationOn, 
  MdEmail, 
  MdPhone, 
  MdSportsSoccer,
  MdCalendarToday,
  MdCheckCircle 
} from 'react-icons/md';
import requests from '@/helper/requests';
import type { IPlayerProfile } from '@/types/user.types/user.types';

interface PlayerProfileModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean; // Show Accept/Reject buttons
}

const PlayerProfileModal = ({ 
  userId, 
  isOpen, 
  onClose, 
  onAccept, 
  onReject,
  showActions = false 
}: PlayerProfileModalProps) => {
  const [profile, setProfile] = useState<IPlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchPlayerProfile();
    }
  }, [isOpen, userId]);

  const fetchPlayerProfile = async () => {
    setLoading(true);
    try {
      const response = await requests.player.matchmaking.getPlayerProfile(userId);
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error: any) {
      toast.error('Failed to load player profile');
      console.error('Error fetching player profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg flex justify-between items-start">
          <div className="flex items-start gap-4">
            {/* Profile Picture */}
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
              {profile?.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt={profile.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{profile?.name?.charAt(0).toUpperCase() || '?'}</span>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{profile?.name || 'Loading...'}</h2>
              <p className="text-blue-100 text-sm mt-1">Player Profile</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="p-6 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MdEmail className="text-blue-600 w-5 h-5" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MdPhone className="text-blue-600 w-5 h-5" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MdLocationOn className="text-blue-600 w-5 h-5" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            {profile.stats && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Match Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {profile.stats.totalMatchesCreated !== undefined && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {profile.stats.totalMatchesCreated}
                      </p>
                      <p className="text-sm text-gray-600">Matches Created</p>
                    </div>
                  )}
                  {profile.stats.totalMatchesJoined !== undefined && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {profile.stats.totalMatchesJoined}
                      </p>
                      <p className="text-sm text-gray-600">Matches Joined</p>
                    </div>
                  )}
                  {profile.stats.totalMatchesCompleted !== undefined && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {profile.stats.totalMatchesCompleted}
                      </p>
                      <p className="text-sm text-gray-600">Matches Completed</p>
                    </div>
                  )}
                  {profile.stats.acceptanceRate !== undefined && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {profile.stats.acceptanceRate}%
                      </p>
                      <p className="text-sm text-gray-600">Acceptance Rate</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Favorite Sports */}
            {profile.favoriteSports && profile.favoriteSports.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Favorite Sports</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.favoriteSports.map((sport, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <MdSportsSoccer className="w-4 h-4" />
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Levels */}
            {profile.skillLevels && Object.keys(profile.skillLevels).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Skill Levels</h3>
                <div className="space-y-2">
                  {Object.entries(profile.skillLevels).map(([sport, level]) => (
                    <div key={sport} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{sport}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Matches */}
            {profile.recentMatches && profile.recentMatches.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Recent Matches</h3>
                <div className="space-y-2">
                  {profile.recentMatches.map((match) => (
                    <div
                      key={match.matchId}
                      className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{match.title}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <MdSportsSoccer className="w-4 h-4" />
                            {match.sportType}
                          </span>
                          <span className="flex items-center gap-1">
                            <MdCalendarToday className="w-4 h-4" />
                            {new Date(match.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          match.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : match.status === 'OPEN'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {match.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Since */}
            {profile.createdAt && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Failed to load profile
          </div>
        )}

        {/* Action Buttons */}
        {showActions && profile && (
          <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-lg flex gap-3">
            <button
              onClick={onReject}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Reject Request
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <MdCheckCircle className="w-5 h-5" />
              Accept Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfileModal;
