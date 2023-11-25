const Manager = require("../model/manager");
const Staff = require("../model/staff");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const signin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if(!email||!password || !role){
      return res.status(401).json({error:true,
      message:"fill all the details"
    })
    }

    const existingUser = await User.findOne({ email, role });
    console.log(existingUser);
    if (!existingUser) {
      return res.status(400).json({
        error: true,
        message: "User not exists",
      });
    }

    // Check if the password is correct
    const isPasswordCorrect = existingUser.password === password;
    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: true,
        message: "Invalid password",
      });
    }

    // Generate a token
    const token = jwt.sign(
      {
        _id: existingUser._id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // Return the response
    return res.status(200).json({
      error: false,
      data: {
        token,
        user: existingUser,
      },
      message: "User member signed in successfully",
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = { signin };
