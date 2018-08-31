/**
 *  made by : Mohammad Javad Ghasemy & homayon naseery
 *  email : geeksesi [at] gmail [dot] com
 *  github : https://github.com/geeksesi
 *  game page : https://geeksesi.github.io/knife_wood_game
 * 
 *  v0.0.0 fun
 *
 *  by phaser 3.1.1.0
 *
 *  if you need more info please tell me :D 
 * 
 */



// the game itself
var game;

// global game options
var gameOptions = {

    // target rotation speed, in degrees per frame
    rotationSpeed: 1,

    // shot throwing duration, in milliseconds
    throwSpeed: 90
}


window.onload = function() 
{

    // game configuration object
    var gameConfig = 
    {

        // render type
       type: Phaser.CANVAS,

       // game width, in pixels
       width: 750,

       // game height, in pixels
       height: 1334,

       // game background color
       backgroundColor: 0x1d0000,

       // scenes used by the game
       scene: [playGame]
    };

    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame and scale the game
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

// PlayGame scene
class playGame extends Phaser.Scene{

    // constructor
    constructor(){
        super("PlayGame");
    }

    // method to be executed when the scene preloads
    preload(){

        // loading assets
        this.load.image("target", "assets/img/circle.png");
        this.load.image("shot", "assets/img/shot.png");
        this.load.image("path", "assets/img/path.png");
        // this.load.image("path2", "assets/img/path_trans.png");
    }

    // method to be executed once the scene has been created
    create(){

        // can the player throw a shot? Yes, at the beginning of the game
        this.canThrow = true;

        // group to store all rotating knives
        this.shotGroup = this.add.group();
        
        this.pathGroup = this.add.group();

        // adding the shot
        this.shot = this.add.sprite(game.config.width / 2, 250, "shot");

        // adding the target
        this.target = this.add.sprite(game.config.width / 2, game.config.height / 5 * 3, "target");

        // moving the target on front
        // this.pathGroup.depth = 2;

        // var path1 = this.add.sprite(game.config.width / 2, (this.target.y - (this.target.width / 2)), "path");
        this.path1 = this.add.sprite(300, 200, "path");
        this.path1.depth = 1;
        this.path2 = this.add.sprite(200, 200, "path");
        this.path2.depth = 1;



        // adding the rotating shot to shotGroup group

        // waiting for player input to throw a shot
        this.input.on("pointerdown", this.throwshot, this);
    }

    // method to throw a shot
    throwshot(){

        // can the player throw?
        if(this.canThrow){

            // player can't throw anymore
            this.canThrow = false;

            // tween to throw the shot
            this.tweens.add({

                // adding the shot to tween targets
                targets: [this.shot],

                // y destination
                y: (this.target.y - (this.target.width / 2)) ,

                // tween duration
                duration: gameOptions.throwSpeed,

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function(tween){

                    this.canThrow = true;
                    var shot1 = this.add.sprite(this.shot.x, this.shot.y, "shot");
                    this.shotGroup.add(shot1);
                    this.shot.y = 250;

                    var way_to_path1_x = this.shot.x - this.path1.x; 
                    var way_to_path1_y = this.path1.y - this.shot.y; 
                    var way_to_path2_x = this.shot.x - this.path2.x; 
                    var way_to_path2_y = this.path2.y - this.shot.y;; 
                    console.log(way_to_path1_x+":::"+way_to_path1_y+"|||"+way_to_path2_x+":::"+way_to_path2_y);
                    if (way_to_path1_x > -58 && way_to_path1_x < 58 && 200 < way_to_path1_y && way_to_path1_y < 300) 
                    {
                        alert("Lose");
                    }
                    if (way_to_path2_x > -58 && way_to_path2_x < 58 && 200 < way_to_path2_y && way_to_path2_y < 300) 
                    {
                        alert("Lose");
                    }
                }
            });
        }
    }

    // method to be executed at each frame 
    update(){

        // rotating the target
        this.target.angle += gameOptions.rotationSpeed;

        // getting an array with all rotating knives
        var children_shot = this.shotGroup.getChildren();

        // looping through rotating knives
        for (var i = 0; i < children_shot.length; i++)
        {

            // rotating the shot
            children_shot[i].angle += gameOptions.rotationSpeed;

            // turning shot angle in radians
            var radians = Phaser.Math.DegToRad(children_shot[i].angle + -90);

            // trigonometry to make the shot rotate around target center
            children_shot[i].x = this.target.x + (this.target.width / 2) * Math.cos(radians);
            children_shot[i].y = this.target.y + (this.target.width / 2) * Math.sin(radians);
        }
        var children_path = this.pathGroup.getChildren();
        
        this.path1.angle += gameOptions.rotationSpeed;
        this.radians_path_0 = Phaser.Math.DegToRad(this.path1.angle +90);
        this.path1.x = this.target.x + (this.target.width / 2) * Math.cos(this.radians_path_0);
        this.path1.y = this.target.y + (this.target.width / 2) * Math.sin(this.radians_path_0);

        this.path2.angle += gameOptions.rotationSpeed;
        this.radians_path_1 = Phaser.Math.DegToRad(this.path2.angle + -22);
        this.path2.x = this.target.x + (this.target.width / 2) * Math.cos(this.radians_path_1);
        this.path2.y = this.target.y + (this.target.width / 2) * Math.sin(this.radians_path_1);
    }
}

// pure javascript to scale the game
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}




