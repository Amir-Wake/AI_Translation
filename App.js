import "./normalize.css";
import "./App.css";
import { useState, useEffect,useRef } from "react";

/**
 * TODO: add awesomefont font to search bar <span>+</span>
 * TODO: add welcome message to chat log
 * TODO: add text to speech
 */

function App() {
  useEffect(() => {
    const showAlert = sessionStorage.getItem("showAlert");
    if (showAlert === null) {
      window.alert(" ئەم پڕۆژەیە تەنها پڕۆژەیەکی سەرەتایی و بۆ فێربوونە. ئێمە بەرپرسیارنین لە کاتی بوونی هەر هەڵەیەک یان زانیاریەکی نادروست. بۆ بینینی کۆدی پڕۆژەکە و سود وەرگرتن یان باشترکردنی سەردانی ئەم لینکە بکە.\n https://github.com/Amir-Wake/KurdAI "+" \n Amir.wake007@gmail.com");
      sessionStorage.setItem("showAlert", "false");
    }
  }, []);

  // Declare state variables for input, models, current model, and chat log
  const [input, setInput] = useState("");
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const messageConref=useRef(null);
  
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: " سڵاو بەخێربێیت ",
    },
  ]);
  const [chatLogTranslated, setChatLogTranslated] = useState([
    {
      user: "gpt",
      message: "",
    },
  ]);
  useEffect(()=>{
    messageConref.current?.scrollIntoView();
  },[chatLog])

  // function to fetch the list of available models from the local server
  async function translate(text, targetLang) {
    const messages = text;
    console.log("message" + messages);
  
    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textToTr: messages,
          targetLang,
          
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("data =" + data.data);
      return data.data; // return the translated text as a string
  
    } catch (error) {
      console.error(error);
      return ""; // return an empty string if there's an error
    }
  }
  
  
  // Define a function to handle the form submission
  async function handleSubmit(e) {
    e.preventDefault();
    //Handle empty input and simple text
    if(input==""||!input.trim()){
      return;
    }
    if(input=="سڵاو"||input=="سڵاو "){
      return;
    }

    // Translate the input
    const returnedText=await translate(`${input}`,"en");
    console.log("returnedtext="+returnedText);

    // Add the user's input to the chat log
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    
    // translate the input
    let chatLogNewTranslated = [...chatLogTranslated, { user: "me", message: `${returnedText}` }];

    // Clear the input field
    setInput("");
  
    // Update the chat log state
    setChatLog(chatLogNew);
    setChatLogTranslated(chatLogNewTranslated);


    // Map the chat log array to a string with newline separators
    const messages = chatLogNewTranslated.map((message) => message.message).join("\n");
    console.log("messages="+messages);
    // Send a POST request to the local server with the chat log and the current model
    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messages,
          currentModel,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Update the chat log with the response from the server
      const data = await response.json();
      const returnedTextChatGPT=await translate(`${data.message}`,"ckb");
      console.log("returnedTextChatGPT"+returnedTextChatGPT);
      setChatLogTranslated([...chatLogNewTranslated, { user: "gpt", message: `${data.message}` }]);
      setChatLog([...chatLogNew, { user: "gpt", message: `${returnedTextChatGPT}` }]);

      // Print the response
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <div className="App">
     
      <section className="chat-box">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={messageConref}/>
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)} //diff
              className="chat-input-textarea"
            ></input>
          </form>
        </div>
        <div className="sendButtonDiv">
        <button className="sendButton" onClick={handleSubmit}>ناردن</button>

        </div>
      </section>
    </div>
  );
}

// Define a functional component to render a chat message
const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
          {message.user === "gpt" && (
            <svg
              transform="scale(0.8)"
              width={41}
              height={41}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth={1.5}
              className="h-6 w-6"
            >
              <path
                d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>
        <div className="message">{message.message}</div>
      </div>
    </div>
  );
};

export default App;

/**
 * DESCRIPTION:
 * This code is a React component that allows users to chat with an OpenAI language model.
 * When the component mounts, it sends a GET request to the server to retrieve a list of available models.
 * The user can then select a model from a dropdown menu and enter a message in the chat form.
 * When the form is submitted, the component sends a POST request to the server with the chat log and
 * the selected model as the request body. The server responds with a message from the language model,
 * which is displayed to the user and added to the chat log. The component also includes a button that allows
 * the user to clear the chat log.
 */
