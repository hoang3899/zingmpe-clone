import express from 'express'
import Abum from '../models/abumModel.js';
import Artist from '../models/artistModel.js';
import Track from '../models/trackModel.js';

const trackRouter = express.Router();

trackRouter.get('/', async(req, res) => { 
    const tracks = await Track.find();
    if(tracks){
        res.status(200).send(tracks);
    } else { 
        res.status(404).send("No tracks found");
    }
});

trackRouter.get('/zing-chart', async(req, res) => { 
    const tracks = await Track.find();
    const zingChart = tracks.sort((a, b) => b.plays_count - a.plays_count).slice(0,10);
    if(tracks){
        res.status(200).send(zingChart);
    } else {
        res.status(404).send("No tracks found");
    }
});

trackRouter.get('/lists/top100', async(req, res) => { 
    const query = req.query.q;
    const tracks = await Track.find({ genreIds: { $in: query } });
    const top100 = tracks.sort((a, b) => b.plays_count - a.plays_count).slice(0,100);
    if(top100){
        res.status(200).send(top100);
    } else {
        res.status(404).send("No tracks found");
    }
});

trackRouter.get('/newtracks', async(req, res) => {  
    const tracks = await Track.find();
    const newTracks = tracks.slice(-9).reverse();
    if(newTracks){
        res.status(200).send(newTracks);
    } else {
        res.status(404).send("No tracks found");
    }
});

trackRouter.get('/all/newtracks', async(req, res) => {  
    const tracks = await Track.find();
    const newTracks = tracks.slice(-20).reverse();
    if(newTracks){
        res.status(200).send(newTracks);
    } else {
        res.status(404).send("No tracks found");
    }
});

trackRouter.post('/create' , async(req,res) => {
    const newTrack = new Track({
        title : req.body.title,
        userName : req.body.userName,
        artistsNames : req.body.artistsNames,
        thumbnail : req.body.thumbnail,
        thumbnailM : req.body.thumbnailM,
        duration : req.body.duration,
        link : req.body.link,
        releaseDate : req.body.releaseDate,
        genreIds : req.body.genreIds,
    });
    const track = await newTrack.save();
    if(track){
        res.status(200).send({
            title : track.title,
            userName : track.userName,
            artistsNames : track.artistsNames,
            link: track.link,
            thumbnail : track.thumbnail,
            thumbnailM : track.thumbnailM,
            duration : track.duration,
            releaseDate : track.releaseDate,
            genreIds : track.genreIds,  
            likes_count: track.likes_count,
            plays_count: track.plays_count
        })
    }
});

trackRouter.put('/update/like/:id' , async (req, res) => {
    const id = req.params.id;
    const track = await Track.findById(id);
    if(track){
        const likes = track.likes_count;
        track.likes_count =  likes + 1;
    }
    const updateTrack = await track.save();
    res.status(200).send(updateTrack);
})

trackRouter.put('/update/dislike/:id' , async (req, res) => {
    const id = req.params.id;
    const track = await Track.findById(id);
    if(track){
        const likes = track.likes_count;
        track.likes_count =  likes - 1;
    }
    const updateTrack = await track.save();
    res.status(200).send(updateTrack);
})


trackRouter.put('/update', async(req, res) => { 
    const track = await Track.findById(req.body._id);
    if(track){
        track.title = req.body.title  || track.title,
        track.alias = req.body.alias || track.alias,
        track.userName = req.body.userName || track.userName,
        track.artistsNames = req.body.artistsNames || track.artistsNames,
        track.link = req.body.link || track.link,
        track.thumbnail = req.body.thumnail || track.thumbnail,
        track.thumbnailM = req.body.thumnailM || track.thumbnailM,
        track.duration = req.body.duration || track.duration,
        track.releaseDate = req.body.release || track.releaseDate,
        track.genreIds = req.body.genreIds || track.genreIds
    }
    
    const updateTrack = await track.save();
    res.send({
        _id: updateTrack._id,
        title: updateTrack.title,
        userName: updateTrack.userName,
        artistsNames: updateTrack.artistsNames,
        link: updateTrack.link,
        alias: updateTrack.alias,
        thumbnail: updateTrack.thumbnail,
        thumbnailM: updateTrack.thumbnailM,
        duration: updateTrack.duration,
        releaseDate: updateTrack.releaseDate,
        genreIds: updateTrack.genreIds,
        likes_count: updateTrack.likes_count,
        plays_count: updateTrack.plays_count
    })
});

trackRouter.get('/:id', async(req, res) => { 
    const id = req.params.id;
    const track = await Track.findById(id);
    if(track){
        res.status(200).send(track);
    } else {
        res.status(404).send("No tracks found");
    }
});


trackRouter.put('/update/plays_count', async(req, res) => { 
    const track = await Track.findById(req.body._id);
    if(track){
        track.plays_count = req.body.plays_count  || track.plays_count;
    }
    const updateTrack = await track.save();
    res.send({
        _id: updateTrack._id,
        title: updateTrack.title,
        userName: updateTrack.userName,
        artistsNames: updateTrack.artistsNames,
        link: updateTrack.link,
        alias: updateTrack.alias,
        thumbnail: updateTrack.thumbnail,
        thumbnailM: updateTrack.thumbnailM,
        duration: updateTrack.duration,
        releaseDate: updateTrack.releaseDate,
        genreIds: updateTrack.genreIds,
        likes_count: updateTrack.likes_count,
        plays_count: updateTrack.plays_count
    })
});

trackRouter.delete("/delete/:id", async (req, res) => {
    try {
        await Track.findByIdAndDelete(req.params.id)
        res.status(200).json('Track has been deleted'); 

    } catch (error) {
        res.status(400).json('Track hasnt been deleted'); 
    }
});

