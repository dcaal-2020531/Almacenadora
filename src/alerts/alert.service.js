import Product from '../product/product.model.js';

export const checkLowStockProducts = async (min = 10) => {
    const lowStockProducts = await Product.find({ stock: { $lt: min } });
    return lowStockProducts;
  };

  export const checkExpiringProducts = async (daysBefore = 7) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const upcoming = new Date();
    upcoming.setDate(today.getDate() + daysBefore);
    upcoming.setHours(23, 59, 59, 999);
  
    const expiringProducts = await Product.find({
      expirationDate: { $lte: upcoming } 
    });
  
    return expiringProducts;
  };
  
  
  
  
  
