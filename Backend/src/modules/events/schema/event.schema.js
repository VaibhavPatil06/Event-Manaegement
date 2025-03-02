import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String ,default: ""},
    location: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
  },
  { timestamps: true }
);

const EventModel = mongoose.model("Event", eventSchema);

export default EventModel;
