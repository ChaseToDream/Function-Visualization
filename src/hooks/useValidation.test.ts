import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useValidation } from './useValidation';

describe('useValidation', () => {
  it('should return null for empty expression', () => {
    const { result } = renderHook(() => useValidation(''));
    expect(result.current.isValid).toBeNull();
    expect(result.current.errorMessage).toBe('');
  });

  it('should validate valid expressions', async () => {
    const { result } = renderHook(() => useValidation('x^2'));

    // Wait for debounce
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 350));
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.errorMessage).toBe('');
  });

  it('should validate invalid expressions', async () => {
    const { result } = renderHook(() => useValidation('x+'));

    // Wait for debounce
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 350));
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessage).toBe('无效的函数表达式');
  });

  it('should validate trigonometric functions', async () => {
    const { result } = renderHook(() => useValidation('sin(x)'));

    // Wait for debounce
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 350));
    });

    expect(result.current.isValid).toBe(true);
  });

  it('should validate complex expressions', async () => {
    const { result } = renderHook(() => useValidation('2*x^2 + 3*x - 1'));

    // Wait for debounce
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 350));
    });

    expect(result.current.isValid).toBe(true);
  });
});
