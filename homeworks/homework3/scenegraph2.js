/* Basic scenegraph datastructure for Assg2 Geometry */
/* Author: Rémi Mégret, 2017, UPR Rio Piedras */
/* Co Author: Omar Cruz Pantoja 2017
    801-14-1672
    CCOM-4995 COMPUTER GRAPHICS*/


var canvas;
var ctx;
var w,h;

var params
function initParams() {
    params = {
        'x0': canvas.width/2,
        'y0': 280,
        'a1': 20,
        'a2': 90,
        'a3': 0,
        'SGNodes' : false 
    }
}

/* ### GUI ### */
var gui;        
function initGUI() 
{
    gui = new dat.GUI({ autoPlace: true });

    gui.add(params,'x0').min(0).max(w).step(1)
                        .onChange(onParamsChange)//.listen()
    gui.add(params,'y0').min(0).max(h).step(1)
                        .onChange(onParamsChange)//.listen()
    gui.add(params,'a1').min(-80).max(120).step(1)
                           .onChange(onParamsChange)//.listen()
    gui.add(params,'a2').min(-80).max(150).step(1).onChange(onParamsChange)
    gui.add(params,'a3').min(0).max(+150).step(0.1)
                        .onChange(onParamsChange)//.listen()
    gui.add(params, 'SGNodes').onChange(onParamsChange) 
    
    //var parent = document.getElementById('controls');      
    //parent.appendChild(gui.domElement);
}
// GUI callback when parameters are changed manually in the GUI
function onParamsChange() {
    if(params.SGNodes) 
        drawAll() ;
    else
        drawAll1() ;
}
// Node creation
function SGNode(onDraw, parent) {
    this.translation = [0,0]
    this.rotation = 0 // Rotation in degrees
    this.scaling = [1,1]
    this.onDraw = onDraw
    this.children = []  // Array of SGNodes
    if (!!parent) {
        // If parent is defined
        parent.addChild(this)
    }
    return this;
}

// Add/remove children
SGNode.prototype.addChild = function(child) {
    this.children.push(child)
    return this;
}
SGNode.prototype.removeChild = function(child) {
    var index = this.children.indexOf(child);
    if (index > -1) {
        this.children.splice(index, 1);
    }
    return this;
}

// Draw a node and its descendants
SGNode.prototype.draw = function(ctx) {
    // Call the onDraw callback if it is defined.
    // We pass the graphic context as parameters to onDraw. 
    // The node reference is also a parameter,
    // in case we want to use some properties stored there
    
    if (!parent) {
        throw "SGNode.draw(ctx): Missing parameter 'ctx'"
    }
    
    // Save context to be able to restore it after drawing the node's subtree
    ctx.save();
    
    // Apply local transformation
    ctx.translate(this.translation[0],this.translation[1])
    ctx.rotate(this.rotation / 180*Math.PI)
    ctx.scale(this.scaling[0],this.scaling[1])
    
    // Draw local node
    if (this.onDraw) {
        this.onDraw(ctx,this) 
    }
    
    // Draw descendants of local node recursively
    for (var i = 0; i < this.children.length; i++) {
        // Save and restore graphical context 
        // in case children didn't restore properly
        ctx.save(); 
        this.children[i].draw(ctx);
        
        ctx.restore();
    }
    
    // Restore graphic context to initial state
    ctx.restore(); 
    return this;
}

// Modify node local transformation
SGNode.prototype.setTranslation = function(tx,ty) {
    this.translation[0] = tx
    this.translation[1] = ty
    return this;
}
SGNode.prototype.setRotation = function(angle) {
    this.rotation = angle
    return this;
}
SGNode.prototype.setScaling = function(sx,sy) {
    this.scaling[0] = sx
    this.scaling[1] = sy
    return this;
}
drawArm = function (ctx, node) {
    ctx.strokeStyle="red";
    ctx.lineWidth = 3 ;
    radius = 13;

    //Draw circle 
    ctx.beginPath() ;
    ctx.arc(0, 0, radius ,0,Math.PI*2,false) ;
    ctx.closePath();

    
    //Draw rectangle for arm
    ctx.moveTo(-1*(radius + 6), -1*(radius + 3)) ;
    ctx.lineTo(radius*2 + 85, -1*(radius+3)) ;
    ctx.lineTo(radius*2 + 85, (radius+3)) ;
    ctx.lineTo(-1*(radius + 6), radius+3) ;
    ctx.closePath() ;

    ctx.lineWidth = 4 ;
    ctx.stroke() ;    
}

