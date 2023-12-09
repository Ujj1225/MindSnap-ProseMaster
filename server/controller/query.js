// Function to determine prompt
const determinePromptType = (prompt) => {
  const questionKeywords = ["what", "why", "how", "when", "where", "who"];
  const promptLowerCase = prompt.toLowerCase();

  if (
    prompt.length > 100 ||
    questionKeywords.some((keyword) => promptLowerCase.includes(keyword))
  ) {
    return "longText";
  } else {
    return "question";
  }
};

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

    prompt_type = determinePromptType(prompt);

    if (prompt_type === "question") {
      return res.status(200).json({
        success: true,
        message: "Please provide us a text you want to understand!",
      });
    }

    const summarize_promt = `${prompt} \n Summarize the text in layman's terms with example`;
    const keyword_promt = `${prompt} \n From the text extract the most important keywords and provide meaning to them`;
    const mnemonics_promt = `${prompt} \n Provide mnemonics or make a story out of this text so that it can be easily remembered. Remember to keep it simple and in a way that it can easily be remembered by everyone`;

    // Taking multiple requests in parallel
    const [summarizeResponse, keywordResponse, mnemonicsResponse] =
      await Promise.all([
        openai.create({
          model: "text-davinci-003",
          prompt: summarize_prompt,
        }),
        openai.create({
          model: "text-davinci-003",
          prompt: keyword_prompt,
        }),
        openai.create({
          model: "text-davinci-003",
          prompt: mnemonics_prompt,
        }),
      ]);

    const summarizeCompletion = summarizeResponse.choices[0].text;
    const keywordCompletion = keywordResponse.choices[0].text;
    const mnemonicsCompletion = mnemonicsResponse.choices[0].text;

    // return the results
    return res.status(200).json({
      success: true,
      summarized_text: summarizeCompletion,
      keywords: keywordCompletion,
      howToRemember: mnemonicsCompletion,
    });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { query };
