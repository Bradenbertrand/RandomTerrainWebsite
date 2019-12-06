var cols, rows; //Columns and rows of vertexs
var scl = 90; //scale of triangles
var w = 3300; //Width of 
var h = 1100;
var flying = 0;
var terrain = [];
var rotation = 1;
var translation = 60;
var clickme;

function setup() {
    var canvas = createCanvas(windowWidth, 800, WEBGL);
    canvas.parent('homepage-animation');
    cols = w / scl;
    rows = h / scl;

    for (var x = 0; x < cols; x++) {
        terrain[x] = [];
        for (var y = 0; y < rows; y++) {
            terrain[x][y] = 0; //specify a default value for now
        }
    }
}

function draw() {
    drawTerrain();
}

function drawTerrain() {
    var mouseObj = getObject(mouseX, mouseY);
    console.log(mouseObj)
    var mouseHeight = map(-mouseY, -800, 0, 25, 150);
    if (mouseHeight < 25) {
        mouseHeight = 25;
    }
    if (mouseHeight > 150) {
        mouseHeight = 150;
    }
    flying -= 0.05;
    var yoff = flying;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            terrain[x][y] = map(noise(xoff, yoff), 0, 1, 0, mouseHeight);
            xoff += 0.2;
        }
        yoff += 0.2;
    }

    var mouseColor = map(-mouseY, -400, 0, 0, 255)

    background(0);
    if (translation > 60) {
        translation = 60;
    }

    if (rotation <= 2.5) {
        rotation = 2.5;
    } else if (rotation >= 25) {
        rotation = 25
    }
    rotateX(PI / rotation);
    push();
    texture(text);
    fill(200, 200, 200);
    translate(0, 200)
    box(100, 75, 5);
    pop();

    push();
    fill(50, 50, 50);
    translate(0, 0)
    box(100, 75, 5);
    pop();

    push();
    fill(100, 100, 100);
    translate(0, -200)
    box(100, 75, 5);
    pop();

    translate(-w / 2, -h / 2 + translation);
    fill(0, 0, 0);
    for (var y = 0; y < rows - 1; y++) {
        beginShape(TRIANGLE_STRIP);
        for (var x = 0; x < cols; x++) {
            strokeWeight(3);
            stroke(255, 255, 255);
            vertex(x * scl, y * scl, terrain[x][y]);
            vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
        }
        endShape();
    }
}


function mouseWheel(event) {
    //move the square according to the vertical scroll amount
    rotation += event.delta / 1000;
    translation -= event.delta / 60;
    //uncomment to block page scrolling
    //return false;
}

function getObject(mx, my) {
	if (mx > width || my > height) {
		return 0;
	}

	var gl = canvas.getContext('webgl');
	var pix = getPixels();

	var index = 4 * ((gl.drawingBufferHeight-my) * gl.drawingBufferWidth + mx);

	// var cor = color(
	// 	pix[index + 0],
	// 	pix[index + 1],
	// 	pix[index + 2],
	// 	pix[index + 3]);
	// return cor;
	return pix[index]; // Only returning the red channel as the object index.
}

function getPixels() {
	var gl = canvas.getContext('webgl');
	var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
	gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	return (pixels);
}