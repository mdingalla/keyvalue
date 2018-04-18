
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
        let timestamp = req.query.timestamp || +new Date() / 1000 | 0;
        CreateOrUpdateMyStore(req.body.key,req.body.value,timestamp)
            .then((result)=>{
                return res.status(200).send(result)
            },(err)=>{
                return res.status(400).send(null)
            })
        
    }));

    router.get('/',jsonParser,((req,res)=>{
        console.log('test')
        return res.status(200).send('OK')
    }));

	return router;
}


export function CreateOrUpdateMyStore(mkey,mvalue,ts){
    return MyStore.findOne({key:mkey},((err,record)=>{
        if(record){
            return MyStore.findOneAndUpdate({_id:record._id},{
                key:mkey,
                value:mvalue
            },(err,doc,res)=>{

               if(mvalue != record.value )
               {
                MyStoreHistory.create({
                    refId:doc._id,
                    oldvalue:record.value,
                    newvalue:mvalue,
                    timestampdate:ts
                })
               }
            })
        }
        else {
            return MyStore.create({
                key:mkey,
                value:mvalue
            })

            
        }
    }))
}