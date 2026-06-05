export interface FunctionItem {
  id: string;
  expression: string;
  color: string;
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