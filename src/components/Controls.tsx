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
    { id: 'xMin', label: 'X MIN', value: coordinateRange.xMin, color: 'neon-blue' },
    { id: 'xMax', label: 'X MAX', value: coordinateRange.xMax, color: 'neon-blue' },
    { id: 'yMin', label: 'Y MIN', value: coordinateRange.yMin, color: 'neon-purple' },
    { id: 'yMax', label: 'Y MAX', value: coordinateRange.yMax, color: 'neon-purple' },
  ], [coordinateRange]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {inputs.slice(0, 2).map(({ id, label, value }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-xs font-mono text-gray-500 tracking-wider mb-1.5">
              {label}
            </label>
            <input
              type="number"
              id={id}
              name={id}
              value={value}
              onChange={handleInputChange}
              className="input-field text-xs py-2"
              aria-label={`${label}轴`}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {inputs.slice(2).map(({ id, label, value }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-xs font-mono text-gray-500 tracking-wider mb-1.5">
              {label}
            </label>
            <input
              type="number"
              id={id}
              name={id}
              value={value}
              onChange={handleInputChange}
              className="input-field text-xs py-2"
              aria-label={`${label}轴`}
            />
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-dark-500/50">
        <div className="flex items-center justify-between text-xs font-mono text-gray-600">
          <span>RANGE</span>
          <span className="text-neon-blue">[{coordinateRange.xMin}, {coordinateRange.xMax}]</span>
        </div>
      </div>
    </div>
  );
});

Controls.displayName = 'Controls';

export default Controls;
