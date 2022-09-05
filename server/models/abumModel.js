import mongoose from "mongoose";

const AbumSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        thumbnail: {type: String, required: true},
        tracks: [{type:Object, default: {}}],
        userId:{type: String, required: true},
        userName:{type: String, required: true},
    }, 
    {
        timestamps: true,
    }
);

const Abum = mongoose.model('Abum', AbumSchema);

export default Abum;