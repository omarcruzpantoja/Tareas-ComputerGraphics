/* Basic scenegraph datastructure for Assg2 Geometry */
/* Author: Rémi Mégret, 2017, UPR Rio Piedras */

/* For a scene graph structure with deeper Object Oriented approach,
see the source code of http://math.hws.edu/graphicsbook/demos/c2/cart-and-windmills.html
*/

/* Usage:
// Define node drawing callbackS
onDraw1=function(ctx,node) {
    ctx.beginPath()
    ctx.rect(0,0,10,10)
    ctx.stroke()
}
onDraw2=function(ctx,node) {
    ...
}
// Create new node
node = new SGNode(onDraw1)
node.setTranslation(30,10)
node.setRotation(45)
// Create child node
child = new SGNode(onDraw2, node)
node.setTranslation(50,0)

// In event or timer callback, draw the node and its child
node.draw(ctx)
*/


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
    
    //var parent = document.getElementById('controls');      
    //parent.appendChild(gui.domElement);
}
// GUI callback when parameters are changed manually in the GUI
function onParamsChange() {
    drawAll()
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

function start() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    w = canvas.width;
    h = canvas.height;

    // Do init
    initParams()
    //initGUI()
    //initKeys(canvas)
    
    // Draw for the first time
    // drawAll()

    // Launch main animation loop
    //onTick()
}