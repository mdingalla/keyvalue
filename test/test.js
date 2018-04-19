process.env.NODE_ENV = 'test';
import 'babel-polyfill';

import supertest from 'supertest';
import chai from 'chai';

import app from './../src/index';
import initDB from './../src/db';

import request from 'supertest';

import makeid from './util';

global.app = app;
global.request = supertest(app);
global.expect = chai.expect;


describe('POST API',  () => {
    it('should_post_a_key_value_and_return_value',(done)=>{
            
          request(app)
            .post('/object')
            .send({
                'mykey':'value1'
            })
            .then((res)=>{
             
                expect(res.body.key).to.be.equal('mykey');
                expect(res.body.value).to.be.equal('value1');
                
                 done();
            })
    })
})

describe('GET API - /object/mkey',()=>{
    it('should_get_a_key_and_a_return_value',(done)=>{
        request(app)
            .get('/object/mykey')
            .then((res)=>{
                expect(res.body.value).to.be.equal('value1');
                done();
            })
    })
})

describe('GET API - /object/mkey/timestamp',()=>{
    let timeStampDate = new Date();
    timeStampDate.setHours(-1);
    let rndvalue = '';

    beforeEach(()=>{
        rndvalue =makeid();
        request(app)
            .post('/object')
            .send({
                'mykey':rndvalue
            })
    })


    it('should_not_be_the_newly_inserted_value',(done)=>{
        request(app)
            .get('/object/mykey?timestamp=' + timeStampDate.getTime())
            .then((res)=>{
                expect(res.body.value).to.not.be.equal(rndvalue)
                //this will fail
                // expect(res.body.value).to.be.equal(rndvalue)
                done();
            })
    })
})




