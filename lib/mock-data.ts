// Mock data for the logistics management system

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  createdAt: string;
  lastOrderAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  categories: string[];
  rating: number;
  totalPurchases: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
  total: number;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  expectedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: 'orders' | 'inventory' | 'shipments' | 'counters' | 'users' | 'settings' | 'customers' | 'suppliers';
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  ipAddress: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface Return {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: { productId: string; productName: string; quantity: number; reason: string }[];
  status: 'requested' | 'approved' | 'received' | 'refunded' | 'rejected';
  totalRefund: number;
  createdAt: string;
  updatedAt: string;
}

export interface Counter {
  id: string;
  name: string;
  location: string;
  address: string;
  staff: Staff[];
  status: 'active' | 'inactive';
  dailyTransactions: number;
  monthlyRevenue: number;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'counter_staff' | 'driver';
  avatar: string;
  counterId?: string;
  status: 'active' | 'offline';
  phone: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  warehouse: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  counterId: string;
  counterName: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  orderNumber: string;
  origin: string;
  destination: string;
  status: 'preparing' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned';
  driverId: string;
  driverName: string;
  vehicleNumber: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  currentLocation: { lat: number; lng: number; address: string };
  route: { lat: number; lng: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'order' | 'shipment' | 'inventory' | 'counter' | 'user';
  action: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
}

// Generate mock data
export const counters: Counter[] = [
  {
    id: 'cnt-001',
    name: 'Main Hub',
    location: 'New York',
    address: '123 Business Ave, New York, NY 10001',
    staff: [],
    status: 'active',
    dailyTransactions: 145,
    monthlyRevenue: 125000,
    createdAt: '2024-01-15',
  },
  {
    id: 'cnt-002',
    name: 'Downtown Branch',
    location: 'Los Angeles',
    address: '456 Commerce St, Los Angeles, CA 90012',
    staff: [],
    status: 'active',
    dailyTransactions: 98,
    monthlyRevenue: 89000,
    createdAt: '2024-02-20',
  },
  {
    id: 'cnt-003',
    name: 'Airport Hub',
    location: 'Chicago',
    address: '789 Logistics Blvd, Chicago, IL 60601',
    staff: [],
    status: 'active',
    dailyTransactions: 210,
    monthlyRevenue: 178000,
    createdAt: '2024-03-10',
  },
  {
    id: 'cnt-004',
    name: 'Port Terminal',
    location: 'Miami',
    address: '321 Harbor Way, Miami, FL 33101',
    staff: [],
    status: 'active',
    dailyTransactions: 175,
    monthlyRevenue: 156000,
    createdAt: '2024-04-05',
  },
  {
    id: 'cnt-005',
    name: 'Tech District',
    location: 'San Francisco',
    address: '555 Innovation Dr, San Francisco, CA 94102',
    staff: [],
    status: 'inactive',
    dailyTransactions: 0,
    monthlyRevenue: 0,
    createdAt: '2024-05-12',
  },
];

export const staff: Staff[] = [
  { id: 'stf-001', name: 'John Smith', email: 'john.smith@cvg.com', role: 'admin', avatar: 'JS', counterId: 'cnt-001', status: 'active', phone: '+1 555-0101' },
  { id: 'stf-002', name: 'Sarah Johnson', email: 'sarah.j@cvg.com', role: 'manager', avatar: 'SJ', counterId: 'cnt-001', status: 'active', phone: '+1 555-0102' },
  { id: 'stf-003', name: 'Mike Williams', email: 'mike.w@cvg.com', role: 'counter_staff', avatar: 'MW', counterId: 'cnt-001', status: 'active', phone: '+1 555-0103' },
  { id: 'stf-004', name: 'Emily Brown', email: 'emily.b@cvg.com', role: 'counter_staff', avatar: 'EB', counterId: 'cnt-002', status: 'active', phone: '+1 555-0104' },
  { id: 'stf-005', name: 'David Lee', email: 'david.l@cvg.com', role: 'driver', avatar: 'DL', counterId: 'cnt-002', status: 'active', phone: '+1 555-0105' },
  { id: 'stf-006', name: 'Anna Martinez', email: 'anna.m@cvg.com', role: 'manager', avatar: 'AM', counterId: 'cnt-003', status: 'active', phone: '+1 555-0106' },
  { id: 'stf-007', name: 'James Wilson', email: 'james.w@cvg.com', role: 'driver', avatar: 'JW', counterId: 'cnt-003', status: 'offline', phone: '+1 555-0107' },
  { id: 'stf-008', name: 'Lisa Chen', email: 'lisa.c@cvg.com', role: 'counter_staff', avatar: 'LC', counterId: 'cnt-004', status: 'active', phone: '+1 555-0108' },
  { id: 'stf-009', name: 'Robert Taylor', email: 'robert.t@cvg.com', role: 'driver', avatar: 'RT', counterId: 'cnt-004', status: 'active', phone: '+1 555-0109' },
  { id: 'stf-010', name: 'Jennifer Garcia', email: 'jennifer.g@cvg.com', role: 'manager', avatar: 'JG', counterId: 'cnt-005', status: 'offline', phone: '+1 555-0110' },
];

export const products: Product[] = [
  { id: 'prd-001', name: 'Premium Office Chair', sku: 'FRN-001', category: 'Furniture', price: 299.99, stock: 45, minStock: 10, warehouse: 'Warehouse A', status: 'in_stock', lastUpdated: '2024-06-15' },
  { id: 'prd-002', name: 'Ergonomic Keyboard', sku: 'ELC-001', category: 'Electronics', price: 89.99, stock: 120, minStock: 25, warehouse: 'Warehouse B', status: 'in_stock', lastUpdated: '2024-06-14' },
  { id: 'prd-003', name: 'LED Monitor 27"', sku: 'ELC-002', category: 'Electronics', price: 349.99, stock: 8, minStock: 15, warehouse: 'Warehouse A', status: 'low_stock', lastUpdated: '2024-06-15' },
  { id: 'prd-004', name: 'Standing Desk', sku: 'FRN-002', category: 'Furniture', price: 549.99, stock: 22, minStock: 5, warehouse: 'Warehouse C', status: 'in_stock', lastUpdated: '2024-06-13' },
  { id: 'prd-005', name: 'Wireless Mouse', sku: 'ELC-003', category: 'Electronics', price: 49.99, stock: 0, minStock: 30, warehouse: 'Warehouse B', status: 'out_of_stock', lastUpdated: '2024-06-15' },
  { id: 'prd-006', name: 'Filing Cabinet', sku: 'FRN-003', category: 'Furniture', price: 179.99, stock: 35, minStock: 8, warehouse: 'Warehouse A', status: 'in_stock', lastUpdated: '2024-06-12' },
  { id: 'prd-007', name: 'USB-C Hub', sku: 'ELC-004', category: 'Electronics', price: 69.99, stock: 5, minStock: 20, warehouse: 'Warehouse B', status: 'low_stock', lastUpdated: '2024-06-14' },
  { id: 'prd-008', name: 'Desk Lamp', sku: 'FRN-004', category: 'Furniture', price: 59.99, stock: 78, minStock: 15, warehouse: 'Warehouse C', status: 'in_stock', lastUpdated: '2024-06-11' },
  { id: 'prd-009', name: 'Webcam HD', sku: 'ELC-005', category: 'Electronics', price: 129.99, stock: 42, minStock: 10, warehouse: 'Warehouse A', status: 'in_stock', lastUpdated: '2024-06-15' },
  { id: 'prd-010', name: 'Bookshelf', sku: 'FRN-005', category: 'Furniture', price: 199.99, stock: 18, minStock: 5, warehouse: 'Warehouse C', status: 'in_stock', lastUpdated: '2024-06-10' },
  { id: 'prd-011', name: 'Printer Ink Set', sku: 'SUP-001', category: 'Supplies', price: 45.99, stock: 3, minStock: 25, warehouse: 'Warehouse B', status: 'low_stock', lastUpdated: '2024-06-15' },
  { id: 'prd-012', name: 'Paper Ream (500)', sku: 'SUP-002', category: 'Supplies', price: 12.99, stock: 200, minStock: 50, warehouse: 'Warehouse A', status: 'in_stock', lastUpdated: '2024-06-14' },
];

export const orders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2024-001',
    customerId: 'cust-001',
    customerName: 'Acme Corporation',
    customerEmail: 'orders@acme.com',
    customerPhone: '+1 555-1001',
    items: [
      { productId: 'prd-001', productName: 'Premium Office Chair', quantity: 10, price: 299.99 },
      { productId: 'prd-002', productName: 'Ergonomic Keyboard', quantity: 10, price: 89.99 },
    ],
    total: 3899.80,
    status: 'delivered',
    counterId: 'cnt-001',
    counterName: 'Main Hub',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-05',
    shippingAddress: '100 Tech Park, Suite 200, Boston, MA 02101',
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2024-002',
    customerId: 'cust-002',
    customerName: 'TechStart Inc',
    customerEmail: 'purchasing@techstart.io',
    customerPhone: '+1 555-1002',
    items: [
      { productId: 'prd-003', productName: 'LED Monitor 27"', quantity: 5, price: 349.99 },
      { productId: 'prd-004', productName: 'Standing Desk', quantity: 5, price: 549.99 },
    ],
    total: 4499.90,
    status: 'shipped',
    counterId: 'cnt-002',
    counterName: 'Downtown Branch',
    createdAt: '2024-06-10',
    updatedAt: '2024-06-12',
    shippingAddress: '250 Innovation Way, Austin, TX 78701',
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2024-003',
    customerId: 'cust-003',
    customerName: 'Global Retail Co',
    customerEmail: 'supply@globalretail.com',
    customerPhone: '+1 555-1003',
    items: [
      { productId: 'prd-006', productName: 'Filing Cabinet', quantity: 20, price: 179.99 },
    ],
    total: 3599.80,
    status: 'packed',
    counterId: 'cnt-003',
    counterName: 'Airport Hub',
    createdAt: '2024-06-14',
    updatedAt: '2024-06-14',
    shippingAddress: '500 Commerce Blvd, Seattle, WA 98101',
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-2024-004',
    customerId: 'cust-004',
    customerName: 'StartUp Labs',
    customerEmail: 'admin@startuplabs.co',
    customerPhone: '+1 555-1004',
    items: [
      { productId: 'prd-008', productName: 'Desk Lamp', quantity: 15, price: 59.99 },
      { productId: 'prd-009', productName: 'Webcam HD', quantity: 15, price: 129.99 },
    ],
    total: 2849.70,
    status: 'pending',
    counterId: 'cnt-001',
    counterName: 'Main Hub',
    createdAt: '2024-06-15',
    updatedAt: '2024-06-15',
    shippingAddress: '75 Startup Ave, Denver, CO 80201',
  },
  {
    id: 'ord-005',
    orderNumber: 'ORD-2024-005',
    customerId: 'cust-005',
    customerName: 'City Hospital',
    customerEmail: 'procurement@cityhospital.org',
    customerPhone: '+1 555-1005',
    items: [
      { productId: 'prd-001', productName: 'Premium Office Chair', quantity: 50, price: 299.99 },
      { productId: 'prd-004', productName: 'Standing Desk', quantity: 25, price: 549.99 },
    ],
    total: 28749.25,
    status: 'shipped',
    counterId: 'cnt-004',
    counterName: 'Port Terminal',
    createdAt: '2024-06-08',
    updatedAt: '2024-06-11',
    shippingAddress: '800 Medical Center Dr, Phoenix, AZ 85001',
  },
];

