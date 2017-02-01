    // Keep canvas, ctx, svg and model as global variables
    // Dirty, but practical for this small scale demo
    // A real production system would need to define a scope to protect them
    var canvas;
    var ctx;
    var svg;
    
    /* ### Model ### */
    
    var model ;
    var svgmodel ;
    var canvasPosition ;
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
        canvas.addEventListener("mousemove", onMouseMove, false) ;
       // canvas.addEventListener("mouseup", onMouseUp, false);
    }
    function onMouseMove(event) {
      //  console.log("onMouseMove: event = ",event);
        if (event.target == canvas)
            drawCanvas("mouseMove", event.clientX  , event.clientY ) ;
        else
            updateSVG("mouseMove", event.clientX, event.clientY) ;

    }
    function onMouseDown(event) {
        //console.log("onMouseDown: event = ",event);        
        if (event.target==canvas)
        {
            
            //Update to the new ghost
            model.current+=1 ;
            //Mod 4 to go through the 4 ghosts
            model.current = model.current% (model.names.length) ;

            //Actually draw the ghost
            drawCanvas("mouseDown",0,0) ;
            document.getElementById('msgBox').innerHTML = "Change ghost in canvas to: " + model.names[model.current];
        }
        else
        {
            //alert(event.clientX) ;
            svgmodel.current+=1 ;
            svgmodel.current = svgmodel.current % svgmodel.names.length ;
            document.getElementById("msgBox").innerHTML = "Change ghost in SVG to: " + svgmodel.names[model.current];
            updateSVG("mouseDown",0,0) ;
        }
    }
    // function onMouseUp(event) {
    //     console.log("onMouseUp: event = ",event);        
    //     document.getElementById('msgBox').innerHTML = 
    //        "mouseUp";
    // }

    /* ### Drawing ### */
    function updateSVG(myEvent, moveX, moveY){
        
        if(myEvent == "mouseDown")
        {
            document.getElementById('SvgText').innerHTML = svgmodel.names[svgmodel.current] ;
            document.getElementById('mySVG').style = "fill:"+ svgmodel.color[svgmodel.current] ;
            var eyePos = Math.floor(Math.random() * 2) ;
            if(eyePos)
            {
                document.getElementById('leftSVGEye').setAttribute("cx", "85") ;
                document.getElementById('rightSVGEye').setAttribute("cx", "129")

            }
            else
            {
                document.getElementById('leftSVGEye').setAttribute("cx", "71") ;
                document.getElementById('rightSVGEye').setAttribute("cx", "115") ;
            }
        }

        else if(myEvent == "mouseMove")
        {
            drawSVGEyes(78, 80, moveX, moveY, 0) ;
            drawSVGEyes(122, 80, moveX, moveY, 1) ;
            // console.log('termino') ;
        }
    }

    function drawSVGEyes(x, y, moveX, moveY, eye)
    {
            var mySVG = document.getElementById('mySVG') ;  
            var svgBox = mySVG.getBBox() ;
            var SVGPos = mySVG.getBoundingClientRect() ;
            
            var centerY = svgBox.height/2 ;
            var middleY = (SVGPos.top +SVGPos.bottom)/2 ;
            middleY = middleY - centerY + y;
            var deltaY = middleY - moveY ;

            var centerX = svgBox.width/2 ;
            var middleX = (SVGPos.left + SVGPos.right)/2 ;
            middleX = middleX - centerX + x ;
            var deltaX = moveX - middleX ;

            var rad = Math.atan2(deltaY,deltaX) ;

            var modEye = "leftSVGEye";
            if(eye == 1)
                modEye = "rightSVGEye" ;

            var eyeX = (7)*Math.cos(rad) ;
            var eyeY = (-8)*Math.sin(rad) ;
           
            document.getElementById(modEye).setAttribute("cx", x+eyeX) ;
            document.getElementById(modEye).setAttribute("cy", y+eyeY)
            
    }
    function drawCanvas(myEvent,eventX, eventY) {
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
        
        if(myEvent == "mouseDown") 
        {
            eyePosition = Math.floor(Math.random() * 2);
            drawEyes(78,80, eyePosition, myEvent, eventX, eventY) ;
            drawEyes(122,80, eyePosition,myEvent, eventX, eventY) ;
        }
        else if(myEvent == "mouseMove")
        {   
            drawEyes(78,80, 0, myEvent, eventX, eventY) ;
            drawEyes(122,80, eyePosition,myEvent, eventX, eventY) ;
        }
       
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

    function drawEyes(x,y, eye, myEvent, moveX, moveY)
    {
    	startAngle = 0 ;
    	endAngle = 2*Math.PI ;
        radius = 18 ;

    	ctx.beginPath() ;
    	ctx.arc(x,y,radius,startAngle,endAngle, false);
    	ctx.closePath() ;

    	ctx.fillStyle = "white" ;
    	ctx.fill() ;

    	var eyeX,eyeY ;
       
        if(myEvent == "mouseDown")
        {
        	eyeX = 7 ;
            eyeY = 2 ;
        	if(eye == 0)
        		eyeX = eyeX*-1 ;
        }
        else if(myEvent == "mouseMove")
        {
            var centerY = canvas.height /2 ;
            var middleY = (canvasPosition.top + canvasPosition.bottom )/2  ;
            middleY = middleY - centerY + y ;
            var deltaY = middleY - moveY ;
            
            var centerX = canvas.width /2 ;
            var middleX = (canvasPosition.left + canvasPosition.right ) /2  ;
            middleX = middleX - centerX + x ;
            var deltaX = moveX - middleX ;
            
            var rad = Math.atan2(deltaY, deltaX) ;

            eyeX = (7)*Math.cos(rad) ;
            eyeY = (-8)*Math.sin(rad) ;
           // console.log(rad) ;
      
        }

    	ctx.beginPath()
    	ctx.ellipse(x+eyeX, y+eyeY, 7,9, 0, startAngle, endAngle) ;
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
        canvasPosition = canvas.getBoundingClientRect() ;
        drawCanvas("mouseDown",0,0) ;

        
    }