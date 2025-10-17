const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
  assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true }, // URL to the uploaded file
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number, min: 0, max: 100 },
  status: { type: String, enum: ['Submitted', 'Graded'], default: 'Submitted' },
}, { timestamps: true });

// Ensure a student submits an assignment only once
SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);