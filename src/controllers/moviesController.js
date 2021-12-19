const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id,{
            include: [{association: 'genres'}]
        })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
                .then(function(genre){
                return res.render(path.resolve(__dirname, '..', 'views', 'moviesAdd'), {genre:genre})
                })
    },
    create: function (req,res) {
        db.Movie.create({
            title: req.body.title,
            awards:req.body.awards,
            release_date:req.body.release_date,
            length:req.body.length,
            rating:req.body.rating,
            genre_id: req.body.genre_id
        }).then(function(){res.redirect('/movies')})
    },
    edit: function(req,res) {
        let movie = db.Movie.findByPk(req.params.id)
        let genres = db.Genre.findAll()
        
        Promise.all([movie, genres])
                .then(function([movie,genres]){
                    res.render(path.resolve(__dirname, '..', 'views', 'moviesEdit'), {Movie:movie, allGenres:genres})})
                .catch(err => console.log(err))
    },
    update: function (req,res) {
        db.Movie.update({
            title: req.body.title,
            awards:req.body.awards,
            release_date:req.body.release_date,
            length:req.body.length,
            rating:req.body.rating,
            genre_id: req.body.genre_id
        },{
            where:{
                id:req.params.id
            }
        })
        res.redirect('/movies')
    },
    delete: function (req,res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => {res.render(path.resolve(__dirname, '..', 'views', 'moviesDelete'),{Movie})})
    },
    destroy: function (req,res) {
        db.Movie.destroy({
            where:{
                id: req.params.id
            }
        })
        res.redirect('/movies')
    }
}

module.exports = moviesController;