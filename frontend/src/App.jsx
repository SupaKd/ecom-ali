import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ScrollToTop from './components/ScrollToTop';
import AdminLayout from './components/admin/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import CategoriesListPage from './pages/CategoriesListPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import OrderList from './pages/admin/OrderList';
import OrderDetail from './pages/admin/OrderDetail';
import StockManagement from './pages/admin/StockManagement';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import CategoryManagement from './pages/admin/CategoryManagement';
import BrandManagement from './pages/admin/BrandManagement';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <ConfirmProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
            {/* Routes publiques avec Navbar et Footer */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="category" element={<CategoriesListPage />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="product/:slug" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="success" element={<SuccessPage />} />
              <Route path="cancel" element={<CancelPage />} />
            </Route>

            {/* Route login admin (sans layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Routes admin protégées */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              
              {/* Routes order_manager */}
              <Route
                path="orders"
                element={
                  <PrivateRoute allowedRoles={['order_manager']}>
                    <OrderList />
                  </PrivateRoute>
                }
              />
              <Route
                path="orders/:id"
                element={
                  <PrivateRoute allowedRoles={['order_manager']}>
                    <OrderDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="stock"
                element={
                  <PrivateRoute allowedRoles={['order_manager']}>
                    <StockManagement />
                  </PrivateRoute>
                }
              />

              {/* Routes product_manager */}
              <Route
                path="products"
                element={
                  <PrivateRoute allowedRoles={['product_manager']}>
                    <ProductList />
                  </PrivateRoute>
                }
              />
              <Route
                path="products/new"
                element={
                  <PrivateRoute allowedRoles={['product_manager']}>
                    <ProductForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="products/edit/:id"
                element={
                  <PrivateRoute allowedRoles={['product_manager']}>
                    <ProductForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="categories"
                element={
                  <PrivateRoute allowedRoles={['product_manager']}>
                    <CategoryManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="brands"
                element={
                  <PrivateRoute allowedRoles={['product_manager']}>
                    <BrandManagement />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
        </ConfirmProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

function PublicLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  return (
    <div className="app">
      <Navbar onCartClick={openCart} />
      <main className="main-content">
        <Outlet context={{ openCart }} />
      </main>
      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}

export default App;