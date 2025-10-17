const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);