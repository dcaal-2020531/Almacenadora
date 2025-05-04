import Movement from './movement.model.js';
import Product from '../product/product.model.js';

export const registerEntry = async (req, res) => {
  try {
    const { productId, quantity, employeeId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    product.stock += quantity;
    await product.save();

    const movement = await Movement.create({
      product: productId,
      type: 'entry',
      quantity,
      employee: employeeId
    });

    res.status(201).json({ message: 'Entrada registrada', movement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerExit = async (req, res) => {
  try {
    const { productId, quantity, reason, destination, employeeId } = req.body;

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity)
      return res.status(400).json({ message: 'Stock insuficiente o producto no encontrado' });

    product.stock -= quantity;
    await product.save();

    const movement = await Movement.create({
      product: productId,
      type: 'exit',
      quantity,
      reason,
      destination,
      employee: employeeId
    });

    res.status(201).json({ message: 'Salida registrada', movement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const movements = await Movement.find({ product: req.params.productId }).populate('employee', 'name').sort({ date: -1 });
    res.status(200).json(movements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
