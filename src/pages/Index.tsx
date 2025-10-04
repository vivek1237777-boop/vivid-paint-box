import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import ImageComparison from "@/components/ImageComparison";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [originalImage, setOriginalImage] = useState<string>("");
  const [colorizedImage, setColorizedImage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = async (file: File) => {
    setIsProcessing(true);
    setColorizedImage("");

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setOriginalImage(base64Image);

        try {
          // Call the colorization function
          const { data, error } = await supabase.functions.invoke('colorize-image', {
            body: { imageData: base64Image }
          });

          if (error) {
            console.error('Function error:', error);
            throw error;
          }

          if (!data?.colorizedImage) {
            throw new Error('No colorized image returned');
          }

          setColorizedImage(data.colorizedImage);
          
          toast({
            title: "Success!",
            description: "Your image has been colorized",
          });
        } catch (error) {
          console.error('Colorization error:', error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to colorize image. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read image file",
          variant: "destructive",
        });
        setIsProcessing(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-bg)] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Colorization</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Bring Your Photos to Life
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform black and white images into vibrant, realistic color photos using advanced AI
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!originalImage && !isProcessing && (
            <div className="animate-scale-in">
              <ImageUpload onImageSelect={handleImageSelect} isProcessing={isProcessing} />
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Colorizing your image...</h3>
              <p className="text-muted-foreground">This may take a few moments</p>
            </div>
          )}

          {originalImage && colorizedImage && !isProcessing && (
            <div className="space-y-6">
              <ImageComparison originalImage={originalImage} colorizedImage={colorizedImage} />
              
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setOriginalImage("");
                    setColorizedImage("");
                  }}
                  className="px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors font-medium"
                >
                  Colorize Another Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "AI-Powered", desc: "Advanced AI algorithms for realistic colorization" },
            { title: "High Quality", desc: "Maintains image detail and quality" },
            { title: "Fast Processing", desc: "Get results in seconds" }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
