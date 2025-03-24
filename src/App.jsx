import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookManager.css';
import './App.css'

export default function BookManager() {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    image: null,
  });
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/books');
      setBooks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/books/${editingId}`, form);
        alert('Libro actualizado');
      } else {
        await axios.post('http://localhost:3000/api/books', formData);
        alert('Libro creado');
      }
      setForm({ title: '', author: '', genre: '', description: '', image: null });
      setEditingId(null);
      fetchBooks();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el libro');
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      image: null
    });
    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Gestión de Libros</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="title" value={form.title} placeholder="Título" onChange={handleChange} required />
        <input type="text" name="author" value={form.author} placeholder="Autor" onChange={handleChange} required />
        <input type="text" name="genre" value={form.genre} placeholder="Género" onChange={handleChange} required />
        <textarea name="description" value={form.description} placeholder="Descripción" onChange={handleChange} required></textarea>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <button type="submit" className="submit-btn">
          {editingId ? 'Actualizar Libro' : 'Subir Libro'}
        </button>
      </form>

      <div className="book-list">
        {books.map(book => (
          <div key={book._id} className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Autor:</strong> {book.author}</p>
            <p><strong>Género:</strong> {book.genre}</p>
            <p><strong>Descripción:</strong> {book.description}</p>
            {book.imageId && (
              <img
                src={`http://localhost:3000/api/books/image/${book.imageId}`}
                alt="Portada"
              />
            )}
            <div className="button-group">
              <button onClick={() => handleEdit(book)} className="edit-btn">Editar</button>
              <button onClick={() => handleDelete(book._id)} className="delete-btn">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}