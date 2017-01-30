    // Keep canvas, ctx, svg and model as global variables
    // Dirty, but practical for this small scale demo
    // A real production system would need to define a scope to protect them
    var canvas;
    var ctx;
    var svg;
    
    /* ### Model ### */
    
    var model ;
    var svgmodel ;
   
    function initModel() {
        model = {color : ['orange', 'red', 'pink', 'cyan'] ,
        		 names : ['CLYDE', 'BLINKY', 'PINKY', 'INKY'] ,
        		 current : 0  } ;
        svgmodel = {color : ['orange', 'red', 'pink', 'cyan'] ,
                 names : ['CLYDE', 'BLINKY', 'PINKY', 'INKY'] ,
                 current : 0  } ;
    }

    /* ### Mouse ### */
    
    function initMouse(canvas) {
        canvas.addEventListener("mousedown", onMouseDown, false);
       // canvas.addEventListener("mouseup", onMouseUp, false);
    }
    function onMouseDown(event) {
        console.log("onMouseDown: event = ",event);        
        if (event.target==canvas)
        {
            //document.getElementById('msgBox').innerHTML = "mouseDown in canvas";
            
            //Update to the new ghost
            model.current+=1 ;
            //Mod 4 to go through the 4 ghosts
            model.current = model.current% (model.names.length) ;

            //Actually draw the ghost
            drawCanvas() ;
            document.getElementById('msgBox').innerHTML = "Change ghost in canvas to: " + model.names[model.current];
        }
        else
        {
            svgmodel.current+=1 ;
            svgmodel.current = svgmodel.current % svgmodel.names.length ;
            document.getElementById("msgBox").innerHTML = "Change ghost in SVG to: " + svgmodel.names[model.current];
            document.getElementById('SvgText').innerHTML = svgmodel.names[svgmodel.current]
            document.getElementById('mySVG').style = "fill:"+ svgmodel.color[svgmodel.current] ;

        }
    }
    // function onMouseUp(event) {
    //     console.log("onMouseUp: event = ",event);        
    //     document.getElementById('msgBox').innerHTML = 
    //        "mouseUp";
    // }

    /* ### Drawing ### */

    function drawCanvas() {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.fillStyle = "black" ;
        ctx.fillRect(0, 0, 200, 200) ;
        var midPointx = canvas.width/2 ;
        var midPointy = 80
        var radius = 60 ;
        var startAngle =0 ;
        var endAngle = Math.PI ;
        var counter = true ;


        //Hacer el body del ghost
        // Just draw stuff: hardcoded. Replace with your own stuff
        ctx.beginPath();
        ctx.moveTo(40, 80);
        ctx.lineTo(40, 160);
        //Aqui hacemos los triangulos de abajo
        ctx.lineTo(60, 140) ;
        ctx.lineTo(80, 160) ;
        ctx.lineTo(100, 140) ;
        ctx.lineTo(120, 160) ;
        ctx.lineTo(140, 140) ;
        ctx.lineTo(160, 160) ;
        //Aqui sube
        ctx.lineTo(160, 80);
        //Arc para la parte de arriba del ghost
        ctx.arc(midPointx, midPointy , radius, startAngle, endAngle, counter) ;
        ctx.closePath() ;
        ctx.fillStyle = model.color[model.current];
        ctx.fill();

        //This variable will be used to determine wether the eyes of the ghost will
        //be looking to the right or to the left
        eyePosition = Math.floor(Math.random() * 2);
        drawEyes(78,80, eyePosition) ;
        drawEyes(122,80, eyePosition) ;

        
       
        ctx.font = "bold 20pt Calibri" ;
       	ctx.textAlign="center"; 
        ctx.fillStyle = "white" ;
        ctx.fillText(model.names[model.current], midPointx, 185 ) ;
		ctx.closePath() ;

        //Hacer el ojo izquierdo

       // ctx.strokeStyle = 'blue';
       // ctx.lineWidth = 2;
       // ctx.stroke();
    }

    function drawEyes(x,y, eye)
    {
    	startAngle = 0 ;
    	endAngle = 2*Math.PI ;
    	ctx.beginPath() ;
    	ctx.ellipse(x,y,17,20,0,startAngle,endAngle);
    	ctx.closePath() ;
    	ctx.fillStyle = "white" ;
    	ctx.fill() ;
    	
    	eyeSpot = 7 ;
    	if(eye == 0)
    		eyeSpot = eyeSpot*-1 ;
    	
    		ctx.beginPath()
    		ctx.ellipse(x+eyeSpot, y+2, 7,9, 0, startAngle, endAngle) ;
    		ctx.closePath() ;
    		ctx.fillStyle = "#406AA6" ;
    		ctx.fill() ;
    	
    
    		ctx.beginPath()
    		ctx.ellipse(x+ eyeSpot, y+3, 7,8, 0, startAngle, endAngle) ;
    		ctx.closePath() ;
    		ctx.fillStyle = "#406AA6" ;
    		ctx.fill() ;
    	



    }

    /* ### Initialization ### */ 
    
    function onLoad() {
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
        svg = document.getElementById('mySVG');

        // Do init
        initModel() ;
        initMouse(canvas) ;
        initMouse(svg) ;

        // Draw stuff on the canvas
        drawCanvas() ;
        
    }