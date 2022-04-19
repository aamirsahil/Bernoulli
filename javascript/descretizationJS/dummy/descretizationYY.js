import { foilPath } from './svg.js';
var canvasWidth = document.getElementById('rightMain').offsetWidth - 150;
var canvasHeight = document.getElementById('rightMain').offsetHeight - 60;
//define the entire canvas(right side)
var canvas = d3.select("#system")
        .attr("width",canvasWidth)
        .attr("height",canvasHeight);

var bisect = d3.bisector(d => d).left;

var foilWidth = 600;
var foilHeight = 200;
let foilColor = "#8a8a8a";
let backGroundColor = "#0733ad"
//background
var backGround = canvas.append("rect")
                    .attr("x",0).attr("y",0)
                    .attr("width", canvasWidth).attr("height",canvasHeight)
                    .attr("fill",backGroundColor);
// airFoil
var airFoil = canvas.append("g").attr("class","airFoil")
                .attr("transform", "translate("+ ((canvasWidth - foilWidth)/2) + "," + ((canvasHeight - foilHeight)/2) +")")
                .append("path")
                .attr("d",foilPath).attr("fill",foilColor);
// streamLines 
function f(x,a = -3,d = 0,b = -1,c = 3){
        let exp = Math.pow(x-b, 2)/2/Math.pow(c, 2);
        return a*Math.exp(-exp) + d;
}
//fluid Points
function createFluidPoints(x0 = 0){
        let temp = [];
        for(let i = 0; i<streamLines.length; i++){
                let speed = 20*(i+1);
                temp.push([...Array(distData[i].num).keys()].map((d) => {
                        let x1 = d*distData[i].dist + (x0 + speed)%distData[i].dist;
                        let index = bisect(x, widthScaleReverse(x1));
                        return {x: x1, y: heightScale(completeData[i][index].y)}
                }
                ));
        }
        return Array.prototype.concat.apply([], temp);
}
//create a set of streamLines
function createStreamLines(){
        for( let a = -5; a<5; a += (a<0)?1:0.5){
                if(a>-1 && a<1.5) 
                        continue;
                let sep = (a<0)?a/5:a/10;
                let data = x.map( (d) => ({x: d, y: f(d, a, sep)}));
                let streamLine = canvas.append("g")
                        .selectAll(".plot")
                        .data([data])
                        .enter()
                                .append("path")
                                .attr("class", "plot")
                                .attr("d",line)
                                .attr("fill","none")
                                .attr("stroke", "red")
                                .attr("stroke-width", 2).style("opacity", "0%");
                streamLines.push(streamLine);
                completeData.push(data);
        }
}
//x=position, y=temperature, u=y(x)
var totalNum = 101;
var sepX = 4/(totalNum - 1);
var x = [...Array(totalNum).keys()].map( d => (d*sepX + -2));
//width and height scale inside graph
var widthScale = d3.scaleLinear()
                    .domain([d3.min(x), d3.max(x)])
                    .range([0, canvasWidth]);
//width and height scale inside graph
var widthScaleReverse = d3.scaleLinear()
                .domain([0, canvasWidth])
                .range([d3.min(x), d3.max(x)]);

var heightScale = d3.scaleLinear()
                    .domain([-5,5])
                    .range([canvasHeight,0]);
//convert a set of d to correspondig set (x,y)
var line = d3.line()
.x( d => widthScale(d.x))
.y( d => heightScale(d.y));
// streamLine
var streamLines = [];
var completeData = [];
createStreamLines();
//create mass points
let distData = [...Array(streamLines.length).keys()].map((d) => ({dist: (d+1)*20, num: parseInt(canvasWidth/(d+1)/20)}));
var fluidPoints = [];
fluidPoints = createFluidPoints();

var plotFluidPoints = canvas.append("g")
        .selectAll(".plotPoint")
        .data(fluidPoints)
        .enter()
                .append("circle")
                .attr("class", "plotPoint")
                .attr("cx",d => d.x).attr("cy", d => d.y)
                .attr("r", 5).attr("fill", "black").style("visibility", "hidden");
//slider
var slider = d3
    .sliderLeft()
    .min(0)
    .max(streamLines.length - 1)
    .height(canvasHeight - 40)
    .ticks(1)
    .default(0);
//call slider
canvas.append("g").attr("class","moveSlider")
    .attr("transform", "translate(" + (canvasWidth - 20) + ",20)")
    .call(slider);
//slider interaction
slider.on("onchange", (value)=>{
        selectLine(value);
});
var switchSate = false;
d3.select("#switch").on("input", () => {
        switchSate = !switchSate;

        (switchSate)?plotFluidPoints.style("visibility", "visible"):plotFluidPoints.style("visibility", "hidden");
});
d3.select("#myRange").on("input", () => {
        let value = d3.select("#myRange").property("value");
        setOpacity(value);
});
function setOpacity(opacity){
        streamLines.map((d) => (d.style("opacity", opacity + "%")));
}
function selectLine(value){
        let index = parseInt(value);
        streamLines.map((d,i) => {
                (i == index)?d.attr("stroke-width", 20):d.attr("stroke-width", 2);
        });
}

let frame = 0;
let frameSpeed = 1;
function moveParticles(){
        fluidPoints = createFluidPoints(frame);
        plotFluidPoints.data(fluidPoints)
                .attr("cx",d => d.x).attr("cy", d => d.y);
}
function animate(){
        if(switchSate){
                frame += frameSpeed;
                moveParticles();
        }
        requestAnimationFrame(animate);
}
animate();