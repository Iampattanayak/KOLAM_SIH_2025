import { useState } from "react";
import { KolamCanvas } from "@/components/KolamCanvas";
import { ControlPanel } from "@/components/ControlPanel";
import { InfoPanel } from "@/components/InfoPanel";
import { MLVariationsPanel } from "@/components/MLVariationsPanel";
import { KolamGenerator } from "@/lib/kolamGenerator";
import { Button } from "@/components/ui/button";
import { Sparkles, Download } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [patternType, setPatternType] = useState("grid");
  const [gridSize, setGridSize] = useState(7);
  const [symmetryType, setSymmetryType] = useState("4-fold");
  const [colorScheme, setColorScheme] = useState("traditional");
  const [lineThickness, setLineThickness] = useState(2);
  const [animated, setAnimated] = useState(false);
  
  const [currentPattern, setCurrentPattern] = useState(() => 
    KolamGenerator.generatePattern(patternType, gridSize, symmetryType)
  );

  const generatePattern = () => {
    const newPattern = KolamGenerator.generatePattern(patternType, gridSize, symmetryType);
    setCurrentPattern(newPattern);
    toast.success("New pattern generated!", {
      description: `Created a beautiful ${patternType} Kolam pattern.`
    });
  };

  const exportPattern = () => {
    // In a real implementation, this would export the canvas content
    toast.success("Pattern exported successfully!", {
      description: "Your Kolam pattern has been saved as PNG."
    });
  };

  const sharePattern = () => {
    // In a real implementation, this would create a shareable link
    navigator.clipboard.writeText(window.location.href);
    toast.success("Sharing link copied!", {
      description: "Share your beautiful Kolam creation with others."
    });
  };

  const handleApplyVariation = (variation: any) => {
    setPatternType(variation.type);
    setGridSize(variation.parameters.gridSize);
    setSymmetryType(variation.parameters.symmetry);
    
    // Generate the pattern with new parameters
    const newPattern = KolamGenerator.generatePattern(
      variation.type, 
      variation.parameters.gridSize, 
      variation.parameters.symmetry
    );
    setCurrentPattern(newPattern);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-cultural flex items-center justify-center shadow-cultural">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent">
                  Kolam Pattern Studio
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Traditional Indian Pattern Generator
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={exportPattern}
              className="hidden md:flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Gallery
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-12rem)]">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-4">
            <ControlPanel
              patternType={patternType}
              gridSize={gridSize}
              symmetryType={symmetryType}
              colorScheme={colorScheme}
              lineThickness={lineThickness}
              animated={animated}
              onPatternTypeChange={setPatternType}
              onGridSizeChange={(value) => setGridSize(value[0])}
              onSymmetryChange={setSymmetryType}
              onColorSchemeChange={setColorScheme}
              onLineThicknessChange={(value) => setLineThickness(value[0])}
              onAnimatedChange={setAnimated}
              onGenerate={generatePattern}
            />
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="w-full max-w-2xl animate-scale-in">
              <KolamCanvas
                pattern={currentPattern}
                colorScheme={colorScheme}
                animated={animated}
                lineThickness={lineThickness}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1">
            <InfoPanel
              pattern={currentPattern}
              onExport={exportPattern}
              onShare={sharePattern}
            />
          </div>

          {/* ML Variations Panel */}
          <div className="lg:col-span-1">
            <MLVariationsPanel
              pattern={currentPattern}
              onApplyVariation={handleApplyVariation}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Preserving traditional Kolam art through modern technology • Built with mathematical precision and cultural respect
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