export const shipments: Shipment[] = [
  {
    id: 'shp-001',
    trackingNumber: 'CVG-TRK-001',
    orderId: 'ord-001',
    orderNumber: 'ORD-2024-001',
    origin: 'Main Hub, New York',
    destination: '100 Tech Park, Boston, MA',
    status: 'delivered',
    driverId: 'stf-005',
    driverName: 'David Lee',
    vehicleNumber: 'CVG-V001',
    estimatedDelivery: '2024-06-05',
    actualDelivery: '2024-06-05',
    currentLocation: { lat: 42.3601, lng: -71.0589, address: 'Boston, MA' },
    route: [
      { lat: 40.7128, lng: -74.0060 },
      { lat: 41.3083, lng: -72.9279 },
      { lat: 42.3601, lng: -71.0589 },
    ],
    createdAt: '2024-06-02',
    updatedAt: '2024-06-05',
  },
  {
    id: 'shp-002',
    trackingNumber: 'CVG-TRK-002',
    orderId: 'ord-002',
    orderNumber: 'ORD-2024-002',
    origin: 'Downtown Branch, Los Angeles',
    destination: '250 Innovation Way, Austin, TX',
    status: 'in_transit',
    driverId: 'stf-007',
    driverName: 'James Wilson',
    vehicleNumber: 'CVG-V003',
    estimatedDelivery: '2024-06-16',
    currentLocation: { lat: 32.7767, lng: -96.7970, address: 'Dallas, TX' },
    route: [
      { lat: 34.0522, lng: -118.2437 },
      { lat: 33.4484, lng: -112.0740 },
      { lat: 32.7767, lng: -96.7970 },
      { lat: 30.2672, lng: -97.7431 },
    ],
    createdAt: '2024-06-12',
    updatedAt: '2024-06-15',
  },
  {
    id: 'shp-003',
    trackingNumber: 'CVG-TRK-003',
    orderId: 'ord-005',
    orderNumber: 'ORD-2024-005',
    origin: 'Port Terminal, Miami',
    destination: '800 Medical Center Dr, Phoenix, AZ',
    status: 'out_for_delivery',
    driverId: 'stf-009',
    driverName: 'Robert Taylor',
    vehicleNumber: 'CVG-V004',
    estimatedDelivery: '2024-06-15',
    currentLocation: { lat: 33.4484, lng: -112.0740, address: 'Phoenix, AZ' },
    route: [
      { lat: 25.7617, lng: -80.1918 },
      { lat: 29.7604, lng: -95.3698 },
      { lat: 32.7767, lng: -96.7970 },
      { lat: 33.4484, lng: -112.0740 },
    ],
    createdAt: '2024-06-11',
    updatedAt: '2024-06-15',
  },
  {
    id: 'shp-004',
    trackingNumber: 'CVG-TRK-004',
    orderId: 'ord-003',
    orderNumber: 'ORD-2024-003',
    origin: 'Airport Hub, Chicago',
    destination: '500 Commerce Blvd, Seattle, WA',
    status: 'preparing',
    driverId: 'stf-007',
    driverName: 'James Wilson',
    vehicleNumber: 'CVG-V003',
    estimatedDelivery: '2024-06-20',
    currentLocation: { lat: 41.8781, lng: -87.6298, address: 'Chicago, IL' },
    route: [],
    createdAt: '2024-06-14',
    updatedAt: '2024-06-14',
  },
];

