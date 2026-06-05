export interface FunctionItem {
  id: string;
  expression: string;
  color: string;
  name?: string;
  description?: string;
  visible?: boolean;
  lineWidth?: number;
  isFavorite?: boolean;
}

export interface CoordinateRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface MathSymbol {
  label: string;
  value: string;
  category: string;
}

export interface GraphOptions {
  target: string;
  width: number;
  height: number;
  xAxis: {
    domain: [number, number];
  };
  yAxis: {
    domain: [number, number];
  };
  grid: boolean;
  data: Array<{
    fn: string;
    color: string;
  }>;
}

export interface ExportData {
  version: string;
  timestamp: string;
  functions: Array<{
    expression: string;
    color: string;
    name?: string;
  }>;
  coordinateRange: CoordinateRange;
}

export interface FavoriteFunction {
  id: string;
  name: string;
  expression: string;
  category?: string;
  addedAt: number;
}

export interface FunctionEvaluation {
  expression: string;
  xValue: number;
  yValue: number;
  isValid: boolean;
}

export interface ShareConfig {
  functions: string[];
  range: CoordinateRange;
}

export type Theme = 'light' | 'system';

export type ExportFormat = 'json' | 'csv' | 'png' | 'svg';

export type GraphStyle = 'solid' | 'dashed' | 'dotted';
