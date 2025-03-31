import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardIcon, CameraIcon, UploadIcon, MapPinIcon } from "lucide-react";

export function Report() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    userName: "",
    purpose: "",
    timeOut: "",
    timeIn: "",
    vehicle: "",
    photo: null as File | null,
    location: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="container max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <ClipboardIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{t('report.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('report.form.description')}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">{t('report.form.userName')}</Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder={t('report.form.placeholders.userName')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">{t('report.form.purpose')}</Label>
            <Input
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder={t('report.form.placeholders.purpose')}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeOut">{t('report.form.timeOut')}</Label>
              <Input
                id="timeOut"
                type="datetime-local"
                value={formData.timeOut}
                onChange={(e) => setFormData({ ...formData, timeOut: e.target.value })}
                placeholder={t('report.form.placeholders.dateFormat')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeIn">{t('report.form.timeIn')}</Label>
              <Input
                id="timeIn"
                type="datetime-local"
                value={formData.timeIn}
                onChange={(e) => setFormData({ ...formData, timeIn: e.target.value })}
                placeholder={t('report.form.placeholders.dateFormat')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle">{t('report.form.vehicle')}</Label>
            <Select value={formData.vehicle} onValueChange={(value) => setFormData({ ...formData, vehicle: value })}>
              <SelectTrigger>
                <SelectValue placeholder={t('report.form.placeholders.vehicle')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="honda-wave-1293">{t('admin.vehicles.honda-wave-1293')}</SelectItem>
                <SelectItem value="honda-wave-6998">{t('admin.vehicles.honda-wave-6998')}</SelectItem>
                <SelectItem value="honda-wave-0346">{t('admin.vehicles.honda-wave-0346')}</SelectItem>
                <SelectItem value="honda-move-9257">{t('admin.vehicles.honda-move-9257')}</SelectItem>
                <SelectItem value="honda-click-0353">{t('admin.vehicles.honda-click-0353')}</SelectItem>
                <SelectItem value="toyota-revo-1188">{t('admin.vehicles.toyota-revo-1188')}</SelectItem>
                <SelectItem value="toyota-vios-1188">{t('admin.vehicles.toyota-vios-1188')}</SelectItem>
                <SelectItem value="toyota-vigo-5609">{t('admin.vehicles.toyota-vigo-5609')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('report.form.photo')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <CameraIcon className="h-4 w-4 mr-2" />
                {t('report.form.camera')}
              </Button>
              <Button type="button" variant="outline" className="w-full">
                <UploadIcon className="h-4 w-4 mr-2" />
                {t('report.form.uploadImage')}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('report.form.location')}</Label>
            <Button type="button" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <MapPinIcon className="h-4 w-4 mr-2" />
              {t('report.form.captureCurrentLocation')}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('report.form.notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('report.form.placeholders.notes')}
              className="min-h-[100px] resize-none"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            {t('report.form.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}