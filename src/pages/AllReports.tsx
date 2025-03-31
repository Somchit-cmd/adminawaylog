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
  MoreHorizontal,
  Image as ImageIcon,
  MapPin,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getReports, ReportData } from "@/utils/firebase";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Update the Report interface to match ReportData but make id required
type Report = Required<Pick<ReportData, 'id'>> & Omit<ReportData, 'id'> & {
  photoBase64?: string;
};

const AllReports = () => {
  const { t } = useTranslation();
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
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
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('report.form.photo')}</TableHead>
                      <TableHead>{t('report.form.userName')}</TableHead>
                      <TableHead>{t('report.form.purpose')}</TableHead>
                      <TableHead>{t('report.form.timeOut')}</TableHead>
                      <TableHead>{t('report.form.timeIn')}</TableHead>
                      <TableHead>{t('report.form.vehicle')}</TableHead>
                      <TableHead>{t('report.form.location')}</TableHead>
                      <TableHead>{t('report.form.notes')}</TableHead>
                      <TableHead className="w-[100px]">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          {report.photoBase64 ? (
                            <div 
                              className="relative w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setSelectedImage(report.photoBase64)}
                            >
                              <img
                                src={report.photoBase64}
                                alt={`${report.userName}'s photo`}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{report.userName}</TableCell>
                        <TableCell>{report.purpose}</TableCell>
                        <TableCell>{format(new Date(report.timeOut), 'PPp')}</TableCell>
                        <TableCell>{format(new Date(report.timeIn), 'PPp')}</TableCell>
                        <TableCell>{report.vehicle}</TableCell>
                        <TableCell>
                          {report.location ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a
                                    href={getGoogleMapsUrl(report.location.lat, report.location.lng)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-primary hover:underline"
                                  >
                                    <MapPin className="h-4 w-4" />
                                    <span>{`${report.location.lat.toFixed(6)}, ${report.location.lng.toFixed(6)}`}</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t('admin.openInMaps')}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{report.notes || '-'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('report.viewPhoto')}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-video">
            <img
              src={selectedImage || ''}
              alt="Report photo"
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllReports; 