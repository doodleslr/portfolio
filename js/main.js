window.addEventListener('load', function(event){

    'use strict';

    //init functions
    let planetArr;
    const reqUrl = "js/planets.json";
    
    const requestJSON   =   function(){
        let request = new XMLHttpRequest();
        request.open("GET", reqUrl);
        request.responseType = "json";
        request.send();

        request.onload = function(){
            planetArr = request.response;
        };
        return true;
        
    }

    var ctx = document.querySelector('canvas').getContext('2d');

    var drawPlanet = function(){
        for(var i = 0; i < planetArr.planet.length; i++) {
            display.drawPlanet  (   
                planetArr.planet[i].x, 
                planetArr.planet[i].y, 
                planetArr.planet[i].radius, 
                planetArr.planet[i].color
            );
        };
    };

    var genOnce = true;
    var genPlanet = function(){
        for(var i = planetArr.planet.length - 1; i > -1; --i) {
            game.world.planetArr(
                planetArr.planet[i].x, 
                planetArr.planet[i].y, 
                planetArr.planet[i].radius, 
                planetArr.planet[i].color,
                planetArr.planet[i].name
            );
        };
    };

    var playerRotate = function(){
        ctx.save();
        ctx.translate   (   game.world.player.x + game.world.player.width / 2, 
                            game.world.player.y + game.world.player.height / 2
                        );
        ctx.rotate(game.world.player.angle);
        display.drawPlayer  (
                                game.world.player.width /-2,
                                game.world.player.height / -2,
                                game.world.player.width,
                                game.world.player.height,
                                game.world.player.color,
                                game.world.player.angle
                            );
        ctx.restore();
    };

    var keyDownUp = function(event) { controller.keyDownUp(event.type, event.keyCode); };

    var update = function(){
        // player controls
        if(controller.left.active || controller.right.active || controller.up.active)  {
            game.world.player.update(controller);
        };

        // world background
        display.bg(game.world.background_color);
        
        // draw and generate planets
        drawPlanet();
        if(genOnce){
            genPlanet();
            genOnce = false;
        }

        // player rotation
        playerRotate();

        game.world.update();
    };

    // KEEP RESIZE
    // var resize = function(event) {
    //     // display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
    //     // display.render();
    
    // };

    //handles user input
    var controller   = new Controller();
    //holds game logic
    var game         = new Game();
    //targets canvas and resizing
    var display      = new Display(document.querySelector('canvas'), game.world.height, game.world.width);
    //where above modules interact
    var engine       = new Engine(1000/30, update);
    
    //window.addEventListener('resize', resize);
    window.addEventListener('keydown', keyDownUp);
    window.addEventListener('keyup', keyDownUp);

    //resize();

    if(requestJSON()){
        engine.start();
    } else {
        alert(reqUrl + ' array not found');
    };
});