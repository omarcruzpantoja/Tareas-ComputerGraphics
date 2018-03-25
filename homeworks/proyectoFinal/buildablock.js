//Developed by: Omar Cruz Pantoja
//First beta completed on: 25/Julio/2017
//Computer Graphics-4995

//Global variables that MUST be protected 

//Canvas variables
var canvas ;
var ctx ;

//Screen loading variables 
var currentLoad ;
var level ;
var solpct = 43689 ;

//Select figures/rotate and locate vertices
var Coords = {
	isDragging: false
}
var selected ;
var objects = []

//Images loaded into the game 
var img = []


function initListeners()
{
	//Mouse click down/select figure
	canvas.addEventListener("mousedown", mouseDown, false) ;
	//Event for when dragging a figure 
	canvas.addEventListener("mousemove", mouseMove, false) ;
	//Dragging completed, relocate figure 
	canvas.addEventListener("mouseup", mouseUp, false) ;
} 


function init() {
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    	alert("The game currently does not support mobile devices, sorry")
	}

	//Load canvas context
	canvas = document.getElementById("canvas") 
	ctx = canvas.getContext("2d") ;

	//Add event listeners 
	initListeners() ;

	//Load image to be displayed 
	var source = ["imgs/Levels/Level1.png", "imgs/extra/wood.jpg", "imgs/extra/rotateCounter.png", "imgs/extra/rotateClock.png", "imgs/extra/back.png"] ;
	
    for(i = 0; i <source.length;i++)
    {
    img[i] = new Image() ;
    img[i].onload = function() {
    	//Make sure images were loaded before getting to the first page
    	mainMenu() ;
    	currentLoad = "mainMenu";
        } ;
    }
    for(i =0 ; i < source.length ; i++) 
    {
        img[i].src = source[i];
    } 
	

	//Start in main menu 
	
	


}

function mouseDown(event)
{

	//Mouse click on the mainMenu 
	if(currentLoad == "mainMenu")
		//Callback to check if the (x,y) pos of mouse clicked a button 
		clickMenu(event) ;

	//Mouse click on howtoplay screen
	else if(currentLoad == "HowToPlay")
	//Callback to check if the (x,y) pos of mouse clicked a button 
		clickHowToPlay(event) ;

	//Mouse click on level select screen 	
	else if(currentLoad == "difficultySelect") 
	//Callback to check if the (x,y) pos of mouse clicked a button 
		clickDifficulty(event) ;

	//Mouse click on game screen 
	else if(currentLoad == "Level") 
	//Callback to check if the (x,y) pos of mouse clicked a button 
		clickLevel(event) ;
	
}

function clickMenu(event){
	//Get mouse position 
	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;

	//Check if click is inside difficulty select ellipse 
	if(isInsideEllipse(150,75, x, y,canvas.width/2, canvas.height/2 +30 ))
		difficultySelect() ;

	//Check if click was inside howtoplay/tutorial ellipse 
	else if(isInsideEllipse(150,75, x, y,canvas.width/2, canvas.height/4*3 +30 ))
	{
		howToPlay() ;
		tickTutorial() ;
	}
		

}

function clickHowToPlay(event) {
	//Get mouse position 
	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;


	//Check if click was in the goback button 
	if(isInsideRectangle(15,15, 100, 60,x, y ))
		mainMenu() ;
}

function clickDifficulty(event) {
	
	//Get mouse position 
	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;

	//Check if click was in the goback button 
	if(isInsideRectangle(15,15, 100, 60,x, y ))
		mainMenu() ;

	//Check if click was inside level 1 ellipse 
	if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4+40))
	{
		addFigures() ;
		level = 1 ; 	
		Level() ;
	}

	//Check if click was inside level 2 ellipse 
	else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*2+40))
	{
		addFigures() ;
		level = 2;
		Level() ;
	}

	//Check if click was inside level 3 ellipse 
	else if(isInsideEllipse(140,60,x,y,canvas.width/2-200, canvas.height/4*3+40))
	{
		addFigures() ;
		level = 3;
		Level() ;
	}	
}


