// canvas dimension
var canvasWidth = document.getElementById('rightMain').offsetWidth/1.2;
var canvasHeight = document.getElementById('rightMain').offsetHeight/1.1;
//data for graphing
var totalNum = 201;
var totalLen = 2;
var dist = 2/totalNum;
var x = [...Array(totalNum).keys()].map( d => (d*dist) - 1);
// changele parameters of pipe
// h1, h2 ----------> from -3 to 3
let h1 = 0;
let h2 = 0;
// r1, r2 ---------> from 0.5 to 2
let r1 = 1;
let r2 = 1;
// steamLine and pipe boundary
var dataLower = x.map( (d) => ({x: d, y: u(d, h1 - r1, h2 - r2)}));
var dataUpper = x.map( (d) => ({x: d, y: u(d, h1 + r1, h2 + r2)}));
var streamLineMid = x.map( (d) => ({x: d,
                                    y: (u(d, h1 - r1, h2 - r2) + u(d, h1 + r1, h2 + r2))/2
                                    }));
var streamLineUp = x.map( (d) => ({x: d,
                                   y: u(d, h1 - r1, h2 - r2)/4 + 3*u(d, h1 + r1, h2 + r2)/4
                                    }));
var streamLineLow = x.map( (d) => ({x: d,
                                    y: 3*u(d, h1 - r1, h2 - r2)/4 + u(d, h1 + r1, h2 + r2)/4
                                    }));
// keep track of the velocity poits
let velPointsMid = [];
let velPointsUp = [];
let velPointsLow = [];
//width and height scale inside graph
var widthScale = d3.scaleLinear()
                    .domain([-1, 1])
                    .range([0, canvasWidth]);
var heightScale = d3.scaleLinear()
                    .domain([-5,5])
                    .range([canvasHeight,20]);
// necessary sliders points
var sliderRange = [0, 1/4, 2/4, 3/4, 1];
var fillOpacity = 1;
// for fill Opacity
var fillOpacityScale = d3.scaleLinear()
                    .domain([ sliderRange[0], sliderRange[1]])
                    .range([0.0, 5.0]);
// crossSectionVisibiliyu
let crossSectionVisible = false;



// obstacleScalers
// var widthScaleObs = d3.scaleLinear()
//                     .domain([d3.min(x), d3.max(x)])
//                     .range([canvasWidth/2, canvasWidth]);
// var heightScaleObs = d3.scaleLinear()
//                     .domain([d3.min(obstacleLower.map((d) => d.y)),d3.max(obstacleUpper.map((d) => d.y))])
//                     .range([canvasHeight/1.5,canvasHeight/3]);

// obstacle equation
// var obstacleUpper = x.map( (d) => ({x: d, y: Math.sqrt(d)}));
// var obstacleLower = x.map( (d) => ({x: d, y: 0}));