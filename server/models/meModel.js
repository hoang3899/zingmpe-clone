import mongoose from "mongoose";

const MeSchema = new mongoose.Schema(
    {
        avatar_url: {type: String, required: true},
        name: {type: String, required: true},
        followings: [{type: String, default: ""}],
        likes : [{type: String, default: ""}],
        playlists  : {type: String, default: ""},
        email: {type: String, required: true , unique: true},
        favorites_count: {type: Number, default: 0 },
        isAdmin: {type: Boolean, default: false},
    }, 
    {
        timestamps: true,
    }
);

const Me = mongoose.model('Me', MeSchema);

export default Me;