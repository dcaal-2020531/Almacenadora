import Category from './category.model.js';
import Product from '../product/product.model.js';
import mongoose from 'mongoose';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    await newCategory.save();
    return res.status(201).json({ success: true, message: 'Category created', category: newCategory });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error creating category', err });
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.status(200).json({ success: true, category });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching category', err });
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
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    if (category.defaultCat) return res.status(400).json({ success: false, message: 'Cannot delete default category' });

    const defaultCat = await Category.findOne({ defaultCat: true });
    if (!defaultCat) return res.status(400).json({ success: false, message: 'Default category not set' });

    await Product.updateMany({ category: id }, { $set: { category: defaultCat._id } });
    await Category.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Category deleted and products reassigned' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting category', err });
  }
};

export const defaultCategory = async () => {
  try {
    const defaultCategory = await Category.findOne({ defaultCat: true });
    if (defaultCategory) {
      console.log('The default category already exists.');
      return;
    }
    console.log('Creating the default category...');
    const newCategory = new Category({
      name: 'Default Category',
      description: 'This is the default category',
      defaultCat: true,
    });
    await newCategory.save();
    console.log('Default category created successfully');
  } catch (error) {
    console.error('Error creating the default category:', error);
  }
};
