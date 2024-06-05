const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  services: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }]
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;
