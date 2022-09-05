import express, { response } from 'express'
import { isAuth } from '../auth.js'
import Abum from '../models/abumModel.js';
import Track from '../models/trackModel.js';


const abumRouter = express.Router();

abumRouter.get('/:id', async(req, res) => { 
    const idUser = req.params.id;
    const abums = await Abum.find(); 
    if(abums){
        const playlists = abums.filter((abum) => abum.userId === idUser);
        if(playlists){
            res.status(200).send(playlists);
        } else {
            res.status(200).send("user dont have any playlists!"); 
        }
    } else {
        res.status(404).send("No Abum found");  
    }
});

abumRouter.get('/playlist/:id', async(req, res) => { 
    const id = req.params.id;
    const abum = await Abum.findById(id); 
    if(abum){
        res.status(200).send(abum);
    } else {
        res.status(404).send("No Abum found");  
    }
});

abumRouter.post('/create', async(req, res) => {
    const newAbum = new Abum({
        title: req.body.title,
        thumbnail: req.body.thumbnail,
        tracks: req.body.tracks,
        userId: req.body.userId, 
        userName: req.body.userName,
    })
    const abum = await newAbum.save();
    if(abum){
        res.status(200).send({
            _id: abum._id,
            title: abum.title,
            thumbnail: abum.thumbnail,  
            tracks: abum.tracks,
            userId: abum.userId, 
            userName: abum.userName,  
        })
    }
});


//add tracks to playlist
abumRouter.put('/update/admin/:id', async(req, res) => {
    const id = req.params.id;
    const abum = await Abum.findById(id);
    const tracks = await Track.find({ genreIds: { $in: abum.userName } });
    const top100 = tracks.sort((a, b) => b.plays_count - a.plays_count).slice(0,100);
    if(top100){
        const updateAbum = await Abum.findByIdAndUpdate(
            id,
            { 
                $set: {
                    tracks: top100
                }
            },
            { new: true }
        );
        const newAbum = await updateAbum.save();
        if(newAbum){
            res.status(200).send(newAbum); 
        }
    } else {
        res.status(404).send("No Abum found");
    }
})

//add tracks to playlist
abumRouter.put('/update/:id', async(req, res) => {
    const id = req.params.id;
    const abum = await Abum.findById(id);
    if(abum){
        const updateAbum = await Abum.findByIdAndUpdate(
            id,
            { 
                $push: {
                    tracks: req.body
                }
            },
            { new: true }
        );
        const newAbum = await updateAbum.save();
        if(newAbum){
            res.status(200).send(newAbum); 
        }
    } else {
        res.status(404).send("No Abum found");
    }
})
//remove tracks to playlist
abumRouter.put('/remove/:id', async(req, res) => {
    const id = req.params.id;
    const abum = await Abum.findById(id);
    if(abum){
        const updateAbum = await Abum.findByIdAndUpdate(
            id,
            { 
                $pull: {
                    tracks: {
                        _id: req.body.id,
                    }
                }
            },
            { new: true }
        );
        const newAbum = await updateAbum.save();
        if(newAbum){
            res.status(200).send(newAbum); 
        }
    } else {
        res.status(404).send("No Abum found");
    }
})

//get tracks by artistsNames
abumRouter.get('/v2/search', async(req, res) => { 
    const query = req.query.q;
 
    const playlists = await Abum.find({
        $text: { $search : query }
    });

    const secondPlaylists = await Abum.find({
        title: { $regex: query , $options: "i"} 
    });

    const thirdPlaylists = secondPlaylists.filter((item) => !playlists.some((value) => value.name._id.toString() === item._id.toString()));

    const resultPlaylists = [...playlists,...thirdPlaylists];

    if(resultPlaylists){
        res.status(200).send(resultPlaylists);   
    } else {
        res.status(200).send("No tracks found");
    }
 
})


export default abumRouter;