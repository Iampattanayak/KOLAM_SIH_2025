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

export class KolamGenerator {
  static generateGridPattern(gridSize: number, symmetryType: string): KolamPattern {
    const dots: Point[] = [];
    const lines: Point[][] = [];
    
    // Create grid of dots
    const spacing = 40;
    const centerOffset = (gridSize - 1) * spacing / 2;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        dots.push({
          x: i * spacing - centerOffset,
          y: j * spacing - centerOffset
        });
      }
    }
    
    // Generate connecting lines based on symmetry
    const connectionLines = this.generateGridConnections(dots, gridSize, symmetryType);
    lines.push(...connectionLines);
    
    return {
      dots,
      lines,
      type: 'grid',
      properties: {
        dotCount: dots.length,
        symmetry: symmetryType,
        complexity: Math.min(Math.floor(gridSize * 0.7), 10)
      }
    };
  }

  static generateFibonacciPattern(iterations: number = 13): KolamPattern {
    const dots: Point[] = [];
    const lines: Point[][] = [];
    
    // Generate Fibonacci spiral points
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const fibSequence = this.generateFibonacci(iterations);
    
    for (let i = 0; i < iterations; i++) {
      const radius = fibSequence[i] * 3;
      const angle = i * (2 * Math.PI / goldenRatio);
      
      dots.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      });
    }
    
    // Create spiral connections
    const spiralLine: Point[] = [];
    for (let i = 0; i < dots.length; i++) {
      spiralLine.push(dots[i]);
    }
    lines.push(spiralLine);
    
    // Add decorative circular connections
    const circles = this.generateConcentricCircles(dots);
    lines.push(...circles);
    
    return {
      dots,
      lines,
      type: 'fibonacci',
      properties: {
        dotCount: dots.length,
        symmetry: 'Spiral',
        complexity: 8
      }
    };
  }

  static generateSymmetricPattern(foldCount: number = 8): KolamPattern {
    const dots: Point[] = [];
    const lines: Point[][] = [];
    
    // Generate base pattern in one sector
    const sectorAngle = (2 * Math.PI) / foldCount;
    const basePoints = this.generateBaseSector();
    
    // Replicate across all sectors
    for (let fold = 0; fold < foldCount; fold++) {
      const angle = fold * sectorAngle;
      
      basePoints.forEach(point => {
        const rotatedX = point.x * Math.cos(angle) - point.y * Math.sin(angle);
        const rotatedY = point.x * Math.sin(angle) + point.y * Math.cos(angle);
        
        dots.push({ x: rotatedX, y: rotatedY });
      });
    }
    
    // Generate symmetric connections
    const connections = this.generateSymmetricConnections(dots, foldCount);
    lines.push(...connections);
    
    return {
      dots,
      lines,
      type: 'symmetric',
      properties: {
        dotCount: dots.length,
        symmetry: `${foldCount}-fold`,
        complexity: Math.min(foldCount, 10)
      }
    };
  }

  static generateMandalaPattern(): KolamPattern {
    const dots: Point[] = [];
    const lines: Point[][] = [];
    
    // Central dot
    dots.push({ x: 0, y: 0 });
    
    // Generate concentric rings
    const rings = [30, 60, 90, 120, 150];
    const pointsPerRing = [8, 12, 16, 20, 24];
    
    rings.forEach((radius, ringIndex) => {
      const pointCount = pointsPerRing[ringIndex];
      for (let i = 0; i < pointCount; i++) {
        const angle = (i * 2 * Math.PI) / pointCount;
        dots.push({
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)
        });
      }
    });
    
    // Generate mandala connections
    const mandalaLines = this.generateMandalaConnections(dots, rings, pointsPerRing);
    lines.push(...mandalaLines);
    
    return {
      dots,
      lines,
      type: 'mandala',
      properties: {
        dotCount: dots.length,
        symmetry: 'Radial',
        complexity: 9
      }
    };
  }

  private static generateGridConnections(dots: Point[], gridSize: number, symmetryType: string): Point[][] {
    const lines: Point[][] = [];
    
    // Create continuous loops around dots
    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        const topLeft = i * gridSize + j;
        const topRight = i * gridSize + (j + 1);
        const bottomLeft = (i + 1) * gridSize + j;
        const bottomRight = (i + 1) * gridSize + (j + 1);
        
        // Create diamond pattern around each 2x2 square
        if (dots[topLeft] && dots[topRight] && dots[bottomLeft] && dots[bottomRight]) {
          const diamond = [
            { x: (dots[topLeft].x + dots[topRight].x) / 2, y: dots[topLeft].y - 15 },
            { x: dots[topRight].x + 15, y: (dots[topRight].y + dots[bottomRight].y) / 2 },
            { x: (dots[bottomLeft].x + dots[bottomRight].x) / 2, y: dots[bottomRight].y + 15 },
            { x: dots[topLeft].x - 15, y: (dots[topLeft].y + dots[bottomLeft].y) / 2 },
            { x: (dots[topLeft].x + dots[topRight].x) / 2, y: dots[topLeft].y - 15 }
          ];
          lines.push(diamond);
        }
      }
    }
    
    return lines;
  }

  private static generateConcentricCircles(centerDots: Point[]): Point[][] {
    const circles: Point[][] = [];
    const radii = [40, 80, 120];
    
    radii.forEach(radius => {
      const circle: Point[] = [];
      for (let i = 0; i <= 32; i++) {
        const angle = (i * 2 * Math.PI) / 32;
        circle.push({
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)
        });
      }
      circles.push(circle);
    });
    
    return circles;
  }

  private static generateBaseSector(): Point[] {
    return [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 60, y: 0 },
      { x: 90, y: 0 },
      { x: 45, y: 20 },
      { x: 70, y: 35 }
    ];
  }

  private static generateSymmetricConnections(dots: Point[], foldCount: number): Point[][] {
    const lines: Point[][] = [];
    const center = { x: 0, y: 0 };
    
    // Connect center to outer points
    const pointsPerFold = Math.floor(dots.length / foldCount);
    
    for (let fold = 0; fold < foldCount; fold++) {
      const startIndex = fold * pointsPerFold;
      const endIndex = Math.min(startIndex + pointsPerFold, dots.length);
      
      for (let i = startIndex; i < endIndex - 1; i++) {
        lines.push([dots[i], dots[i + 1]]);
      }
      
      // Connect to next fold
      if (fold < foldCount - 1) {
        lines.push([dots[endIndex - 1], dots[endIndex]]);
      } else {
        lines.push([dots[endIndex - 1], dots[0]]);
      }
    }
    
    return lines;
  }

  private static generateMandalaConnections(dots: Point[], rings: number[], pointsPerRing: number[]): Point[][] {
    const lines: Point[][] = [];
    let dotIndex = 1; // Skip center dot
    
    // Connect rings
    for (let ringIndex = 0; ringIndex < rings.length; ringIndex++) {
      const pointCount = pointsPerRing[ringIndex];
      
      // Create ring connections
      for (let i = 0; i < pointCount; i++) {
        const currentDot = dots[dotIndex + i];
        const nextDot = dots[dotIndex + ((i + 1) % pointCount)];
        lines.push([currentDot, nextDot]);
        
        // Connect to center
        if (ringIndex === 0) {
          lines.push([dots[0], currentDot]);
        }
        
        // Connect to previous ring
        if (ringIndex > 0) {
          const prevRingStart = 1 + pointsPerRing.slice(0, ringIndex - 1).reduce((a, b) => a + b, 0);
          const prevRingIndex = Math.floor((i * pointsPerRing[ringIndex - 1]) / pointCount);
          lines.push([currentDot, dots[prevRingStart + prevRingIndex]]);
        }
      }
      
      dotIndex += pointCount;
    }
    
    return lines;
  }

  private static generateFibonacci(n: number): number[] {
    const fib = [0, 1];
    for (let i = 2; i < n; i++) {
      fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib;
  }

  static generatePattern(
    type: string,
    gridSize: number = 7,
    symmetryType: string = "4-fold"
  ): KolamPattern {
    switch (type) {
      case 'fibonacci':
        return this.generateFibonacciPattern(gridSize + 3);
      case 'symmetric':
        const foldCount = parseInt(symmetryType.split('-')[0]) || 4;
        return this.generateSymmetricPattern(foldCount);
      case 'mandala':
        return this.generateMandalaPattern();
      default:
        return this.generateGridPattern(gridSize, symmetryType);
    }
  }
}