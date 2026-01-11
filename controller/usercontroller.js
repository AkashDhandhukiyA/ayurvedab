const { check, validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcryptjs");

// ✅ REGISTRATION CONTROLLER (no session)
exports.postregistration = [
  // Validation rules
  check("firstname")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("First name can only contain letters"),

  check("lastname")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Last name can only contain letters"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must include a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must include an uppercase letter")
    .matches(/[!@#$%^&*(),.?\":{}|<>]/)
    .withMessage("Password must include a special character"),

  check("confirmpassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("userType")
    .notEmpty()
    .withMessage("reqired the userType")
    .isIn(["User", "Admin"])
    .withMessage("invalid user type"),
  // Controller logic
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        isLoggedIn: false,
        errors: errors.array(),
      });
    }

    try {
      const { firstname, lastname, email, password, userType } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ email, userType });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered" });
      }

      // Hash password and save
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        userType,
      });

      const result = await user.save();

      console.log("User registered:", email);

      // ❌ No session created here
      res.status(201).json({
        success: true,
        message: "Registration successful, please login",
        user: result,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error during registration" });
    }
  },
];
// // ✅ LOGIN CONTROLLER (session stored correctly)
// exports.postlogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid password" });
//     }

//     // 🔐 Store only userId in session
//     req.session.isLoggedIn = true;
//     req.session.userId = user._id;

//     await req.session.save();

//     res.json({
//       success: true,
//       message: "Login successful",
//       user: {
//         _id: user._id,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         email: user.email,
//       }
//     });

//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
exports.postlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });

    req.session.isLoggedIn = true;
    req.session.userId = user._id; // ✔ Correct

    await req.session.save();

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.checkauth = async (req, res, next) => {
  try {
    if (req.session.userId) {
      return res.json({ isLoggedIn: true });
    } else {
      return res.json({ isLoggedIn: false });
    }
  } catch (error) {
    res.json({ error: error });
  }
};

//logout
exports.postlogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // 🧹 clear browser cookie
    return res.json({ success: true, message: "Logged out successfully" });
  });
};
