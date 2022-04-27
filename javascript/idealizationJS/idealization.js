import { foilPath } from '../descretizationJS/svg.js';
import { setMarker, setText, resetAll } from './rightSliderInteractions.js';

var canvasWidth = document.getElementById('rightMain').offsetWidth - 150;
var canvasHeight = document.getElementById('rightMain').offsetHeight - 60;
//define the entire canvas(right side)
var canvas = d3.select("#system")
        .attr("width",canvasWidth)
        .attr("height",canvasHeight);
//set height and width of the image
d3.select("#river").style("width", (canvasWidth +150) + "px")
                .style("height", canvasHeight + "px")
                .on("click", ()=> {
                        alert("hey");
                });

var bisect = d3.bisector(d => d).left;

var foilWidth = 600;
var foilHeight = 200;
let foilColor = "#8a8a8a";
let backGroundColor = "#abdcff";
//background
var backGround = canvas.append("rect")
                    .attr("x",0).attr("y",0)
                    .attr("width", canvasWidth).attr("height",canvasHeight)
                    .attr("fill",backGroundColor).style("opacity", "0%");
// airFoil
var airFoil = canvas.append("g").attr("class","airFoil")
                .attr("transform", "translate("+ ((canvasWidth - foilWidth)/2) + "," + ((canvasHeight - foilHeight)/2) +")")
                .append("path")
                .attr("d",foilPath).attr("fill",foilColor).style("visibility", "hidden");
// streamLines 
function f(x,a = -3,d = 0,b = -1,c = 3){
        let exp = Math.pow(x-b, 2)/2/Math.pow(c, 2);
        return a*Math.exp(-exp) + d;
}
//fluid Points
function createFluidPoints(x0 = 0){
        let temp = [];
        for(let i = 0; i<streamLen; i++){
                let speed = 20*(i+1);
                temp.push([...Array(distData[i].num).keys()].map((d) => {
                        let x1 = d*distData[i].dist + (x0 + speed)%distData[i].dist;
                        let x2 = x1 + linearVelLength;
                        let firstIndex = bisect(x, widthScaleReverse(x1));
                        let lastIndex = Math.min(bisect(x, widthScaleReverse(x2)), totalNum - 1);
                        return {
                                x1: x1, 
                                y1: heightScale(completeData[i][firstIndex].y),
                                x2: x2,
                                y2: heightScale(completeData[i][lastIndex].y)
                        }
                }
                ));
        }
        return Array.prototype.concat.apply([], temp);
}
//fluid Points Linear
function createFluidPointsLinear(x0 = 0){
    let temp = [];
    for(let i = 0; i<streamLen; i++){
            temp.push([...Array(linearDist.num).keys()].map((d) => {
                    let x1 = d*linearDist.dist + (x0)%linearDist.dist;
                    let x2 = x1 + linearVelLength;
                    let firstIndex = bisect(x, widthScaleReverse(x1));
                    let lastIndex = Math.min(bisect(x, widthScaleReverse(x2)), totalNum - 1);

                    return {
                        x1: x1, 
                        y1: heightScale(linearData[i][firstIndex].y),
                        x2: x2,
                        y2: heightScale(linearData[i][lastIndex].y)
                }
            }
            ));
    }
    return Array.prototype.concat.apply([], temp);
}
//create a set of streamLines
function createFoilFlow(){
        for( let a = -5; a<5; a += (a<0)?1:0.5){
                if(a>-1 && a<1.5) 
                        continue;
                let sep = (a<0)?a/5:a/10;
                let data = x.map( (d) => ({x: d, y: f(d, a, sep)}));

                completeData.push(data);
        }
}

function createLinearFlow(){
    for( let a = -5; a <= 6; a += 1){
            let data = x.map( (d) => ({x: d, y: a}));

            linearData.push(data);
    }
}
//x axis goes from -2 to 2
var totalNum = 101;
var sepX = 4/(totalNum - 1);
var x = [...Array(totalNum).keys()].map( d => (d*sepX + -2));
//width and height scale to plot
var widthScale = d3.scaleLinear()
                    .domain([d3.min(x), d3.max(x)])
                    .range([0, canvasWidth]);
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
var streamLen = 12;
var completeData = [];
var linearData = [];
createFoilFlow();
createLinearFlow();
//create mass points
let distData = [...Array(streamLen).keys()].map((d) => ({dist: (d+1)*20, num: parseInt(canvasWidth/(d+1)/20)}));
let linearDist = {dist: 60, num: parseInt(canvasWidth/60)};
let linearVelLength = 40;
var fluidPoints = [];
fluidPoints = createFluidPointsLinear();

var canvasText = canvas.append("g")
                .append("text")
                .style("font-size", "2rem")
                .attr("x", 0)
                .attr("y", 15)
                .attr("dy", ".35em")
                .text( "Flowing Fluid")
                .style("fill", "white").style("opacity","0%");
var plotFluidPoints = canvas.append("g")
        .selectAll(".plotPoint")
        .data(fluidPoints)
        .enter()
                .append("circle")
                .attr("class", "plotPoint")
                .attr("cx",d => d.x1).attr("cy", d => d.y1)
                .attr("r", 5).attr("fill", "black").style("opacity", "0%");

var plotFluidVelocity = canvas.append("g")
        .selectAll(".plotVelocity")
        .data(fluidPoints)
        .enter()
                .append("line")
                .attr("class", "plotVelocity")
                .attr("x1", d => d.x1)
                .attr("x2", d => d.x2)
                .attr("y1", d => d.y1)
                .attr("y2", d => d.y2)
                .attr("fill","none")
                .attr("stroke", "red")
                .attr("stroke-width", 2).style("opacity", "0%");
