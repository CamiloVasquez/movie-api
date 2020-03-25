const express = require('express');

const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies.js');

const {
    logErrors,wrapErrors, errorHandler } 
    = require('./utils/middleware/errorHandlers.js');

const notFoundHandler = require ('./utils/middleware/notFoundHandler');

app.use(express.json());

moviesApi(app);

app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

/*app.get('/',function(req,res){
    res.send('Hola mundo');
});
app.get('/json',function(req,res){
    res.json({Hola:  'mundo'});
});

app.get('/year/:year',function(req,res){
    const year = parseInt(req.params.year);
    const leapYear = (year) => {
        return year % 4 === 0 ;
    }
    const isLearYear  = leapYear (year);
    const message = isLearYear ? 'Yes, it is a leaap-year': 'Nop, It is not a leap-year';
    res.send( {isLearYear:isLearYear , year:year ,message:message});
});*/



app.listen(config.port, function () {
    console.log(`Listening http://localhost:${config.port}`);
});

