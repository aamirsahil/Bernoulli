// var expanded = false;
// d3.select(".expand").on("mousedown", ()=>{
//     console.log("hey");
//     (expanded)?
//     d3.select("#rightMain").style("visibility", "visible"):
//     d3.select("#rightMain").style("visibility", "hidden");
//     expanded = !expanded;
// });
console.log(d3.select("#A1"));
//canvas dims
var canvasWidth = window.innerWidth/1.9;
var canvasHeight = window.innerHeight/2.1;
var graphOffeset = 50;
//define the entire canvas(right side)
var canvas = d3.select("#system")
                .attr("width",canvasWidth)
                .attr("height",canvasHeight)
                .style("overflow","visible");
//width and height scale inside graph
var xMax = 10;
var xMin = 0;
var yMax = 5;
var yMin = 0;
var widthScale = d3.scaleLinear()
                    .domain([0, 10])
                    .range([0, canvasWidth]);
var heightScale = d3.scaleLinear()
                    .domain([0,5])
                    .range([canvasHeight,0]);
let toH = d3.scaleLinear()
                    .domain([1, 4])
                    .range([3.5, 6.5]);
//graphBackground
canvas.append("g")
            .attr("transform","translate(0 , 0)")
            .append("rect")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .attr("fill", "#abdcff")
            .attr("stroke", "black")
            .attr("stroke-width", "3px");
//Params
var rho = 997;
var p1 = 100;
var p2 = 100;
var r1 = 0.5;
var r2 = 0.5;
var h2 = yMax/2;
var h1 = yMax/2;
var v1i = 3;
// var v1di = 2*r1/v1i;
var v1dj = 0.5;
var v1j = parseInt((xMax/2 - 0.5)/v1dj);

var v2i = 3;
var v2dj = (r1/r2)*v1dj;
var v2j = parseInt((xMax - (xMax/2 + 0.5))/v2dj);

//pipe section
var x1 = (d) => {
    let sep = 0.5;
    let x1Arr = [0, xMax/2-sep, xMax/2 + sep];
    let i = d%3;
    return x1Arr[i];
}
var x2 = (d) => {
    let sep = 0.5;
    let x2Arr = [xMax/2-sep, xMax/2 + sep, xMax];
    let i = d%3;
    return x2Arr[i];
}
var y1 = (d) => {
    let r = 0;
    let h = 0;
    if([0,1,3,4].includes(d)){
        r = (d<3)?r1:-r1;
        h = h1;
    }
    else{
        r = (d<3)?r2:-r2;
        h = h2;
    }
    return h + r;
}
var y2 = (d) => {
    let r = 0;
    let h = 0;
    if([1,2,4,5].includes(d)){
        r = (d<3)?r2:-r2;
        h = h2;
    }
    else{
        r = (d<3)?r1:-r1;
        h = h1;
    }
    return h + r;
}
// set the initial values of eq
setEq();

var pipeSectionColor = (d) => {
    return (d != 1 && d != 4)?"black":"red";
}
// steamLine and pipe boundary
var dataLower = x.map( (d) => ({x: d, y: u(d, toH(h1) - r1, toH(h2) - r2)}));
var dataUpper = x.map( (d) => ({x: d, y: u(d, toH(h1) + r1, toH(h2) + r2)}));
var streamLineMid = x.map( (d) => ({x: d,
                y: (u(d, toH(h1) - r1, toH(h2) - r2) + u(d, toH(h1) + r1, toH(h2) + r2))/2
                }));
var pipeSectionArray = [0,1,2,3,4,5];
var pipeSectionData = createSection();

var line = d3.line()
            .x( d => widthScale(d.x))
            .y( d => heightScale(d.y));

var pipeSectionUpper = canvas.append("g")
    .attr("transform", "translate("+canvasWidth/2+","+canvasHeight/2+")")
    .selectAll(".pipeSectionPlot")
    .data([dataUpper])
    .enter()
        .append("path")
        .attr("class", "pipeSectionPlot")
        .attr("d", line)
        .attr("fill","none")
        .attr("stroke","red")
        .attr("stroke-width", 2);

