import { describe, it, expect } from 'vitest';
import {
  FUNCTION_COLORS,
  MATH_SYMBOLS,
  DEFAULT_COORDINATE_RANGE,
  GRAPH_DEFAULTS,
  FUNCTION_PRESETS,
} from './index';

describe('Config', () => {
  it('should have function colors', () => {
    expect(FUNCTION_COLORS).toBeDefined();
    expect(FUNCTION_COLORS.length).toBeGreaterThan(0);
    FUNCTION_COLORS.forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('should have math symbols', () => {
    expect(MATH_SYMBOLS).toBeDefined();
    expect(MATH_SYMBOLS.length).toBeGreaterThan(0);
    MATH_SYMBOLS.forEach((symbol) => {
      expect(symbol.label).toBeDefined();
      expect(symbol.value).toBeDefined();
      expect(symbol.category).toBeDefined();
    });
  });

  it('should have default coordinate range', () => {
    expect(DEFAULT_COORDINATE_RANGE).toBeDefined();
    expect(DEFAULT_COORDINATE_RANGE.xMin).toBeLessThan(DEFAULT_COORDINATE_RANGE.xMax);
    expect(DEFAULT_COORDINATE_RANGE.yMin).toBeLessThan(DEFAULT_COORDINATE_RANGE.yMax);
  });

  it('should have graph defaults', () => {
    expect(GRAPH_DEFAULTS).toBeDefined();
    expect(GRAPH_DEFAULTS.width).toBeGreaterThan(0);
    expect(GRAPH_DEFAULTS.height).toBeGreaterThan(0);
    expect(typeof GRAPH_DEFAULTS.grid).toBe('boolean');
  });

  it('should have function presets', () => {
    expect(FUNCTION_PRESETS).toBeDefined();
    expect(FUNCTION_PRESETS.length).toBeGreaterThan(0);
    FUNCTION_PRESETS.forEach((preset) => {
      expect(preset.name).toBeDefined();
      expect(preset.expression).toBeDefined();
      expect(preset.description).toBeDefined();
    });
  });
});