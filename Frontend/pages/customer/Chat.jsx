/* eslint-disable react/prop-types */
import { nanoid } from 'nanoid';
import './chat.css';
import { useState, useEffect, useRef } from 'react';
import logo from '../images/logo.png';
import offersImage from '../images/offers.png';
import exampleImage from '../images/example-1.jpeg';
import exitImage from '../images/exit.png';
import offer1Image from '../images/offer-1.png';
import offer2Image from '../images/offer-2.png';
import offer3Image from '../images/offer-3.png';
import io from 'socket.io-client';



const socket = io('http://localhost:5000/chat');

const Chat = () => {
  const chatRef = useRef();

  const [viewOffers, setViewOffers] = useState(false);
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
        <div className='nav'>
          <div className='restaurant'>
            <div className='logo'>
              <img src={logo} alt='LOGO' />
            </div>
            <div className='res_name'>
              <h2>Food</h2>
            </div>
          </div>
          <div className='offers'>
            <img
              src={offersImage}
              alt=''
              onClick={() => setViewOffers(true)}
            />
          </div>
        </div>
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
            <button onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </section>
      <div className={viewOffers ? 'shown' : 'hidden'}>
        <div className='content'>
          <img
            className='exit'
            src={exitImage}
            onClick={() => setViewOffers(false)}
            alt=''
          />
          <div className='content-center'>
            <h2>OFFERS</h2>
            <div className='imgs'>
              <img src={offer1Image} alt='' />
              <img src={offer2Image} alt='' />
              <img src={offer3Image} alt='' />
            </div>
          </div>
        </div>
      </div>
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
