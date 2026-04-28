'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import type { Product } from '@/lib/mock-data';

const categories = ['Electronics', 'Furniture', 'Supplies', 'Other'];
const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C'];

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    price: 0,
    stock: 0,
    minStock: 10,
    warehouse: 'Warehouse A',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: 'Electronics',
      price: 0,
      stock: 0,
      minStock: 10,
      warehouse: 'Warehouse A',
    });
  };

  const getStockStatus = (stock: number, minStock: number): Product['status'] => {
    if (stock === 0) return 'out_of_stock';
    if (stock < minStock) return 'low_stock';
    return 'in_stock';
  };

  const handleAdd = () => {
    const status = getStockStatus(formData.stock, formData.minStock);
    addProduct({
      ...formData,
      status,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedProduct) {
      const status = getStockStatus(formData.stock, formData.minStock);
      updateProduct(selectedProduct.id, {
        ...formData,
        status,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      warehouse: product.warehouse,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const filteredProducts =
    filterCategory === 'all'
      ? products
      : products.filter((p) => p.category === filterCategory);

  const lowStockProducts = products.filter((p) => p.status === 'low_stock');
  const outOfStockProducts = products.filter((p) => p.status === 'out_of_stock');

  const columns = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      cell: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10 text-chart-3">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      cell: (product: Product) => (
        <Badge variant="secondary" className="font-normal">
          {product.category}
        </Badge>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      cell: (product: Product) => (
        <span className="font-medium">${product.price.toFixed(2)}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      cell: (product: Product) => (
        <div className="flex items-center gap-2">
          <span
            className={
              product.status === 'out_of_stock'
                ? 'text-destructive font-medium'
                : product.status === 'low_stock'
                ? 'text-warning font-medium'
                : 'text-foreground'
            }
          >
            {product.stock}
          </span>
          {product.status === 'low_stock' && (
            <AlertTriangle className="h-4 w-4 text-warning" />
          )}
        </div>
      ),
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (product: Product) => {
        const statusConfig = {
          in_stock: { label: 'In Stock', className: 'bg-success/10 text-success' },
          low_stock: { label: 'Low Stock', className: 'bg-warning/10 text-warning' },
          out_of_stock: { label: 'Out of Stock', className: 'bg-destructive/10 text-destructive' },
        };
        const config = statusConfig[product.status];
        return (
          <Badge variant="secondary" className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (product: Product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(product)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDeleteDialog(product)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppLayout title="Inventory" subtitle="Manage your products and stock levels">
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All Products ({products.length})</TabsTrigger>
            <TabsTrigger value="low" className="text-warning">
              Low Stock ({lowStockProducts.length})
            </TabsTrigger>
            <TabsTrigger value="out" className="text-destructive">
              Out of Stock ({outOfStockProducts.length})
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <DataTable
            data={filteredProducts}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search products..."
          />
        </TabsContent>

        <TabsContent value="low">
          <DataTable
            data={lowStockProducts}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search low stock products..."
            emptyMessage="No low stock items"
          />
        </TabsContent>

        <TabsContent value="out">
          <DataTable
            data={outOfStockProducts}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search out of stock products..."
            emptyMessage="No out of stock items"
          />
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Add a new product to your inventory.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g., ELC-001"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select
                  value={formData.warehouse}
                  onValueChange={(value) => setFormData({ ...formData, warehouse: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh} value={wh}>
                        {wh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Min Stock</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!formData.name || !formData.sku}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-warehouse">Warehouse</Label>
                <Select
                  value={formData.warehouse}
                  onValueChange={(value) => setFormData({ ...formData, warehouse: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh} value={wh}>
                        {wh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-minStock">Min Stock</Label>
                <Input
                  id="edit-minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedProduct?.name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
