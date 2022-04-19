//To calculate the profile of the graph
function u(x,h,k,c){
    let L = 1;
    let x0 = 1;
    return c*L/(1 + Math.exp(-k*(x - x0))) + h;
}
//calculate velocity state
function velocityPath(x0 = 0){
    let num = 20;
    let minLen = dist*1;
    let maxLen = dist*5;
    let pow = 1;
    let pow2 = 1;

    let lenFactor = (maxLen - minLen)/Math.pow(num - 1,pow2);
    let posFactor = (totalLen + startPos - maxLen)/Math.pow(num - 1,pow);
    let vecLen = [...Array(num).keys()].map((d) => (Math.pow(d,1.2)*lenFactor + minLen));
    // let lenMax = 0.2;
    // let dist2 = lenMax/num;
    return [...Array(3*num).keys()].map( (d) => {
            let dTemp = d;
            d = d%num;
            let sepAtd = Math.pow(d+1,pow)*posFactor - Math.pow(d,pow)*posFactor;
            let dNew = (Math.pow(d,pow)*posFactor) + (x0 % sepAtd);
            let firstIndex = Math.min(bisect(x,dNew), totalNum - 1);
            let lastIndex = Math.min(bisect(x,dNew + vecLen[d]), totalNum - 1);
            if(dTemp<num)
                    return {
                            x1: dataVel.slice(0,totalNum)[firstIndex].x,
                            x2: dataVel.slice(0,totalNum)[lastIndex].x,
                            y1: dataVel.slice(0,totalNum)[firstIndex].y,
                            y2: dataVel.slice(0,totalNum)[lastIndex].y
                    }
            else if(dTemp<2*num)
                    return {
                            x1: dataVel.slice(totalNum,2*totalNum)[firstIndex].x,
                            x2: dataVel.slice(totalNum,2*totalNum)[lastIndex].x,
                            y1: dataVel.slice(totalNum,2*totalNum)[firstIndex].y,
                            y2: dataVel.slice(totalNum,2*totalNum)[lastIndex].y
                    }
            else
                    return {
                            x1: dataVel.slice(2*totalNum,3*totalNum)[firstIndex].x,
                            x2: dataVel.slice(2*totalNum,3*totalNum)[lastIndex].x,
                            y1: dataVel.slice(2*totalNum,3*totalNum)[firstIndex].y,
                            y2: dataVel.slice(2*totalNum,3*totalNum)[lastIndex].y
                    }
    }
);
}
function createDataVel(){
    let dataVel0 = x.map( (d) => ({x: d, y: (u(d,-0.3,5,1) + u(d,+0.3,8,0.6))/2}));
    let dataVel1 = x.map( (d) => ({x: d, y: ((u(d,-0.3,5,1) + u(d,+0.3,8,0.6))/2 + u(d,-0.3,5,1))/2}));
    let dataVel2 = x.map( (d) => ({x: d, y: ((u(d,-0.3,5,1) + u(d,+0.3,8,0.6))/2 + u(d,+0.3,8,0.6))/2}));
    return dataVel0.concat(dataVel1, dataVel2);
}
function createSection(value = sliderStartPos, width = sectionWidth){
    let x1 = [...Array(width).keys()].map( d => (value + d*dist));
    let x2 = [...Array(width).keys()].map( d => (value + d*dist)).reverse();
    let xSection = x1.concat(x2);
    return xSection.map((d,i) => ({x: d, y: (i<width)?u(d,-0.3,5,1):u(d,+0.3,8,0.6)}));
}
function createPressSection(){
    let x1 = [...Array(totalNum).keys()].map( d => (d*dist) + startPos);
    let x2 = [...Array(totalNum).keys()].map( d => (d*dist) + startPos).reverse();
    let xSection = x1.concat(x2);
    return xSection.map((d,i) => ({x: d, y: (i<totalNum)?u(d,-0.3,5,1):u(d,+0.3,8,0.6)}));
}
//x=position, y=height, u=y(x)
let totalNum = 201;
let totalLen = 1;
var startPos = 0.5;

