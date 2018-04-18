import express from 'express';
import http from 'http';
import initDB from './db';
import bodyParser from 'body-parser';
import  {keyvaluecontroller} from './controllers/keyvaluecontroller';

let app = express();
app.server = http.createServer(app);

// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

app.use('/object',keyvaluecontroller());

initDB((db)=>{

    app.server.listen(process.env.PORT || 3000,()=>{
        console.log(`Started on port ${app.server.address().port}`);
    });
})


export default app;