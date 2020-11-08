var canvas = document.getElementById('game');
let config = {
    // Whether Handsfree should automatically start after instantiation
    autostart: false,
  
    debugger: {
      // Where to inject the debugger into
      target: document.body,
      enabled: false

    },
  
    sensitivity: {
      // A factor to adjust the cursors move speed by
      xy: 0.5,
      // How much wider (+) or narrower (-) a smile needs to be to click
      click: 0
    },

    click: {
      // Morphs to watch for and their required confidences
      morphs: {
        6: 0.3
      }
    },
    stabilizer: {
      // How much stabilization to use: 0 = none, 3 = heavy
      factor: 1,
      // Number of frames to stabilizer over
      buffer: 30
    },
  
    // Configs specific to plugins
    plugin: {
      click: {
        // Morphs to watch for and their required confidences
        morphs: {
       
          6: 0.5
        }
      },
  
      vertScroll: {
        // The multiplier to scroll by. Lower numbers are slower
        scrollSpeed: 0.05,
        // How many pixels from the the edge to scroll
        scrollZone: 0
      }
    }
  }
  

var handsfree = new Handsfree(config);


/* ============= GAME SETUP ============= */

// declares variables for the game canvas and its context

var ctx = canvas.getContext('2d');

var stage = {
    // defines width and height for the canvas
    viewport : [600, 600],
    // sets the new center of the canvas
    center : function() {
        return [this.viewport[0]/2, this.viewport[0]/2];
    },
}

/* ============= UTILITIES ============= */

// a collection of useful functions
var utils = {
    // converts radians to degrees
    toDegrees : function(rads) {
        return rads * 180 / Math.PI;
    },
    // checks if integer is in range (from and to are both inclusive)
    numberInRange : function(value, from, to) {
        return (Math.round(value) >= from && Math.round(value) <= to)
    },
}

// colors used to draw stuff
var color = {
    'gold' : '#ba9314',
    'black' : '#000',
    'white' : '#FFF',
    'red' : '#F00',
    'green' : '#49a81e',
    'silver' : '#CCC',
    'yellow' : '#FFFF00',
}

var input = {
    // the current position for the aim
    x : 0,
    y : 0
}

/* ============= RENDERING ============= */

