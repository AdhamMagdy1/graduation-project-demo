const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Model definitions

const Customer = sequelize.define(
  'Customer',
  {
    customerId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Address = sequelize.define(
  'Address',
  {
    addressID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Area: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    streetNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    buildingNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    flatNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    extraDescription: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const waitingOrder = sequelize.define(
  'waitingOrder',
  {
    waitId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    OrderTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Restaurant = sequelize.define(
  'Restaurant',
  {
    restaurantId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Product = sequelize.define(
  'Product',
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Extra = sequelize.define(
  'Extra',
  {
    extraId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Product_ingredient = sequelize.define('Product_ingredient', {});

const Customer_phoneNumber = sequelize.define(
  'Customer_phoneNumber',
  {
    phoneNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Resturant_deliveryAreas = sequelize.define(
  'Resturant_deliveryAreas',
  {
    deliveryAreasid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Resturant_worker = sequelize.define(
  'Resturant_worker',
  {
    workerid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Order = sequelize.define(
  'Order',
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deliveyCost: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    OrderTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const OrderItem = sequelize.define(
  'OrderItem',
  {
    orderItemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const itemExtra = sequelize.define(
  'itemExtra',
  {},
  { timestamps: false, freezeTableName: true }
);

const productExtra = sequelize.define('productExtra', {});

// Associations

Customer.hasMany(Address, { foreignKey: 'customerId', as: 'Addresses' });
Address.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });

Customer.hasMany(waitingOrder, {
  foreignKey: 'customerId',
  as: 'WaitingOrders',
});
waitingOrder.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });

Customer.hasMany(Customer_phoneNumber, {
  foreignKey: 'customerId',
  as: 'PhoneNumbers',
});
Customer_phoneNumber.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

Restaurant.hasMany(Product, { foreignKey: 'restaurantId', as: 'Products' });
Product.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'Restaurant' });

Restaurant.hasMany(Resturant_deliveryAreas, {
  foreignKey: 'restaurantId',
  as: 'DeliveryAreas',
});
Resturant_deliveryAreas.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
  as: 'Restaurant',
});

Restaurant.hasMany(Resturant_worker, {
  foreignKey: 'restaurantId',
  as: 'Workers',
});
Resturant_worker.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
  as: 'Restaurant',
});

Product.hasMany(Product_ingredient, {
  foreignKey: 'productId',
  as: 'Ingredients',
});
Product_ingredient.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'Product',
});

Product.hasMany(productExtra, { foreignKey: 'productId', as: 'Extras' });
productExtra.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'ProductExtra',
});

Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'Order' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'Restaurant' });

Address.hasMany(Order, { foreignKey: 'addressID', as: 'Order' });
Order.belongsTo(Address, { foreignKey: 'addressID', as: 'Address' });

Customer.hasMany(Order, { foreignKey: 'customerId', as: 'Order' });
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'OrderItem' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });

waitingOrder.hasMany(OrderItem, { foreignKey: 'waitId', as: 'OrderItem' });
OrderItem.belongsTo(waitingOrder, { foreignKey: 'waitId', as: 'waitingOrder' });

waitingOrder.hasMany(OrderItem, { foreignKey: 'waitId', as: 'OrderItem' });
itemExtra.belongsTo(Extra, { foreignKey: 'extraId', as: 'Extra' });
waitingOrder.hasMany(OrderItem, { foreignKey: 'waitId', as: 'OrderItem' });
itemExtra.belongsTo(OrderItem, { foreignKey: 'orderItemId', as: 'OrderItem' });

Extra.belongsToMany(Product, {
  through: productExtra,
  foreignKey: 'extraId',
  as: 'Products',
});
Extra.belongsToMany(OrderItem, {
  through: itemExtra,
  foreignKey: 'extraId',
  as: 'OrderItems',
});
// Export models

module.exports = {
  Customer,
  Address,
  waitingOrder,
  Restaurant,
  Product,
  Extra,
  Product_ingredient,
  Customer_phoneNumber,
  Resturant_deliveryAreas,
  Resturant_worker,
  Order,
  OrderItem,
  itemExtra,
  productExtra,
};
