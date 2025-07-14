import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Plus, Minus, Search } from 'lucide-react';
import { Treatment, QuoteItem } from './types';

interface TreatmentSelectorProps {
  treatments: Treatment[];
  categories: any[];
  quoteItems: QuoteItem[];
  onAddTreatment: (treatment: Treatment) => void;
  onRemoveTreatment: (treatmentId: number) => void;
}

const TreatmentSelector: React.FC<TreatmentSelectorProps> = ({
  treatments,
  categories,
  quoteItems,
  onAddTreatment,
  onRemoveTreatment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrar tratamientos basado en búsqueda y categoría
  const filteredTreatments = treatments.filter(treatment => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      treatment.name.toLowerCase().includes(searchLower) ||
      treatment.category.toLowerCase().includes(searchLower) ||
      treatment.price.toString().includes(searchQuery)
    );
    
    const matchesCategory = selectedCategory === 'all' || treatment.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tratamientos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tratamientos..."
              className="pl-10"
            />
          </div>

          {/* Tabs de categorías */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="flex w-full bg-transparent flex-wrap gap-2 justify-start">
              <TabsTrigger 
                value="all" 
                className="text-xs data-[state=active]:bg-sakura-red data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Todos
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.categorieServiceId} 
                  value={category.name} 
                  className="text-xs whitespace-nowrap data-[state=active]:bg-sakura-red data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedCategory} className="mt-4">
              {filteredTreatments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>
                    {searchQuery 
                      ? `No se encontraron tratamientos con "${searchQuery}" en ${selectedCategory === 'all' ? 'todas las categorías' : selectedCategory}`
                      : `No hay servicios disponibles en ${selectedCategory === 'all' ? 'todas las categorías' : selectedCategory}`
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {filteredTreatments.map((treatment) => {
            const quoteItem = quoteItems.find(item => item.id === treatment.id);
            return (
              <div key={treatment.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{treatment.name}</h3>
                    <Badge variant="secondary" className="text-xs mt-1 bg-sakura-red/10 text-sakura-red border-sakura-red/20">
                      {treatment.category}
                    </Badge>
                  </div>
                  <div className="text-right ml-4">
                    <span className="font-bold text-sakura-red text-lg">
                      S/ {treatment.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddTreatment(treatment)}
                    className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                  
                  {quoteItem && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveTreatment(treatment.id)}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium px-3 py-1 bg-sakura-red/10 text-sakura-red rounded-md min-w-[2rem] text-center">
                        {quoteItem.quantity}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default TreatmentSelector; 