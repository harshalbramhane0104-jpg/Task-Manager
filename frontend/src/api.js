// Change this via a .env file (VITE_API_URL=http://your-backend-ip:5000)
// or it defaults to localhost for local development.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getBooks() {
  const res = await fetch(`${API_BASE_URL}/books`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function addBook(title, author) {
  const res = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author }),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
}

export async function toggleBook(id) {
  const res = await fetch(`${API_BASE_URL}/books/${id}/toggle`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to toggle book");
  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete book");
  return res.json();
}
