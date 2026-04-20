const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { email, password } = req.body;

  if (email === "bahriyetest1@test.com" && password === "sifre123") {
    const secret = process.env.JWT_SECRET || "your-secret-key-here";

    const token = jwt.sign(
      {
        userId: "1",
        email,
        userRole: "Admin"
      },
      secret,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      user: { email },
      accessToken: token
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
};
