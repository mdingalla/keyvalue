
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
        const key = Object.keys(req.body)[0];
       HandlePostRequest(res,key, req.body[key]);
        
    }));

    router.get('/:key',jsonParser,((req,res)=>{
        // var timestamp = req.query.timestamp || +new Date() / 1000 | 0;
        var timestamp = req.query.timestamp;
        HandleGetRequest(res,req.params.key,timestamp)
       // return res.status(200).send('OK')
    }));

	return router;
}


 function HandlePostRequest(res,mkey,mvalue) {
       MyStore.findOne({key:mkey},((err,record)=>{
        if(record){
            if(mvalue != record.value )
            {
                MyStore.findOneAndUpdate({_id:record._id},{
                    key:mkey,
                    value:mvalue
                },(err,doc,rs)=>{
                    LogHistory(res,doc._id,mkey,mvalue);
                })
            }
            else {
                MyStoreHistory.findOne({key:mkey},{},{ sort: { 'created_at' : -1 }},(err,doc)=>{
                    res.send({
                        key:doc.key,
                        value:doc.value,
                        timestamp:new Date(doc.created_at).getTime()
                    })
                })
            
            }
               
        }
        else {
             MyStore.create({
                key:mkey,
                value:mvalue
            }).then((record)=>{
            
                LogHistory(res,record._id,mkey,mvalue);
            })
        }
    }));
}

function HandleGetRequest(res,mkey,ts){
    const myisodate = new Date(parseFloat(ts));
    if(ts){
        MyStoreHistory.findOne({key:mkey,created_at:{$lte:myisodate}},{},{ sort: { 'created_at' : -1 }},((err,record)=>{
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

function LogHistory(res,docid,mkey,mvalue){
    console.log('LogHistory')
    MyStoreHistory.create({
        refId:docid,
        key:mkey,
        value:mvalue
    }).then((doc)=>{
         res.send({
            key:mkey,
            value:mvalue,
            timestamp:new Date(doc.created_at).getTime()
        })
    })
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