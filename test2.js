
function setup(){
    var canvas = createCanvas(800,600);
    canvas.parent("#sub");
    frameRate(60);
}
function draw(){
    fill("black");
    rect(0, 0, 800, 600);
    fill("white");
    noStroke();
    ellipse(mouseX, mouseY, 60, 60);
}