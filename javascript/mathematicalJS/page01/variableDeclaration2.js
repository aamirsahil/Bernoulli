//data to plot graph
var x = [...Array(totalNum).keys()].map( d => (d*dist) + startPos);
var dataLower = x.map( (d) => ({x: d, y: u(d,-0.3,5,1)}));
var dataUpper = x.map( (d) => ({x: d, y: u(d,+0.3,8,0.6)}));
//keep track of left most point of section
var index = bisect(x,sliderStartPos);
//create a section of pipe within x and x+t
var dataSection = createSection();
//data for the yellow section
var dataSectionInitial = createSection(startPos,0);
//data for the red section
var dataSectionFinal = createSection(startPos + sectionWidthLen,0);
//point states
var dataVel = createDataVel();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//graph offset variables
var graphOffeset = 50;
var graphXOffset = 40;
var graphYOffset = 30;
var graphWidth = canvasWidth;
var graphHeight = canvasHeight;
//width and height scale inside graph
var widthScale = d3.scaleLinear()
                    .domain([d3.min(x), d3.max(x)])
                    .range([0, canvasWidth - graphOffeset]);
var heightScale = d3.scaleLinear()
                    .domain([d3.min(dataLower.map((d) => d.y)),d3.max(dataUpper.map((d) => d.y))])
                    .range([canvasHeight/2,0]);
//convert a set of d to correspondig set (x,y)
var line = d3.line()
            .x( d => widthScale(d.x))
            .y( d => heightScale(d.y));
//set forces that move
let forcePositionsLeft = [
    {x: widthScale(dataVel.slice(0,totalNum)[index].x), y: heightScale(dataVel.slice(0,totalNum)[index].y)},
    {x: widthScale(dataVel.slice(0,totalNum)[index].x), y: heightScale(dataVel.slice(totalNum, 2*totalNum)[index].y)},
    {x: widthScale(dataVel.slice(0,totalNum)[index].x), y: heightScale(dataVel.slice(2*totalNum ,3*totalNum)[index].y)},

    {x: widthScale(dataVel.slice(0,totalNum)[index].x) - 20, y: heightScale(dataVel.slice(0,totalNum)[index].y) - 10},
    {x: widthScale(dataVel.slice(0,totalNum)[index].x) - 20, y: heightScale(dataVel.slice(totalNum, 2*totalNum)[index].y) - 10},
    {x: widthScale(dataVel.slice(0,totalNum)[index].x) - 20, y: heightScale(dataVel.slice(2*totalNum ,3*totalNum)[index].y) - 10},
    {x: widthScale(dataVel.slice(0,totalNum)[index].x) - 20, y: heightScale(dataVel.slice(totalNum, 2*totalNum)[index].y) + 10},

    {x: widthScale(dataVel.slice(0,totalNum)[index].x) - 35, y: heightScale(dataVel.slice(0,totalNum)[index].y)},
    {x: widthScale(dataVel.slice(0,totalNum)[index].x) - 35, y: heightScale(dataVel.slice(totalNum, 2*totalNum)[index].y)},
    {x: widthScale(dataVel.slice(0,totalNum)[index].x) - 35, y: heightScale(dataVel.slice(2*totalNum ,3*totalNum)[index].y)},
];
let forcePositionsRight = [
    {x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x), y: heightScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].y)},
    {x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x), y: heightScale(dataVel.slice(totalNum, 2*totalNum)[index + sectionWidthIndex].y)},
    {x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x), y: heightScale(dataVel.slice(2*totalNum ,3*totalNum)[index + sectionWidthIndex].y)},

    {x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) + 10, y: heightScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].y) - 10},
    {x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) + 10, y: heightScale(dataVel.slice(totalNum, 2*totalNum)[index + sectionWidthIndex].y) - 10},
    {x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) + 10, y: heightScale(dataVel.slice(2*totalNum ,3*totalNum)[index + sectionWidthIndex].y) - 10},
    {x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) + 10, y: heightScale(dataVel.slice(totalNum, 2*totalNum)[index + sectionWidthIndex].y) + 10},

];

let forceArrowParam = {opacity: ["100%", "100%", "100%",
                    "60%", "60%", "60%", "60%",
                    "40%", "40%", "40%"],
                size: [4,4,4,
                    3,3,3,3,
                    2,2,2]};
//create the slider variable
var slider = d3
    .sliderBottom()
    .min(sliderStartPos)
    .max(sliderEndPos)
    .width(widthScale(totalLen + startPos) - graphOffeset)
    .ticks(5)
    .default(0);
//velocity state
var velocityState = velocityPath();
//line(dashed)
var lineBase = -0.50;
//for moving the velocity lines
let frame = 0;
let frameSpeed = 0.0005;
//colors
let deepBlue = "#3b15a3";
let lightBlue = "#adbeff";