var draw = {
    board : function() {
        // outer black
        ctx.fillStyle = color.black;
        ctx.strokeStyle = color.gold;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 298, 0, 180);
        ctx.fill();
        ctx.stroke();
        ctx.save();
        // outer white stroke
        ctx.strokeStyle = color.white;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 290, 0, 360);
        ctx.stroke();
        ctx.save();

        // draw each sector
        for(var i = 0; i < 20; i ++) {
            if (i % 2 == 0) {
                ctx.fillStyle = color.white;
            } else {
                ctx.fillStyle = color.black;
            }
            // the sector
            ctx.save();
            ctx.strokeStyle = color.gold;
            ctx.lineWidth = 3;
            ctx.rotate((Math.PI / 180) * 18 * i);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, 225, 0, (18 * Math.PI) / 180);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // double ring
            ctx.fillStyle = color.black;
            ctx.strokeStyle = (i % 2 == 0) ? color.green : color.red;
            ctx.lineWidth = 12;
            ctx.beginPath();
            // draw arc stroke -- because strokes as drawn from a center and expanded to both sides, we need to
            // set an offset (which in this case is lineWidth/2 = 6)
            ctx.arc(0, 0, 226 + 6, 0, (18 * Math.PI) / 180);
            ctx.stroke();

            // triple ring
            ctx.fillStyle = color.black;
            ctx.strokeStyle = (i % 2 == 0) ? color.green : color.red;
            ctx.lineWidth = 12;
            ctx.beginPath();
            ctx.arc(0, 0, 141 + 6, 0, (18 * Math.PI) / 180);
            ctx.stroke();

            // score numbers
            ctx.restore();
            ctx.fillStyle = color.white;
            ctx.font = '42px "Architects Daughter"';
            ctx.textAlign = 'center';
            ctx.save();
            //ctx.rotate((0 * Math.PI) / 180);
            ctx.rotate((Math.PI / 180) * ((5 * 18) + (18 / 2)));
            ctx.fillText(game.scorePoints[i], 0, -250);
            ctx.restore();
            ctx.restore();
            ctx.save();
        }

        // outer bull
        ctx.fillStyle = color.black;
        ctx.strokeStyle = color.gold;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 21, 0, 360);
        ctx.fill();
        ctx.stroke();
        ctx.save();

        // bulls eye
        ctx.fillStyle = color.red;
        ctx.strokeStyle = color.gold;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, 360);
        ctx.fill();
        ctx.stroke();
        ctx.save();
    },
    aim : function(x, y, aimColor) {
        // shakes x and y to increse dificulty
        // var opX = Math.random();
        // var opY = Math.random();
        // input.x = x += Math.random() * 2 * ((opX > 0.5) ? 1 : -1);
        // input.y = y += Math.random() * 2 * ((opY > 0.5) ? 1 : -1);
        // draws the aim
        ctx.save();
        ctx.fillStyle = aimColor;
        ctx.beginPath();
        ctx.fillRect(x, y + 10, 4, 15); // bottom rect
        ctx.fillRect(x, y - 20, 4, 15); // top rect
        ctx.fillRect(x + 10, y, 15, 4); // left rect
        ctx.fillRect(x - 20, y, 15, 4); // right rect
        ctx.closePath();
        ctx.restore();
    },
    dart: function(x, y, playerColor = 'white') {
        // quick fix on x and y to center the dart within the aim
        x += 2; y += 2;
        // we change the actual context methods in order to fix the position for the new dart
        function movePoint(px, py) {
            return ctx.moveTo(x + px, y + py);
        }
        function quadCurve(cpx, cpy, px, py) {
            return ctx.quadraticCurveTo(x + cpx, y + cpy, x + px, y + py);
        }
        function lineGradient(x0, y0, x1, y1) {
            return ctx.createLinearGradient(x + x0, y + y0, x + x1, y + y1);
        }
        // will hold the gradient variable for the canvas context
        var grd;

        ctx.save();

        // 1
        grd = lineGradient(-50, -35, 50, 35);
        grd.addColorStop(0, color.black);
        grd.addColorStop(1, playerColor);
        ctx.fillStyle = grd;
        ctx.lineWidth = 2;
        ctx.strokeStyle = color.black;

        ctx.beginPath();
        //ctx.moveTo(50, -50);
        movePoint(50, -50);
        quadCurve(50, 15, 25, -21);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // 2
        grd = lineGradient(-50, -35, 50, 35);
        grd.addColorStop(0, color.black);
        grd.addColorStop(1, playerColor);
        ctx.fillStyle = grd;

        ctx.beginPath();
        //ctx.moveTo(50, -50);
        movePoint(50, -50);
        quadCurve(-15, -50, 21, -25);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // 3
        grd = lineGradient(-50, -35, 50, 35);
        grd.addColorStop(0, color.black);
        grd.addColorStop(1, playerColor);
        ctx.fillStyle = grd;
        
        ctx.beginPath();
        //ctx.moveTo(50, -50);
        movePoint(50, -50);
        quadCurve(50, -85, 29, -50);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // 4
        grd = lineGradient(-50, -35, 50, 35);
        grd.addColorStop(0, color.black);
        grd.addColorStop(1, playerColor);
        ctx.fillStyle = grd;

        ctx.beginPath();
        //ctx.moveTo(50, -50);
        movePoint(50, -50);
        quadCurve(85, -50, 50, -29);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // 5
        grd = lineGradient(0, 0, 100, 0);
        grd.addColorStop(0, color.silver);
        grd.addColorStop(1, color.black);
        ctx.fillStyle = grd;

        ctx.beginPath();
        //ctx.moveTo(50, -50);
        movePoint(50, -50);
        quadCurve(3, 5, 5, -5);
        //ctx.moveTo(50, -50);
        movePoint(50, -50);
        quadCurve(-5, -3, 5, -5);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        //ctx.moveTo(5, -5);
        movePoint(5, -5);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    },
    message: function(title, text, bgColor)
    {
        ctx.save();
        ctx.fillStyle = bgColor;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-200, -100, 400, 200);
        ctx.globalAlpha = 1;
        ctx.fillStyle = color.white;
        ctx.textAlign = 'center';
        ctx.font = '42px "Architects Daughter"';
        ctx.fillText(title, 0, -50, 390);
        ctx.font = '28px "Architects Daughter"';
        ctx.fillText(text, 0, 0, 390);
        ctx.font = '16px "Architects Daughter"';
        ctx.fillText('(Press ENTER to continue)', 0, 50, 390);
        ctx.restore();
    },
    hud: function()
    {
        var posX = 250;
        var posY = 250;
        var width = 100;
        
        ctx.save();
        ctx.textAlign = 'center';
        
        // player 1
        // ctx.font = '22px "Architects Daughter"';
        // ctx.fillStyle = players.p1.color;
        // ctx.fillText(players.p1.name, -posX, posY, width);
        // ctx.font = '48px "Architects Daughter"';
        // ctx.fillText(players.p1.score, -posX, posY + 40, width);
        
        // player 2
        // ctx.font = '22px "Architects Daughter"';
        // ctx.fillStyle = players.p2.color;
        // ctx.fillText(players.p2.name, posX, posY, width);
        // ctx.font = '48px "Architects Daughter"';
        // ctx.fillText(players.p2.score, posX, posY + 40, width);

        // temporary score
        ctx.font = '22px "Architects Daughter"';
        ctx.fillStyle = color.black;
        ctx.fillText(game.turn.player.name, posX, -posY - 20, width);
        ctx.font = '36px "Architects Daughter"';
        ctx.fillText(game.turn.tmpScore, posX, -posY + 10, width);
        ctx.font = '18px "Architects Daughter"';
        ctx.fillText('score', posX, -posY + 30, width);

        // logo
        ctx.font = '42px "Architects Daughter"';
        ctx.fillStyle = color.gold;
        ctx.fillText('PLAY', -posX, -posY - 10, width);
        ctx.font = '36px "Architects Daughter"';
        ctx.fillText('DARTS', -posX, -posY + 20, width);

        ctx.restore();
    }
}

