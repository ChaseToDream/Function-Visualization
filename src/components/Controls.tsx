import React, { useCallback, useMemo } from 'react';
import { CoordinateRange } from '../types';

interface ControlsProps {
  coordinateRange: CoordinateRange;
  onUpdateCoordinateRange: (range: Partial<CoordinateRange>) => void;
}

const Controls: React.FC<ControlsProps> = React.memo(({ coordinateRange, onUpdateCoordinateRange }) => {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      onUpdateCoordinateRange({ [name]: parseFloat(value) });
    },
    [onUpdateCoordinateRange]
  );

  const inputs = useMemo(() => [
    { id: 'xMin', label: 'X 最小值', value: coordinateRange.xMin },
    { id: 'xMax', label: 'X 最大值', value: coordinateRange.xMax },
    { id: 'yMin', label: 'Y 最小值', value: coordinateRange.yMin },
    { id: 'yMax', label: 'Y 最大值', value: coordinateRange.yMax },
  ], [coordinateRange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {inputs.slice(0, 2).map(({ id, label, value }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-xs font-medium text-surface-500 mb-1.5">
              {label}
            </label>
            <input
              type="number"
              id={id}
              name={id}
              value={value}
              onChange={handleInputChange}
              className="input-field text-sm py-2.5"
              aria-label={`${label}轴`}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {inputs.slice(2).map(({ id, label, value }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-xs font-medium text-surface-500 mb-1.5">
              {label}
            </label>
            <input
              type="number"
              id={id}
              name={id}
              value={value}
              onChange={handleInputChange}
              className="input-field text-sm py-2.5"
              aria-label={`${label}轴`}
            />
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-surface-100">
        <div className="flex items-center justify-between text-xs text-surface-500">
          <span>显示范围</span>
          <span className="font-mono">[{coordinateRange.xMin}, {coordinateRange.xMax}]</span>
        </div>
      </div>
    </div>
  );
});

Controls.displayName = 'Controls';

export default Controls;
