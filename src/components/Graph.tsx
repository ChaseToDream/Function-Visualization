import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import functionPlot from 'function-plot';
import { FunctionItem, CoordinateRange, GraphOptions } from '../types';
import { GRAPH_DEFAULTS } from '../config';

interface GraphProps {
  functions: FunctionItem[];
  coordinateRange: CoordinateRange;
}

const Graph: React.FC<GraphProps> = ({ functions, coordinateRange }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const graphId = useMemo(() => `graph-${Date.now()}`, []);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createGraphOptions = useCallback(
    (width: number, height: number): GraphOptions => ({
      target: `#${graphId}`,
      width,
      height,
      xAxis: {
        domain: [coordinateRange.xMin, coordinateRange.xMax],
      },
      yAxis: {
        domain: [coordinateRange.yMin, coordinateRange.yMax],
      },
      grid: GRAPH_DEFAULTS.grid,
      data: functions.map((func) => ({
        fn: func.expression,
        color: func.color,
      })),
    }),
    [graphId, coordinateRange, functions]
  );

  const renderGraph = useCallback(() => {
    if (graphRef.current) {
      setIsLoading(true);
      setError(null);
      try {
        const options = createGraphOptions(
          graphRef.current.clientWidth,
          graphRef.current.clientHeight
        );
        functionPlot(options);
      } catch (err) {
        setError('函数图像渲染失败，请检查函数表达式');
      } finally {
        setIsLoading(false);
      }
    }
  }, [createGraphOptions]);

  const exportAsPNG = useCallback(() => {
    if (graphRef.current) {
      const canvas = graphRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'function-graph.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  }, []);

  const exportAsSVG = useCallback(() => {
    if (graphRef.current) {
      const svg = graphRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.download = 'function-graph.svg';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  }, []);

  useEffect(() => {
    renderGraph();
  }, [renderGraph]);

  useEffect(() => {
    const handleResize = () => {
      renderGraph();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderGraph]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex items-center text-sm text-blue-600">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            渲染中...
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center p-4">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={renderGraph}
              className="btn-primary text-sm"
            >
              重试
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 mb-2">
        <button
          onClick={exportAsPNG}
          className="btn-secondary text-sm"
          disabled={isLoading || !!error}
        >
          导出 PNG
        </button>
        <button
          onClick={exportAsSVG}
          className="btn-secondary text-sm"
          disabled={isLoading || !!error}
        >
          导出 SVG
        </button>
      </div>
      <div
        id={graphId}
        ref={graphRef}
        className="w-full h-96 border border-gray-200 rounded-md"
        role="img"
        aria-label="函数图像显示区域"
      />
    </div>
  );
};

export default React.memo(Graph);