export const notifications: Notification[] = [
  { id: 'ntf-001', title: 'Order Delivered', message: 'Order ORD-2024-001 has been successfully delivered', type: 'success', read: false, createdAt: '2024-06-15T10:30:00Z' },
  { id: 'ntf-002', title: 'Low Stock Alert', message: 'LED Monitor 27" stock is running low (8 units remaining)', type: 'warning', read: false, createdAt: '2024-06-15T09:15:00Z' },
  { id: 'ntf-003', title: 'New Order', message: 'New order ORD-2024-004 received from StartUp Labs', type: 'info', read: true, createdAt: '2024-06-15T08:00:00Z' },
  { id: 'ntf-004', title: 'Shipment Update', message: 'Shipment CVG-TRK-002 is now in transit', type: 'info', read: true, createdAt: '2024-06-14T16:45:00Z' },
  { id: 'ntf-005', title: 'Out of Stock', message: 'Wireless Mouse is now out of stock', type: 'error', read: false, createdAt: '2024-06-14T14:20:00Z' },
];

export const activities: Activity[] = [
  { id: 'act-001', type: 'order', action: 'created', description: 'New order ORD-2024-004 created', userId: 'stf-003', userName: 'Mike Williams', timestamp: '2024-06-15T14:30:00Z' },
  { id: 'act-002', type: 'shipment', action: 'updated', description: 'Shipment CVG-TRK-003 marked as out for delivery', userId: 'stf-009', userName: 'Robert Taylor', timestamp: '2024-06-15T12:15:00Z' },
  { id: 'act-003', type: 'inventory', action: 'updated', description: 'Stock updated for LED Monitor 27"', userId: 'stf-002', userName: 'Sarah Johnson', timestamp: '2024-06-15T11:00:00Z' },
  { id: 'act-004', type: 'order', action: 'status_change', description: 'Order ORD-2024-002 status changed to shipped', userId: 'stf-004', userName: 'Emily Brown', timestamp: '2024-06-15T09:45:00Z' },
  { id: 'act-005', type: 'counter', action: 'daily_report', description: 'Daily report generated for Main Hub', userId: 'stf-001', userName: 'John Smith', timestamp: '2024-06-15T08:00:00Z' },
  { id: 'act-006', type: 'user', action: 'login', description: 'User logged in', userId: 'stf-006', userName: 'Anna Martinez', timestamp: '2024-06-15T07:30:00Z' },
  { id: 'act-007', type: 'shipment', action: 'delivered', description: 'Shipment CVG-TRK-001 delivered successfully', userId: 'stf-005', userName: 'David Lee', timestamp: '2024-06-05T15:20:00Z' },
  { id: 'act-008', type: 'inventory', action: 'low_stock', description: 'Low stock alert for USB-C Hub', userId: 'system', userName: 'System', timestamp: '2024-06-14T18:00:00Z' },
];

