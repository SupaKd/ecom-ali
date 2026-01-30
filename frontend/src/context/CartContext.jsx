import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      
      // Validation stricte : doit être un tableau
      if (!Array.isArray(parsed)) {
        console.warn('Données du panier invalides, réinitialisation');
        return [];
      }
      
      return parsed;
    } catch (error) {
      console.error('Erreur lecture localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erreur sauvegarde localStorage:', error);
    }
  }, [cartItems]);

  function addToCart(product, quantity = 1) {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity }];
    });
  }

  function removeFromCart(productId) {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  function getCartTotal() {
    // Protection supplémentaire
    if (!Array.isArray(cartItems)) return 0;
    
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  }

  function getCartCount() {
    // Protection supplémentaire
    if (!Array.isArray(cartItems)) return 0;
    
    return cartItems.reduce((count, item) => {
      const quantity = Number(item.quantity) || 0;
      return count + quantity;
    }, 0);
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}