drawUpperLeg = function (ctx, node) {
    ctx.strokeStyle="green";
    radius = 13;

    //Draw circle inside leg
    ctx.beginPath() ;
    ctx.arc(0, 0, radius ,0,Math.PI*2,false) ;
    ctx.closePath();
    
    //Draw upper leg
    ctx.moveTo(-1*(radius + 8), -1*(radius + 9)) ;
    ctx.lineTo(radius*2 + 58, -1*(radius+9)) ;
    ctx.lineTo(radius*2 + 58, (radius+9)) ;
    ctx.lineTo(-1*(radius + 8), radius+9) ;
    ctx.closePath() 
    ctx.lineWidth = 4 ;
    ctx.stroke() ;
}

drawLowerLeg = function (ctx, node) {
    radius = 13;

    //Draw circle (joint) 
    ctx.strokeStyle = "blue"
    ctx.beginPath() ;
    ctx.arc(0, 0, radius ,0,Math.PI*2,false) ;
    ctx.closePath();
    
    //Draw leg extension
    ctx.moveTo(-1*(radius + 9), -1*(radius*2 -2)) ;
    ctx.lineTo(radius + 9, -1*(radius*2-2)) ;
    ctx.lineTo(radius + 9, (radius*2+50)) ;
    ctx.lineTo(-1*(radius + 9), radius*2+50) ;
    ctx.closePath() 

    //Draw feet
    ctx.moveTo(radius + 9, (radius*2+50)) ;
    ctx.lineTo(radius + 40,(radius*2+50)) ;
    ctx.lineTo(radius + 40,(radius*2+30)) ;
    ctx.lineTo(radius + 9,(radius*2+30)) ;
    ctx.lineWidth = 4 ;
    ctx.stroke() ;
}
drawBody = function (ctx, node) {
  
    ctx.strokeStyle="black";

    ctx.lineWidth = 4 ;
    radius = 40 ;

    //Draws head
    ctx.beginPath() ;
    ctx.arc(-40,-1*(160+radius), radius, 0, 2*Math.PI, false) ;
    ctx.closePath() ;
    ctx.stroke() ;

    //Draw eye
    ctx.beginPath() ;
    ctx.ellipse(-20, -1*(178+radius), 10, 7, 0, 0, Math.PI*2, false) ;
    ctx.closePath();
    ctx.stroke() ;
    
    //Draw mouth
    ctx.moveTo(-40 - radius*Math.cos(5*Math.PI/4), -(160+radius) -radius*Math.sin(5*Math.PI/4)) ;
    ctx.lineTo(-35, -195) ;
    ctx.stroke() ;
    
    //Draw torso
    ctx.beginPath() ;
    ctx.moveTo(0,0) ;
    ctx.lineTo(0,-160) ;
    ctx.lineTo(-80,-160) ;
    ctx.lineTo(-80,0) ;

    ctx.closePath() ;

    ctx.stroke() ;

}

