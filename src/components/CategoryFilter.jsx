import React from 'react';
import { useStore } from '../context/StoreContext';

export default function CategoryFilter() {
  const { categories, products, selectedCategory, setSelectedCategory } = useStore();

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

  // Count products in each category
  const getProductCount = (catId) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = getProductCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border select-none ${
                isActive
                  ? 'bg-gradient-to-r from-peach-500 to-[#fa5f38] text-white border-transparent shadow-md shadow-peach-500/25 scale-[1.02]'
                  : 'bg-white hover:bg-peach-50/60 text-slate-700 hover:text-peach-800 border-stone-200/80 shadow-2xs'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {getCategoryIcon(cat.icon)}
              </span>
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-peach-50 text-peach-700 border border-peach-200/50'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
