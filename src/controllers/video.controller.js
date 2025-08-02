import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    // TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    // Get video data from user
    // Validate the data
    // Check for video and thumbnail file
    // Upload the video and thumbnail to cloudinary
    // Create an object and create entry in db
    // Return response

    const userId = req.user?._id

    const { title, description } = req.body

    if (!(title || description)) {
        throw new ApiError(401, "All fields are required")
    }

    const videoFileLocalPath = req.files?.videoFile[0]?.path

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!(videoFileLocalPath || thumbnailLocalPath)) {
        throw new ApiError(401, "Video file and Thumbnail file is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!(videoFile || thumbnail)) {
        throw new ApiError(401, "Upload failed to cloudinary")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: userId,
        isPublished: true,
    })

    if (!video) {
        throw new ApiError(401, "Error while publishing video")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {

    //TODO: get video by id

    // Take videoId from URL
    // Search for that same video in video collection
    // Return response

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(401, "VideoId not found")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(401, "No corresponding video found")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, video, "Video found succesfully")
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail

    // Get details of video from user
    // Check for validation
    // Update the details-->title, description
    // For thumbnail-->get thumbnail and upload on cloudinary
    // Return response

    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailLocalPath = req.file?.path

    if (!(title || description)) {
        throw new ApiError(401, "Title or description required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    const video = await Video.findById(videoId)

    const userId = req.user?._id

    if (!video.owner.equals(userId)) {
        throw ApiError(401, "You are unauthorize to update video")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url
            }
        },
        {
            new: true
        }
    )
    // console.log(video)
    return res.status(200)
        .json(new ApiResponse(200, updatedVideo, "Video details updated succesfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video

    const { videoId } = req.params

    const video = await Video.findById(videoId)
    const userId = req.user?._id

    if (!video.owner.equals(userId)) {
        throw ApiError(401, "You are unauthorize to delete video")
    }

    await Video.findByIdAndDelete(
        videoId
    )

    return res.status(200)
        .json(new ApiResponse(200, [], "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    const video = await Video.findById(videoId)

    const userId = req.user?._id

    if (!video.owner.equals(userId)) {
        throw ApiError(401, "You are unauthorize to update video publish status")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .json(
            new ApiResponse(200, updatedVideo, "Publish status is toggled!"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}