require('dotenv').config();
const { Op } = require('sequelize');
const {
    Restaurant,
    SentimentAnalysis,
    Feedback
  } = require('../models/allModels'); 
const { AppError } = require('../utils/error');

const getStatsForResturant = async (req, res, next) => {
  const restaurantId = req.user.hasRestaurant;
  try {
    if(!restaurantId){
      return next(new AppError('Restaurant not found', 404));
    }
    const sentimentAnalysis = await SentimentAnalysis.findAll({
      where: { restaurantId },
      attributes: [
        ["dateOfAnalysis", "date"],
        ["negative", "neg"],
        ["postive", "pos"],
        ["neutral", "neu"],
      ],
    });
    if (sentimentAnalysis.length === 0) {
      return next(new AppError('Sentiment Analysis Data not found for this restaurant', 404));
    }
    const transformedData = sentimentAnalysis.reduce((acc, item) => {
      const dataValues = item.dataValues;
      const date = new Date(dataValues.date).toISOString().split('T')[0];
      acc[date] = {
          neg: item.dataValues.neg,
          pos: item.dataValues.pos,
          neu: item.dataValues.neu
      };
      return acc;
    } , {});
    res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error getting Stats:', error);
    return next(new AppError('Internal server error', 500));
  }
};

module.exports = {getStatsForResturant};

