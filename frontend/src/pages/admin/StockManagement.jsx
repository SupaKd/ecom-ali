import { useState, useEffect, useMemo } from "react";
import { fetchProducts } from "../../services/productService";
import { updateProductStock } from "../../services/adminService";
import { formatPrice } from "../../utils/formatPrice";

export default function StockManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState("");

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

  // Extraire les catégories et marques uniques
  const categories = useMemo(() => {
    const unique = [
      ...new Set(products.map((p) => p.category_name).filter(Boolean)),
    ];
    return unique.sort();
  }, [products]);

  const brands = useMemo(() => {
    const unique = [
      ...new Set(products.map((p) => p.brand_name).filter(Boolean)),
    ];
    return unique.sort();
  }, [products]);

  function getFilteredProducts() {
    let filtered = products;

    // Filtre par stock
    if (stockFilter === "low-stock") {
      filtered = filtered.filter(
        (p) => p.stock_quantity > 0 && p.stock_quantity <= 5
      );
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter((p) => p.stock_quantity === 0);
    }

    // Filtre par catégorie
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category_name === categoryFilter);
    }

    // Filtre par marque
    if (brandFilter !== "all") {
      filtered = filtered.filter((p) => p.brand_name === brandFilter);
    }

    // Recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setNewStock(product.stock_quantity);
  }

  function handleCancel() {
    setEditingId(null);
    setNewStock("");
  }

  function handleResetFilters() {
    setStockFilter("all");
    setCategoryFilter("all");
    setBrandFilter("all");
    setSearchQuery("");
  }

  async function handleSave(productId, productName) {
    const quantity = Number(newStock);

    if (isNaN(quantity) || quantity < 0) {
      alert("Stock invalide");
      return;
    }

    try {
      const updatedProduct = await updateProductStock(productId, quantity);

      setProducts(
        products.map((p) =>
          p.id === productId
            ? { ...p, stock_quantity: updatedProduct.stock_quantity }
            : p
        )
      );

      setEditingId(null);
      setNewStock("");
      alert(`Stock de "${productName}" mis à jour`);
    } catch (error) {
      alert(error.message);
    }
  }

  const filteredProducts = getFilteredProducts();
  const hasActiveFilters =
    stockFilter !== "all" ||
    categoryFilter !== "all" ||
    brandFilter !== "all" ||
    searchQuery.trim();

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion du Stock</h1>
      </div>

      <div className="admin-filters">
        <button
          onClick={() => setStockFilter("all")}
          className={stockFilter === "all" ? "active" : ""}
        >
          Tous ({products.length})
        </button>
        <button
          onClick={() => setStockFilter("low-stock")}
          className={stockFilter === "low-stock" ? "active" : ""}
        >
          Stock faible (1-5)
        </button>
        <button
          onClick={() => setStockFilter("out-of-stock")}
          className={stockFilter === "out-of-stock" ? "active" : ""}
        >
          Rupture de stock
        </button>
      </div>

      <div className="admin-search-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par nom ou SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-selects">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les marques</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button onClick={handleResetFilters} className="btn-reset-filters">
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-results-info">
          {filteredProducts.length} produit
          {filteredProducts.length > 1 ? "s" : ""} trouvé
          {filteredProducts.length > 1 ? "s" : ""}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <p>
          Aucun produit{hasActiveFilters ? " correspondant aux filtres" : ""}
        </p>
      ) : (
        <div className="stock-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Marque</th>
                <th>Prix</th>
                <th>Stock actuel</th>
                <th>SKU</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
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
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        min="0"
                        className="stock-input"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={
                          product.stock_quantity === 0
                            ? "stock-out"
                            : product.stock_quantity <= 5
                            ? "stock-low"
                            : ""
                        }
                      >
                        {product.stock_quantity}
                      </span>
                    )}
                  </td>
                  <td>{product.sku}</td>
                  <td className="actions-cell">
                    {editingId === product.id ? (
                      <>
                        <button
                          onClick={() => handleSave(product.id, product.name)}
                          className="btn-small btn-success"
                        >
                          Enregistrer
                        </button>
                        <button onClick={handleCancel} className="btn-small">
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn-small"
                      >
                        Modifier
                      </button>
                    )}
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
