import mongoose from "mongoose";

// Define news schema
const newsSchema = new mongoose.Schema({
  image: [{
    type: String,
    required: true
  }],
  title: {
    type: String,
    required: true
  },
  folderId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Cars', 'Events']
  }
});

// Create model from schema
const News = mongoose.models.News || mongoose.model('News', newsSchema);

module.exports = News;
