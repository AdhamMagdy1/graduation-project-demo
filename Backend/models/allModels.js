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
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    // firstName: {
    //   type: DataTypes.STRING(50),
    //   allowNull: false,
    // },
    // lastName: {
    //   type: DataTypes.STRING(50),
    //   allowNull: false,
    // },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Owner = sequelize.define(
  'Owner',
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
    hasRestaurant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    subscription: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    themeColor: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    logo : {
      type:DataTypes.BLOB,
      allowNull:true
    },
    link:{
      type:DataTypes.STRING(100),
      allowNull: true
    }
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
    size: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  },
  { timestamps: false, freezeTableName: true }
);

const Extra = sequelize.define(
  'Extra',
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
  'Address',
  {
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
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

// const WaitingOrder = sequelize.define(
//   'WaitingOrder',
//   {
//     waitId: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     orderTime: {
//       type: DataTypes.DATE,
//       allowNull: false,
//     },
//     price: {
//       type: DataTypes.DECIMAL(6, 2),
//       allowNull: false,
//     },
//   },
//   { timestamps: false, freezeTableName: true }
// );

const ProductExtra = sequelize.define(
  'ProductExtra',
  {},
  { timestamps: false, freezeTableName: true }
);

const CustomerPhoneNumber = sequelize.define(
  'CustomerPhoneNumber',
  {
    phoneNumber: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const RestaurantDeliveryAreas = sequelize.define(
  'RestaurantDeliveryAreas',
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
  'RestaurantWorker',
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

const ProductIngredient = sequelize.define(
  'ProductIngredient',
  {
    ingredientId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ingredientName: {
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
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending'
    },
    orderTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now()
    },
    orderDetails: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  { timestamps: false, freezeTableName: true }
);

// const OrderItem = sequelize.define(
//   'OrderItem',
//   {
//     orderItemId: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     price: {
//       type: DataTypes.DECIMAL(6, 2),
//       allowNull: false,
//     },
//   },
//   { timestamps: false, freezeTableName: true }
// );

// const ItemExtra = sequelize.define(
//   'ItemExtra',
//   {},
//   { timestamps: false, freezeTableName: true }
// );

const Category = sequelize.define(
  'Category',
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
  'RestaurantMenu',
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
// Categoryassociations
Category.belongsTo(Restaurant, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});
Category.hasMany(Product, {
  foreignKey: { name: 'categoryId', allowNull: false },
});
// Customer associations
Customer.hasMany(Address, {
  foreignKey: { name: 'customerId', allowNull: false },
});
// Customer.hasMany(WaitingOrder, {
//   foreignKey: { name: 'customerId', allowNull: false, unique: true },
// });
Customer.hasMany(CustomerPhoneNumber, {
  foreignKey: { name: 'customerId', allowNull: false },
});

// Owner associations
Owner.hasOne(Restaurant, {
  foreignKey: { name: 'ownerId', allowNull: false, unique: true },
});

// Restaurant associations
Restaurant.belongsTo(Owner, {
  foreignKey: { name: 'ownerId', allowNull: false },
});
Restaurant.hasMany(Product, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});
Restaurant.hasMany(Extra, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});
Restaurant.hasMany(RestaurantDeliveryAreas, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});
Restaurant.hasOne(RestaurantWorker, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});
Restaurant.hasMany(RestaurantMenu, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});
Restaurant.hasMany(Category, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});
// uncomment allow null constraint when integreating with frontend is tested
Restaurant.hasMany(Order, {
  foreignKey: { name: "restaurantId"/*, allowNull: false*/ },
});
// Product associations
Product.belongsTo(Restaurant, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});
Product.belongsTo(Category, {
  foreignKey: { name: 'categoryId', allowNull: false },
});
Product.belongsToMany(Extra, {
  through: ProductExtra,
  foreignKey: { name: 'productId', allowNull: false },
  otherKey: { name: 'extraId', allowNull: false },
});
Product.hasMany(ProductIngredient, {
  foreignKey: { name: 'productId', allowNull: false },
});

// Extra associations
Extra.belongsTo(Restaurant, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});
Extra.belongsToMany(Product, {
  through: ProductExtra,
  foreignKey: { name: 'extraId', allowNull: false },
  otherKey: { name: 'productId', allowNull: false },
});
// Extra.belongsToMany(OrderItem, {
//   through: ItemExtra,
//   foreignKey: { name: 'extraId', allowNull: false },
//   otherKey: { name: 'orderItemId', allowNull: false },
// });

// Address associations
Address.belongsTo(Customer, {
  foreignKey: { name: 'customerId', allowNull: false },
});

// WaitingOrder associations
// WaitingOrder.belongsTo(Customer, {
//   foreignKey: { name: 'customerId', allowNull: false },
// });

// RestaurantDeliveryAreas associations
RestaurantDeliveryAreas.belongsTo(Restaurant, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});

// RestaurantWorker associations
RestaurantWorker.belongsTo(Restaurant, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});

// ProductIngredient associations
ProductIngredient.belongsTo(Product, {
  foreignKey: { name: 'productId', allowNull: false },
});

// Order associations
// uncomment allow null constraint when integreating with frontend is tested
Order.belongsTo(Restaurant, {
  foreignKey: { name: "restaurantId"/*, allowNull: false*/ },
});
Order.belongsTo(Address, {
  foreignKey: { name: 'addressId', allowNull: false },
});
Order.belongsTo(Customer, {
  foreignKey: { name: 'customerId', allowNull: false },
});

// OrderItem associations
// OrderItem.belongsTo(Product, {
//   foreignKey: { name: 'productId', allowNull: false },
// });
// OrderItem.belongsTo(WaitingOrder, {
//   foreignKey: { name: 'waitId', allowNull: false },
// });
// OrderItem.belongsTo(Order, {
//   foreignKey: { name: 'orderId', allowNull: false },
// });
// // check this logic
// OrderItem.belongsToMany(Extra, {
//   through: ItemExtra,
//   foreignKey: { name: 'orderItemId', allowNull: false },
//   otherKey: { name: 'extraId', allowNull: false },
// });


// RestaurantMenu associations
RestaurantMenu.belongsTo(Restaurant, {
  foreignKey: { name: 'restaurantId', allowNull: false },
});

// CustomerPhoneNumber associations
CustomerPhoneNumber.belongsTo(Customer, {
  foreignKey: { name: 'customerId', allowNull: false },
});

module.exports = {
  Restaurant,
  Product,
  Extra,
  Address,
  // WaitingOrder,
  ProductExtra,
  CustomerPhoneNumber,
  RestaurantDeliveryAreas,
  RestaurantWorker,
  ProductIngredient,
  Order,
  // OrderItem,
  // ItemExtra,
  RestaurantMenu,
  Owner,
  Category,
  Customer,
};