function clickLevel(event) {

	//Get mouse coords relative to canvas
	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;

	//Click goback button 
	if(isInsideRectangle(15,15, 100, 60,x, y ))
	{
		//Return to level select screen 
		difficultySelect() ;
		//Reset colores figures 
		objects = [] ;
		return ;
	}

	//If rotate counterclockwise button is pressed, rotate the seleceted figure(if any, else do nothing)
	else if(isInsideRectangle(680,650,50,50,x,y) && selected != undefined)
		objects[selected].setRot(45) ;
		
	
	//If rotate counterclockwise button is pressed, rotate the seleceted figure(if any, else do nothing)
	else if(isInsideRectangle(550,650,50,50,x,y) && selected != undefined)
		objects[selected].setRot(-45) ;
		

	for(let i  = 0; i < objects.length;i++)
	{
		let object = objects[i] ;
		//Check if any piece has been clicked (triangles) 
		if(object.type == "triangle" && isInsideTriangle(object.getVertexPos(object.vA, object.posX,object.posY),
							object.getVertexPos(object.vB, object.posX,object.posY),
							object.getVertexPos(object.vC, object.posX,object.posY) ,x,y)) 
		{
			//Get the figure's ID
			selected = i ;
			Coords.isDragging = true ;
			//Get mouse coords 
			Coords.dragCoord= [[x,y]]
			return ;
		}
	
		//Check if any piece has eben clicked (rectangles)  
		else if(object.type == "rectangle" && isInsideRectangleV2(object,x ,y))
		{
			//Get the figure's ID
			selected = i ;
			Coords.isDragging = true ;
			//Get mouse coords 
			Coords.dragCoord = [[x,y]]
			return ;
		}
		
	}

	//Redraw the screen after all changes has been made 
	Level() ;

}
	
function mouseUp(event)
{

	if(currentLoad == "Level") 
	{
		if(Coords.isDragging)
		{
			//Dragging is completed 
			Coords.isDragging = false;

			//Get mouse coords  
			canvasPos = canvas.getBoundingClientRect() ;
			x = event.clientX - canvasPos.left ;
			y = event.clientY - canvasPos.top ;

			x = x - Coords.dragCoord[0][0] ; 
			y = Coords.dragCoord[0][1] - y  ;

			//Grid idea for X
			if(boundedBox(objects[selected].posX+x,objects[selected].posY-y))
			{
				if((objects[selected].posX+x)%10 > 5 ) 
					objects[selected].posX = Math.ceil(((objects[selected].posX+x)/10))*10
				else
					objects[selected].posX= Math.floor(((objects[selected].posX+x)/10))*10

				//Grid idea for Y
				if((objects[selected].posY-y)%10 > 5) 
					objects[selected].posY = Math.ceil(((objects[selected].posY-y)/10))*10 ;
				else
					objects[selected].posY = Math.floor(((objects[selected].posY-y)/10))*10 ;
			}
			
			//Used to create solutions 
			// console.log("\nSolution") ;
			// for(i =0 ; i < objects.length; i++)
				// console.log(objects[i].posX, objects[i].posY, objects[i].type, objects[i].rot*180/Math.PI, objects[i].info) ;

			//Get image's pixel information 
			var data = ctx.getImageData(0,0,canvas.width, canvas.height) ;
			var pix = data.data
			
			counter =0 ;
			//Must optimize the starting position
			for(i =200*canvas.width*4 ; i< 725*canvas.width*4 ; i++)
				if(pix[i] == 0 && pix[1+i] == 0&& pix[2+i]==3)
					counter++ ;
			//Check how much percent of black colors are still missing 
			pct = counter/(solpct) * 100 

			//If less than 2 percent of pixels include the color black, the level has been completed 
			if (pct< 2)
			{

				//Go to next level, if level 3 has been completed, start on level 1 again. 
				alert("Level completed");  
				if(level ==3)
					level =1 ;
				else
					level = level +1 ;
				objects= [] ;
				addFigures() ;
			}
			//Callback to draw level information 
			Level() ;
		}

	}
}

function mouseMove(event) {

	//Get (x,y) coords of the mouse 
	canvasPos = canvas.getBoundingClientRect() ;
	x = event.clientX - canvasPos.left ;
	y = event.clientY - canvasPos.top ;
	// console.log(x,y)

	//Check if a figure is being dragged, if it is, draw it on it's new coord 
	if(currentLoad == "Level" && Coords.isDragging) 
	{
		relocateFig(x,y) ;
	}	

}

//Draw all the objects(colored figures) 
function drawGeo(geo,stroke,x,y) {

	//If no XY coords given, set them to 0 to avoid NaN
	//X Y will be defined when dragging a figure  
	if(x == undefined)
	{
		x = 0 ; 
		y = 0 ;
	}

	//Draw geometry according to its type 
	if(geo.type == "rectangle") 
		insertRectV2(geo.start, geo.vA, geo.vB, geo.vC,geo.vD, geo.color, geo.posX+x, geo.posY-y)
	else if(geo.type == "triangle") 
		insertTriangle(geo.vA, geo.vB, geo.vC, geo.color, geo.posX+x, geo.posY-y,stroke)  ;

}



