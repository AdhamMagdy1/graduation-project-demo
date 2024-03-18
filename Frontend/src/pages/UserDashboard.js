import "./userdash.css";
import { useState } from "react";

const UserDashboard = () => {
  let initialOrders = [
    {
      id: 1,
      username: "Manar1313",
      body:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae velit inventore omnis, quo quisquam harum.",
      done: false,
    },
    {
      id: 2,
      username: "Rajab16",
      body:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae velit inventore omnis, quo quisquam harum.",
      done: false,
    },
    {
      id: 3,
      username: "Doha18",
      body:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae velit inventore omnis, quo quisquam harum.",
      done: false,
    },
    {
      id: 4,
      username: "Zyad8",
      body:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae velit inventore omnis, quo quisquam harum.",
      done: false,
    },
  ];

  const [orders, setOrders] = useState(initialOrders);

  return (
    <section className="user-dashboard">
      <div className="nav">
        <div className="restaurant">
          <div className="logo">
            <img src={require("../images/logo.png")} alt="LOGO" />
          </div>
          <div className="res_name">
            <h2>Food</h2>
          </div>
        </div>
      </div>
      <div className="orders">
        <h2>ORDERS</h2>
        {orders.map(function(order, index) {
          return (
            <div className="order" key={index}>
              <h3 className="username">{order.username}</h3>
              <p className="content">{order.body}</p>
              <button
                onClick={(e) => {
                  order.done = true;
                  setOrders([...orders]);
                }}
                disabled={order.done}
              >
                Done
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UserDashboard;
