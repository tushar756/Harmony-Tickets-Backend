const Staff = require("../model/staff");
const jwt = require("jsonwebtoken");
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the staff member with the given email already exists
    const existingStaff = await Staff.findOne({
      email,
    });
    if (!existingStaff) {
      return res.status(400).json({
        error: true,
        message: "Staff member with the given email does not exists",
      });
    }

    // Check if the password is correct
    const isPasswordCorrect =
      existingStaff.password === password ? true : false;
    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: true,
        message: "Invalid password",
      });
    }

    // Generate a token
    const token = jwt.sign(
      {
        _id: existingStaff._id,
        name: existingStaff.name,
        email: existingStaff.email,
        role: existingStaff.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Return the response
    return res.status(200).json({
      error: false,
      data: {
        token,
        staff: existingStaff,
      },
      message: "Staff member signed in successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = { signin };
