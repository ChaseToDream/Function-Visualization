import { describe, it, expect } from 'vitest';
import { validateFunction, evaluateFunction } from './math';

describe('validateFunction', () => {
  it('should return true for valid expressions', () => {
    expect(validateFunction('x')).toBe(true);
    expect(validateFunction('x^2')).toBe(true);
    expect(validateFunction('sin(x)')).toBe(true);
    expect(validateFunction('cos(x) + sin(x)')).toBe(true);
    expect(validateFunction('2*x + 1')).toBe(true);
  });

  it('should return false for invalid expressions', () => {
    expect(validateFunction('')).toBe(false);
    expect(validateFunction('x +')).toBe(false);
    expect(validateFunction('sin(')).toBe(false);
    expect(validateFunction('x * * y')).toBe(false);
  });
});

describe('evaluateFunction', () => {
  it('should evaluate expressions correctly', () => {
    expect(evaluateFunction('x', 0)).toBe(0);
    expect(evaluateFunction('x', 1)).toBe(1);
    expect(evaluateFunction('x^2', 2)).toBe(4);
    expect(evaluateFunction('x^2', -2)).toBe(4);
    expect(evaluateFunction('2*x + 1', 3)).toBe(7);
  });

  it('should handle trigonometric functions', () => {
    expect(evaluateFunction('sin(0)', 0)).toBe(0);
    expect(evaluateFunction('cos(0)', 0)).toBe(1);
  });

  it('should return NaN for invalid expressions', () => {
    expect(evaluateFunction('invalid', 0)).toBeNaN();
    expect(evaluateFunction('x +', 0)).toBeNaN();
  });
});