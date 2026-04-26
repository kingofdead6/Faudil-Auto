import asyncHandler from 'express-async-handler';
import Contact from '../Models/Contact.js';


export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Veuillez remplir tous les champs obligatoires');
  }

  const contact = await Contact.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim(),
    message: message.trim(),
  });

  res.status(201).json({
    success: true,
    message: "Message envoyé avec succès ! Nous vous répondrons bientôt.",
    contactId: contact._id
  });
});


export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});


export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Message non trouvé');
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Message supprimé avec succès' });
});