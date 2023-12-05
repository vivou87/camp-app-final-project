const User = require("../../models/User");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  let { userName, email, password, phone } = req.body;
  try {
    //   Verify if the email is already used
    let existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(401).json({
        status: false,
        error: "This email is already existed, please use another one",
      });
    }
    let testPassword = await password.match(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+|~-]).{8,}$/
    );
    if (!testPassword) {
      return res.status(401).json({
        status: false,
        error: `Your password must contain 8 characters with at least one uppercase character, one lowercase character and one special character (!@#$%^&*()_+|~-)`,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // CREATE NEW USER
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phone,
    });
    await newUser.save();
    res.status(200).json({
      status: true,
      message: "Your account has been created successfully",
    });
  } catch (error) {
    if (error.errors.email) {
      return res
        .status(401)
        .json({ status: false, error: error.errors.email.message });
    } else if (error.errors.password) {
      return res
        .status(401)
        .json({ status: false, error: error.errors.password.message });
    } else if (error.errors.userName) {
      return res
        .status(401)
        .json({ status: false, error: error.errors.userName.message });
    } else if (error.errors.phone) {
      return res
        .status(401)
        .json({ status: false, error: error.errors.phone.message });
    }
  }
};
