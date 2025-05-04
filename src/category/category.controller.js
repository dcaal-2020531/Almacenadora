import Category from './category.model.js';
import Product from '../product/product.model.js';
import mongoose from 'mongoose';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    await newCategory.save();
    return res.status(201).json({ success: true, message: 'Categoria creada exitosamente', category: newCategory });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error al crear la categoria', err });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching categories', err });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validar formato del ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }
    // Buscar categoría por ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    res.status(200).json(category);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.status(200).json({ success: true, message: 'Category updated', category: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating category', err });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: 'Categoria no encontrada' });
    if (category.defaultCat) return res.status(400).json({ success: false, message: 'No se puede eliminar la categoría predeterminada' });

    const defaultCat = await Category.findOne({ defaultCat: true });
    if (!defaultCat) return res.status(400).json({ success: false, message: 'Categoría predeterminada no establecida' });

    await Product.updateMany({ category: id }, { $set: { category: defaultCat._id } });
    await Category.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'categoría eliminada y productos reasignados' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error al eliminar la categoría', err });
  }
};

export const defaultCategory = async () => {
  try {
    const defaultCategory = await Category.findOne({ defaultCat: true });
    if (defaultCategory) {
      console.log('La categoría predeterminada ya existe.');
      return;
    }
    console.log('Creando la categoría predeterminada...');
    const newCategory = new Category({
      name: 'Categoría predeterminada',
      description: 'Esta es la categoría predeterminada',
      defaultCat: true,
    });
    await newCategory.save();
    console.log('Categoría predeterminada creada correctamente');
  } catch (error) {
    console.error('Error al crear la categoría predeterminada:', error);
  }
};