// Chart data for dashboard
export const shipmentsChartData = [
  { name: 'Jan', shipments: 65, orders: 78 },
  { name: 'Feb', shipments: 72, orders: 85 },
  { name: 'Mar', shipments: 88, orders: 95 },
  { name: 'Apr', shipments: 95, orders: 110 },
  { name: 'May', shipments: 112, orders: 125 },
  { name: 'Jun', shipments: 125, orders: 142 },
];

export const revenueChartData = [
  { name: 'Jan', revenue: 125000 },
  { name: 'Feb', revenue: 142000 },
  { name: 'Mar', revenue: 168000 },
  { name: 'Apr', revenue: 195000 },
  { name: 'May', revenue: 215000 },
  { name: 'Jun', revenue: 248000 },
];

export const counterPerformanceData = [
  { name: 'Main Hub', transactions: 145, revenue: 125000 },
  { name: 'Downtown', transactions: 98, revenue: 89000 },
  { name: 'Airport Hub', transactions: 210, revenue: 178000 },
  { name: 'Port Terminal', transactions: 175, revenue: 156000 },
];

export const categoryDistribution = [
  { name: 'Electronics', value: 45 },
  { name: 'Furniture', value: 35 },
  { name: 'Supplies', value: 20 },
];

// Customers data
export const customers: Customer[] = [
  { id: 'cust-001', name: 'John Anderson', email: 'john@acme.com', phone: '+1 555-1001', company: 'Acme Corporation', address: '100 Tech Park, Suite 200, Boston, MA 02101', totalOrders: 24, totalSpent: 45890, status: 'active', createdAt: '2023-06-15', lastOrderAt: '2024-06-01' },
  { id: 'cust-002', name: 'Sarah Mitchell', email: 'sarah@techstart.io', phone: '+1 555-1002', company: 'TechStart Inc', address: '250 Innovation Way, Austin, TX 78701', totalOrders: 18, totalSpent: 32450, status: 'active', createdAt: '2023-08-20', lastOrderAt: '2024-06-10' },
  { id: 'cust-003', name: 'Michael Chen', email: 'michael@globalretail.com', phone: '+1 555-1003', company: 'Global Retail Co', address: '500 Commerce Blvd, Seattle, WA 98101', totalOrders: 45, totalSpent: 89200, status: 'active', createdAt: '2023-03-10', lastOrderAt: '2024-06-14' },
  { id: 'cust-004', name: 'Emily Rodriguez', email: 'emily@startuplabs.co', phone: '+1 555-1004', company: 'StartUp Labs', address: '75 Startup Ave, Denver, CO 80201', totalOrders: 12, totalSpent: 18900, status: 'active', createdAt: '2023-11-05', lastOrderAt: '2024-06-15' },
  { id: 'cust-005', name: 'Dr. James Wilson', email: 'james@cityhospital.org', phone: '+1 555-1005', company: 'City Hospital', address: '800 Medical Center Dr, Phoenix, AZ 85001', totalOrders: 8, totalSpent: 125000, status: 'active', createdAt: '2024-01-20', lastOrderAt: '2024-06-08' },
  { id: 'cust-006', name: 'Lisa Park', email: 'lisa@innovatetech.com', phone: '+1 555-1006', company: 'Innovate Tech', address: '300 Silicon Blvd, San Jose, CA 95101', totalOrders: 15, totalSpent: 28500, status: 'inactive', createdAt: '2023-04-12', lastOrderAt: '2024-02-15' },
  { id: 'cust-007', name: 'Robert Thompson', email: 'robert@megacorp.com', phone: '+1 555-1007', company: 'MegaCorp Industries', address: '1000 Corporate Way, Chicago, IL 60601', totalOrders: 67, totalSpent: 234500, status: 'active', createdAt: '2022-09-01', lastOrderAt: '2024-06-12' },
  { id: 'cust-008', name: 'Amanda Foster', email: 'amanda@greentech.io', phone: '+1 555-1008', company: 'GreenTech Solutions', address: '450 Eco Park, Portland, OR 97201', totalOrders: 22, totalSpent: 41200, status: 'active', createdAt: '2023-07-18', lastOrderAt: '2024-06-05' },
];

