import React from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Search } from 'lucide-react';

interface Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categoryOptions: string[];
}

export const ServiceSearchBar: React.FC<Props> = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categoryOptions }) => (
  <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sakura-gray" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar servicios..."
        className="pl-10"
      />
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          Categoría: {selectedCategory}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {categoryOptions.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => setSelectedCategory(category.toString())}
          >
            {category}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
); 