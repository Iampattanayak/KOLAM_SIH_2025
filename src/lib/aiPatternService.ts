interface PatternAnalysis {
  style: string;
  complexity: number;
  symmetry: string;
  mathematicalPrinciples: string[];
  culturalElements: string[];
  suggestedVariations: string[];
}

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

export class AIPatternService {
  private static apiKey: string | null = null;

  static setApiKey(key: string) {
    this.apiKey = key;
  }

  static async analyzePattern(pattern: any): Promise<PatternAnalysis> {
    try {
      const prompt = `Analyze this Kolam pattern:
      Type: ${pattern.type}
      Dots: ${pattern.properties.dotCount}
      Symmetry: ${pattern.properties.symmetry}
      Complexity: ${pattern.properties.complexity}

      Provide detailed analysis including:
      1. Style characteristics
      2. Mathematical principles used
      3. Cultural significance
      4. Suggested creative variations

      Respond in JSON format with keys: style, complexity, symmetry, mathematicalPrinciples (array), culturalElements (array), suggestedVariations (array).`;

      if (!this.apiKey) {
        // Return mock analysis for demonstration
        return this.getMockAnalysis(pattern);
      }

      const response = await fetch('/api/analyze-pattern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ prompt, pattern })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze pattern');
      }

      return await response.json();
    } catch (error) {
      console.error('Pattern analysis error:', error);
      return this.getMockAnalysis(pattern);
    }
  }

  static async generateVariations(
    pattern: any, 
    variationType: 'creative' | 'mathematical' | 'cultural' | 'fusion' = 'creative'
  ): Promise<PatternVariation[]> {
    try {
      const prompts = {
        creative: `Generate 3 creative variations of this Kolam pattern with artistic flair and modern elements.`,
        mathematical: `Generate 3 mathematically sophisticated variations using advanced geometric principles.`,
        cultural: `Generate 3 traditional variations respecting classical Kolam cultural elements.`,
        fusion: `Generate 3 fusion variations combining traditional Kolam with contemporary design elements.`
      };

      const prompt = `${prompts[variationType]}
      
      Base pattern:
      Type: ${pattern.type}
      Dots: ${pattern.properties.dotCount}
      Symmetry: ${pattern.properties.symmetry}
      
      For each variation, provide:
      1. Pattern type (grid/fibonacci/symmetric/mandala)
      2. Grid size (3-15)
      3. Symmetry type (4-fold/6-fold/8-fold/mirror)
      4. Complexity score (1-10)
      5. Description of the variation
      6. Confidence score (0-1)

      Respond in JSON array format.`;

      if (!this.apiKey) {
        return this.getMockVariations(pattern, variationType);
      }

      const response = await fetch('/api/generate-variations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ prompt, pattern, variationType })
      });

      if (!response.ok) {
        throw new Error('Failed to generate variations');
      }

      return await response.json();
    } catch (error) {
      console.error('Variation generation error:', error);
      return this.getMockVariations(pattern, variationType);
    }
  }

  private static getMockAnalysis(pattern: any): PatternAnalysis {
    const analyses = {
      grid: {
        style: "Classical geometric grid with emphasis on symmetrical balance",
        complexity: pattern.properties.complexity,
        symmetry: pattern.properties.symmetry,
        mathematicalPrinciples: [
          "Tessellation patterns create infinite continuity",
          "Grid-based coordinates ensure perfect alignment",
          "Euclidean geometry defines structural relationships"
        ],
        culturalElements: [
          "Represents the cosmic order and universal harmony",
          "Grid symbolizes the interconnectedness of all life",
          "Traditional morning ritual pattern for prosperity"
        ],
        suggestedVariations: [
          "Add spiral elements for dynamic flow",
          "Incorporate fractal subdivisions",
          "Blend with Fibonacci proportions"
        ]
      },
      fibonacci: {
        style: "Natural spiral pattern following golden ratio principles",
        complexity: pattern.properties.complexity,
        symmetry: pattern.properties.symmetry,
        mathematicalPrinciples: [
          "Golden ratio (φ = 1.618) creates natural harmony",
          "Fibonacci sequence generates organic growth patterns",
          "Logarithmic spirals found throughout nature"
        ],
        culturalElements: [
          "Represents life's natural growth and evolution",
          "Spiral symbolizes the journey from material to spiritual",
          "Sacred geometry connecting earthly and divine realms"
        ],
        suggestedVariations: [
          "Double spiral with mirror symmetry",
          "Incorporate geometric lotus elements",
          "Add radial extensions from spiral center"
        ]
      },
      symmetric: {
        style: "Radial symmetry with emphasis on balanced proportions",
        complexity: pattern.properties.complexity,
        symmetry: pattern.properties.symmetry,
        mathematicalPrinciples: [
          "Rotational symmetry creates visual stability",
          "Angular relationships maintain proportion",
          "Symmetry operations preserve pattern integrity"
        ],
        culturalElements: [
          "Reflects cosmic balance and universal order",
          "Symmetry represents spiritual equilibrium",
          "Traditional design for festival celebrations"
        ],
        suggestedVariations: [
          "Increase fold count for more complexity",
          "Add concentric ring structures",
          "Incorporate star-like extensions"
        ]
      },
      mandala: {
        style: "Sacred circular pattern with radial complexity",
        complexity: pattern.properties.complexity,
        symmetry: pattern.properties.symmetry,
        mathematicalPrinciples: [
          "Concentric circles create hierarchical organization",
          "Radial symmetry ensures perfect balance",
          "Angular divisions create harmonic proportions"
        ],
        culturalElements: [
          "Represents the universe and cosmic consciousness",
          "Sacred geometry for meditation and spiritual practice",
          "Symbol of wholeness and divine perfection"
        ],
        suggestedVariations: [
          "Add additional concentric layers",
          "Incorporate petal-like extensions",
          "Blend with geometric lotus patterns"
        ]
      }
    };

    return analyses[pattern.type as keyof typeof analyses] || analyses.grid;
  }

  private static getMockVariations(pattern: any, variationType: string): PatternVariation[] {
    const baseVariations = [
      {
        type: "symmetric",
        parameters: { gridSize: 8, symmetry: "8-fold", complexity: 7 },
        description: "Enhanced symmetrical design with increased fold count for greater visual impact",
        confidence: 0.9
      },
      {
        type: "mandala",
        parameters: { gridSize: 6, symmetry: "6-fold", complexity: 8 },
        description: "Sacred mandala interpretation with additional concentric rings",
        confidence: 0.85
      },
      {
        type: "fibonacci",
        parameters: { gridSize: 10, symmetry: "Spiral", complexity: 9 },
        description: "Fibonacci spiral with golden ratio proportions and organic flow",
        confidence: 0.88
      }
    ];

    // Customize variations based on type
    switch (variationType) {
      case 'mathematical':
        return baseVariations.map(v => ({
          ...v,
          description: `Mathematical ${v.description.toLowerCase()} with advanced geometric algorithms`,
          parameters: { ...v.parameters, complexity: Math.min(v.parameters.complexity + 1, 10) }
        }));
      case 'cultural':
        return baseVariations.map(v => ({
          ...v,
          description: `Traditional ${v.description.toLowerCase()} following classical Kolam principles`,
          parameters: { ...v.parameters, gridSize: Math.max(v.parameters.gridSize - 1, 3) }
        }));
      case 'fusion':
        return baseVariations.map(v => ({
          ...v,
          description: `Modern fusion ${v.description.toLowerCase()} with contemporary elements`,
          parameters: { ...v.parameters, gridSize: Math.min(v.parameters.gridSize + 2, 15) }
        }));
      default:
        return baseVariations;
    }
  }

  static async getPatternInsights(pattern: any): Promise<string[]> {
    const analysis = await this.analyzePattern(pattern);
    return [
      `This ${pattern.type} pattern exhibits ${analysis.style.toLowerCase()}`,
      `Mathematical complexity: ${analysis.complexity}/10 with ${analysis.symmetry} symmetry`,
      `Key principles: ${analysis.mathematicalPrinciples[0]}`,
      `Cultural meaning: ${analysis.culturalElements[0]}`
    ];
  }
}