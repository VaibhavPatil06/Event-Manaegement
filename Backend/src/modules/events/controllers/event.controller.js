import mongoose from "mongoose";
import EventModel from "../schema/event.schema.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image");

export const createEvent = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error uploading file",
          error: err.message,
        });
      }

      const { title, description, date, location, id } = req.body;
      if (id !== "") {
        updateEvent(req, res);
        return;
      }
      if (!title || !description || !date || !location) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required!" });
      }

      // Create Event first
      const event = await EventModel.create({
        _id: new mongoose.Types.ObjectId(),
        title,
        description,
        date,
        location,
        createdBy: req.context.user,
        updatedBy: req.context.user,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      let imagePath = "";

      if (req.file) {
        const eventFolder = `uploads/events/${event._id}`;
        const imageFolder = `${eventFolder}/img`;

        // Ensure directories exist
        fs.mkdirSync(imageFolder, { recursive: true });

        // Define full image path
        imagePath = path.join(imageFolder, req.file.originalname);

        // Save the file
        fs.writeFileSync(imagePath, req.file.buffer);

        // Update event with image path
        await EventModel.findByIdAndUpdate(event._id, { image: imagePath });
      }

      res.status(201).json({
        message: "Event created successfully",
        success: true,
        event: { ...event.toObject(), image: imagePath }, // Include image path in response
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};
export const updateEvents = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error uploading file",
          error: err.message,
        });
      }

      const { title, description, date, location, id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Event ID is required for updating!",
        });
      }

      // Find the existing event
      const existingEvent = await EventModel.findById(id);
      if (!existingEvent) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found!" });
      }

      // Update event fields
      existingEvent.title = title || existingEvent.title;
      existingEvent.description = description || existingEvent.description;
      existingEvent.date = date || existingEvent.date;
      existingEvent.location = location || existingEvent.location;
      existingEvent.updatedBy = req.context.user;
      existingEvent.updatedAt = new Date();

      let imagePath = existingEvent.image || "";

      // Handle file upload if a new file is provided
      if (req.file) {
        const eventFolder = `uploads/events/${existingEvent._id}`;
        const imageFolder = `${eventFolder}/img`;

        // Ensure directories exist
        fs.mkdirSync(imageFolder, { recursive: true });

        // Define full image path
        imagePath = path.join(imageFolder, req.file.originalname);

        // Save the new file
        fs.writeFileSync(imagePath, req.file.buffer);

        // Delete the old image if it exists
        if (existingEvent.image && fs.existsSync(existingEvent.image)) {
          fs.unlinkSync(existingEvent.image);
        }

        // Update the image path in the event
        existingEvent.image = imagePath;
      }

      // Save the updated event
      await existingEvent.save();

      res.status(200).json({
        message: "Event updated successfully",
        success: true,
        event: existingEvent,
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id: eventId } = req.query; // Ensure eventId is properly extracted

    if (!eventId || eventId === "undefined") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID" });
    }

    const event = await EventModel.findById(eventId); // Corrected usage of findById

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found!" });
    }

    await event.deleteOne();
    res
      .status(200)
      .json({ message: "Event deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { searchTerm, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    let filter = {};

    if (searchTerm) {
      const regex = new RegExp(searchTerm.split('').join('.*'), 'i'); // Allows similar character sequences
      filter = {
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } },
          { location: { $regex: regex } }
        ]
      };
    }

    const events = await EventModel.find(filter)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalEvents = await EventModel.countDocuments(filter);
    const hasMore = pageNumber * limitNumber < totalEvents;

    res.json({ success: true, data: events, hasMore });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

