
//Global variables that MUST be saved 
var canvas ;
var ctx ;
var currentLoad ;

var Coords = {
	isDragging: false
}
var selected ;
var objects = []

function initListeners()
{
	canvas.addEventListener("mousedown", mouseDown, false) ;
	canvas.addEventListener("mousemove", mouseMove, false) ;
	canvas.addEventListener("mouseup", mouseUp, false) ;
	canvas.addEventListener("touchstart", test, false) ;
} 

function test(event)
{
	insertRect(200,200,200,300) ;
}
function init() {
	canvas = document.getElementById("canvas") 
	ctx = canvas.getContext("2d") ;

	initListeners() ;

	// mainMenu() ;
	// currentLoad = "mainMenu";
	// difficultySelect() ;
	// currentLoad = "difficultySelect" ;

	addFigures() ;
	currentLoad = "easyMode";
	easyMode() ;


}

function mouseDown(event)
{

	// console.log(event);
	if(currentLoad == "mainMenu")
	{
		clickMenu(event) ;

	}
	else if(currentLoad == "Instructions")
	{

	}
	else if(currentLoad == "difficultySelect") 
	{
		clickDifficulty(event) ;

	}
	else if(currentLoad == "easyMode") 
	{
		// addFigures() ;
		clickEasyMode(event) ;
	}
}

function clickMenu(event){
	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;
	if(isInsideEllipse(150,75, x, y,canvas.width/2, canvas.height/2 +30 ))
		difficultySelect() ;
}
function clickDifficulty(event) {
	
	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;
	if(isInsideEllipse(75,30, x, y,100, 50 ))
		mainMenu() ;

	if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4+40))
	{
		easyMode() ;
	}
	else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*2+40))
	{

	}
	else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*3+40))
	{

	}	
}

function mouseUp(event)
{
	// console.log(event);
	if(currentLoad == "easyMode") 
	{
		if(Coords.isDragging)
		{
			Coords.isDragging = false; 
			canvasPos = canvas.getBoundingClientRect() ;
			x = event.clientX - canvasPos.left ;
			y = event.clientY - canvasPos.top ;
			x = x - Coords.dragCoord[0][0] ; 
			y = Coords.dragCoord[0][1] - y  ;

			objects[selected].posX = objects[selected].posX+x ;
			objects[selected].posY = objects[selected].posY-y

			easyMode() ;
		}
	}
}

function mouseMove(event) {

	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;

	if(currentLoad == "difficultySelect") 
	{

		// var description = ["The easy challenges include the exact amount of pieces required to draw "]
		if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4+40))
		{
			difficultySelect() ;
			getInfoSelector(canvas.width/2-200, canvas.height/4+40)
		}
		else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*2+40))
		{
			difficultySelect() ;
			getInfoSelector(canvas.width/2-200, canvas.height/4*2+40) ;
		}
		else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*3+40))
		{
			difficultySelect() ;
			getInfoSelector(canvas.width/2-200, canvas.height/4*3+40, true) ;
		}	
	}

	else if(currentLoad == "easyMode") 
	{
		if(Coords.isDragging) ;
			relocateFig(x,y) ;// console.log(Coords.isDragging)
		
	}	

}

function drawGeo(geo,x,y) {

	// console.log(x,y) ;
	if(x == undefined)
	{
		x = 0 ; 
		y = 0 ;
	}
	if(geo.type == "rectangle") 
		insertRect(geo.posX,geo.posY, geo.pixX, geo.pixY, geo.color, geo.skewX, geo.skewY, geo.rot) ;

	else if(geo.type == "triangle") 
		insertTriangle(geo.vA, geo.vB, geo.vC, geo.color, geo.posX+x, geo.posY-y)  ;

}

function clickEasyMode(event) {

	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;

	//Click dificult select
	if(isInsideEllipse(90,30, x, y,100, 50 ))
	{
		difficultySelect() ;
		objects = [] ;
		return ;
	}

	else if(isInsideSquare(300,200,50,50,x,y) && selected != undefined)
	{
		objects[selected].setRot(45) ;
		
		// console.log(objects[selected].vB,objects[selected].vC) ;
	}
		else if(isInsideSquare(100,200,50,50,x,y) && selected != undefined)
	{
		objects[selected].setRot(-45) ;
		
		// console.log(objects[selected].vB,objects[selected].vC) ;
	}

	for(let i  = 0; i < objects.length;i++)
	{
		let object = objects[i] ;
	//Check if any piece has been clicked (triangles) 
	if(object.type == "triangle" && isInsideTriangle(object.getVertexPos(object.vA, object.posX,object.posY),
						object.getVertexPos(object.vB, object.posX,object.posY),
						object.getVertexPos(object.vC, object.posX,object.posY) ,x,y)) 
		{
			selected = i ;
			Coords.isDragging = true ;
			Coords.dragCoord= [[x,y]]
			return ;
		}

	}


	easyMode() ;
	// var xPix = Coords["easyCoords"][0][2] ;
	// var yPix = Coords["easyCoords"][0][3] ;
	// console.log(Coords["easyCoords"][0][0],Coords["easyCoords"][0][1],xPix, yPix) ;
	// if(isInsideSquare(Coords["easyCoords"][0][0],Coords["easyCoords"][0][1],xPix, yPix,x,y))
	// {
	// 	Coords.isDragging = true 
	// 	Coords.dragCoord= [[x,y]]
	// 	// console.log("a") ;
	// 	// console.log(Coords["easyVertices"][0][0], x)
	// }
}



function addFigures() {

	var sideA = 80 ;
	var sideB = 100 ;

	objects.push(new Triangle([0,0], [sideA,-sideA],[0,-sideA],520,440, "black", 0)) ;
 	objects.push(new Triangle([0,0], [sideA,sideA],[0,sideA],520,480, "black", 0)) ;
 	objects.push(new Triangle([0,0], [0, sideB],[-sideB,sideB],770,460, "black" , 0)) ;
  
 	objects.push(new Triangle([0,0], [ 2*sideB,0], [sideB,sideB ], 540, 460, "black", 0)) ;
 	objects.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB] ,640, 350,"black", 0) );

 	objects.push(new Rectangle(300,300,sideA,sideA,"black", 45, 0,0)) ;
 	objects.push(new Rectangle(680, 600, sideA, sideA, "black", 0,0,-.5))



}

function easyMode(x,y)
{
	//Reset canvas, add background color 
	currentLoad = "easyMode" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(1,0,0,1,0,0) ; 
	insertRect(0,0,canvas.width, canvas.height,"#87ECEC",0,0) ;

	// drawGrid(15,15) ;
	addTitle(480,10) ;
	insertEllipse(100, 50 , 90,30, 0, 0, 2*Math.PI, true, "#64EC42", "Difficulty Select", false,0,7,"20", "black" ) ;

	insertRect(300,200, 50,50, "blue") ;
	insertRect(100,200, 50,50, "green" );
	setFigures(x,y) ;


}

function setFigures(x,y) {

	for(let i =0; i < objects.length; i++)
	{
		if( x == undefined )
		{
			x = 0 ;
			y = 0 ;
		}
		if(i != selected)
			drawGeo(objects[i]) ;
	}

	//if a figure has been selected, relocate it's position based on mouse coords
	if(selected != undefined) 
		drawGeo(objects[selected],x,y) ;
}

function relocateFig(x,y) 
{
	if(Coords.isDragging)
	{

		x = x - Coords.dragCoord[0][0] ; 
		y = Coords.dragCoord[0][1] - y  ;
		// console.log(x,y) ;
		easyMode(x,y) ;
	}
}