let sliderStartPos = 0.53;
let sliderEndPos = 0.56;
let sliderWidth = totalLen - sectionWidthLen + startPos; 

let dist = totalLen/(totalNum-1);
var x = [...Array(totalNum).keys()].map( d => (d*dist) + startPos);
var dataLower = x.map( (d) => ({x: d, y: u(d,-0.3,5,1)}));
var dataUpper = x.map( (d) => ({x: d, y: u(d,+0.3,8,0.6)}));

var dataVel = createDataVel();
var bisect = d3.bisector(d => d).left;
console.log(dataVel.slice(20,40));
//create a section of pipe within x and x+t
var sectionWidthLen = (1.4 - 0.5);
var sectionWidth = parseInt(sectionWidthLen*totalNum/totalLen);
var dataSection = createSection();

var sectionWidthLenInitial = (0);
var sectionWidthInital = parseInt(sectionWidthLenInitial*totalNum/totalLen);
var dataSectionInitial = createSection(startPos,0);

var sectionWidthLenFinal = (0);
var sectionWidthFinal = parseInt(sectionWidthLenFinal*totalNum/totalLen);
var dataSectionFinal = createSection(startPos + sectionWidthLen,0);
//create pressure section
var dataPressSection = createPressSection();
//canvas dims
var canvasWidth = window.innerWidth/2;
var canvasHeight = window.innerHeight/1.5;
var graphOffeset = 50;
//define the entire canvas(right side)
var canvas = d3.select("#system")
            .attr("width",canvasWidth)
            .attr("height",canvasHeight)
            .style("overflow","visible");
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
//velocity state
var velocityState = velocityPath();
//graph
var graphXOffset = 40;
var graphYOffset = 30;
var graphWidth = canvasWidth;
var graphHeight = canvasHeight;
// var graphBckGrnd = canvas.append("g")
//                 .attr("transform","translate(0" + "," + (graphYOffset-20) + ")")
//                 .append("rect")
//                 .attr("width", graphWidth)
//                 .attr("height", graphHeight)
//                 .attr("fill", "aliceblue")
//                 .attr("stroke", "black")
//                 .attr("stroke-width", "3px");
//h and x axis
var axisX = d3.axisBottom(widthScale)
        .ticks(5);

canvas.append("g")
    .attr("transform","translate(" + graphXOffset +"," + (canvasHeight/2 + graphYOffset + 60) + ")")
    .attr("class", "xAxis")
    .call(axisX);
canvas.append("text")
    .attr("text-anchor", "end")
    .attr("x", canvasWidth/2 - graphOffeset/2)
    .attr("y", (canvasHeight/2+graphYOffset) + 30)
    .text("Position");

//plot
var plotLower = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".plot")
        .data([dataLower])
        .enter()
            .append("path")
            .attr("class", "plot")
            .attr("d",line)
            .attr("fill","none")
            .attr("stroke", "red")
            .attr("stroke-width", 2);

var plotUpper = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".plot")
        .data([dataUpper])
        .enter()
            .append("path")
            .attr("class", "plot")
            .attr("d",line)
            .attr("fill","none")
            .attr("stroke", "red")
            .attr("stroke-width", 2);

var plotSection = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".plotSection")
        .data([dataSection])
        .enter()
            .append("path")
            .attr("class", "plotSection")
            .attr("d",line)
            .attr("fill","grey")
            .attr("stroke", "black")
            .attr("stroke-width", 1).style("opacity", "50%");

var plotSectionInital = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".plotSectionInitial")
        .data([dataSectionInitial])
        .enter()
            .append("path")
            .attr("class", "plotSectionInitial")
            .attr("d",line)
            .attr("fill","yellow")
            .attr("stroke", "black")
            .attr("stroke-width", 1).style("opacity", "50%");

var plotSectionFinal = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".plotSectionFinal")
        .data([dataSectionFinal])
        .enter()
            .append("path")
            .attr("class", "plotSectionFinal")
            .attr("d",line)
            .attr("fill","green")
            .attr("stroke", "black")
            .attr("stroke-width", 1).style("opacity", "50%");
