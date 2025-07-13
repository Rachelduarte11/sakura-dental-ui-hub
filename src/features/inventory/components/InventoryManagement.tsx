
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Plus, Edit, AlertTriangle, Loader2 } from 'lucide-react';
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
import { useInventoryStore, type InventoryItem } from '@/shared/stores';
import { toast } from 'sonner';

const InventoryManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: '',
    stock_quantity: 0,
    min_stock: 0,
    unit_price: 0,
    supplier: '',
    status: true,
  });

  const { 
    items, 
    categories,
    isLoading, 
    error, 
    fetchInventoryItems, 
    fetchCategories,
    createInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem,
    checkLowStock,
    clearError 
  } = useInventoryStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchInventoryItems();
    fetchCategories();
  }, [fetchInventoryItems, fetchCategories]);

  // Manejar errores
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const filteredInventory = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = checkLowStock();

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    try {
      await createInventoryItem(newItem);
      toast.success('Producto agregado exitosamente');
      setNewItem({
        name: '',
        description: '',
        category: '',
        stock_quantity: 0,
        min_stock: 0,
        unit_price: 0,
        supplier: '',
        status: true,
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error('Error al agregar producto');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando inventario...</span>
        </div>
      </div>
    );
  }

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
                    placeholder="Ingrese el nombre del producto"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="mt-1"
                    placeholder="Descripción opcional"
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
                        <SelectItem key={category.category_id} value={category.name}>
                          {category.name}
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
                      value={newItem.stock_quantity}
                      onChange={(e) => setNewItem({ ...newItem, stock_quantity: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minStock">Stock Mínimo</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={newItem.min_stock}
                      onChange={(e) => setNewItem({ ...newItem, min_stock: parseInt(e.target.value) || 0 })}
                      className="mt-1"
                      min="0"
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
                    placeholder="Nombre del proveedor"
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Precio Unitario (S/)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={newItem.unit_price}
                    onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                    min="0"
                    placeholder="0.00"
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-sakura-red">{items.length}</div>
              <p className="text-sm text-gray-600">Total Productos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {items.filter(item => item.status).length}
              </div>
              <p className="text-sm text-gray-600">Productos Activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">
                {lowStockItems.length}
              </div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">
                S/ {items.reduce((sum, item) => sum + (item.stock_quantity * item.unit_price), 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Valor Total</p>
            </CardContent>
          </Card>
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
                  <div key={item.item_id} className="flex justify-between items-center">
                    <span className="font-medium">{item.name}</span>
                    <Badge variant="destructive">
                      Stock: {item.stock_quantity} (Mín: {item.min_stock})
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
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.item_id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500">{item.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{item.stock_quantity}</span>
                          {item.stock_quantity <= item.min_stock && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>S/ {item.unit_price.toFixed(2)}</TableCell>
                      <TableCell className="max-w-32 truncate">{item.supplier || 'Sin proveedor'}</TableCell>
                      <TableCell>
                        <Badge variant={item.status ? 'default' : 'secondary'}>
                          {item.status ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
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

        {filteredInventory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