//Add colored figures to the game(can be used to reset the figures) 
function addFigures() {

	var sideA = 80 ;
	var sideB = 100 ;

	//These two are of same size (triangles) 
	objects.push(new Triangle([0,0], [sideA,sideA],[0,sideA],600,350, "green", 0,1)) ;
	objects[0].setRot(90) ;
 	objects.push(new Triangle([0,0], [sideA,sideA],[0,sideA],520,480, "green", 0,1)) ;

 	//This is of one size (triangles) 
 	objects.push(new Triangle([0,0], [0, sideB],[-sideB,sideB],770,460, "red" , 0,2)) ;
  
  	//These two are of same size (triangles) 
 	objects.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB], 640, 560, "orange", 0,3)) ;
 	objects[3].setRot(180)
 	objects.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB] ,640, 350,"orange", 0,3) );

 	//These are of same size but different forms 
 	objects.push(new Rectangle(560,270,sideA,sideA,"#ffe302", 0, 0,0,1)) ;
 	//This one is a parallelogram 
 	objects.push(new Rectangle(750, 270, sideA, sideA, "#a902ad", 0,-1,0,2)) ; 

}



//Draw each colored piece 
function setFigures(x,y) {

	for(let i =0; i < objects.length; i++)
	{
		if( x == undefined )
		{	
			x = 0 ;
			y = 0 ;
		}
		if(i != selected)
			drawGeo(objects[i],false) ;
	}

	//if a figure has been selected, relocate it's position based on mouse coords
	if(selected != undefined) 
		drawGeo(objects[selected],false, x,y) ;
}

//Draw figures (will be dragging)  
function relocateFig(x,y) 
{
	if(Coords.isDragging)
	{

		x = x - Coords.dragCoord[0][0] ; 
		y = Coords.dragCoord[0][1] - y  ;
		//The parameters sent here are used to draw the figure being dragged
		Level(x,y) ;
	}
}



//Third level Silhuette 
function solution1()
{

	var sideA = 80 ;
	var sideB = 100 ;
	var sol = []

	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],190,510, "#000003", 0))
	sol[0].setRot(90)
	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],370,530, "#000003", 0))
	sol.push(new Triangle([0,0], [0, sideB],[-sideB,sideB],320,480, "#000003" , 0,2)) ;
	sol[2].setRot(270) ;
	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB], 380, 440, "#000003", 0,3)) ;
	sol[3].setRot(180) ;
 	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB] ,320, 380,"#000003", 0,3) );
	sol.push(new Rectangle(380,280,sideA,sideA,"#000003", 0, 0,0,1)) ;
	sol[5].setRot(45) ;
 	sol.push(new Rectangle(260, 520, sideA, sideA, "#000003", 0,-1,0,2)) ; 


 	for(i =0 ; i < sol.length; i++)
 		drawGeo(sol[i], true) 
 	
}

//Second level Silhuette 
function solution2()
{
	var sideA = 80 ;
	var sideB = 100 ;
	var sol = []

	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],270,640, "#000003", 0))
	sol[0].setRot(270)
	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],500,550, "#000003", 0))
	sol[1].setRot(180)
	sol.push(new Triangle([0,0], [0, sideB],[-sideB,sideB],310,600, "#000003" , 0,2)) ;
	sol[2].setRot(180) ;
	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB], 400, 310, "#000003", 0,3)) ;
	sol[3].setRot(45) ;
 	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB] ,310, 500,"#000003", 0,3) );
	sol[4].setRot(-135)
	sol.push(new Rectangle(350,250,sideA,sideA,"#000003", 0, 0,0,1)) ;
	sol[5].setRot(45) ;
 	sol.push(new Rectangle(262, 369, sideA, sideA, "#000003", 0,-1,0,2)) ; 
 	sol[6].setRot(45)

 	for(i =0 ; i < sol.length; i++)
 		drawGeo(sol[i], true) 
 	
}
//Third level Silhuette 
function solution3()
{
	var sideA = 80 ;
	var sideB = 100 ;
	var sol = []

	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],220,480, "#000003", 0))
	sol[0].setRot(90)
	sol.push(new Triangle([0,0], [sideA,sideA],[0,sideA],280,540, "#000003", 0))
	sol[1].setRot(0)
	sol.push(new Triangle([0,0], [0, sideB],[-sideB,sideB],300,340, "#000003" , 0,2)) ;
	sol[2].setRot(180) ;
	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB], 320, 370, "#000003", 0,3)) ;
	sol[3].setRot(315) ;
 	sol.push(new Triangle([0,0], [sideB, sideB], [-sideB,sideB] ,320, 440,"#000003", 0,3) );
	sol[4].setRot(45)
	sol.push(new Rectangle(380,310,sideA,sideA,"#000003", 0, 0,0,1)) ;
	sol[5].setRot(45) ;
 	sol.push(new Rectangle(480, 430, sideA, sideA, "#000003", 0,-1,0,2)) ; 
 	sol[6].setRot(0)

 	for(i =0 ; i < sol.length; i++)
 		drawGeo(sol[i], true) 
 	
}

//Make sure the user stays within the canvas limits and  no figure is lost 
function boundedBox(x,y)
{
	return x > 70 && x < 750 && y > 65 && y < 710 ;
}


