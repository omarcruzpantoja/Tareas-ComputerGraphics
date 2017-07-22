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

	this.vA = [0, 0] ;
	this.vB = [pixX, 0+skewY*pixY]
	this.vC = [pixX +pixX*skewX, pixY +pixY*skewY]
	this.vD = [0+pixX*skewX, pixY] ;

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

function isInsideRectangleV2(rect,x,y)
{
	
	if(isInsideTriangle(rect.getVertexPos(rect.vA, rect.posX,rect.posY),
							rect.getVertexPos(rect.vB, rect.posX,rect.posY),
							rect.getVertexPos(rect.vC, rect.posX,rect.posY), x, y))
		return true ;
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

function insertRectV2(vA, vB, vC, vD, color, x ,y) {
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
	ctx.closePath() 

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
	if(stroke) 
		ctx.stroke() ;

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
	ctx.fillStyle = "blue";
	ctx.fillRect(x,y, 200, 150) ;
	ctx.fillStyle = "#390000";
	ctx.textAlign = "left" ;
	ctx.font = "90px arial";
	ctx.fillText("Build", x ,y+110) ; 

	ctx.fillStyle = "green";
	ctx.fillRect(x+200,y, 100, 150) ;
	ctx.fillStyle = "#390000";
	// ctx.textAlign = "center" ;
	ctx.font = "90px arial";
	ctx.fillText("-A", x+200 ,y+110) ; 

	ctx.fillStyle = "red";
	ctx.fillRect(x,y+150, 300, 150) ;
	ctx.fillStyle = "#390000";
	// ctx.textAlign = "center" ;
	ctx.font = "90px arial";
	ctx.fillText("-Block", x+20 ,y+250) ; 


}


//Draw the triangles when hovering difficulty (might be removed) 
function getInfoSelector(x,y, hard)
{
	if(hard == null)
	{
		ctx.beginPath() ;
		ctx.moveTo(x+50,y+35) ;
		ctx.lineTo(400,550) ;
		ctx.lineTo(700,550) ;
		ctx.closePath() ;
		ctx.strokeStyle = "green" ;
		ctx.stroke() ;
	}
	
	else
	{
		ctx.beginPath() ;
		ctx.moveTo(x+50,y+35) ;
		ctx.lineTo(450, 450) ;
		ctx.lineTo(450, 650) ;
		ctx.closePath() ;
		ctx.strokeStyle = "green" ;
		ctx.stroke() ;
	}
}

//*** ***//

//*** TEMPLATE PAGE VIEWS ***//

//Function with mainmenu's content (view)
function mainMenu() {

	//Reset canvas, add background color 
	currentLoad = "mainMenu" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(1,0, 0,1,0,0) ;
	insertRect(0,0,canvas.width, canvas.height,"#87ECEC",0,0,0) ;


	drawGrid(15,15) ;
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
	//insertEllipse(canvas.width/2, canvas.height/4*3+30 , 150,75, 0, 0, 2*Math.PI, true, "#64EC42", "Instructions", false,0,10, "40" ) ;
	
}

//Function cotaining difficulty select content (view)  
function difficultySelect() {
	//Reset canvas, add background color 
	currentLoad = "difficultySelect" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
	ctx.setTransform(1,0, 0,1,0,0) ;
	insertRect(0,0,canvas.width, canvas.height,"#87ECEC",0,0) ;
	drawGrid(15,15) ;

	addTitle(400,50) ;

	//Easy selection 
	insertEllipse(canvas.width/2-200, canvas.height/4 +40, 140,60, 0, 0, 2*Math.PI, true, "#64EC42", "Easy", false,0,20,"40" ) ;
	// if(isInsideEllipse(140,60, ))
	
	//Medium selection
	// insertEllipse(canvas.width/2-200, canvas.height/4*2+40, 140,60, 0, 0, 2*Math.PI, true, "#64EC42", "Medium", false,0,20,"40" ) ;
	
	//Hard selection 
	// insertEllipse(canvas.width/2-200, canvas.height/4*3+40 , 140,60, 0, 0, 2*Math.PI, true, "#64EC42", "Hard", false,0,20,"40" ) ;
			
	//GO back to main manu
	insertEllipse(100, 50 , 75,30, 0, 0, 2*Math.PI, true, "#64EC42", "Main Menu", false,0,7,"20", "black" ) ;		
}

//*** ***/