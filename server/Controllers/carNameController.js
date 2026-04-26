import asyncHandler from 'express-async-handler';
import CarName from '../Models/CarName.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

export const getCarNames = asyncHandler(async (req, res) => {
  const carNames = await CarName.find().sort({ name: 1 }).lean();
  res.json(carNames);
});

export const getCarNameById = asyncHandler(async (req, res) => {
  const carName = await CarName.findById(req.params.id).lean();
  if (!carName) {
    res.status(404);
    throw new Error('Car name not found');
  }
  res.json(carName);
});

export const createCarName = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Name is required');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('An image is required');
  }

  // Check uniqueness manually for a clear error message
  const exists = await CarName.findOne({ name: name.trim() });
  if (exists) {
    res.status(409);
    throw new Error(`Car name "${name.trim()}" already exists`);
  }

  const imageUrl = await uploadToCloudinary(req.file);

  const carName = await CarName.create({
    name: name.trim(),
    imageUrl,
  });

  res.status(201).json(carName);
});

export const updateCarName = asyncHandler(async (req, res) => {
  const carName = await CarName.findById(req.params.id);
  if (!carName) {
    res.status(404);
    throw new Error('Car name not found');
  }

  const { name } = req.body;

  if (name && name.trim() !== carName.name) {
    const exists = await CarName.findOne({ name: name.trim() });
    if (exists) {
      res.status(409);
      throw new Error(`Car name "${name.trim()}" already exists`);
    }
    carName.name = name.trim();
  }

  // Replace image if a new file is uploaded
  if (req.file) {
    // Best-effort delete old image from Cloudinary
    await deleteFromCloudinary(carName.imageUrl).catch(() => null);
    carName.imageUrl = await uploadToCloudinary(req.file);
  }

  const updated = await carName.save();
  res.json(updated);
});


export const deleteCarName = asyncHandler(async (req, res) => {
  const carName = await CarName.findById(req.params.id);
  if (!carName) {
    res.status(404);
    throw new Error('Car name not found');
  }

  await deleteFromCloudinary(carName.imageUrl).catch(() => null);
  await CarName.deleteOne({ _id: req.params.id });

  res.json({ message: 'Car name deleted successfully' });
});