// Suppliers data
export const suppliers: Supplier[] = [
  { id: 'sup-001', name: 'Premium Furniture Co', email: 'orders@premiumfurniture.com', phone: '+1 555-2001', company: 'Premium Furniture Co', address: '100 Manufacturing Way, Detroit, MI 48201', categories: ['Furniture'], rating: 4.8, totalPurchases: 156000, status: 'active', createdAt: '2022-01-15' },
  { id: 'sup-002', name: 'TechSource Electronics', email: 'supply@techsource.com', phone: '+1 555-2002', company: 'TechSource Electronics', address: '200 Tech Industrial Park, San Jose, CA 95101', categories: ['Electronics'], rating: 4.5, totalPurchases: 289000, status: 'active', createdAt: '2022-03-20' },
  { id: 'sup-003', name: 'Office Essentials Ltd', email: 'bulk@officeessentials.com', phone: '+1 555-2003', company: 'Office Essentials Ltd', address: '300 Supply Chain Rd, Atlanta, GA 30301', categories: ['Supplies', 'Furniture'], rating: 4.2, totalPurchases: 78500, status: 'active', createdAt: '2022-06-10' },
  { id: 'sup-004', name: 'Global Components Inc', email: 'sales@globalcomponents.com', phone: '+1 555-2004', company: 'Global Components Inc', address: '400 Import Blvd, Los Angeles, CA 90001', categories: ['Electronics', 'Supplies'], rating: 4.6, totalPurchases: 345000, status: 'active', createdAt: '2021-11-05' },
  { id: 'sup-005', name: 'EcoOffice Supplies', email: 'orders@ecooffice.com', phone: '+1 555-2005', company: 'EcoOffice Supplies', address: '500 Green Way, Portland, OR 97201', categories: ['Supplies'], rating: 4.0, totalPurchases: 45000, status: 'pending', createdAt: '2024-03-15' },
];

