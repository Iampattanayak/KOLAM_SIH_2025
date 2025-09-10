import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Grid, Palette, Settings } from "lucide-react";

interface ControlPanelProps {
  patternType: string;
  gridSize: number;
  symmetryType: string;
  colorScheme: string;
  lineThickness: number;
  animated: boolean;
  onPatternTypeChange: (value: string) => void;
  onGridSizeChange: (value: number[]) => void;
  onSymmetryChange: (value: string) => void;
  onColorSchemeChange: (value: string) => void;
  onLineThicknessChange: (value: number[]) => void;
  onAnimatedChange: (value: boolean) => void;
  onGenerate: () => void;
}

export const ControlPanel = ({
  patternType,
  gridSize,
  symmetryType,
  colorScheme,
  lineThickness,
  animated,
  onPatternTypeChange,
  onGridSizeChange,
  onSymmetryChange,
  onColorSchemeChange,
  onLineThicknessChange,
  onAnimatedChange,
  onGenerate,
}: ControlPanelProps) => {
  return (
    <Card className="p-6 space-y-6 bg-card border-border shadow-elegant animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Pattern Controls
        </h2>
        <p className="text-sm text-muted-foreground">
          Create beautiful Kolam patterns with mathematical precision
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Grid className="h-4 w-4 text-secondary" />
            Pattern Type
          </Label>
          <Select value={patternType} onValueChange={onPatternTypeChange}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select pattern type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="grid">Basic Grid</SelectItem>
              <SelectItem value="fibonacci">Fibonacci Spiral</SelectItem>
              <SelectItem value="symmetric">Symmetric Design</SelectItem>
              <SelectItem value="mandala">Sacred Mandala</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Grid Size: {gridSize}</Label>
          <Slider
            value={[gridSize]}
            onValueChange={onGridSizeChange}
            min={3}
            max={15}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3</span>
            <span>15</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Symmetry Type</Label>
          <Select value={symmetryType} onValueChange={onSymmetryChange}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select symmetry" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="4-fold">4-fold Symmetry</SelectItem>
              <SelectItem value="6-fold">6-fold Symmetry</SelectItem>
              <SelectItem value="8-fold">8-fold Symmetry</SelectItem>
              <SelectItem value="mirror">Mirror Symmetry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Palette className="h-4 w-4 text-accent" />
            Color Scheme
          </Label>
          <Select value={colorScheme} onValueChange={onColorSchemeChange}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select colors" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="traditional">Traditional Black</SelectItem>
              <SelectItem value="saffron">Saffron Glory</SelectItem>
              <SelectItem value="emerald">Emerald Beauty</SelectItem>
              <SelectItem value="royal">Royal Purple</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Line Thickness: {lineThickness}px</Label>
          <Slider
            value={[lineThickness]}
            onValueChange={onLineThicknessChange}
            min={1}
            max={8}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1px</span>
            <span>8px</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="animated" className="text-sm font-medium">
            Animated Drawing
          </Label>
          <Switch
            id="animated"
            checked={animated}
            onCheckedChange={onAnimatedChange}
          />
        </div>
      </div>

      <Separator />

      <Button 
        onClick={onGenerate}
        className="w-full bg-gradient-saffron hover:opacity-90 text-primary-foreground shadow-cultural"
        size="lg"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Generate Pattern
      </Button>
    </Card>
  );
};