//pressure graient
let deepBlue = "#3b15a3";
let lightBlue = "#adbeff";
var pressureGradient = canvas.append("defs").append("linearGradient")
        .attr("id", "pressGradient")
        .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
pressureGradient.append("stop")
    .attr("offset", "0%").style("stop-color", deepBlue).style("stop-opacity", "0.9")
pressureGradient.append("stop")
    .attr("offset", "100%").style("stop-color", lightBlue).style("stop-opacity", "0.01");
//pressure section
// var plotPressSection = canvas.append("g")
//         .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
//         .selectAll(".plotSection")
//         .data([dataPressSection])
//         .enter()
//                 .append("path")
//                 .attr("class", "plotSection")
//                 .attr("d",line)
//                 .attr("fill","url(#pressGradient)")
//                 .attr("stroke", "black")
//                 .attr("stroke-width", 1);
//velocity vectors
var plotVelocity = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + (graphYOffset) + ")")
    .selectAll(".plotVelocity")
    .data(velocityState)
    .enter()
            .append("line")
            .attr("class", "plotVelocity")
            .attr("x1", d => widthScale(d.x1))
            .attr("x2", d => widthScale(d.x2))
            .attr("y1", d => heightScale(d.y1))
            .attr("y2", d => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "green")
            .attr("stroke-width", 2).style("opacity", "25%");
var plotPoint = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + (graphYOffset) + ")")
    .selectAll(".plotPoint")
    .data(velocityState)
    .enter()
            .append("circle")
            .attr("class", "plotPoint")
            .attr("cx",d => widthScale(d.x1)).attr("cy", d => heightScale(d.y1))
            .attr("r", 2).attr("fill", "black").style("opacity", "25%");
//create the slider
var slider = d3
.sliderBottom()
.min(sliderStartPos)
.max(sliderEndPos)
.width(widthScale(totalLen + startPos) - graphOffeset)
.ticks(5)
.default(0);
//call slider
canvas.append("g").attr("class","moveSlider")
.attr("transform", "translate(" + graphXOffset + "," + heightScale(-1) + ")")
.call(slider);

//message
canvas.append("g")
        .attr("transform", "translate(" + (graphXOffset) + "," + (heightScale(-1)+60) + ")")
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text("Drag this slider to see variation in parameters, P,v and h, at differnt position, x!")
        .style("fill","rgb(73, 7, 134)")
        .style("font-size","2.5vh");
//line(dashed)
var lineBase = -0.50;
var index = bisect(x,sliderStartPos);
//stactic inital state
canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".dataLine")
    .data([{x1: dataVel.slice(0,totalNum)[index].x, y1: lineBase,
    x2: dataVel.slice(0,totalNum)[index].x, y2: dataVel.slice(0,totalNum)[index].y}])
    .enter()
            .append("line")
            .attr("class", "dataLine")
            .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",3);
canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".dataLine")
    .data([{x1: dataVel.slice(0,totalNum)[index + sectionWidth].x, y1: lineBase,
    x2: dataVel.slice(0,totalNum)[index + sectionWidth].x, y2: dataVel.slice(0,totalNum)[index + sectionWidth].y}])
    .enter()
            .append("line")
            .attr("class", "dataLine")
            .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",3).style;
canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("circle")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x))
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y)).attr("r", 2).attr("fill","none")
            .attr("stroke", "red").attr("stroke-width",1);
canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("circle")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidth].x) - 3)
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidth].y)).attr("r", 2).attr("fill","none")
            .attr("stroke", "red").attr("stroke-width",1);   
//removed section

//added section

//
var dataLine1 = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".dataLine")
    .data([{x1: dataVel.slice(0,totalNum)[index].x, y1: lineBase,
    x2: dataVel.slice(0,totalNum)[index].x, y2: dataVel.slice(0,totalNum)[index].y}])
    .enter()
            .append("line")
            .attr("class", "dataLine")
            .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",3);
