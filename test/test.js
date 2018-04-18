process.env.NODE_ENV = 'test';
import 'babel-polyfill';

import {expect} from 'chai';
import {chaiHttp} from 'chai-http';

import app from './../src/index';
import initDB from './../src/db';

import request from 'supertest';


describe('POST API',  () => {
    it('should_post_a_key_value_and_return_value',()=>{
        return request(app)
            .post('/object')
            .send({
                'mykey':'value1'
            })
            .then((res)=>{
                expect(res.body.key).to.be.equal('mykey')
            })
    })
})
