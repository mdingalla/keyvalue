import mongoose from 'mongoose';

const StoreHistory = new mongoose.Schema({
    refId:mongoose.Schema.Types.ObjectId,
    key:String,
    oldvalue:String,
    newvalue:String,
    timestampdate:mongoose.Schema.Types.Date
})

export default mongoose.model('StoreHistory',StoreHistory);
