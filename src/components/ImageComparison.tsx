import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageComparisonProps {
  originalImage: string;
  colorizedImage: string;
}

export default function ImageComparison({ originalImage, colorizedImage }: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'click') return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(colorizedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `colorized-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl cursor-col-resize select-none"
        style={{ aspectRatio: '16/9' }}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onClick={handleMove}
      >
        {/* Colorized Image (Background) */}
        <img
          src={colorizedImage}
          alt="Colorized"
          className="absolute inset-0 w-full h-full object-contain bg-card"
        />

        {/* Original Image (Overlay with clip) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={originalImage}
            alt="Original"
            className="absolute inset-0 w-full h-full object-contain bg-card"
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary cursor-col-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary border-4 border-background shadow-lg flex items-center justify-center">
            <div className="w-1 h-4 bg-background rounded-full" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium">
          Original
        </div>
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium">
          Colorized
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleDownload}
          size="lg"
          className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity"
        >
          <Download className="w-5 h-5" />
          Download Colorized Image
        </Button>
      </div>
    </div>
  );
}
