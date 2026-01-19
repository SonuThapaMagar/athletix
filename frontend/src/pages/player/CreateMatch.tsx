import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import {
  MdArrowBack,
  MdSportsSoccer,
  MdLocationOn,
  MdCalendarToday,
  MdPeople,
} from "react-icons/md";
import { CREATE_MATCH_ACTION } from "@/redux/actions/player/matchmaking.actions";
import { toast } from "sonner";
import type { CreateMatchData } from "@/types/player/matchmaking.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

const CreateMatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [matchDate, setMatchDate] = useState<Date | undefined>(undefined);
  const [matchTime, setMatchTime] = useState("");

  const [formData, setFormData] = useState<CreateMatchData>({
    title: "",
    description: "",
    sportType: "Football",
    location: "",
    matchDateTime: "",
    requiredPlayers: 8,
    skillLevel: "INTERMEDIATE",
    contactInfo: "",
    additionalNotes: "",
  });

  const sports = [
    "Football",
    "Basketball",
    "Tennis",
    "Badminton",
    "Volleyball",
    "Cricket",
  ];
  const skillLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ANY"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!matchDate || !matchTime) {
      toast.error("Please select match date and time");
      return;
    }

    const combinedDateTime = `${format(matchDate, "yyyy-MM-dd")}T${matchTime}`;

    setLoading(true);

    try {
      const match = await CREATE_MATCH_ACTION({
        ...formData,
        matchDateTime: combinedDateTime,
      });

      toast.success("Match created successfully!");
      navigate(`/player/matches/${match.matchId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-22">
        <div className="mb-6">
          <button
            onClick={() => navigate("/player/matchmaking")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4 cursor-pointer"
          >
            <MdArrowBack className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create Match</h1>
          <p className="text-gray-600 mt-2">
            Host a game and invite other players to join
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Weekend Football Match"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your match, rules, and what players can expect..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <MdSportsSoccer className="w-4 h-4" />
                Sport *
              </label>

              <Select
                value={formData.sportType}
                onValueChange={(value) =>
                  setFormData({ ...formData, sportType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skill Level *</label>

              <Select
                value={formData.skillLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, skillLevel: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <MdLocationOn className="w-4 h-4" />
              Location *
            </label>

            <Input
              required
              placeholder="e.g., Central Park, Downtown"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <MdCalendarToday className="w-4 h-4" />
              Match Date & Time *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !matchDate && "text-muted-foreground",
                    )}
                  >
                    <MdCalendarToday className="mr-2 h-4 w-4" />
                    {matchDate ? format(matchDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={matchDate}
                    onSelect={setMatchDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Time Picker */}
              <Input
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                min="06:00"
                max="22:00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MdPeople className="inline w-4 h-4 mr-1" />
              Required Players *
            </label>
            <input
              type="number"
              required
              min={2}
              max={50}
              value={formData.requiredPlayers}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requiredPlayers: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Info (Optional)
            </label>
            <input
              type="text"
              value={formData.contactInfo || ""}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              placeholder="e.g., Phone number or email for coordination"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.additionalNotes || ""}
              onChange={(e) =>
                setFormData({ ...formData, additionalNotes: e.target.value })
              }
              placeholder="Any additional information about the match..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/player/matchmaking")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-4xl hover:bg-gray-50 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary/90 text-white rounded-4xl hover:bg-primary transition-colors font-medium disabled:opacity-50 cursor-pointer *:disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Match"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatch;
