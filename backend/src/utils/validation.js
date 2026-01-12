export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  export function isValidPrice(price) {
    const numPrice = Number(price);
    return !isNaN(numPrice) && numPrice >= 0;
  }
  
  export function isValidStock(stock) {
    const numStock = Number(stock);
    return Number.isInteger(numStock) && numStock >= 0;
  }
  
  export function isValidQuantity(quantity) {
    const numQuantity = Number(quantity);
    return Number.isInteger(numQuantity) && numQuantity > 0;
  }
  
  export function sanitizeString(str) {
    if (!str) {
      return '';
    }
    return str.trim();
  }