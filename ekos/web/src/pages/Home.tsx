import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { SearchBar } from "@/components/search/SearchBar";
import { motion } from "framer-motion";
import { FileText, Calendar, Network, ArrowRight } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-5xl mx-auto space-y-12 p-8 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-secondary/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-6 relative z-10"
      >
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-secondary/30 px-3 py-1 text-sm font-medium text-primary backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          v1.0 Beta is Live
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl drop-shadow-sm">
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-600">Enterprise</span> Brain.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Stop searching, start finding. EKOS connects your documents, meetings, and workflows into one intelligent operating system.
        </p>
      </motion.div>

      <div className="w-full flex justify-center z-10">
        <SearchBar onSearch={(q) => console.log(q)} />
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full z-10"
      >
        <motion.div variants={item}>
          <Card className="group hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300 cursor-pointer border-primary/10 bg-white/50 backdrop-blur-sm hover:-translate-y-1">
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">Recent Docs</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
              <div className="pt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="group hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300 cursor-pointer border-primary/10 bg-white/50 backdrop-blur-sm hover:-translate-y-1">
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">Upcoming Meetings</CardTitle>
              <CardDescription>Prepare for your day</CardDescription>
              <div className="pt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                View schedule <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="group hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300 cursor-pointer border-primary/10 bg-white/50 backdrop-blur-sm hover:-translate-y-1">
            <CardHeader>
              <div className="mb-4 h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Network className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">Knowledge Graph</CardTitle>
              <CardDescription>Explore connections</CardDescription>
              <div className="pt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open graph <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
