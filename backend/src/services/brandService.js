import * as brandRepo from '../repositories/brandRepository.js';
import { sanitizeString } from '../utils/validation.js';

export async function getAllBrands() {
  return await brandRepo.findAllBrands();
}

export async function getBrandById(id) {
  const brand = await brandRepo.findBrandById(id);
  
  if (!brand) {
    throw new Error('Marque introuvable');
  }
  
  return brand;
}

export async function getBrandBySlug(slug) {
  const brand = await brandRepo.findBrandBySlug(slug);
  
  if (!brand) {
    throw new Error('Marque introuvable');
  }
  
  return brand;
}

export async function addBrand(data) {
  const name = sanitizeString(data.name);
  const slug = sanitizeString(data.slug);
  
  if (!name || !slug) {
    throw new Error('Nom et slug requis');
  }
  
  const brandId = await brandRepo.createBrand({
    name,
    slug,
    description: sanitizeString(data.description)
  });
  
  return await brandRepo.findBrandById(brandId);
}

export async function modifyBrand(id, data) {
  const brand = await brandRepo.findBrandById(id);
  
  if (!brand) {
    throw new Error('Marque introuvable');
  }
  
  const name = sanitizeString(data.name);
  const slug = sanitizeString(data.slug);
  
  if (!name || !slug) {
    throw new Error('Nom et slug requis');
  }
  
  await brandRepo.updateBrand(id, {
    name,
    slug,
    description: sanitizeString(data.description)
  });
  
  return await brandRepo.findBrandById(id);
}

export async function removeBrand(id) {
  const brand = await brandRepo.findBrandById(id);
  
  if (!brand) {
    throw new Error('Marque introuvable');
  }
  
  return await brandRepo.deleteBrand(id);
}