//get track genreIds
trackRouter.post('/genre', async(req, res) => { 
    try {
        const relateTracks = await Track.find({ genreIds: { $in: [...req.body.genreIds ]} });
        if(relateTracks){
            res.status(200).send(relateTracks.slice(-10));
        } else {
            const allTracks = await Track.find();
            res.status(200).send(allTracks.slice(-10));
        }
    } catch (error) {
        res.status(400).json('Track hasnt been deleted'); 
    } 
})

//get tracks by artistsNames
trackRouter.get('/v2/search', async(req, res) => { 
    const query = req.query.q;
 
    const tracks = await Track.find(
        { $text: { $search: query }} 
    );
    const secondTracks = await Track.find({
        title: { $regex: query , $options: "i"} 
    });

    const thirdTracks= secondTracks.filter((item) => !tracks.some((value) => value._id.toString() === item._id.toString()));

        const resultTracks = [...tracks,...thirdTracks];

    if(resultTracks){
        res.status(200).send(resultTracks);   
    } else {
        res.status(200).send("No tracks found");
    }
     
})

//get tracks by artistsNames
trackRouter.get('/v2/text/search', async(req, res) => { 
        const query = req.query.q;

        const result = [];
     
        const tracks = await Track.find({
                title: { $regex: query , $options: "i"} 
        });
        const secondTracks = await Track.find({
            $text: { $search : query } 
        });
        const thirdTracks= secondTracks.filter((item) => !tracks.some((value) => value.name === item.name));

        const resultTracks = [...tracks,...thirdTracks];

        const artists = await Artist.find({
            name: { $regex: query , $options: "i"} 
        });

        const secondArtists = await Artist.find({
            $text: { $search : query } 
        });

        const thirdArtists = secondArtists.filter((item) => !artists.some((value) => value.name === item.name));

        const resultArtists = [...artists,...thirdArtists];

        if(resultTracks || resultArtists){
            const artistsText = resultArtists?.map((artist) => artist.name).slice(0,3);
            const tracksText = resultTracks?.map((track) => track.title).slice(0,3);
            result.push(...artistsText, ...tracksText);
            res.status(200).json(result);   
        } else {
            res.status(200).send("No tracks found");
        }
     
})
trackRouter.get('/v2/all/search', async(req, res) => { 
        const query = req.query.q;
    try{
        const result = [
            {
                title: 'track',
                items: null,
            },
            {
                title: 'artist',
                items: null,
            }
        ];
        const tracks = await Track.find({
                title: { $regex: query , $options: "i"} 
        });
        const secondTracks = await Track.find({
            $text: { $search : query } 
        });
        const thirdTracks= secondTracks.filter((item) => !tracks.some((value) => value._id.toString() === item._id.toString()));

        const resultTracks = [...tracks,...thirdTracks];

        const artists = await Artist.find({
            name: { $regex: query , $options: "i"} 
        });

        const secondArtists = await Artist.find({
            $text: { $search : query } 
        });
        const thirdArtists = secondArtists.filter((item) => !artists.some((value) => value._id.toString() === item._id.toString()));

        const resultArtists = [...artists,...thirdArtists];
     

        if(resultTracks || resultArtists){
            result[0].items = resultTracks?.slice(0,3)
            result[1].items = resultArtists?.slice(0,3)
            res.status(200).json(result);   
        } else {
            res.status(200).send("No tracks found");
        }

    } catch(e){
        res.status(404).send("Not found")
    }
     
     
})

trackRouter.get('/v2/max-all/search', async(req, res) => { 
    const query = req.query.q;

    const result = [
        {
            title: 'outstanding',
            items: null,
        },
        {
            title: 'track',
            items: null,
        },
        {
            title: 'playlist',
            items: null,
        },
        {
            title: 'artist',
            items: null,
        }
    ];
 
    const tracks = await Track.find({
        $text: { $search : query }
    });

    const secondTracks = await Track.find({
        title: { $regex: query , $options: "i"} 
    });

    const thirdTracks= secondTracks.filter((item) => !tracks.some((value) => value._id.toString() === item._id.toString()));

    const resultTracks = [...tracks,...thirdTracks];


    const artists = await Artist.find({
        $text: { $search : query }
    });

    const secondArtists = await Artist.find({
        name: { $regex: query , $options: "i"} 
    });
    const thirdArtists = secondArtists.filter((item) => !artists.some((value) => value._id.toString() === item._id.toString()));

    const resultArtists = [...artists,...thirdArtists];

    const playlists = await Abum.find({
        $text: { $search : query }
    });

    const secondPlaylists = await Abum.find({
        title: { $regex: query , $options: "i"} 
    });

    const thirdPlaylists = secondPlaylists.filter((item) => !playlists.some((value) => value.name._id.toString() === item._id.toString()));

    const resultPlaylists = [...playlists,...thirdPlaylists];

    if(resultTracks || resultArtists || resultPlaylists){
        result[0].items = [...artists?.slice(1,2),...resultPlaylists?.slice(0,1),...resultArtists?.slice(0,1)];
        result[1].items = resultTracks?.slice(0,6);
        result[2].items = resultPlaylists?.slice(0,5);
        result[3].items = resultArtists?.slice(0,5);
        res.status(200).json(result);   
    } else {
        res.status(200).send("No tracks found");
    }
 
})

//get tracks by artistsNames
trackRouter.post('/artist/populate', async(req, res) => { 
    try {
        const relateTracks = await Track.find({ artistsNames: { $in: req.body.artistName } });
        const sortTracks = relateTracks.sort((a, b) => b.plays_count - a.plays_count).slice(0,4)
        if(sortTracks){
            res.status(200).send(sortTracks);
        } 
    } catch (error) {
        res.status(400).json('No track found for artist'); 
    } 
})






export default trackRouter; 

