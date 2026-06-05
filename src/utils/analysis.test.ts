import { describe, it, expect } from 'vitest';
import { findZeros, findExtrema, analyzeFunction } from './analysis';

describe('Function Analysis', () => {
  describe('findZeros', () => {
    it('should find zeros of x', () => {
      const zeros = findZeros('x', -5, 5);
      expect(zeros.length).toBeGreaterThan(0);
      expect(zeros.some((z) => Math.abs(z) < 0.01)).toBe(true);
    });

    it('should find zeros of x^2 - 1', () => {
      const zeros = findZeros('x^2 - 1', -5, 5);
      expect(zeros.length).toBe(2);
      expect(zeros.some((z) => Math.abs(z - 1) < 0.1)).toBe(true);
      expect(zeros.some((z) => Math.abs(z + 1) < 0.1)).toBe(true);
    });

    it('should return empty for constant function', () => {
      const zeros = findZeros('1', -5, 5);
      expect(zeros.length).toBe(0);
    });
  });

  describe('findExtrema', () => {
    it('should find minimum of x^2', () => {
      const extrema = findExtrema('x^2', -5, 5);
      expect(extrema.length).toBeGreaterThan(0);
      const min = extrema.find((e) => e.type === 'min');
      expect(min).toBeDefined();
      if (min) {
        expect(Math.abs(min.x)).toBeLessThan(0.1);
        expect(Math.abs(min.y)).toBeLessThan(0.1);
      }
    });

    it('should find maximum and minimum of x^3 - 3*x', () => {
      const extrema = findExtrema('x^3 - 3*x', -5, 5);
      expect(extrema.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('analyzeFunction', () => {
    it('should detect even function', () => {
      const analysis = analyzeFunction('x^2', -5, 5);
      expect(analysis.isEven).toBe(true);
      expect(analysis.isOdd).toBe(false);
    });

    it('should detect odd function', () => {
      const analysis = analyzeFunction('x', -5, 5);
      expect(analysis.isOdd).toBe(true);
      expect(analysis.isEven).toBe(false);
    });

    it('should detect non-symmetric function', () => {
      const analysis = analyzeFunction('x + 1', -5, 5);
      expect(analysis.isEven).toBe(false);
      expect(analysis.isOdd).toBe(false);
    });

    it('should return correct domain', () => {
      const analysis = analyzeFunction('x', -10, 10);
      expect(analysis.domain.min).toBe(-10);
      expect(analysis.domain.max).toBe(10);
    });
  });
});
