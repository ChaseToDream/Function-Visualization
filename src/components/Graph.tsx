import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import functionPlot from 'function-plot';
import { FunctionItem, CoordinateRange, GraphOptions } from '../types';
import { GRAPH_DEFAULTS } from '../config';
import { debounce } from '../utils/debounce';

interface GraphProps {
  functions: FunctionItem[];
  coordinateRange: CoordinateRange;
}

const DEBOUNCE_DELAY = 150;

const Graph: React.FC<GraphProps> = ({ functions, coordinateRange }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const graphId = useMemo(() => `graph-${Date.now()}`, []);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
        setError('渲染失败，请检查函数表达式');
      } finally {
        setIsLoading(false);
      }
    }
  }, [createGraphOptions]);

  const debouncedRenderGraph = useMemo(
    () => debounce(renderGraph, DEBOUNCE_DELAY),
    [renderGraph]
  );

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

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      graphRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    renderGraph();
  }, [renderGraph]);

  useEffect(() => {
    const handleResize = () => {
      debouncedRenderGraph();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [debouncedRenderGraph]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(renderGraph, 100);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [renderGraph]);

  return (
    <div className={`relative ${isFullscreen ? 'bg-white p-5' : ''}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white rounded-lg shadow-md">
            <svg className="animate-spin h-3.5 w-3.5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[13px] font-medium text-surface-600">渲染中...</span>
          </div>
        </div>
      )}
      
      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <div className="text-center p-5 bg-white rounded-xl shadow-md max-w-[240px]">
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-accent-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-[13px] font-medium text-surface-800 mb-0.5">渲染失败</p>
            <p className="text-[11px] text-surface-400 mb-3">{error}</p>
            <button
              onClick={renderGraph}
              className="btn-primary text-[13px] w-full py-2"
            >
              重试
            </button>
          </div>
        </div>
      )}
      
      {/* Toolbar */}
      <div className="flex justify-between items-center gap-2 mb-2.5">
        <div className="flex gap-1">
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-all duration-150"
            title={isFullscreen ? '退出全屏' : '全屏显示'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
          </button>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={exportAsPNG}
            className="btn-secondary text-[11px] py-1.5 px-2.5 gap-1"
            disabled={isLoading || !!error}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            PNG
          </button>
          <button
            onClick={exportAsSVG}
            className="btn-secondary text-[11px] py-1.5 px-2.5 gap-1"
            disabled={isLoading || !!error}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            SVG
          </button>
        </div>
      </div>
      
      {/* Graph Container */}
      <div
        id={graphId}
        ref={graphRef}
        className={`w-full bg-white border border-surface-100 rounded-lg ${isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[480px]'}`}
        role="img"
        aria-label="函数图像显示区域"
      />
    </div>
  );
};

export default React.memo(Graph);
