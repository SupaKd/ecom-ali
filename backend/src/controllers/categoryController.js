import * as categoryService from '../services/categoryService.js';

export async function getCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const data = {
      ...req.body,
      image: req.file
    };
    const category = await categoryService.addCategory(data);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const data = {
      ...req.body,
      image: req.file
    };
    const category = await categoryService.modifyCategory(req.params.id, data);
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await categoryService.removeCategory(req.params.id);
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    next(error);
  }
}