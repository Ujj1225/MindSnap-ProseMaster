import { useState } from "react";

import axios from "axios";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [mnemonics, setMnemonics] = useState("");

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleApiReq = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1", {
        prompt: inputText,
      });
      const { data } = response;
      const { summary, keywords, howToRemember } = data;

      setSummarizedText(summary);
      setKeyword(keywords);
      setMnemonics(howToRemember);
    } catch (error) {
      console.log(`Error getting response from api ${error.message}`);
    }
  };

  return (
    <>
      <h1>MindSnap ProseMaster</h1>
      <textarea
        placeholder="Enter the text you wish to learn!"
        value={inputText}
        onChange={handleInputChange}
        cols="30"
        rows="10"
      />
      <button onClick={handleApiReq}>Get Insights!</button>
      <div className="summary">
        <h2>Summarized Text</h2>
        <div className="container">{summarizedText}</div>
      </div>
      <div className="keywords">
        <h2>Relevant Keywords</h2>
        <div className="container">{}</div>
      </div>
      <div className="toLearn">
        <h2>Trick To Remember</h2>
        <div className="container">{mnemonics}</div>
      </div>
    </>
  );
};

export default App;
