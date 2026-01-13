import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../../services/productService';
import { fetchCategories } from '../../services/categoryService';
import { fetchBrands } from '../../services/brandService';
import { createProduct, updateProduct } from '../../services/adminService';
import { useToast } from '../../contexts/ToastContext';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    brand_id: '',
    price: '',
    stock_quantity: '',
    sku: ''
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        fetchCategories(),
        fetchBrands()
      ]);

      setCategories(categoriesData);
      setBrands(brandsData);

      if (isEditing) {
        const product = await fetchProductById(id);
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          category_id: product.category_id,
          brand_id: product.brand_id,
          price: product.price,
          stock_quantity: product.stock_quantity,
          sku: product.sku || ''
        });
      }
    } catch (error) {
      setError(error.message);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'name' && !isEditing) {
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
    setIsLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('description', formData.description);
      data.append('category_id', formData.category_id);
      data.append('brand_id', formData.brand_id);
      data.append('price', formData.price);
      data.append('stock_quantity', formData.stock_quantity);
      data.append('sku', formData.sku);

      if (image) {
        data.append('image', image);
      }

      if (isEditing) {
        await updateProduct(id, data);
        toast.success('Produit modifié');
      } else {
        await createProduct(data);
        toast.success('Produit créé');
      }

      navigate('/admin/products');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (error && !formData.name) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <button onClick={() => navigate('/admin/products')} className="btn-back">
          ← Retour
        </button>
        <h1>{isEditing ? 'Modifier le produit' : 'Nouveau produit'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Nom du produit *</label>
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
          <label htmlFor="slug">Slug (URL) *</label>
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
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category_id">Catégorie *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="brand_id">Marque *</label>
            <select
              id="brand_id"
              name="brand_id"
              value={formData.brand_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une marque</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Prix (€) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock_quantity">Stock *</label>
            <input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sku">SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="image">
            Image {isEditing ? "(laisser vide pour conserver l'actuelle)" : '*'}
          </label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            required={!isEditing}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
        </button>
      </form>
    </div>
  );
}