//streamLine plots
var plotLinearStreamLine = canvas.append("g")
                .selectAll(".plotLinearStreamline")
                .data([linearData[5]])
                .enter()
                        .append("path")
                        .attr("class", "plotLinearStreamline")
                        .attr("d", line)
                        .attr("fill","none")
                        .attr("stroke", "yellow")
                        .attr("stroke-width", 2)
                        .attr("stroke-dasharray",3).style("visibility", "hidden");
var plotCompleteStreamLine = canvas.append("g")
                .selectAll(".plotCompleteStreamline")
                .data([completeData[5]])
                .enter()
                        .append("path")
                        .attr("class", "plotCompleteStreamline")
                        .attr("d", line)
                        .attr("fill","none")
                        .attr("stroke", "yellow")
                        .attr("stroke-width", 2)
                        .attr("stroke-dasharray",3).style("visibility", "hidden");
var streamText = canvas.append("g")
                .append("text")
                .style("font-size", "2rem")
                .attr("x", widthScale(linearData[5][50].x))
                .attr("y", heightScale(linearData[5][50].y + 0.5))
                .attr("dy", ".35em")
                .text( "Streamline")
                .style("fill", "white").style("visibility", "hidden");
var switchSate = false;
d3.select("#switch").on("input", () => {
        switchSate = !switchSate;
        (switchSate)?airFoil.style("visibility", "visible"):airFoil.style("visibility", "hidden");
        fluidPoints = (switchSate)?createFluidPoints():createFluidPointsLinear();
        streamText.attr("x", (switchSate)?widthScale(completeData[5][50].x):widthScale(linearData[5][50].x))
                .attr("y", (switchSate)?heightScale(completeData[5][50].y + 0.5):heightScale(linearData[5][50].y + 0.5));
        if(switchSate){
                plotCompleteStreamLine.style("visibility","visible");
                plotLinearStreamLine.style("visibility","hidden");
        }
        else{
                plotLinearStreamLine.style("visibility","visible");
                plotCompleteStreamLine.style("visibility","hidden");
        }
        frame = 0;
});

var sliderRange = [0, 1/4, 2/4, 3/4, 1]
d3.select("#myRange").on("input", () => {
        let value = d3.select("#myRange").property("value");
        let max = d3.select("#myRange").property("max");
        let min = d3.select("#myRange").property("min");
        let length = value/(max - min);
    
        if(length == (sliderRange[0])){
                resetAll(plotFluidPoints,plotFluidVelocity,backGround,canvasText,plotLinearStreamLine,plotCompleteStreamLine,streamText);
        }
        else if(length > sliderRange[0] && length <= sliderRange[1]){
            setText(0);
                d3.select("#river").style("opacity", setOpacity(length, 1, 0) + "%");
            canvasText.style("opacity", setOpacity(length,0,1) + "%");
            backGround.style("opacity", setOpacity(length,0,1) + "%");
        }
        else if(length > sliderRange[1] && length <= sliderRange[2]){
            setText(1);
            setMarker(0);
            animateStart(false);
            plotFluidPoints.style("opacity", setOpacity(length,1,2) + "%");
            plotFluidVelocity.style("opacity", setOpacity(length,1,2) + "%");
        }
        else if(length > sliderRange[2] && length <= sliderRange[3]){
            setText(2);
            setMarker(1);
            animateStart(true);
                //set streamLine
                if(switchSate)
                        plotCompleteStreamLine.style("visibility","hidden");
                else
                        plotLinearStreamLine.style("visibility","hidden");

            streamText.style("visibility","hidden");
        }
        else if(length > sliderRange[3] && length < sliderRange[4]){
                setText(3);
                setMarker(2);
                //set streamLine
                if(switchSate)
                        plotCompleteStreamLine.style("visibility","visible");
                else
                        plotLinearStreamLine.style("visibility","visible");
                streamText.style("visibility","visible");
        }
        else{
                setText(4);
                setMarker(3);
                d3.select(".switchContainer").style("visibility", "visible");
        }
});

function animateStart(val){
        animateOn = val;
}
function setOpacity(opacity,i,j){
        opacity = (opacity - sliderRange[i])/(sliderRange[j] - sliderRange[i])*100;
        return opacity;
}

let frame = 0;
let frameSpeed = 1;
function moveParticles(){
        fluidPoints = (switchSate)?createFluidPoints(frame):createFluidPointsLinear(frame);
        plotFluidPoints.data(fluidPoints)
                .attr("cx",d => d.x1).attr("cy", d => d.y1);
        plotFluidVelocity.data(fluidPoints)
                .attr("x1", d => d.x1)
                .attr("x2", d => d.x2)
                .attr("y1", d => d.y1)
                .attr("y2", d => d.y2);
}

let animateOn = false;
function animate(){
        if(animateOn)
            frame += frameSpeed;
        moveParticles();
        requestAnimationFrame(animate);
}
animate();



function svgResize()
{
    d3.select("#marker1")
        .attr("x", 0);
    d3.select("#marker2")
        .attr("x", (1/4)*d3.select("#pointers").style("width").replace("px", ""));
    d3.select("#marker3")
        .attr("x", (2/4)*d3.select("#pointers").style("width").replace("px", ""));
        d3.select("#marker4")
        .attr("x", (3/4)*d3.select("#pointers").style("width").replace("px", ""));
    d3.select("#marker5")
        .attr("x", 0.95*d3.select("#pointers").style("width").replace("px", ""));
}
window.addEventListener("load",svgResize());
// window.addEventListener("resize",svgResize());
