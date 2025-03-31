import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardIcon, CameraIcon, UploadIcon, MapPinIcon } from "lucide-react";
import React from "react";

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

  // Hidden file input ref for upload
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  // Handle camera capture
  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Wait for video to load
      video.onloadedmetadata = () => {
        // Draw video frame to canvas
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
            setFormData({ ...formData, photo: file });
          }
          // Stop camera
          stream.getTracks().forEach(track => track.stop());
        }, 'image/jpeg');
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  // Handle location capture
  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({ ...formData, location: `${latitude},${longitude}` });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
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
              <Button type="button" onClick={handleCamera} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <CameraIcon className="h-4 w-4 mr-2" />
                {t('report.form.camera')}
              </Button>
              <Button type="button" onClick={handleUpload} variant="outline" className="w-full">
                <UploadIcon className="h-4 w-4 mr-2" />
                {t('report.form.uploadImage')}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {formData.photo && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Selected"
                  className="max-h-40 rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t('report.form.location')}</Label>
            <Button type="button" onClick={handleLocation} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <MapPinIcon className="h-4 w-4 mr-2" />
              {t('report.form.captureCurrentLocation')}
            </Button>
            {formData.location && (
              <p className="text-sm text-muted-foreground mt-2">
                {t('report.form.locationCaptured')}: {formData.location}
              </p>
            )}
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