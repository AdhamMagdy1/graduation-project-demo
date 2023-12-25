const {DataTypes} =  require('sequelize');
const dbConfig = require('../config/database') 
// const {sequelize} =  require('../config/database')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    timestamps: false,
    freezeTableName: true,
    logging: true,
  });
// const {DataTypes} = Sequlize

const Customer = sequelize.define("Customer",{
  
     customerId:{
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull:false,
        
     },
     firstName:{
        type:DataTypes.STRING(50),
        allowNull:false,
     },
     lastName:{
        type:DataTypes.STRING(50),
        allowNull : false,
     },
     email:{
        type:DataTypes.STRING(100),
        allowNull:false
     },
     
});


const Resturant =  sequelize.define('Resturant',{
    resturantId : {
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull : false

    },
    description :{
    type: DataTypes.STRING(300),
    allowNull : false
    }
});
const Product =  sequelize.define('Product',{
    productId : {
        type:DataTypes.INTEGER,
        primaryKey : true ,
        autoIncrement : true,
    },
    quantity : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    price : {
        type : DataTypes.DECIMAL(6,2),
        allowNull : false,
    },
    description : {
        type:DataTypes.STRING(300),
        allowNull : false,
    },
    name: {
        type : DataTypes.STRING(100),
        allowNull : false,
    }

});
const Extra = sequelize.define('Extra',{
    extraId:{
        type : DataTypes.INTEGER,
        primaryKey: true,
    },
    name : {
        type:DataTypes.STRING(100),
        allowNull:false,
    },
    price : {
        type : DataTypes.DECIMAL(4,2),
        allowNull : false
    }
});
const Address =  sequelize.define('Address',{
    addressID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    Area : {
        type:DataTypes.STRING(100),
        allowNull: false,

    },
    streetNumber : {
        type:DataTypes.STRING(100),
        allowNull: false,
    },
    buildingNo:{
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    flatNumber : {
        type:DataTypes.STRING(100),
        allowNull: false,
    },
    extraDescription : {
        type:DataTypes.STRING(400),
        allowNull: true,
    }

});
const waitingOrder = sequelize.define('waitingOrder', {
    waitId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    OrderTime: {
        type : DataTypes.DATE,
        allowNull:false
    },
    price:{ 
       type:  DataTypes.DECIMAL(6, 2),
       allowNull:false
    },
   
  });
  const productExtra = sequelize.define('productExtra', {

  });
  const Customer_phoneNumber = sequelize.define('Customer_phoneNumber', {
    phoneNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  });
  const Resturant_deliveryAreas = sequelize.define('Resturant_deliveryAreas', {
    deliveryAreasid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
        type: DataTypes.STRING(100),
        allowNull:false,
    }
  });
  const Resturant_worker = sequelize.define('Resturant_worker', {
    workerid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
       type :  DataTypes.STRING(100),
       allowNull : false,
    },
    email: {
        type:DataTypes.STRING(100),
        allowNull:false,
    },
    password: {
        type : DataTypes.STRING(256),
        allowNull:false,

    }
  });
  const Product_ingredient = sequelize.define('Product_ingredient', {

  });
  const Order = sequelize.define('Order', {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deliveyCost: {
        type : DataTypes.DECIMAL(6, 2),
        allowNull : false
    },
    Status:{
        type : DataTypes.STRING(20),
        allowNull : false
    } ,
    OrderTime: {
        type : DataTypes.DATE,
        allowNull : false


    },
  });
  const OrderItem = sequelize.define('OrderItem', {
    orderItemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price:{ 
        type:  DataTypes.DECIMAL(6, 2),
        allowNull:false
     },
  });
  const itemExtra = sequelize.define('itemExtra', {});
  
  Customer.hasMany(Address, { foreignKey: 'customerId', as: 'Addresses' });
  Customer.hasMany(waitingOrder, { foreignKey: 'customerId', as: 'WaitingOrders' });
  Customer.hasMany(Customer_phoneNumber, { foreignKey: 'customerId', as: 'PhoneNumbers' });
  
  Resturant.hasMany(Product, { foreignKey: 'resturantId', as: 'Products' });
  Resturant.hasMany(Resturant_deliveryAreas, { foreignKey: 'resturantId', as: 'DeliveryAreas' });
  Resturant.hasMany(Resturant_worker, { foreignKey: 'resturantId', as: 'Workers' });
  
  Product.belongsTo(Resturant, { foreignKey: 'resturantId', as: 'Restaurant' });
  Product.hasMany(Product_ingredient, { foreignKey: 'productId', as: 'Ingredients' });
  Product.hasMany(productExtra, { foreignKey: 'productId', as: 'Extras' });
  
  Extra.belongsToMany(Product, { through: productExtra, foreignKey: 'extraId', as: 'Products' });
  Extra.belongsToMany(OrderItem, { through: itemExtra, foreignKey: 'extraId', as: 'OrderItems' });
  
  Address.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });
  
  waitingOrder.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });
  
  Resturant_deliveryAreas.belongsTo(Resturant, { foreignKey: 'resturantId', as: 'Restaurant' });
  
  Resturant_worker.belongsTo(Resturant, { foreignKey: 'resturantId', as: 'Restaurant' });
  
  Product_ingredient.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });
  
  Order.belongsTo(Resturant, { foreignKey: 'resturantId', as: 'Restaurant' });
  Order.belongsTo(Address, { foreignKey: 'addressID', as: 'Address' });
  Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'Customer' });
  
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });
  OrderItem.belongsTo(waitingOrder, { foreignKey: 'waitId', as: 'WaitingOrder' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'Order' });
  
  itemExtra.belongsTo(Extra, { foreignKey: 'extraId', as: 'Extra' });
  itemExtra.belongsTo(OrderItem, { foreignKey: 'orderItemId', as: 'OrderItem' });
  
  // sequelize.sync({ force: true })
  // .then(() => {
  //   console.log('Database and tables created!');
  // })
  // .catch((err) => {
  //   console.error('Error creating database and tables:', err);
  // });
sequelize.sync({force:true}).then(()=> console.log("Success")).then(()=> newCustomer.save()
.then(savedCustomer => {
  console.log("New customer created:", savedCustomer);
})
.catch(error => {
  console.error("Error creating customer:", error);
}));
const newCustomer = Customer.build({
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com'
});






