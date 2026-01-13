import * as categoryRepo from '../repositories/categoryRepository.js';
import { sanitizeString } from '../utils/validation.js';

export async function getAllCategories() {
  return await categoryRepo.findAllCategories();
}

export async function getCategoryById(id) {
  const category = await categoryRepo.findCategoryById(id);
  
  if (!category) {
    throw new Error('Catégorie introuvable');
  }
  
  return category;
}

export async function getCategoryBySlug(slug) {
  const category = await categoryRepo.findCategoryBySlug(slug);
  
  if (!category) {
    throw new Error('Catégorie introuvable');
  }
  
  return category;
}

export async function addCategory(data) {
  const name = sanitizeString(data.name);
  const slug = sanitizeString(data.slug);

  if (!name || !slug) {
    throw new Error('Nom et slug requis');
  }

  // Gérer l'image uploadée
  let image_url = null;
  if (data.image) {
    image_url = `/images/products/${data.image.filename}`;
  }

  const categoryId = await categoryRepo.createCategory({
    name,
    slug,
    image_url,
    display_order: data.display_order || 0
  });

  return await categoryRepo.findCategoryById(categoryId);
}

export async function modifyCategory(id, data) {
  const category = await categoryRepo.findCategoryById(id);

  if (!category) {
    throw new Error('Catégorie introuvable');
  }

  const name = sanitizeString(data.name);
  const slug = sanitizeString(data.slug);

  if (!name || !slug) {
    throw new Error('Nom et slug requis');
  }

  // Gérer l'image uploadée
  let image_url = category.image_url;
  if (data.image) {
    image_url = `/images/products/${data.image.filename}`;
  }

  await categoryRepo.updateCategory(id, {
    name,
    slug,
    image_url,
    display_order: data.display_order !== undefined ? data.display_order : category.display_order
  });

  return await categoryRepo.findCategoryById(id);
}

export async function removeCategory(id) {
  const category = await categoryRepo.findCategoryById(id);
  
  if (!category) {
    throw new Error('Catégorie introuvable');
  }
  
  return await categoryRepo.deleteCategory(id);
}