var pipeSectionLower = canvas.append("g")
        .attr("transform", "translate("+canvasWidth/2+","+canvasHeight/2+")")
        .selectAll(".pipeSectionPlot")
        .data([dataLower])
        .enter()
            .append("path")
            .attr("class", "pipeSectionPlot")
            .attr("d", line)
            .attr("fill","none")
            .attr("stroke","red")
            .attr("stroke-width", 2);

var pipeSectionMid = canvas.append("g")
        .attr("transform", "translate("+canvasWidth/2+","+canvasHeight/2+")")
        .selectAll(".pipeSectionPlot")
        .data([streamLineMid])
        .enter()
            .append("path")
            .attr("class", "pipeSectionPlot")
            .attr("d", line)
            .attr("fill","none")
            .attr("stroke","green")
            .attr("stroke-width", 10);

var pipeSection = canvas.append("g")
        .attr("transform", "translate("+canvasWidth/2+","+canvasHeight/2+")")
        .selectAll(".pipeSectionPlot")
        .data([pipeSectionData])
        .enter()
            .append("path")
            .attr("class", "pipeSectionPlot")
            .attr("d", line)
            .attr("fill","grey").style("opacity", "50%");

//velocity
function createVelocityArray(side){
    if (side=="left"){
        return [...Array(v1i*v1j).keys()].map( (d) => 
        {
            let i = parseInt(d/v1j);
            let j = parseInt(d%v1j);
            return {
            x: j*v1dj + v1dj/2,
            y: (h1+r1/2) - i*r1/2
            }
        });
    }
    else{
        return [...Array(v2i*v2j).keys()].map( (d) => 
        {
            let i = parseInt(d/v2j);
            let j = parseInt(d%v2j);
            return {
            x: j*v2dj + v2dj/2 + xMax/2 + 0.5,
            y: (h2+r2/2) - i*r2/2
            }
        });
    }
}
var velocityArrayLeft = createVelocityArray("left");
var velocityArrayRight = createVelocityArray("right");
canvas.append("g")
        .selectAll(".velocityPoints")
        .data(velocityArrayLeft)
        .enter()
            .append("circle")
            .attr("class", "velocityPoints")
            .attr("cx", (d) => widthScale(d.x))
            .attr("cy", (d) => heightScale(d.y))
            .attr("r", 2.5)
            .attr("fill", "blue");

canvas.append("g")
            .selectAll(".velocityPoints")
            .data(velocityArrayRight)
            .enter()
                .append("circle")
                .attr("class", "velocityPoints")
                .attr("cx", (d) => widthScale(d.x))
                .attr("cy", (d) => heightScale(d.y))
                .attr("r", 2.5)
                .attr("fill", "blue");
//middle greyed out portion

