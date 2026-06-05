import { compile } from 'mathjs';

export interface FunctionAnalysis {
  zeros: number[];
  extrema: Extremum[];
  inflectionPoints: number[];
  domain: { min: number; max: number };
  range: { min: number; max: number };
  isEven: boolean;
  isOdd: boolean;
  isPeriodic: boolean;
  period?: number;
}

export interface Extremum {
  x: number;
  y: number;
  type: 'max' | 'min';
}

export interface Intersection {
  x: number;
  y: number;
}

const evaluateAt = (expression: string, x: number): number => {
  try {
    const compiled = compile(expression);
    return compiled.evaluate({ x }) as number;
  } catch {
    return NaN;
  }
};

const derivative = (expression: string, x: number, h: number = 0.0001): number => {
  const fPlus = evaluateAt(expression, x + h);
  const fMinus = evaluateAt(expression, x - h);
  return (fPlus - fMinus) / (2 * h);
};

const secondDerivative = (expression: string, x: number, h: number = 0.0001): number => {
  const fPlus = evaluateAt(expression, x + h);
  const fCenter = evaluateAt(expression, x);
  const fMinus = evaluateAt(expression, x - h);
  return (fPlus - 2 * fCenter + fMinus) / (h * h);
};

export const findZeros = (
  expression: string,
  xMin: number = -10,
  xMax: number = 10,
  step: number = 0.1
): number[] => {
  const zeros: number[] = [];
  let prevY = evaluateAt(expression, xMin);
  
  for (let x = xMin + step; x <= xMax; x += step) {
    const y = evaluateAt(expression, x);
    
    if (!isNaN(y) && !isNaN(prevY) && isFinite(y) && isFinite(prevY)) {
      if ((prevY <= 0 && y >= 0) || (prevY >= 0 && y <= 0)) {
        // Binary search for more precise zero
        let low = x - step;
        let high = x;
        for (let i = 0; i < 20; i++) {
          const mid = (low + high) / 2;
          const midY = evaluateAt(expression, mid);
          if (isNaN(midY) || !isFinite(midY)) break;
          
          if (Math.abs(midY) < 0.0001) {
            zeros.push(Math.round(mid * 10000) / 10000);
            break;
          }
          
          if ((prevY <= 0 && midY > 0) || (prevY >= 0 && midY < 0)) {
            high = mid;
          } else {
            low = mid;
            prevY = midY;
          }
        }
      }
    }
    
    prevY = y;
  }
  
  // Remove duplicates
  return [...new Set(zeros)].filter((z) => !isNaN(z) && isFinite(z));
};

export const findExtrema = (
  expression: string,
  xMin: number = -10,
  xMax: number = 10,
  step: number = 0.5
): Extremum[] => {
  const extrema: Extremum[] = [];
  
  for (let x = xMin + step; x < xMax - step; x += step) {
    const d1 = derivative(expression, x);
    const d1Next = derivative(expression, x + step);
    
    if (!isNaN(d1) && !isNaN(d1Next) && isFinite(d1) && isFinite(d1Next)) {
      // Check if derivative changes sign
      if ((d1 >= 0 && d1Next <= 0) || (d1 <= 0 && d1Next >= 0)) {
        // Binary search for precise extremum
        let low = x;
        let high = x + step;
        for (let i = 0; i < 20; i++) {
          const mid = (low + high) / 2;
          const dMid = derivative(expression, mid);
          
          if (Math.abs(dMid) < 0.0001) {
            const y = evaluateAt(expression, mid);
            const d2 = secondDerivative(expression, mid);
            
            if (!isNaN(y) && isFinite(y)) {
              extrema.push({
                x: Math.round(mid * 10000) / 10000,
                y: Math.round(y * 10000) / 10000,
                type: d2 > 0 ? 'min' : 'max',
              });
            }
            break;
          }
          
          if ((d1 >= 0 && dMid > 0) || (d1 <= 0 && dMid < 0)) {
            low = mid;
          } else {
            high = mid;
          }
        }
      }
    }
  }
  
  // Remove duplicates
  const unique = extrema.filter(
    (e, i, arr) => arr.findIndex((a) => Math.abs(a.x - e.x) < 0.001) === i
  );
  
  return unique;
};

export const findIntersections = (
  expr1: string,
  expr2: string,
  xMin: number = -10,
  xMax: number = 10,
  step: number = 0.1
): Intersection[] => {
  const intersections: Intersection[] = [];
  let prevDiff = evaluateAt(expr1, xMin) - evaluateAt(expr2, xMin);
  
  for (let x = xMin + step; x <= xMax; x += step) {
    const diff = evaluateAt(expr1, x) - evaluateAt(expr2, x);
    
    if (!isNaN(diff) && !isNaN(prevDiff) && isFinite(diff) && isFinite(prevDiff)) {
      if ((prevDiff <= 0 && diff >= 0) || (prevDiff >= 0 && diff <= 0)) {
        // Binary search
        let low = x - step;
        let high = x;
        for (let i = 0; i < 20; i++) {
          const mid = (low + high) / 2;
          const midDiff = evaluateAt(expr1, mid) - evaluateAt(expr2, mid);
          
          if (Math.abs(midDiff) < 0.0001) {
            const y = evaluateAt(expr1, mid);
            if (!isNaN(y) && isFinite(y)) {
              intersections.push({
                x: Math.round(mid * 10000) / 10000,
                y: Math.round(y * 10000) / 10000,
              });
            }
            break;
          }
          
          if ((prevDiff <= 0 && midDiff > 0) || (prevDiff >= 0 && midDiff < 0)) {
            high = mid;
          } else {
            low = mid;
            prevDiff = midDiff;
          }
        }
      }
    }
    
    prevDiff = diff;
  }
  
  return intersections;
};

export const analyzeFunction = (
  expression: string,
  xMin: number = -10,
  xMax: number = 10
): FunctionAnalysis => {
  const zeros = findZeros(expression, xMin, xMax);
  const extrema = findExtrema(expression, xMin, xMax);
  
  // Check if function is even or odd
  const testPoints = [1, 2, 3, 4, 5];
  let isEven = true;
  let isOdd = true;
  
  for (const x of testPoints) {
    const fX = evaluateAt(expression, x);
    const fNegX = evaluateAt(expression, -x);
    
    if (isNaN(fX) || isNaN(fNegX) || !isFinite(fX) || !isFinite(fNegX)) {
      isEven = false;
      isOdd = false;
      break;
    }
    
    if (Math.abs(fX - fNegX) > 0.001) isEven = false;
    if (Math.abs(fX + fNegX) > 0.001) isOdd = false;
  }
  
  // Find range
  let rangeMin = Infinity;
  let rangeMax = -Infinity;
  for (let x = xMin; x <= xMax; x += 0.1) {
    const y = evaluateAt(expression, x);
    if (!isNaN(y) && isFinite(y)) {
      rangeMin = Math.min(rangeMin, y);
      rangeMax = Math.max(rangeMax, y);
    }
  }
  
  return {
    zeros,
    extrema,
    inflectionPoints: [], // Simplified - would need third derivative
    domain: { min: xMin, max: xMax },
    range: { min: Math.round(rangeMin * 100) / 100, max: Math.round(rangeMax * 100) / 100 },
    isEven,
    isOdd,
    isPeriodic: false, // Simplified detection
  };
};
