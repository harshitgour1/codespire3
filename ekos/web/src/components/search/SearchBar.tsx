import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-2xl group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-primary/5 border border-primary/10 overflow-hidden transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/10">
        <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Ask anything about your company..." 
          className="pl-12 h-14 text-lg border-none shadow-none focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch(e.currentTarget.value);
            }
          }}
        />
        <div className="absolute right-4 top-4 flex items-center gap-2 pointer-events-none">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md border">⌘ K</span>
        </div>
      </div>
    </motion.div>
  );
}
