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

        //Rotate over the array to get each ghost
        model = {color : ['orange', 'red', 'pink', 'cyan'] ,
        		 names : ['CLYDE', 'BLINKY', 'PINKY', 'INKY'] ,
        		 current : 0  } ;
        svgmodel = {color : ['orange', 'red', 'pink', 'cyan'] ,
                 names : ['CLYDE', 'BLINKY', 'PINKY', 'INKY'] ,
                 current : 0  } ;
    }

    /* ### Mouse ### */
    
    function initMouse(canvas) {

        //Set functions triggered by events
        canvas.addEventListener("mousedown", onMouseDown, false);
        canvas.addEventListener("mousemove", onMouseMove, false) ;
      
    }
    function onMouseMove(event) {
     
        //Functions to make ghost eyes follow the mouse coords
        if (event.target == canvas)
            drawCanvas("mouseMove", event.clientX  , event.clientY ) ;
        else
            updateSVG("mouseMove", event.clientX, event.clientY) ;

    }
    function onMouseDown(event) {
               
        if (event.target==canvas)
        {
            
            //Update to the next ghost
            model.current+=1 ;
            //Mod 4 to go through the 4 ghosts
            model.current = model.current% (model.names.length) ;

            //Actually draw the ghost
            drawCanvas("mouseDown",0,0) ;
            document.getElementById('msgBox').innerHTML = "Change ghost in canvas to: " + model.names[model.current];
        }
        else
        {
            //Update to the next ghost
            svgmodel.current+=1 ;
            //Mod 4 to go through the 4 ghosts
            svgmodel.current = svgmodel.current % svgmodel.names.length ;

            //Actually draw the ghost
            document.getElementById("msgBox").innerHTML = "Change ghost in SVG to: " + svgmodel.names[model.current];
            updateSVG("mouseDown",0,0) ;
        }
    }

    /* ### Drawing ### */
    function updateSVG(myEvent, moveX, moveY){
        
        //If the event is mouse draw the new ghost
        if(myEvent == "mouseDown")
        {
            //Update color and name of ghost
            document.getElementById('SvgText').innerHTML = svgmodel.names[svgmodel.current] ;
            document.getElementById('mySVG').style = "fill:"+ svgmodel.color[svgmodel.current] ;
            //Get random value either for eyes to watch to left or right side
            var eyePos = Math.floor(Math.random() * 2) ;
            //If values will decide depending on eyePos variable position
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

        //If the event is mousemove insid the SVG, draw eye positions
        else if(myEvent == "mouseMove")
        {
            //Draw left eye
            drawSVGEyes(78, 80, moveX, moveY, 0) ;
            //Draw right eye
            drawSVGEyes(122, 80, moveX, moveY, 1) ;
            
        }
    }

    function drawSVGEyes(x, y, moveX, moveY, eye)
    {

        //Get mouse coord based on the angle created and then readjust to the position wanted
        //Using proportions to set the new eye positions
        var mySVG = document.getElementById('mySVG') ;  
        //Get position of svg
        var svgBox = mySVG.getBBox() ;
        var SVGPos = mySVG.getBoundingClientRect() ;
        
        //Get y position to calculate angle
        var centerY = svgBox.height/2 ;
        var middleY = (SVGPos.top +SVGPos.bottom)/2 ;
        middleY = middleY - centerY + y;
        var deltaY = middleY - moveY ;

        //Get x position to calculate angle
        var centerX = svgBox.width/2 ;
        var middleX = (SVGPos.left + SVGPos.right)/2 ;
        middleX = middleX - centerX + x ;
        var deltaX = moveX - middleX ;

        //Calculate angle 
        var rad = Math.atan2(deltaY,deltaX) ;


        var modEye = "leftSVGEye";
        if(eye == 1)
            modEye = "rightSVGEye" ;

        //Locate eyes
        var eyeX = (7)*Math.cos(rad) ;
        var eyeY = (-8)*Math.sin(rad) ;
       
        //Draw eyes
        document.getElementById(modEye).setAttribute("cx", x+eyeX) ;
        document.getElementById(modEye).setAttribute("cy", y+eyeY)
            
    }
    function drawCanvas(myEvent,eventX, eventY) {

        //Clean te vanvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        //Fill background with color black
        ctx.fillStyle = "black" ;
        ctx.fillRect(0, 0, 200, 200) ;

        //Set the position to create the circle(head of ghost)
        var midPointx = canvas.width/2 ;
        var midPointy = 80
        var radius = 60 ;
        //Draw only the top side
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


        
        if(myEvent == "mouseDown") 
        {
            //This variable will be used to determine wether the eyes of the ghost will
            //be looking to the right or to the left
            eyePosition = Math.floor(Math.random() * 2);

            //Draw both canvas eyes
            drawEyes(78,80, eyePosition, myEvent, eventX, eventY) ;
            drawEyes(122,80, eyePosition,myEvent, eventX, eventY) ;
        }
        else if(myEvent == "mouseMove")
        {   
            //Draw eyes based on mouse position
            drawEyes(78,80, 0, myEvent, eventX, eventY) ;
            drawEyes(122,80, eyePosition,myEvent, eventX, eventY) ;
        }
       
        //Add gghost name text
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

        //Draw white area of the eyes
    	ctx.beginPath() ;
    	ctx.arc(x,y,radius,startAngle,endAngle, false);
    	ctx.closePath() ;

    	ctx.fillStyle = "white" ;
    	ctx.fill() ;

    	var eyeX,eyeY ;
       
       //Locate eyes after click
        if(myEvent == "mouseDown")
        {
        	eyeX = 7 ;
            eyeY = 2 ;
        	if(eye == 0)
        		eyeX = eyeX*-1 ;
        }
        //Locate eyes based on mouse coords
        else if(myEvent == "mouseMove")
        {
            //Get mouse coord based on the angle created and then readjust to the position wanted
            //Using proportions to set the new eye positions

            //Get y angle position
            var centerY = canvas.height /2 ;
            var middleY = (canvasPosition.top + canvasPosition.bottom )/2  ;
            middleY = middleY - centerY + y ;
            var deltaY = middleY - moveY ;
            
            //Get x angle position
            var centerX = canvas.width /2 ;
            var middleX = (canvasPosition.left + canvasPosition.right ) /2  ;
            middleX = middleX - centerX + x ;
            var deltaX = moveX - middleX ;
            
            //Get angle 
            var rad = Math.atan2(deltaY, deltaX) ;

            //Locate eyes on new position
            eyeX = (7)*Math.cos(rad) ;
            eyeY = (-8)*Math.sin(rad) ;
           
      
        }

        //Draw eyes on thee new position
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