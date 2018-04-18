import mongoose from 'mongoose';

const MyStore = new mongoose.Schema({
    key:String,
    value:String
})

export default mongoose.model('MyStore',MyStore);
