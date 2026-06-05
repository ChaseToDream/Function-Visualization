import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunctionStore } from '../stores/functionStore';
import { useUIStore } from '../stores/uiStore';
import { FUNCTION_PRESETS, PRESET_CATEGORIES } from '../config';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const { addFunction, functions } = useFunctionStore();
  const { addNotification } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('funcviz-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const toggleFavorite = (expression: string) => {
    const newFavorites = favorites.includes(expression)
      ? favorites.filter((f) => f !== expression)
      : [...favorites, expression];
    setFavorites(newFavorites);
    localStorage.setItem('funcviz-favorites', JSON.stringify(newFavorites));
  };

  const filteredPresets = useMemo(() => {
    return FUNCTION_PRESETS.filter((preset) => {
      const matchesSearch = !searchTerm || 
        preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preset.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        preset.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || preset.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || favorites.includes(preset.expression);
      
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [searchTerm, selectedCategory, showFavoritesOnly, favorites]);

  const handleAddPreset = (expression: string, name: string) => {
    if (functions.some((f) => f.expression === expression)) {
      addNotification({
        type: 'warning',
        title: '函数已存在',
        message: `${name} 已经在列表中`,
      });
      return;
    }
    addFunction(expression);
    addNotification({
      type: 'success',
      title: '添加成功',
      message: `已添加 ${name}`,
    });
    navigate('/');
  };

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {};
    FUNCTION_PRESETS.forEach((preset) => {
      counts[preset.category] = (counts[preset.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900 mb-2">函数库</h1>
          <p className="text-sm text-surface-500">浏览并添加预设的数学函数，共 {FUNCTION_PRESETS.length} 个预设</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
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
                placeholder="搜索函数名称、表达式或标签..."
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`btn-secondary gap-2 ${showFavoritesOnly ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}`}
            >
              <svg className="w-4 h-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              收藏
            </button>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedCategory === null
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              全部 ({FUNCTION_PRESETS.length})
            </button>
            {PRESET_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {category} ({categoryCount[category] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-surface-500">
          显示 {filteredPresets.length} 个函数
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPresets.map((preset, index) => (
            <div
              key={index}
              className="p-4 bg-surface-50 border border-surface-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-900 group-hover:text-primary-700 transition-colors text-sm">
                    {preset.name}
                  </h3>
                  <span className="text-[10px] text-surface-400 bg-surface-100 px-1.5 py-0.5 rounded">
                    {preset.category}
                  </span>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(preset.expression);
                    }}
                    className="p-1 text-surface-300 hover:text-red-500 transition-colors"
                    title={favorites.includes(preset.expression) ? '取消收藏' : '添加收藏'}
                  >
                    <svg className="w-4 h-4" fill={favorites.includes(preset.expression) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleAddPreset(preset.expression, preset.name)}
                    className="p-1 text-surface-300 hover:text-primary-500 transition-colors"
                    title="添加到可视化"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="font-mono text-xs text-primary-600 mb-2 bg-primary-50 px-2 py-1 rounded">
                {preset.expression}
              </div>
              <p className="text-xs text-surface-500 mb-2">{preset.description}</p>
              {preset.tags && preset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {preset.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-[10px] text-surface-400 bg-surface-100 px-1.5 py-0.5 rounded cursor-pointer hover:bg-surface-200"
                      onClick={() => setSearchTerm(tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
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
            <p className="text-surface-500 mb-2">没有找到匹配的函数</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
                setShowFavoritesOnly(false);
              }}
              className="text-primary-600 text-sm hover:underline"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
