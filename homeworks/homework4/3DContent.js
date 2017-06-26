// Omar Cruz Pantoja
// 801-14-1672
// CCOM 4995- COMPUTER GRAPHICS 
// Prof. Remi Megret

var camera, scene, renderer;
var geometry, material, mesh;
var torus;
var mainCube,midArm, lowerArm ;

//Max "pixel" Displacement across the plane of the cube
var fixedDisplacement = 10 ;
//Parameters for the torus 
var params = {
	px1 : -50,
	py1 : 37,
	pz1 : 50,

	sx1 : 1,
	sy1 : 1,
	sz1 : 1,

	rx1 : 0,
	ry1 : 0,
	rz1 : 0
} ;

//Parameters for location of robot
var robotParams = {
	px1 : -50,
	py1 : 21,
	pz1 : -50,

	sx1 : 1,
	sy1 : 1,
	sz1 : 1,

	rx1 : 0,
	ry1 : 0,
	rz1 : 0
}

//Parameters for camera position
var cameraPos = {
	x:90 ,
	y:150,
	z:-170,

	ax : 0,
	ay : 0,
	az : 0 ,

	'3rdPersonRobot' : false	
}

//Parameters for arm rotations
var armsRotations = {
	midArm: 35 ,
	lowerArm: 60
}


function initGUI() {
	gui = new dat.GUI() ;
	var f1 = gui.addFolder("Control Torus") ;
	f1.add(params, "px1").min(-100.0).max(100.0).step(10).onChange(update); ;
	f1.add(params, "py1").min(-100.0).max(100.0).step(10).onChange(update); ;
	f1.add(params, "pz1").min(-100.0).max(100.0).step(10).onChange(update); ;

	f1.add(params, "sx1").min(0.1).max(3.0).step(0.1).onChange(update); ;
	f1.add(params, "sy1").min(0.1).max(3.0).step(0.1).onChange(update); ;
	f1.add(params, "sz1").min(0.1).max(3.0).step(0.1).onChange(update); ;

	f1.add(params, "rx1").min(-180.0).max(180.0).step(5).onChange(update); ;
	f1.add(params, "ry1").min(-180.0).max(180.0).step(5).onChange(update); ;
	f1.add(params, "rz1").min(-180.0).max(180.0).step(5).onChange(update); ;

	var f2 = gui.addFolder("Control Articulated Robot") ;
		var f3 = f2.addFolder("Robot Parameters") ;
		f3.add(robotParams, "px1").min(-100.0).max(100.0).step(10).onChange(update); ;
		f3.add(robotParams, "py1").min(-100.0).max(100.0).step(10).onChange(update); ;
		f3.add(robotParams, "pz1").min(-100.0).max(100.0).step(10).onChange(update); ;

		f3.add(robotParams, "rx1").min(-180.0).max(180.0).step(5).onChange(update); ;
		f3.add(robotParams, "ry1").min(-180.0).max(180.0).step(5).onChange(update); ;
		f3.add(robotParams, "rz1").min(-180.0).max(180.0).step(5).onChange(update); ;		

			var f4 = f2.addFolder("Arms Rotation") ;
			f4.add(armsRotations, "midArm").min(0).max(90).step(5).onChange(update); 
			f4.add(armsRotations, "lowerArm").min(15.0).max(130.0).step(5).onChange(update); ;
		f1.open() ; 
		f2.open() ;
		f3.open() ;
		f4.open() ;

	// gui.add(cameraPos, "3rdPersonRobot").onChange(onKeyDown) ;
}


function initKeys(canvas) {
	// Make sure the canvas can receive the key events
	canvas.setAttribute('tabindex','0');
	canvas.focus();
	// Workaround: give the focus back to the canvas when clicked
	// keyboard events are not received when canvas is not focused
	canvas.addEventListener('mousedown',function(){canvas.focus()});
	canvas.addEventListener('keydown', onKeyDown, true) ;
}

