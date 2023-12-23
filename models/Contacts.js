import mongoose from "mongoose";

// const {Schema, model} =mongoose;
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,

});

const contactModel = mongoose.model('contact',ContactSchema);

export default contactModel;