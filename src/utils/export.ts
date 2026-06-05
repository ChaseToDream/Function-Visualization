import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { FunctionItem, CoordinateRange } from '../types';

interface ExportData {
  version: string;
  timestamp: string;
  functions: Array<{
    expression: string;
    color: string;
  }>;
  coordinateRange: CoordinateRange;
}

export const exportAsJSON = (
  functions: FunctionItem[],
  coordinateRange: CoordinateRange,
  filename?: string
): void => {
  const data: ExportData = {
    version: '2.1',
    timestamp: new Date().toISOString(),
    functions: functions.map((f) => ({
      expression: f.expression,
      color: f.color,
    })),
    coordinateRange,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  });

  saveAs(blob, filename || `funcviz-export-${Date.now()}.json`);
};

export const exportAsCSV = (
  functions: FunctionItem[],
  filename?: string
): void => {
  const data = functions.map((f) => ({
    Expression: f.expression,
    Color: f.color,
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });

  saveAs(blob, filename || `funcviz-export-${Date.now()}.csv`);
};

export const exportAsSVG = (svgElement: SVGElement, filename?: string): void => {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

  saveAs(blob, filename || `funcviz-graph-${Date.now()}.svg`);
};

export const exportAsPNG = (
  canvasElement: HTMLCanvasElement,
  filename?: string
): void => {
  canvasElement.toBlob((blob) => {
    if (blob) {
      saveAs(blob, filename || `funcviz-graph-${Date.now()}.png`);
    }
  }, 'image/png');
};

export const importFromJSON = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ExportData;
        
        // Validate top-level structure
        if (!data.version || !data.functions || !data.coordinateRange) {
          throw new Error('文件格式无效：缺少必要的字段');
        }
        
        // Validate functions array
        if (!Array.isArray(data.functions)) {
          throw new Error('文件格式无效：functions 应该是数组');
        }
        
        // Validate each function object
        data.functions.forEach((func, index) => {
          if (!func.expression || typeof func.expression !== 'string') {
            throw new Error(`函数 #${index + 1} 缺少 expression 字段`);
          }
          if (!func.color || typeof func.color !== 'string') {
            throw new Error(`函数 #${index + 1} 缺少 color 字段`);
          }
        });
        
        // Validate coordinateRange
        const { xMin, xMax, yMin, yMax } = data.coordinateRange;
        if (typeof xMin !== 'number' || typeof xMax !== 'number' || 
            typeof yMin !== 'number' || typeof yMax !== 'number') {
          throw new Error('坐标范围格式无效');
        }
        
        resolve(data);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('解析 JSON 文件失败'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsText(file);
  });
};
