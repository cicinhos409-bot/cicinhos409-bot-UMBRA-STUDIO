import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("umbra.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT,
    script TEXT,
    aspect_ratio TEXT,
    style TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS scenes (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    content TEXT,
    image_url TEXT,
    video_url TEXT,
    audio_url TEXT,
    order_index INTEGER,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  );
  CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    name TEXT,
    description TEXT,
    image_url TEXT,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  );
  CREATE TABLE IF NOT EXISTS environments (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    name TEXT,
    description TEXT,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const { id, name, script, aspect_ratio, style } = req.body;
    db.prepare("INSERT INTO projects (id, name, script, aspect_ratio, style) VALUES (?, ?, ?, ?, ?)")
      .run(id, name, script, aspect_ratio, style);
    res.json({ success: true });
  });

  app.get("/api/projects/:id", (req, res) => {
    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
    const scenes = db.prepare("SELECT * FROM scenes WHERE project_id = ? ORDER BY order_index ASC").all(req.params.id);
    const characters = db.prepare("SELECT * FROM characters WHERE project_id = ?").all(req.params.id);
    const environments = db.prepare("SELECT * FROM environments WHERE project_id = ?").all(req.params.id);
    res.json({ ...project, scenes, characters, environments });
  });

  app.post("/api/scenes", (req, res) => {
    const { id, project_id, content, order_index } = req.body;
    db.prepare("INSERT INTO scenes (id, project_id, content, order_index) VALUES (?, ?, ?, ?)")
      .run(id, project_id, content, order_index);
    res.json({ success: true });
  });

  app.put("/api/scenes/:id", (req, res) => {
    const { content, image_url, video_url, audio_url } = req.body;
    db.prepare("UPDATE scenes SET content = ?, image_url = ?, video_url = ?, audio_url = ? WHERE id = ?")
      .run(content, image_url, video_url, audio_url, req.params.id);
    res.json({ success: true });
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

  app.listen(3000, "0.0.0.0", () => {
    console.log("Umbra Studio running at http://localhost:3000");
  });
}

startServer();
