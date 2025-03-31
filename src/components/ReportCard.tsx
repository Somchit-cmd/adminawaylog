import React from "react";
import { Clock, MapPin, Car, FileText, LogIn, LogOut } from "lucide-react";
import { formatDistance, format } from "date-fns";
import { ReportData } from "@/utils/firebase";
import { useTranslation } from "react-i18next";

// Use the ReportData from firebase but make id required
type Report = Required<Pick<ReportData, 'id'>> & Omit<ReportData, 'id'>;

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const { t } = useTranslation();
  
  const formatDateTime = (date: Date) => {
    return format(date, "MMM d, yyyy - hh:mm aa");
  };
  
  const timeAgo = formatDistance(new Date(report.timestamp), new Date(), {
    addSuffix: true,
  });
  
  const duration = formatDistance(
    new Date(report.timeIn),
    new Date(report.timeOut),
    { includeSeconds: false }
  );

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="relative h-48">
        <img
          src={report.photoBase64}
          alt={`Photo for ${report.purpose}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-primary text-white rounded-md mb-2">
            {timeAgo}
          </span>
          <h3 className="text-white font-semibold text-lg line-clamp-1">{report.purpose}</h3>
          <p className="text-white/90 text-sm">{report.userName}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <LogOut className="h-4 w-4 mr-1" />
          <span className="font-medium">{t('reportCard.startTime')}:</span>
          <span>{formatDateTime(new Date(report.timeOut))}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <LogIn className="h-4 w-4 mr-1" />
          <span className="font-medium">{t('reportCard.returnTime')}:</span>
          <span>{formatDateTime(new Date(report.timeIn))}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <Clock className="h-4 w-4 mr-1" />
          <span className="font-medium">{t('reportCard.duration')}:</span>
          <span>{duration}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <Car className="h-4 w-4 mr-1" />
          <span className="font-medium">{t('reportCard.vehicle')}:</span>
          <span>{report.vehicle}</span>
        </div>
        
        {report.notes && (
          <div className="flex items-start text-sm text-muted-foreground gap-1">
            <FileText className="h-4 w-4 mr-1 mt-0.5" />
            <span className="font-medium">{t('reportCard.notes')}:</span>
            <span className="line-clamp-2">{report.notes}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="font-medium">{t('reportCard.location')}:</span>
          <span className="truncate">
            {`${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