var dataLine2 = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".dataLine")
    .data([{x1: dataVel.slice(0,totalNum)[index + sectionWidth].x, y1: lineBase,
    x2: dataVel.slice(0,totalNum)[index + sectionWidth].x, y2: dataVel.slice(0,totalNum)[index + sectionWidth].y}])
    .enter()
            .append("line")
            .attr("class", "dataLine")
            .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",3);
//Graph dx indicator
var dataLine1dx = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".dataLine")
    .data([{
            x1: dataVel.slice(0,totalNum)[index].x, 
            y1: dataVel.slice(0,totalNum)[index].y/2,
            x2: dataVel.slice(0,totalNum)[index].x + (sliderStartPos - sliderStartPos)*totalNum/totalLen, 
            y2: dataVel.slice(0,totalNum)[index].y/2}])
    .enter()
            .append("line")
            .attr("class", "dataLine")
            .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",3);
var dataLine2dx = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".dataLine")
    .data([{
            x1: dataVel.slice(0,totalNum)[index + sectionWidth].x, 
            y1: dataVel.slice(0,totalNum)[index + sectionWidth].y/2,
            x2: dataVel.slice(0,totalNum)[index + sectionWidth].x + (sliderStartPos - sliderStartPos)*totalNum/totalLen, 
            y2: dataVel.slice(0,totalNum)[index + sectionWidth].y/2}])
    .enter()
            .append("line")
            .attr("class", "dataLine")
            .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",3);
//pointer(circle)
var dataPointer1 = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("circle")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x))
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y)).attr("r", 2).attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1);
var dataPointer2 = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("circle")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidth].x) - 3)
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidth].y)).attr("r", 2).attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1);
//Area section
var A1 = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("ellipse")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x) - 3)
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y))
            .attr("rx", 30)
            .attr("ry", -2*(heightScale(dataVel.slice(0,totalNum)[index].y) - 
                        heightScale(dataVel.slice(totalNum,2*totalNum)[index].y)))
            .attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1).attr("stroke-dasharray",3);

var A2 = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("ellipse")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidth].x) - 3)
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidth].y))
            .attr("rx", 10)
            .attr("ry", -2*(heightScale(dataVel.slice(0,totalNum)[index + sectionWidth].y) - 
                        heightScale(dataVel.slice(totalNum,2*totalNum)[index + sectionWidth].y)))
            .attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1).attr("stroke-dasharray",3);
//set forces that move
let forcePositionsLeft = [
{x: widthScale(dataVel.slice(0,totalNum)[index].x), y: heightScale(dataVel.slice(0,totalNum)[index].y)},
{x: widthScale(dataVel.slice(0,totalNum)[index].x), y: heightScale(dataVel.slice(totalNum, 2*totalNum)[index].y)},
{x: widthScale(dataVel.slice(0,totalNum)[index].x), y: heightScale(dataVel.slice(2*totalNum ,3*totalNum)[index].y)}
];
let forcePositionsRight = [
{x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidth].x), y: heightScale(dataVel.slice(0,totalNum)[index + sectionWidth].y)},
{x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidth].x), y: heightScale(dataVel.slice(totalNum, 2*totalNum)[index + sectionWidth].y)},
{x: widthScale(dataVel.slice(0,totalNum)[index + sectionWidth].x), y: heightScale(dataVel.slice(2*totalNum ,3*totalNum)[index + sectionWidth].y)}
];

var forceVectorLeft = canvas.append("g").attr("class", "forceLeft")
            .attr("transform","translate(" + (graphXOffset - 20) + "," + graphYOffset + ")")
            .selectAll(".forceVectorLeft")
            .data(forcePositionsLeft)
            .enter()
                .append("g")
                .attr("transform", (d) => "translate(" + d.x + ","+ d.y +")")
                .append("path")
                .attr("class", ".forceVectorLeft")
                .attr("d", "M 0 0 H 20 L 15 -5 V 5 L 20 0")
                .attr("stroke", "black")
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 4)
                .style("animation", "forceMoveLeft 2s infinite");