// Purchase Orders data
export const purchaseOrders: PurchaseOrder[] = [
  { id: 'po-001', poNumber: 'PO-2024-001', supplierId: 'sup-001', supplierName: 'Premium Furniture Co', items: [{ productId: 'prd-001', productName: 'Premium Office Chair', quantity: 50, unitPrice: 180 }], total: 9000, status: 'received', expectedDelivery: '2024-06-10', createdAt: '2024-05-25', updatedAt: '2024-06-10' },
  { id: 'po-002', poNumber: 'PO-2024-002', supplierId: 'sup-002', supplierName: 'TechSource Electronics', items: [{ productId: 'prd-003', productName: 'LED Monitor 27"', quantity: 30, unitPrice: 220 }, { productId: 'prd-002', productName: 'Ergonomic Keyboard', quantity: 50, unitPrice: 55 }], total: 9350, status: 'approved', expectedDelivery: '2024-06-20', createdAt: '2024-06-12', updatedAt: '2024-06-13' },
  { id: 'po-003', poNumber: 'PO-2024-003', supplierId: 'sup-003', supplierName: 'Office Essentials Ltd', items: [{ productId: 'prd-012', productName: 'Paper Ream (500)', quantity: 500, unitPrice: 8 }], total: 4000, status: 'pending', expectedDelivery: '2024-06-25', createdAt: '2024-06-14', updatedAt: '2024-06-14' },
  { id: 'po-004', poNumber: 'PO-2024-004', supplierId: 'sup-002', supplierName: 'TechSource Electronics', items: [{ productId: 'prd-005', productName: 'Wireless Mouse', quantity: 100, unitPrice: 30 }], total: 3000, status: 'draft', expectedDelivery: '2024-07-01', createdAt: '2024-06-15', updatedAt: '2024-06-15' },
];

