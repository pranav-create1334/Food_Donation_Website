import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for demonstrations
  let donations = [
    {
      id: "d1",
      foodName: "Fresh Bakery Surplus",
      description: "Assorted croissants, baguettes, and muffins from today's closing. All high quality.",
      quantity: "2 Big Crates",
      location: { address: "123 Baker St, Brooklyn, NY", lat: 40.6782, lng: -73.9442 },
      expiryTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      donorId: "donor_1",
      donorName: "Rise & Shine Bakery",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
      status: "POSTED",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: "d2",
      foodName: "Cooked Meals (Vegetarian)",
      description: "Portioned rice and lentil curries. Stored in microwave-safe containers.",
      quantity: "15 Servings",
      location: { address: "456 Main St, Queens, NY", lat: 40.7282, lng: -73.7949 },
      expiryTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      donorId: "donor_2",
      donorName: "Green Kitchen",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
      status: "ACCEPTED",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: "d3",
      foodName: "Organic Fruit Box",
      description: "Apples, bananas and some slightly bruised peaches. Perfect for immediate consumption.",
      quantity: "5kg",
      location: { address: "789 Market Ave, Manhattan, NY", lat: 40.7128, lng: -74.0060 },
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      donorId: "donor_3",
      donorName: "Central Market",
      imageUrl: "https://images.unsplash.com/photo-1610832958506-aa5633842699?auto=format&fit=crop&q=80&w=800",
      status: "POSTED",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    }
  ];

  // API Routes
  app.get("/api/donations", (req, res) => {
    res.json(donations);
  });

  app.post("/api/donations", (req, res) => {
    const newDonation = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: "Posted"
    };
    donations.unshift(newDonation);
    res.status(201).json(newDonation);
  });

  app.patch("/api/donations/:id", (req, res) => {
    const { id } = req.params;
    donations = donations.map(d => d.id === id ? { ...d, ...req.body } : d);
    res.json(donations.find(d => d.id === id));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
