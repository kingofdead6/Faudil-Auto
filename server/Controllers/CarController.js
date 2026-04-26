import asyncHandler from 'express-async-handler';
import Car from '../Models/Car.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';


export const getCars = asyncHandler(async (req, res) => {
  const { brand, year, color } = req.query;
  const query = {};
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (year) query.year = Number(year);
  if (color) query.colors = { $in: [color] };

  const cars = await Car.find(query).sort({ createdAt: -1 }).lean();
  res.json(cars);
});


export const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).lean();
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }
  res.json(car);
});

export const createCar = asyncHandler(async (req, res) => {
  const { brand, model, description, year, colors } = req.body;

  if (!brand || !model || !description || !year) {
    res.status(400);
    throw new Error('Brand, model, description and year are required');
  }

  const parsedColors = Array.isArray(colors)
    ? colors
    : typeof colors === 'string'
    ? JSON.parse(colors)
    : [];

  if (!parsedColors.length) {
    res.status(400);
    throw new Error('At least one color is required');
  }

  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      images.push(url);
    }
  }

  const car = await Car.create({
    brand: brand.trim(),
    model: model.trim(),
    description: description.trim(),
    year: Number(year),
    colors: parsedColors,
    images,
  });

  res.status(201).json(car);
});

export const updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  const { brand, model, description, year, colors, removeImages } = req.body;

  if (brand) car.brand = brand.trim();
  if (model) car.model = model.trim();
  if (description) car.description = description.trim();
  if (year !== undefined) car.year = Number(year);

  if (colors) {
    const parsedColors = Array.isArray(colors)
      ? colors
      : typeof colors === 'string'
      ? JSON.parse(colors)
      : car.colors;
    car.colors = parsedColors;
  }

  // Remove specific images by URL
  if (removeImages) {
    const toRemove = Array.isArray(removeImages)
      ? removeImages
      : JSON.parse(removeImages);
    for (const url of toRemove) {
      await deleteFromCloudinary(url).catch(() => null); // best-effort
    }
    car.images = car.images.filter((img) => !toRemove.includes(img));
  }

  // Append new uploaded images
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file);
      car.images.push(url);
    }
  }

  const updated = await car.save();
  res.json(updated);
});


export const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  // Optionally clean up Cloudinary images
  for (const url of car.images) {
    await deleteFromCloudinary(url).catch(() => null);
  }

  await Car.deleteOne({ _id: req.params.id });
  res.json({ message: 'Car deleted successfully' });
});

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Car.distinct('brand');
  res.json(brands.sort());
});


export const getYears = asyncHandler(async (req, res) => {
  const years = await Car.distinct('year');
  res.json(years.sort((a, b) => b - a));
});