function drawAll() {
    // Reset transform before clearing the canvas

    ctx.setTransform(1,0,0, 1,0,0)
    ctx.clearRect(0,0,canvas.width,canvas.height) ;

    //initiate body
    body = new SGNode(drawBody) ;
    body.setTranslation(params.x0, params.y0);    

    //initiate arm    
    arm = new SGNode(drawArm, body) ;
    arm.setTranslation(-40, -160*3/4) ;
    arm.setRotation(params.a1) ;
    
    //initiate upper leg
    upperLeg = new SGNode(drawUpperLeg, body) ;
    upperLeg.setTranslation(-40,-35) ;
    upperLeg.setRotation(params.a2) ;

    //initiate lowerleg
    lowerLeg = new SGNode(drawLowerLeg, upperLeg) ;
    lowerLeg.setTranslation(60,0) ;
    lowerLeg.setRotation(params.a3-90) ;

    body.draw(ctx) ;

}





  /* ### Drawing ### */
  /* ### MODE 0  ### */
    function drawArm1(ctx) {
        // TODO

        ctx.translate(params.x0 -40, params.y0 -160*3/4 )
        ctx.rotate(params.a1 * Math.PI/180) ;
        ctx.strokeStyle="red";
       // ctx.strokeText('Draw arm here', 0,0)
        radius = 13;

        ctx.beginPath() ;
        ctx.arc(0, 0, radius ,0,Math.PI*2,false) ;
        ctx.closePath();
        

        ctx.moveTo(-1*(radius + 6), -1*(radius + 3)) ;
        ctx.lineTo(radius*2 + 85, -1*(radius+3)) ;
        ctx.lineTo(radius*2 + 85, (radius+3)) ;
        ctx.lineTo(-1*(radius + 6), radius+3) ;
        ctx.closePath() ;

       // ctx.beginPath() ;
        ctx.lineWidth = 2 ;
        ctx.stroke() ;


    }
    function drawUpperLeg1(ctx) {
        // TODO
        ctx.translate(params.x0 - 40, params.y0 - 35)
        ctx.rotate(params.a2 * Math.PI/180) ;

        ctx.strokeStyle="green";
        radius = 13;

        ctx.beginPath() ;
        ctx.arc(0, 0, radius ,0,Math.PI*2,false) ;
        ctx.closePath();
        

        ctx.moveTo(-1*(radius + 8), -1*(radius + 9)) ;
        ctx.lineTo(radius*2 + 58, -1*(radius+9)) ;
        ctx.lineTo(radius*2 + 58, (radius+9)) ;
        ctx.lineTo(-1*(radius + 8), radius+9) ;
        ctx.closePath() 
        ctx.lineWidth = 2 ;
        ctx.stroke() ;

        ctx.save()
        ctx.translate(60,0)
        ctx.rotate((params.a3-90) * Math.PI/180) ;
        drawLowerLeg1(ctx)
        ctx.restore()

    }
    function drawLowerLeg1(ctx) {
        // TODO
        radius = 13;

        //Draw circle (joint) 
        ctx.strokeStyle = "blue"
        ctx.beginPath() ;
        ctx.arc(0, 0, radius ,0,Math.PI*2,false) ;
        ctx.closePath();
        
        //Draw leg extension
        ctx.moveTo(-1*(radius + 9), -1*(radius*2 -2)) ;
        ctx.lineTo(radius + 9, -1*(radius*2-2)) ;
        ctx.lineTo(radius + 9, (radius*2+50)) ;
        ctx.lineTo(-1*(radius + 9), radius*2+50) ;
        ctx.closePath() 

        //Draw feet
        ctx.moveTo(radius + 9, (radius*2+50)) ;
        ctx.lineTo(radius + 40,(radius*2+50)) ;
        ctx.lineTo(radius + 40,(radius*2+30)) ;
        ctx.lineTo(radius + 9,(radius*2+30)) ;
        ctx.lineWidth = 2 ;
        ctx.stroke() ;
    }
    function drawBody1(ctx) {
        // TODO

        ctx.save() ;
        drawArm1(ctx) ;
        ctx.restore() ;
        

        ctx.save()
        drawUpperLeg1(ctx)
        ctx.restore()
        

        ctx.translate(params.x0, params.y0)
        ctx.strokeStyle="black";

        ctx.lineWidth = 2 ;

        radius = 40 ;
       // ctx.strokeText('Draw body here', 0,0)
        ctx.beginPath() ;
        ctx.arc(-40,-1*(160+radius), radius, 0, 2*Math.PI, false) ;
        ctx.closePath() ;
            ctx.stroke() ;

        ctx.beginPath() ;
        ctx.ellipse(-20, -1*(178+radius), 10, 7, 0, 0, Math.PI*2, false) ;
        ctx.closePath();
        
        ctx.moveTo(-40 - radius*Math.cos(5*Math.PI/4), -(160+radius) -radius*Math.sin(5*Math.PI/4)) ;
        ctx.lineTo(-35, -195) ;


        ctx.moveTo(0,0) ;
        ctx.lineTo(0,-160) ;
        ctx.lineTo(-80,-160) ;
        ctx.lineTo(-80,0) ;
        ctx.closePath() ;

        ctx.stroke() ;


    }

    function drawAll1() {
        // Reset transform before clearing the canvas
        ctx.setTransform(1,0,0, 1,0,0)
        ctx.clearRect(0,0,canvas.width,canvas.height)

    
        ctx.save() ;
        drawBody1(ctx) ;
        ctx.restore() ;
    }




function start() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    w = canvas.width;
    h = canvas.height;

    // Do init
    initParams()
    initGUI()
    //initKeys(canvas)
    
    // Draw for the first time
    drawAll1() ;

    // Launch main animation loop
    //onTick()
}