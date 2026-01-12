import { useState, useEffect } from 'react';
import { fetchCategories } from '../../services/categoryService';
import { createCategory, updateCategory, deleteCategory } from '../../services/adminService';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    display_order: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'name' && !editingId) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        alert('Catégorie modifiée');
      } else {
        await createCategory(formData);
        alert('Catégorie créée');
      }

      resetForm();
      loadCategories();
    } catch (error) {
      alert(error.message);
    }
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      display_order: category.display_order
    });
    setShowForm(true);
  }

  async function handleDelete(id, name) {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      alert('Catégorie supprimée');
    } catch (error) {
      alert(error.message);
    }
  }

  function resetForm() {
    setFormData({ name: '', slug: '', display_order: 0 });
    setEditingId(null);
    setShowForm(false);
  }

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion des Catégories</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Annuler' : '+ Nouvelle catégorie'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h2>{editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>

          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="display_order">Ordre d'affichage</label>
            <input
              type="number"
              id="display_order"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Modifier' : 'Créer'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="categories-list">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Slug</th>
              <th>Ordre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.display_order}</td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(category)} className="btn-small">
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="btn-small btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}