import express from 'express'
import data from '../data.js';
import Genre from '../models/genreModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async(req, res) => { 
    await Genre.remove({});
    const createdGenre = await Genre.insertMany(data.genres);
  
    res.send({createdGenre}) ;
})

export default seedRouter;