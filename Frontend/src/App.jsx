import Register from "../pages/restaurant/auth/Register";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "../pages/restaurant/auth/Login";
import Menu from "../pages/restaurant/dashboard/Menu";
import Orders from "../pages/restaurant/dashboard/Orders";
import Chat from '../pages/customer/Chat';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={"/restaurant/register"} />} />
          <Route path="/restaurant/login" element={<Login />} />
          <Route path="/restaurant/register" element={<Register />} />
          <Route path="/restaurant/menu" element={<Menu />} />
          <Route path="/restaurant/orders" element={<Orders />} />
          <Route path="/restaurant/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
