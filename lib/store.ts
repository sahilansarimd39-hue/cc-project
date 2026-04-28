import { create } from 'zustand';
import type { Counter, Staff, Product, Order, Shipment, Notification, Customer, Supplier, PurchaseOrder, AuditLog, Return } from './mock-data';
import { counters as mockCounters, staff as mockStaff, products as mockProducts, orders as mockOrders, shipments as mockShipments, notifications as mockNotifications, customers as mockCustomers, suppliers as mockSuppliers, purchaseOrders as mockPurchaseOrders, auditLogs as mockAuditLogs, returns as mockReturns } from './mock-data';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'counter_staff' | 'driver';
  avatar: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Counters
  counters: Counter[];
  addCounter: (counter: Omit<Counter, 'id'>) => void;
  updateCounter: (id: string, data: Partial<Counter>) => void;
  deleteCounter: (id: string) => void;

  // Staff
  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, data: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  // Shipments
  shipments: Shipment[];
  addShipment: (shipment: Omit<Shipment, 'id'>) => void;
  updateShipment: (id: string, data: Partial<Shipment>) => void;
  updateShipmentStatus: (id: string, status: Shipment['status']) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Purchase Orders
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  updatePurchaseOrder: (id: string, data: Partial<PurchaseOrder>) => void;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status']) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;

  // Returns
  returns: Return[];
  addReturn: (returnItem: Omit<Return, 'id'>) => void;
  updateReturn: (id: string, data: Partial<Return>) => void;
  updateReturnStatus: (id: string, status: Return['status']) => void;

  // Quick Actions
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: (email: string, password: string) => {
    // Demo login - accept any email/password combo
    const staffMember = mockStaff.find(s => s.email === email) || mockStaff[0];
    set({
      user: {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
        avatar: staffMember.avatar,
      },
      isAuthenticated: true,
    });
    return true;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  // UI
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  darkMode: false,
  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    set({ darkMode: newDarkMode });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newDarkMode);
    }
  },

  // Counters
  counters: mockCounters,
  addCounter: (counter) => {
    const newCounter: Counter = {
      ...counter,
      id: `cnt-${Date.now()}`,
    };
    set((state) => ({ counters: [...state.counters, newCounter] }));
  },
  updateCounter: (id, data) => {
    set((state) => ({
      counters: state.counters.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  },
  deleteCounter: (id) => {
    set((state) => ({ counters: state.counters.filter((c) => c.id !== id) }));
  },

  // Staff
  staff: mockStaff,
  addStaff: (staffMember) => {
    const newStaff: Staff = {
      ...staffMember,
      id: `stf-${Date.now()}`,
    };
    set((state) => ({ staff: [...state.staff, newStaff] }));
  },
  updateStaff: (id, data) => {
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
  },
  deleteStaff: (id) => {
    set((state) => ({ staff: state.staff.filter((s) => s.id !== id) }));
  },

  // Products
  products: mockProducts,
  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id: `prd-${Date.now()}`,
    };
    set((state) => ({ products: [...state.products, newProduct] }));
  },
  updateProduct: (id, data) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  },
  deleteProduct: (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },

  // Orders
  orders: mockOrders,
  addOrder: (order) => {
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
    };
    set((state) => ({ orders: [...state.orders, newOrder] }));
  },
  updateOrder: (id, data) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...data } : o)),
    }));
  },
  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString().split('T')[0] } : o
      ),
    }));
  },

  // Shipments
  shipments: mockShipments,
  addShipment: (shipment) => {
    const newShipment: Shipment = {
      ...shipment,
      id: `shp-${Date.now()}`,
    };
    set((state) => ({ shipments: [...state.shipments, newShipment] }));
  },
  updateShipment: (id, data) => {
    set((state) => ({
      shipments: state.shipments.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
  },
  updateShipmentStatus: (id, status) => {
    set((state) => ({
      shipments: state.shipments.map((s) =>
        s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s
      ),
    }));
  },

  // Notifications
  notifications: mockNotifications,
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `ntf-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ notifications: [newNotification, ...state.notifications] }));
  },

  // Customers
  customers: mockCustomers,
  addCustomer: (customer) => {
    const newCustomer: Customer = { ...customer, id: `cust-${Date.now()}` };
    set((state) => ({ customers: [...state.customers, newCustomer] }));
  },
  updateCustomer: (id, data) => {
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  },
  deleteCustomer: (id) => {
    set((state) => ({ customers: state.customers.filter((c) => c.id !== id) }));
  },

  // Suppliers
  suppliers: mockSuppliers,
  addSupplier: (supplier) => {
    const newSupplier: Supplier = { ...supplier, id: `sup-${Date.now()}` };
    set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
  },
  updateSupplier: (id, data) => {
    set((state) => ({
      suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }));
  },
  deleteSupplier: (id) => {
    set((state) => ({ suppliers: state.suppliers.filter((s) => s.id !== id) }));
  },

  // Purchase Orders
  purchaseOrders: mockPurchaseOrders,
  addPurchaseOrder: (po) => {
    const newPO: PurchaseOrder = { ...po, id: `po-${Date.now()}` };
    set((state) => ({ purchaseOrders: [...state.purchaseOrders, newPO] }));
  },
  updatePurchaseOrder: (id, data) => {
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  },
  updatePurchaseOrderStatus: (id, status) => {
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((p) =>
        p.id === id ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p
      ),
    }));
  },

  // Audit Logs
  auditLogs: mockAuditLogs,
  addAuditLog: (log) => {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
  },

  // Returns
  returns: mockReturns,
  addReturn: (returnItem) => {
    const newReturn: Return = { ...returnItem, id: `ret-${Date.now()}` };
    set((state) => ({ returns: [...state.returns, newReturn] }));
  },
  updateReturn: (id, data) => {
    set((state) => ({
      returns: state.returns.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }));
  },
  updateReturnStatus: (id, status) => {
    set((state) => ({
      returns: state.returns.map((r) =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString().split('T')[0] } : r
      ),
    }));
  },

  // Quick Actions
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
