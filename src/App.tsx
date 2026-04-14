import { useState } from 'react';
import FunctionInput from './components/FunctionInput';
import FunctionList from './components/FunctionList';
import Graph from './components/Graph';
import Controls from './components/Controls';

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

function App() {
  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [coordinateRange, setCoordinateRange] = useState<CoordinateRange>({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  });

  const addFunction = (expression: string) => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    const color = colors[functions.length % colors.length];
    
    setFunctions([...functions, {
      id: Date.now().toString(),
      expression,
      color
    }]);
  };

  const removeFunction = (id: string) => {
    setFunctions(functions.filter(func => func.id !== id));
  };

  const updateCoordinateRange = (range: Partial<CoordinateRange>) => {
    setCoordinateRange({ ...coordinateRange, ...range });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">数学函数可视化</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">函数输入</h2>
              <FunctionInput onAddFunction={addFunction} />
              <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-4">函数列表</h2>
              <FunctionList functions={functions} onRemoveFunction={removeFunction} />
              <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-4">坐标设置</h2>
              <Controls coordinateRange={coordinateRange} onUpdateCoordinateRange={updateCoordinateRange} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">函数图像</h2>
              <Graph functions={functions} coordinateRange={coordinateRange} />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white shadow mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">© 2026 数学函数可视化</p>
        </div>
      </footer>
    </div>
  );
}

export default App;