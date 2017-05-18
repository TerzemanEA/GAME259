/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


angular.module("App", [])
     //.controller("Chat", require("./controllers/chat.js"))
    // .controller("Game", require("./controllers/game.js"));
    .controller("Chat", __webpack_require__(4));


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function ($scope, $timeout) {

    var socket = io();

    $scope.send = function(msg)
    {
        socket.emit('chat message', msg);
    };

    $scope.player = {id: Math.random()*10000, x: 670, y: 465, opacity: 1};
    $scope.players = [$scope.player];

    $scope.messages = [];
    // $scope.offsetX = 0;
    // $scope.offsetY = 0;


    var animate = function ()
    {

        var x2 = 400;
        var y2 = 400;

        var x = $scope.player.x - x2;
        var y = $scope.player.y - y2;

        var r = Math.sqrt(x*x + y*y);
        var a = Math.atan(y / x);

        $scope.player.x = Math.cos(a)*(r-1) + x2;
        $scope.player.y = Math.sin(a)*(r-1) + y2;

        $scope.players.push( {x: $scope.player.x, y: $scope.player.y, opacity: 1});

        $scope.players = _.chain($scope.players)
            .map(   function    (plr) { plr.opacity-=0.01; return plr; } )
            .filter(function    (plr) { return plr.opacity > 0 } )
            .value();

        $timeout(animate, 10);
    };
    //animate();


    $scope.StopMoving = function (x,y)
    {
        $scope.offsetX = x;
        $scope.offsetY = y;
    };

    $scope.StartMoving = function (x,y)
    {
        $scope.offsetX = x;
        $scope.offsetY = y;

    };



    $scope.SelfMoving = function ()
    {
        if ($scope.offsetX === undefined)
        {
            $timeout($scope.SelfMoving, 200);
            return;
        }
        //$scope.offsetX = x2;
        //$scope.offsetY = y2;

        var x = $scope.player.x - $scope.offsetX;
        var y = $scope.player.y - $scope.offsetY;

        var r = Math.sqrt(x*x + y*y);

        if (r>=5)
        {
            var a = Math.atan(y / x);
            if ($scope.offsetX > $scope.player.x) a += Math.PI;

            $scope.player.x = Math.cos(a)*(r-8) + $scope.offsetX;
            $scope.player.y = Math.sin(a)*(r-8) + $scope.offsetY;

            $timeout($scope.SelfMoving, 35);  // скорость Меньше - быстрее
        }
        else
        {
            $timeout($scope.SelfMoving, 200);
        }

        socket.emit("player", {id: $scope.player.id,  //Сетевик.
            x: $scope.player.x,
            y: $scope.player.y});


    };

    $scope.SelfMoving();


    socket.on("player", function (plr) {
        var player = _.find($scope.players, function(x) { return x.id==plr.id; });
        if (player && player.id == $scope.player.id) return;
        if (player)
        {
            player.x = plr.x;
            player.y = plr.y;
        }
        else
        {
            $scope.players.push(plr);
        }
        $scope.$digest();
    });

    socket.on('chat message', function (msg) {
        $scope.messages.push({name: msg});
        $scope.$digest();
    });




    //ЧАТ
    $scope.usersTyping = [];
    $scope.name = "";
    $scope.message = "";
    $scope.messages = [];
    $scope.opoveshenie = "";
    $scope.typing = false;
    $scope.dataall = [];
    var to;

    socket.on('Data', function (msg)
    {
        console.log("msg",msg);
        $scope.messages = msg;
        $scope.$digest();
    });

    socket.on('chat message', function (msg)
    {
        $scope.messages.push(msg);
        $scope.$digest();
    });


    socket.on('nik message', function (msg) {

        $scope.usersTyping.push(msg);
        $scope.typing = true;
        to = $timeout(function () {
            var index = $scope.usersTyping.indexOf(msg);
            if (index != -1) $scope.usersTyping.splice(index, 1);
            $scope.typing = false;
        }, 5000);
        $scope.$digest();

    });

    $scope.Send = function () {
        $scope.data = $scope.name + ":" + $scope.message;
        socket.emit('chat message', {text: $scope.data});
        $scope.message = "";//приписываем имя к сообщению и посылаем
    };


    function stoppedTyping() {
        to = null;
        $scope.typing = false;
    }

    $scope.isTyping = function () {
        if (to) {
            $timeout.cancel(to);
            to = null;
        }
        $scope.typing = true;
        to = $timeout(stoppedTyping, 500);
        socket.emit('nik message', $scope.name);

    };
};

/***/ })
/******/ ]);