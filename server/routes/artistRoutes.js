import express from 'express'
import { isAuth } from '../auth.js'
import Artist from '../models/artistModel.js';
import Genre from '../models/genreModel.js';

const artistRouter = express.Router(); 

artistRouter.get('/', async(req, res) => { 
    const artists = await Artist.find();
    if(artists){
        res.status(200).send(artists);
    } else {
        res.status(404).send("No artist found");
    }
});

artistRouter.get('/name', async(req, res) => { 
    const artists = await Artist.find();
    
    if(artists){
        const array = [];
        artists.forEach((artist) => {
          array.push({value: artist.name ,label:artist.name });
        })
        res.status(200).send(array);
    } else {
        res.status(404).send("No artist found");
    }
});

artistRouter.get('/genre', async(req, res) => { 
    const genres = await Genre.find();
    
    if(genres){
        const array = [];
        genres.forEach((genre) => {
          array.push({value: genre.genre ,label:genre.genre });
        })
        res.status(200).send(array);
    } else {
        res.status(404).send("No artist found");
    }
});

artistRouter.post('/create', async(req, res) => { 
    const newArtist = new Artist({
        name: req.body.name,
        thumbnail: req.body.thumbnail,
        thumbnailM: req.body.thumbnailM,
        national: req.body.national,
        biography: req.body.biography
    });
    const artist = await newArtist.save();
    res.send({
        _id: artist._id,
        name: artist.name,
        thumbnail: artist.thumbnail,
        national: artist.national,
        biography: artist.biography,
        thumbnailM: artist.thumbnailM,
        totalFollow: artist.totalFollow,
    })
});


artistRouter.delete('/delete/:id', async (req, res) => {

    try {

        await Artist.findByIdAndDelete(req.params.id)
        res.status(200).json('Artist has been deleted'); 

    } catch (error) {
        res.status(400).json('Artist hasnt been deleted'); 
    }
});

artistRouter.post('/info' , async(req, res) => {
    try {
        const artist = await Artist.find({"name": req.body.name});
        if(artist){
            res.status(200).send(artist);
        }
    } catch (error) {
        res.status(400).json('Artist has been not found');
    }

})

//get tracks by artistsNames
artistRouter.get("/v2/search", async(req, res) => { 
    const query = req.query.q;
    try {
        const artists = await Artist.find({  
            $text: { $search : query }
        });

        const secondArtists = await Artist.find({
            name: { $regex: query , $options: "i"} 
        });

        
        const thirdArtists = secondArtists.filter((item) => !artists.some((value) => value._id.toString() === item._id.toString()));

        const resultArtists = [...artists,...thirdArtists];

        res.status(200).json(resultArtists);   
        
    } catch (error) {
        res.status(400).send(false);
    }
})


export default artistRouter;
