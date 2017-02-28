// Omar Cruz Pantoja
// 801-14-1672
// CCOM 4995- COMPUTER GRAPHICS 
// Prof. Remi Megret

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

var canvas;
var ctx;
var w,h;
var imageObj = [] ;  
var images ;
var params ;
var bulletCoords = [] ;
var asteroid ;
function initParams() {
    params = {
        'x0': canvas.width/2,
        'y0': canvas.height/2,
        'angle': 0,
        'mode': 1,
        'vx': 0,
        'vy': 0,
        // For Mode 0
        'fixedDisplacement': 10, // 10 pix/s
        'angleStep': 15, // 15 deg for each keyPress
        // For Mode 1
        'fixedVelocity': 100, // 100 pix/s
        'angleVelocity': 180, // 1 turn in 2s
        // For Mode 2
        'fixedAcceleration': 20 // 0.1 pix/s velocity if accelerate for 1s
    }
    bulletCoords["width"] = 5 ,
    bulletCoords["height"] = 14  ;
    bulletCoords["xd"] = 0 ;
    bulletCoords["yd"] = 0 ;
    images = ['images/nebula.jpg', 'images/ship.png', 'images/thruster.png', 'images/bullet.png', 'images/powerUp.png', 'images/asteroid.png'] ; 
    updateAsteroid() ;

}

/* ### GUI ### */
var gui;		
function initGUI() 
{
    gui = new dat.GUI({ autoPlace: true });

    gui.add(params,'x0').min(0).max(w).step(1)
                        .onChange(onParamsChange)//.listen()
    gui.add(params,'y0').min(0).max(h).step(1)
                        .onChange(onParamsChange)//.listen()
    gui.add(params,'angle').min(-180).max(180).step(1)
                           .onChange(onParamsChange)//.listen()
    gui.add(params,'mode', [ 0, 1, 2 ]).onChange(onParamsChange)
    gui.add(params,'vx').min(-100).max(+100).step(0.1)
                        .onChange(onParamsChange)//.listen()
    gui.add(params,'vy').min(-100).max(+100).step(0.1)
                        .onChange(onParamsChange)//.listen()
    gui.add(params,'angleStep').min(0).max(30).step(0.1)
       .onChange(onParamsChange) // 30 deg max by displacement
    gui.add(params,'angleVelocity').min(0).max(720).step(0.1)
       .onChange(onParamsChange) // 720 deg max in 1s
    gui.add(params,'fixedDisplacement').min(0).max(50).step(1)
        .onChange(onParamsChange) // 50 pix max
    gui.add(params,'fixedVelocity').min(0).max(125).step(0.1)
        .onChange(onParamsChange) // 50 pix max in 1s
    gui.add(params,'fixedAcceleration').min(0).max(+50).step(0.1)
        .onChange(onParamsChange)
    
    //var parent = document.getElementById('controls');      
    //parent.appendChild(gui.domElement);
}
// GUI callback when parameters are changed manually in the GUI
function onParamsChange() {
    drawAll()
}

/* ### Keyboard ### */
var currentlyPressedKeys = [];
function initKeys(canvas) {
    // Make sure the canvas can receive the key events
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    // Register the keyDown and keyUp events
    canvas.addEventListener( "keydown", onKeyDown, true);
    canvas.addEventListener( "keyup", onKeyUp, true);
}
// Callbacks for discrete key events
function onKeyDown(event) {
    // Uncomment this to display key presses to find the keyCodes
    // console.log(event) ;
    event.preventDefault();
    // Put your code here
// console.log(event) ;
    if (params.mode==0) {
        var checkIfPressed = currentlyPressedKeys.includes(event.keyCode)
        
        if(!(checkIfPressed))
        {
            currentlyPressedKeys.push(event.keyCode) ;  

            //Up or down key pressed
            if(event.keyCode == 38 || event.keyCode== 40)
            {
                angleInRad = (params.angle-90) * Math.PI / 180 ;
                repositionX = params.fixedDisplacement * Math.cos(angleInRad) ;
                repositionY = params.fixedDisplacement * Math.sin(angleInRad) ;
                //Up key pressed, move forward
                if(event.keyCode == 38)
                {
                    params.x0 += repositionX;
                    params.y0 += repositionY ;
                }
                //Down key pressed, move backward
                else if(event.keyCode == 40)
                {
                    params.x0 += -1*repositionX;
                    params.y0 += -1*repositionY ;
                }
            }

            //Right or left key pressed
            else if(event.keyCode == 37 || event.keyCode== 39)
            {
                //Right key pressed
                if(event.keyCode == 39)
                {
                    if(params.angle + params.angleStep >= 180)
                        params.angle = -180 + (params.angle + params.angleStep)%180 ;
                    else
                        params.angle += params.angleStep ;
                }
                //Left key pressed
                else if(event.keyCode == 37)
                {
                    if(params.angle - params.angleStep <= -180)
                        params.angle = 180 - (params.angle - params.angleStep)%180 ;
                    else
                        params.angle -= params.angleStep ;
                }
            }
        }

        //Check if ship passed outside the canvas heights
        
        if(params.y0 >= canvas.height)
            params.y0 = 0 ;
        else if(params.y0 <= 0)
            params.y0 = canvas.height ;
        else if(params.x0 >= canvas.width)
            params.x0 = 0 ;
        else if(params.x0 <= 0)
            params.x0 = canvas.width ;

        drawAll(ctx) ;
        // React to discrete key presses in mode 0
    }

    var checkIfPressed = currentlyPressedKeys.includes(event.keyCode)
    if(!checkIfPressed)
        currentlyPressedKeys.push(event.keyCode) ;

    
    // Handle single key presses (for example for firing the gun)
    if (event.keyCode == 67) { // K
        console.log('Pressed "K"')
    }
}
function onKeyUp(event) {
    // Put your code here
    var index = currentlyPressedKeys.indexOf(event.keyCode) ;

    if(isKeyDown(84) && boost ==actualBoost)
    {
        turboOff = true ;
        boost = 0 ;
    }
    //If key up is space bar, turn off boost
    else
    
        turboOff = true ;

    if(index != -1)
        currentlyPressedKeys.splice(index, 1) ;
    


}

