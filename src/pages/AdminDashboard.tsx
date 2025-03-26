
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Loader2, 
  Map as MapIcon, 
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportCard from "@/components/ReportCard";
import { getReports } from "@/utils/firebase";

interface Report {
  id: string;
  userName: string;
  purpose: string;
  timeOut: string;
  timeIn: string;
  vehicle: string;
  photoUrl: string;
  location: { lat: number; lng: number };
  notes?: string;
  timestamp: string;
}

const AdminDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        console.error("Error loading reports:", error);
        toast.error("Failed to load reports");
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  useEffect(() => {
    // Apply filters whenever search or date changes
    let results = reports;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (report) =>
          report.userName.toLowerCase().includes(term) ||
          report.purpose.toLowerCase().includes(term) ||
          report.vehicle.toLowerCase().includes(term) ||
          (report.notes && report.notes.toLowerCase().includes(term))
      );
    }

    if (selectedDate) {
      const date = new Date(selectedDate).toDateString();
      results = results.filter(
        (report) => new Date(report.timeOut).toDateString() === date
      );
    }

    setFilteredReports(results);
  }, [searchTerm, selectedDate, reports]);

  const handleExport = () => {
    // In a real app, this would generate CSV or Excel
    toast.success("Reports exported successfully!");
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await getReports();
      setReports(data);
      setFilteredReports(data);
      toast.success("Reports refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing reports:", error);
      toast.error("Failed to refresh reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateFilterClear = () => {
    setSelectedDate(null);
  };

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="w-full">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage field activities of admin officers
        </p>
      </div>

      <div className="grid gap-6 mb-8 lg:grid-cols-3">
        <Card className="glass-card col-span-3 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">
                Recent Activities
              </CardTitle>
              <CardDescription>
                Filter and view field work reports
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, purpose, or vehicle..."
                  className="pl-9 form-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative sm:w-48">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-9 form-input"
                  value={selectedDate || ""}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={today}
                />
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-5 w-5"
                    onClick={handleDateFilterClear}
                  >
                    <Filter className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reports found</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card col-span-3 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Analytics</CardTitle>
            <CardDescription>
              Summary of field activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="pt-4">
                <div className="space-y-4">
                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Reports</p>
                    <p className="text-3xl font-bold">{reports.length}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Most Common Purpose</p>
                    <p className="text-xl font-semibold">Client Meeting</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Most Active User</p>
                    <p className="text-xl font-semibold">John Doe</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Average Time Out</p>
                    <p className="text-xl font-semibold">3.5 hours</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="map" className="pt-4">
                <div className="aspect-square rounded-lg bg-muted relative flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapIcon className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Google Maps integration will be available here
                    </p>
                    <Button variant="outline" size="sm" disabled>
                      View Map
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
