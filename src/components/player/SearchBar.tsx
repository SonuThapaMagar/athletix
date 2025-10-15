import { useState } from 'react'
import { MdSearch, MdFilterList } from 'react-icons/md'

const SearchBar = () => {
  const [searchData, setSearchData] = useState({
    sport: '',
    location: '',
    date: '',
    time: '',
    searchQuery: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    console.log('Searching with:', searchData)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-20 mt-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Main Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search venues, sports, or locations..."
              value={searchData.searchQuery}
              onChange={(e) => setSearchData(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#2c5aa0] focus:ring-2 focus:ring-[#2c5aa0]/20"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Filters Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <MdFilterList className="w-5 h-5" />
            Filters
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-[#2c5aa0] text-white px-6 py-3 rounded-lg hover:bg-[#1e3d6f] transition-colors font-medium whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sport Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
                <select 
                  value={searchData.sport}
                  onChange={(e) => setSearchData(prev => ({ ...prev, sport: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0]"
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
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0]"
                />
              </div>

              {/* Time */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select 
                  value={searchData.time}
                  onChange={(e) => setSearchData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2c5aa0]"
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
  )
}

export default SearchBar