// Audit Logs data
export const auditLogs: AuditLog[] = [
  { id: 'log-001', action: 'CREATE', module: 'orders', description: 'Created new order ORD-2024-004', userId: 'stf-003', userName: 'Mike Williams', userRole: 'counter_staff', ipAddress: '192.168.1.100', timestamp: '2024-06-15T14:30:00Z', details: { orderNumber: 'ORD-2024-004', customer: 'StartUp Labs' } },
  { id: 'log-002', action: 'UPDATE', module: 'shipments', description: 'Updated shipment status to out_for_delivery', userId: 'stf-009', userName: 'Robert Taylor', userRole: 'driver', ipAddress: '192.168.1.105', timestamp: '2024-06-15T12:15:00Z', details: { trackingNumber: 'CVG-TRK-003', newStatus: 'out_for_delivery' } },
  { id: 'log-003', action: 'UPDATE', module: 'inventory', description: 'Stock level updated for LED Monitor 27"', userId: 'stf-002', userName: 'Sarah Johnson', userRole: 'manager', ipAddress: '192.168.1.101', timestamp: '2024-06-15T11:00:00Z', details: { product: 'LED Monitor 27"', oldStock: 15, newStock: 8 } },
  { id: 'log-004', action: 'UPDATE', module: 'orders', description: 'Order status changed to shipped', userId: 'stf-004', userName: 'Emily Brown', userRole: 'counter_staff', ipAddress: '192.168.1.102', timestamp: '2024-06-15T09:45:00Z', details: { orderNumber: 'ORD-2024-002', newStatus: 'shipped' } },
  { id: 'log-005', action: 'LOGIN', module: 'users', description: 'User logged in successfully', userId: 'stf-006', userName: 'Anna Martinez', userRole: 'manager', ipAddress: '192.168.1.103', timestamp: '2024-06-15T07:30:00Z' },
  { id: 'log-006', action: 'CREATE', module: 'customers', description: 'New customer added to the system', userId: 'stf-002', userName: 'Sarah Johnson', userRole: 'manager', ipAddress: '192.168.1.101', timestamp: '2024-06-14T16:20:00Z', details: { customerName: 'GreenTech Solutions' } },
  { id: 'log-007', action: 'DELETE', module: 'inventory', description: 'Product removed from inventory', userId: 'stf-001', userName: 'John Smith', userRole: 'admin', ipAddress: '192.168.1.100', timestamp: '2024-06-14T14:00:00Z', details: { product: 'Discontinued Item XYZ' } },
  { id: 'log-008', action: 'UPDATE', module: 'settings', description: 'System notification settings updated', userId: 'stf-001', userName: 'John Smith', userRole: 'admin', ipAddress: '192.168.1.100', timestamp: '2024-06-14T10:30:00Z' },
  { id: 'log-009', action: 'EXPORT', module: 'orders', description: 'Orders report exported to CSV', userId: 'stf-002', userName: 'Sarah Johnson', userRole: 'manager', ipAddress: '192.168.1.101', timestamp: '2024-06-13T15:45:00Z', details: { format: 'CSV', recordCount: 150 } },
  { id: 'log-010', action: 'CREATE', module: 'suppliers', description: 'New supplier added', userId: 'stf-001', userName: 'John Smith', userRole: 'admin', ipAddress: '192.168.1.100', timestamp: '2024-06-13T11:20:00Z', details: { supplierName: 'EcoOffice Supplies' } },
];

