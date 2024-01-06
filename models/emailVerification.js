import mongoose from "mongoose";

const emailVerification = new mongoose.Schema({
    userId: String,
    token: String,
    createdAt: Date,
    expiresAt: Date,
});

const Verification = mongoose.model("Verification", emailVerification);
export default Verification;