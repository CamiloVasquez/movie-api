const assert = require('assert');
const proxyquiee = require('proxyquire');

const { MongoLibMock, getAllStub } = require('../utils/mocks/mongoLibs')
const { moviesMock } = require('../utils/mocks/movies')

describe("services - movies", function () {
    const MoviesServices = proxyquiee('../services/movies', {
        '../lib/mongo': MongoLibMock
    })


    const moviesServices = new MoviesServices();

    describe('when getMovies method is called', async function () {
        it('should call the getAll MongoLib method', async function (){
            await moviesServices.getMovies({});
            assert.strictEqual(getAllStub.called,true)
        });
        it('should return an array of movies',async function(){
            const result = await moviesServices.getMovies({});
            const expected = moviesMock;
            assert.deepEqual(result,expected);
        });
    });
})