function onKeyDown(event){

	event.preventDefault();
	//Set material to lambert
	if(event.key == "L")
		torus.material = new THREE.MeshLambertMaterial({color:0x0000ff, side:THREE.DoubleSide})
	//Set material to phong and apply shinniness and specular
	if(event.key == "P")
		torus.material = new THREE.MeshPhongMaterial({color:0x0000ff, side:THREE.DoubleSide, shininess: 20, specular:0xffffff})
	//Set material tp phong with flat shading
	if(event.key == "F")
		torus.material = new THREE.MeshPhongMaterial({color:0x0000ff, side:THREE.DoubleSide, shading:THREE.FlatShading})
	//Set material to basic and show wireframe
	if(event.key == "W")
		torus.material = new THREE.MeshBasicMaterial({color:0xff0000, wireframe:true}) 
 
	//Rotate robot 5 degrees to the left 
	if(event.key == "a") 
		robotParams.ry1 += 5 ;
	
	//Rotate robot degrees to the right
	if(event.key == "d") 
		robotParams.ry1 -= 5 ;
	
	//Move robot forward
	if(event.key == "w")
	{
		moveX = fixedDisplacement * Math.cos(degreeToRad(robotParams.ry1)) ;
		moveZ = fixedDisplacement * Math.sin((-1)*degreeToRad(robotParams.ry1)) ;
		if((robotParams.px1 + moveX <= 90 && robotParams.px1+moveX >= -90) && (robotParams.pz1+moveZ <= 90 && robotParams.pz1+moveZ >= -90))
		{

			robotParams.px1 += moveX ;
			robotParams.pz1 += moveZ;
		}
	}

	//Move robot backwards
	if(event.key == "s")
	{
		if((robotParams.px1 - moveX <= 90 && robotParams.px1-moveX >= -90) && (robotParams.pz1-moveZ <= 90 && robotParams.pz1-moveZ >= -90))
		{
			moveX = fixedDisplacement * Math.cos(degreeToRad(robotParams.ry1)) ;
			moveZ = fixedDisplacement * Math.sin((-1)*degreeToRad(robotParams.ry1)) ;
			robotParams.px1 -= moveX ;
			robotParams.pz1 -= moveZ;
		}
		
	}

	//Change the camera from omniscient to 3rd person behind the robot.
	if(event.key == "c")
	{
		if(cameraPos['3rdPersonRobot'])
		{
			cameraPos['3rdPersonRobot'] = false ;
			//Set camera omniscient 
			mainCube.remove(camera);
			camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
			camera.lookAt(new THREE.Vector3(cameraPos.ax,cameraPos.ay,cameraPos.az));

		}
		else
		{
			//Set the camera 3rd person in robot
			cameraPos['3rdPersonRobot'] = true ;
			mainCube.add(camera) ;
			//Set the camera bhind the robot
			camera.position.set(-75,75,0) ;
			//Set the looking position a bit higher than the center position of cube
			camera.lookAt(new THREE.Vector3(0,40,0))
		}
	}

	update() ;
	render() ;
} ;


