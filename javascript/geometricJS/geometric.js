//selected parameter
var paraState = [false,false,false,false];//state of whats selected
var paraBtn = ['velocity', 'force', 'height','flow'];//button array
let unselectColor = "rgba(99, 100, 116, 0.75)";//color of unselected button
let selectColor = "#2531d8";//color of selected button
//calls whenever any button is clcked
for(let i=0; i<4; i++){
        d3.select("#" + paraBtn[i]).on('change', function(){
                paraState[i] = !paraState[i];
                setvisibility(i);
        });
}
function setvisibility(i){
        switch(i){
                case 0:
                        (!paraState[i])?resetAnim():showAni();
                        break;
                case 1:
                        if(paraState[i])
                                plotPressSection.style("visibility","visible");
                        else
                                plotPressSection.style("visibility","hidden");
                        break;
                case 2:
                        if(paraState[i])
                        {
                                dataLine1.style("visibility","visible");
                                dataLine2.style("visibility","visible");
                        }
                        else{
                                dataLine1.style("visibility","hidden");
                                dataLine2.style("visibility","hidden");
                        };
                        break;
                case 3:
                        if(paraState[i])
                        {
                                d3.select("#" + paraBtn[i]).html("Play");
                        }
                        else{
                                d3.select("#" + paraBtn[i]).html("Pause");
                        };
                        break;
        }
}
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
        let posFactor = (totalLen - maxLen)/Math.pow(num - 1,pow);
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
function createSection(value = 0){
        let x1 = [...Array(sectionWidth).keys()].map( d => (value + d*dist));
        let x2 = [...Array(sectionWidth).keys()].map( d => (value + d*dist)).reverse();
        let xSection = x1.concat(x2);
        return xSection.map((d,i) => ({x: d, y: (i<sectionWidth)?u(d,-0.3,5,1):u(d,+0.3,8,0.6)}));
}
function createPressSection(){
        let x1 = [...Array(totalNum).keys()].map( d => (d*dist));
        let x2 = [...Array(totalNum).keys()].map( d => (d*dist)).reverse();
        let xSection = x1.concat(x2);
        return xSection.map((d,i) => ({x: d, y: (i<totalNum)?u(d,-0.3,5,1):u(d,+0.3,8,0.6)}));
}
//x=position, y=height, u=y(x)
let totalNum = 201;
let totalLen = 2;
let dist = totalLen/(totalNum-1);
var x = [...Array(totalNum).keys()].map( d => (d*dist));
var dataLower = x.map( (d) => ({x: d, y: u(d,-0.3,5,1)}));
var dataUpper = x.map( (d) => ({x: d, y: u(d,+0.3,8,0.6)}));

var dataVel = createDataVel(); 
var bisect = d3.bisector(d => d).left;
console.log(dataVel.slice(20,40));
//create a section of pipe within x and x+t
var sectionWidth = 50;
var dataSection = createSection();
//create pressure section
var dataPressSection = createPressSection();
//canvas dims
var canvasWidth = window.innerWidth/2;
var canvasHeight = window.innerHeight/2;
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
var graphBckGrnd = canvas.append("g")
                .attr("transform","translate(0" + "," + (graphYOffset-20) + ")")
                .append("rect")
                .attr("width", graphWidth)
                .attr("height", graphHeight)
                .attr("fill", "aliceblue")
                .attr("stroke", "black")
                .attr("stroke-width", "3px");
//h and x axis
var axisX = d3.axisBottom(widthScale)
            .ticks(5);

canvas.append("g")
        .attr("transform","translate(" + graphXOffset +"," + (canvasHeight/2 + graphYOffset + 10) + ")")
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
var plotPressSection = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".plotSection")
        .data([dataPressSection])
        .enter()
                .append("path")
                .attr("class", "plotSection")
                .attr("d",line)
                .attr("fill","url(#pressGradient)")
                .attr("stroke", "black")
                .attr("stroke-width", 1).style("visibility", "hidden");
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
                .attr("stroke-width", 2);