//Check if a key is pressed
function isKeyDown(key) {
    return currentlyPressedKeys.includes(key) ;
}

/* ### Timing and main loop ### */
var startTime = 0;
var lastTime = 0;
var elapsed = 0, totalElapsed = 0;

//Set boost data
var boost = 0 ;
var actualBoost = 75 ;
var turboOff = true;
var turboTime = 0 ;

//Set laser blast data
var bulletShot = false ;
var bulletTimer ;

//Set powerUp data
var power = []
var powerOn = false ;
var powerShow = false ;
var powerShowT ;
var powerTimer = 5;
var powerUpTime = 0;

counter  =0 ;


function updateTime() {
    var timeNow = new Date().getTime() / 1000; // All expressed in seconds
    if (lastTime != 0) {
        elapsed = timeNow - lastTime;
    } else {
        startTime = timeNow;
    }
    lastTime = timeNow;
    totalElapsed = timeNow - startTime;
     
}
// Timer callback for animations
function onTick() {
    
    if (params.mode>=0) {
        updateTime()
        animate();
        drawAll();

 

    //console.log(turboTime) ;
    requestAnimFrame(onTick);
}
}
// To animate the ship, check the keyboard state by polling
function animate() {

    //Using fixed velocity 
    if (params.mode==1) {

        if((isKeyDown(38) && !isKeyDown(40))|| (!isKeyDown(38) && isKeyDown(40)))
            {
                angleInRad = (params.angle+90) * Math.PI / 180 ;
                // params.fixedDisplacement = 10 / elapsed ;
               // console.log(params.fixedDisplacement) ;
                repositionX = (params.fixedVelocity+boost)*elapsed* Math.cos(angleInRad) ;
                repositionY = (params.fixedVelocity+boost)*elapsed * Math.sin(angleInRad) ;
                //Up key pressed, move forward
                if(isKeyDown(38))
                {
                    params.x0 -= repositionX;
                    params.y0 -= repositionY ;
                }
                //Down key pressed, move backward
                else if(isKeyDown(40))
                {
                    params.x0 += repositionX;
                    params.y0 += repositionY ;
                }
            }

    }
    //We are in space, use fixed acceleration
    if (params.mode==2) {

         

        if((isKeyDown(38) && !isKeyDown(40))|| (!isKeyDown(38) && isKeyDown(40)))
        {
            angleInRad = (params.angle) * Math.PI / 180 ;

            //Up key pressed, move forward
            if(isKeyDown(38))
            {
                params.vx += (params.fixedAcceleration+10)*elapsed* Math.sin(angleInRad) ;
                params.vy += (-1)*(params.fixedAcceleration+10)*elapsed* Math.cos(angleInRad) ;
                params.x0 += params.vx*elapsed;
                params.y0 += params.vy*elapsed ;
            }
            //Down key pressed, move backwards
            else if(isKeyDown(40))
            {
                params.vx -= (params.fixedAcceleration+10)*elapsed* Math.sin(angleInRad) ;
                params.vy += (params.fixedAcceleration+10)*elapsed* Math.cos(angleInRad) ;
                params.x0 += params.vx*elapsed;
                params.y0 += params.vy*elapsed ;
            }

        }

        //Keep the ship moving since we're in space
        else
        {
            params.vy *= .99 ;
            params.vx *= .99 ;
            params.y0 += params.vy*elapsed ;
            params.x0 += params.vx*elapsed ;
            
        }


        // React to key state in mode 2
    }
    
    //If ship is outside canvas limits, reposition it on the other side
    if(params.y0 >= canvas.height)
        params.y0 = 1 ;
    else if(params.y0 <= 0)
        params.y0 = canvas.height-1 ;
    else if(params.x0 >= canvas.width)
        params.x0 = 1 ;
    else if(params.x0 <= 0)
        params.x0 = canvas.width -1;


    //### TURBO MODEL ####
    if(isKeyDown(84) && turboTime >= 0 && isKeyDown(38))
    {
        turboOff = false ;
        boost = actualBoost ;
        if(powerUpTime<=0)
            turboTime -= elapsed ;
    }


    //If the key is not pressed, charge up the progress bar
    if(turboTime < 3 && turboOff)
    {
        turboTime += elapsed /10;
        // console.log("aye") ;
        document.getElementById("turbo").value= (turboTime) ;

    }
    //When key is unpressed, remove turbo boost
    else if(!turboOff && turboTime <= 0 && boost == actualBoost)
        boost = 0 ;
    //### END TURBO MODEL ###

    //Right or left key pressed Reposition ship based using angle velocity
    if(!isKeyDown(37) && isKeyDown(39) || isKeyDown(37) && !isKeyDown(39))
    {
        //Right key pressed
        if(isKeyDown(39))
        {

            angle = params.angleVelocity*elapsed ;
            if(params.angle + angle >= 180)
                params.angle = -180 + (params.angle + angle)%180 ;
            else
                params.angle += angle ;
        }
        //Left key pressed
        else if(isKeyDown(37))
        {
            angle = params.angleVelocity*elapsed ;
            if(params.angle - angle <= -180)
                params.angle = 180 - (params.angle - angle)%180 ;
            else
                params.angle -= angle;
                
        }
    }

    //###BULLET SHOT ###
    //Spacebar pressed (Bullet will be shot)
    if(isKeyDown(32) && !bulletShot)
    {
        //Set starting position of bulets
        bulletCoords[0] = { "x":  0, "y" :0} ;
   
        
        //Get ships location and angle 
        bulletCoords["angle"] = params.angle * Math.PI/180 ;
        bulletCoords["x"] = params.x0 ;
        bulletCoords["y"] = params.y0 ;

        //Locate bullets based on canvas
        bulletCoords[0]["xd"] = params.x0 
        bulletCoords[0]["yd"] = params.y0 ;


    
        bulletShot = true ;
        bulletTimer = 0;
    }
    //Update bullet data
    else if(bulletTimer < 2 && bulletShot)
    {
        // console.log("aye") ;
        bulletTimer += elapsed ;            
         
            bulletCoords[0]["y"] -= 200*elapsed ;
      
            bulletCoords[0]["xd"] += 200 * elapsed * Math.cos(bulletCoords["angle"]-Math.PI/2)
            bulletCoords[0]["yd"] += 200 * elapsed * Math.sin(bulletCoords["angle"]-Math.PI/2) ;
            
            deltaY = bulletCoords[0]["yd"] - asteroid.y
            deltaX = bulletCoords[0]["xd"] - asteroid.x ;
            dBulletAsteroid = Math.sqrt(deltaX*deltaX + deltaY*deltaY) ;
           
            if(dBulletAsteroid <= 25)
            {
               updateAsteroid() ;
               bulletTimer = 2;
            }
        
    }
    else if(bulletTimer>=2 && bulletShot)
        bulletShot = false ;

    //###POWERUP MODEL
    //Update power up location data
        //Get random to get power up
    if(Math.floor(Math.random() * 1200) ==1 && !powerShow)
    {
        power["x"] =   Math.floor(Math.random() * (canvas.width-50));
        power["y"] =   Math.floor(Math.random() * (canvas.height-50)) ;
        powerShow =true ;
        powerShowT= powerTimer+5 ;
    }   
    else if(powerShow)
    {
        deltaY = params.y0 - power["y"] ; 
        deltaX = params.x0 - power["x"] ;
        dPowerUp = Math.sqrt(deltaX *deltaX + deltaY*deltaY) ;
        if(dPowerUp < 21)
        {
            powerShow = false;
            powerUpTime = powerTimer ;
            // counter+=1 ;
            // document.getElementById("power").innerHTML = counter
        }
    }

    if(powerUpTime>0) 
    {
        document.getElementById("power").innerHTML = "INFINITE TURBO [ON] OFF" ;
        powerUpTime -= elapsed;
    }
    else
        document.getElementById("power").innerHTML = "INFINITE TURBO ON [OFF]" ;


    //### ASTEROID POSITION UPDATE
    asteroid.x += asteroid.vx * elapsed ;
    asteroid.y += asteroid.vy * elapsed ;

    if(asteroid.y >= canvas.height)
        asteroid.y = 1 ;
    else if(asteroid.y <= 0)
        asteroid.y = canvas.height-1 ;
    else if(asteroid.x >= canvas.width)
        asteroid.x = 1 ;
    else if(asteroid.x <= 0)
        asteroid.x = canvas.width -1;

    //#CHECK IF SHIP HIT THE ASTEROID
    deltaY = params.y0 - asteroid["y"] ; 
    deltaX = params.x0 - asteroid["x"] ;
    dShipAsteroid = Math.sqrt(deltaX *deltaX + deltaY*deltaY) ;
    if(dShipAsteroid < 40)
    {
       params.x0 = 250 ;
       params.y0 = 200;
       params.vy = 0  ;
       params.vx = 0 ;
       updateAsteroid() ;
    }

}

