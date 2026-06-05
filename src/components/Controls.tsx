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
      <div className="grid grid-cols-2 gap-4">
        {inputs.slice(0, 2).map(({ id, label, value }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="number"
              id={id}
              name={id}
              value={value}
              onChange={handleInputChange}
              className="input-field"
              aria-label={`${label}轴`}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {inputs.slice(2).map(({ id, label, value }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="number"
              id={id}
              name={id}
              value={value}
              onChange={handleInputChange}
              className="input-field"
              aria-label={`${label}轴`}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

Controls.displayName = 'Controls';

export default Controls;