// Returns data
export const returns: Return[] = [
  { id: 'ret-001', returnNumber: 'RET-2024-001', orderId: 'ord-001', orderNumber: 'ORD-2024-001', customerId: 'cust-001', customerName: 'Acme Corporation', items: [{ productId: 'prd-001', productName: 'Premium Office Chair', quantity: 2, reason: 'Defective mechanism' }], status: 'refunded', totalRefund: 599.98, createdAt: '2024-06-06', updatedAt: '2024-06-10' },
  { id: 'ret-002', returnNumber: 'RET-2024-002', orderId: 'ord-002', orderNumber: 'ORD-2024-002', customerId: 'cust-002', customerName: 'TechStart Inc', items: [{ productId: 'prd-003', productName: 'LED Monitor 27"', quantity: 1, reason: 'Dead pixels on screen' }], status: 'approved', totalRefund: 349.99, createdAt: '2024-06-14', updatedAt: '2024-06-15' },
  { id: 'ret-003', returnNumber: 'RET-2024-003', orderId: 'ord-004', orderNumber: 'ORD-2024-004', customerId: 'cust-004', customerName: 'StartUp Labs', items: [{ productId: 'prd-008', productName: 'Desk Lamp', quantity: 3, reason: 'Wrong color received' }], status: 'requested', totalRefund: 179.97, createdAt: '2024-06-15', updatedAt: '2024-06-15' },
];

// Summary statistics
export const dashboardStats = {
  totalOrders: 1247,
  ordersChange: 12.5,
  shipmentsInTransit: 34,
  shipmentsChange: 8.2,
  delivered: 892,
  deliveredChange: 15.3,
  pending: 156,
  pendingChange: -5.4,
  totalRevenue: 1093000,
  revenueChange: 18.7,
  totalCounters: 5,
  activeCounters: 4,
  totalProducts: 156,
  lowStockProducts: 12,
};
