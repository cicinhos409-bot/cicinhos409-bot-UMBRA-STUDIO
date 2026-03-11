import express from "express";
import { createServer as createViteServer } from "vite";
import { Pool } from "pg";
import path from "path";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/umbra_studio",
});

// Initialize DB
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT,
        script TEXT,
        aspect_ratio TEXT,
        style TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS scenes (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        content TEXT,
        image_url TEXT,
        video_url TEXT,
        audio_url TEXT,
        order_index INTEGER,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS characters (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        name TEXT,
        description TEXT,
        image_url TEXT,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS environments (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        name TEXT,
        description TEXT,
        FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
}

async function startServer() {
  await initDB();
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM projects ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const { id, name, script, aspect_ratio, style } = req.body;
      await pool.query(
        "INSERT INTO projects (id, name, script, aspect_ratio, style) VALUES ($1, $2, $3, $4, $5)",
        [id, name, script, aspect_ratio, style]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
      const scenes = await pool.query("SELECT * FROM scenes WHERE project_id = $1 ORDER BY order_index ASC", [req.params.id]);
      const characters = await pool.query("SELECT * FROM characters WHERE project_id = $1", [req.params.id]);
      const environments = await pool.query("SELECT * FROM environments WHERE project_id = $1", [req.params.id]);
      
      if (project.rows.length === 0) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      
      res.json({
        ...project.rows[0],
        scenes: scenes.rows,
        characters: characters.rows,
        environments: environments.rows,
      });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  app.post("/api/scenes", async (req, res) => {
    try {
      const { id, project_id, content, order_index } = req.body;
      await pool.query(
        "INSERT INTO scenes (id, project_id, content, order_index) VALUES ($1, $2, $3, $4)",
        [id, project_id, content, order_index]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  app.put("/api/scenes/:id", async (req, res) => {
    try {
      const { content, image_url, video_url, audio_url } = req.body;
      await pool.query(
        "UPDATE scenes SET content = $1, image_url = $2, video_url = $3, audio_url = $4 WHERE id = $5",
        [content, image_url, video_url, audio_url, req.params.id]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  // AI API Routes
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, provider, apiKey, model } = req.body;
      
      // Importa dinamicamente o serviço de IA
      const { default: AIService } = await import("./src/lib/ai/index.js");
      
      const aiService = new AIService({
        provider,
        apiKey: apiKey || process.env[`${provider.toUpperCase()}_API_KEY`],
        model,
      });

      const result = await aiService.generateText(prompt);
      res.json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  app.post("/api/ai/image", async (req, res) => {
    try {
      const { prompt } = req.body;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
      res.json({ success: true, imageUrl });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => res.sendFile(path.resolve("dist/index.html")));
  }

  const PORT = parseInt(process.env.PORT || "3000");
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Umbra Studio running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
