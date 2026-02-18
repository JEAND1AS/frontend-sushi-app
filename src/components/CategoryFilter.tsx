import type { Category } from '../types';

const categories: Category[] = [
  'Entradas',
  'Niguiris',
  'Makis',
  'Temakis',
  'Pratos Quentes',
  'Bebidas',
  'Sobremesas',
];

interface CategoryFilterProps {
  selected: Category | 'Todos';
  onChange: (category: Category | 'Todos') => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange('Todos')}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selected === 'Todos'
            ? 'bg-red-600 text-white'
            : 'bg-white/10 text-gray-300 hover:bg-white/20'
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === cat
              ? 'bg-red-600 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
