const handleAPIError = require("~root/utils/handleAPIError");
const { v4: uuidv4 } = require("uuid");
const { Resend } = require("resend");
const postEmailAuth = require("./schemas/postEmailAuth");
const postEmailAuthQuery = require("./schemas/queries/postEmailAuth");

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
    const redirectUrl = `${appBaseUrl}/sign-in?shortcode=${shortcode}`;

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

    const payload = {
      from: process.env.RESEND_FROM_EMAIL || "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Sign in to your account",
      html: emailTemplate
    };

    if (process.env.RESEND_REPLY_TO_EMAIL) {
      payload.replyTo = process.env.RESEND_REPLY_TO_EMAIL;
    }

    const { error } = await resend.emails.send(payload);

    if (error) {
      return res.status(502).send({
        message: error.message || "Unable to send sign-in e-mail"
      });
    }

    return res.status(201).send({
      message: "E-mail has been sent successfully"
    });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = postEmailAuthHandler;
