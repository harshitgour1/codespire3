import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
      <Input 
        placeholder="Search across documents, meetings, and more..." 
        className="pl-12 h-12 text-lg shadow-sm"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
}
