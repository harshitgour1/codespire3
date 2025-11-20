import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters } from "@/components/search/SearchFilters";
import { CitationCard } from "@/components/search/CitationCard";
import { TimelineView } from "@/components/search/TimelineView";
import { ActionPanel } from "@/components/search/ActionPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { queryAPI } from "@/services/api";
import type { QueryResponse } from "@/types/api";
import { Sparkles, BookOpen, FileText, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

const SUGGESTED_QUERIES = [
  "What were our Q3 revenue results?",
  "Show me the engineering meeting notes",
  "What's the login flow design?",
  "Recent product roadmap updates",
  "Customer feedback analysis"
];

export default function Search() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Check if query was passed from navigation (only once on mount)
  useEffect(() => {
    const state = location.state as { query?: string } | null;
    if (state?.query && !query) {
      // Set the query and perform search when navigating from home page
      setQuery(state.query);
      handleSearch(state.query);
      // Clear location state after using it
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setLoading(true);
    
    // Add to history
    setSearchHistory(prev => {
      const newHistory = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5);
      return newHistory;
    });

    try {
      const response = await queryAPI.search({
        query: searchQuery,
        top_k: 5,
        include_citations: true,
      });
      setResults(response);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              AI-Powered Search
            </h1>
            <p className="text-sm text-muted-foreground">
              Search across all your documents, meetings, and conversations
            </p>
          </div>
        </div>
        <SearchBar onSearch={handleSearch} initialValue={query} />
      </motion.div>

      {/* Results */}
      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Filters Sidebar */}
        <div className="w-64 hidden lg:block shrink-0 space-y-4">
          <SearchFilters />
          
          {/* Search History */}
          {searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {searchHistory.map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearch(query)}
                        className="w-full text-left text-xs p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground truncate"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto space-y-6 pb-10">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </motion.div>
            ) : results ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Answer Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl p-6 border border-primary/10 relative overflow-hidden"
                >
                  {/* Decorative background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -z-0" />
                  
                  <div className="flex items-start gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-foreground mb-2">
                        Answer
                      </h2>
                      <p className="text-foreground leading-relaxed">
                        {results.answer}
                      </p>
                    </div>
                  </div>
                  {results.summary && (
                    <div className="mt-4 pt-4 border-t border-primary/10 relative z-10">
                      <p className="text-sm text-muted-foreground italic">
                        <strong>Summary:</strong> {results.summary}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Timeline */}
                {results.timeline && results.timeline.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <TimelineView items={results.timeline} />
                  </motion.div>
                )}

                {/* Actions */}
                {results.actions && results.actions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ActionPanel actions={results.actions} />
                  </motion.div>
                )}

                {/* Citations */}
                {results.citations && results.citations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Sources ({results.citations.length})
                    </h3>
                    <div className="space-y-3">
                      {results.citations.map((citation, index) => (
                        <CitationCard key={index} citation={citation} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-6"
              >
                <div className="p-6 rounded-full bg-muted/50 mb-6">
                  <Sparkles className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Start Your Search
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Enter a query above to search across your entire knowledge base. Try asking about projects, meetings, or documents.
                  </p>
                </div>

                {/* Suggested Queries */}
                <div className="w-full max-w-2xl space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="h-4 w-4" />
                    <span>Try these examples:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {SUGGESTED_QUERIES.map((query, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleSearch(query)}
                        className="p-3 text-left text-sm rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                      >
                        <span className="text-foreground group-hover:text-primary transition-colors">
                          {query}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
