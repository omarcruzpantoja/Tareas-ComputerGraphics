// Omar Cruz Pantoja
// 801-14-1672
// Prof. Remi Megret
// CCOM-4995- Computer graphics
// 9/feb/2017
// polygon.js

var canvas;
var boundingBox ;

var model ;

function initModel() {

	var height = canvas.height;
	var width = canvas.width ;
	var midPoint = []
	midPoint[1] = height/2 ;
	midPoint[0] = width/2 ; 

	//The initial polygon will be a triangle centered based on width and height of the canvas
    model = { pts: [[midPoint[0],midPoint[1]-midPoint[1]/2 ],
    	[midPoint[0]-midPoint[0]/2,midPoint[1]+midPoint[1]/2],
    	[midPoint[0]+midPoint[0]/2,midPoint[1]+midPoint[1]/2]] ,

    	//Variable used to know which vertex is selected
    	selectedVertex : -1 } ;
    	//Variable to let know mousemove if the dragging will be happening
   		model.isDragging = false ;

   	boundingBox = [] ;

} ;

function initMouse(canvas, ctx) {
	//Mouse down to either select a vertex or click and drag
    canvas.addEventListener("mousedown", function(e) {getVertex(e,ctx)}, false);
    //Key down to add and remove vertex
    canvas.addEventListener("keydown", function(e) { modOnKeyDown(e, ctx)}, false) ;
    //End dragging
    canvas.addEventListener("mouseup", function() { model.isDragging = false }, false) ;
    //Click and draw vertex, will work in combination with mouse down
    canvas.addEventListener("mousemove", function(e) {moveDrag(e,ctx)},false )


}

function moveDrag(e,ctx) {

	//Check if the mouse is down(to click and draw vertices)
	if(model.isDragging)
		getVertex(e, ctx) ;
}
function modOnKeyDown(event, ctx) {
	
	//Check if any vertex is selected
	if(model.selectedVertex != -1){
		//Move Selected vertex according to the key arrow given by 10 pixels
		if([37,38,39,40].includes(event.keyCode) )
		{
			//Add buffer
			add = 10 ;
			if(model.selectedVertex >= 0 && (event.keyCode == 38 || event.keyCode == 40))
			{
				//Check if up arrow key pressed and check is inside the canvas box
				if(event.keyCode ==38 && model.pts[model.selectedVertex][1] > 5)
				{
					document.getElementById("msgBox").innerHTML = "Move vertex " + model.selectedVertex + " 10 pixels up"
					model.pts[model.selectedVertex][1] = model.pts[model.selectedVertex][1] - add ;
					drawPolygon(ctx) ;
				}
				//Check if down key pressed and check is inside the canvas box
				else if(event.keyCode ==40 && model.pts[model.selectedVertex][1] < canvas.height-10)
				{
					document.getElementById("msgBox").innerHTML = "Move vertex " + model.selectedVertex + " 10 pixels down"
					model.pts[model.selectedVertex][1] = model.pts[model.selectedVertex][1] + add ;
					drawPolygon(ctx) ;
				}
				
			}
			
			else
			{
				//Check if left arrow key is pressed and check is inside the canvas box
				if(event.keyCode== 37 && model.pts[model.selectedVertex][0] > 5)
				{
					document.getElementById("msgBox").innerHTML = "Move vertex " + model.selectedVertex + " 10 pixels to the left" 
					model.pts[model.selectedVertex][0] = model.pts[model.selectedVertex][0] - add ;
					drawPolygon(ctx) ;
				}

				//Check if right arrow key is pressed and check is inside the canvas box
				else if(event.keyCode == 39 && model.pts[model.selectedVertex][0] < canvas.width-5)
				{
					document.getElementById("msgBox").innerHTML = "Move vertex " + model.selectedVertex + " 10 pixels to the right"
					model.pts[model.selectedVertex][0] = model.pts[model.selectedVertex][0] + add ;
					drawPolygon(ctx) ;
				}
			}

		}

		//Check if - if pressed and remove selected vertex
		else if([173,109].includes(event.keyCode))
		{
			//Make sure we have at least 3 polygons, if so delete selected vertex
			if(model.pts.length > 3 )
			{
				//Delete selected vertex
				model.pts.splice(model.selectedVertex,1) ;
				document.getElementById("msgBox").innerHTML = "Removed vertex " +model.selectedVertex ;
				//Reset selected vertex
				model.selectedVertex = -1 ;
				drawPolygon(ctx) ;

			}
			//If there's only 3 notify user he can't delete
			else
				document.getElementById("msgBox").innerHTML = "Can't remove, must have a minimum of 3 points on canvas";
		}

		//If + is pressed, add new vertex at the midpoint between the selected vertex and next
		else if(107 == event.keyCode || (event.keyCode == 61 && event.shiftKey) )
		{
			var nextPtr = (model.selectedVertex + 1 )% model.pts.length ; 
			//Get x and y coords
			x1 = model.pts[model.selectedVertex][0] ;
			y1 = model.pts[model.selectedVertex][1] ;
			x2 = model.pts[nextPtr][0] ;
			y2 = model.pts[nextPtr][1] ;

			//Get midpoint
			midPointX = (x1 + x2 )/2 ;
			midPointY = (y1 + y2 )/2 ; 
			//Add the new vertex to the list
			model.pts.splice(model.selectedVertex+1, 0, [midPointX,midPointY]) ;
			//Actually draw the new vertex
			drawPolygon(ctx) ;
			document.getElementById("msgBox").innerHTML = "New vertex " + (model.pts.length - 1) ;
		}
	
	}
	//Prevent default events when inside the canvas(on pressing keys)
	event.preventDefault() ;
}

