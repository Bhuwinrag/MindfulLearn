const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  thread: { type: Schema.Types.ObjectId, ref: 'Thread', required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);