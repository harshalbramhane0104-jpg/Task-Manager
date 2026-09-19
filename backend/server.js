const express = require("express");
const cors = require("cors");
const { initDb, getPool } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/books", async (req, res) => {
  try {
    const [rows] = await getPool().query("SELECT * FROM books ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/books", async (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }
  try {
    const [result] = await getPool().query(
      "INSERT INTO books (title, author, read_status) VALUES (?, ?, FALSE)",
      [title, author]
    );
    res.json({ id: result.insertId, title, author, read_status: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/books/:id/toggle", async (req, res) => {
  const { id } = req.params;
  try {
    await getPool().query(
      "UPDATE books SET read_status = NOT read_status WHERE id = ?",
      [id]
    );
    const [rows] = await getPool().query("SELECT * FROM books WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Book not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await getPool().query("DELETE FROM books WHERE id = ?", [id]);
    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  await initDb();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
