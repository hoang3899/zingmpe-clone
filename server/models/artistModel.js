import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, unique: true},
        biography: {type: String, default:""},
        national:{type: String, default:""},
        thumbnail  : {type: String, require: true},
        thumbnailM  : {type: String, require: true},
        totalFollow: {type: Number, default:0},
    }, 
    {
        timestamps: true,
    }
);

const Artist = mongoose.model('Artist', ArtistSchema);

export default Artist;