function getVertex(event, ctx) {
	
	//Get position of the cursor
	canvasPosition = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPosition.left ;
	y = event.clientY - canvasPosition.top ;
	
	inside = false ;

	//Get information of the closest point to the mouse coords ( take first to then update info by comparing, to take the smallest distance)
	var closest, scndClosest, closeDistance ;
	deltaX = x - model.pts[0][0] ;
	deltaY = y - model.pts[0][1] ;
	closest = 0 ;
	closeDistance = Math.sqrt(deltaX*deltaX + deltaY*deltaY) ;

	for(i = 0 ; i < model.pts.length ;i++) {
		deltaX = x - model.pts[i][0] ;
		deltaY = y - model.pts[i][1] ;
		distance = Math.sqrt( deltaX*deltaX + deltaY*deltaY ) ;
		if(distance < closeDistance)
		{
			closest = i ;
			closeDistance = distance ;
		}
		//Check if the mouse click is inside the circle's radius
		if(distance <= 6 )
		{
			model.selectedVertex = i ;
			inside = true ;
			document.getElementById("msgBox").innerHTML = "Selected vertex " + model.selectedVertex ;
			//If the user drags the vertex, it will change the position
			model.isDragging = true ;
			//Stop looping since we found a vertex inside the radius
			break ;
		}

	}
	
	//Check if a vertex is selected	
	if(model.isDragging && !inside)
	{
		//If the is true, reposition the vertex based on the cursor coords
		i = model.selectedVertex ;
		model.pts[i][0] = x;
		model.pts[i][1] = y;
	}
	
	//Add new vertex if click inside the bounding box and no vertex is selected
	else if(isInsideBoundingBox(x,y) && !inside )
	{
		//Check if eihter the previous or next point is closest to the closest point to the mouse coords
		secondPnt = (closest+ model.pts.length -1)% model.pts.length;
		deltaX = x - model.pts[(closest+1)%model.pts.length][0] ;
		deltaY = y - model.pts[(closest+1)%model.pts.length][1] ;
		distance1 = Math.sqrt( deltaX*deltaX + deltaY*deltaY ) ;

		deltaX = x - model.pts[(closest+model.pts.length-1)%model.pts.length][0] ;
		deltaY = y - model.pts[(closest+model.pts.length-1)%model.pts.length][1] ;
		distance2 = Math.sqrt( deltaX*deltaX + deltaY*deltaY ) ;

		//If the next point is closer than previous, update
		if(distance1 < distance2)
			secondPnt = closest ;

		//Add new point to the list of points
		model.pts.splice(secondPnt+1, 0, [x,y]) ;
	}

	//If outside the range of bounding box, don't selected vertex.
	
	else if(!inside && !model.isDragging)
	{
		model.selectedVertex = -1 ;
		document.getElementById("msgBox").innerHTML = "" ;
	}


	//Update polygon
	drawPolygon(ctx) ;
	
}
function drawPolygon(ctx) {

	//Clean the canvas
	ctx.clearRect(0,0, canvas.width, canvas.height) ;

	//Begin the drawing on the first vertex
	ctx.beginPath() ;
	ctx.moveTo(model.pts[0][0], model.pts[0][1]) ;
	//Draw the rest of the vertex
	for(i = 1 ; i < model.pts.length ; i++)
	{
		x = model.pts[i][0] ;
		y = model.pts[i][1] ;
		ctx.lineTo(x,y) ;
		//ctx.strokeRect(x-5, y-5, 10,10) ;
	}
	
	//Make the lines have color red
	ctx.closePath() ;
	ctx.lineWidth = 3 ;
	ctx.strokeStyle = "red" ;
	ctx.stroke() ;

	//Set polygon's fill color to cyan
	ctx.fillStyle = "cyan" ;
	ctx.fill() ;

	//Set circle radius line to black
	ctx.strokeStyle = "black" ;
	ctx.lineWidth = 2 ;	

	//Draw the circle around each vertex (must add with different for loops)
	//due to path detail
	for(i = 0 ; i < model.pts.length ; i++)
	{
		x = model.pts[i][0] ;
		y = model.pts[i][1] ;
		ctx.beginPath() ;
		ctx.arc(x,y, 5,0 , Math.PI*2,0)
		ctx.closePath() ;
		ctx.stroke() ;
		if(model.selectedVertex == i)
		{
			ctx.fillStyle = "yellow" ;
			ctx.fill() ;
		}
		
	}

	//Update bounding box
	drawBoundingBox(ctx) ;
}

