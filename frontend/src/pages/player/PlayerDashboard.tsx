import { useState } from "react";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import SearchBar from "@/components/player/SearchBar";
import HeroSection from "@/components/player/HeroSection";
import BannerSlider from "@/components/player/BannerSlider";
import bannerImg from "@/assets/player/banner.png";
import Discover from "@/components/player/Discover";
import Footer from "@/components/common/Footer";
import Faq from "@/components/common/Faq";

interface SearchFilters {
  sport: string;
  location: string;
  date: string;
  time: string;
  searchQuery: string;
}

const PlayerDashboard = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    sport: "",
    location: "",
    date: "",
    time: "",
    searchQuery: "",
  });

  const handleSearch = (filters: SearchFilters) => setSearchFilters(filters);
  const handleToggleFilters = (_show: boolean) => {};

  return (
    <div className="min-h-screen bg-gray-50">
      <PlayerNavLayout />

      {/* Hero Section with Background */}
      <section className="relative bg-gradient-to-r from-primary to-primary/20 overflow-hidden">
        {/* Optional Abstract SVG/Background */}
        <div className="absolute inset-0 -z-10">
          <img
            src={bannerImg}
            alt="Abstract background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
          {/* Hero Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Welcome back, John!
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Find your next match or book a venue easily.
            </p>

            {/* Search Bar */}
            <div className="mt-6">
              <SearchBar
                onSearch={handleSearch}
                onToggleFilters={handleToggleFilters}
                searchFilters={searchFilters}
              />
            </div>
          </div>

          {/* Hero Poster */}
          <div className="flex-1 hidden md:flex justify-center">
            <img
              src={bannerImg}
              alt="Sports Poster"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>
      <HeroSection />

      <Discover />
      <Faq/>
      <BannerSlider />
      <Footer/>
    </div>
  );
};

export default PlayerDashboard;
