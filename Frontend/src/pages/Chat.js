import "./chat.css";
import { useState, useEffect, useRef } from "react";

function Chat() {
  const chatRef = useRef();

  const [viewOffers, setViewOffers] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    chatRef.current.focus();
  }, [text]);

  const handleSubmit = () => {
    if (text) {
      setMessages([
        {
          body: text,
          from: "user",
        },
        ...messages,
      ]);
      setText("");
    }
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter" && text) {
      handleSubmit();
    }
  };

  return (
    <>
      <section className="chat-section">
        <div className="nav">
          <div className="restaurant">
            <div className="logo">
              <img src={require("../images/logo.png")} alt="LOGO" />
            </div>
            <div className="res_name">
              <h2>Food</h2>
            </div>
          </div>
          <div className="offers">
            <img
              src={require("../images/offers.png")}
              alt=""
              onClick={() => setViewOffers(true)}
            />
          </div>
        </div>
        <div className="msgs">
          {messages.map(function(message) {
            return <Message {...message}></Message>;
          })}
          <div className="msg bot">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Voluptates quos exercitationem cumque quidem, ipsa est tempore,
              ratione reprehenderit, nesciunt eaque autem magni unde laudantium
              voluptatum dolores quisquam. Hic, quaerat neque.
            </p>
            <img src={require("../images/example-1.jpeg")} alt="" />
          </div>
        </div>
        <div className="inputbox">
          <div className="form">
            <input
              type="text"
              ref={chatRef}
              value={text}
              onKeyDown={handleKeypress}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </section>
      <div className={viewOffers ? "shown" : "hidden"}>
        <div className="content">
          <img
            className="exit"
            src={require("../images/exit.png")}
            onClick={() => setViewOffers(false)}
            alt=""
          />
          <div className="content-center">
            <h2>OFFERS</h2>
            <div className="imgs">
              <img src={require("../images/offer-1.png")} alt="" />
              <img src={require("../images/offer-2.png")} alt="" />
              <img src={require("../images/offer-3.png")} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Message = ({ body, from }) => {
  return (
    <div className={"msg " + from}>
      <p>{body}</p>
    </div>
  );
};

export default Chat;
