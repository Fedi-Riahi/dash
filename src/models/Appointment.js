import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  carVIN: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  services: {
    type: [String], // Assuming selected services are stored as an array of strings
    required: true
  },
  selectedDate: {
    type: Date, // Assuming selected date is stored as a Date object
    required: true
  },
  selectedTime: {
    type: String, // Assuming selected time is stored as a string
    required: true
  },
  mobilityOption: {
    type: String,
    enum: ['agency', 'tow'],
    required: true
  }
}, { timestamps: true });

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;
