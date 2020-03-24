const express = require('express');
const MoviesService = require('../services/movies');
const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require('../utils/schemas/movies');
const validationHandler = require('../utils/middleware/validationHandler');
//const {moviesMock} =  require ('../utils/mocks/movies');

const cacheResponse = require('../utils/cacheResponse');
const {FIVE_MINUTES_IN_SECONDS,SIXTY_MINUTES_IN_SECONS} = require('../utils/time');

function moviesApi(app) {
    const router = express.Router();
    app.use("/api/movies", router);

    const moviesServices = new MoviesService();

    router.get('/', async function (req, res, next) {
        cacheResponse(res,FIVE_MINUTES_IN_SECONDS);
        const { tags } = req.query;
        try {
            const movies = await moviesServices.getMovies({ tags });
            res.status(200).json({
                data: movies,
                message: 'movies listed'
            });
        } catch (err) {
            next(err);
        }
    });

    router.get('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
        cacheResponse(res,SIXTY_MINUTES_IN_SECONS);
        const { movieId } = req.params;
        console.log(movieId);
        try {
            const movies = await moviesServices.getMovie({ movieId })
            res.status(200).json({
                data: movies,
                message: 'movie retrieve'
            });
        } catch (err) {
            next(err);
        }
    });

    router.post('/', validationHandler(createMovieSchema), async function (req, res, next) {
        const { body: movie } = req;
        try {
            const createMovieId = await moviesServices.createMovie({ movie })
            res.status(201).json({
                data: createMovieId,
                message: 'movie created'
            });
        } catch (err) {
            next(err);
        }
    });

    router.put('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), validationHandler(updateMovieSchema), async function (req, res, next) {
        const { movieId } = req.params;
        const { body: movie } = req;
        console.log(movieId);
        try {
            const updatedMovieId = await moviesServices.updateMovie({ movieId, movie })
            res.status(200).json({
                data: updatedMovieId,
                message: 'movie updated'
            });
        } catch (err) {
            next(err);
        }
    });
    /*
        router.patch('/:movieId', async function (req, res, next) {
            try {
                const { movieId } = req.params;
                const { body: movie } = req;
                const updatedMovieId = await moviesServices.updateMovie({ movieId, movie })
                res.status(284).json({
                    data: updatedMovieId,
                    message: 'movie updated'
                });
            } catch (err) {
                next(err);
            }
        });*/


    router.delete('/:movieId', validationHandler({ movieId: movieIdSchema }, 'params'), async function (req, res, next) {
        const { movieId } = req.params;
        try {
            const deletedMovieId = await moviesServices.deleteMovie({ movieId })
            res.status(200).json({
                data: deletedMovieId,
                message: 'movie deleted '
            });
        } catch (err) {
            next(err);
        }
    });
}



module.exports = moviesApi;