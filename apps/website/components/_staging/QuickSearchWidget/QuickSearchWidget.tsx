import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import type { KeyboardEvent } from "react";

interface QuickSearchWidgetProps {
  onSearch?: (query: string) => void;
  recentSearches?: string[];
  popularSearches?: string[];
}

export default function QuickSearchWidget({
  onSearch,
  recentSearches = ["Reanimation", "Anaphylaxie", "Adrenalin"],
  popularSearches = ["ACS", "Schlaganfall", "Intubation", "STEMI"],
}: QuickSearchWidgetProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch?.(searchQuery);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    handleSearch(trimmedQuery);
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative mb-6">
        <div
          className={`flex items-center gap-4 bg-white rounded-2xl p-4 border-4 transition-all ${
            isFocused
              ? "border-blue-600 shadow-2xl"
              : "border-gray-300 shadow-lg"
          }`}
        >
          <Search className="w-8 h-8 text-gray-600 shrink-0" strokeWidth={3} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Suche: Protokoll, Medikament..."
            className="flex-1 text-xl md:text-2xl font-semibold text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center shrink-0 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Access Pills */}
      {!query && (
        <div className="space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                <h3 className="text-lg font-black text-gray-700 uppercase">
                  Zuletzt
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {recentSearches.map((search, index) => (
                  <button
                    type="button"
                    key={`${search}-${index}`}
                    onClick={() => handleSearch(search)}
                    className="px-5 py-3 bg-gray-100 hover:bg-blue-100 border-3 border-gray-300 hover:border-blue-400 rounded-xl text-lg font-bold text-gray-900 transition-all"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {popularSearches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                <h3 className="text-lg font-black text-gray-700 uppercase">
                  Beliebt
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {popularSearches.map((search, index) => (
                  <button
                    type="button"
                    key={`${search}-${index}`}
                    onClick={() => handleSearch(search)}
                    className="px-5 py-3 bg-blue-50 hover:bg-blue-100 border-3 border-blue-300 hover:border-blue-500 rounded-xl text-lg font-bold text-blue-900 transition-all"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Active State */}
      {query && (
        <div className="bg-blue-50 border-4 border-blue-300 rounded-2xl p-6 text-center">
          <Search className="w-12 h-12 text-blue-600 mx-auto mb-3" strokeWidth={2.5} />
          <p className="text-xl font-bold text-gray-900">
            Suche nach: <span className="text-blue-700">"{query}"</span>
          </p>
          <p className="text-base text-gray-600 font-medium mt-2">
            Drücken Sie Enter oder integrieren Sie Search-Handler
          </p>
        </div>
      )}
    </div>
  );
}
