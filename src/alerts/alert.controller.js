import { checkLowStockProducts, checkExpiringProducts } from './alert.service.js';

export const getAlerts = async (req, res) => {
  try {
    const lowStock = await checkLowStockProducts();
    const expiring = await checkExpiringProducts();

    res.json({ lowStock, expiring });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
