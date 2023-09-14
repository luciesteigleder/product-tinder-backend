import { body, validationResult } from "express-validator";
import multer from "multer";

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const validateProvData = [
  body("prov_name")
    .trim()
    .notEmpty()
    .withMessage("Provider name is required")
    .escape(),
  body("prov_address")
    .trim()
    .notEmpty()
    .withMessage("Provider address is required")
    .escape(),
  body("prov_phone")
    .trim()
    .notEmpty()
    .withMessage("Provider phone is required")
    .escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .escape(),
  // body("picture").custom((value, { req }) => {
  //   if (!req.file) {
  //     throw new Error("Picture is required");
  //   }
  //   // You can add additional validation for the file type, size, etc.
  //   if (!req.file.mimetype.startsWith("image")) {
  //     throw new Error("Picture must be an image");
  //   }
  //   return true;
  // }),
  body("language")
    .trim()
    .notEmpty()
    .withMessage("Language is required")
    .escape(),
  body("tags").isArray({ min: 1 }).withMessage("At least one tag is required"),
  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one category is required"),
];

const validateShopData = [
  body("shop_name")
    .trim()
    .notEmpty()
    .withMessage("Shop name is required")
    .escape(),
  body("shop_address")
    .trim()
    .notEmpty()
    .withMessage("Shop address is required")
    .escape(),
  body("shop_phone")
    .trim()
    .notEmpty()
    .withMessage("Shop phone is required")
    .escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .escape(),
  // body("picture").custom((value, { req }) => {
  //   if (!req.file) {
  //     throw new Error("Picture is required");
  //   }
  //   // You can add additional validation for the file type, size, etc.
  //   if (!req.file.mimetype.startsWith("image")) {
  //     throw new Error("Picture must be an image");
  //   }
  //   return true;
  // }),
  body("language")
    .trim()
    .notEmpty()
    .withMessage("Language is required")
    .escape(),
  body("tags").isArray({ min: 1 }).withMessage("At least one tag is required"),
  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one category is required"),
];

const validateDataForPut = [
  body("prov_name").optional().trim().escape(),
  body("prov_address").optional().trim().escape(),
  body("prov_phone").optional().trim().escape(),
  body("description").optional().trim().escape(),
  // body("picture").optional().custom((value, { req }) => {
  //   if (!req.file) {
  //     return true; // Allow empty picture field
  //   }
  //   if (!req.file.mimetype.startsWith("image")) {
  //     throw new Error("Picture must be an image");
  //   }
  //   return true;
  // }),
  body("language").optional().trim().escape(),
  body("tag_name").optional().trim().escape(),
  body("categories").optional().isArray({ min: 1 }),
];

const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    // )
    // .withMessage(
    //   "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    // )
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .escape(),
];

const validateChangePW = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .escape(),
];

export {
  validateProvData,
  validateShopData,
  validateDataForPut,
  validateSignUp,
  validateLogin,
  validateChangePW,
  upload,
};
