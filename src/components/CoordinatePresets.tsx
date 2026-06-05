import React from 'react';
import { COORDINATE_PRESETS } from '../config';
import { CoordinateRange } from '../types';

interface CoordinatePresetsProps {
  currentRange: CoordinateRange;
  onSelect: (range: Partial<CoordinateRange>) => void;
}

const CoordinatePresets: React.FC<CoordinatePresetsProps> = ({ currentRange, onSelect }) => {
  const isCurrentPreset = (preset: typeof COORDINATE_PRESETS[0]) => {
    return (
      Math.abs(currentRange.xMin - preset.xMin) < 0.01 &&
      Math.abs(currentRange.xMax - preset.xMax) < 0.01 &&
      Math.abs(currentRange.yMin - preset.yMin) < 0.01 &&
      Math.abs(currentRange.yMax - preset.yMax) < 0.01
    );
  };

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-surface-500">坐标预设</div>
      <div className="grid grid-cols-2 gap-1.5">
        {COORDINATE_PRESETS.map((preset, index) => (
          <button
            key={index}
            onClick={() => onSelect({
              xMin: preset.xMin,
              xMax: preset.xMax,
              yMin: preset.yMin,
              yMax: preset.yMax,
            })}
            className={`px-2 py-1.5 text-[11px] rounded-lg transition-colors ${
              isCurrentPreset(preset)
                ? 'bg-primary-100 text-primary-700 border border-primary-200 font-medium'
                : 'bg-surface-50 text-surface-600 border border-surface-100 hover:bg-surface-100'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CoordinatePresets;
