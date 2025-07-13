import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, Minus } from 'lucide-react';
import { Treatment, QuoteItem } from './types';

interface TreatmentSelectorProps {
  treatments: Treatment[];
  quoteItems: QuoteItem[];
  onAddTreatment: (treatment: Treatment) => void;
  onRemoveTreatment: (treatmentId: number) => void;
}

const TreatmentSelector: React.FC<TreatmentSelectorProps> = ({
  treatments,
  quoteItems,
  onAddTreatment,
  onRemoveTreatment
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tratamientos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {treatments.map((treatment) => {
            const quoteItem = quoteItems.find(item => item.id === treatment.id);
            return (
              <div key={treatment.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{treatment.name}</h3>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {treatment.category}
                    </Badge>
                  </div>
                  <span className="font-bold text-sakura-red">
                    S/ {treatment.price}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddTreatment(treatment)}
                    className="border-sakura-red text-sakura-red hover:bg-sakura-red hover:text-white"
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
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium px-2">{quoteItem.quantity}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TreatmentSelector; 