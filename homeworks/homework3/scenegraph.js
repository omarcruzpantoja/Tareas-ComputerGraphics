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
   
    var params
    function initParams() {
        params = {
            'x0': canvas.width/2,
            'y0': canvas.height/2 + canvas.height/4,
            'a1': 20,
            'a2': 0,
            'a3': 0,
        }
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
        gui.add(params,'a1').min(-80).max(120).step(1)
                               .onChange(onParamsChange)//.listen()
        gui.add(params,'a2').min(-80).max(150).step(1).onChange(onParamsChange)
        gui.add(params,'a3').min(0).max(+150).step(0.1)
                            .onChange(onParamsChange)//.listen()
        
        //var parent = document.getElementById('controls');      
        //parent.appendChild(gui.domElement);
    }
    // GUI callback when parameters are changed manually in the GUI
    function onParamsChange() {
        drawAll()
    }

    /* ### Keyboard ### */
    var currentlyPressedKeys = {};
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
        console.log(event)
        event.preventDefault();
        
        // Handle single key presses (for example for firing the gun)
        if (event.keyCode == 67) { // K
            console.log('Pressed "K"')
        }
    }
    function onKeyUp(event) {
    }
    

    /* ### Drawing ### */
    function drawArm(ctx) {
        // TODO
        ctx.strokeStyle="red";
       // ctx.strokeText('Draw arm here', 0,0)
        radius = 13;

        ctx.beginPath() ;
        ctx.arc(0, 0, radius ,0,Math.PI*2,false) ;
        ctx.closePath();
        

        ctx.moveTo(-1*(radius + 6), -1*(radius + 3)) ;
        ctx.lineTo(radius*2 + 85, -1*(radius+3)) ;
        ctx.lineTo(radius*2 + 85, (radius+3)) ;
        ctx.lineTo(-1*(radius + 6), radius+3) ;
        ctx.closePath() ;

       // ctx.beginPath() ;
        ctx.lineWidth = 2 ;
        ctx.stroke() ;


    }
    function drawUpperLeg(ctx) {
        // TODO
        ctx.strokeStyle="green";
        radius = 13;

        ctx.beginPath() ;
        ctx.arc(0, 0, radius ,0,Math.PI*2,false) ;
        ctx.closePath();
        

        ctx.moveTo(-1*(radius + 8), -1*(radius + 9)) ;
        ctx.lineTo(radius*2 + 58, -1*(radius+9)) ;
        ctx.lineTo(radius*2 + 58, (radius+9)) ;
        ctx.lineTo(-1*(radius + 8), radius+9) ;
        ctx.closePath() 
        ctx.lineWidth = 2 ;
        ctx.stroke() ;
    }
    function drawLowerLeg(ctx) {
        // TODO
        radius = 13;

        ctx.beginPath() ;
        ctx.arc(0, 0, radius ,0,Math.PI*2,false) ;
        ctx.closePath();
        

        ctx.moveTo(-1*(radius + 9), -1*(radius*2 -2)) ;
        ctx.lineTo(radius + 9, -1*(radius*2-2)) ;
        ctx.lineTo(radius + 9, (radius*2+50)) ;
        ctx.lineTo(-1*(radius + 9), radius*2+50) ;
        ctx.closePath() 

        ctx.moveTo(radius + 9, (radius*2+50)) ;
        ctx.lineTo(radius + 40,(radius*2+50)) ;
        ctx.lineTo(radius + 40,(radius*2+30)) ;
        ctx.lineTo(radius + 9,(radius*2+30)) ;
        ctx.lineWidth = 2 ;
        ctx.stroke() ;
    }
    function drawBody(ctx) {
        // TODO
        ctx.strokeStyle="black";

        ctx.lineWidth = 2 ;
        radius = 40 ;
       // ctx.strokeText('Draw body here', 0,0)
        ctx.beginPath() ;
        ctx.arc(-40,-1*(160+radius), radius, 0, 2*Math.PI, false) ;
        ctx.closePath() ;
            ctx.stroke() ;

        ctx.beginPath() ;
        ctx.ellipse(-20, -1*(178+radius), 10, 7, 0, 0, Math.PI*2, false) ;
        ctx.closePath();
        
        ctx.moveTo(-40 - radius*Math.cos(5*Math.PI/4), -(160+radius) -radius*Math.sin(5*Math.PI/4)) ;
        ctx.lineTo(-35, -195) ;


        ctx.moveTo(0,0) ;
        ctx.lineTo(0,-160) ;
        ctx.lineTo(-80,-160) ;
        ctx.lineTo(-80,0) ;
        ctx.closePath() ;

        ctx.stroke() ;


    }

    function drawAll() {
        // Reset transform before clearing the canvas
        ctx.setTransform(1,0,0, 1,0,0)
        ctx.clearRect(0,0,canvas.width,canvas.height)

        ctx.save()
        ctx.translate(params.x0 -40, params.y0 -160*3/4 )
        ctx.rotate(params.a1 * Math.PI/180) ;
        drawArm(ctx)
        ctx.restore()
        
        ctx.save()
        ctx.translate(params.x0 - 40, params.y0 - 35)
        ctx.rotate(params.a2 * Math.PI/180) ;
        drawUpperLeg(ctx)
        ctx.restore()
        
        ctx.save()
        xPosition = Math.cos(params.a2*Math.PI/180) *25;
        yPosition = Math.cos(params.a2*Math.PI/180) *35 ;
        ctx.translate(params.x0 + xPosition, params.y0- yPosition )
        ctx.rotate(params.a3 * Math.PI/180) ;
        drawLowerLeg(ctx)
        ctx.restore()
        
        ctx.save()
        ctx.translate(params.x0, params.y0)
       // ctx.rotate(params.a3 * Math.PI/180) ;
        drawBody(ctx)
        ctx.restore()
    }

    /* ### Initialization ### */ 
    function start() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        
        w = canvas.width;
        h = canvas.height;

        // Do init
        initParams()
        initGUI()
        initKeys(canvas)
        
        // Draw for the first time
        drawAll()

        // Launch main animation loop
        //onTick()
    }