const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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
const Owner = sequelize.define(
  'owner',
  {
    ownerid: {
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

const Resturant = sequelize.define(
  'Resturant',
  {
    resturantId: {
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
    Subscription: {
      type: DataTypes.DATE,
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
const productExtra = sequelize.define(
  'productExtra',
  {},
  { timestamps: false, freezeTableName: true }
);
const Customer_phoneNumber = sequelize.define(
  'Customer_phoneNumber',
  {
    phoneNumber: {
      type: DataTypes.STRING(20),
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
    city: {
      type: DataTypes.STRING(20),
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
const Product_ingredient = sequelize.define(
  'Product_ingredient',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
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
const Restaurant_menu = sequelize.define(
  'ResutrantMenu',
  {
    menuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    menuImage: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

Customer.hasMany(Address, { foreignKey: 'customerId', as: 'Addresses' });
Customer.hasMany(waitingOrder, {
  foreignKey: 'customerId',
  as: 'WaitingOrders',
});
Customer.hasMany(Customer_phoneNumber, {
  foreignKey: 'customerId',
  as: 'PhoneNumbers',
});

Resturant.hasMany(Product, { foreignKey: 'resturantId', as: 'Products' });
Resturant.hasMany(Resturant_deliveryAreas, {
  foreignKey: 'resturantId',
  as: 'DeliveryAreas',
});
Resturant.hasMany(Resturant_worker, {
  foreignKey: 'resturantId',
  as: 'Workers',
});

Product.belongsTo(Resturant, { foreignKey: 'resturantId', as: 'Restaurant' });
Product.hasMany(Product_ingredient, {
  foreignKey: 'productId',
  as: 'Ingredients',
});
Product.hasMany(productExtra, { foreignKey: 'productId', as: 'Extras' });

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

Address.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });

waitingOrder.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });

Resturant_deliveryAreas.belongsTo(Resturant, {
  foreignKey: 'resturantId',
  as: 'Restaurant',
});

Resturant_worker.belongsTo(Resturant, {
  foreignKey: 'resturantId',
  as: 'Restaurant',
});

Product_ingredient.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'Product',
});

Order.belongsTo(Resturant, { foreignKey: 'resturantId', as: 'Restaurant' });
Order.belongsTo(Address, { foreignKey: 'addressID', as: 'Address' });
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });
OrderItem.belongsTo(waitingOrder, { foreignKey: 'waitId', as: 'WaitingOrder' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'Order' });

itemExtra.belongsTo(Extra, { foreignKey: 'extraId', as: 'Extra' });
itemExtra.belongsTo(OrderItem, { foreignKey: 'orderItemId', as: 'OrderItem' });
Resturant.hasMany(Restaurant_menu, {
  foreignKey: 'resturantId',
  as: 'Restaurant_menu',
});
Restaurant_menu.belongsTo(Resturant, {
  foreignKey: 'resturantId',
  as: 'Restaurant',
});
Owner.hasMany(Resturant,{
    foreignKey:'ownerId',
    as:'Resturant'
});
Resturant.belongsTo(Owner,
  {
    foreignKey:'ownerId',
    as:'Owner'
  });
module.exports = {
  Resturant,
  Product,
  Extra,
  Address,
  waitingOrder,
  productExtra,
  Customer_phoneNumber,
  Resturant_deliveryAreas,
  Resturant_worker,
  Product_ingredient,
  Order,
  OrderItem,
  itemExtra,
  Restaurant_menu,
  Owner,
};
