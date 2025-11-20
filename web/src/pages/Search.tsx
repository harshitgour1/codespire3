import { SearchBar } from "@/components/search/SearchBar";
import { ResultCard } from "@/components/search/ResultCard";
import { SearchFilters } from "@/components/search/SearchFilters";

export default function Search() {
  return (
    <div className="container mx-auto p-6 space-y-6 h-full flex flex-col">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Global Search</h1>
        <SearchBar onSearch={(q) => console.log(q)} />
      </div>
      
      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="w-64 hidden md:block shrink-0">
          <SearchFilters />
        </div>
        
        <div className="flex-1 overflow-auto space-y-4 pb-10">
          <ResultCard 
            title="Q3 Financial Report" 
            type="document" 
            snippet="The Q3 financial results show a 20% increase in revenue compared to the previous quarter..." 
            date="Oct 24, 2023" 
            source="Google Drive" 
          />
          <ResultCard 
            title="Product Roadmap Discussion" 
            type="meeting" 
            snippet="Alex: We need to prioritize the mobile app launch. Sarah: Agreed, let's move the deadline to..." 
            date="Oct 22, 2023" 
            source="Zoom" 
          />
          <ResultCard 
            title="Login Flow Mockups" 
            type="image" 
            snippet="Found text: 'Sign In', 'Forgot Password', 'Create Account'..." 
            date="Oct 20, 2023" 
            source="Figma" 
          />
        </div>
      </div>
    </div>
  );
}
