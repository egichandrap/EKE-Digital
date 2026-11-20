import React from 'react';
import { useStore } from '../context/StoreContext';

export default function CategoryFilter() {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'widgets': return 'widgets';
      case 'psychology': return 'psychology';
      case 'smart_display': return 'smart_display';
      case 'folder_special': return 'folder_special';
      case 'palette': return 'palette';
      case 'table_chart': return 'table_chart';
      case 'code': return 'code';
      case 'menu_book': return 'menu_book';
      default: return 'category';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#b22204] text-white border-[#b22204] shadow-sm shadow-[#b22204]/20 scale-102'
                  : 'bg-white hover:bg-[#f0f3ff] text-[#5b403b] hover:text-[#111c2d] border-[#f0f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {getCategoryIcon(cat.icon)}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
