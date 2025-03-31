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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReportCard from "@/components/ReportCard";
import { getReports, ReportData } from "@/utils/firebase";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";

// Update the Report interface to match ReportData but make id required
type Report = Required<Pick<ReportData, 'id'>> & Omit<ReportData, 'id'>;

const AllReports = () => {
  const { t } = useTranslation();
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
          const reportsWithId = data.map(report => ({
            ...report,
            id: report.id || `temp-${Date.now()}-${Math.random()}`
          }));
          setFilteredReports(reportsWithId);
        }
      }
    }
  });

  useEffect(() => {
    if (!reports) return;
    
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
      toast.error(t('admin.noReportsToExport'));
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
    
    toast.success(t('admin.exportSuccess'));
  };

  const handleDateFilterClear = () => {
    setSelectedDate(null);
  };

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
            <h1 className="text-2xl font-bold mb-2">{t('admin.reports')}</h1>
            <p className="text-muted-foreground">
              {t('admin.filterReports')}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="flex items-center gap-2"
            disabled={filteredReports.length === 0}
          >
            <Download className="h-4 w-4" />
            {t('admin.exportReports')}
          </Button>
        </div>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('admin.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={selectedDate || ""}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-[200px]"
                />
                <Button variant="outline" className="gap-2" onClick={handleDateFilterClear}>
                  <RefreshCw className="h-4 w-4" />
                  {t('admin.clearDate')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllReports; 