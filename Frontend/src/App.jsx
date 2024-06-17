import Register from '../pages/restaurant/auth/Register';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/restaurant/auth/Login';
import Orders from '../pages/restaurant/dashboard/Orders';
import Stats from '../pages/restaurant/dashboard/Stats';
import Menu from '../pages/restaurant/dashboard/adds/Menu';
import Extras from '../pages/restaurant/dashboard/adds/Extras';
import Categories from '../pages/restaurant/dashboard/adds/Categories';
import Products from '../pages/restaurant/dashboard/adds/Products';
import Restaurant from '../pages/restaurant/new/Restaurant';
import Menus from '../pages/restaurant/new/Menus';
import SetRestaurant from '../pages/restaurant/dashboard/settings/SetRestaurant';
import SetEmployee from '../pages/restaurant/dashboard/settings/SetEmployee';
import SetProfile from '../pages/restaurant/dashboard/settings/SetProfile';
import Chat from '../pages/customer/Chat';
import Address from '../pages/customer/Address';
import UsrLogin from '../pages/customer/auth/UserLogin';
import { isAuthenticated } from './hooks/auth';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/customer/chat"
            element={isAuthenticated() ? <Chat /> : <UsrLogin />}
          />
          <Route path="/" element={<Navigate to={'/restaurant/register'} />} />
          <Route path="/restaurant/login" element={<Login />} />
          <Route path="/restaurant/register" element={<Register />} />
          <Route path="/restaurant/stats" element={<Stats />} />
          <Route path="/restaurant/categories" element={<Categories />} />
          <Route path="/restaurant/extras" element={<Extras />} />
          <Route path="/restaurant/menu" element={<Menu />} />
          <Route path="/restaurant/orders" element={<Orders />} />
          <Route
            path="/restaurant/products/category/:categoryId"
            element={<Products />}
          />
          <Route path="/restaurant/create" element={<Restaurant />} />
          <Route path="/restaurant/menus" element={<Menus />} />
          <Route path="/restaurant/edit" element={<SetRestaurant />} />
          <Route path="/restaurant/employee" element={<SetEmployee />} />
          <Route path="/restaurant/profile" element={<SetProfile />} />
          <Route path="/customer/address" element={<Address />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
