'use strict';
require('dotenv').config()
const mongoose = require('mongoose');
const db = mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true,})
const fecth = require("node-fetch")

const stockSchema = new mongoose.Schema({
  symbol: {type: String, required: true},
  likes: {type: [String], default: []}
})

const Stock = mongoose.model("Stock", stockSchema)

module.exports = function (app) {
// https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote
  async function getStock(stock) {
    const res = await fecth(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
    const { symbol, latestPrice } =await res.json();
    return { symbol, latestPrice}
  }

  async function createStock(stock, like, ip) {
    const newStock= new Stock({
      symbol: stock,
      likes: like ? [ip] : []
    });
    const savedNew = await newStock.save();
    return savedNew;
  }

  async function findStock(stock) {
    return await Stock.findOne({symbol: stock}).exec();
  }


  async function saveStock(stock, like, ip){
    let saved = {};
    const foundStock= await findStock(stock);
    if (!foundStock){
      const createsaved= createStock(stock, like,ip);
      saved = createsaved;
      return saved 
    }else{
      if (like && foundStock.likes.indexOf(ip)=== -1){
        foundStock.likes.push(ip); 
      }
      saved =await foundStock.save();
      return saved
    }
  }

app.route('/api/stock-prices')
    .get( async function  (req, res){
      const {stock, like} = req.query;
      if (Array.isArray(stock)){
      const {symbol, latestPrice}= await getStock(stock[0]);
      const {symbol: symbol2, latestPrice: latestPrice2}= await getStock(stock[1]);
      
      const firstStock = await saveStock(stock[0], like, req.ip);
      const secondStock = await saveStock(stock[1], like, req.ip);

      let stockData= [];
      if(!symbol){
        stockData.push({
          rel_likes: firstStock.likes.length - secondStock.likes.length,
        })
      }
      else {
        stockData.push({
          stock: symbol,
          price: latestPrice,
          rel_likes: firstStock.likes.length - secondStock.likes.length
        })
      }
      if(!symbol2){
        stockData.push({
          rel_likes: secondStock.likes.length - firstStock.likes.length,
        })
      }
      else {
        stockData.push({
          stock: symbol2,
          price: latestPrice2,
          rel_likes: secondStock.likes.length - firstStock.likes.length
        })
      }
      res.json({stockData,})
      return
      }
      const {symbol, latestPrice}= await getStock(stock);
      if (!symbol){
        res.json({ stockData: {likes: like ? 1: 0}})
        return
      }
      const oneStockData= await saveStock(symbol, like, req.ip);

      res.json({
        stockData:{
          stock: symbol,
          price: latestPrice,
          likes: oneStockData.likes.length? oneStockData.likes.length: 0,
        },
      });


    });
    
};
