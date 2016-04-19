/* global process */
'use strict';

(function (agendaController) {

    var sessionService = require('../../api/session/sessionService');
    //var preferenceService = require('../../api/preference/preferenceService');
    var helper = require('../../data/dateTimeHelper');
    var _ = require('lodash');
    
    agendaController.renderAgenda = function (req, res, next) { 
        //var todayStr = helper.getRoTodayStr(); // "2016-03-26" 
        var eventId = "itcongress2016";    
        sessionService.getByEventId(eventId, req.user, function (err, sessions) {
            if(err) { return handleError(res, err); }
            
            console.log(sessions);
            
            var length = sessions.length;
            for (var i = 0; i < length; i++) {
                var session = sessions[i];
                session.smallHr = true;
                if(i+1 < length) {
                    if(sessions[i].timeSlot !== sessions[i+1].timeSlot){
                        session.smallHr=false;
                    }
                } else { // last item
                    session.smallHr=false;
                }
                
                var rooms = [
                    {id: 'room1', name: 'Presentation Room 1'},
                    {id: 'room2', name: 'Presentation Room 2'},
                    {id: 'room3', name: 'Focus Group 1'},
                    {id: 'room4', name: 'Focus Group 2'}
                ]; 
    
                session.isRealEvent = _.some(rooms, {name:session.room});
            }

            // var menuHasDishes = menu && menu.dishes && (menu.dishes.length > 0);
            // if(menuHasDishes){                
            //     menu.dishes = _.sortBy(menu.dishes, ['category', 'option']);
                
            //     if(req.user && req.user.role === "user"){
                    
            //         // TODO: run this query in paralel with "getTodaysMenu" 
            //         preferenceService.getByEmployeeAndDate(req.user.name, todayStr, function(err, pref) {
            //             if(err) { return handleError(res, err); }

            //             menu.dishes.forEach(function(dish) {
                            
            //                 var dishesInCategory = _.filter(menu.dishes, {'category': dish.category});
                            
            //                 if(dishesInCategory.length > 1){
            //                     //var pref = _.find(preferences, {'date': menu.menuDate});
                                
            //                     if(pref){
            //                         menu.preferenceId = pref._id;
            //                     };

            //                     if(dish.category === "1"){
            //                         if(pref && pref.option1 === dish.option){
            //                             dish.isMyOption = true;
            //                         } else {
            //                             dish.isNotMyOption = true;
            //                         }
            //                     }

            //                     if(dish.category === "2"){
            //                         if(pref && pref.option2 === dish.option){
            //                             dish.isMyOption = true;
            //                         } else {
            //                             dish.isNotMyOption = true;
            //                         }
            //                     }
            //                 }
                            
            //             });

            //         });
            //     };              
            // };
            
            var context = {
                user: req.user,
                sessions: sessions,
                isAuthenticated: !!req.user
            };
            
            res.render('agenda/agenda', context);
            
        });    
    }    
    
    // menuController.renderTodaysMenu = function (req, res, next) { 
    //     var todayStr = helper.getRoTodayStr(); // "2016-03-26"       
    //     menuService.getTodaysMenu(todayStr, function (err, menu) {
    //         if(err) { return handleError(res, err); }

    //         var menuHasDishes = menu && menu.dishes && (menu.dishes.length > 0);
    //         if(menuHasDishes){                
    //             menu.dishes = _.sortBy(menu.dishes, ['category', 'option']);
                
    //             if(req.user && req.user.role === "user"){
                    
    //                 // TODO: run this query in paralel with "getTodaysMenu" 
    //                 preferenceService.getByEmployeeAndDate(req.user.name, todayStr, function(err, pref) {
    //                     if(err) { return handleError(res, err); }

    //                     menu.dishes.forEach(function(dish) {
                            
    //                         var dishesInCategory = _.filter(menu.dishes, {'category': dish.category});
                            
    //                         if(dishesInCategory.length > 1){
    //                             //var pref = _.find(preferences, {'date': menu.menuDate});
                                
    //                             if(pref){
    //                                 menu.preferenceId = pref._id;
    //                             };

    //                             if(dish.category === "1"){
    //                                 if(pref && pref.option1 === dish.option){
    //                                     dish.isMyOption = true;
    //                                 } else {
    //                                     dish.isNotMyOption = true;
    //                                 }
    //                             }

    //                             if(dish.category === "2"){
    //                                 if(pref && pref.option2 === dish.option){
    //                                     dish.isMyOption = true;
    //                                 } else {
    //                                     dish.isNotMyOption = true;
    //                                 }
    //                             }
    //                         }
                            
    //                     });

    //                 });
    //             };              
    //         };
            
    //         var context = {
    //             user: req.user,
    //             menu: menu,
    //             today: helper.getStringFromString(todayStr),
    //             menuHasDishes: menuHasDishes
    //         };
            
    //         res.render('menu/todaysMenu', context);
            
    //     });    
    // }
    
    
    // menuController.renderNextMenus = function (req, res, next) { 
    //     var todayStr = helper.getRoTodayStr(); // "2016-03-26"           
    //     menuService.getNextMenus(todayStr, function (err, menus) {
    //         if(err) { return handleError(res, err); }

    //         menus = _.map(menus, function(menu){
    //             menu.menuDateFormated = helper.getStringFromString(menu.menuDate);
    //             menu.dishes =  _.sortBy(menu.dishes, ['category', 'option']);
    //             return menu;
    //         });

    //         var context = {
    //             user: req.user,
    //             menus: menus,
    //             today: helper.getStringFromString(todayStr),
    //             areMenus: menus && (menus.length > 0)
    //         };
            
    //         if(req.user && req.user.role === "user"){
                
    //             // TODO: run this query in paralel with "getNextMenus" 
    //             preferenceService.getByEmployee(req.user.name, todayStr, function(err, preferences) {
    //                 if(err) { return handleError(res, err); }
                    
    //                 menus.forEach(function(menu) {
    //                     menu.dishes.forEach(function(dish) {
                            
    //                         var dishesInCategory = _.filter(menu.dishes, {'category': dish.category});
                            
    //                         if(dishesInCategory.length > 1){
    //                             var pref = _.find(preferences, {'date': menu.menuDate});
                                
    //                             if(pref){
    //                                 menu.preferenceId = pref._id;
    //                             };

    //                             if(dish.category === "1"){
    //                                 if(pref && pref.option1 === dish.option){
    //                                     dish.isMyOption = true;
    //                                 } else {
    //                                     dish.isNotMyOption = true;
    //                                 }
    //                             }

    //                             if(dish.category === "2"){
    //                                 if(pref && pref.option2 === dish.option){
    //                                     dish.isMyOption = true;
    //                                 } else {
    //                                     dish.isNotMyOption = true;
    //                                 }
    //                             }
    //                         }
                            
    //                     });
    //                 });

    //                 res.render('menu/myMenus', context);
    //             });
    //         } else {
    //             res.render('menu/nextMenus', context);
    //         }

    //     });    
    // }    
    
    function handleError(res, err) {
        return res.status(500).send(err);
    };

})(module.exports);