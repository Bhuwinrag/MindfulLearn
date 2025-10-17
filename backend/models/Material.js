const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaterialSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true }, // The path to the file
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);