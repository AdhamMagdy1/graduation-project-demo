/* eslint-disable react/prop-types */
import { nanoid } from 'nanoid';
import { useState, useEffect, useRef } from 'react';
// import logo from '../images/logo.png';
import io from 'socket.io-client';
import Values from "values.js";
import { useGlobalContext } from '../restaurant/dashboard/context';
import extractedData from '../restaurant/new/extractedData.json';
import { GoogleLogin } from '@react-oauth/google';
import { isAuthenticated } from '../../src/hooks/auth';
import { FaTimes } from 'react-icons/fa';


const socket = io('http://localhost:5000/chat');

const Chat = () => {

  const {
    isFirstModalOpen,
    openFirstModal,
    closeFirstModal,
    isSecondModalOpen,
    openSecondModal,
    closeSecondModal,
    isThirdModalOpen,
    openThirdModal,
    closeThirdModal,
  } = useGlobalContext();

  //auth states:
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrMsg('');
  }, [success]);

  const responseMessage = (response) => {
    setIsloading(true);
    fetch('http://localhost:5000/customer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${response.credential}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          window.localStorage.setItem('user', JSON.stringify(data.customer));
          window.localStorage.setItem('customerToken', data.token);
          localStorage.setItem('isCustomerLogged', true);
          setIsloading(false);
          setSuccess(true);
          closeFirstModal();
          openSecondModal();
        } else {
          setErrMsg('Login failed. Please try again.');
          localStorage.setItem('isCustomerLogged', false);
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        setErrMsg('Login failed. Please try again.');
        localStorage.setItem('isCustomerLogged', false);

      });
  };

  const errorMessage = (error) => {
    console.error('Google login error:', error);
    setErrMsg('Login failed. Please try again.');
  };

  //address states:
  const URL = import.meta.env.VITE_REACT_API_URL;
  const [isloading, setIsloading] = useState(false);

  const cities = extractedData;
  const [selectedCity, setSelectedCity] = useState('');
  const [areas, setAraes] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');

  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');

  const changeCity = (e) => {
    setSelectedCity(e.target.value);
    setAraes(cities.find((city) => city.code === e.target.value).cityDataModels);
  };

  const changeArea = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    const body = { addressDescription: `${building} ${street} str, apartment ${apartment}, ${selectedArea}, ${selectedCity} ` };
    // console.log(body);
    setIsloading(true);
    try {
      const resp = await fetch(`${URL}/customer/createAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('customerToken'),
        },
        body: JSON.stringify(body),
      });
      if (resp.ok) {
        setIsloading(false);
        const customerData = await resp.json();
        localStorage.setItem('addressId', customerData.address.addressId);
        localStorage.setItem('customerId', customerData.address.customerId);
        closeSecondModal();
        chatRef.current.focus();
      } else {
        setIsloading(false);
        console.log(resp.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const chatRef = useRef();

  const [messages, setMessages] = useState([]);
  const [isImage, setIsImage] = useState(false);
  const [images, setImages] = useState([]);
  const [text, setText] = useState('');

  const customerId = localStorage.getItem('customerId');
  const addressId = localStorage.getItem('addressId');

  useEffect(() => {
    chatRef.current.focus();

    socket.on('message', (message, isImage, menuData) => {

      // for RASA messages
      if (!isImage) {
        setMessages((messages) => [
          {
            body: message,
            from: 'bot',
          },
          ...messages,
        ]);
      } else if (isImage, menuData.length > 0) {
        setIsImage(true);
        setImages(menuData);
        console.log(menuData);

        setMessages((messages) => [
          {
            body: message,
            from: 'bot',
          },
          ...messages,
        ]);
        // handle menu images convertion here
        // menuData is an array of objects each object has a key of menuImage and value of String
      }
    });
    return () => {
      socket.off('message');
    };
  }, [text]);

  const handleSubmit = () => {
    if (text) {
      const communicatedMessage = {
        sender: customerId,
        message: text,
        metadata: { restaurant_id: restaurantId, customer_id: customerId, address_id: addressId, socket_id: socket.id }
      };
      socket.emit('message', communicatedMessage);
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

  //customization:
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('');
  const [name, setName] = useState('');
  // accessing the restaurantId:
  const restaurantId = (new URLSearchParams(window.location.search)).get("restaurantId");
  // console.log(restaurantId);
  const getRestaurant = async () => {
    try {
      const resp = await fetch(`${URL}/restaurant/customize/${restaurantId}/`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (resp.status === 200) {
        const resData = await resp.json();
        console.log('Response Data:', resData);

        if (resData && resData.restaurant) {
          const restaurant = resData.restaurant;
          console.log('Restaurant Data:', restaurant);

          setLogo(restaurant.logo);
          setColor(restaurant.themeColor);
          setName(restaurant.name);

          console.log('Theme Color:', restaurant.themeColor);
        } else {
          console.log('No restaurant data found in response.');
        } if (resp.status === 304) {
          console.log('Resource not modified since the last request.');
          // Handle 304 case if necessary
        }
      } else {
        console.log('Fetch failed with status:', resp.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRestaurant();
    isAuthenticated() ? openSecondModal() : openFirstModal();
  }, []);


  return (
    <>
      <section className='chat-section'
        style={{
          backgroundImage: `linear-gradient(120deg,${color}, rgb(241, 247, 248) 70%)`
        }}
      >
        <div className='chat-nav'>
          <div className='restaurant'>
            <div style={{ marginTop: '0px' }} className='logo'>
              <img
                src={`data:image/png;base64,${logo.replace(/^\\x/, '')}`}
                alt='LOGO'
              />
            </div>
            <div className='res-name'>
              <h4>{name}</h4>
            </div>
          </div>
        </div>
        <div className="chat">
          <div className='msgs'>
            {messages.map(function (message) {
              return <Message
                key={nanoid()}
                {...message}
                color={color}
                isImage={isImage}
                images={images}
                openModal={openThirdModal}
                isModalOpen={isThirdModalOpen}
                closeModal={closeThirdModal}  ></Message>;
            })}
          </div>
          <div className='inputbox'>
            <div className='chat-form'>
              <input
                type='text'
                style={{ caretColor: `${color}` }}
                ref={chatRef}
                value={text}
                onKeyDown={handleKeypress}
                onChange={(e) => setText(e.target.value)}
              />
              <button onClick={handleSubmit}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill={color} d="m476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52A24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4a24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className={isFirstModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
        <div className="form-holder">
          {
            isloading &&
            <div style={{ height: '100%' }} className="overlay"></div>
          }
          <p className={errMsg ? 'errMsg' : 'offscreen'} aria-live="assertive">
            {errMsg}
          </p>
          <h2 className="modal-heading">login</h2>
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
      </div>

      <div className={isSecondModalOpen ? "modal-overlay show-modal" : "modal-overlay"}>
        <div className="form-holder">
          {
            isloading &&
            <div className="overlay"></div>
          }
          <form onSubmit={handleSubmitAddress} className='address-form'>
            {/* city */}
            <div className="input-holder">
              <label>city <span style={{ color: 'red' }} >*</span></label>
              <select required className='input-block' value={selectedCity} onChange={changeCity} >
                <option hidden>Select a city</option>
                {
                  cities.map((city) => {
                    return <option value={city.code} key={nanoid()}>{city.code}</option>;

                  })
                }
              </select>
            </div>

            {/* Area */}
            <div className="input-holder">
              <label>area <span style={{ color: 'red' }} >*</span> </label>
              <select required className='input-block' value={selectedArea} onChange={changeArea}>
                <option hidden>Select an area</option>
                {
                  areas.map((area) => {
                    return <option value={area.namePrimaryLang} key={area.id}>
                      {area.namePrimaryLang}
                    </option>;
                  })
                }
              </select>
            </div>

            {/* street */}
            <div className="input-holder">
              <label>street name <span style={{ color: 'red' }} >*</span></label>
              <input
                style={{ caretColor: '#f49191' }}
                className='input-block'
                type="text"
                placeholder='Street name'
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>

            {/* buliding */}
            <div className="input-holder">
              <label>buliding name/number</label>
              <input
                style={{ caretColor: '#f49191' }}
                className='input-block'
                type="text"
                placeholder='Builing name/number'
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              />
            </div>

            {/* apartment */}
            <div className="input-holder">
              <label>apartment number</label>
              <input
                style={{ caretColor: '#f49191' }}
                className='input-block'
                type="text"
                placeholder='Apartment number'
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
              />
            </div>

            <button className='address-btn' type='submit' style={{ backgroundColor: `${color}` }} >done</button>
          </form>
        </div>
      </div>

    </>
  );
};

const Message = ({ body, from, color, isImage, images, openModal, closeModal, isModalOpen }) => {

  const colors = new Values(`${color}`).all(10);

  return (
    <>
      <div
        style={from === 'bot' ? { backgroundColor: 'white' } : { backgroundColor: `rgb(${colors[5].rgb[0]},${colors[5].rgb[1]},${colors[5].rgb[2]})` }}
        className={'msg ' + from}
      >
        {
          isImage && (
            images.map((image) => {
              return <div key={nanoid()}>
                <button style={{ cursor: 'pointer' }} onClick={openModal} >
                  <img
                    src={`data:image /png;base64,${image.menuImage.replace(/^\\x/, '')}`}
                    alt={`menu image`}
                    style={{ width: '200px', height: '200px' }}
                  />
                </button>
                <div className={isModalOpen ? "modal-overlay show-modal" : "modal-overlay"} >
                  <img style={{ width: '500px', height: '500px' }} src={`data:image /png;base64,${image.menuImage.replace(/^\\x/, '')}`} alt={`menu image`} />
                  <FaTimes onClick={closeModal} />
                </div>
              </div>;
            })
          )
        }
        <p>{body}</p>
      </div>


    </>
  );
};

export default Chat;
