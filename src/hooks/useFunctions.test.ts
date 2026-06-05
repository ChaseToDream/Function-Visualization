import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFunctions } from './useFunctions';

describe('useFunctions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty functions', () => {
    const { result } = renderHook(() => useFunctions());
    expect(result.current.functions).toEqual([]);
  });

  it('should add a function', () => {
    const { result } = renderHook(() => useFunctions());

    act(() => {
      result.current.addFunction('x^2');
    });

    expect(result.current.functions).toHaveLength(1);
    expect(result.current.functions[0].expression).toBe('x^2');
  });

  it('should remove a function', () => {
    const { result } = renderHook(() => useFunctions());

    act(() => {
      result.current.addFunction('x^2');
    });

    act(() => {
      result.current.removeFunction(result.current.functions[0].id);
    });

    expect(result.current.functions).toHaveLength(0);
  });

  it('should clear all functions', () => {
    const { result } = renderHook(() => useFunctions());

    act(() => {
      result.current.addFunction('x^2');
      result.current.addFunction('sin(x)');
    });

    act(() => {
      result.current.clearAllFunctions();
    });

    expect(result.current.functions).toHaveLength(0);
  });

  it('should assign colors to functions', () => {
    const { result } = renderHook(() => useFunctions());

    act(() => {
      result.current.addFunction('x^2');
    });

    expect(result.current.functions[0].color).toBeDefined();
    expect(result.current.functions[0].color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should generate unique ids', async () => {
    const { result } = renderHook(() => useFunctions());

    act(() => {
      result.current.addFunction('x^2');
    });

    // Wait a bit to ensure different timestamp
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    act(() => {
      result.current.addFunction('sin(x)');
    });

    const ids = result.current.functions.map(f => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should support undo', () => {
    const { result } = renderHook(() => useFunctions());

    act(() => {
      result.current.addFunction('x^2');
    });

    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.undo();
    });

    expect(result.current.functions).toHaveLength(0);
  });
});
