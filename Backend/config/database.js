const dbConfig = {
    host : 'localhost',
    username: 'postgres',
    password: '1234',
    database: 'qwer1234',
    dialect: 'postgres'
};
module.exports = dbConfig;
// const testDb = async() => {
//     try{
//         // await sequelize.authenticate();
//         console.log("suceess connection ");
//         sequelize.sync({force:true}).then(()=> console.log('Model succesed'))
//         .catch((err)=> console.err("errot",err));

//     }catch(error){
//         console.error('Unable to connect',error);
//     }
// };
// module.exports = {sequelize,testDb};
