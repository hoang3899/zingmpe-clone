import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        userName: {type: String, default:""},
        artistsNames: [{type: String, required: true, default:"Unknown"}],
        thumbnail: {type: String, required: true},
        thumbnailM: {type: String, required: true},
        duration: {type: Number, default: 0},
        releaseDate: {type: String, required: true},
        link: {type: String, required: true, unique: true},
        genreIds:  [{type: String, required: true, default:" "}],
        likes_count: {type: Number, default: 0},
        plays_count:{type: Number, default: 0},
    }, 
    {
        timestamps: true,
    }
);

const Track = mongoose.model('Track', TrackSchema);

export default Track;