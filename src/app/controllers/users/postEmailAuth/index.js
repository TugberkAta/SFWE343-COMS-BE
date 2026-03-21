const handleAPIError = require("~root/utils/handleAPIError");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const postEmailAuth = require("./schemas/postEmailAuth");
const postEmailAuthQuery = require("./schemas/queries/postEmailAuth");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const postEmailAuthHandler = async (req, res) => {
  const { email } = req.body;

  try {
    await postEmailAuth.validate(
      {
        email
      },
      {
        abortEarly: false
      }
    );

    const shortcode = uuidv4()
      .replace(/-/g, "")
      .slice(0, 8);

    const redirectUrl = `http://localhost:3000/sign-in?shortcode=${shortcode}`;

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Sign in</h2>
        <p>Press the button below to sign in:</p>
        <a
          href="${redirectUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Press here to sign in
        </a>
      </div>
    `;

    await postEmailAuthQuery({
      email,
      shortcode
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Sign in",
      html: emailTemplate
    });

    return res.status(201).send({
      message: "E-mail has been sent successfully"
    });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = postEmailAuthHandler;
