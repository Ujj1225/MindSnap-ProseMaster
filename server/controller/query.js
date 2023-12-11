// Function to determine prompt
const determinePromptType = (prompt) => {
  const questionKeywords = ["what", "why", "how", "when", "where", "who"];
  const promptLowerCase = prompt.toLowerCase();

  if (
    prompt.length < 100 &&
    questionKeywords.some((keyword) => promptLowerCase.includes(keyword))
  ) {
    console.log("question");
    return "question";
  } else {
    console.log("long_text");
    return "long_text";
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
  // console.log(prompt);
  try {
    if (prompt == null) {
      throw new Error("No prompt was provided!");
    }

    const prompt_type = determinePromptType(prompt);

    if (prompt_type === "question") {
      console.log("Please enter a long text!");
      return res.status(200).json({
        success: true,
        message: "Please provide us a text you want to understand!",
      });
    }

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ];

    // Taking multiple requests in parallel
    const [summarizeResponse, keywordResponse, mnemonicsResponse] =
      await Promise.all([
        openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            ...messages,
            {
              role: "assistant",
              content: "Summarize the text in layman's terms with example",
            },
          ],
        }),
        openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            ...messages,
            {
              role: "assistant",
              content:
                "From the text, extract important words that we should remember and provide it in bullet forms in new line!",
            },
          ],
        }),
        openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            ...messages,
            {
              role: "assistant",
              content:
                "Provide mnemonics or make a story out of this text so that it can be easily remembered. Remember to keep it simple and in a way that it can easily be remembered by everyone",
            },
          ],
        }),
      ]);

    const summarizeCompletion = summarizeResponse.choices[0].message.content;
    const keywordCompletion = keywordResponse.choices[0].message.content;
    const mnemonicsCompletion = mnemonicsResponse.choices[0].message.content;

    // return the results
    return res.status(200).json({
      success: true,
      summary: summarizeCompletion,
      keywords: keywordCompletion,
      howToRemember: mnemonicsCompletion,
    });
  } catch (error) {
    console.log("got here!");
    console.log(error.message);
  }
};

module.exports = { query };
