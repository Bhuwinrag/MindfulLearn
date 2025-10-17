const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "8 Weeks"
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);