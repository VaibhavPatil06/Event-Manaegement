// import UserModel from "../../model/NewModel/userModel.js";
import { verifyJwt } from "../../utils/auth.js";
import AdminModel from "../adminUser/admin-user.schema.js";

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
    // check cookie is present or not
    // E= Edit || V = View || EV = Edit & View || NA = Null
    let context = {
      user: undefined,
      role: undefined,
      uuid: undefined,
    };
    console.log(req.context);
    if (!req?.context?.user) {
      res.status(401).json({
        message: "Please Logged in",
        success: false,
      });
      return;
    }
    const admin = await AdminModel.findById(req.context.user)
      .select("_id role cookie access uuid")
      .lean();
    // get token from the db decode it and compare it with uuid

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
      ac: admin?.access,
      uuid: admin?.uuid,
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
      //   productList: undefined, //
      //   promotion: undefined,
      //   gallery: undefined,
      //   customerList: undefined,
      //   emailMatrix: undefined,
      //   salesMatrix: undefined,
      //   weightList: undefined,
      //   broadcast: undefined,
      //   quote: undefined,
      //   quoteMatrix: undefined,
      //   order: undefined,
      //   job: undefined,
      //   candidate: undefined,
      // },
      uuid: undefined,
    };
    if (req?.cookies.accessToken) {
      const user = verifyJwt(req.cookies.accessToken);
      context.user = user?.user;
      context.role = user?.role;
      context.uuid = user?.uuid || "unique id";
      // context.ac = user?.ac || "";
    }

    req.context = context;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const setAccessLevel = async (req, res, next) => {
  try {
    let context = {
      ac: {
        productList: "access=E;col-price=E;col-qty=E; ", //
        promotion: "access=E;col-price=E;col-qty=E; ",
        gallery: "access=E;",
        customerList: "access=E;",
        emailMatrix: "access=E;",
        salesMatrix: "access=E;",
        weightList: "access=E;",
        broadcast: "access=E;",
        quoteTool: "access=E;",
        quoteMatrix: "access=E;",
        order: "access=E;",
        job: "access=E;",
        candidate: "access=E;",
      },
      req: req,
      res: res,
    };

    //   fetch user and get the access level from the db and set it inside of the context.
    context = {
      req: {
        ...req,
        ac: {
          prod: "yes",
        },
      },
    };

    req.context = context;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export function setAccessToken(req, res, module, key, value) {
  if (!key && !value && !module) {
    return { message: "key value not provide", success: false };
  }

  // checking module is present in the cookie or not
  if (
    Object.entries(req.context.ac).filter((tl) => tl[0] === module).length === 0
  ) {
    return { message: "Module Not Found", success: false };
  }
  const tk = req.context.ac[module]
    .split(";")
    .filter((el) => el.split("=")[0] === key);

  let ele = tk[0].split("=");

  //  checking Key or Value Present or not.
  if (tk.length === 0 || ele[0] !== key) {
    return { message: "Internal Server Error", success: false };
  }
  {
    if (value === "E") {
      if (!["E", "EV"].includes(ele[1])) {
        return {
          message: `${
            ele[1] === "E"
              ? "only Edit"
              : ele[1] === "V"
              ? "only View"
              : ele[1] === "EV"
              ? "only Edit and View"
              : "You don't have access for this module"
          }`,
          success: false,
        };
      }
    }

    if (value === "V") {
      if (!["V", "EV"].includes(ele[1])) {
        return {
          message: `${
            ele[1] === "E"
              ? "only Edit"
              : ele[1] === "V"
              ? "only View"
              : ele[1] === "EV"
              ? "only Edit and View"
              : "You don't have access for this module"
          } `,
          success: false,
        };
      }
    }

    if (!["V", "EV", "E"].includes(ele[1])) {
      return {
        message: `${
          ele[1] === "E"
            ? "only Edit"
            : ele[1] === "V"
            ? "only View"
            : ele[1] === "EV"
            ? "only Edit and View"
            : "You don't have access for this module"
        }`,
        success: false,
      };
    }
  }

  return {
    message: `Access granted to ${
      value === "E" ? "Edit" : "View"
    } the "${module}" module.`,
    success: true,
  };
}
