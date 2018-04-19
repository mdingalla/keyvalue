import mongoose from 'mongoose';

export default callback => {

	// mongoose.connect('mongodb://localhost:27017/test')
	mongoose.connect('mongodb://mdingalla:pass1234@ds149309.mlab.com:49309/freetest')		
	callback(mongoose);
}