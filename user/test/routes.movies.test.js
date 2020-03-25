const assert = require('assert');
const proxyquire = require('proxyquire');

const { movieMock, MovieServiceMock } = require('../utils/mocks/movies.js');
const testServer = require('../utils/testServer');

describe('routes - movies', function () {
    const route = proxyquire('../routes/movies', {
        '../services/movies': MovieServiceMock
    });
    const request = testServer(route);
    describe('GET /movies', function () {
        it('should respond with status 200', function (done) {
            request.get('/api/movies').expect(200, done);
        });
        it('should respond with the list of the movies', function (done) {
            request.get('/api/movies').end((err, res) => {
                assert.deepEqual(res.body, {
                    data: movieMock,
                    message: 'movies listed'
                });
                done();
            })
        })
    });
});