d3.select("#myRange").on("input", () => {
    let value = d3.select("#myRange").property("value");
    let max = d3.select("#myRange").property("max");
    let min = d3.select("#myRange").property("min");
    let length = value/(max - min);

    if(length == (sliderRange[0])){
            resetAll();
    }
    else if(length > sliderRange[0] && length <= sliderRange[1]){
        setMarker(-1);
        setText(0);
        setPic(0);
    }
    else if(length > sliderRange[1] && length <= sliderRange[2]){
        setText(1);
        setMarker(0);
        setPic(1);

        streamText.style("visibility", "visible");
        streamText2.style("visibility", "visible");
        plotCompleteStreamLine.style("visibility", "visible");
        plotCompleteStreamLine2.style("visibility", "visible");
    }
    else if(length > sliderRange[2] && length <= sliderRange[3]){
        setText(2);
        setMarker(1);
        setPic(2);
    }
    else if(length > sliderRange[3] && length <= sliderRange[4]){
            setText(3);
            setMarker(2);
            setPic(3);

    }
    else if(length > sliderRange[4] && length < sliderRange[5]){
        setText(4);
        setMarker(3);
        setPic(4);
    }
    else{
        setText(5);
        setMarker(4);
        setPic(5);

        hideAll();
    }
});
function setPic(){

}
function setMarker(i){
    let markerState = [...Array(5).keys()].map((d) => (d<=i)?blueSel:greyUnCel);
    for(let i=0;i<4;i++)
            d3.select("#marker"+(i+2)).style("fill", markerState[i]);
}

function setText(i){
    let textState = [...Array(6).keys()].map((d) => (d<=i)?"visible":"hidden");
    for(let j=0;j<6;j++)
            d3.select("#point0"+(j)).style("visibility", textState[j]);
}

function hideAll(){
    plotFluidVelocityObs.style("visibility", "hidden");
    plotFluidPointsObs.style("visibility", "hidden");
    animateOn = false;

    lift.style("visibility", "visible");
    liftText.style("visibility", "visible");
}

function resetAll(){
    for(let i=0;i<7;i++){
            d3.select("#marker"+(i+2)).style("fill", greyUnCel);
            d3.select("#point0"+(i+1)).style("visibility", "hidden");
    }
    d3.select("#point05").style("visibility", "hidden");

    streamText.style("visibility", "hidden");
    streamText2.style("visibility", "hidden");
    plotCompleteStreamLine.style("visibility", "hidden");
    plotCompleteStreamLine2.style("visibility", "hidden");

    plotFluidVelocityObs.style("visibility", "visible");
    plotFluidPointsObs.style("visibility", "visible");
    animateOn = true;

    lift.style("visibility", "hidden");
    liftText.style("visibility", "hidden");
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


function animate(){
    if(animateOn)
        frame += frameSpeed;
    moveParticles();
    requestAnimationFrame(animate);
}
// make everything fit on resizing
function svgResize()
{
    d3.select("#marker1")
        .attr("x", 0);
    d3.select("#marker2")
        .attr("x", (1/5)*d3.select("#pointers").style("width").replace("px", ""));
    d3.select("#marker3")
        .attr("x", (2/5)*d3.select("#pointers").style("width").replace("px", ""));
        d3.select("#marker4")
        .attr("x", (3/5)*d3.select("#pointers").style("width").replace("px", ""));
    d3.select("#marker5")
        .attr("x", (4/5)*d3.select("#pointers").style("width").replace("px", ""));
        d3.select("#marker6")
        .attr("x", (0.98)*d3.select("#pointers").style("width").replace("px", ""));
}
window.addEventListener("load",svgResize());
// window.addEventListener("resize",svgResize());