function initScene(texture){
	//### 1. Create rendered and bind to canvas

	canvas = document.getElementById("canvas") ;
	renderer = new THREE.WebGLRenderer({
		canvas:canvas,
		preserveDrawingBuffer:true
	}) ;
	renderer.setClearColor(0xf0ffff)


	//Create Scene
	scene = new THREE.Scene() ;


	//Create Plane
	planeGeo = new THREE.PlaneGeometry(200,200) ;
	planeGeo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2)) ;
	//Add texture to plane
    var textureLoader = new THREE.TextureLoader()
    textureLoader.crossOrigin = "" ;
    texture = textureLoader.load("moretextures/uv-grid.png") ;
	planeMat = new THREE.MeshPhongMaterial({
		map:texture,
		side: THREE.DoubleSide,
		specular: "#ffffff",
		shininess:5
	}) ;
	planeMat.transparent = true ;
	plane = new THREE.Mesh(planeGeo, planeMat) ;
	plane.material.linewidth = 1 ;
	scene.add(plane) ;


	//Q1. Create torus Geo
	var torusGeo = new THREE.TorusGeometry(30,7,20,50) ;
	var torusMat = new THREE.MeshLambertMaterial({color:0x0000ff, side:THREE.DoubleSide}) 
	torus = new THREE.Mesh(torusGeo, torusMat) ;
	scene.add(torus) ; 

	//Add light 
	var ambientLight = new THREE.AmbientLight(0x303030);
	scene.add(ambientLight)
    var pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(150, 250, 125)
    scene.add(pointLight)


    //Add teapot
    var loader = new THREE.ObjectLoader();
    loader.load("models/json/teapot-claraio.json",
     	function(object)
     	{
     		scene.add(object) ; 
     		object.scale.set(30,30,30) ;
     		object.position.set(50,0,50)
     	})

    //Add male
   	var loader = new THREE.OBJLoader();
	loader.load( 'models/obj/male02/male02.obj',
		function ( object ) {
		scene.add( object );
		object.scale.set(.5,.5,.5) ;
		object.position.set(0,0,80) ;
		}
	)


	//Create articulated robot
	var mainCubeGeo = new THREE.BoxGeometry(40,40,40) ;
	var mainCubeMat = new THREE.MeshPhongMaterial({color:0xff0000}) ;
	mainCube = new THREE.Mesh(mainCubeGeo, mainCubeMat) ;
	scene.add(mainCube) ;

	mainCube.position.set(robotParams.px1,robotParams.py1,robotParams.pz1) ;

	//Set lower arm as a child of main cube and set its position relative to cube
	var midArmGeo = new THREE.BoxGeometry(16,40,20) ;
	midArmGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0,16,0));
	var midArmMat = new THREE.MeshPhongMaterial({color:0xffff00}) ;
	midArm = new THREE.Mesh(midArmGeo, midArmMat) ;
	mainCube.add(midArm) ;
	midArm.position.set(12,12,0);

	//Set upper arm as a child of main cube and set its position relative to cube
	var lowerArmGeo = new THREE.BoxGeometry(16,50,20) ;
	lowerArmGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0,20,0)) ;
	var lowerArmMat = new THREE.MeshPhongMaterial({color:0xff00ff}) ;
	lowerArm = new THREE.Mesh(lowerArmGeo, lowerArmMat) ;
	midArm.add(lowerArm) ;
	lowerArm.position.set(0,35,0) ;

	//Create Custom geometry (pyramid)
	var customGeo = new THREE.Geometry() ;

	//Define vertices for the faces
	customGeo.vertices.push(
	new THREE.Vector3(  0, 0, 0 ),  // V1
	new THREE.Vector3( 50,  0, 0 ),  // V2
	new THREE.Vector3(  25,  0, 50 ),  // V3
	new THREE.Vector3( 25, 50, 25 )  // V0
	);

	//Define faces 
	customGeo.faces.push(new THREE.Face3(0,1,2),
	new THREE.Face3(0,2,3),
	new THREE.Face3(0,3,1),
	new THREE.Face3(1,2,3)
	)	

	//Add texture to pyramid faces
	var ttextureLoader = new THREE.TextureLoader() ;
	ttextureLoader.crossOrigin = "";
	ttexture = ttextureLoader.load('moretextures/piramide.jpg') ;

	//Add texture 
	cMat = new THREE.MeshLambertMaterial(
	{ map: ttexture, side: THREE.DoubleSide,  shading: THREE.FlatShading} ) ;

	//Apply texture to each face
	customGeo.faceVertexUvs[0].push(
		[new THREE.Vector2(0,0), new THREE.Vector2(.5,1), new THREE.Vector2(0,1)],
		[new THREE.Vector2(0,0), new THREE.Vector2(.5,1), new THREE.Vector2(0,1)],
		[new THREE.Vector2(0,0), new THREE.Vector2(.5,1), new THREE.Vector2(0,1)],
		[new THREE.Vector2(0,0), new THREE.Vector2(.5,1), new THREE.Vector2(0,1)]		
		)

	//Apply lighting to the pyramid (naturally the pyramid will be black) 
	customGeo.computeFaceNormals() ;
	customGeo.uvsNeedUpdate = true ; 


	cMesh = new THREE.Mesh(customGeo, cMat) ;
	scene.add(cMesh) ;
	cMesh.position.set(40,0,-40) ;

    //### 3. Add camera
    camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 1, 2000);
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    //Add controls to camera
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.10;
    controls.enableZoom = true;
    controls.enableKeys = false; // Disable keys so we can use them ourselves
    controls.rotateSpeed = 0.1;
}

function update() {

	//Apply changes to torus (changed with datgui)
	torus.rotation.set(degreeToRad(params.rx1), degreeToRad(params.ry1), degreeToRad(params.rz1)) ;
	torus.position.set(params.px1, params.py1, params.pz1) ;
	torus.scale.set(params.sx1, params.sy1, params.sz1) ;
	

	//Apply changes to cube ( can be both datgui params and keyboard) 
	mainCube.position.set(robotParams.px1,robotParams.py1,robotParams.pz1) ;
	mainCube.rotation.set(degreeToRad(robotParams.rx1), degreeToRad(robotParams.ry1), degreeToRad(robotParams.rz1)) ;

	//Apply changes to arms (changed using datgui) 
	midArm.rotation.set(0,0,degreeToRad(armsRotations.midArm-90)) ;
	lowerArm.rotation.set(0,0,degreeToRad(armsRotations.lowerArm-90)) ;	
	
	render() ;
}



function animate() {
	requestAnimationFrame(animate);

	//cube.rotation.x += 0.005;
	//cube.rotation.y += 0.01;

	update();
	render()
}

function render() {
	renderer.render(scene, camera);
}

function start() {
	initGUI()
	
	initScene()
	initKeys(canvas)
	
	update()
	render()
	
	// Uncomment animate() if there are automatic animations in your scene
	// animate() 
}


//Function to change from degree to radians
function degreeToRad(degree) {
	return degree *Math.PI / 180 ;
} ;