var plotPoint = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset) + ")")
        .selectAll(".plotPoint")
        .data(velocityState)
        .enter()
                .append("circle")
                .attr("class", "plotPoint")
                .attr("cx",d => widthScale(d.x1)).attr("cy", d => heightScale(d.y1))
                .attr("r", 2).attr("fill", "black");
//create the slider
let sliderWidth = totalLen - sectionWidth*dist; 
var slider = d3
    .sliderBottom()
    .min(0)
    .max(sliderWidth)
    .width(widthScale(totalLen) - graphOffeset)
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
var index = 0;
var dataLine1 = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".dataLine")
        .data([{x1: dataVel.slice(0,totalNum)[index].x, y1: -0.35,
        x2: dataVel.slice(0,totalNum)[index].x, y2: dataVel.slice(0,totalNum)[index].y}])
        .enter()
                .append("line")
                .attr("class", "dataLine")
                .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
                .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
                .attr("fill","none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray",3).style("visibility", "hidden");
var dataLine2 = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".dataLine")
        .data([{x1: dataVel.slice(0,totalNum)[index + sectionWidth].x, y1: -0.35,
        x2: dataVel.slice(0,totalNum)[index + sectionWidth].x, y2: dataVel.slice(0,totalNum)[index + sectionWidth].y}])
        .enter()
                .append("line")
                .attr("class", "dataLine")
                .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
                .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
                .attr("fill","none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray",3).style("visibility", "hidden");;

//pointer(circle)
var dataPointer1 = canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("circle")
                .attr("class", ".dataPointer")
                .attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x))
                .attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y)).attr("r", 6).attr("fill","none")
                .attr("stroke", "black").attr("stroke-width",5);
var dataPointer2 = canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("circle")
                .attr("class", ".dataPointer")
                .attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidth].x) - 3)
                .attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidth].y)).attr("r", 6).attr("fill","none")
                .attr("stroke", "black").attr("stroke-width",5);

//slider drag event
var bisect = d3.bisector(d => d).left;

function setValues(value){
        index = bisect(x,value);
}
function setSection(value){
        dataSection = createSection(value);
        plotSection.data([dataSection]).attr("d",line);
}
function setDataPointer(){
        dataPointer1.attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x))
                .attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y));
        dataPointer2.attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidth].x) - 3)
                .attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidth].y));
}
function setDataLine(){
        dataLine1.data([{x1: dataVel.slice(0,totalNum)[index].x, y1: -0.35,
                x2: dataVel.slice(0,totalNum)[index].x, y2: dataVel.slice(0,totalNum)[index].y}])
                .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
                .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2));

        dataLine2.data([{x1: dataVel.slice(0,totalNum)[index + sectionWidth].x, y1: -0.35,
                x2: dataVel.slice(0,totalNum)[index + sectionWidth].x, y2: dataVel.slice(0,totalNum)[index + sectionWidth].y}])
                .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
                .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2));
}
//set parameter values
function setTable(value){
        let p1 = value;
        let p2 = value - 30;
        let h1 = value;
        let h2 = value + 30;
        let v1 = Math.sqrt(150 - p1 - h1);
        let v2 = Math.sqrt(150 - p2 - h2);

        d3.select("#p1").html(p1.toFixed(2));
        d3.select("#h1").html(h1.toFixed(2));
        d3.select("#v1").html(v1.toFixed(2));
        d3.select("#p2").html(p1.toFixed(2));
        d3.select("#h2").html(h2.toFixed(2));
        d3.select("#v2").html(v2.toFixed(2));
}
//slider drag-right
slider.on("onchange", (value)=>{
        setValues(value);
        setSection(value);
        setTable(value);

        setDataPointer();
        setDataLine();
});
function animate(){
        if(paraState[0] && paraState[3]){
                frame += frameSpeed;
                moveParticles();
        }
        requestAnimationFrame(animate);
}
let frame = 0;
let frameSpeed = 0.005;
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
        plotVelocity.style("visibility","hidden");
        plotPoint.style("visibility","hidden");
}
function showAni(){
        plotVelocity.style("visibility","visible");
        plotPoint.style("visibility","visible");
}
resetAnim();
animate();













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