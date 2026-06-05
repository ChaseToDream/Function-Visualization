import React, { useState, useEffect, useCallback, useRef } from 'react';

interface AnimationPlayerProps {
  baseExpression: string;
  parameter?: string;
  range?: { min: number; max: number };
  speed?: number;
  onParameterChange: (value: number) => void;
}

const AnimationPlayer: React.FC<AnimationPlayerProps> = ({
  baseExpression,
  parameter = 'a',
  range = { min: -5, max: 5 },
  speed = 1,
  onParameterChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  const directionRef = useRef(1);  // 使用 useRef 替代 useState
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = timestamp - lastTimeRef.current;
    
    if (elapsed > 50 / speed) {
      lastTimeRef.current = timestamp;
      
      setCurrentValue((prev) => {
        const step = (range.max - range.min) / 100 * directionRef.current;
        let next = prev + step;
        
        if (next >= range.max) {
          next = range.max;
          directionRef.current = -1;
        } else if (next <= range.min) {
          next = range.min;
          directionRef.current = 1;
        }
        
        onParameterChange(next);
        return next;
      });
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [range, speed, onParameterChange]);  // 移除 direction 依赖

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentValue(value);
    onParameterChange(value);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentValue(0);
    onParameterChange(0);
  };

  const presetValues = [
    { value: -2, label: '-2' },
    { value: -1, label: '-1' },
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
  ];

  return (
    <div className="p-3 bg-surface-50 rounded-lg border border-surface-100">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-surface-600">
          动画演示 - 参数 {parameter}
        </div>
        <div className="text-xs font-mono text-primary-600">
          {parameter} = {currentValue.toFixed(2)}
        </div>
      </div>

      {/* Slider */}
      <div className="mb-3">
        <input
          type="range"
          min={range.min}
          max={range.max}
          step={0.01}
          value={currentValue}
          onChange={handleSliderChange}
          className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-[10px] text-surface-400 mt-1">
          <span>{range.min}</span>
          <span>{range.max}</span>
        </div>
      </div>

      {/* Preset values */}
      <div className="flex flex-wrap gap-1 mb-3">
        {presetValues.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => {
              setCurrentValue(value);
              onParameterChange(value);
            }}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
              Math.abs(currentValue - value) < 0.01
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handlePlayPause}
          className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
            isPlaying
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-primary-50 border-primary-200 text-primary-700'
          }`}
        >
          {isPlaying ? (
            <span className="flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              暂停
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              播放
            </span>
          )}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs rounded-lg border bg-white border-surface-200 text-surface-600 hover:bg-surface-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Preview expression */}
      <div className="mt-3 p-2 bg-white rounded border border-surface-100">
        <div className="text-[10px] text-surface-400 mb-1">当前表达式</div>
        <div className="text-xs font-mono text-primary-600">
          {baseExpression.replace(parameter, `(${currentValue.toFixed(2)})`)}
        </div>
      </div>
    </div>
  );
};

export default AnimationPlayer;
