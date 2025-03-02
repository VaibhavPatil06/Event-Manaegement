import multer from "multer";
import { signJwt } from "../../../utils/auth.js";
import { decrypt } from "../../../utils/decryptPassword.js";
import AdminModel from "../admin-user.schema.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const me = async (req, res) => {
  try {
    const userDetails = await AdminModel.findById(req.context?.user)
      .select("-password -city -unsubscribe -cookie")
      .lean();
    res
      .status(201)
      .json({ data: userDetails, message: "user data", success: true });
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: error, success: false });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Validate input
    if (!fullName || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    // Check if user exists
    const userExists = await AdminModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "email already exists!" });
    }

    // Decrypt password if necessary
    let finalPassword = password; // Assume plaintext unless encryption is used
    try {
      finalPassword = decrypt(password); // Decrypt if encrypted
    } catch (error) {
      console.error("Password decryption failed:", error.message);
      return res
        .status(400)
        .json({ success: false, message: "Invalid encrypted password" });
    }

    // Create new user
    const newUser = new AdminModel({
      _id: new mongoose.Types.ObjectId(),
      fullName,
      email,
      password: finalPassword, // Store hashed password
      role: role || "user",
      createdAt: new Date(),
    });

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "User created successfully!" });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(301).send({ message: "Missing inputs.", success: false });
      return;
    }

    const user = await AdminModel.findOne({ email: email })
      .select("_id role password access")
      .lean();
    if (!user) {
      res.status(404).send({ message: "User not found.", success: false });
      return;
    }
    const decryptedPassword = decrypt(password);
    // compare password
    const isPasswordMatch = await bcrypt.compare(
      decryptedPassword,
      user.password
    );
    console.log(decryptedPassword, user, isPasswordMatch);
    if (!isPasswordMatch) {
      res
        .status(404)
        .send({ message: "Invalid email or password.", success: false });
      return;
    }

    const uuid = uuidv4();

    // generate token
    const token = signJwt({
      user: user._id.toString(),
      uuid: uuid,
      role: user?.role || "admin",
    });

    const d = await AdminModel.updateOne(
      {
        _id: user?._id.toString(),
      },
      {
        $set: {
          cookie: token,
          lastLoggedIn: new Date(),
        },
      }
    );

    res.cookie("accessToken", token, {
      maxAge: 2.592e9, // 30 days
      httpOnly: true, // More secure (set to false only for testing)
      secure: false, // ✅ Set `false` in localhost, `true` in production
      sameSite: "Lax", // ✅ Allows cross-origin cookies in localhost
    });

    res
      .status(200)
      .send({ message: "LoggedIn successful.", success: true, data: user });
  } catch (error) {
    res.status(404).send({ message: error.message, success: false });
    return;
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("accessToken", "", {
      maxAge: 3.154e10,
      httpOnly: true,
      expires: new Date(0),
    });

    const user = await AdminModel.updateOne(
      {
        _id: req?.context?.user,
      },
      {
        $set: {
          lastLoggedOut: new Date(),
          cookie: "",
        },
      }
    );
    console.log(req?.context);
    res.status(200).send({
      message: "User logged out.",
      success: true,
    });
    return;
  } catch (error) {
    res.status(300).send({
      message: error.message,
      success: false,
    });
    return;
  }
};

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { fullName } = req.body;

      // Function to create directories if they don't exist
      const createDirectories = (dirPath) => {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      };

      try {
        const teamImageFolder = path.join("uploads", "userImage", fullName);
        createDirectories(teamImageFolder); // Ensure the directory exists
        cb(null, teamImageFolder); // Set the destination folder
      } catch (error) {
        cb(new Error("Failed to create directories")); // Handle directory creation errors
      }
    },
    filename: (req, file, cb) => {
      const { fullName } = req.body;
      const profileDir = path.join("uploads", "userImage", fullName);

      // Remove existing files in the directory
      fs.readdir(profileDir, (err, files) => {
        if (!err && files.length > 0) {
          files.forEach((existingFile) => {
            const filePath = path.join(profileDir, existingFile);
            fs.unlinkSync(filePath); // Delete old files
          });
        }

        // Generate a new file name
        const fileName = `${fullName.replace(/\s+/g, "-")}${path.extname(
          file.originalname
        )}`;
        cb(null, fileName); // Set the new file name
      });
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific image formats
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, and .jpeg formats are allowed!")); // Reject unsupported formats
    }
  },
}).single("userProfilePic"); // Accept a single file with the field name "userProfilePic"

export const updateProfileDetails = async (req, res) => {
  imageUpload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload error",
        });
      }

      // Check access token
      const { fullName, whatsapp, mobile } = req.body;

      // Validate required fields
      if (!fullName || !whatsapp) {
        return res.status(400).json({
          success: false,
          message: "Full name and WhatsApp number are required",
        });
      }

      // Handle uploaded file
      let imagePath;
      if (req.file) {
        imagePath = req.file.path; // Get the path of the uploaded file
      }

      // Update user profile details
      const user = await AdminModel.findByIdAndUpdate(
        req.context.user,
        {
          fullName,
          mobile,
          whatsapp,
          ...(imagePath && { userProfilePic: imagePath }), // Conditionally update profile picture
        },
        { new: true } // Return the updated document
      );

      // Handle user not found
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Success response
      return res.status(200).json({
        success: true,
        message: "Profile details updated successfully",
        data: user, // Return the updated user data
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        success: false,
        message: error.message || "An unknown error occurred",
      });
    }
  });
};