function drawPower(ctx) {
    //Draw image of the power up
    ctx.drawImage(imageObj[4], power["x"]-10, power["y"]-10, 20,20) ;
}

function drawBullets(ctx) {
    ctx.setTransform(1,0,0, 1,0,0)

    //Position the bullets

    angle = bulletCoords["angle"] 
    ctx.translate(bulletCoords["x"], bulletCoords["y"]) ;
    ctx.rotate(angle) ;
 
    
    //Draw the bullets
    ctx.drawImage(imageObj[3], bulletCoords[0]["x"], bulletCoords[0]["y"], bulletCoords["width"] , bulletCoords["height"]) ;
    
    
   
}
function drawTurbo(ctx){
    
   //Draw the thruters

    ctx.drawImage(imageObj[2], -4, 14, 18,37);
    ctx.drawImage(imageObj[2], -14, 14, 18,37);
   // turboTime-=elapsed ;
    if(Math.floor(turboTime) < 0)
        turboTime = 0 ;
    document.getElementById("turbo").value = (turboTime) ;

    //When key is unpressed, remove turbo boost
    

}
function drawShip(ctx) {
    
    ctx.setTransform(1,0,0, 1,0,0)
    
    //Position the ship in correct place
    ctx.translate(params.x0, params.y0) ;
    angleInRad = params.angle * Math.PI / 180 ;
    ctx.rotate(angleInRad) ;
    ctx.strokeStyle = "red"

 
    //Draw the ship
    ctx.drawImage(imageObj[1], -15,-15,30, 30) 
}

