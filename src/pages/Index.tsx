
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ClipboardList, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent py-2">
            MSIG Sokxay Admin Away Log
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track and manage field work activities with ease. Designed for admin officers working outside the office.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mt-12">
          <div className="glass-card rounded-xl p-6 text-left hover:shadow-lg transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Report Activity</h2>
            <p className="text-muted-foreground mb-4">
              Log your field work with details such as purpose, location, and photo evidence.
            </p>
            <Button 
              onClick={() => navigate("/report")} 
              className="glass-button w-full mt-2 group"
            >
              Report Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="glass-card rounded-xl p-6 text-left hover:shadow-lg transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
            <p className="text-muted-foreground mb-4">
              Monitor field activities, view reports, and analyze data with powerful visualization tools.
            </p>
            <Button 
              onClick={() => navigate("/admin")} 
              variant="outline" 
              className="w-full mt-2 group"
            >
              View Dashboard
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
