import { useState, useEffect } from 'react';
import { fetchBrands } from '../../services/brandService';
import { createBrand, updateBrand, deleteBrand } from '../../services/adminService';

export default function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchBrands();
      setBrands(data);
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
        await updateBrand(editingId, formData);
        alert('Marque modifiée');
      } else {
        await createBrand(formData);
        alert('Marque créée');
      }

      resetForm();
      loadBrands();
    } catch (error) {
      alert(error.message);
    }
  }

  function handleEdit(brand) {
    setEditingId(brand.id);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || ''
    });
    setShowForm(true);
  }

  async function handleDelete(id, name) {
    if (!confirm(`Supprimer la marque "${name}" ?`)) {
      return;
    }

    try {
      await deleteBrand(id);
      setBrands(brands.filter(b => b.id !== id));
      alert('Marque supprimée');
    } catch (error) {
      alert(error.message);
    }
  }

  function resetForm() {
    setFormData({ name: '', slug: '', description: '' });
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
        <h1>Gestion des Marques</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Annuler' : '+ Nouvelle marque'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h2>{editingId ? 'Modifier la marque' : 'Nouvelle marque'}</h2>

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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
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

      <div className="brands-list">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(brand => (
              <tr key={brand.id}>
                <td>{brand.name}</td>
                <td>{brand.slug}</td>
                <td>{brand.description || '-'}</td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(brand)} className="btn-small">
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id, brand.name)}
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