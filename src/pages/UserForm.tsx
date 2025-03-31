import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationPicker from "@/components/LocationPicker";
import PhotoUpload from "@/components/PhotoUpload";
import { saveReportWithPhoto, vehicleOptions } from "@/utils/firebase";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";

interface FormValues {
  userName: string;
  purpose: string;
  timeOut: string;
  timeIn: string;
  vehicle: string;
  notes?: string;
}

const UserForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    if (!location) {
      toast.error(t('report.form.errors.locationRequired'));
      return;
    }

    if (!photo) {
      toast.error(t('report.form.errors.photoRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const reportId = await saveReportWithPhoto({
        ...data,
        location,
      }, photo, photoBase64 || undefined);

      toast.success(t('report.form.success'));
      
      reset();
      setLocation(null);
      setPhoto(null);
      setPhotoBase64(null);
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(t('report.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{t('report.title')}</CardTitle>
              <CardDescription>
                {t('report.form.description')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="userName">{t('report.form.userName')}</Label>
                <Input
                  id="userName"
                  placeholder={t('report.form.placeholders.userName')}
                  className="form-input"
                  {...register("userName", { required: t('report.form.errors.nameRequired') })}
                />
                {errors.userName && (
                  <p className="text-sm text-destructive">{errors.userName.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="purpose">{t('report.form.purpose')}</Label>
                <Input
                  id="purpose"
                  placeholder={t('report.form.placeholders.purpose')}
                  className="form-input"
                  {...register("purpose", { required: t('report.form.errors.purposeRequired') })}
                />
                {errors.purpose && (
                  <p className="text-sm text-destructive">{errors.purpose.message}</p>
                )}
              </div>

              <div className={isMobile ? "grid gap-4" : "grid grid-cols-2 gap-4"}>
                <div className="grid gap-3">
                  <Label htmlFor="timeOut">{t('report.form.timeOut')}</Label>
                  <Input
                    id="timeOut"
                    type="datetime-local"
                    className="form-input"
                    {...register("timeOut", { required: t('report.form.errors.timeOutRequired') })}
                  />
                  {errors.timeOut && (
                    <p className="text-sm text-destructive">{errors.timeOut.message}</p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="timeIn">{t('report.form.timeIn')}</Label>
                  <Input
                    id="timeIn"
                    type="datetime-local"
                    className="form-input"
                    {...register("timeIn", { required: t('report.form.errors.timeInRequired') })}
                  />
                  {errors.timeIn && (
                    <p className="text-sm text-destructive">{errors.timeIn.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="vehicle">{t('report.form.vehicle')}</Label>
                <Controller
                  name="vehicle"
                  control={control}
                  rules={{ required: t('report.form.errors.vehicleRequired') }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="vehicle" className="w-full">
                        <SelectValue placeholder={t('report.form.placeholders.vehicle')} />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleOptions.map((vehicle) => (
                          <SelectItem key={vehicle} value={vehicle}>
                            {vehicle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.vehicle && (
                  <p className="text-sm text-destructive">{errors.vehicle.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label>{t('report.form.photo')}</Label>
                <PhotoUpload onPhotoCapture={(file, base64) => {
                  setPhoto(file);
                  setPhotoBase64(base64);
                }} />
              </div>

              <div className="grid gap-3">
                <Label>{t('report.form.location')}</Label>
                <LocationPicker onLocationSelect={(loc) => setLocation(loc)} />
                {location && (
                  <p className="text-xs text-muted-foreground">
                    {t('report.form.locationCaptured')}: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="notes">{t('report.form.notes')}</Label>
                <Textarea
                  id="notes"
                  placeholder={t('report.form.placeholders.notes')}
                  className="form-input min-h-[100px]"
                  {...register("notes")}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="glass-button w-full h-12 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('report.form.submitting')}
                </>
              ) : (
                t('report.form.submit')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserForm;
