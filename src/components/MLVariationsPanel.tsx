import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, Brain, Wand2, Palette, Zap, Loader2 } from "lucide-react";
import { AIPatternService } from "@/lib/aiPatternService";
import { toast } from "sonner";

interface PatternVariation {
  type: string;
  parameters: {
    gridSize: number;
    symmetry: string;
    complexity: number;
  };
  description: string;
  confidence: number;
}

interface MLVariationsPanelProps {
  pattern: any;
  onApplyVariation: (variation: PatternVariation) => void;
}

export const MLVariationsPanel = ({ pattern, onApplyVariation }: MLVariationsPanelProps) => {
  const [variationType, setVariationType] = useState<'creative' | 'mathematical' | 'cultural' | 'fusion'>('creative');
  const [variations, setVariations] = useState<PatternVariation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleGenerateVariations = async () => {
    if (!apiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      return;
    }

    setIsGenerating(true);
    try {
      if (apiKey) {
        AIPatternService.setApiKey(apiKey);
      }

      const [generatedVariations, patternInsights] = await Promise.all([
        AIPatternService.generateVariations(pattern, variationType),
        AIPatternService.getPatternInsights(pattern)
      ]);

      setVariations(generatedVariations);
      setInsights(patternInsights);
      
      toast.success("AI variations generated!", {
        description: `Created ${generatedVariations.length} unique pattern variations.`
      });
    } catch (error) {
      toast.error("Failed to generate variations", {
        description: "Using demo variations instead."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyVariation = (variation: PatternVariation) => {
    onApplyVariation(variation);
    toast.success("Variation applied!", {
      description: variation.description
    });
  };

  const getVariationIcon = (type: string) => {
    switch (type) {
      case 'creative': return <Palette className="h-4 w-4" />;
      case 'mathematical': return <Brain className="h-4 w-4" />;
      case 'cultural': return <Sparkles className="h-4 w-4" />;
      case 'fusion': return <Zap className="h-4 w-4" />;
      default: return <Wand2 className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-emerald-500";
    if (confidence >= 0.6) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-6 space-y-6 bg-card border-border shadow-elegant animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Pattern Variations
        </h2>
        <p className="text-sm text-muted-foreground">
          Generate intelligent pattern variations using machine learning
        </p>
      </div>

      <Separator />

      {showApiKeyInput && (
        <div className="space-y-3 p-4 bg-muted rounded-lg border border-border">
          <Label className="text-sm font-medium">
            OpenAI API Key (Optional - Uses demo mode if empty)
          </Label>
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">
            Your API key is only used for this session and not stored.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-secondary" />
            Variation Type
          </Label>
          <Select value={variationType} onValueChange={(value: any) => setVariationType(value)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select variation style" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="creative">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Creative & Artistic
                </div>
              </SelectItem>
              <SelectItem value="mathematical">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Mathematical & Geometric
                </div>
              </SelectItem>
              <SelectItem value="cultural">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Traditional & Cultural
                </div>
              </SelectItem>
              <SelectItem value="fusion">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Modern Fusion
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleGenerateVariations}
          disabled={isGenerating}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-cultural"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              {getVariationIcon(variationType)}
              <span className="ml-2">Generate AI Variations</span>
            </>
          )}
        </Button>
      </div>

      {insights.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" />
              AI Insights
            </h3>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="text-xs text-muted-foreground flex items-start gap-2 p-2 bg-muted rounded border border-border">
                  <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {variations.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Generated Variations</h3>
            <div className="space-y-3">
              {variations.map((variation, index) => (
                <Card key={index} className="p-4 space-y-3 bg-muted border-border hover:shadow-cultural transition-shadow">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {variation.type}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getConfidenceColor(variation.confidence)}`} />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(variation.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {variation.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Grid: {variation.parameters.gridSize}</span>
                    <span>Symmetry: {variation.parameters.symmetry}</span>
                    <span>Complexity: {variation.parameters.complexity}/10</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyVariation(variation)}
                    className="w-full border-border hover:bg-primary hover:text-primary-foreground"
                  >
                    Apply This Variation
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="bg-muted rounded-lg p-4 border border-border">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          How AI Variations Work
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Our AI analyzes your current pattern's mathematical properties, cultural significance, and geometric relationships. 
          It then generates variations that maintain the essence while exploring new creative possibilities through machine learning algorithms.
        </p>
      </div>
    </Card>
  );
};