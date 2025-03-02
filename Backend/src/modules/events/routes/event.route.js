import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../controllers/event.controller.js";
import { isAdmin } from "../../middleware/auth.js";

const eventRouter = express.Router();

eventRouter.get("/all-event", getAllEvents);
eventRouter.post("/create-event", isAdmin, createEvent);
eventRouter.post("/update-event", isAdmin, updateEvent);
eventRouter.delete("/delete-event", isAdmin, deleteEvent);

export default eventRouter;
