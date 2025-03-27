
import React, { useState, useRef } from "react";
import { Camera, X, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface PhotoUploadProps {
  onPhotoCapture: (file: File, base64: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoCapture }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const compressImage = (file: File): Promise<{ file: File, base64: string }> => {
    return new Promise((resolve, reject) => {
      setCompressing(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Create canvas for image compression
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Adjust quality based on original file size
          let quality = 0.7; // Default quality
          if (file.size > 3 * 1024 * 1024) { // If over 3MB
            quality = 0.5;
          } else if (file.size > 1 * 1024 * 1024) { // If over 1MB
            quality = 0.6;
          }
          
          // Convert to base64 with compression
          const base64String = canvas.toDataURL('image/jpeg', quality);
          
          // Convert base64 to file
          fetch(base64String)
            .then(res => res.blob())
            .then(blob => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              
              setCompressing(false);
              resolve({
                file: compressedFile,
                base64: base64String
              });
            })
            .catch(err => {
              setCompressing(false);
              reject(err);
            });
        };
        img.onerror = (error) => {
          setCompressing(false);
          reject(error);
        };
      };
      reader.onerror = (error) => {
        setCompressing(false);
        reject(error);
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    
    try {
      toast.info("Processing image...");
      
      // Compress the image
      const { file: compressedFile, base64 } = await compressImage(file);
      
      // Check compressed file size
      if (compressedFile.size > 1 * 1024 * 1024) {
        toast.error("Image is still too large after compression. Please try a different photo.");
        return;
      }
      
      setPreview(base64);
      onPhotoCapture(compressedFile, base64);
      toast.success("Image processed successfully");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image. Please try again.");
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        capture={isMobile ? "environment" : undefined}
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        id="photo-upload"
      />
      
      <div className="flex flex-col gap-3">
        {!preview ? (
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="glass-button flex-1 flex items-center justify-center gap-2"
              disabled={compressing}
            >
              <Camera className="h-4 w-4" />
              {isMobile ? "Take Photo" : "Camera"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2"
              disabled={compressing}
            >
              <ImageUp className="h-4 w-4" />
              Upload Image
            </Button>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg shadow-md" 
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={clearImage}
              disabled={compressing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {compressing && (
          <div className="text-center text-sm text-muted-foreground">
            Compressing image...
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