// forceVectorLeft.transition()
//                     .duration(1000)
//                     .attr("transform","translate(10,0)")
//                     .each("end", function(){
//                         alert("hey");
//                     });
var forceVectorRight = canvas.append("g").attr("class", "forceRight")
            .attr("transform","translate(" + (graphXOffset) + "," + graphYOffset + ")")
            .selectAll(".forceVectorLeft")
            .data(forcePositionsRight)
            .enter()
                .append("g")
                .attr("transform", (d) => "translate(" + d.x + ","+ d.y +")")
                .append("path")
                .attr("class", ".forceVectorLeft")
                .attr("d", "M 20 0 H 0 L 5 -5 V 5 L 0 0")
                .attr("stroke", "black")
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 4)
                .style("animation", "forceMoveRight 2s infinite");

//display text on graph
//the text on the graph
var graphText = ["ds1","F1","F2","ds2"];
var text = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".graphText")
    .data([0,1,2,3])
    .enter()
            .append("text")
            .style("font-size", "1rem")
            .attr("x", (d) =>
                    (d<3)?widthScale(sliderStartPos):widthScale(sliderStartPos + sectionWidthLen)
            )
            .attr("y", function(d){
                    let yPos = heightScale(-0.5);
                    switch(d){
                            case 0:
                            case 3:
                                    yPos = heightScale(-0.5);
                                    break;
                            case 1:
                            case 4:
                                    yPos = heightScale(-0.3);
                                    break;
                            case 2:
                                    yPos = heightScale(dataVel.slice(0,totalNum)[index].y - 0.1);
                                    break;
                            case 5:
                                    yPos = heightScale(dataVel.slice(0,totalNum)[bisect(x, sliderStartPos + sectionWidthLen)].y - 0.1);
                                    break;
                    }
                    return yPos;
            })
            .attr("dy", ".35em")
            .text( (d) => graphText[d])
            .style("fill", "black").style("visibility","hidden");
//slider drag event
var bisect = d3.bisector(d => d).left;

function setValues(value){
    index = bisect(x,value);
}
function setSection(value){
    dataSection = createSection(value);
    plotSection.data([dataSection]).attr("d",line);

    sectionWidthInital = parseInt((value - sliderStartPos + 0.008)*totalNum/totalLen);
    dataSectionInitial = createSection(sliderStartPos, sectionWidthInital);
    plotSectionInital.data([dataSectionInitial]).attr("d", line);

    sectionWidthFinal  = parseInt((value - sliderStartPos)*totalNum/totalLen);
    dataSectionFinal = createSection(sliderStartPos + sectionWidthLen, sectionWidthFinal);
    plotSectionFinal.data([dataSectionFinal]).attr("d", line);
}
function setDataPointer(){
    dataPointer1.attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x))
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y));
    dataPointer2.attr("cx",widthScale(dataVel.slice(0,totalNum)[Math.min(index + sectionWidth, totalNum - 1)].x) - 3)
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[Math.min(index + sectionWidth, totalNum - 1)].y));
}
function setDataLine(){
    dataLine1.data([{
            x1: dataVel.slice(0,totalNum)[index].x,
            y1: lineBase,
            x2: dataVel.slice(0,totalNum)[index].x,
            y2: dataVel.slice(0,totalNum)[index].y
            }])
            .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2));

    dataLine2.data([{
            x1: dataVel.slice(0,totalNum)[Math.min(index + sectionWidth, totalNum - 1)].x, 
            y1: lineBase,
            x2: dataVel.slice(0,totalNum)[Math.min(index + sectionWidth, totalNum - 1)].x, 
            y2: dataVel.slice(0,totalNum)[Math.min(index + sectionWidth, totalNum - 1)].y
            }])
            .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2));
}
function setDispLine(value){
    let startInd = bisect(x,sliderStartPos);
    dataLine1dx.data([{
            x1: dataVel.slice(0,totalNum)[startInd].x, 
            y1: -0.3,
            x2: dataVel.slice(0,totalNum)[startInd].x + (value - sliderStartPos),
            y2: -0.3}])
                    .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
                    .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2));

    dataLine2dx.data([{
            x1: dataVel.slice(0,totalNum)[startInd + sectionWidth].x, 
            y1: dataVel.slice(0,totalNum)[startInd + sectionWidth].y/2,
            x2: dataVel.slice(0,totalNum)[startInd + sectionWidth].x + (value - sliderStartPos), 
            y2: dataVel.slice(0,totalNum)[startInd + sectionWidth].y/2}])
                    .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
                    .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2));
    }
