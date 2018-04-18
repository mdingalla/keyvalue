
import express from 'express';
import bodyParser from 'body-parser';

import MyStore from './../models/mystore';
import MyStoreHistory from './../models/storehistory';

const jsonParser = bodyParser.json();


export const keyvaluecontroller = () => {
    let router = express.Router();
    
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());

	
	router.post('/',jsonParser,((req,res)=>{
        let timestamp = req.query.timestamp || new Date();
        const key = Object.keys(req.body)[0];

       HandlePostRequest(res,key, req.body[key],timestamp);
        
    }));

    router.get('/:key',jsonParser,((req,res)=>{
        // var timestamp = req.query.timestamp || +new Date() / 1000 | 0;
        var timestamp = req.query.timestamp;
        HandleGetRequest(res,req.params.key,timestamp)
       // return res.status(200).send('OK')
    }));

	return router;
}


 function HandlePostRequest(res,mkey,mvalue,ts) {
       MyStore.findOne({key:mkey},((err,record)=>{
        if(record){
               MyStore.findOneAndUpdate({_id:record._id},{
                key:mkey,
                value:mvalue
            },(err,doc,rs)=>{
               if(mvalue != record.value )
               {
                    MyStoreHistory.create({
                        refId:doc._id,
                        oldvalue:record.value,
                        key:mkey,
                        newvalue:mvalue,
                        timestampdate:ts
                    }).then(()=>{
                         res.send({
                            key:mkey,
                            value:mvalue,
                            timestamp:ts
                        })
                    })
               }
               else {
                res.send({
                    key:mkey,
                    value:mvalue,
                    timestamp:ts
                })
               }
            })
        }
        else {
             MyStore.create({
                key:mkey,
                value:mvalue
            }).then(()=>{
                res.send({
                    key:mkey,
                    value:mvalue,
                    timestamp:ts
                })
            })
        }
    }));
}

function HandleGetRequest(res,mkey,ts){
    if(ts){
        MyStoreHistory.findOne({key:mkey,timestampdate:{$gt:ts}},((err,record)=>{
            if(record){
                res.send({
                    value:record.value
                })
            }
            else{
             HandleNotFound(res);
            }
        }))
    }
    else{
        MyStore.findOne({key:mkey},((err,record)=> {
            if(record){
                res.send({
                    value:record.value
                })
            }
            else{
                HandleNotFound(res)
            }
        }))
    }
    
}

function HandleServerError(res,err){
    res.status(500)
        .send({
            error:err
        })
}


function HandleNotFound(res){
    res.status(404)
        .send({
            error:'Not Found'
        });
}