process.env.NODE_ENV = 'test';
import 'babel-polyfill';

import supertest from 'supertest';
import chai from 'chai';

import app from './../src/index';
import initDB from './../src/db';

import request from 'supertest';

global.app = app;
global.request = supertest(app);
global.expect = chai.expect;


describe('POST API',  () => {
    it('should_post_a_key_value_and_return_value',()=>{
         request(app)
            .post('/object')
            .send({
                'mykey':'value1'
            })
            .end((err,res)=>{
                expect(res.body.key).to.be.equal('mykey');
                done(err)
            })
    })
})
