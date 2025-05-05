import Proveedor from './proveedor.model.js'
import Product from '../product/product.model.js'

/* GESTIÓN DE PROVEEDORES */

// Ver todos los proveedores activos
export const getAllProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find({ status: true }).populate('products');
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ver proveedor por ID
export const getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Proveedor.findById(id).populate('products');

    if (!proveedor || !proveedor.status) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo proveedor
export const createProveedor = async (req, res) => {
  try {
    const { name, contact, products } = req.body;

    // Validar que los IDs de productos existan
    if (products && products.length > 0) {
      const existingProducts = await Product.find({ _id: { $in: products } });

      if (existingProducts.length !== products.length) {
        return res.status(400).json({ error: 'Uno o más productos no existen.' });
      }
    }

    const proveedor = new Proveedor({
      name,
      contact,
      products
    });

    await proveedor.save();

    res.status(201).json({ mensaje: 'Proveedor creado exitosamente', proveedor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar proveedor
export const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, products } = req.body;

    const proveedor = await Proveedor.findById(id);
    if (!proveedor || !proveedor.status) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    proveedor.name = name || proveedor.name;
    proveedor.contact = contact || proveedor.contact;
    proveedor.products = products || proveedor.products;

    await proveedor.save();

    res.status(200).json({ mensaje: 'Proveedor actualizado con éxito', proveedor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dar de baja a un proveedor
export const deactivateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmation } = req.body;

    const proveedor = await Proveedor.findById(id);
    if (!proveedor || !proveedor.status) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }

    if (!confirmation || confirmation !== 'CONFIRM') {
      return res.status(400).json({ mensaje: 'Se requiere confirmación para dar de baja al proveedor' });
    }

    proveedor.status = false;
    await proveedor.save();

    res.status(200).json({ mensaje: 'Proveedor dado de baja con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};