import React, { useRef, useEffect, useState } from 'react';
import functionPlot from 'function-plot';

interface FunctionItem {
  id: string;
  expression: string;
  color: string;
}

interface CoordinateRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface GraphProps {
  functions: FunctionItem[];
  coordinateRange: CoordinateRange;
}

const Graph: React.FC<GraphProps> = ({ functions, coordinateRange }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphId] = useState(`graph-${Date.now()}`);

  useEffect(() => {
    if (graphRef.current) {
      const options = {
        target: `#${graphId}`,
        width: graphRef.current.clientWidth,
        height: 500,
        xAxis: {
          domain: [coordinateRange.xMin, coordinateRange.xMax]
        },
        yAxis: {
          domain: [coordinateRange.yMin, coordinateRange.yMax]
        },
        grid: true,
        data: functions.map(func => ({
          fn: func.expression,
          color: func.color
        }))
      };

      functionPlot(options);
    }
  }, [functions, coordinateRange]);

  useEffect(() => {
    const handleResize = () => {
      if (graphRef.current) {
        const options = {
          target: `#${graphId}`,
          width: graphRef.current.clientWidth,
          height: 500,
          xAxis: {
            domain: [coordinateRange.xMin, coordinateRange.xMax]
          },
          yAxis: {
            domain: [coordinateRange.yMin, coordinateRange.yMax]
          },
          grid: true,
          data: functions.map(func => ({
            fn: func.expression,
            color: func.color
          }))
        };

        functionPlot(options);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [functions, coordinateRange]);

  return (
    <div 
      id={graphId} 
      ref={graphRef} 
      className="w-full h-96 border border-gray-200 rounded-md"
    />
  );
};

export default Graph;