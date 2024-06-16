require('dotenv').config();
const { Op } = require('sequelize');
const {
    Restaurant,
    SentimentAnalysis,
    Feedback
  } = require('../models/allModels'); 
const { AppError } = require('../utils/error');

const getStatsForResturant = async (req, res, next) => {
    const ownerId = req.user.ownerId;
    const restaurantId = req.user.hasRestaurant;
    try{
        if(!restaurantId){
            return next(new AppError('Restaurant not found', 404));
        }
        const data = await SentimentAnalysis.findAll({ where: { restaurantId } });
        if (data.length === 0) {
          return next(new AppError('Sentiment Analysis Data not found for this restaurant', 404));
        }
        const formattedData = data.map(item => {
            const date = item.dateOfAnalysis.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const formattedItem = `${date}:[neg:${item.negative},pos:${item.postive},neu:${item.neutral}]`;
            // const formattedItem =   { ${date :{"neg":item.negative,"pos":item.positive,"neu":item.neutral}};

            return formattedItem;
          });
        //   return res.json(JSON.stringify(formattedData));
        return res.json(formattedData);
    }catch (error) {
        console.error('Error getting Stats:', error);
        return next(new AppError('Internal server error', 500));
      } 
};

module.exports = {getStatsForResturant};

