import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import RideList from './components/RideList';
import BookingScreen from './components/BookingScreen';
import MapVisualizer from './components/MapVisualizer';
import { getFareEstimates } from './services/geminiService';
import { SearchResult, RideOption } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);

  const handleSearch = async (origin: string, destination: string) => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null); // Clear previous
    setSelectedRide(null); // Clear previous
    try {
      const result = await getFareEstimates(origin, destination);
      setSearchResult(result);
    } catch (err) {
      setError("Failed to fetch rides. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRideSelect = (ride: RideOption) => {
    setSelectedRide(ride);
  };

  const handleBookingComplete = () => {
    // Reset app state to beginning of funnel
    setSelectedRide(null);
    setSearchResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white max-w-md mx-auto shadow-2xl relative overflow-hidden font-sans">
      <Header />
      
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide relative bg-gray-50">
        {/* Map Background / Visualizer */}
        {/* The map size adjusts based on the state to give focus to content */}
        <div className={`transition-all duration-700 ease-in-out w-full relative z-0 ${selectedRide ? 'h-48' : (searchResult ? 'h-40' : 'h-64')}`}>
            <MapVisualizer />
            {/* Overlay gradient for smooth transition to content */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>

        {/* Main Content Container */}
        <div className="flex-1 relative z-10 -mt-8 flex flex-col">
            
            {selectedRide ? (
                // Booking Screen (Overlay)
                <div className="flex-1 bg-white rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-6 min-h-[500px]">
                     <BookingScreen ride={selectedRide} onClose={handleBookingComplete} />
                </div>
            ) : (
                // Search & List Flow
                <>
                    <div className="px-4 mb-2">
                       <SearchForm onSearch={handleSearch} isLoading={isLoading} />
                    </div>

                    <div className="flex-1 flex flex-col">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mx-4 mt-4 text-sm text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        {!searchResult && !isLoading && !error && (
                            <div className="text-center mt-12 px-8 opacity-60">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce delay-1000">
                                    <span className="text-4xl grayscale">🚖</span>
                                </div>
                                <h3 className="text-gray-900 font-bold text-lg mb-2">Where to next?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Compare real-time prices across Uber, Rapido, and Namma Yatri instantly.
                                </p>
                            </div>
                        )}

                        {searchResult && (
                            <RideList 
                                options={searchResult.options} 
                                distance={searchResult.details.distance}
                                duration={searchResult.details.duration}
                                onSelectRide={handleRideSelect}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default App;