function setForce(){
let frameMulti = 500;
d3.select(".forceLeft").attr("transform", "translate(" + (frame*frameMulti + (graphXOffset - 20)) + "," + graphYOffset + ")");
d3.select(".forceRight").attr("transform", "translate(" + (frame*frameMulti + (graphXOffset)) + "," + graphYOffset + ")");
}
function setArea(){
A1
.attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x) - 3)
.attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y))
.attr("ry", -2*(heightScale(dataVel.slice(0,totalNum)[index].y) - 
heightScale(dataVel.slice(totalNum,2*totalNum)[index].y)));

A2
.attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidth].x) - 3)
.attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidth].y))
.attr("ry", -2*(heightScale(dataVel.slice(0,totalNum)[index + sectionWidth].y) - 
heightScale(dataVel.slice(totalNum,2*totalNum)[index + sectionWidth].y)));
}
//
let frameInter = d3.scaleLinear()
    .domain([0.53, 0.56])
    .range([0, 0.05]);
function setAnim(value){
frame = frameInter(value);
moveParticles();
}
//slider drag-right
slider.on("onchange", (value)=>{
    setValues(value);
    setSection(value);

    setDataPointer();
    setDataLine();
    setDispLine(value);

    setAnim(value);
    setForce();
    setArea();
});

let frame = 0;
let frameSpeed = 0.0005;
function moveParticles(){
    velocityState = velocityPath(frame);
    plotVelocity.data(velocityState)
            .attr("x1", d => widthScale(d.x1))
            .attr("x2", d => widthScale(d.x2))
            .attr("y1", d => heightScale(d.y1))
            .attr("y2", d => heightScale(d.y2));
    plotPoint.data(velocityState)
            .attr("cx",d => widthScale(d.x1)).attr("cy", d => heightScale(d.y1));
}
function resetAnim(){
    frame = 0;
}
function showAni(){
    plotVelocity.style("visibility","visible");
    plotPoint.style("visibility","visible");
}
resetAnim();













// var axisH = d3.axisLeft(heightScale)
//             .ticks(5);

// canvas.append("g")
//         .attr("transform", "translate(" + graphXOffset + "," + (graphYOffset + 10) + ")")
//         .attr("class", "yAxis")
//         .call(axisH);





















//value(text)
// var textXOffset = 15;
// var textYOffsetPos = 15;
// var textYOffsetTemp = 35;
// var textBckGndWidth = 70;
// var textBckGndHeight = 45;

// var textBackGround = canvas.append("g")
//                 .attr("transform","translate(" + (graphXOffset+5) + "," + (graphYOffset+5) + ")")
//                 .append("rect")
//                 .attr("x", widthScale(dataLower[index].x))
//                 .attr("y", heightScale(dataLower[index].y))
//                 .attr("width", textBckGndWidth)
//                 .attr("height", textBckGndHeight)
//                 .attr("fill", "black")
//                 .style("opacity", "50%");

// var dataTextPos = canvas.append("g")
//                 .attr("transform","translate(" + (graphXOffset+textXOffset) + "," + (graphYOffset+textYOffsetPos) + ")")
//                 .append("text")
//                 .attr("x", widthScale(dataLower[index].x))
//                 .attr("y", heightScale(dataLower[index].y))
//                 .attr("dy", ".35em")
//                 .text("x: " + dataLower[index].x.toFixed(2))
//                 .style("fill", "white");

