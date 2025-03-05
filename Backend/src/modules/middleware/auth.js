// import UserModel from "../../model/NewModel/userModel.js";
import { verifyJwt } from "../../utils/auth.js";
import AdminModel from "../adminUser/schema/admin-user.schema.js";

export const isAuth = async (req, res, next) => {
  try {
    if (!req?.context?.user && !req?.context?.admin) {
      res.status(401).json({
        message: "Please Logged in",
        success: false,
      });
      return;
    }
    next();
  } catch (error) {
    res.status(error.status).json({
      message: error.message,
    });
    return;
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    let context = {
      user: undefined,
      role: undefined,
    };
    if (!req?.context?.user) {
      res.status(401).json({
        message: "Please Logged in",
        success: false,
      });
      return;
    }
    const admin = await AdminModel.findById(req.context.user)
      .select("_id role cookie access")
      .lean();

    const decodeToken = verifyJwt(admin?.cookie);

    if (decodeToken?.uuid !== req.context?.uuid) {
      res.status(201).send({ message: "Please loggedIn.", success: false });
      return;
    }

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
        success: false,
      });
    }

    context = {
      user: admin?._id,
      role: admin?.role,
    };

    req.context = context;
    next();
  } catch (error) {
    res.status(error.status).json({
      message: error.message,
    });
    return;
  }
};

export const setContext = async (req, res, next) => {
  try {
    let context = {
      user: undefined,
      role: undefined,
    };
    if (req?.cookies.accessToken) {
      const user = verifyJwt(req.cookies.accessToken);
      context.user = user?.user;
      context.role = user?.role;
    }

    req.context = context;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
