import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String, //Cloudinary URL
            required: true,
        },
        thumbnail: {
            type: String, //Cloudinary URL
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", //Reference to User model
        },
        title: {
            type: String,
            required: true,
            trim: true, //Remove leading and trailing spaces
        },
        description: {
            type: String,
        },
        duration: {
            type: Number, //Duration in seconds
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        }
    }, { timestamps: true }
)

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);