/* ============= INPUT HANDLING ============= */

function onKeyDown(e)
{
    console.log(e.key);
    // pause/unpause the game
    if (e.key == 'Escape') {
        game.turn.messages.push([
            'Game Paused',
            'The game was paused',
            color.gold
        ]);
    }
    // returns from message to the game
    if (e.key == 'Enter') {
        game.pause = false;
        game.turn.messages = [];
        if (game.winner != null) {
            game.reset();
        }
        //     do {
        // input.x = handsfee.head.pointer.x;
        // input.y = handsfee.head.pointer.y;
        // }while(1);
        
    }
    if (e.key == 'ArrowLeft') {
        input.x -= 5;
    }
    if (e.key == 'ArrowDown') {
        input.y += 5;
    }
    if (e.key == 'ArrowRight') {
        input.x += 5;
    }
    if (e.key == 'ArrowUp') {
        input.y -= 5;
    }
    if (e.key == ' ') {
        if (game.pause == false) {
            canvas.dispatchEvent(events.throwDart);
        }
    }
}

function onMouseClick()
{
    if (game.pause == false) {
        canvas.dispatchEvent(events.throwDart);
    }
}

function onMouseMove(e)
{
    // DEBUG ONLY
    // This is useful for moving the aim around using the mouse
    console.log(handsfee.head.pointer.x,"--------------"+e)
    var rect = canvas.getBoundingClientRect();
    // input.x = (e.clientX - rect.left) - 300;
    // input.y = (e.clientY - rect.top) - 300;
    input.x = handsfee.head.pointer.x;
    input.y = handsfee.head.pointer.y;
    
}

function onMouseDown(e)
{
    //
}

function onMouseOver(e)
{
    //
}

/* ============= GAMEPLAY ============= */

var players = {
    p1: {
        // player name
        name: 'Player 1',
        // dart color
        color: color.green,
        // initial score
        score: 0
    },
    p2: {
        name: 'Player 2',
        color: color.red,
        score: 0
    }
}

