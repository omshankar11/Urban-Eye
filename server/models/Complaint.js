import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['Roads & Potholes', 'Water Supply', 'Waste & Sanitation', 'Street Lighting', 'Public Safety', 'Parks & Recreation', 'Other'],
    default: 'Other'
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
