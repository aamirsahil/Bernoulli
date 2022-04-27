// canvas dimension
var canvasWidth = document.getElementById('rightMain').offsetWidth/1.2;
var canvasHeight = document.getElementById('rightMain').offsetHeight/1.1;
//data for graphing
var totalNum = 201;
var totalLen = 2;
var dist = 2/totalNum;
var x = [...Array(totalNum).keys()].map( d => (d*dist));
// 
var dataLower = x.map( (d) => ({x: d, y: u(d,-0.3,5,1)}));
var dataUpper = x.map( (d) => ({x: d, y: u(d,+0.3,8,0.6)}));
// obstacle equation
var obstacleUpper = x.map( (d) => ({x: d, y: Math.sqrt(d)}));
var obstacleLower = x.map( (d) => ({x: d, y: 0}));
//width and height scale inside graph
var widthScale = d3.scaleLinear()
                    .domain([d3.min(x), d3.max(x)])
                    .range([0, canvasWidth]);
var heightScale = d3.scaleLinear()
                    .domain([d3.min(dataLower.map((d) => d.y)),d3.max(dataUpper.map((d) => d.y))])
                    .range([canvasHeight/2,20]);
// obstacleScalers
var widthScaleObs = d3.scaleLinear()
                    .domain([d3.min(x), d3.max(x)])
                    .range([canvasWidth/2, canvasWidth]);
var heightScaleObs = d3.scaleLinear()
                    .domain([d3.min(obstacleLower.map((d) => d.y)),d3.max(obstacleUpper.map((d) => d.y))])
                    .range([canvasHeight/1.5,canvasHeight/3]);
// keep track of the velocity poits
let velocityPoints = [];
// necessary sliders points
var sliderRange = [0, 1/4, 2/4, 3/4, 1];
var fillOpacity = 1;
// for fill Opacity
var fillOpacityScale = d3.scaleLinear()
                    .domain([ sliderRange[0], sliderRange[1]])
                    .range([0.0, 5.0]);
// crossSectionVisibiliyu
let crossSectionVisible = false;