import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function ImageUpload({ onImageSelect, isProcessing }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndUpload(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      validateAndUpload(files[0]);
    }
  }, []);

  const validateAndUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    onImageSelect(file);
  };

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/10 scale-105"
          : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/50"
      } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label className="flex flex-col items-center justify-center px-8 py-16 cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10 backdrop-blur-sm">
            {isDragging ? (
              <ImageIcon className="w-10 h-10 text-primary animate-scale-in" />
            ) : (
              <Upload className="w-10 h-10 text-primary" />
            )}
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-foreground">
              {isDragging ? "Drop your image here" : "Upload black & white image"}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-muted-foreground/70">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
      </label>
    </div>
  );
}
