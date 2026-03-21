const createUser = require("~root/actions/users/createUser");
const handleAPIError = require("~root/utils/handleAPIError");
const postUserSchema = require("./schemas/postUserSchema");
const checkShortcode = require("./schemas/queries/checkShortcode");
const deleteShortcode = require("./schemas/queries/deleteShortcode");

const postUser = async (req, res) => {
  const { firstName, lastName, email, password, shortcode } = req.body;

  try {
    await postUserSchema.validate(
      {
        firstName,
        lastName,
        email,
        password,
        shortcode
      },
      {
        abortEarly: false
      }
    );

    const isValidShortcode = await checkShortcode({ email, shortcode });

    if (!isValidShortcode) {
      return res.status(400).send({
        message: "Invalid or expired shortcode"
      });
    }

    const { user } = await createUser({
      firstName,
      lastName,
      email,
      password
    });

    await deleteShortcode({ email, shortcode });

    return res.status(201).send({
      user
    });
  } catch (err) {
    return handleAPIError(res, err);
  }
};

module.exports = postUser;
