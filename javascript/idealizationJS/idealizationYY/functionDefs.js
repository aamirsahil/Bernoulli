d3.select("#switch").on("input", () => {
    switchSate = !switchSate;
    if(switchSate){
        obstacleText.style("visibility", "visible");
        airFoil.style("visibility", "visible");
        fluidPointsObs = createFluidPoints();
        plotFluidPointsObs.style("visibility","visible");
        plotFluidVelocityObs.style("visibility","visible");
        plotFluidPointsLinear.style("visibility","hidden");
        plotFluidVelocityLinear.style("visibility","hidden");
    }
        else{
                obstacleText.style("visibility", "hidden");
                airFoil.style("visibility", "hidden");
                fluidPointsObsLinear = createFluidPointsLinear();
                plotFluidPointsLinear.style("visibility","visible");
                plotFluidVelocityLinear.style("visibility","visible");
                plotFluidPointsObs.style("visibility","hidden");
                plotFluidVelocityObs.style("visibility","hidden");
        }
    streamText.attr("x", (switchSate)?widthScale(completeData[5][50].x):widthScale(linearData[5][50].x))
            .attr("y", (switchSate)?heightScale(completeData[5][50].y + 0.5):heightScale(linearData[5][50].y + 0.5));
streamText2.attr("x", (switchSate)?widthScale(completeData[3][50].x):widthScale(linearData[3][50].x))
            .attr("y", (switchSate)?heightScale(completeData[3][50].y + 0.5):heightScale(linearData[3][50].y + 0.5));
    if(switchSate){
            plotCompleteStreamLine.style("visibility","visible");
            plotLinearStreamLine.style("visibility","hidden");

            plotCompleteStreamLine2.style("visibility","visible");
            plotLinearStreamLine2.style("visibility","hidden");
    }
    else{
            plotLinearStreamLine.style("visibility","visible");
            plotCompleteStreamLine.style("visibility","hidden");

            plotLinearStreamLine2.style("visibility","visible");
            plotCompleteStreamLine2.style("visibility","hidden");
    }
    frame = 0;
});

function setSVGElements(length) {

    if(length < (sliderRange[4])){
    }
    else if(length > sliderRange[4] && length <= sliderRange[5]){
        resetAll(plotFluidPointsObs,plotFluidVelocityObs,plotFluidPointsLinear,plotFluidVelocityLinear,plotLinearStreamLine,plotCompleteStreamLine,streamText,
            plotLinearStreamLine2,plotCompleteStreamLine2,streamText2);
    }
    else if(length > sliderRange[5] && length <= sliderRange[6]){
        animateStart(false);
        if(switchSate){
                plotFluidPointsObs.style("visibility","visible");
                plotFluidVelocityObs.style("visibility","visible");

                plotFluidPointsLinear.style("visibility","hidden");
                plotFluidVelocityLinear.style("visibility","hidden");
            }
        else{
                plotFluidPointsLinear.style("visibility","visible");
                plotFluidVelocityLinear.style("visibility","visible");

                plotFluidPointsObs.style("visibility","hidden");
                plotFluidVelocityObs.style("visibility","hidden");
        }
    }
    else if(length > sliderRange[6] && length < sliderRange[7]){
        animateStart(true);
            //set streamLine
            if(switchSate){
                plotCompleteStreamLine.style("visibility","hidden");
                plotLinearStreamLine2.style("visibility","hidden");
            }
                    
            else{
                plotLinearStreamLine.style("visibility","hidden");
                plotLinearStreamLine2.style("visibility","hidden");
            }
                    

        streamText.style("visibility","hidden");
        streamText2.style("visibility","hidden");

    }
    else if(length > sliderRange[7] && length < sliderRange[8]){

            //set streamLine
            if(switchSate){
                plotCompleteStreamLine.style("visibility","visible");
                plotCompleteStreamLine2.style("visibility","visible");

            }
            else{
                plotLinearStreamLine.style("visibility","visible");
                plotLinearStreamLine2.style("visibility","visible");

            }
            streamText.style("visibility","visible");
            streamText2.style("visibility","visible");
        }
    else{
        d3.select(".switchContainer").style("visibility", "visible");
    }
}

function animateStart(val){
    animateOn = val;
}
function setOpacity(opacity,i,j){
    opacity = (opacity - sliderRange[i])/(sliderRange[j] - sliderRange[i])*100;
    return opacity;
}

// streamLines curved
function f(x,a = -3,d = 0,b = -1,c = 3){
    let exp = Math.pow(x-b, 2)/2/Math.pow(c, 2);
    return a*Math.exp(-exp) + d;
}
//fluid Points
function createFluidPoints(x0 = 0){
    let temp = [];
    for(let i = 0; i<streamLen; i++){
            let speed = (i<5)?0.75:1.75;
            temp.push([...Array(distData[i].num).keys()].map((d) => {
                    let x1 = d*distData[i].dist + (speed*x0)%distData[i].dist;
                    let x2 = x1 + distData[i].dist*0.5;
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
// create a set of streamLines
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
function moveParticles(){
        if(switchSate){
                fluidPointsObs = createFluidPoints(frame);
                plotFluidPointsObs.data(fluidPointsObs)
                        .attr("cx",d => d.x1).attr("cy", d => d.y1);
                plotFluidVelocityObs.data(fluidPointsObs)
                        .attr("x1", (d,i) => d.x1)
                        .attr("x2", (d,i) => d.x2)
                        .attr("y1", (d,i) => d.y1)
                        .attr("y2", (d,i) => d.y2);
        }
        else{
                fluidPointsLinear = createFluidPointsLinear(frame);
                plotFluidPointsLinear.data(fluidPointsLinear)
                        .attr("cx",d => d.x1).attr("cy", d => d.y1);
                plotFluidVelocityLinear.data(fluidPointsLinear)
                        .attr("x1", d => d.x1)
                        .attr("x2", d => d.x2)
                        .attr("y1", d => d.y1)
                        .attr("y2", d => d.y2);
        }
}

// make everything fit on resizing
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
function setMarker(i){
    let markerState = [...Array(4).keys()].map((d) => (d<=i)?blueSel:greyUnCel);
    for(let i=0;i<4;i++)
            d3.select("#marker"+(i+2)).style("fill", markerState[i]);
}

function setText(i){
    let textState = [...Array(5).keys()].map((d) => (d<=i)?"visible":"hidden");
    for(let j=0;j<5;j++)
            d3.select("#point0"+(j+1)).style("visibility", textState[j]);
}

function resetAll(plotFluidPointsObs,plotFluidVelocityObs,plotFluidPointsLinear,plotFluidVelocityLinear,plotLinearStreamLine,plotCompleteStreamLine,streamText
        ,plotLinearStreamLine2,plotCompleteStreamLine2,streamText2){

    d3.select("#point05").style("visibility", "hidden");
    plotLinearStreamLine.style("visibility", "hidden");
    plotCompleteStreamLine.style("visibility", "hidden");
    streamText.style("visibility", "hidden");

    plotLinearStreamLine2.style("visibility", "hidden");
    plotCompleteStreamLine2.style("visibility", "hidden");
    streamText2.style("visibility", "hidden");

    plotFluidPointsObs.style("visibility", "hidden");
    plotFluidVelocityObs.style("visibility", "hidden");
    plotFluidPointsLinear.style("visibility", "hidden");
    plotFluidVelocityLinear.style("visibility", "hidden");

    airFoil.style("visibility", "visible");
}