var game = {
    // time scale where 1 is the normal scale
    timeScale : 1,
    // the game is running
    gameStarted: false,
    // the score points for each sector of the board
    scorePoints: ['6', '10', '15', '2', '17', '3', '19', '7', '16', '8', '11', '14', '9', '12', '5', '20', '1', '18', '4', '13'],
    // the winner player
    winner: null,
    // the game is paused
    pause: false,
    // hit score types
    scoreTypes: {
        single: 'single',
        double: 'double',
        triple: 'triple',
        bullseye: 'bullseye',
        outerbull: 'outerbull',
        missing: 'missing'
    },
    // the current turn
    turn: {
        // the current player object (from players)
        player: null,
        // temporary score (assigned with the current score value on every round)
        tmpScore: null,
        // the current chance -- max is 3
        chance: 1,
        // the shot hit a single, double or triple ring
        shot: 'single',
        // array containing each dart that was placed on the board
        darts: [],
        // array containing each message that will be shown
        messages: []
    },
    setTurn: function(nextPlayer, scoreValid) {
        if (scoreValid == true) {
            // sets the actual score of the current player
            game.turn.player.score = game.turn.tmpScore;
        }
        game.turn.chance = 1;
        game.turn.darts = [];
        game.turn.player = nextPlayer;
        game.turn.tmpScore = nextPlayer.score;
        input.x = Math.random() * 200;
        input.y = Math.random() * 200;
    },
    reset: function() {
        // refresh page
    }
}

/* ============= EVENTS ============= */

var events = {
    throwDart : null
}

