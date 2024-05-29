import Register from "../pages/restaurant/auth/Register";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "../pages/restaurant/auth/Login";
import Menu from "../pages/restaurant/dashboard/Menu";
import Orders from "../pages/restaurant/dashboard/Orders";
import Chat from '../pages/customer/Chat';
import Stats from '../pages/restaurant/dashboard/Stats';
import Extras from '../pages/restaurant/dashboard/Extras';
import Categories from '../pages/restaurant/dashboard/Categories';
import Products from '../pages/restaurant/dashboard/Products';
import Restaurant from '../pages/restaurant/new/Restaurant';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={"/restaurant/register"} />} />
          <Route path="/restaurant/login" element={<Login />} />
          <Route path="/restaurant/register" element={<Register />} />
          <Route path="/restaurant/stats" element={<Stats />} />
          <Route path="/restaurant/categories" element={<Categories />} />
          <Route path="/restaurant/extras" element={<Extras />} />
          <Route path="/restaurant/menu" element={<Menu />} />
          <Route path="/restaurant/orders" element={<Orders />} />
          <Route path="/restaurant/products/:categoryId" element={<Products />} />
          <Route path="/restaurant/chat" element={<Chat />} />
          <Route path="/restaurant/create" element={<Restaurant />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
