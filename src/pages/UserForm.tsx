
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
      toast.error("Please capture your current location");
      return;
    }

    if (!photo) {
      toast.error("Please take a photo as evidence");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save the report to Firebase with the photo and base64 string
      const reportId = await saveReportWithPhoto({
        ...data,
        location,
      }, photo, photoBase64 || undefined);

      toast.success("Report submitted successfully!");
      
      // Reset form after successful submission
      reset();
      setLocation(null);
      setPhoto(null);
      setPhotoBase64(null);
      
      // Navigate home after submission
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
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
              <CardTitle>Report Field Activity</CardTitle>
              <CardDescription>
                Fill the form with details of your work outside the office
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="userName">Your Name</Label>
                <Input
                  id="userName"
                  placeholder="Enter your full name"
                  className="form-input"
                  {...register("userName", { required: "Name is required" })}
                />
                {errors.userName && (
                  <p className="text-sm text-destructive">{errors.userName.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="purpose">Purpose of Trip</Label>
                <Input
                  id="purpose"
                  placeholder="Why are you going out?"
                  className="form-input"
                  {...register("purpose", { required: "Purpose is required" })}
                />
                {errors.purpose && (
                  <p className="text-sm text-destructive">{errors.purpose.message}</p>
                )}
              </div>

              <div className={isMobile ? "grid gap-4" : "grid grid-cols-2 gap-4"}>
                <div className="grid gap-3">
                  <Label htmlFor="timeOut">Start Time</Label>
                  <Input
                    id="timeOut"
                    type="datetime-local"
                    className="form-input"
                    {...register("timeOut", { required: "Start time is required" })}
                  />
                  {errors.timeOut && (
                    <p className="text-sm text-destructive">{errors.timeOut.message}</p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="timeIn">Return Time</Label>
                  <Input
                    id="timeIn"
                    type="datetime-local"
                    className="form-input"
                    {...register("timeIn", { required: "Return time is required" })}
                  />
                  {errors.timeIn && (
                    <p className="text-sm text-destructive">{errors.timeIn.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="vehicle">Vehicle Used</Label>
                <Controller
                  name="vehicle"
                  control={control}
                  rules={{ required: "Vehicle is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="vehicle" className="w-full">
                        <SelectValue placeholder="Select a vehicle" />
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
                <Label>Evidence Photo</Label>
                <PhotoUpload onPhotoCapture={(file, base64) => {
                  setPhoto(file);
                  setPhotoBase64(base64);
                }} />
              </div>

              <div className="grid gap-3">
                <Label>Current Location</Label>
                <LocationPicker onLocationSelect={(loc) => setLocation(loc)} />
                {location && (
                  <p className="text-xs text-muted-foreground">
                    Captured location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional details about your trip..."
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
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserForm;
