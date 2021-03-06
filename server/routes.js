'use strict';

var errors = require('./components/errors');
var path = require('path');
var auth = require('./api/user/login/loginService');
var logger = require("./logging/logger");
var reqHelper = require("./logging/reqHelper");

module.exports = function(app) {
    
    // API routes
    app.get('/api/users/checkEmail/:email',  require('./api/user/userController').checkEmail);    
    app.use('/api/users',require('./api/user/userRoutes'));
    
    app.post('/api/myActions', auth.isAuthenticated(), require('./api/attendee/attendeeController').saveMyAction);
    
    app.use('/api/buildInfo', require('./api/buildInfo/buildInfoRoutes'));   
    
    app.get('/api/customerEmployees/checkEmail/:email',  require('./api/customerEmployee/customerEmployeeController').checkEmail);
    app.use('/api/customerEmployees', auth.hasRole('admin'), require('./api/customerEmployee/customerEmployeeRoutes'));
    app.use('/api/sessions', auth.hasRole('admin'), require('./api/session/sessionRoutes'));

    app.get('/api/speakers/:id', require('./api/speaker/speakerController').getById);    
    app.use('/api/speakers', auth.hasRole('admin'), require('./api/speaker/speakerRoutes'));
    
    app.use('/api/brands', auth.hasRole('admin'), require('./api/brand/brandRoutes'));

    
    // RPC routes
    app.post('/login/', require('./api/user/login/local/loginLocalController').authenticate);       
    app.get('/logout', auth.isAuthenticated(), require('./api/user/logout/logoutController').logout);
    app.post('/me/changepassword', auth.isAuthenticated(), require('./api/user/userController').changePassword); 
    
    // // server-side views
    app.get('/',function(req,res){res.render('home/home', {user: req.user, env:process.env.NODE_ENV});}); 
    app.get('/contact', function(req,res){res.render('contact/contact', {user: req.user});});
    // app.get('/login', function(req,res){res.render('user/login-closed');});   
    // app.get('/register', function(req,res){res.render('user/register-closed', {lastName: req.query.name, firstName: req.query.surname, company: req.query.company, phone: req.query.phone, email: req.query.mail, companyOwner: req.query.companyOwner, owner: req.query.owner });});

    app.get('/login', function(req,res){res.render('user/login');});
    app.get('/register', function(req,res){res.render('user/register', {lastName: req.query.name, firstName: req.query.surname, company: req.query.company, phone: req.query.phone, email: req.query.mail, companyOwner: req.query.companyOwner, owner: req.query.owner });});

    app.get('/registerConfirm', function(req,res){res.render('user/registerConfirm')});  
    app.get('/registerConfirmWait', function(req,res){res.render('user/registerConfirmWait')});   
    
    app.get('/activate/:id', require('./api/user/userController').activateUser); 
    app.post('/activate/:id', require('./api/user/userController').saveActivationData); 
    
    app.get('/changePassword', auth.isAuthenticated(), function(req,res){res.render('user/changePassword', {user: req.user});});
    app.get('/agenda', require('./views/agenda/agendaController').renderAgenda);     

    
    // client-side views   
    app.get('/admin', auth.hasRole('admin'), function(req, res) {res.sendFile(path.resolve(app.get('appPath') + '/index.html'));});    
    app.get('/admin|/admin/*', function(req, res) {res.sendFile(path.resolve(app.get('appPath') + '/index.html'));});

  
    // All undefined asset or api routes should return a 404
    app.get('/:url(api|auth|components|app|bower_components|assets)/*', errors[404]);       
};