import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../services/productService';
import { deleteProduct } from '../../services/adminService';
import { formatPrice } from '../../utils/formatPrice';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../contexts/ConfirmContext';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id, name) {
    const confirmed = await confirm({
      title: 'Supprimer le produit',
      message: `Êtes-vous sûr de vouloir supprimer "${name}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      confirmVariant: 'danger'
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Produit supprimé');
    } catch (error) {
      toast.error(error.message);
    }
  }

  function getFilteredProducts() {
    if (filter === 'all') {
      return products;
    }
    if (filter === 'low-stock') {
      return products.filter(p => p.stock_quantity <= 5);
    }
    if (filter === 'out-of-stock') {
      return products.filter(p => p.stock_quantity === 0);
    }
    return products;
  }

  const filteredProducts = getFilteredProducts();

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion des Produits</h1>
        <Link to="/admin/products/new" className="btn-primary">
          + Nouveau produit
        </Link>
      </div>

      <div className="admin-filters">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          Tous ({products.length})
        </button>
        <button
          onClick={() => setFilter('low-stock')}
          className={filter === 'low-stock' ? 'active' : ''}
        >
          Stock faible (≤5)
        </button>
        <button
          onClick={() => setFilter('out-of-stock')}
          className={filter === 'out-of-stock' ? 'active' : ''}
        >
          Rupture de stock
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <p>Aucun produit</p>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Marque</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>SKU</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.image_url && (
                      <img
                        src={`http://localhost:3001${product.image_url}`}
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category_name}</td>
                  <td>{product.brand_name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span className={product.stock_quantity <= 5 ? 'stock-low' : ''}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td>{product.sku}</td>
                  <td className="actions-cell">
                    <Link to={`/admin/products/edit/${product.id}`} className="btn-small">
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
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
      )}
    </div>
  );
}