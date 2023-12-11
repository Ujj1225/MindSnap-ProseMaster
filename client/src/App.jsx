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

      setSummarizedText(data.summary);
      setMnemonics(data.howToRemember);
      setKeyword(data.keywords);
    } catch (error) {
      console.log(`Error getting response from API: ${error.message}`);
    }
  };

  return (
    <>
      <h1>MindSnap ProseMaster 🚀</h1>
      <div className="app-container">
        <div className="left-panel">
          <textarea
            placeholder="Enter the text you wish to learn!"
            value={inputText}
            onChange={handleInputChange}
            cols="30"
            rows="10"
          />
          <button onClick={handleApiReq} style={{ marginBottom: "0.5rem" }}>
            Get Insights!
          </button>
          <div className="text">
            {" "}
            To make the most out of this tool. Follow these steps: <br /> <br />
            1. Skim through the summarized text <br />
            2. Jot down the provided keywords <br />
            3 Read the Trick to remember part <br />
            <br />
            Have fun learning 🔥
          </div>
        </div>
        <div className="right-panel">
          <div className="box summary-box">
            <h2>Summarized Text 📖</h2>
            <div className="result-container">{summarizedText}</div>
          </div>
          <div className="box keyword-box">
            <h2>Relevant Keywords 🌍</h2>
            <div className="result-container">{keyword}</div>
          </div>
          <div className="box mnemonic-box">
            <h2>Trick To Remember 💬</h2>
            <div className="result-container">{mnemonics}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
