// controllers/productController.js
import Product from '../product/product.model.js'

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener productos (con filtros)
export const getProducts = async (req, res) => {
  const { name, category, fromDate, toDate } = req.query;

  let filter = {};
  if (name) filter.name = new RegExp(name, 'i');
  if (category) filter.category = category;
  if (fromDate || toDate) {
    filter.entryDate = {};
    if (fromDate) filter.entryDate.$gte = new Date(fromDate);
    if (toDate) filter.entryDate.$lte = new Date(toDate);
  }

  try {
    const products = await Product.find(filter).populate('category').populate('supplier');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar producto (toda la info)
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar campos específicos (como stock o precio)
export const patchProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
