import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunctionStore } from '../stores/functionStore';
import { FUNCTION_PRESETS } from '../config';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const { addFunction } = useFunctionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['基础函数', '三角函数', '指数对数', '其他'];

  const filteredPresets = FUNCTION_PRESETS.filter((preset) => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.expression.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddPreset = (expression: string) => {
    addFunction(expression);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900 mb-2">函数库</h1>
          <p className="text-sm text-surface-500">浏览并添加预设的数学函数</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索函数..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selectedCategory === null
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresets.map((preset, index) => (
            <div
              key={index}
              className="p-4 bg-surface-50 border border-surface-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200 group cursor-pointer"
              onClick={() => handleAddPreset(preset.expression)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-surface-900 group-hover:text-primary-700 transition-colors">
                  {preset.name}
                </h3>
                <svg
                  className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div className="font-mono text-sm text-primary-600 mb-2">{preset.expression}</div>
              <p className="text-xs text-surface-500">{preset.description}</p>
            </div>
          ))}
        </div>

        {filteredPresets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-surface-500">没有找到匹配的函数</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
