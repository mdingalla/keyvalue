import mongoose from 'mongoose';

export default callback => {

	mongoose.connect('mongodb://localhost:27017/test')
		
	callback(mongoose);
}