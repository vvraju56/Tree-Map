const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['person', 'union'], default: 'person' },
  name: { type: String, required: false, trim: true },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  birthDate: { type: String, default: '' },
  deathDate: { type: String, default: '' },
  photo: { type: String, default: '' },
  notes: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
});

const relationshipSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  sourceHandle: { type: String },
  targetHandle: { type: String },
  relationType: {
    type: String,
    enum: [
      'father', 'mother', 'son', 'daughter',
      'brother', 'sister', 'husband', 'wife',
      'grandfather', 'grandmother', 'grandson', 'granddaughter',
      'uncle', 'aunt', 'nephew', 'niece', 'cousin',
    ],
    required: true,
  },
});

const familyTreeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tree title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [personSchema],
    relationships: [relationshipSchema],
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FamilyTree', familyTreeSchema);
