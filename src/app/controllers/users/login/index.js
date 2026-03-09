const jwt = require("jsonwebtoken");
const fetchUser = require("~root/actions/users/fetchUser");

const login = async (req, res) => {
  const { email, password } = req.body;

  // Email ve password boş mu kontrolü
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  // password güvenlik kontrolü
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include letters, numbers and a special character"
    });
  }

  const { user } = await fetchUser({ email, password });

  if (user) {
    const accessToken = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: "365d"
    });

    return res.json({
      message: "Login successful",
      accessToken
    });
  } else {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }
};

module.exports = login;
