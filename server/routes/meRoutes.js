import express from 'express'
import { isAuth } from '../auth.js'
import Me from '../models/meModel.js';
import Track from '../models/trackModel.js';

const meRouter = express.Router();

meRouter.get('/',isAuth, async(req, res) => { 
    const user = await Me.findOne({"email" : req.user.email});
    if(user) {
        res.json(user)
    } else {
        const newMe = new Me({
            name: req.user.name,
            email: req.user.email,
            avatar_url : req.user.picture,
        })
        try{
            const savedMe = await newMe.save();
            res.status(200).json(savedMe);
        } catch(error) {
            res.status(500).send(error.message);
        }
    }
});

meRouter.put('/like/track/:id', async(req, res) => { 
    const user = await Me.findOne({"_id" : req.body.id});
    if(user) {
        let toBeLike = await Track.findById({ _id: req.params.id });
        if (!toBeLike) return res.status(400).send("Bad Request");
        const userProfile = await Me.findByIdAndUpdate(
            req.body.id,
          {
            $push: {
                likes: {
                _id: req.params.id
              },
            },
          },
          { new: true }
        );
        const updateProfile = await userProfile.save();
        res.status(200).send({
          _id: updateProfile._id,
          avatar_url: updateProfile.avatar_url,
          followings: updateProfile.followings,
          likes: updateProfile.likes,
          playlists: updateProfile.playlists,
          email: updateProfile.email,
          favorites_count: updateProfile.favorites_count,
          isAdmin: updateProfile.isAdmin,
        });
    } else {
        res.status(400).send("Bad Request"); 
    }
});

meRouter.put('/dislike/track/:id', async(req, res) => { 
    const user = await Me.findOne({"_id" : req.body.id});
    if(user) {
        let toBeLiked = await Track.findById({ _id: req.params.id });
        if (!toBeLiked) return res.status(400).send("Bad Request");
        const userProfile = await Me.findByIdAndUpdate(
            req.body.id,
          {
            $pull: { 
                likes: {
                    $in: req.params.id
                },
            },
          },
          { new: true }
        );
        const updateProfile = await userProfile.save();
        res.status(200).send({
          _id: updateProfile._id,
          avatar_url: updateProfile.avatar_url,
          followings: updateProfile.followings,
          likes: updateProfile.likes,
          playlists: updateProfile.playlists,
          email: updateProfile.email,
          favorites_count: updateProfile.favorites_count,
          isAdmin: updateProfile.isAdmin,
        });
    } else {
        res.status(400).send("Bad Request");  
    }
});

meRouter.get('/:id/tracks/like', async(req, res) => { 
    const user = await Me.findById(req.params.id);
    if(user) {
        if(user.likes.length > 0){
            const tracks = await Track.find();
            const likeTracks = tracks.filter((track) => user.likes.includes(track._id));
            return res.status(200).send(likeTracks);
        } else {
            res.status(400).send("No tracks found");
        }
        
    } else {
        res.status(404).send("No users found");
    }
});

export default meRouter;
