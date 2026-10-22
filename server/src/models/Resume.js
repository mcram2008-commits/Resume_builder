const mongoose = require('mongoose');
const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, trim: true, default: 'My Resume', maxlength: 120 },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Resume', resumeSchema);
