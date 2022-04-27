//To calculate the profile of the graph
function u(x,h,k,c){
    let L = 1;
    let x0 = 1;
    return c*L/(1 + Math.exp(-k*(x - x0))) + h;
}
//To calculate velocity
function du(x,k,c){
    let L = 1;
    let x0 = 1;
    return c*L*k*Math.exp(-k*(x - x0))/Math.pow(1 + Math.exp(-k*(x - x0)), 2);
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
function movePoints(){
    velocityPoints.forEach( (d) => {
        let speedX = 1;
        // let speedY = d.x*0.001;
        // let speedY = du(d.x, 0, 2)
        d.x += speedX;
        d.x %= canvasWidth + 10;
        // d.y += speedY;
        // d.y %= canvasHeight + 10;
    });
}