import { useState, useEffect } from 'react';
import { fetchCategories } from '../../services/categoryService';
import { createCategory, updateCategory, deleteCategory } from '../../services/adminService';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';

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
  const [image, setImage] = useState(null);
  const toast = useToast();
  const confirm = useConfirm();

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

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('display_order', formData.display_order);

      if (image) {
        data.append('image', image);
      }

      if (editingId) {
        await updateCategory(editingId, data);
        toast.success('Catégorie modifiée');
      } else {
        await createCategory(data);
        toast.success('Catégorie créée');
      }

      resetForm();
      loadCategories();
    } catch (error) {
      toast.error(error.message);
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
    const confirmed = await confirm({
      title: 'Supprimer la catégorie',
      message: `Êtes-vous sûr de vouloir supprimer "${name}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      confirmVariant: 'danger'
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Catégorie supprimée');
    } catch (error) {
      toast.error(error.message);
    }
  }

  function resetForm() {
    setFormData({ name: '', slug: '', display_order: 0 });
    setImage(null);
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

          <div className="form-group">
            <label htmlFor="image">
              Image {editingId ? "(laisser vide pour conserver l'actuelle)" : ''}
            </label>
            <input
              type="file"
              id="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
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
              <th>Image</th>
              <th>Nom</th>
              <th>Slug</th>
              <th>Ordre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>
                  {category.image_url && (
                    <img
                      src={`http://localhost:3001${category.image_url}`}
                      alt={category.name}
                      className="product-thumbnail"
                    />
                  )}
                </td>
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