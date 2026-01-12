export function formatPrice(price) {
    if (price === null || price === undefined) {
      return 'Prix non disponible';
    }
    
    return `${Number(price).toFixed(2)} €`;
  }