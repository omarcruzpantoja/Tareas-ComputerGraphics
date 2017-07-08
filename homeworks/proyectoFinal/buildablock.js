var canvas ;
var ctx ;
var currentLoad ;

var Coords = {
	"play" : [],

	"Coords" : { "s": [], "t":[], "d" : [], "ts" : [] }  ,
	isDragging: false
}

var selected ;

var objects = []

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

	resetFigures() ;
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
			// console.log(x,y);
			// Coords["easyCoords"][0][0] = x - Coords["easyCoords"][0][0]  ;
			// Coords["easyCoords"][0][1] =10 ;
			// Coords["easyCoords"][0][0] = Coords["easyCoords"][0][0]+x
			// Coords["easyCoords"][0][1] = Coords["easyCoords"][0][1]-y
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




function mainMenu() {

	//Paint background 
	currentLoad = "mainMenu" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(1,0, 0,1,0,0) ;
	insertRect(0,0,canvas.width, canvas.height,"#87ECEC",0,0,0) ;

	// function insertRect(x,y,pixelsX,pixelsY, color, skewX, skewY,  rotate)
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
	console.log("qe carajo pasa") ;
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
function isInsideSquare(x,y,pixx,pixy,mousex ,mousey)
{

	if(mousex <= pixx+x && mousex >= x && mousey <= pixy+y && mousey >= y)
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



function Triangle(vA, vB, vC, posX,posY, color, rot) 
{
	rads = rot/180*Math.PI ;
	x = vA[0] ;
	y = vA[1] ;
	vA[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
	vA[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;
	
	x = vB[0] ;
	y = vB[1] ;
	vB[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
	vB[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;
	
	x = vC[0] ;
	y = vC[1] ; 
	vC[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
	vC[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;

	this.vA = vA ;
	this.vB = vB ;
	this.vC = vC ;
	this.posX = posX ;
	this.posY = posY ;
	this.rot = rads ;
	this.type = "triangle" ;
	this.color = color ;

	this.ogA = vA ;
	this.ogB = vB ;
	this.ogC = vC ;
	// this.vA = function() { return }	
	this.getVertexPos = function(v,x,y) { return [v[0]+x, v[1]+y]} ;
	this.setRot = function(add) 
	{ 
		// console.log(this.rot*180/Math.PI%360) ;
		this.rot = (this.rot+add*Math.PI/180)%360 ;
		console.log(this.rot*180/Math.PI%360) ;
		rads = this.rot ;
		x = this.ogA[0] ;
		y = this.ogA[1] ;
		this.vA[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
		this.vA[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;
		
		x = this.ogB[0] ;
		y = this.ogB[1] ;
		this.vB[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
		this.vB[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;
		
		x = this.ogC[0] ;
		y = this.ogC[1] ; 
		this.vC[0] = x*Math.cos(rads)-y*Math.sin(rads) ;
		this.vC[1] = x * Math.sin(rads)+ y*Math.cos(rads) ;


	}
}

function Rectangle(posX, posY, pixX, pixY, color, rot, skewX, skewY )
{
	this.posX = posX ;
	this.posY = posY ;
	this.pixX = pixX ;
	this.pixY = pixY ;
	this.color = color ;
	this.rot = rot ;
	this.type = "rectangle" ;
	this.skewX = skewX ;
	this.skewY = skewY ;
}

function drawGeo(geo) {

	if(geo.type == "rectangle") 
		insertRect(geo.posX,geo.posY, geo.pixX, geo.pixY, geo.color, geo.skewX, geo.skewY, geo.rot) ;

	else if(geo.type == "triangle") 
		insertTriangle(geo.vA, geo.vB, geo.vC, geo.color, geo.posX, geo.posY)  ;




}


function insertTriangle(vA, vB, vC, color, x,y) {


	ctx.fillStyle = color ;
	ctx.setTransform(1,0, 0,1,x,y)
	ctx.beginPath() ;
	ctx.moveTo(vA[0], vA[1]) ;
	ctx.lineTo(vB[0], vB[1]) ;
	ctx.lineTo(vC[0], vC[1]) ;

	ctx.closePath() ;
	ctx.stroke() ;
	ctx.fill() ;

}

function insertRect(x,y,pixelsX,pixelsY, color, skewX, skewY,  rotate)
{

	if(color == undefined )
	{
		color = "black";
		skewX = 0 ;
		skewY = 0 ;
		rotate = 0;
	}
	ctx.save() ;
	ctx.fillStyle  = color ;
	ctx.setTransform(1,skewX, skewY, 1,x,y)
	ctx.rotate(rotate/180*Math.PI)
	ctx.fillRect(0,0,pixelsX,pixelsY) ;
	// ctx.closePath() ;
	// ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.restore() ;


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

function clickEasyMode(event) {

	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;

	//Click dificult select
	if(isInsideEllipse(90,30, x, y,100, 50 ))
	{
		difficultySelect() ;
	}

	else if(isInsideSquare(300,200,50,50,x,y) && selected != undefined)
	{
		objects[selected].setRot(90) ;
		console.log(objects[selected].vB,objects[selected].vC) ;
	}

	for(let i  = 0; i < objects.length;i++)
	{
		let object = objects[i] ;
	//Check if any piece has been clicked 
	if(isInsideTriangle(object.getVertexPos(object.vA, object.posX,object.posY),
						object.getVertexPos(object.vB, object.posX,object.posY),
						object.getVertexPos(object.vC, object.posX,object.posY) ,x,y))
		{
		selected = i ;
		break ;
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

function isInsideTriangle(vA, vB, vC, x, y)
{

	p1 = isInsideTriangleAux(vA,vB,x,y) ;
	p2 = isInsideTriangleAux(vB,vC,x,y) ;
	p3 = isInsideTriangleAux(vC,vA,x,y) ;

	return (p1 == p2 ) && (p2 == p3)
}
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

function resetFigures() {

	var sideA = 80 ;
	var sideB = 100 ;

 	// objects.push(new Triangle([520,350], [520+sideA, 350], [520, 350 + sideA], "black" , 0)) ;
 	objects.push(new Triangle([0,0], [sideA,sideA],[0,sideA],520,480, "black", 0)) ;
 	// objects.push(new Triangle([770,460], [770, 460 + sideB],[770-sideB,460+sideB], "black" , 0)) ;
 	objects.push(new Triangle([0,0],[0,sideB], [-sideB,sideB], 770,460, "black",0 )) ;
 	// objects.push(new Triangle([540,460], [540 + 2*sideB,460], [540+sideB,460+sideB ], "black", 0)) ;
 	// objects.push(new Triangle([640,350], [640+sideB, 350+sideB], [640-sideB,350+sideB] ),"black", 0) ;

 	// objects.push(new Rectangle(590,580,sideA,sideA,"black", 45, 0,0)) ;
 	// objects.push(new Rectangle(680, 600, sideA, sideA, "black", 0,0,-.5))



}



function easyMode(x,y)
{

	currentLoad = "easyMode" ;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.setTransform(1,0,0,1,0,0) ; 
	insertRect(0,0,canvas.width, canvas.height,"#87ECEC",0,0) ;
	// drawGrid(15,15) ;
	addTitle(480,10) ;
	insertEllipse(100, 50 , 90,30, 0, 0, 2*Math.PI, true, "#64EC42", "Difficulty Select", false,0,7,"20", "black" ) ;

	insertRect(300,200, 50,50);
	setFigures() ;
	// var pixX =  Coords["easyVertices"][0][0][0] - Coords["easyVertices"][0][2][0] ;
	// var pixY =  Coords["easyVertices"][0][0][1] - Coords["easyVertices"][0][2][1] ;
	
	// console.log(Coords["easyCoords"][0][2], Coords["easyCoords"][0][3]) ;
	if(x == null)
	{
		x = 0 ;
		y = 0 ;
	}
	// console.log(x,y) ;
	// insertRect(Coords["easyCoords"][0][0]+x,Coords["easyCoords"][0][1]-y, Coords["easyCoords"][0][2],Coords["easyCoords"][0][3], "black", 0, 0 );

}

function setFigures() {

	for(let i =0; i < objects.length; i++)
	{
		drawGeo(objects[i]) ;
	}
}