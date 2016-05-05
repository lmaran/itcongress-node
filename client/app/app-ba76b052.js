"use strict";var app=angular.module("itcongress",["ngCookies","ngResource","ngSanitize","ngRoute","ui.bootstrap","ui.select","ngAnimate","toastr","ngFileUpload"]);app.config(["$routeProvider","$locationProvider","$httpProvider",function(e,t,n){e.otherwise({redirectTo:"/admin"}),t.html5Mode(!0),n.interceptors.push("authInterceptor")}]),app.config(["toastrConfig",function(e){angular.extend(e,{positionClass:"toast-top-center"})}]),app.run(["$rootScope","$location","userService","$window",function(e,t,n,r){e.$on("$routeChangeStart",function(e,r,o){r.authenticate&&!n.isLoggedIn&&(e.preventDefault(),t.path("/login"))}),e.$on("$routeChangeSuccess",function(n,o,a){o.hasOwnProperty("$$route")&&(e.pageTitle=o.$$route.title),r.ga&&r.ga("send","pageview",{page:t.path(),title:e.pageTitle})}),e.goBack=function(){r.history.back()}}]),app.controller("customerEmployeeController",["$scope","$route","customerEmployeeService","$location","$q","helperValidator",function(e,t,n,r,o,a){function i(){s()}function s(){u=n.getById(t.current.params.id).then(function(t){e.customerEmployee=t})["catch"](function(e){alert(JSON.stringify(e,null,4))})}function c(e,t){var n="customerEmployee";a.setAllFildsAsValid(t),a.requiredEmail(e,t,n,"email")}var u;e.isEditMode=t.current.isEditMode,e.isFocusOnEmail=!e.isEditMode,e.isActiveOptions=[{id:!0,name:"Da"},{id:!1,name:"Nu"}],e.customerEmployee={},e.errors={},e.isEditMode&&i(),e.create=function(t){return c(e,t),t.$invalid?!1:void n.create(e.customerEmployee).then(function(t){e.goBack()})["catch"](function(n){n.data.errors?a.updateValidity(e,t,n.data.errors):alert(JSON.stringify(n.data,null,4))})},e.update=function(t){return e.customerEmployee.askForNotification&&!e.customerEmployee.email?(alert("Ai ales sa notifici clientul dar lipseste adresa de email!"),!1):(c(e,t),t.$invalid?!1:void n.update(e.customerEmployee).then(function(t){e.goBack()})["catch"](function(n){n.data.errors?a.updateValidity(e,t,n.data.errors):alert(JSON.stringify(n.data,null,4))}))}}]),app.config(["$routeProvider",function(e){e.when("/admin/customerEmployees",{controller:"customerEmployeesController",templateUrl:"app/customerEmployee/customerEmployees.html",title:"Whitelist",reloadOnSearch:!1}).when("/admin/customerEmployees/create",{controller:"customerEmployeeController",templateUrl:"app/customerEmployee/customerEmployee.html",title:"Adauga email"}).when("/admin/customerEmployees/:id",{controller:"customerEmployeeController",templateUrl:"app/customerEmployee/customerEmployee.html",title:"Editeaza email",isEditMode:!0})}]),app.factory("customerEmployeeService",["$http",function(e){var t={},n="/api/customerEmployees/";return t.getByBadge=function(t){var r="?$filter=badgeCode eq '"+t+"' and isActive eq true";return e.get(n+r).then(function(e){return e.data})},t.create=function(t){return e.post(n,t)},t.getAll=function(){return e.get(n).then(function(e){return e.data})},t.getById=function(t){return e.get(n+encodeURIComponent(t)).then(function(e){return e.data})},t.update=function(t){return e.put(n,t)},t["delete"]=function(t){return e["delete"](n+encodeURIComponent(t))},t}]),app.controller("customerEmployeesController",["$scope","$location","customerEmployeeService","modalService",function(e,t,n,r){function o(){n.getAll().then(function(t){e.customerEmployees=t})["catch"](function(e){401!==e.status&&alert(JSON.stringify(e,null,4))})}e.customerEmployees=[],e.errors={},o(),e["delete"]=function(t){var o={bodyDetails:t.name};r.confirm(o).then(function(r){for(var o in e.customerEmployees)if(e.customerEmployees[o]._id===t._id)break;n["delete"](t._id).then(function(){e.customerEmployees.splice(o,1)})["catch"](function(t){e.errors=JSON.stringify(t.data,null,4),alert(e.errors)})})},e.create=function(){t.path("/admin/customerEmployees/create")},e.refresh=function(){o()},e.mySearch=function(t){var n=!1;return e.search?new RegExp(e.search,"i").test(t.email)&&(n=!0):n=!0,n}}]),app.controller("homeController",["$scope",function(e){}]),app.config(["$routeProvider",function(e){e.when("/admin",{controller:"homeController",templateUrl:"app/home/home.html",authenticate:!0})}]),app.controller("navbarController",["$scope","$location","navbarService","$window","userService","$rootElement",function(e,t,n,r,o,a){function i(){var t=a.attr("ng-app"),o=t+"_buildInfo",i=angular.fromJson(r.sessionStorage.getItem(o));i?e.buildInfo=i:n.getAll().then(function(t){e.buildInfo=t,r.sessionStorage.setItem(o,angular.toJson(t))})["catch"](function(e){alert(JSON.stringify(e,null,4))})}e.menu=[{title:"Meniul de astazi",link:"/admin/todayMenu"},{title:"Meniurile viitoare",link:"/admin/nextMenus"},{title:"Contact",link:"/admin/contact"}],e.isCollapsed=!0,e.isLoggedIn=o.isLoggedIn,e.isAdmin=o.isAdmin,e.getCurrentUser=o.getCurrentUser,e.buildInfo={},i(),e.logout=function(){o.logout()},e.isActive=function(e){return e===t.path()}}]),app.factory("navbarService",["$http",function(e){var t={},n="/api/buildInfo/";return t.getAll=function(){return e.get(n).then(function(e){return e.data})},t}]),app.controller("sessionController",["$scope","$route","sessionService","$location","$q","helperValidator","speakerService",function(e,t,n,r,o,a,i){function s(){c(),o.all([l,d]).then(function(t){e.session.speaker1&&(e.session.speaker1=_.find(e.speakers,{_id:e.session.speaker1._id})),e.session.speaker2&&(e.session.speaker2=_.find(e.speakers,{_id:e.session.speaker2._id}),console.log(e.session.speaker1))},function(e){alert("failure")})}function c(){l=n.getById(t.current.params.id).then(function(t){e.session=t})["catch"](function(e){alert(JSON.stringify(e,null,4))})}function u(){d=i.getAllSummary().then(function(t){e.speakers=t})["catch"](function(e){alert(JSON.stringify(e,null,4))})}var l,d;e.isEditMode=t.current.isEditMode,e.isFocusOnEmail=!e.isEditMode,e.obj={},e.isActiveOptions=[{id:!0,name:"Da"},{id:!1,name:"Nu"}],e.timeSlotList=[{name:"18 May, 08:45 - 09:30"},{name:"18 May, 09:30 - 10:00"},{name:"18 May, 10:00 - 10:45"},{name:"18 May, 11:00 - 11:45"},{name:"18 May, 12:00 - 12:45"},{name:"18 May, 12:45 - 14:00"},{name:"18 May, 14:00 - 14:45"},{name:"18 May, 15:00 - 15:45"},{name:"18 May, 16:00 - 16:45"},{name:"18 May, 17:00 - 17:45"},{name:"18 May, 17:45 - 18:30"},{name:"19 May, 09:00 - 09:45"},{name:"19 May, 10:00 - 10:45"},{name:"19 May, 11:00 - 11:45"},{name:"19 May, 12:00 - 12:45"},{name:"19 May, 12:45 - 14:00"},{name:"19 May, 14:00 - 14:45"},{name:"19 May, 15:00 - 15:45"},{name:"19 May, 16:00 - 16:45"},{name:"19 May, 17:00 - 17:45"},{name:"19 May, 17:45 - 18:30"}],e.rooms=[{id:"room1",name:"Presentation Room 1"},{id:"room2",name:"Presentation Room 2"},{id:"room3",name:"Focus Group 1"},{id:"room4",name:"Focus Group 2"},{id:"expo",name:"Spatiul Expozitional"}],e.brands=[{name:"ADVANTECH"},{name:"DELL"},{name:"CISCO"},{name:"CITRIX"},{name:"MICROSOFT"},{name:"VEEAM"},{name:"SAMSUNG"},{name:"NETAPP"},{name:"ORACLE"},{name:"XEROX"},{name:"FORTINET"},{name:"HIKVISION"},{name:"VMWARE"},{name:"PALO ALTO"},{name:"HP"},{name:"EXCEL NETWORKING"},{name:"ELO DIGITAL"}],e.speakers=[],e.session={},e.errors={},u(),e.isEditMode&&s(),e.create=function(t){n.create(e.session).then(function(t){e.goBack()})["catch"](function(n){n.data.errors?a.updateValidity(e,t,n.data.errors):alert(JSON.stringify(n.data,null,4))})},e.update=function(t){n.update(e.session).then(function(t){e.goBack()})["catch"](function(n){n.data.errors?a.updateValidity(e,t,n.data.errors):alert(JSON.stringify(n.data,null,4))})}}]),app.config(["$routeProvider",function(e){e.when("/admin/sessions",{controller:"sessionsController",templateUrl:"app/session/sessions.html",title:"Agenda",reloadOnSearch:!1}).when("/admin/sessions/create",{controller:"sessionController",templateUrl:"app/session/session.html",title:"Adauga sesiune"}).when("/admin/sessions/:id",{controller:"sessionController",templateUrl:"app/session/session.html",title:"Editeaza sesiune",isEditMode:!0})}]),app.factory("sessionService",["$http",function(e){var t={},n="/api/sessions/";return t.getByBadge=function(t){var r="?$filter=badgeCode eq '"+t+"' and isActive eq true";return e.get(n+r).then(function(e){return e.data})},t.create=function(t){return e.post(n,t)},t.getAll=function(){return e.get(n).then(function(e){return e.data})},t.getById=function(t){return e.get(n+encodeURIComponent(t)).then(function(e){return e.data})},t.update=function(t){return e.put(n,t)},t["delete"]=function(t){return e["delete"](n+encodeURIComponent(t))},t}]),app.controller("sessionsController",["$scope","$location","sessionService","modalService",function(e,t,n,r){function o(){n.getAll().then(function(t){t.forEach(function(e){e.maxAttendees=a(e.room)}),e.sessions=t})["catch"](function(e){401!==e.status&&alert(JSON.stringify(e,null,4))})}function a(e){switch(e){case"room1":return 230;case"room2":return 230;case"room3":return 80;case"room4":return 80;default:return""}}e.sessions=[],e.errors={},o(),e["delete"]=function(t){var o={bodyDetails:t.name};r.confirm(o).then(function(r){for(var o in e.sessions)if(e.sessions[o]._id===t._id)break;n["delete"](t._id).then(function(){e.sessions.splice(o,1)})["catch"](function(t){e.errors=JSON.stringify(t.data,null,4),alert(e.errors)})})},e.create=function(){t.path("/admin/sessions/create")},e.refresh=function(){o()}}]),app.controller("speakerController",["$scope","$route","speakerService","$location","$q","helperValidator","Upload",function(e,t,n,r,o,a,i){function s(){c()}function c(){u=n.getById(t.current.params.id).then(function(t){e.speaker=t})["catch"](function(e){alert(JSON.stringify(e,null,4))})}var u;e.isEditMode=t.current.isEditMode,e.isFocusOnEmail=!e.isEditMode,e.obj={},e.isActiveOptions=[{id:!0,name:"Da"},{id:!1,name:"Nu"}],e.timeSlotList=[{name:"18 May, 08:45 - 09:30"},{name:"18 May, 09:30 - 10:00"},{name:"18 May, 10:00 - 10:45"},{name:"18 May, 11:00 - 11:45"},{name:"18 May, 12:00 - 12:45"},{name:"18 May, 12:45 - 14:00"},{name:"18 May, 14:00 - 14:45"},{name:"18 May, 15:00 - 15:45"},{name:"18 May, 16:00 - 16:45"},{name:"18 May, 17:00 - 17:45"},{name:"18 May, 17:45 - 18:30"},{name:"19 May, 09:00 - 09:45"},{name:"19 May, 10:00 - 10:45"},{name:"19 May, 11:00 - 11:45"},{name:"19 May, 12:00 - 12:45"},{name:"19 May, 12:45 - 14:00"},{name:"19 May, 14:00 - 14:45"},{name:"19 May, 15:00 - 15:45"},{name:"19 May, 16:00 - 16:45"},{name:"19 May, 17:00 - 17:45"},{name:"19 May, 17:45 - 18:30"}],e.rooms=[{id:"room1",name:"Presentation Room 1"},{id:"room2",name:"Presentation Room 2"},{id:"room3",name:"Focus Group 1"},{id:"room4",name:"Focus Group 2"},{id:"expo",name:"Spatiul Expozitional"}],e.brands=[{name:"ADVANTECH"},{name:"DELL"},{name:"CISCO"},{name:"CITRIX"},{name:"MICROSOFT"},{name:"VEEAM"},{name:"SAMSUNG"},{name:"NETAPP"},{name:"ORACLE"},{name:"XEROX"},{name:"FORTINET"},{name:"HIKVISION"},{name:"VMWARE"},{name:"PALO ALTO"},{name:"HP"},{name:"EXCEL NETWORKING"},{name:"ELO DIGITAL"}],e.speaker={},e.errors={},e.isEditMode&&s(),e.create=function(t){n.create(e.speaker).then(function(t){e.goBack()})["catch"](function(n){n.data.errors?a.updateValidity(e,t,n.data.errors):alert(JSON.stringify(n.data,null,4))})},e.update=function(t){n.update(e.speaker).then(function(t){e.goBack()})["catch"](function(n){n.data.errors?a.updateValidity(e,t,n.data.errors):alert(JSON.stringify(n.data,null,4))})},e.upload=function(e){i.upload({url:"api/speakers/upload",data:{file:e,"Content-Type":""!=e.type?e.type:"application/octet-stream",username:"$scope.username"}}).then(function(e){console.log("Success "+e.config.data.file.name+"uploaded. Response: "+e.data)},function(e){console.log("Error status: "+e.status)},function(e){var t=parseInt(100*e.loaded/e.total);console.log("progress: "+t+"% "+e.config.data.file.name)})}}]),app.config(["$routeProvider",function(e){e.when("/admin/speakers",{controller:"speakersController",templateUrl:"app/speaker/speakers.html",title:"Speakers",reloadOnSearch:!1}).when("/admin/speakers/create",{controller:"speakerController",templateUrl:"app/speaker/speaker.html",title:"Adauga speaker"}).when("/admin/speakers/:id",{controller:"speakerController",templateUrl:"app/speaker/speaker.html",title:"Editeaza speaker",isEditMode:!0})}]),app.factory("speakerService",["$http",function(e){var t={},n="/api/speakers/";return t.getByBadge=function(t){var r="?$filter=badgeCode eq '"+t+"' and isActive eq true";return e.get(n+r).then(function(e){return e.data})},t.getAllSummary=function(){var t="?$select=_id, name";return e.get(n+t).then(function(e){return e.data})},t.create=function(t){return e.post(n,t)},t.getAll=function(){return e.get(n).then(function(e){return e.data})},t.getById=function(t){return e.get(n+encodeURIComponent(t)).then(function(e){return e.data})},t.update=function(t){return e.put(n,t)},t["delete"]=function(t){return e["delete"](n+encodeURIComponent(t))},t}]),app.controller("speakersController",["$scope","$location","speakerService","modalService",function(e,t,n,r){function o(){n.getAll().then(function(t){e.speakers=t})["catch"](function(e){401!==e.status&&alert(JSON.stringify(e,null,4))})}e.speakers=[],e.errors={},o(),e["delete"]=function(t){var o={bodyDetails:t.name};r.confirm(o).then(function(r){for(var o in e.speakers)if(e.speakers[o]._id===t._id)break;n["delete"](t._id).then(function(){e.speakers.splice(o,1)})["catch"](function(t){e.errors=JSON.stringify(t.data,null,4),alert(e.errors)})})},e.create=function(){t.path("/admin/speakers/create")},e.refresh=function(){o()}}]),app.controller("userController",["$scope","$route","userService","$location","helperValidator","toastr",function(e,t,n,r,o,a){function i(){s()}function s(){n.getById(t.current.params.id).then(function(t){e.user=t})["catch"](function(e){401!==e.status&&alert(JSON.stringify(e,null,4))})}function c(e,t){var n="user";o.setAllFildsAsValid(t),o.required50(e,t,n,"name"),o.requiredEmail(e,t,n,"email")}e.isEditMode=t.current.isEditMode,e.isFocusOnName=!e.isEditMode,e.user={},e.errors={},e.isEditMode&&i(),e.create=function(t){return c(e,t),t.$invalid?!1:void n.create(e.user).then(function(t){e.goBack()})["catch"](function(n){n.data.errors?o.updateValidity(e,t,n.data.errors):alert(JSON.stringify(n.data,null,4))})},e.update=function(t){e.submitted=!0,t.$valid&&n.update(e.user).then(function(e){r.path("/admin/users")})["catch"](function(e){alert(JSON.stringify(e.data,null,4))})}}]),app.config(["$routeProvider",function(e){e.when("/admin/users",{controller:"usersController",templateUrl:"app/user/users.html",title:"Utilizatori"}).when("/admin/users/create",{controller:"userController",templateUrl:"app/user/user.html",title:"Adauga utilizator"}).when("/admin/users/:id",{controller:"userController",templateUrl:"app/user/user.html",title:"Editeaza utilizator",isEditMode:!0}).when("/admin/login",{controller:"loginController",templateUrl:"app/user/login/login.html",title:"Autentificare"}).when("/admin/register",{controller:"registerController",templateUrl:"app/user/register/register.html",title:"Inregistrare"}).when("/admin/changePassword",{controller:"changePasswordController",templateUrl:"app/user/changePassword/changePassword.html",title:"Schimba parola",authenticate:!0}).when("/admin/resetpassword",{controller:"resetPasswordController",templateUrl:"app/user/resetPassword/forgotPassword.html",title:"Reseteaza parola"}).when("/admin/resetpassword:ptoken",{controller:"resetPasswordController",templateUrl:"app/user/resetPassword/resetPassword.html",title:"Reseteaza parola"})}]),app.factory("userService",["$http","$cookies","$q","$window",function(e,t,n,r){var o={},a="/api/users/";o.create=function(t){return e.post(a,t)},o.getAll=function(){return e.get(a).then(function(e){return e.data})},o.getById=function(t){return e.get(a+encodeURIComponent(t)).then(function(e){return e.data})},o.update=function(t){return e.put(a,t)},o["delete"]=function(t){return e["delete"](a+encodeURIComponent(t))};var i={};return t.get("user")&&(i=angular.fromJson(t.get("user"))),o.changePassword=function(t,n){return e.put(a+"me/changepassword",{oldPassword:t,newPassword:n})},o.login=function(t,r){var o=r||angular.noop,a=n.defer();return e.post("/login",{email:t.email,password:t.password}).success(function(e){return i=e,a.resolve(e),o()}).error(function(e){return this.logout(),a.reject(e),o(e)}.bind(this)),a.promise},o.logout=function(){r.location.href="/logout"},o.getCurrentUser=function(){return i},o.isLoggedIn=function(){return i.hasOwnProperty("role")},o.isAdmin=function(){return"admin"===i.role},o}]),app.controller("usersController",["$scope","$http","userService","modalService","$location","$window",function(e,t,n,r,o,a){function i(){n.getAll().then(function(t){t.forEach(function(e,t){e.id2=t+1}),e.users=t})["catch"](function(e){401!==e.status&&alert(JSON.stringify(e,null,4))})}i(),e.isWaitingSelected=!1,e.refresh=function(){i()},e.create=function(){o.path("/admin/users/create")},e["delete"]=function(t){var o={bodyDetails:t.name};r.confirm(o).then(function(r){n["delete"](t._id),angular.forEach(e.users,function(n,r){n===t&&e.users.splice(r,1)}),n.getCurrentUser().name===t.name&&(n.logout(),a.location.href="/")})},e.mySearch=function(t){var n=!0;if(e.search){if(!(new RegExp(e.search,"i").test(t.name)||new RegExp(e.search,"i").test(t.email)||new RegExp(e.search,"i").test(t.company)))return!1;n=!0}return e.isWaitingSelected&&(n="WaitingForApproval"===t.status),n},e.activateUser=function(e){"WaitingForApproval"===e.status&&(e.status=null),e.isActive=!0,n.update(e).then(function(e){i()})["catch"](function(e){alert(JSON.stringify(e.data,null,4))})},e.deactivateUser=function(e){"WaitingForApproval"===e.status&&(e.status=null),e.isActive=!1,n.update(e).then(function(e){i()})["catch"](function(e){alert(JSON.stringify(e.data,null,4))})}}]),app.directive("lmCollapse",[function(){return{link:function(e,t,n){function r(){t.removeClass("collapsing").addClass("collapse in").css({height:"auto"})}function o(){t.css({height:"0"}),t.removeClass("collapsing").addClass("collapse")}e.$watch(n.lmCollapse,function(e){e?o():r()})}}}]),app.directive("lmFocus",["$timeout",function(e){return{restrict:"A",link:function(t,n,r){"true"===r.lmFocus||""===r.lmFocus?e(function(){n[0].focus()},0):(t.$watch(r.lmFocus,function(t,r){e(function(){t&&n[0].focus()},0)}),n.bind("blur",function(n){e(function(){t.$apply(r.lmFocus+"=false")},0)}),n.bind("focus",function(n){e(function(){t.$apply(r.lmFocus+"=true")},0)}))}}}]),app.directive("myMatch",function(){return{require:"ngModel",restrict:"A",scope:{match:"="},link:function(e,t,n,r){e.$watch(function(){return r.$pristine&&angular.isUndefined(r.$modelValue)||e.match===r.$modelValue},function(e){r.$setValidity("match",e)})}}}),app.directive("stopEmailValidation",function(){var e=/./;return{require:"ngModel",restrict:"",priority:2,link:function(t,n,r,o){o&&o.$validators.email&&(o.$validators.email=function(t){return o.$isEmpty(t)||e.test(t)})}}}),angular.module("ngLocale",[],["$provide",function(e){var t={ZERO:"zero",ONE:"one",TWO:"two",FEW:"few",MANY:"many",OTHER:"other"};e.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["duminică","luni","marți","miercuri","joi","vineri","sâmbătă"],MONTH:["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"],SHORTDAY:["Du","Lu","Ma","Mi","Jo","Vi","Sâ"],SHORTMONTH:["ian.","feb.","mar.","apr.","mai","iun.","iul.","aug.","sept.","oct.","nov.","dec."],fullDate:"EEEE, d MMMM y",longDate:"d MMMM y",medium:"dd.MM.yyyy HH:mm:ss",mediumDate:"dd.MM.yyyy",mediumTime:"HH:mm:ss","short":"dd.MM.yyyy HH:mm",shortDate:"dd.MM.yyyy",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"RON",DECIMAL_SEP:",",GROUP_SEP:".",PATTERNS:[{gSize:3,lgSize:3,macFrac:0,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,macFrac:0,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"ro-ro",pluralCat:function(e){return 1==e?t.ONE:0==e||1!=e&&e==(0|e)&&e%100>=1&&19>=e%100?t.FEW:t.OTHER}})}]),app.factory("authInterceptor",["$rootScope","$q","$cookies","$location","$window",function(e,t,n,r,o){return{responseError:function(e){return 401===e.status?(r.path("/admin/login"),t.reject(e)):t.reject(e)}}}]),app.factory("helperService",[function(){var e={};return e.getRoDay=function(e){return 0===e?"Duminica":1===e?"Luni":2===e?"Marti":3===e?"Miercuri":4===e?"Joi":5===e?"Vineri":6===e?"Sambata":void 0},e.getRoShortDay=function(e){return 0===e?"Du":1===e?"Lu":2===e?"Ma":3===e?"Mi":4===e?"Jo":5===e?"Vi":6===e?"Sa":void 0},e.getRoMonth=function(e){return 0===e?"Ianuarie":1===e?"Februari":2===e?"Martie":3===e?"Aprilie":4===e?"Mai":5===e?"Iunie":6===e?"Iulie":7===e?"August":8===e?"Septembrie":9===e?"Octombrie":10===e?"Noiembrie":11===e?"Decembrie":void 0},e.getRoShortMonth=function(e){return 0===e?"Ian.":1===e?"Feb.":2===e?"Mar.":3===e?"Apr.":4===e?"Mai":5===e?"Iun.":6===e?"Iul.":7===e?"Aug.":8===e?"Sep.":9===e?"Oct.":10===e?"Nov.":11===e?"Dec.":void 0},e.getFriendlyDate=function(e){var t=e.getDate(),n=e.getMonth()+1,r=e.getFullYear(),o=t;10>o&&(o="0"+t);var a=n;return 10>a&&(a="0"+n),{dayAsString:this.getRoDay(e.getDay()),dayAsShortString:this.getRoShortDay(e.getDay()),dayOfMonth:o,monthAsString:this.getRoMonth(n-1),monthAsShortString:this.getRoShortMonth(n-1),year:r,ymd:r+"-"+a+"-"+o,dmy:o+"."+a+"."+r}},e.getDateFromString=function(e){var t=e.split("-"),n=t[1];return"0"===n[0]&&(n=n.charAt(1)),n-=1,new Date(t[0],n,t[2])},e.getStringFromString=function(e){var t=this.getDateFromString(e),n=this.getFriendlyDate(t),r=n.dayAsString+", "+n.dayOfMonth+" "+n.monthAsString+" "+n.year;return r},e.getObjFromString=function(e){var t=this.getDateFromString(e),n=this.getFriendlyDate(t);return{dayAsString:n.dayAsString,dayAsShortString:n.dayAsShortString,dayOfMonth:n.dayOfMonth,monthAsString:n.monthAsString,monthAsShortString:n.monthAsShortString,year:n.year,dateAsShortString:n.dayOfMonth+" "+n.monthAsShortString+" "+n.year}},e.getStringFromDate=function(e){return this.getFriendlyDate(e).ymd},e.makeId=function(e){for(var t="",n="abcdef0123456789",r=0;e>r;r+=1)t+=n.charAt(Math.floor(Math.random()*n.length));return t},e}]),app.service("helperValidator",[function(){function e(e,t,n,r){t[n].$setValidity("myValidation",!1),e.errors[n]=r}function t(e){var t=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return t.test(e)}function n(e){return void 0===e||""===e||null===e}this.required=function(t,r,o,a){t[o][a]=t[o][a]||"";var i=t[o][a];n(i)&&e(t,r,a,"Acest camp este obligatoriu.")},this.required50=function(t,r,o,a){t[o][a]=t[o][a]||"";var i=t[o][a];n(i)?e(t,r,a,"Acest camp este obligatoriu."):i.length>50&&e(t,r,a,"Maxim 50 caractere.")},this.requiredEmail=function(r,o,a,i){var s=r[a][i];n(s)?e(r,o,i,"Acest camp este obligatoriu."):t(s)?s.length>50&&e(r,o,i,"Maxim 50 caractere."):e(r,o,i,"Adresa de email invalida.")},this.optionalEmail=function(n,r,o,a){var i=n[o][a];i&&i.length>0&&!t(i)?e(n,r,a,"Adresa de email invalida."):i&&i.length>50&&e(n,r,a,"Maxim 50 caractere.")},this.optional50=function(t,n,r,o){var a=t[r][o];a&&a.length>50&&e(t,n,o,"Maxim 50 caractere.")},this.requiredDate=function(t,r,o,a){var i=t[o][a];n(i)?e(t,r,a,"Acest camp este obligatoriu."):i instanceof Date==!1?e(t,r,a,"Data invalida."):i.length>50&&e(t,r,a,"Maxim 50 caractere.")},this.updateValidity=function(t,n,r){angular.forEach(r,function(r,o){e(t,n,r.field,r.msg)})},this.setAllFildsAsValid=function(e){angular.forEach(e,function(e,t){0!==t.indexOf("$")&&angular.forEach(e.$error,function(t,n){e.$setValidity(n,null)})})}}]),app.service("modalService",["$uibModal",function(e){this.show=function(t,n){var r={},o={};return angular.extend(r,t),angular.extend(o,n),r.controller||(r.controller=["$scope","$uibModalInstance",function(e,t){e.modalOptions=o,e.modalOptions.ok=function(e){t.close(e)},e.modalOptions.close=function(e){t.dismiss("cancel")}}]),e.open(r).result},this.confirm=function(e){var t={animation:!1,templateUrl:"app/common/templates/confirm.html"},n={closeButtonText:"Renunta",actionButtonText:"Sterge",headerText:"Sterge",bodyTitle:"Esti sigur ca vrei sa stergi aceasta inregistrare?",bodyDetails:""};return angular.extend(n,e),this.show(t,n)},this.showImage=function(e){var t={templateUrl:"app/common/templates/showImage.html"};return this.show(t,e)}}]),app.controller("changePasswordController",["$scope","userService",function(e,t){e.errors={},e.changePassword=function(n){e.submitted=!0,n.$valid&&t.changePassword(e.user.oldPassword,e.user.newPassword).then(function(){e.message="Parola a fost schimbata cu succes."})["catch"](function(){n.password.$setValidity("mongoose",!1),e.errors.other="Parola incorecta",e.message=""})}}]),app.controller("loginController",["$scope","userService","$location",function(e,t,n){e.user={},e.errors={},e.login=function(r){e.submitted=!0,r.$valid&&t.login({email:e.user.email,password:e.user.password}).then(function(){n.path("/admin/")})["catch"](function(t){e.errors.other=t.message})}}]),app.controller("registerController",["$scope","userService","$location",function(e,t,n){e.user={},e.errors={},e.register=function(r){e.submitted=!0,r.$valid&&t.create({name:e.user.name,email:e.user.email,password:e.user.password}).then(function(){n.path("/admin/")})["catch"](function(t){t=t.data,e.errors={},angular.forEach(t.errors,function(t,n){r[n].$setValidity("mongoose",!1),e.errors[n]=t.message})})}}]),app.controller("resetPasswordController",["$scope","userService",function(e,t){e.errors={},e.resetPassword=function(t){e.submitted=!0}}]);