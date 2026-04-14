import React from 'react';

interface CoordinateRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

interface ControlsProps {
  coordinateRange: CoordinateRange;
  onUpdateCoordinateRange: (range: Partial<CoordinateRange>) => void;
}

const Controls: React.FC<ControlsProps> = ({ coordinateRange, onUpdateCoordinateRange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdateCoordinateRange({ [name]: parseFloat(value) });
  };

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;