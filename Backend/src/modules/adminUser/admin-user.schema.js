import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const admin = new Schema(
  {
    _id: { type: mongoose.Schema.ObjectId, require: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cookie: { type: String, required: false, default: "" },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    lastLoggedOut: { type: Date, required: false },
    lastLoggedIn: { type: Date, required: false },
    createdAt: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

admin.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.password = this.password;
  next();
});

const AdminModel = mongoose.model("admin", admin);
export default AdminModel;
