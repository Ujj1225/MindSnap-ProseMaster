// configure dotenv
require("dotenv").config();

// import modules from OpenAI library
const OpenAI = require("openai");


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const query = async (req, res) => {
  // getting prompt from request
  const prompt = req.body.prompt;
  try {
    if (prompt == null) {
      throw new Error("No prompt was provided!");
    }

    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
    });

    const completion = response.choices[0].text;

    // return the result
    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { query };