// var dataTextTemp = canvas.append("g")
//                 .attr("transform","translate(" + (graphXOffset+textXOffset) + "," + (graphYOffset+textYOffsetTemp) + ")")
//                 .append("text")
//                 .attr("x", widthScale(dataLower[index].x))
//                 .attr("y", heightScale(dataLower[index].y))
//                 .attr("dy", ".35em")
//                 .text("T: " + dataLower[index].y.toFixed(2))
//                 .style("fill", "white");
//time data text
// var timeTextBckGndWidth = 100;
// var timeTextBckGndHeight = 30;
// var timeTextBackGround = canvas.append("g")
//                 .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
//                 .append("rect")
//                 .attr("x", widthScale(1.75))
//                 .attr("y", heightScale(2.5))
//                 .attr("width", timeTextBckGndWidth)
//                 .attr("height", timeTextBckGndHeight)
//                 .attr("fill", "black");

// var dataTextTime = canvas.append("g")
//                 .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
//                 .append("text")
//                 .attr("x", widthScale(1.8))
//                 .attr("y", heightScale(2.2))
//                 .attr("dy", ".35em")
//                 .text("t: " + d3.select(".slider").property("value") + "s")
//                 .style("fill", "white");





// canvas.append("text")
//     .attr("text-anchor", "end")
//     .attr("transform", "rotate(-90)")
//     .attr("y", graphXOffset/2)
//     .attr("x", -graphYOffset)
//     .text("Temperature");















// var sliderPosToGraph = d3.scaleLinear()
//             .domain([pipeXPos, (pipeXPos + pipeLength)])
//             .range([d3.min(x), d3.max(x)]);
// var dragHandler = d3.drag()
//     .on("drag", function (event) {
//         d3.select(this)
//             .attr("transform", "translate(" + (event.x >= pipeXPos? ((event.x <= pipeXPos+pipeLength)?
//              event.x : pipeXPos+pipeLength): pipeXPos) +
//              "," + (pipeYPos + pipeHeight) + ")");
//         //move the line
//         let sliderXPos = sliderPosToGraph(getXtranslatePos(d3.select(this).attr("transform")));

//         let index = bisect(x, sliderXPos);
//         dataLine.data([[{x: data[index].x, y: 0},{x: data[index].x, y: data[index].y},{x: 0, y: data[index].y}]])
//         .attr("d",line);
//         //move the pointer
//         dataPointer.attr("cx", widthScale(data[index].x))
//                 .attr("cy", heightScale(data[index].y));
//         //move the text
//         textBackGround.attr("x", widthScale(data[index].x))
//                 .attr("y", heightScale(data[index].y));
//         dataTextPos.attr("x", widthScale(data[index].x))
//                 .attr("y", heightScale(data[index].y))
//                 .text("x: " + data[index].x.toFixed(2));
//         dataTextTemp.attr("x", widthScale(data[index].x))
//                 .attr("y", heightScale(data[index].y))
//                 .text("T: " + data[index].y.toFixed(2));
//     });
// dragHandler(slider);

//time axis slider control
// d3.select(".slider").on("input", () =>{
//     let time = d3.select(".slider").property("value");
//     let y = x.map( d => u(d,time));
//     data = x.map( (d) => ({x: d, y: u(d,time)}));

//     canvas.selectAll(".plot")
//         .data([data])
//         .attr("d",line);

//     //move the line
//     let sliderXPos = sliderPosToGraph(getXtranslatePos(d3.select(".xSlider").attr("transform")));

//     let index = bisect(x, sliderXPos);
//     dataLine.data([[{x: data[index].x, y: 0},{x: data[index].x, y: data[index].y},{x: 0, y: data[index].y}]])
//     .attr("d",line);
//     //move the pointer
//     dataPointer.attr("cx", widthScale(data[index].x))
//             .attr("cy", heightScale(data[index].y));
//         console.log(time);
//     //move the text
//     dataTextTime.text("t: " + time + "s");
//     textBackGround.attr("x", widthScale(data[index].x))
//             .attr("y", heightScale(data[index].y));
//     dataTextPos.attr("x", widthScale(data[index].x))
//             .attr("y", heightScale(data[index].y))
//             .text("x: " + data[index].x.toFixed(2));
//     dataTextTemp.attr("x", widthScale(data[index].x))
//             .attr("y", heightScale(data[index].y))
//             .text("T: " + data[index].y.toFixed(2));
// });