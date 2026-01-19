import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdSearch,
  MdLocationOn,
  MdCalendarToday,
  MdPeople,
  MdSportsSoccer,
  MdFilterList,
  MdVisibility,
} from "react-icons/md";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import type { StateType } from "@/redux/slices";
import {
  FETCH_MATCHES_ACTION,
  REQUEST_TO_JOIN_ACTION,
} from "@/redux/actions/player/matchmaking.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { MatchPost } from "@/types/player/matchmaking.types";
import { CiClock2 } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa";

const FindMatches = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { matches, loading, error } = useSelector(
    (state: StateType) => state.matchmakingSlice,
  );

  const sports = [
    "Football",
    "Basketball",
    "Tennis",
    "Badminton",
    "Volleyball",
    "Cricket",
  ];
  const skillLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ANY"];

  useEffect(() => {
    const filters: any = {};
    if (selectedSport !== "all") filters.sportType = selectedSport;
    if (selectedSkillLevel !== "all") filters.skillLevel = selectedSkillLevel;
    if (searchQuery) filters.search = searchQuery;

    FETCH_MATCHES_ACTION(filters).catch((err) => {
      console.error("Failed to fetch matches:", err);
    });
  }, [selectedSport, selectedSkillLevel, searchQuery]);

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return matches;
    const query = searchQuery.toLowerCase();
    return matches.filter(
      (match) =>
        match.title.toLowerCase().includes(query) ||
        match.description.toLowerCase().includes(query) ||
        match.location.toLowerCase().includes(query) ||
        match.sportType.toLowerCase().includes(query),
    );
  }, [matches, searchQuery]);

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

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-blue-100 text-blue-800";
      case "INTERMEDIATE":
        return "bg-purple-100 text-purple-800";
      case "ADVANCED":
        return "bg-orange-100 text-orange-800";
      case "ANY":
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

  const handleRequestToJoin = async (matchId: number) => {
    try {
      await REQUEST_TO_JOIN_ACTION(matchId);
      toast.success("Request sent successfully!");
      // Refresh matches
      FETCH_MATCHES_ACTION().catch(() => {});
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Matches</h1>
          <p className="text-gray-600 mt-2">
            Discover and join matches with other players
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search matches by title, location, or sport..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-2 cursor-pointer"
            >
              <MdFilterList className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport
                </label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
                >
                  <option value="all">All Sports</option>
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Level
                </label>
                <select
                  value={selectedSkillLevel}
                  onChange={(e) => setSelectedSkillLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
                >
                  <option value="all">All Levels</option>
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-48 w-full" />)
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <MdSportsSoccer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No matches found</p>
            </div>
          ) : (
            filteredMatches.map((match: MatchPost) => {
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
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(match.status)}`}
                          >
                            {match.status}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(match.skillLevel)}`}
                          >
                            {match.skillLevel}
                          </span>
                        </div>
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
                            <FaRegClock/>
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {match.creator.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="text-sm text-gray-600">
                            by {match.creator.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/player/matches/${match.matchId}`)
                            }
                            className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <MdVisibility className="w-4 h-4" />
                            View
                          </button>
                          {match.status === "OPEN" &&
                            match.currentPlayers < match.requiredPlayers && (
                              <button
                                onClick={() =>
                                  handleRequestToJoin(match.matchId)
                                }
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#1c417c] transition-colors cursor-pointer"
                              >
                                Request to Join
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FindMatches;
