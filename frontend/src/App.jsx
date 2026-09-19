import React, { useEffect, useState } from "react";
import { getBooks, addBook, toggleBook, deleteBook } from "./api";

export default function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");

  async function loadBooks() {
    try {
      const data = await getBooks();
      setBooks(data);
      setError("");
    } catch (err) {
      setError("Could not reach the backend API. Is it running?");
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    await addBook(title.trim(), author.trim());
    setTitle("");
    setAuthor("");
    loadBooks();
  }

  async function handleToggle(id) {
    await toggleBook(id);
    loadBooks();
  }

  async function handleDelete(id) {
    await deleteBook(id);
    loadBooks();
  }

  return (
    <div className="container">
      <h1>📚 Book Library</h1>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button type="submit">Add Book</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className={book.read_status ? "read" : ""}>
            <div>
              <strong>{book.title}</strong>
              <span className="author"> by {book.author}</span>
            </div>
            <div className="actions">
              <button onClick={() => handleToggle(book.id)}>
                {book.read_status ? "Mark Unread" : "Mark Read"}
              </button>
              <button className="delete" onClick={() => handleDelete(book.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
