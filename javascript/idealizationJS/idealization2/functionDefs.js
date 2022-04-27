//To calculate the profile of the graph
function u(x,h,k,c,L=1,x0=1){
    return c*L/(1 + Math.exp(-k*(x - x0))) + h;
}
//To calculate velocity
function du(x,k,c,x0=1, L=1){
    return c*L*k*x*Math.exp(-k*(x - x0))/Math.pow(1 + Math.exp(-k*(x - x0)), 2);
}
function createVelocityPoints(){
    let rowNum = 18;
    let colNum = 6;
    let distCol = canvasWidth/colNum;
    let distRow = canvasHeight/rowNum;
    velocityPoints = [...Array(colNum*rowNum).keys()].map( (d) => 
        ({
            x: (d%colNum)*distCol + 50,
            y: parseInt(d/colNum)*distRow + 20
        })
        );
}
function movePoints(width){
    velocityPoints.forEach( (d) => {
        let speedX = 1;
        // let speedY = du(d.x, -0.3, 5, width);
        d.x += speedX;
        d.x %= canvasWidth + 10;
        // d.y += speedY;
        // d.y %= canvasHeight + 10;
    });
}