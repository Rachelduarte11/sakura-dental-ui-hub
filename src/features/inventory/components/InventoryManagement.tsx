
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Plus, Edit, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  supplier: string;
  unitPrice: number;
  lastUpdate: string;
}

const InventoryManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    stock: 0,
    minStock: 0,
    supplier: '',
    unitPrice: 0,
  });

  // Mock data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 1,
      name: 'Anestesia Lidocaína',
      category: 'Medicamentos',
      stock: 5,
      minStock: 10,
      supplier: 'Distribuidora Médica SAC',
      unitPrice: 15.50,
      lastUpdate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Amalgama Dental',
      category: 'Materiales',
      stock: 25,
      minStock: 15,
      supplier: 'Dental Supply Corp',
      unitPrice: 45.00,
      lastUpdate: '2024-01-10',
    },
    {
      id: 3,
      name: 'Guantes de Nitrilo',
      category: 'Insumos',
      stock: 8,
      minStock: 20,
      supplier: 'Medical Supplies Inc',
      unitPrice: 0.25,
      lastUpdate: '2024-01-12',
    },
  ]);

  const categories = ['Medicamentos', 'Materiales', 'Insumos', 'Equipos'];

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.stock <= item.minStock);

  const handleAddItem = () => {
    const item: InventoryItem = {
      id: Date.now(),
      ...newItem,
      lastUpdate: new Date().toISOString().split('T')[0],
    };
    setInventory([...inventory, item]);
    setNewItem({
      name: '',
      category: '',
      stock: 0,
      minStock: 0,
      supplier: '',
      unitPrice: 0,
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-sakura-gray-medium">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-sakura-red">Gestión de Inventario</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sakura-red hover:bg-sakura-red-dark">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Nuevo Producto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">Stock Actual</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStock">Stock Mínimo</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Input
                    id="supplier"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Precio Unitario (S/)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleAddItem} className="w-full bg-sakura-red hover:bg-sakura-red-dark">
                  Agregar Producto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sakura-gray" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos, categorías o proveedores..."
            className="pl-10 h-12 border-sakura-gray-medium focus:border-sakura-red rounded-xl"
          />
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertas de Stock Bajo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="destructive">
                      Stock: {item.stock} (Mín: {item.minStock})
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventario ({filteredInventory.length} productos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Actualizado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{item.stock}</span>
                          {item.stock <= item.minStock && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>S/ {item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="max-w-32 truncate">{item.supplier}</TableCell>
                      <TableCell>{item.lastUpdate}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryManagement;
