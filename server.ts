import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  orderType: 'dine-in' | 'pickup' | 'delivery';
  tableNumber?: string;
  carPlateNumber?: string;
  deliveryAddress?: string;
  paymentMethod: string;
  notes?: string;
  items: any[];
  grandTotal: number;
  createdAt: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory order database
let orders: Order[] = [];

// POST /api/orders
app.post("/api/orders", (req, res) => {
  try {
    const {
      customerName,
      phone,
      orderType,
      tableNumber,
      carPlateNumber,
      deliveryAddress,
      paymentMethod,
      notes,
      items,
      grandTotal,
    } = req.body;

    if (!customerName || !phone || !orderType || !items || !items.length) {
      return res.status(400).json({ error: "Missing required order coordinates." });
    }

    const newOrder: Order = {
      id: `VIEW-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      phone,
      orderType,
      tableNumber,
      carPlateNumber,
      deliveryAddress,
      paymentMethod,
      notes,
      items,
      grandTotal,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    orders.unshift(newOrder); // Add to the beginning so it shows first
    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Server failed to process order." });
  }
});

// GET /api/orders
app.get("/api/orders", (req, res) => {
  return res.json(orders);
});

// PUT /api/orders/:id
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  const orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found." });
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    status
  };

  return res.json(orders[orderIndex]);
});

// DELETE /api/orders/:id
app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  orders = orders.filter(o => o.id !== id);
  return res.json({ success: true, message: "Order removed/archived." });
});

// POST /api/orders/reset
app.post("/api/orders/reset", (req, res) => {
  orders = [];
  return res.json({ success: true, message: "All orders cleared." });
});

// Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
