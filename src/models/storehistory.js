import mongoose from 'mongoose';

const StoreHistory = new mongoose.Schema({
    refId:mongoose.Schema.Types.ObjectId,
    key:String,
    value:String,
},{ timestamps: { createdAt: 'created_at' } })

export default mongoose.model('StoreHistory',StoreHistory);
