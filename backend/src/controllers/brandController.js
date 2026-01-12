import * as brandService from '../services/brandService.js';

export async function getBrands(req, res, next) {
  try {
    const brands = await brandService.getAllBrands();
    res.json(brands);
  } catch (error) {
    next(error);
  }
}

export async function getBrandById(req, res, next) {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    res.json(brand);
  } catch (error) {
    next(error);
  }
}

export async function getBrandBySlug(req, res, next) {
  try {
    const brand = await brandService.getBrandBySlug(req.params.slug);
    res.json(brand);
  } catch (error) {
    next(error);
  }
}

export async function createBrand(req, res, next) {
  try {
    const brand = await brandService.addBrand(req.body);
    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
}

export async function updateBrand(req, res, next) {
  try {
    const brand = await brandService.modifyBrand(req.params.id, req.body);
    res.json(brand);
  } catch (error) {
    next(error);
  }
}

export async function deleteBrand(req, res, next) {
  try {
    await brandService.removeBrand(req.params.id);
    res.json({ message: 'Marque supprimée' });
  } catch (error) {
    next(error);
  }
}