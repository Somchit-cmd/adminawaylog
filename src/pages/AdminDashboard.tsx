import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Loader2, 
  RefreshCw,
  LogOut,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportCard from "@/components/ReportCard";
import { getReports, ReportData } from "@/utils/firebase";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// Update the Report interface to match ReportData but make id required
type Report = Required<Pick<ReportData, 'id'>> & Omit<ReportData, 'id'>;

const CHART_COLORS = ['#0ea5e9', '#f43f5e', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#8b5cf6'];

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { 
    data: reports = [], 
    isLoading, 
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
    meta: {
      onSettled: (data: ReportData[] | undefined, error: any) => {
        if (error) {
          console.error("Error fetching reports:", error);
          toast.error(t('common.error'));
          return;
        }
        
        if (data) {
          // Ensure all reports have an id (fallback to empty string if undefined)
          const reportsWithId = data.map(report => ({
            ...report,
            id: report.id || `temp-${Date.now()}-${Math.random()}`
          }));
          setFilteredReports(reportsWithId);
        }
      }
    }
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('common.success'));
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(t('common.error'));
    }
  };

  useEffect(() => {
    if (!reports) return;
    
    // Ensure all reports have an id
    const reportsWithId = reports.map(report => ({
      ...report,
      id: report.id || `temp-${Date.now()}-${Math.random()}`
    })) as Report[];
    
    let results = reportsWithId;

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
    if (filteredReports.length === 0) {
      toast.error("No reports to export");
      return;
    }
    
    const headers = "ID,Name,Purpose,Start Time,Return Time,Vehicle,Notes,Location,Timestamp\n";
    const csv = filteredReports.reduce((acc, report) => {
      const row = [
        report.id,
        report.userName,
        report.purpose,
        new Date(report.timeOut).toLocaleString(),
        new Date(report.timeIn).toLocaleString(),
        report.vehicle,
        report.notes || "",
        `${report.location.lat},${report.location.lng}`,
        new Date(report.timestamp).toLocaleString()
      ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(",");
      
      return acc + row + "\n";
    }, headers);
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Reports exported successfully!");
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleDateFilterClear = () => {
    setSelectedDate(null);
  };

  const analytics = {
    totalReports: filteredReports.length,
    mostCommonPurpose: getMostCommon(filteredReports, 'purpose'),
    mostActiveUser: getMostCommon(filteredReports, 'userName'),
    averageTimeOut: getAverageTimeOut(filteredReports)
  };

  function getMostCommon(items: any[], key: string): string {
    if (items.length === 0) return "N/A";
    
    const counts: Record<string, number> = {};
    items.forEach(item => {
      const value = item[key];
      counts[value] = (counts[value] || 0) + 1;
    });
    
    const mostCommon = Object.entries(counts).reduce(
      (max, [value, count]) => count > max[1] ? [value, count] : max, 
      ["", 0]
    );
    
    return mostCommon[0];
  }

  function getAverageTimeOut(items: Report[]): string {
    if (items.length === 0) return "N/A";
    
    const totalMinutes = items.reduce((total, report) => {
      const start = new Date(report.timeOut).getTime();
      const end = new Date(report.timeIn).getTime();
      return total + (end - start) / (1000 * 60);
    }, 0);
    
    const avgMinutes = totalMinutes / items.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    
    return `${hours} h ${minutes} min`;
  }

  const today = format(new Date(), "yyyy-MM-dd");

  const getChartData = () => {
    if (filteredReports.length === 0) return { vehicles: [] };

    const vehicleCounts: Record<string, number> = {};

    filteredReports.forEach(report => {
      // Count vehicles
      vehicleCounts[report.vehicle] = (vehicleCounts[report.vehicle] || 0) + 1;
    });

    const vehicles = Object.entries(vehicleCounts)
      .map(([name, value]) => ({ 
        name, // Use the vehicle name directly
        value 
      }))
      .sort((a, b) => b.value - a.value);

    return { vehicles };
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div>
        <br />
        <br />  
        <br />
      </div>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t('admin.dashboard')}</h1>
            <p className="text-muted-foreground">
              {t('admin.filterReports')}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 h-10"
          >
            <LogOut className="h-4 w-4" />
            {t('common.logout')}
          </Button>
        </div>

        <div className="grid gap-6 mb-8 lg:grid-cols-3">
          <Card className="glass-card col-span-3 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{t('admin.recentActivities')}</CardTitle>
              <Link 
                to="/admin/reports" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {t('admin.allReports')}
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t('admin.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" className="gap-2" onClick={handleDateFilterClear}>
                    <RefreshCw className="h-4 w-4" />
                    {t('admin.clearSearch')}
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('admin.noReports')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredReports.slice(0, 6).map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card col-span-3 lg:col-span-1">
            <CardHeader>
              <CardTitle>{t('admin.analytics.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="summary" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {t('admin.analytics.tabs.summary')}
                  </TabsTrigger>
                  <TabsTrigger value="charts" className="flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4" />
                    {t('admin.analytics.tabs.charts')}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t('admin.analytics.totalReports')}
                      </h3>
                      <p className="text-2xl font-bold">{analytics.totalReports}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t('admin.analytics.mostCommonPurpose')}
                      </h3>
                      <p className="text-2xl font-bold">{analytics.mostCommonPurpose}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t('admin.analytics.mostActiveUser')}
                      </h3>
                      <p className="text-2xl font-bold">{analytics.mostActiveUser}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t('admin.analytics.averageTimeOut')}
                      </h3>
                      <p className="text-2xl font-bold">
                        {t('admin.analytics.timeFormat', {
                          hours: analytics.averageTimeOut.split(' ')[0],
                          minutes: analytics.averageTimeOut.split(' ')[2]
                        })}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="charts">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">
                      {t('admin.analytics.charts.vehicleUsage')}
                    </h3>
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData.vehicles}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.vehicles.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