var greySectionArray = [
    {x: x1(0),y: y1(0)},
    {x: x1(1),y: y1(1)},
    {x: x2(1),y: y2(1)},
    {x: x2(2),y: y2(2)},
    {x: x2(5),y: y2(5)},
    {x: x2(4),y: y2(4)},
    {x: x1(4),y: y1(4)},
    {x: x1(3),y: y1(3)}
];
//slider input
d3.select("#r2").on("input", () => {
    r2 = parseFloat(d3.select("#r2").property("value"));
    d3.select("#r2_input").html(r2);
    changePipe();
    changeVelocity();
    changeArea();
    setEq();
});
d3.select("#r1").on("input", () => {
    r1 = parseFloat(d3.select("#r1").property("value"));
    d3.select("#r1_input").html(r1);
    changePipe();
    changeVelocity();
    changeArea();
    setEq();
});
d3.select("#h1").on("input", () => {
    h1 = parseFloat(d3.select("#h1").property("value"));
    d3.select("#h1_input").html(h1);
    changePipe();
    changeVelocity();
    changeArea();
    setEq();
});
d3.select("#h2").on("input", () => {
    h2 = parseFloat(d3.select("#h2").property("value"));
    d3.select("#h2_input").html(h2);
    changePipe();
    changeVelocity();
    changeArea();
    setEq();
});
d3.select("#v1").on("input", () => {
    v1dj = parseFloat(d3.select("#v1").property("value"));
    d3.select("#v1_input").html(v1dj);
    changeVelocity();
    setEq();
    // changePipe();
    // changeGreySection();
});
d3.select("#p1").on("input", () => {
    p1 = parseFloat(d3.select("#p1").property("value"));
    d3.select("#p1_input").html(p1);
    setEq();
    // changePipe();
    // changeGreySection();
});
// set equatiom
function setEq(){
    let A1 = (Math.PI*r1*r1).toFixed(2);
    let A2 = (Math.PI*r2*r2).toFixed(2);
    let v2 = (A1/A2*v1dj).toFixed(2);
    let p2 = (p1 + (rho*9.8*h1) + (0.5*rho*Math.pow(v1dj,2)) - (rho*9.8*h2) - (0.5*rho*Math.pow(v2,2))).toFixed(2);

    d3.select("#v2").html(v2);
    d3.select("#eqA1").html(A1);
    d3.select("#eqA2").html(A2);
    d3.select("#eqv2").html(v2);
    d3.select("#eqp2").html(p2);
    d3.select("#p2").html(p2);

}
//changePipe

function changePipe(){
    // steamLine and pipe boundary
    dataLower = x.map( (d) => ({x: d, y: u(d, toH(h1) - r1, toH(h2) - r2)}));
    dataUpper = x.map( (d) => ({x: d, y: u(d, toH(h1) + r1, toH(h2) + r2)}));
    streamLineMid = x.map( (d) => ({x: d,
        y: (u(d, toH(h1) - r1, toH(h2) - r2) + u(d, toH(h1) + r1, toH(h2) + r2))/2
        }));
    pipeSectionLower
        .data([dataLower])
            .attr("d", line);
    pipeSectionUpper
            .data([dataUpper])
                .attr("d", line);
    pipeSectionMid
            .data([streamLineMid])
                .attr("d", line);

    pipeSectionData = createSection();
    pipeSection
            .data([pipeSectionData])
                .attr("d", line);
}

