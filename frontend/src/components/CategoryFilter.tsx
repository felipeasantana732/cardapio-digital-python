import React from 'react';
import { Categoria } from '../types';

interface CategoryFilterProps {
  categories: Categoria[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-4 py-2 rounded-full font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Todos
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.nome}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;