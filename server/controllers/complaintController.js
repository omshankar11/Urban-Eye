import Complaint from '../models/Complaint.js';
import { saveBase64Image } from '../utils/fileUpload.js';
import { sendStatusUpdateEmail } from '../config/email.js';

export const createComplaint = async (req, res) => {
  try {
    const { city, state, address, image, category } = req.body;

    if (!city || !state || !address) {
      return res.status(400).json({ message: 'City, state, and address are required.' });
    }

    let imageUrl;
    if (image) {
      try {
        imageUrl = saveBase64Image(image);
      } catch (err) {
        console.error('Local Upload Error:', err);
        return res.status(500).json({ message: 'Local image saving failed: ' + err.message });
      }
    }

    const newComplaint = await Complaint.create({
      user: req.user._id,
      city,
      state,
      address,
      imageUrl,
      category: category || 'Other',
    });

    res.status(201).json({ message: 'Complaint submitted successfully.', complaint: newComplaint });
  } catch (error) {
    console.error('Error while creating complaint:', error);
    res.status(500).json({ message: 'Server error while submitting complaint.' });
  }
};


export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'email fullName').sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints.' });
  }
};


export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Failed to fetch your complaints.' });
  }
};


// Public portfolio — paginated, filterable
export const getPublicComplaints = async (req, res) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 9);
    const skip     = (page - 1) * limit;
    const cityFilter     = req.query.city     || null;
    const categoryFilter = req.query.category || null;

    const query = { status: 'Resolved' };
    if (cityFilter)     query.city     = { $regex: cityFilter,     $options: 'i' };
    if (categoryFilter) query.category = { $regex: categoryFilter, $options: 'i' };

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'fullName'),
      Complaint.countDocuments(query),
    ]);

    res.status(200).json({
      complaints,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching public complaints:', error);
    res.status(500).json({ message: 'Failed to fetch resolved complaints.' });
  }
};


// Public stats endpoint — no auth required
export const getPortfolioStats = async (req, res) => {
  try {
    const [total, resolved, inProgress, newCount, cityAgg, categoryAgg, citizenCount] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'New' }),
      // Top 8 cities by resolved count
      Complaint.aggregate([
        { $match: { status: 'Resolved' } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      // Category breakdown for resolved complaints
      Complaint.aggregate([
        { $match: { status: 'Resolved' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      // Unique citizens who have had a complaint resolved
      Complaint.distinct('user', { status: 'Resolved' }),
    ]);

    const successRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    const citiesCount = await Complaint.distinct('city', { status: 'Resolved' });

    res.status(200).json({
      total,
      resolved,
      inProgress,
      new: newCount,
      successRate,
      citiesCount: citiesCount.length,
      citizensHelped: citizenCount.length,
      topCities: cityAgg.map(c => ({ city: c._id, count: c.count })),
      categoryBreakdown: categoryAgg.map(c => ({ category: c._id || 'Other', count: c.count })),
    });
  } catch (error) {
    console.error('Error fetching portfolio stats:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio statistics.' });
  }
};


export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['New', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'email fullName');

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    if (updatedComplaint.user?.email) {
      await sendStatusUpdateEmail(updatedComplaint.user.email, updatedComplaint._id, status);
    }

    res.status(200).json({ message: 'Complaint status updated.', complaint: updatedComplaint });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Failed to update status.' });
  }
};