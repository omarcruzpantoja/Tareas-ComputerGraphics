// Developed by: Omar Cruz Pantoja
// First beta completed on: 25/Julio/2017
// Computer Graphics-4995

//Global variable used in howtoplay animation
//Must fix globals and enclose them in functions for safety 	
tutorialCoords = {
"a": [620,400,150,150 , "#0f93e2"] , 
"b" : [500,400,100,150,"#00be01"] ,
"c" : [500,600,250,150,"red"]  
}

//*** MAIN FIGURES ***//

function Rectangle(posX, posY, pixX, pixY, color, rot, skewX, skewY, info )
{

	//Position X/Y relative to original coordinate frame (origin) 
	this.posX = posX ;
	this.posY = posY ;

	//Pixels used to create rectangle
	//pixX pixels right or left (+ or -)
	this.pixX = pixX ;
	//pixY pixels down or up (+ or -)
	this.pixY = pixY ;
	//Set color of the figure
	this.color = color ;
	//Set rotation of the figure
	this.rot = rot ;
	//Set the type of the class
	this.type = "rectangle" ;
	//Set skew x axis
	this.skewX = skewX ;
	//Set skew y axis;
	this.skewY = skewY ;
	//Set rectangle info
	this.info = info

	this.vA = [-pixX/2, -pixY/2] ;
	this.vB = [pixX/2, -pixY/2+skewY*pixY]
	this.vC = [pixX/2 +pixX*skewX, pixY/2 +pixY*skewY]
	this.vD = [-pixX/2+pixX*skewX, pixY/2] ;
	// console.log(this.vA, this.vB, this.vC, this.vD, this.skewX)
	this.ogA = this.vA.slice() ;
	this.ogB = this.vB.slice() ;
	this.ogC = this.vC.slice() ;
	this.ogD = this.vD.slice() ;

	this.getVertexPos = function(v,x,y) { return [v[0]+x, v[1]+y]} ;

	//Function to update rotation of triangle when applied
	this.setRot = function(add) 
	{ 
		//Update rotation and convert to rads
		//Use % to prevent overflows
		this.rot = (this.rot+add*Math.PI/180)%360 ;
		
		//Update rotation element of the triangle
		rads = this.rot ;

		
		//Update vertice's positions 
		x = this.ogA[0] ;
		y = this.ogA[1] ;
		this.vA[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
		this.vA[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;

		//Vector 2 update
		x = this.ogB[0] ;
		y = this.ogB[1] ;
		this.vB[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
		this.vB[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;
		
		//Vector 3 update
		x = this.ogC[0] ;
		y = this.ogC[1] ; 
		this.vC[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
		this.vC[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;

		//Vector 3 update
		x = this.ogD[0] ;
		y = this.ogD[1] ; 
		this.vD[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
		this.vD[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;


	}

}

function Triangle(vA, vB, vC, posX,posY, color, rot, info) 
{
	//Set degree to rads 
	rads = rot/180*Math.PI ;

	//Pixels used to create triangle (it's dimensions) 
	//Point 1 (vector) 
	this.vA = vA ;
	//Point 2 (vector) 
	this.vB = vB ;
	//Point 3 (vector) 
	this.vC = vC ;

	//Position of the triangle relative to the origin
	this.posX = posX ;
	this.posY = posY ;
	//Set rotation of triangle
	this.rot = rads ;
	//Set type of class
	this.type = "triangle" ;
	//Set color of triangle
	this.color = color ;
	//Set triangle info
	this.info = info

	//Create copies of dimensions to be used when rotation is applied
	this.ogB = vB.slice() ;
	this.ogC = vC.slice() ;
	// this.vA = function() { return }	
	this.getVertexPos = function(v,x,y) { return [v[0]+x, v[1]+y]} ;

	//Function to update rotation of triangle when applied
	this.setRot = function(add) 
	{ 
		//Update rotation and convert to rads
		//Use % to prevent overflows
		this.rot = (this.rot+add*Math.PI/180)%360 ;
		
		//Update rotation element of the triangle
		rads = this.rot ;

		
		//Update vertice's positions 
		//First vector won't have to be modified since it is the origin point(0,0)
		//therefor it won't have any update

		//Vector 2 update
		x = this.ogB[0] ;
		y = this.ogB[1] ;
		this.vB[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
		this.vB[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;
		
		//Vector 3 update
		x = this.ogC[0] ;
		y = this.ogC[1] ; 
		this.vC[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
		this.vC[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;


	}
}


//*** ***//

//***CHECK IF A POINT IS INSIDE A FIGURE***//

//Function to identify if given x,y coordinate is inside an ellipse 
function isInsideEllipse(a,b, x,y, h,k)
{
	if(a == 0 || b == 0)
		console.log("ERROR WITH GIVEN ELLIPSE VALUES") 

	//Use ellipse formula to identify 
	//(x^2/a^2) + (y^2/b^2) = 1 where x and y are the coords of the point
	//to be tested 

	a = a*a ;
	b = b*b ;

	//h and k are used to identify the center of the ellipse
	x = x-h ;
	y = y-k ;

	x = x*x ;
	y = y*y ;

	//If it's inside, itll be less than 1
	if((x/a) + (y/b) <= 1)
		return true ;
	//Else, its outside 
	else
		return false; 
}

//Check if point is inside a square 
function isInsideRectangle(x,y,pixx,pixy,mousex ,mousey)
{
	//Check if the point coords are inside the dimensions of the rectangle
	if(mousex <= pixx+x && mousex >= x && mousey <= pixy+y && mousey >= y)
		return true ;
	else 
		return false ;
}


//Function to check if the point (x,y) is inside a parallelogram
function isInsideRectangleV2(rect,x,y)
{
	//Divide the parallelogram in two tringles, and check if is isnide any of the triangles 
	if(isInsideTriangle(rect.getVertexPos(rect.vA, rect.posX,rect.posY),
							rect.getVertexPos(rect.vB, rect.posX,rect.posY),
							rect.getVertexPos(rect.vC, rect.posX,rect.posY), x, y))
		return true ;
	//Divide the parallelogram in two tringles, and check if is isnide any of the triangles 
	else if(isInsideTriangle(rect.getVertexPos(rect.vA, rect.posX,rect.posY),
			rect.getVertexPos(rect.vD, rect.posX,rect.posY),
			rect.getVertexPos(rect.vC, rect.posX,rect.posY), x, y))
		return true ;

	return false;
}

//Check if point inside triangle 
function isInsideTriangle(vA, vB, vC, x, y)
{

	// console.log(vA, vB, vC, x, y)
	//Determine using barycentric coords (i don't exactly understand this, but works)
	p1 = isInsideTriangleAux(vA,vB,x,y) ;
	p2 = isInsideTriangleAux(vB,vC,x,y) ;
	p3 = isInsideTriangleAux(vC,vA,x,y) ;

	return (p1 == p2 ) && (p2 == p3)
}

//Auxiliary function to get values and determine if point is inside a triangle 
function isInsideTriangleAux(vA,vB,x,y)
{
	// console.log(vA, vB,x,y)
	magic = ((vB[0] - vA[0])*(y-vA[1]) - (x - vA[0])*(vB[1] -vA[1]) )
	if(magic > 0 )
		return 1 ;
	else if(magic < 0 )
		return -1 ;
	else
		return 0 ;
}

//*** ***//


//*** INSERT GEOMTRETIES ***//

//Insert rectangle in position x,y 
function insertRect(x,y,pixelsX,pixelsY, color, skewX, skewY,  rotate)
{

	if(skewX == undefined )
	{	
		skewX = 0 ;
		skewY = 0 ;
		rotate = 0;
	}

	//Add color to rectangle
	ctx.fillStyle  = color ;
	//Transform (relocate) in a new coordinate frame
	ctx.setTransform(1,skewX, skewY, 1,x,y)
	//Add rotation to rectangle 
	ctx.rotate(rotate/180*Math.PI)
	//Draw the rectangle 
	ctx.fillRect(0,0,pixelsX,pixelsY) ;

}

function insertRectV2(start, vA, vB, vC, vD, color, x ,y) {
	//Set new coordinate frame with x y coords 
	ctx.setTransform(1,0,0,1,x,y) ;
	//Set pentagon color
	ctx.fillStyle = color ;
	//Skect the triangle with it's coords 
	ctx.beginPath() ;
	ctx.moveTo(vA[0], vA[1]) ;
	ctx.lineTo(vB[0], vB[1]) ;
	ctx.lineTo(vC[0], vC[1]) ;
	ctx.lineTo(vD[0], vD[1]) ;
	// ctx.lineTo(vA[0], vA[1]) ;
	
	ctx.closePath() 
	// console.log(vA,vB,vC) ;
	//Draw REctangle
	ctx.fill()
}

//Insert rectangle in position x,y 
function insertTriangle(vA, vB, vC, color, x,y,stroke) {

	//Add color to triangle
	ctx.fillStyle = color ;
	//Set new coordinate frame with x y coords
	ctx.setTransform(1,0, 0,1,x,y)
	//Sketch the triangle with it's vector dimensions 
	ctx.beginPath() ;
	ctx.moveTo(vA[0], vA[1]) ;
	ctx.lineTo(vB[0], vB[1]) ;
	ctx.lineTo(vC[0], vC[1]) ;
	ctx.closePath() ;

	ctx.strokeStyle = "#000001"
	//Draw the triangle 
	if(stroke == true)
		ctx.stroke() ; 
	ctx.fill() ;

}

//Insert pentagon in position x, y
function insertPentagon(vA,vB,vC,vD,vF, x,y, color)
{
	//Set new coordinate frame with x y coords 
	ctx.setTransform(1,0,0,1,x,y) ;
	//Set pentagon color
	ctx.fillStyle = color ;
	//Skect the triangle with it's coords 
	ctx.beginPath() ;
	ctx.moveTo(vA[0], vA[1]) ;
	ctx.lineTo(vB[0], vB[1]) ;
	ctx.lineTo(vC[0], vC[1]) ;
	ctx.lineTo(vD[0], vD[1]) ;
	ctx.lineTo(vF[0], vF[1]) ;
	ctx.closePath() ;

	//Draw the pentagon 
	ctx.fill() ;
} 


//Insert ellispe with x,y coords 
function insertEllipse(x, y, radiusx,radiusy, rotation, start, end, counter, color, text, stroke,textX, textY,font, fontColor )
{
	ctx.setTransform(1,0,0,1,0,0) ;
	//Set color of ellipse 
	ctx.fillStyle = color;
	//Sketch the ellipse 
	ctx.beginPath() ;
	ctx.ellipse(x, y , radiusx,radiusy, rotation, start, end, counter) ;
	ctx.strokeStyle = "black" ;


	if(stroke) 
	{
		ctx.stroke() ;
		ctx.lineWidth = 3;
	}


	//Draw the elipse
	ctx.fill() ;

	//Add text to the ellipse 
	fontSize = font + "px sans-serif" ;
		if(fontColor == null)
			fontColor = "white"
	if(text.length > 0)
	{
		ctx.fillStyle = fontColor;
		// ctx.font = "30px Comic Sans MS" ;
		ctx.font = fontSize ;
		ctx.textAlign = "center";
		ctx.fillText(text,x+textX,y+textY)
	}
	ctx.closePath() ;

}

function insertTiltedRectangle(x,y,pixelsX,pixelsY, color, skew,  rotate)
{
	
}
//*** ***//

//*** MISCELANIOUS DRAWING FUNCTIONS ***//

//Draw a grid in the cavas, row/col will determine how many 
//lines will be drawn, xR/yR contains the space which the grid will be drawn in
function drawGrid(row, col,xR,yR)
{
	if(xR == null && yR == null)
	{
		xR = canvas.width ;
		yR = canvas.height
	}
	//Add color to grid 
	ctx.strokeStyle = "#BDBDBD";

	//Draw all Y axis horizontal  lines 
	var x  = xR/col ;
	var pos =0  ;
	ctx.beginPath() ;
	for(i = 1 ; pos < xR; i++)
	{	
		pos = x*i
		ctx.moveTo(pos,0) ;
		ctx.lineTo(pos,yR) ;
		
	}

	//Draw all x axis verticallines 
	var y  = yR/row ;
	var pos =0  ;
	for(i = 1 ; pos < yR; i++)
	{	
		pos = y*i
		ctx.moveTo(0,pos) ;
		ctx.lineTo(xR ,pos) ;
		// ctx.stroke() ;

	}
	ctx.stroke() ;
	// ctx.closePath() ;
			// var y  = canvas.w
}

//Add game's logo 
function addTitle(x,y) {
	ctx.fillStyle = "#0f93e2";
	ctx.fillRect(x,y, 200, 150) ;
	ctx.fillStyle = "#390000";
	ctx.textAlign = "left" ;
	ctx.font = "90px arial";
	ctx.fillText("Build", x ,y+110) ; 

	ctx.fillStyle = "#00be01";
	ctx.fillRect(x+200,y, 100, 150) ;
	ctx.fillStyle = "#390000";
	// ctx.textAlign = "center" ;
	ctx.font = "90px arial";
	ctx.fillText("-A", x+200 ,y+110) ; 

	ctx.fillStyle = "red";
	ctx.fillRect(x,y+150, 300, 140) ;
	ctx.fillStyle = "#390000";
	// ctx.textAlign = "center" ;
	ctx.font = "90px arial";
	ctx.fillText("-Block", x+20 ,y+250) ; 


}


//Draw the triangles when hovering difficulty (might be removed) 
// function getInfoSelector(x,y, hard)
// {
// 	if(hard == null)
// 	{
// 		ctx.beginPath() ;
// 		ctx.moveTo(x+50,y+35) ;
// 		ctx.lineTo(400,550) ;
// 		ctx.lineTo(700,550) ;
// 		ctx.closePath() ;
// 		ctx.strokeStyle = "green" ;
// 		ctx.stroke() ;
// 	}
	
// 	else
// 	{
// 		ctx.beginPath() ;
// 		ctx.moveTo(x+50,y+35) ;
// 		ctx.lineTo(450, 450) ;
// 		ctx.lineTo(450, 650) ;
// 		ctx.closePath() ;
// 		ctx.strokeStyle = "green" ;
// 		ctx.stroke() ;
// 	}
// }

//*** ***//

//*** TEMPLATE PAGE VIEWS ***//

//Function with mainmenu's content (view)
function mainMenu() {

	//Reset canvas, add background color 
	currentLoad = "mainMenu" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(1,0, 0,1,0,0) ;

    //Draw background image
	ctx.drawImage(img[1],0,0, canvas.width, canvas.height) ;


	//Insert title (Build-A-Block) 
	addTitle(350,50) ;

	//Insert triangle
	insertTriangle([200,750], [50,600],[150,400], "black") ;

	//Insert rectangle
	insertRect(10,50,200,200, "black", .5,.5) ;

	insertPentagon([100,200],[200,200],[250,100],[150,0],[50,100], 525,425,"black") ;
	
	//Insert Play ellipse
	insertEllipse(canvas.width/2, canvas.height/2 +30 , 150,75, 0, 0, 2*Math.PI, true, "#64EC42", "PLAY", false,0,20, "40" ) ;
	//Insert instructions ellipse
	insertEllipse(canvas.width/2, canvas.height/4*3+30 , 150,75, 0, 0, 2*Math.PI, true, "#64EC42", "How-To-Play", false,0,10, "40" ) ;
	
}

//Function cotaining difficulty select content (view)  
function difficultySelect() {
	//Reset canvas, add background color 

	currentLoad = "difficultySelect" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
	ctx.setTransform(1,0, 0,1,0,0) ;
	ctx.save() ;
	ctx.drawImage(img[1],0,0, canvas.width, canvas.height) ;
	addTitle(400,50) ;

	//Level 1 selection 
	insertEllipse(canvas.width/2-200, canvas.height/4 +40, 140,60, 0, 0, 2*Math.PI, true, "#64EC42", "1", false,0,20,"40" ) ;
	
	
	//Level 2 selection
	insertEllipse(canvas.width/2-200, canvas.height/4*2+40, 140,60, 0, 0, 2*Math.PI, true, "#64EC42", "2", false,0,20,"40" ) ;
	
	//Level 3 selection 
	insertEllipse(canvas.width/2-200, canvas.height/4*3+40 , 140,60, 0, 0, 2*Math.PI, true, "#64EC42", "3", false,0,20,"40" ) ;
			
	//GO back to main manu
	//Image go back

	//Draw the rectangle which will contain text 
	ctx.fillStyle = "#ffe4b5" ;
	//Add fade to the rectangle 
	ctx.globalAlpha = 0.4; 
	ctx.fillRect(370,500,350,70) ;
	ctx.fillStyle = "#390000";

	//Return alpha bit to normal 
	ctx.globalAlpha = 1.0;
	ctx.textAlign = "left" ;
	ctx.font = "22px arial";
	//Add text 
	ctx.fillText("Select a level to play, if you're new", 380 ,520) ; 
	ctx.fillText("player make sure to go through the", 380 ,540) ;
	ctx.fillText("How-To-Play section.", 380, 560) ; 
	
	//Draw back image 
	ctx.drawImage(img[4], 15,15,100,60) ;
	ctx.restore()
}
	
//Function with mainmenu's content (view)
function howToPlay() {

	//Reset canvas, add background color 
	currentLoad = "HowToPlay" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(1,0, 0,1,0,0) ;

	ctx.drawImage(img[1],0,0, canvas.width, canvas.height) 

	//Add rectangle and text containing the intructions
	ctx.fillStyle = "#ffe4b5" ;
	//Fade the rectangle added 
	 ctx.globalAlpha = 0.4; 
	ctx.fillRect(10,110,450,130) ;
	ctx.fillRect(10,710,390,50) ;
	ctx.fillStyle = "#390000";

	//Go back to regular alpha bit 
 	ctx.globalAlpha = 1.0;

	ctx.font = "22px arial";
	ctx.fillText("Purpose of game: Fill in the silhouette using", 22 ,150) ; 
	ctx.fillText("colored figures. All the pieces are used in ", 22 ,170) ; 
	ctx.fillText("each puzzle. Left click and drag the small", 22,190) ; 
	ctx.fillText("pieces onto the new position.", 22 ,210) ;  


	ctx.fillText("To rotate a figure, select the figure and", 22 ,730)
	ctx.fillText("then click any of these buttons.", 22 , 750)
	 
	// ctx.drawImage(img[1],0,0, canvas.width, canvas.height) ;
	addTitle(470,20) ;
	

	//GO back to main manu
	//Image to go back
	ctx.drawImage(img[4], 15,15,100,60) ;

	insertRect(170,650, 50,50, "blue") ;
	//Image for rotation 
	ctx.drawImage(img[3], 0,0,50,50)

	insertRect(100,650, 50,50, "blue" );
	//Image for rotation 
	ctx.drawImage(img[2], 0,0,50,50)
	tutorialExample() ;
}


function Level(x,y)
{
	//Reset canvas, add background color 
	currentLoad = "Level" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(1,0,0,1,0,0) ; 

	ctx.drawImage(img[1],0,0, canvas.width, canvas.height) ;

	//Image go back
	ctx.drawImage(img[4], 15,15,100,60) ;

	insertRect(680,650, 50,50, "blue") ;
	//Image rotation 
	ctx.drawImage(img[3], 0,0,50,50)

	insertRect(550,650, 50,50, "blue" );
	//Image rotation 
	ctx.drawImage(img[2], 0,0,50,50)
	
	window["solution"+level.toString()]() ; 

	setFigures(x,y) ;

}
//*** ***// 
 
//*** ANIMATION ***//

// ANIMATION FOR HOW TO PLAY SECTION 
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


//Helper functions for tick 
var lastTime = 0;
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
function tickTutorial() {
    
    //If the current screen is howtoplay, continue animation, else stop
    if(currentLoad=="HowToPlay") {
        updateTime()
        howToPlay();
    requestAnimFrame(tickTutorial);
	}
}

//Function to draw each triangle in it's position in howtoplay screen 
function tutorialExample(coords)
{

	//This is the silhuette black figure 
	insertRect(250,300,150,150,"black" )
	insertRect(150,300,100,150,"black" )
	insertRect(150,450,250,150,"black" )

	//These are the colores pieces, which will be animated 
	insertRect(tutorialCoords["a"][0],tutorialCoords["a"][1],tutorialCoords["a"][2],tutorialCoords["a"][3],tutorialCoords["a"][4] )
	insertRect(tutorialCoords["b"][0], tutorialCoords["b"][1], tutorialCoords["b"][2],tutorialCoords["b"][3], tutorialCoords["b"][4])
	insertRect(tutorialCoords["c"][0], tutorialCoords["c"][1], tutorialCoords["c"][2], tutorialCoords["c"][3], tutorialCoords["c"][4])

	//Continue animation processs
	animateTutorial(tutorialCoords) 
}

function animateTutorial()	
{

	//Check if first square is set in it's final position, else continue animation 
	if(tutorialCoords["a"][0] != 250 && tutorialCoords["a"][1] != 300)
	{
		pace = (620 - 250)/200 ;
		tutorialCoords["a"][0] -= pace ;
		pace = (400-300)/200 ;
		tutorialCoords["a"][1] -= pace ;
	}
	//Check if second square is set in it's final position, else continue animation 
	else if(tutorialCoords["b"][0] != 150 && tutorialCoords["b"][1] != 300)
	{
		pace = (500 - 150)/200 ;
		tutorialCoords["b"][0] -= pace ;
		pace = (400-300)/200 ;
		tutorialCoords["b"][1] -= pace ;
	}

	//Check if third square is set in it's final position, else continue animation 
	else if(tutorialCoords["c"][0] != 150 && tutorialCoords["c"][1] != 450)
	{
		pace = (500 - 150)/200 ;
		tutorialCoords["c"][0] -= pace ;
		pace = (600-450)/200 ;
		tutorialCoords["c"][1] -= pace ;	
	}

	//If all figures are set in it's position, restart. 
	else
	{
		tutorialCoords = {
		"a": [620,400,150,150 , "#0f93e2"] , 
		"b" : [500,400,100,150,"#00be01"] ,
		"c" : [500,600,250,150,"red"]  
		}
	}

}