function drawAsteroid(ctx) {
    ctx.drawImage(imageObj[5], asteroid.x -asteroid.imgRadius/2, asteroid.y-asteroid.imgRadius/2, asteroid.imgRadius, asteroid.imgRadius)

}

function drawAll() {
    // Reset transform before clearing the canvas
    ctx.setTransform(1,0,0, 1,0,0)
    ctx.clearRect(0,0,canvas.width,canvas.height)
    
    //Draw background
    ctx.drawImage(imageObj[0], 0, 0, canvas.width, canvas.height) ;
    

   //Power up 
    if(powerShow && powerShowT > 0)
    {
        powerShowT -=elapsed ;
        drawPower(ctx) ;
    }
    else if(powerShowT <= 0)
        powerShow = false ;

    
    drawAsteroid(ctx) ;
    //Draw bullet when shot
    if(bulletShot)
       drawBullets(ctx) ;


   //Draw the ship
    drawShip(ctx)
    
    //Draw turbo when on
    if(!turboOff && turboTime > 0 && isKeyDown(38))
        drawTurbo(ctx) ;
    

    }

function updateAsteroid() {
    asteroid ={
        'x' : Math.floor(Math.random() * (canvas.height-50)),
        'y' :  Math.floor(Math.random() * (canvas.width-50)),
        'radius' : 25,
        'vx':  Math.floor(Math.random() *101) - 50 ,
        'vy':  Math.floor(Math.random() * 101) - 50 ,
        'imgRadius' : 100 ,
        'angle' : Math.floor(Math.random() * 360 ) - 180
    }   

}
/* ### Initialization ### */
function start() {
    canvas = document.getElementById('canvas');
    document.getElementById("turbo").value = turboTime;
    ctx = canvas.getContext('2d');
    
    w = canvas.width;
    h = canvas.height;

    // Do init
    initParams()
    initGUI()
    initKeys(canvas)
    
    //Load images
    for(i = 0; i <images.length;i++)
    {
    imageObj[i] = new Image() ;
    imageObj[i].onload = function() {

        } ;
    }

    for(i =0 ; i < images.length ; i++) 
    {
        imageObj[i].src = images[i];
    } 
    // Draw for the first time
    drawAll()
 
    // Launch main animation loop
    onTick()
    
}
