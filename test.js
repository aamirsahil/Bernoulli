const canvasWidth = window.innerWidth - 100;
const canvasHeight = window.innerHeight - 100;

var canvas = d3.select("#system")
        .attr("width",canvasWidth)
        .attr("height",canvasHeight)
var backGround = canvas.append("rect")
                    .attr("width", canvasWidth).attr("height", canvasHeight)
                    .attr("x", 0).attr("y", 0)
                    .attr("fill", "grey");

// airFoil
function f(x){
    // let t = 1;
    // return 5*t*(0.2969*Math.sqrt(x) - 0.1260*x
    //         - 0.3516*Math.pow(x,2) + 0.2843*Math.pow(x,3)
    //         - 0.1015*Math.pow(x,4));
    if(x<.3)
        return 0.1*Math.sin(Math.PI/0.6*x);
    else
        return 0.1 - 1/3.43*Math.pow(x - 0.3, 3);
}
function g(x){
    return 0.03 - 0.08*Math.sqrt(Math.pow(0.625,2) - Math.pow((x - 0.5), 2 ));
}
//x=position, y=temperature, u=y(x)
var x1 = [...Array(1001).keys()].map( d => (d*0.001));
var x2 = [...Array(1001).keys()].map( d => (d*0.001)).reverse();
var x = x1.concat(x2);
var data = x.map((d,i) => ({x: d, y: (i<1001)?f(d):g(d)}));
//width and height scale inside graph
var widthScale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([100, canvasWidth - 100]);

var heightScale = d3.scaleLinear()
                    .domain([-.2,.2])
                    .range([canvasHeight,0]);
//convert a set of d to correspondig set (x,y)
var dragPivot = 0;
var line = d3.line()
.x( d => widthScale(d.x))
.y( d => heightScale(d.y));
// airFoil plot
// var airFoil = canvas.append("g")
//     .selectAll(".plot")
//     .data([data])
//     .enter()
//     .append("path")
//     .attr("class", "plot")
//     .attr("d",line)
//     .attr("fill","black")
//     .attr("stroke", "red")
//     .attr("stroke-width", 2)
//     .on("mousedown", function(event){
//         dragPivot = event.x;
//     });

// var dragHandler = d3.drag()
//     .on("drag", function (event) {
//         let moveTo = 0;
//         // (event.x >= 50? ((event.x <= window.innerWidth - 50)?
//         //      event.x - 100 : (canvasWidth - 50)): 0)
//         d3.select(this)
//             .attr("transform", "translate(" + moveTo + ", 0)");
//     });
// dragHandler(airFoil);
// canvas.on("mousedown", function(event){
//     alert(event.x);
// });
//stream Line
//width and height scale inside graph
let xScreen = (x) => x + canvasWidth/2;
let xCord = (x) => x - canvasWidth/2;
let yScreen = (y) => -y + canvasHeight/2;
let yCord = (y) => -y + canvasHeight/2;
let num = 30;
let row = 40;

let pos = [...Array(row).keys()].map( (i) => 
    [...Array(num).keys()].map((e,j) => ({x: (-canvasWidth/2 - i*25), y: -canvasHeight/2 + (j)*canvasHeight/(num-1)})));
console.log(pos);
// let pos = [...Array(num).keys()].map((d,i) => ({x: -canvasWidth/2, y: -canvasHeight/2 + (i)*canvasHeight/(num-1)}));
let U = 5;
let R = 50;

let r = (x,y) => Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
let cosT = (x,r) => x/r;
let sinT = (y,r) => y/r;
let Vr = (r,cosT) => U*(1-Math.pow(R/r,2))*cosT;
let Vt = (r,sinT) => -U*(1+Math.pow(R/r,2))*sinT;
let Vx = (x,y) => {
    let r0 = r(x,y);
    let cosT0 = cosT(x,r0);
    let sinT0 = sinT(y,r0);
    return Vr(r0,cosT0)*cosT0 - Vt(r0,sinT0)*sinT0;
}
let Vy = (x,y) => {
    let r0 = r(x,y);
    let cosT0 = cosT(x,r0);
    let sinT0 = sinT(y,r0);
    return Vr(r0,cosT0)*sinT0 + Vt(r0,sinT0)*cosT0;
}
let xPos = (d) => xScreen(d.x);
let yPos = (d) => yScreen(d.y);
let particles = [];
[...Array(row).keys()].map( (i) => 
    particles.push(canvas.append("g")
        .selectAll(".particle").data(pos[i])
        .enter()
            .append("g").attr("class","particle")
            .append("circle")
            .attr("cx",xPos).attr("cy",yPos).attr("r",5)
            .attr("fill","red")));
// let particles = [...Array(row).keys()].map( (i) => {
//                 canvas.append("g")
//                 .selectAll(".particle").data(pos[i])
//                 .enter()
//                     .append("g").attr("class","particle")
//                     .append("circle")
//                     .attr("cx",xPos).attr("cy",yPos).attr("r",5)
//                     .attr("fill","red")});
let obstacle = canvas.append("circle")
                    .attr("cx",xScreen(0)).attr("cy",yScreen(0)).attr("r",R)
                    .attr("fill","green");

let speedX = [...Array(row).keys()].map( (i) => [...Array(num).keys()].map( d => U));
let speedY = [...Array(row).keys()].map( (i) => [...Array(num).keys()].map( d => 0));
function animate() {
    pos.map((d,i) => d.map((e,j) => {
        e.x += speedX[i][j];
        e.y += speedY[i][j];
        speedX[i][j] = Vx(e.x,e.y);
        speedY[i][j] = Vy(e.x,e.y);
        if(e.x > (canvasWidth/2 + 400) && i==(row - 1))
        {
            // d.x = -canvasWidth/2;
            // d.y = -canvasHeight/2 + (i)*canvasHeight/(num-1);
            // speedX[i] = U;
            // speedY[i] = 0;
            init();
        }
    }));
    particles.map( (d,i) => d.data(pos[i])
            .attr("cx", xPos).attr("cy", yPos));
    requestAnimationFrame( animate );
}
function init(){
    // speedX[i] = [...Array(num).keys()].map( d => U);
    // speedY[i] = [...Array(num).keys()].map( d => 0);
    // pos[i] = [...Array(num).keys()].map((d,i) => ({x: -canvasWidth/2, y: -canvasHeight/2 + (i)*canvasHeight/(num-1)}));
    speedX = [...Array(row).keys()].map( (i) => [...Array(num).keys()].map( d => U));
    speedY = [...Array(row).keys()].map( (i) => [...Array(num).keys()].map( d => 0));
    pos = [...Array(row).keys()].map( (i) => 
    [...Array(num).keys()].map((e,j) => ({x: (-canvasWidth/2 - i*25), y: -canvasHeight/2 + (j)*canvasHeight/(num-1)})));
}
console.log(particles);
animate();