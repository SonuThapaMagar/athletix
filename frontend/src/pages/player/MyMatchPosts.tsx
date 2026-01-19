import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdLocationOn,
  MdCalendarToday,
  MdPeople,
  MdSportsSoccer,
  MdVisibility,
  MdDelete,
  MdChat,
  MdArrowBack,
} from "react-icons/md";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import type { StateType } from "@/redux/slices";
import {
  FETCH_MY_MATCHES_ACTION,
  DELETE_MATCH_ACTION,
} from "@/redux/actions/player/matchmaking.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { MatchPost } from "@/types/player/matchmaking.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FaRegClock } from "react-icons/fa";

const MyMatchPosts = () => {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchPost | null>(null);

  const { myMatches, loading, error } = useSelector(
    (state: StateType) => state.matchmakingSlice,
  );

  useEffect(() => {
    FETCH_MY_MATCHES_ACTION().catch((err) => {
      console.error("Failed to fetch my matches:", err);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return { date: dateTimeString, time: "" };
    }
  };

  const handleDelete = async () => {
    if (!selectedMatch) return;
    try {
      await DELETE_MATCH_ACTION(selectedMatch.matchId);
      toast.success("Match deleted successfully");
      setDeleteOpen(false);
      setSelectedMatch(null);
      FETCH_MY_MATCHES_ACTION().catch(() => {});
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete match");
    }
  };

  const canAccessChat = (match: MatchPost) => {
    return (
      match.status === "OPEN" ||
      (match.status === "CLOSED" &&
        match.acceptedPlayers &&
        match.acceptedPlayers.length > 0)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-22">
        <div className="mb-6">
          <button
            onClick={() => navigate("/player/matchmaking")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4 cursor-pointer"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900">My Match Posts</h1>
          <p className="text-gray-600 mt-2">Manage your created matches</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        ) : myMatches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <MdSportsSoccer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              You haven't created any matches yet
            </p>
            <button
              onClick={() => navigate("/player/matchmaking/create")}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-[#1e3d6f] transition-colors"
            >
              Create Your First Match
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myMatches.map((match: MatchPost) => {
              const dateTime = formatDateTime(match.matchDateTime);
              return (
                <div
                  key={match.matchId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {match.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MdSportsSoccer className="w-4 h-4" />
                              {match.sportType}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MdLocationOn className="w-4 h-4" />
                              {match.location}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(match.status)}`}
                        >
                          {match.status}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {match.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MdCalendarToday className="w-4 h-4" />
                          <span>{dateTime.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>
                            <FaRegClock />
                          </span>
                          <span>{dateTime.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MdPeople className="w-4 h-4" />
                          <span>
                            {match.currentPlayers}/{match.requiredPlayers}{" "}
                            players
                          </span>
                        </div>
                      </div>

                      {match.requests && match.requests.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">
                            {
                              match.requests.filter(
                                (r) => r.status === "PENDING",
                              ).length
                            }{" "}
                            pending request(s)
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/player/matches/${match.matchId}`)
                          }
                          className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <MdVisibility className="w-4 h-4" />
                          View Details
                        </button>
                        {canAccessChat(match) && (
                          <button
                            onClick={() =>
                              navigate(`/player/matches/${match.matchId}/chat`)
                            }
                            className="px-4 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <MdChat className="w-4 h-4" />
                            Chat
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedMatch(match);
                            setDeleteOpen(true);
                          }}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <MdDelete className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Match</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                match "{selectedMatch?.title}".
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyMatchPosts;
