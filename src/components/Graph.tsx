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
        setError('Rendering failed. Check your expression.');
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
    <div className={`relative ${isFullscreen ? 'bg-dark-900 p-4' : ''}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex items-center gap-3 px-4 py-2 bg-dark-800 border border-neon-blue/30 rounded-sm">
            <svg className="animate-spin h-4 w-4 text-neon-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs font-mono text-neon-blue">RENDERING...</span>
          </div>
        </div>
      )}
      
      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center p-6 bg-dark-800 border border-neon-pink/30 rounded-sm">
            <div className="w-12 h-12 mx-auto mb-3 rounded-sm bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center">
              <span className="text-2xl">⚠</span>
            </div>
            <p className="text-sm font-mono text-neon-pink mb-4">{error.toUpperCase()}</p>
            <button
              onClick={renderGraph}
              className="btn-primary text-xs"
            >
              RETRY
            </button>
          </div>
        </div>
      )}
      
      {/* Toolbar */}
      <div className="flex justify-between items-center gap-2 mb-3">
        <div className="flex gap-1">
          <button
            onClick={toggleFullscreen}
            className="px-2 py-1 text-xs font-mono bg-dark-700 text-gray-400 hover:text-neon-blue hover:bg-dark-600 border border-dark-500 hover:border-neon-blue/30 rounded-sm transition-all duration-200"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? '⊡' : '⊞'}
          </button>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={exportAsPNG}
            className="btn-secondary text-xs py-1"
            disabled={isLoading || !!error}
          >
            PNG
          </button>
          <button
            onClick={exportAsSVG}
            className="btn-secondary text-xs py-1"
            disabled={isLoading || !!error}
          >
            SVG
          </button>
        </div>
      </div>
      
      {/* Graph Container */}
      <div
        id={graphId}
        ref={graphRef}
        className={`w-full border border-dark-500/50 rounded-sm bg-dark-900 ${isFullscreen ? 'h-[calc(100vh-160px)]' : 'h-[500px]'}`}
        role="img"
        aria-label="函数图像显示区域"
      />
      
      {/* Graph Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {functions.length > 0 && (
            <div className="flex items-center gap-1.5">
              {functions.slice(0, 5).map((func) => (
                <div key={func.id} className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: func.color }}
                  />
                  <span className="text-xs font-mono text-gray-500">
                    {func.expression.length > 8 ? func.expression.substring(0, 8) + '...' : func.expression}
                  </span>
                </div>
              ))}
              {functions.length > 5 && (
                <span className="text-xs font-mono text-gray-600">+{functions.length - 5}</span>
              )}
            </div>
          )}
        </div>
        <span className="text-xs font-mono text-gray-600">
          {functions.length} FUNCTION{functions.length !== 1 ? 'S' : ''}
        </span>
      </div>
    </div>
  );
};

export default React.memo(Graph);
