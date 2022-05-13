// canvas dimension
var canvasWidth = document.getElementById('rightMain').offsetWidth - 100;
var canvasHeight = document.getElementById('rightMain').offsetHeight - 20;
//define the entire canvas(right side)
var canvas = d3.select("#system")
        .attr("width",canvasWidth)
        .attr("height",canvasHeight);
// find index that bisects a given value in an array
var bisect = d3.bisector(d => d).left;
// foil dimension
var foilWidth = 600;
var foilHeight = 200;
let foilColor = "#a7aaab";
let backGroundColor = "#abdcff";
//background
canvas.append("rect")
        .attr("x",0).attr("y",0)
        .attr("width", canvasWidth).attr("height",canvasHeight)
        .attr("fill",backGroundColor);
// x axis goes from -2 to 2
var totalNum = 101;
var sepX = 6/(totalNum - 1);
var x = [...Array(totalNum).keys()].map( d => (d*sepX + -3));
// width and height scale to plot
var widthScale = d3.scaleLinear()
                    .domain([-2, 2])
                    .range([0, canvasWidth]);
var widthScaleReverse = d3.scaleLinear()
                .domain([0, canvasWidth])
                .range([-2, 2]);
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
//create mass points---->distData is for curved stream dist=distnace between points, num=number of points
// linearDist dist=distance between points and num= number of points
let distData = [...Array(streamLen).keys()].map((d) => ({dist: (d+1)*20, num: parseInt((canvasWidth+100)/(d+1)/20)}));
let linearDist = {dist: 60, num: parseInt((canvasWidth+100)/60)};
let linearVelLength = 40;
var fluidPointsObs = [];
var fluidPointsLinear = [];
// remove obstacle switch
var switchSate = true;
// animation
let frame = 0;
let frameSpeed = 1;
let animateOn = false;
// right slider range
let blueSel = "#5999e3";
let greyUnCel = "#a6a5a2";
// foil
const foilPath = "M 17.8726,83.416827 C 17.8726,117.02852 212.3054,83.484327 594.3183,93.853867 C 368.4501,14.36958 17.8726,27.68621 17.8726,83.416827 z";
