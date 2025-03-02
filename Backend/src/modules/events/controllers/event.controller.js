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

export const updateEvent = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          success: false,
          message: "Error uploading file",
          error: err.message,
        });
      }
    });
    const { title, description, date, image, updatedBy, id } = req.body;

    const event = await EventModel.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found!" });
    }
    let imagePath = image;

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
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.image = imagePath || event.image;
    event.updatedBy = updatedBy || event.updatedBy;
    event.updatedAt = new Date();

    await event.save();
    res
      .status(200)
      .json({ message: "Event updated successfully", success: true, event });
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
      filter.title = { $regex: searchTerm, $options: "i" };
      filter.description = { $regex: searchTerm, $options: "i" };
      filter.location = { $regex: searchTerm, $options: "i" };
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
