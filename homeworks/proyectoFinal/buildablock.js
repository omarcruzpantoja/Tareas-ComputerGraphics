var canvas ;
var ctx ;
var currentLoad ;

var Coords = {
	"play" : [],

	"easyCoords" : [[200,200,200,200]]  ,
	isDragging: false
}

function initListeners()
{
	canvas.addEventListener("mousedown", mouseDown, false) ;
	canvas.addEventListener("mousemove", mouseMove, false) ;
	canvas.addEventListener("mouseup", mouseUp, false) ;
} 

function init() {
	canvas = document.getElementById("canvas") 
	ctx = canvas.getContext("2d") ;

	initListeners() ;

	// mainMenu() ;
	// currentLoad = "mainMenu";
	// difficultySelect() ;
	// currentLoad = "difficultySelect" ;

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

		clickEasyMode(event) ;
	}
}

function mouseUp(event)
{

	// console.log(event);
	if(currentLoad == "mainMenu")
	{
		

	}
	else if(currentLoad == "Instructions")
	{

	}
	else if(currentLoad == "difficultySelect") 
	{
		

	}
	else if(currentLoad == "easyMode") 
	{
		if(Coords.isDragging)
		{
			Coords.isDragging = false; 
			canvasPos = canvas.getBoundingClientRect() ;
			x = event.clientX - canvasPos.left ;
			y = event.clientY - canvasPos.top ;
			x = x - Coords.dragCoord[0][0] ; 
			y = Coords.dragCoord[0][1] - y  ;
			console.log(x,y);
			// Coords["easyCoords"][0][0] = x - Coords["easyCoords"][0][0]  ;
			// Coords["easyCoords"][0][1] =10 ;
			Coords["easyCoords"][0][0] = Coords["easyCoords"][0][0]+x
			Coords["easyCoords"][0][1] = Coords["easyCoords"][0][1]-y
			easyMode() ;
		}
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
function mouseMove(event) {

	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;
	if(currentLoad == "mainMenu")
	{

	}
	else if(currentLoad == "Instructions")
	{

	}
	else if(currentLoad == "difficultySelect") 
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
		// console.log(Coords.isDragging)
		if(Coords.isDragging)
		{
			canvasPos = canvas.getBoundingClientRect() ;
			x = event.clientX - canvasPos.left ;
			y = event.clientY - canvasPos.top ;
			x = x - Coords.dragCoord[0][0] ; 
			y = Coords.dragCoord[0][1] - y  ;
			// console.log(x,y) ;
			easyMode(x,y) ;
		}
		
	}	

}
function clickEasyMode(event) {

	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;

	//Click dificult select
	if(isInsideEllipse(90,30, x, y,100, 50 ))
	{
		difficultySelect() ;
	}



	var xPix = Coords["easyCoords"][0][2] ;
	var yPix = Coords["easyCoords"][0][3] ;
	console.log(Coords["easyCoords"][0][0],Coords["easyCoords"][0][1],xPix, yPix) ;
	if(isInsideSquare(Coords["easyCoords"][0][0],Coords["easyCoords"][0][1],xPix, yPix,x,y))
	{
		Coords.isDragging = true 
		Coords.dragCoord= [[x,y]]
		// console.log("a") ;
		// console.log(Coords["easyVertices"][0][0], x)
	}
}


function easyMode(x,y)
{

	currentLoad = "easyMode" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
	insertRect(0,0,canvas.width, canvas.height,"#87ECEC",0,0) ;
	// drawGrid(15,15) ;
	addTitle(500,20) ;
	insertEllipse(100, 50 , 90,30, 0, 0, 2*Math.PI, true, "#64EC42", "Difficulty Select", false,0,7,"20", "black" ) ;

	// var pixX =  Coords["easyVertices"][0][0][0] - Coords["easyVertices"][0][2][0] ;
	// var pixY =  Coords["easyVertices"][0][0][1] - Coords["easyVertices"][0][2][1] ;
	
	console.log(Coords["easyCoords"][0][2], Coords["easyCoords"][0][3]) ;
	if(x == null)
	{
		x = 0 ;
		y = 0 ;
	}
	// console.log(x,y) ;
	insertRect(Coords["easyCoords"][0][0]+x,Coords["easyCoords"][0][1]-y, Coords["easyCoords"][0][2],Coords["easyCoords"][0][3], "black", 0, 0 );

}

function mainMenu() {

	//Paint background 
	currentLoad = "mainMenu" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
	insertRect(0,0,canvas.width, canvas.height,"#87ECEC",0,0) ;
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
	insertEllipse(canvas.width/2, canvas.height/4*3+30 , 150,75, 0, 0, 2*Math.PI, true, "#64EC42", "Instructions", false,0,10, "40" ) ;
	
}

function difficultySelect() {

	currentLoad = "difficultySelect" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
	insertRect(0,0,canvas.width, canvas.height,"#87ECEC",0,0) ;
	drawGrid(15,15) ;

	addTitle(400,50) ;

	//Easy selection 
	insertEllipse(canvas.width/2-200, canvas.height/4 +40, 140,60, 0, 0, 2*Math.PI, true, "#64EC42", "Easy", false,0,20,"40" ) ;
	// if(isInsideEllipse(140,60, ))
	
	//Medium selection
	insertEllipse(canvas.width/2-200, canvas.height/4*2+40, 140,60, 0, 0, 2*Math.PI, true, "#64EC42", "Medium", false,0,20,"40" ) ;
	
	//Hard selection 
	insertEllipse(canvas.width/2-200, canvas.height/4*3+40 , 140,60, 0, 0, 2*Math.PI, true, "#64EC42", "Hard", false,0,20,"40" ) ;
			
	//GO back to main manu
	insertEllipse(100, 50 , 75,30, 0, 0, 2*Math.PI, true, "#64EC42", "Main Menu", false,0,7,"20", "black" ) ;		
}


function insertEllipse(x, y, radiusx,radiusy, rotation, start, end, counter, color, text, stroke,textX, textY,font, fontColor )
{
	ctx.fillStyle = color;
	ctx.beginPath() ;
	ctx.ellipse(x, y , radiusx,radiusy, rotation, start, end, counter) ;
	if(stroke) 
		ctx.stroke() ;

	ctx.fill() ;
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

function insertTriangle(vA, vB, vC, color) {

	ctx.fillStyle = color ;
	ctx.beginPath() ;
	ctx.moveTo(vA[0], vA[1]) ;
	ctx.lineTo(vB[0], vB[1]) ;
	ctx.lineTo(vC[0], vC[1]) ;
	ctx.closePath() ;
	ctx.stroke() ;
	ctx.fill() ;

}

function insertRect(x,y,pixelsX,pixelsY, color, rotateX, rotateY)
{

	ctx.setTransform(1,rotateX, rotateY, 1,x,y)
	ctx.fillStyle  = color ;
	ctx.fillRect(0,0,pixelsX,pixelsY) ;

	ctx.closePath() ;
	ctx.setTransform(1, 0, 0, 1, 0, 0);

}

function insertPentagon(vA,vB,vC,vD,vF, x,y, color)
{
	ctx.setTransform(1,0,0,1,x,y) ;
	ctx.fillStyle = color ;
	ctx.beginPath() ;
	ctx.moveTo(vA[0], vA[1]) ;
	ctx.lineTo(vB[0], vB[1]) ;
	ctx.lineTo(vC[0], vC[1]) ;
	ctx.lineTo(vD[0], vD[1]) ;
	ctx.lineTo(vF[0], vF[1]) ;
	ctx.closePath() ;
	ctx.fill() ;

	ctx.setTransform(1,0,0,1,0,0) ;
} 
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

// 145A02

function drawGrid(row, col,xR,yR)
{
	if(xR == null && yR == null)
	{
		xR = canvas.width ;
		yR = canvas.height
	}
	ctx.strokeStyle = "#BDBDBD";
	var x  = xR/col ;
	var pos =0  ;
	ctx.beginPath() ;
	for(i = 1 ; pos < xR; i++)
	{	
		pos = x*i
		ctx.moveTo(pos,0) ;
		ctx.lineTo(pos,yR) ;
		// ctx.stroke() ;

	}

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

function isInsideEllipse(a,b, x,y, h,k)
{
	if(a == 0 || b == 0)
		console.log("ERROR WITH GIVEN ELLIPSE VALUES") 

	a = a*a ;
	b = b*b ;

	x = x-h ;
	y = y-k ;

	x = x*x ;
	y = y*y ;

	if((x/a) + (y/b) <= 1)
		return true ;
	else
		return false; 
}
function isInsideSquare(x,y,pixx,pixy,mx ,my)
{

	if(mx <= pixx+x && mx >= x && my <= pixy+y && my >= y)
		return true ;
	else 
		return false ;
}

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