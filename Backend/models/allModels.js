const { DataTypes, TIME } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcrypt");

const Customer = sequelize.define(
  "Customer",
  {
    customerId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
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
  "Owner",
  {
    ownerId: {
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
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Restaurant = sequelize.define(
  "Restaurant",
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
    subscription: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    themeColor: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Product = sequelize.define(
  "Product",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ingredient: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    size: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Extra = sequelize.define(
  "Extra",
  {
    extraId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  "Address",
  {
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // area: {
    //   type: DataTypes.STRING(100),
    //   allowNull: false,
    // },
    // streetName: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true,
    // },
    // buildingName: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true,
    // },
    // flatNumber: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true,
    // },
    addressDescription: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

// const CustomerPhoneNumber = sequelize.define(
//   "CustomerPhoneNumber",
//   {
//     phoneNumber: {
//       type: DataTypes.STRING(20),
//       primaryKey: true,
//     },
//   },
//   { timestamps: false, freezeTableName: true }
// );

const RestaurantDeliveryAreas = sequelize.define(
  "RestaurantDeliveryAreas",
  {
    deliveryAreasId: {
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

const RestaurantWorker = sequelize.define(
  "RestaurantWorker",
  {
    workerId: {
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
  "Order",
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "waiting",
    },
    orderTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    orderDetails: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Category = sequelize.define(
  "Category",
  {
    categoryId: {
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

const RestaurantMenu = sequelize.define(
  "RestaurantMenu",
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Feedback = sequelize.define(
  "Feedback",
  {
    feedbackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    feedbackTime: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const SentimentAnalysis = sequelize.define(
  "SentimentAnalysis",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dateOfAnalysis: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    negative: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    postive: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    neutral: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

// Customer associations
Customer.hasMany(Address, {
  foreignKey: { name: "customerId", allowNull: false },
});
// Customer.hasMany(CustomerPhoneNumber, {
//   foreignKey: { name: "customerId", allowNull: false },
// });

// Restaurant associations
Restaurant.hasOne(Owner, {
  foreignKey: { name: "hasRestaurant", allowNull: true, unique: true },
});
Restaurant.hasMany(Product, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Restaurant.hasMany(Extra, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Restaurant.hasMany(RestaurantDeliveryAreas, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Restaurant.hasOne(RestaurantWorker, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Restaurant.hasMany(RestaurantMenu, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Restaurant.hasMany(Category, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
// uncomment allow null constraint when integreating with frontend is tested
Restaurant.hasMany(Order, {
  foreignKey: { name: "restaurantId" /*, allowNull: false*/ },
});
Restaurant.hasMany(Feedback, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Restaurant.hasMany(SentimentAnalysis, {
  foreignKey: { name: "restaurantId", allowNull: false },
});

// Owner associations
Owner.belongsTo(Restaurant, {
  foreignKey: { name: "hasRestaurant", allowNull: true },
});

// Category associations
Category.belongsTo(Restaurant, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Category.hasMany(Product, {
  foreignKey: { name: "categoryId", allowNull: false },
});

// Product associations
Product.belongsTo(Restaurant, {
  foreignKey: { name: "restaurantId", allowNull: false },
});
Product.belongsTo(Category, {
  foreignKey: { name: "categoryId", allowNull: false },
});

// Extra associations
Extra.belongsTo(Restaurant, {
  foreignKey: { name: "restaurantId", allowNull: false },
});

// Address associations
Address.belongsTo(Customer, {
  foreignKey: { name: "customerId", allowNull: false },
});

// RestaurantDeliveryAreas associations
RestaurantDeliveryAreas.belongsTo(Restaurant, {
  foreignKey: { name: "restaurantId", allowNull: false },
});

// RestaurantWorker associations
RestaurantWorker.belongsTo(Restaurant, {
  foreignKey: { name: "restaurantId", allowNull: false },
});

// Order associations
// uncomment allow null constraint when integreating with frontend is tested
Order.belongsTo(Restaurant, {
  foreignKey: { name: "restaurantId" /*, allowNull: false*/ },
});
Order.belongsTo(Address, {
  foreignKey: { name: "addressId", allowNull: false },
});
Order.belongsTo(Customer, {
  foreignKey: { name: "customerId", allowNull: false },
});

// RestaurantMenu associations
RestaurantMenu.belongsTo(Restaurant, {
  foreignKey: { name: "restaurantId", allowNull: false },
});

// CustomerPhoneNumber associations
// CustomerPhoneNumber.belongsTo(Customer, {
//   foreignKey: { name: "customerId", allowNull: false },
// });

// Hooks

// Owner Hooks
Owner.beforeSave(async (owner, option) => {
  if (owner.changed("password")) {
    const hashedPassword = await bcrypt.hash(owner.password, 10);
    owner.password = hashedPassword;
  }
});

// // Restaurant Hooks
Restaurant.afterCreate(async (restaurant, option) => {
  const link = `http://127.0.0.1:5173/restaurant/chat?restaurantId=${restaurant.restaurantId}`;
  restaurant.link = link;
  await restaurant.save();
});

// RestaurantWorker Hooks
// RestaurantWorker.beforeSave(async (worker, option) => {
//   if (worker.changed("password")) {
//     const hashedPassword = await bcrypt.hash(worker.password, 10);
//     worker.password = hashedPassword;
//   }
// });

module.exports = {
  Restaurant,
  Product,
  Extra,
  Address,
  // CustomerPhoneNumber,
  RestaurantDeliveryAreas,
  RestaurantWorker,
  Order,
  RestaurantMenu,
  Owner,
  Category,
  Customer,
  SentimentAnalysis,
  Feedback,
};
