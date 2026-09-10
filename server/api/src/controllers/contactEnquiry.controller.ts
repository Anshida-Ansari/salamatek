import { Request, Response } from 'express';
import ContactEnquiry from '../models/ContactEnquiry';
import { sendContactEnquiryNotification } from '../services/email.service';
import Joi from 'joi';

// Create a new enquiry (Public)
export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      subject: Joi.string().required(),
      message: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details?.[0]?.message || 'Validation error' });
    }

    const newEnquiry: any = new ContactEnquiry(value);
    await newEnquiry.save();

    if ((req as any).user) {
      newEnquiry.assignedTo = (req as any).user._id;
      newEnquiry.status = 'in_progress';
      await newEnquiry.save();
    }

    // Attempt to send email notification in the background
    // We don't await this to fail the request if email fails, but we could.
    // The requirement says: "The database enquiry must not be lost just because email delivery fails."
    sendContactEnquiryNotification(value).catch((err) => {
      console.error('Failed to send email notification for enquiry:', newEnquiry._id, err);
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: newEnquiry,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all enquiries (Admin)
export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    
    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const enquiries = await ContactEnquiry.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get single enquiry (Admin)
export const getEnquiryById = async (req: Request, res: Response) => {
  try {
    const enquiry = await ContactEnquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update status (Admin)
export const updateEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'in_progress', 'resolved', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({ success: true, message: 'Status updated', data: enquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete enquiry (Admin)
export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const enquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
