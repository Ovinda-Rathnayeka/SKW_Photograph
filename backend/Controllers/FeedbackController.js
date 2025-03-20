import FeedbackModel from '../Models/FeedbackModel.js';

// Get all feedbacks
const getAllFeedbacks = async (req, res, next) => {
    let feedback;
    try {
        feedback = await FeedbackModel.find();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Fetching feedbacks failed, please try again later." });
    }

    if(!feedback){
        return res.status(404).json({ message: "No feedbacks found." });
    }
    return res.status(200).json({ feedbacks: feedback });
};

// Insert Feedback
const AddFeedback = async (req, res, next) => {
    const {user, category, rating, title, comment} = req.body;

    let feedback;

    try{
        feedback = new FeedbackModel({
            user,
            category,
            rating,
            title,
            comment
        });
        await feedback.save();
    } catch (err) {
        console.log(err);
    }

    if(!feedback){
        return res.status(404).json({ message: "Inserting feedback failed" });
    }
    return res.status(200).json({ feedback });
};

// Get by ID
const getFeedbackById = async (req, res, next) => {
    const feedbackId = req.params.feedbackId;
    let feedback;
    
    try{
        feedback = await FeedbackModel.findById(feedbackId);
    } catch (err) {
        console.log(err);
    }

    if(!feedback){
        return res.status(404).json({ message: "Feedback not found." });
    }
    return res.status(200).json({ feedback });
};

// Update feedback
const updateFeedback = async (req, res, next) => {
    const feedbackId = req.params.feedbackId;
    const {user, rating, title, comment} = req.body;

    let feedback;

    try{
        feedback = await FeedbackModel.findByIdAndUpdate(feedbackId,
            {user:user, rating:rating, title:title, comment:comment, updatedAt:new Date()},
            {new: true}
        );
    } catch (err) {
        console.log(err);
    }

    if(!feedback){
        return res.status(404).json({ message: "Updating feedback failed" });
    }
    return res.status(200).json({feedback});
};

// Delete feedback
const deleteFeedback = async (req, res, next) => {
    const feedbackId = req.params.feedbackId;

    try {
        await FeedbackModel.findByIdAndDelete(feedbackId);
        const updatedFeedbacks = await FeedbackModel.find(); // Fetch latest list
        return res.status(200).json({ feedback: updatedFeedbacks });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting feedback" });
    }
};


export default { getAllFeedbacks, AddFeedback, getFeedbackById, updateFeedback, deleteFeedback };