function throwDart()
{
    var x = input.x;
    var y = input.y;
    var currentPlayer = game.turn.player;
    // finds the angle the player clicked -- used to set score and check if shot is valid
    var a = (x) + (0 * y);
    var b = Math.sqrt(Math.pow(1, 2) + Math.pow(0, 2)) * (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    var angle = utils.toDegrees(Math.acos(a/b));
    // fixes the y axis so the angles go from 0 to 360 (instead of 0 to +-180)
    if (y < 0) angle = 360 - angle;
    // creates a var to store the status of the shot (if it is valid or not)
    var shotWasValid;
    // finds the distance between board center and shot position
    var shotDistanceFromCenter = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    // sets the default value of the single score
    var shotScore = game.scorePoints[Math.floor(angle / 18)];
    // sets the condition to win (shot must be double or bulls-eye)
    var winningShots = [game.scoreTypes.bullseye, game.scoreTypes.double];
    // the next player
    // var nextPlayer = (game.turn.player == players.p1) ? players.p2 : players.p1; 
    var nextPlayer = players.p1;  
    
    // if the distance is less than the board radius the shot was valid
    if (utils.numberInRange(shotDistanceFromCenter, 0, 238)) {
        // sets the current score for the shot based on where the dart hit the board
        // hit double area -- score * 2
        if (utils.numberInRange(shotDistanceFromCenter, 226, 238)) {
            game.turn.tmpScore += parseInt(shotScore) * 2;
            game.turn.lastShot = game.scoreTypes.double;
        }
        // hit triple area -- score * 3
        else if (utils.numberInRange(shotDistanceFromCenter, 141, 154)) {
            game.turn.tmpScore += parseInt(shotScore) * 3;
            game.turn.lastShot = game.scoreTypes.triple;
        }    
        // hit outer bull -- 25
        else if (utils.numberInRange(shotDistanceFromCenter, 9, 21)) {
            game.turn.tmpScore += 25;
            game.turn.lastShot = game.scoreTypes.outerbull;
        }
        // hit bulls eye -- 50
        else if (utils.numberInRange(shotDistanceFromCenter, 0, 8)) {
            game.turn.tmpScore += 50;
            game.turn.lastShot = game.scoreTypes.bullseye;
        }
        // hit anywhere on the board (except bulls eye, outer bull, double or triple)
        else {
            game.turn.tmpScore += parseInt(shotScore);
            game.turn.lastShot = game.scoreTypes.single;
        }

        // if score = 0 and last shot was double or bulls-eye player wins
        if (game.turn.tmpScore == 0 && winningShots.indexOf(game.turn.lastShot) != -1) {
            game.winner = game.turn.player.name;
            game.turn.messages.push([
                game.turn.player.name + ' wins',
                'You did it, man! Congrats, bro!',
                color.green
            ]);
            //game.setNewGame(nextPlayer);
        }
        // if score < 0 or = 1, shot was invalid
        if (game.turn.tmpScore < 0 || game.turn.tmpScore == 1) {
            shotWasValid = false;
            // game.setTurn(nextPlayer, shotWasValid);
            // game.turn.messages.push([
            //     'Invalid Shot',
            //     'Your last shot must by double or bulls-eye',
            //     color.red
            // ]);
        }

        shotWasValid = true;
    } else {
        // dart was thrown outside the board so the shot is invalid
        shotWasValid = false;
        // shot was missing
        game.turn.lastShot = game.scoreTypes.missing;
        // game.turn.messages.push([
        //     'Invalid Shot',
        //     'Dart did not hit the board',
        //     color.red
        // ]);
    }

    if (shotWasValid) {
        // adds dart to render queue
        game.turn.darts.push({'x': x, 'y': y, 'player': currentPlayer});
        // sets the tmpscore to the actual score of the current player
        //game.turn.player.score = game.turn.tmpScore;
    } else {
        if (game.turn.tmpScore <= 1) {
            game.setTurn(nextPlayer, shotWasValid);
        }
    }
    

    // console.log('--- ' + game.turn.player.name + ' ---' + "\n" +
    //             'TMP SCORE: ' + game.turn.tmpScore + "\n" +
    //             'REAL SCORE: ' + game.turn.player.score + "\n" +
    //             'SHOT TYPE: ' + game.turn.lastShot + "\n" +
    //             '----------------'+JSON.stringify(handsfree.head.pointer)+'0000');
    document.getElementById('pla-card').innerHTML = game.turn.lastShot;
    // increses the currenct chance (even if shot was invalid) -- max is 3
    game.turn.chance += 1;

    // if (game.turn.chance == 4) {
    //     game.setTurn(nextPlayer, shotWasValid);
    //     game.turn.messages.push([
    //         nextPlayer.name + '\'s turn',
    //         'Switching player',
    //         color.black
    //     ]);
    // }
}

/* ============= GAME METHODS ============= */

// called before game starts
function awake()
{
    // adjusts the center of the canvas
    ctx.translate(stage.center()[0], stage.center()[1]);
    ctx.save();

    // keyboard events
    canvas.addEventListener('keydown', onKeyDown, false); 

    // mouse events
    // canvas.addEventListener('handsfree-mouseDown', onMouseMove, true);
    // canvas.addEventListener('handsfree-mouseDrag', onMouseMove, true);
    // canvas.addEventListener('handsfree-mouseUp', onMouseMove, true);

    canvas.addEventListener('mouseover', onMouseOver, true);
    canvas.addEventListener('mousedown', onMouseDown, true);
    canvas.addEventListener('click', onMouseClick, true);

    // game events
    events.throwDart = new Event('throwDart');
    canvas.addEventListener('throwDart', throwDart, false);

    // select the canvas
    canvas.focus();

    return true;
}

// called when game is started
function start()
{
    // simple prompt to set players' names
    players.p1.name = "Your";
    // players.p2.name = prompt('Name for ' + players.p2.name);
    
    // starts the game
    game.gameStarted = true;
    game.setTurn(players.p1, false);

    ctx.save();
    ctx.translate(-300, -300); // fixes the canvas position
    ctx.save();
}

// called once per frame
function update()
{
    // clears the canvas
    ctx.clearRect(-stage.center()[0], -stage.center()[1], 600, 600);

    // draw the game board
    draw.board();

    //draw.message('Olá mundo!', 'A simple hello world message', color.red);

    // gameplay core loop
    if (game.gameStarted && game.turn.player != null) {
        // draw each dart the player has thrown on the current turn
        game.turn.darts.forEach(function(d) {
            draw.dart(d.x, d.y, d.player.color);
        }, this);
        
        // draws the aim icon
        ctx.restore();
        draw.aim(input.x, input.y, game.turn.player.color);
        ctx.save();
    }

    // draw ui messages
    game.turn.messages.forEach(function(m) {
        game.pause = true;
        draw.message(m[0], m[1], m[2]);
    }, this);

    // draw players' score box
    draw.hud();   
}

/* ============= INITIALIZATION ============= */

// starts the game only if setup() is successful
if (awake() == true) {
    start();
};

window.setInterval(function(){
    if (game.timeScale > 0 && game.pause == false) {
        update();        
    }
}, (16.67 / game.timeScale)); // each frame lasts 16.67ms, so 1 second has 60 frames*/