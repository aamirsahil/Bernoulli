function setValues(value){
    index = bisect(x,value);
}
function setSection(value){
    dataSection = createSection(value);
    plotSection.data([dataSection]).attr("d",line);

    sectionWidthInital = parseInt((value - sliderStartPos + 0.008)*totalNum/totalLen);

    sectionWidthFinal  = parseInt((value - sliderStartPos)*totalNum/totalLen);
}
function setDataLine(){
    dataLine1.data([{
            x1: dataVel.slice(0,totalNum)[index].x,
            y1: lineBase,
            x2: dataVel.slice(0,totalNum)[index].x,
            y2: dataLower[index].y
            }])
            .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2));

    dataLine2.data([{
            x1: dataVel.slice(0,totalNum)[Math.min(index + sectionWidthIndex, totalNum - 1)].x, 
            y1: lineBase,
            x2: dataVel.slice(0,totalNum)[Math.min(index + sectionWidthIndex, totalNum - 1)].x, 
            y2: dataLower[Math.min(index + sectionWidthIndex, totalNum - 1)].y
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
            x1: dataVel.slice(0,totalNum)[startInd + sectionWidthIndex].x, 
            y1: dataVel.slice(0,totalNum)[startInd + sectionWidthIndex].y/2,
            x2: dataVel.slice(0,totalNum)[startInd + sectionWidthIndex].x + (value - sliderStartPos), 
            y2: dataVel.slice(0,totalNum)[startInd + sectionWidthIndex].y/2}])
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
    .attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) - 3)
    .attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].y))
    .attr("ry", -2*(heightScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].y) - 
    heightScale(dataVel.slice(totalNum,2*totalNum)[index + sectionWidthIndex].y)));
}

function setAnim(value){
    frame = frameInter(value);
    moveParticles();
}
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
function seTdsText(value){
    if(value == sliderStartPos){
        d3.selectAll(".ds").data([1,2])
            .attr("visibility", "hidden");
    }
    else{
        d3.selectAll(".ds").data([1,2])
            .attr("visibility", "visible")
            .attr("x", (d) => (d==1)?widthScale(dataVel.slice(0,totalNum)[index].x) + 38
            :widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) + 38);
    }
}