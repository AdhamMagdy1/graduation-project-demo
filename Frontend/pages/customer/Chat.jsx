/* eslint-disable react/prop-types */
import { nanoid } from 'nanoid';
import './chat.css';
import { useState, useEffect, useRef } from 'react';
import logo from '../images/logo.png';
import exampleImage from '../images/example-1.jpeg';
import io from 'socket.io-client';



const socket = io('http://localhost:5000/chat');

const Chat = () => {
  const chatRef = useRef();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    chatRef.current.focus();

    socket.on('message', (message) => {
      // for RASA messages
      setMessages((messages) => [
        {
          body: message,
          from: 'bot',
        },
        ...messages,
      ]);
    });
    return () => {
      socket.off('message');
    };
  }, [text]);

  const handleSubmit = () => {
    if (text) {
      socket.emit('message', text);
      // for my own messages
      setMessages([
        {
          body: text,
          from: 'user',
        },
        ...messages,
      ]);

      setText('');
    }
  };

  const handleKeypress = (e) => {
    // It triggers by pressing the enter key
    if (e.key === 'Enter' && text) {
      handleSubmit();
    }
  };

  return (
    <>
      <section className='chat-section'>
        <div className='chat-nav'>
          <div className='restaurant'>
            <div className='logo'>
              <img src={logo} alt='LOGO' />
            </div>
            <div className='res_name'>
              <h2>Food</h2>
            </div>
          </div>
        </div>
        <div className="chat">
          <div className='msgs'>
            {messages.map(function (message) {
              return <Message key={nanoid()} {...message}></Message>;
            })}
            <div className='msg bot'>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Voluptates quos exercitationem cumque quidem, ipsa est tempore,
                ratione reprehenderit, nesciunt eaque autem magni unde laudantium
                voluptatum dolores quisquam. Hic, quaerat neque.
              </p>
              <img src={exampleImage} alt='' />
            </div>
          </div>
          <div className='inputbox'>
            <div className='chat-form'>
              <input
                type='text'
                ref={chatRef}
                value={text}
                onKeyDown={handleKeypress}
                onChange={(e) => setText(e.target.value)}
              />
              <button onClick={handleSubmit}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="white" d="m476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52A24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4a24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Message = ({ body, from }) => {
  return (
    <div className={'msg ' + from}>
      <p>{body}</p>
    </div>
  );
};

export default Chat;
