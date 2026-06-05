import React, { useCallback } from 'react';
import { CoordinateRange } from '../types';

interface ControlsProps {
  coordinateRange: CoordinateRange;
  onUpdateCoordinateRange: (range: Partial<CoordinateRange>) => void;
}

const Controls: React.FC<ControlsProps> = ({ coordinateRange, onUpdateCoordinateRange }) => {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      onUpdateCoordinateRange({ [name]: parseFloat(value) });
    },
    [onUpdateCoordinateRange]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="xMin" className="block text-sm font-medium text-gray-700 mb-1">
            X 最小值
          </label>
          <input
            type="number"
            id="xMin"
            name="xMin"
            value={coordinateRange.xMin}
            onChange={handleInputChange}
            className="input-field"
            aria-label="X轴最小值"
          />
        </div>
        <div>
          <label htmlFor="xMax" className="block text-sm font-medium text-gray-700 mb-1">
            X 最大值
          </label>
          <input
            type="number"
            id="xMax"
            name="xMax"
            value={coordinateRange.xMax}
            onChange={handleInputChange}
            className="input-field"
            aria-label="X轴最大值"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="yMin" className="block text-sm font-medium text-gray-700 mb-1">
            Y 最小值
          </label>
          <input
            type="number"
            id="yMin"
            name="yMin"
            value={coordinateRange.yMin}
            onChange={handleInputChange}
            className="input-field"
            aria-label="Y轴最小值"
          />
        </div>
        <div>
          <label htmlFor="yMax" className="block text-sm font-medium text-gray-700 mb-1">
            Y 最大值
          </label>
          <input
            type="number"
            id="yMax"
            name="yMax"
            value={coordinateRange.yMax}
            onChange={handleInputChange}
            className="input-field"
            aria-label="Y轴最大值"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Controls);