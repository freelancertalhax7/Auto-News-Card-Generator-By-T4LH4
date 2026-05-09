import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "node-html-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for news metadata extraction
  app.get("/api/news-meta", async (req, res) => {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      const html = await response.text();
      const root = parse(html);

      const getMeta = (name: string) => {
        return (
          root.querySelector(`meta[property="${name}"]`)?.getAttribute("content") ||
          root.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ||
          ""
        );
      };

      const title = getMeta("og:title") || root.querySelector("title")?.text || "";
      const description = getMeta("og:description") || getMeta("description") || "";
      const image = getMeta("og:image") || "";
      const siteName = getMeta("og:site_name") || new URL(url).hostname;

      res.json({
        title,
        description,
        image,
        siteName,
        url,
      });
    } catch (error) {
      console.error("Extraction error:", error);
      res.status(500).json({ error: "Failed to extract metadata" });
    }
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