function changeVelocity(){
    v1j = parseInt((xMax/2 - 0.5)/v1dj);
    v2dj = (r1/r2)*v1dj;
    v2j = parseInt((xMax - (xMax/2 + 0.5))/v2dj);

    velocityArrayLeft = createVelocityArray("left");
    velocityArrayRight = createVelocityArray("right");

    canvas.selectAll(".velocityPoints").data([]).exit().remove();
    canvas.append("g")
        .selectAll(".velocityPoints")
        .data(velocityArrayLeft)
        .enter()
            .append("circle")
            .attr("class", "velocityPoints")
            .attr("cx", (d) => widthScale(d.x))
            .attr("cy", (d) => heightScale(d.y))
            .attr("r", 2.5)
            .attr("fill", "blue");
    canvas.append("g")
            .selectAll(".velocityPoints")
            .data(velocityArrayRight)
            .enter()
                .append("circle")
                .attr("class", "velocityPoints")
                .attr("cx", (d) => widthScale(d.x))
                .attr("cy", (d) => heightScale(d.y))
                .attr("r", 2.5)
                .attr("fill", "blue");
    velocity1
                .attr("y1", heightScale(velocityArrayLeft[(v1i*v1j)/3].y))
                .attr("x2", 20 + 50*v1dj)
                .attr("y2", heightScale(velocityArrayLeft[(v1i*v1j)/3].y));
    //plot velocity------------------------------------------------>right
    velocity2
                .attr("y1", heightScale(velocityArrayRight[2*(v2i*v2j)/3 - 1].y))
                .attr("x2", canvasWidth - 20 + 50*v2dj)
                .attr("y2", heightScale(velocityArrayRight[2*(v2i*v2j)/3 - 1].y));
}
function changeArea(){
    A1.attr("cy", heightScale(velocityArrayLeft[(v1i*v1j)/3].y))
            .attr("ry", widthScale(r1/1.3));

    A2.attr("cy", heightScale(velocityArrayRight[2*(v2i*v2j)/3 - 1].y))
            .attr("ry", widthScale(r2/1.3));

    height1.attr("y2", heightScale(h1));
    height2.attr("y2", heightScale(h2));

    velocity1
            .attr("y1", heightScale(velocityArrayLeft[(v1i*v1j)/3].y))
            .attr("x2", 20 + 50*v1dj)
            .attr("y2", heightScale(velocityArrayLeft[(v1i*v1j)/3].y));
    velocity2
            .attr("y1", heightScale(velocityArrayRight[2*(v2i*v2j)/3 - 1].y))
            .attr("x2", canvasWidth - 20 + 50*v2dj)
            .attr("y2", heightScale(velocityArrayRight[2*(v2i*v2j)/3 - 1].y));
}
//plot cross-section------------------------------------------------>left
var A1 = canvas.append("g")
            .append("ellipse")
            .attr("class", ".dataPointer")
            .attr("cx", 20)
            .attr("cy", heightScale(velocityArrayLeft[(v1i*v1j)/3].y))
            .attr("rx", 20)
            .attr("ry", widthScale(r1/1.3))
            .attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1).attr("stroke-dasharray",3)
            .attr("fill", "grey");
//plot cross-section------------------------------------------------>right
var A2 = canvas.append("g")
            .append("ellipse")
            .attr("class", ".dataPointer")
            .attr("cx", canvasWidth - 20)
            .attr("cy", heightScale(velocityArrayRight[2*(v2i*v2j)/3 - 1].y))
            .attr("rx", 20)
            .attr("ry", widthScale(r2/1.3))
            .attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1).attr("stroke-dasharray",3)
            .attr("fill", "grey");
//plot height------------------------------------------------>left
var height1 = canvas.append("g")
            .append("line")
            .attr("class", ".dataPointer")
            .attr("x1", 20)
            .attr("x2", 20)
            .attr("y1", canvasHeight)
            .attr("y2", heightScale(h1))
            .attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",5).attr("stroke-dasharray",3);
//plot height------------------------------------------------>right
var height2 = canvas.append("g")
                .append("line")
                .attr("class", ".dataPointer")
                .attr("x1", canvasWidth - 20)
                .attr("x2", canvasWidth - 20)
                .attr("y1", canvasHeight)
                .attr("y2", heightScale(h2))
                .attr("fill","none")
                .attr("stroke", "black").attr("stroke-width",5).attr("stroke-dasharray",3);
//plot velocity------------------------------------------------>left
var velocity1 = canvas.append("g")
            .append("line")
            .attr("class", ".dataPointer")
            .attr("x1", 20)
            .attr("y1", heightScale(velocityArrayLeft[(v1i*v1j)/3].y))
            .attr("x2", 20 + 50*v1dj)
            .attr("y2", heightScale(velocityArrayLeft[(v1i*v1j)/3].y))
            .attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",5).attr("marker-end","url(#arrow)");
//plot velocity------------------------------------------------>right
var velocity2 = canvas.append("g")
            .append("line")
            .attr("class", ".dataPointer")
            .attr("x1", canvasWidth - 20)
            .attr("y1", heightScale(velocityArrayRight[2*(v2i*v2j)/3 - 1].y))
            .attr("x2", canvasWidth - 20 + 50*v2dj)
            .attr("y2", heightScale(velocityArrayRight[2*(v2i*v2j)/3 - 1].y))
            .attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",5).attr("marker-end","url(#arrow)");
