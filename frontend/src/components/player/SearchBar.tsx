import { useState } from "react";
import { MdSearch, MdFilterList } from "react-icons/md";

interface SearchFilters {
  sport: string;
  location: string;
  date: string;
  time: string;
  searchQuery: string;
}

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  onToggleFilters?: (show: boolean) => void;
  searchFilters?: SearchFilters;
}

const SearchBar = ({ onSearch, onToggleFilters, searchFilters }: SearchBarProps) => {
  const [searchData, setSearchData] = useState<SearchFilters>(
    searchFilters || { sport: "", location: "", date: "", time: "", searchQuery: "" }
  );
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch?.(searchData);
    console.log("Searching with:", searchData);
  };

  const toggleFilters = () => {
    const newState = !showFilters;
    setShowFilters(newState);
    onToggleFilters?.(newState);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Main Search Input */}
          <div className="flex-1 relative w-full">
            <input
              type="text"
              placeholder="Search venues, sports, or locations..."
              value={searchData.searchQuery}
              onChange={(e) =>
                setSearchData(prev => ({ ...prev, searchQuery: e.target.value }))
              }
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full border border-gray-300 rounded-lg px-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
            />
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <MdFilterList className="w-5 h-5" />
            Filters
          </button>

          {/* Search Button */}
          <button
            onClick={() => {
              handleSearch();
              setShowFilters(false);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            Search
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Sport */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Sport</label>
                <select
                  value={searchData.sport}
                  onChange={(e) =>
                    setSearchData(prev => ({ ...prev, sport: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">All Sports</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="badminton">Badminton</option>
                  <option value="cricket">Cricket</option>
                  <option value="swimming">Swimming</option>
                </select>
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) =>
                    setSearchData(prev => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Time */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Time</label>
                <select
                  value={searchData.time}
                  onChange={(e) =>
                    setSearchData(prev => ({ ...prev, time: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Any Time</option>
                  <option value="morning">Morning (6AM-12PM)</option>
                  <option value="afternoon">Afternoon (12PM-6PM)</option>
                  <option value="evening">Evening (6PM-12AM)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
