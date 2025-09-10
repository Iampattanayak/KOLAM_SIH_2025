import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Info, Calculator, Heart } from "lucide-react";
import { toast } from "sonner";

interface Pattern {
  type: string;
  properties: {
    dotCount: number;
    symmetry: string;
    complexity: number;
  };
}

interface InfoPanelProps {
  pattern: Pattern;
  onExport: () => void;
  onShare: () => void;
}

export const InfoPanel = ({ pattern, onExport, onShare }: InfoPanelProps) => {
  const getPatternDescription = (type: string) => {
    const descriptions = {
      grid: "Grid-based Kolam patterns represent the fundamental structure of the universe through interconnected dots and lines.",
      fibonacci: "Fibonacci spirals in Kolam art demonstrate the golden ratio found throughout nature, creating harmonious proportions.",
      symmetric: "Symmetric designs reflect the balance and harmony central to Indian philosophy and cosmic order.",
      mandala: "Sacred Mandala patterns represent the universe in Hindu and Buddhist symbolism, with perfect radial symmetry."
    };
    return descriptions[type as keyof typeof descriptions] || descriptions.grid;
  };

  const getMathematicalInsights = () => {
    const insights = [
      `${pattern.properties.dotCount} dots arranged in perfect mathematical harmony`,
      `${pattern.properties.symmetry} creates visual balance and spiritual significance`,
      `Complexity score: ${pattern.properties.complexity}/10 - indicating geometric sophistication`,
      "Golden ratio principles ensure natural aesthetic appeal"
    ];
    return insights;
  };

  const handleExport = () => {
    onExport();
    toast.success("Pattern exported as PNG image!", {
      description: "Your beautiful Kolam pattern has been saved."
    });
  };

  const handleShare = () => {
    onShare();
    toast.success("Pattern sharing link copied!", {
      description: "Share your creation with friends and family."
    });
  };

  return (
    <Card className="p-6 space-y-6 bg-card border-border shadow-elegant animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Pattern Analysis
        </h2>
        <p className="text-sm text-muted-foreground">
          Mathematical and cultural insights
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-secondary" />
            Properties
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="secondary" className="justify-center py-2">
              {pattern.properties.dotCount} Dots
            </Badge>
            <Badge variant="outline" className="justify-center py-2">
              {pattern.properties.symmetry}
            </Badge>
            <Badge 
              variant="secondary" 
              className="col-span-2 justify-center py-2 bg-gradient-emerald text-secondary-foreground"
            >
              Complexity: {pattern.properties.complexity}/10
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Heart className="h-4 w-4 text-accent" />
            Cultural Significance
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getPatternDescription(pattern.type)}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-foreground mb-2">Mathematical Insights</h3>
          <ul className="space-y-1">
            {getMathematicalInsights().map((insight, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium text-foreground">Export & Share</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2 border-border"
          >
            <Download className="h-3 w-3" />
            Export PNG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-2 border-border"
          >
            <Share2 className="h-3 w-3" />
            Share Link
          </Button>
        </div>
      </div>

      <div className="bg-muted rounded-lg p-4 border border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">About Kolam Art</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Kolam is a traditional South Indian art form where intricate patterns are drawn with rice flour. 
          These geometric designs symbolize prosperity, welcome guests, and connect the physical world with the spiritual realm through mathematical harmony.
        </p>
      </div>
    </Card>
  );
};