function isInsideBoundingBox(x,y) {
	if(x >= boundingBox[0] && x <= boundingBox[2])
	{
		if(y>=boundingBox[1] && y <= boundingBox[3])
			//console.log("helo") 
			return true	;
	}

	return false ;

}
function drawBoundingBox(ctx){
	
	//Buffer containing limiting points
	//var boundingBox = [] ;

	for(i =0 ; i < 4 ; i++)
	{
		//Get first value to compare with rest of polygon's vertices
		//0 and 2 will contain X limiting values
		if(i%2==0)
			boundingBox[i] = model.pts[0][0] ;
		//1 and 3 will contain limiting Y values
		else
			boundingBox[i] = model.pts[0][1] ;
		
		//Go through all the vertices 
		for(j = 1 ; j < model.pts.length ; j++)
		{
			//Find the smallest limiting X Y values
			if(i < 2)
			{
				if(boundingBox[i] > model.pts[j][i])
					boundingBox[i] = model.pts[j][i] ;
			}
			//Find the biggest limiting X Y values
			else 
			{
				if(boundingBox[i] < model.pts[j][i%2])
				{
					boundingBox[i] = model.pts[j][i%2] ;
				}
			}

		}
	} 


	//Set dashed line
	ctx.setLineDash([6,6])

	//Start box
	ctx.beginPath() ;
	ctx.moveTo(boundingBox[0], boundingBox[1]) ;
	ctx.lineTo(boundingBox[2], boundingBox[1]) ;
	ctx.lineTo(boundingBox[2],boundingBox[3]) ;
	ctx.lineTo(boundingBox[0], boundingBox[3]) ;
	ctx.closePath() ;
	//Close Box
	//Set dash line color
	ctx.strokeStyle = "lightgrey" ;
	ctx.stroke() ;
	ctx.setLineDash([0,0]) ;

}

function onLoad(){


    canvas = document.getElementById('myCanvas');
    canvas.tabIndex = 1 ;
    var ctx = canvas.getContext('2d');

    //Intiate event trigger functions and the model
	initModel() ;
	initMouse(canvas, ctx) ;

	//Draw the polygon
	drawPolygon(ctx) ;
	
} ;