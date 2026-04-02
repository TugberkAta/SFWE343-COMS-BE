module.exports = async (req, res) => {
  const { email, password } = req.body;

  if (email === "bahriyetest1@test.com" && password === "sifre123") {
    return res.status(200).json({
      user: { email },
      accessToken: "fake-token"
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
};
