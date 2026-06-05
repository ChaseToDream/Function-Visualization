import { useState, useCallback } from 'react';
import { CoordinateRange } from '../types';
import { DEFAULT_COORDINATE_RANGE } from '../config';

export function useCoordinateRange() {
  const [coordinateRange, setCoordinateRange] = useState<CoordinateRange>(DEFAULT_COORDINATE_RANGE);

  const updateCoordinateRange = useCallback((range: Partial<CoordinateRange>) => {
    setCoordinateRange((prev) => ({ ...prev, ...range }));
  }, []);

  const resetCoordinateRange = useCallback(() => {
    setCoordinateRange(DEFAULT_COORDINATE_RANGE);
  }, []);

  return {
    coordinateRange,
    updateCoordinateRange,
    resetCoordinateRange,
  };
}
