import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface KolamPattern {
  dots: Point[];
  lines: Point[][];
  type: string;
  properties: {
    dotCount: number;
    symmetry: string;
    complexity: number;
  };
}

interface KolamCanvasProps {
  pattern: KolamPattern;
  colorScheme: string;
  animated: boolean;
  lineThickness: number;
}

export const KolamCanvas = ({ pattern, colorScheme, animated, lineThickness }: KolamCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const getColors = (scheme: string) => {
    const schemes = {
      traditional: {
        background: "#FFFDD0",
        dots: "#8B4513",
        lines: "#2F4F4F"
      },
      saffron: {
        background: "#FFF8DC",
        dots: "#FF6600",
        lines: "#CC4400"
      },
      emerald: {
        background: "#F0FFF0",
        dots: "#228B22",
        lines: "#006400"
      },
      royal: {
        background: "#F8F8FF",
        dots: "#4B0082",
        lines: "#191970"
      }
    };
    return schemes[scheme as keyof typeof schemes] || schemes.traditional;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = getColors(colorScheme);
    
    // Clear canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale pattern to fit canvas
    const padding = 50;
    const scale = Math.min(
      (canvas.width - padding * 2) / 400,
      (canvas.height - padding * 2) / 400
    );
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    if (animated) {
      drawAnimatedPattern(ctx, pattern, colors, animationProgress, lineThickness);
    } else {
      drawStaticPattern(ctx, pattern, colors, lineThickness);
    }

    ctx.restore();
  }, [pattern, colorScheme, animated, animationProgress, lineThickness]);

  useEffect(() => {
    if (!animated) return;

    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    setAnimationProgress(0);
    animate();
  }, [animated, pattern]);

  const drawStaticPattern = (
    ctx: CanvasRenderingContext2D,
    pattern: KolamPattern,
    colors: any,
    thickness: number
  ) => {
    // Draw lines first
    ctx.strokeStyle = colors.lines;
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    pattern.lines.forEach(line => {
      if (line.length > 1) {
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        for (let i = 1; i < line.length; i++) {
          ctx.lineTo(line[i].x, line[i].y);
        }
        ctx.stroke();
      }
    });

    // Draw dots
    ctx.fillStyle = colors.dots;
    pattern.dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawAnimatedPattern = (
    ctx: CanvasRenderingContext2D,
    pattern: KolamPattern,
    colors: any,
    progress: number,
    thickness: number
  ) => {
    // Draw dots first (always visible)
    ctx.fillStyle = colors.dots;
    pattern.dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw lines progressively
    ctx.strokeStyle = colors.lines;
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    let totalLength = 0;
    const lineLengths: number[] = [];
    
    // Calculate total length
    pattern.lines.forEach(line => {
      let lineLength = 0;
      for (let i = 1; i < line.length; i++) {
        const dx = line[i].x - line[i-1].x;
        const dy = line[i].y - line[i-1].y;
        lineLength += Math.sqrt(dx * dx + dy * dy);
      }
      lineLengths.push(lineLength);
      totalLength += lineLength;
    });

    const targetLength = totalLength * progress;
    let drawnLength = 0;

    for (let lineIndex = 0; lineIndex < pattern.lines.length; lineIndex++) {
      const line = pattern.lines[lineIndex];
      const lineLength = lineLengths[lineIndex];
      
      if (drawnLength + lineLength <= targetLength) {
        // Draw complete line
        ctx.beginPath();
        ctx.moveTo(line[0].x, line[0].y);
        for (let i = 1; i < line.length; i++) {
          ctx.lineTo(line[i].x, line[i].y);
        }
        ctx.stroke();
        drawnLength += lineLength;
      } else {
        // Draw partial line
        const remainingTarget = targetLength - drawnLength;
        drawPartialLine(ctx, line, remainingTarget);
        break;
      }
    }
  };

  const drawPartialLine = (
    ctx: CanvasRenderingContext2D,
    line: Point[],
    targetLength: number
  ) => {
    let drawnLength = 0;
    ctx.beginPath();
    ctx.moveTo(line[0].x, line[0].y);

    for (let i = 1; i < line.length; i++) {
      const dx = line[i].x - line[i-1].x;
      const dy = line[i].y - line[i-1].y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);

      if (drawnLength + segmentLength <= targetLength) {
        ctx.lineTo(line[i].x, line[i].y);
        drawnLength += segmentLength;
      } else {
        const remainingRatio = (targetLength - drawnLength) / segmentLength;
        const endX = line[i-1].x + dx * remainingRatio;
        const endY = line[i-1].y + dy * remainingRatio;
        ctx.lineTo(endX, endY);
        break;
      }
    }
    ctx.stroke();
  };

  return (
    <div className="flex items-center justify-center bg-card rounded-xl border shadow-elegant overflow-hidden">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="block"
      />
    </div>
  );
};