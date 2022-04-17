let blueSel = "#5999e3";
let greyUnCel = "#a6a5a2";
export function setMarker(i){
        let markerState = [...Array(4).keys()].map((d) => (d<=i)?blueSel:greyUnCel);
        for(let i=0;i<4;i++)
                d3.select("#marker"+(i+2)).style("fill", markerState[i]);
}

export function setText(i){
        let textState = [...Array(5).keys()].map((d) => (d<=i)?"visible":"hidden");
        for(let j=0;j<5;j++)
                d3.select("#point0"+(j+1)).style("visibility", textState[j]);
}

export function resetAll(plotFluidPoints,plotFluidVelocity,backGround,canvasText,plotLinearStreamLine,plotCompleteStreamLine,streamText){
        for(let i=0;i<4;i++){
                d3.select("#marker"+(i+2)).style("fill", greyUnCel);
                d3.select("#point0"+(i+1)).style("visibility", "hidden");
        }
        d3.select("#point05").style("visibility", "hidden");
        plotLinearStreamLine.style("visibility", "hidden");
        plotCompleteStreamLine.style("visibility", "hidden");
        streamText.style("visibility", "hidden");
        plotFluidPoints.style("opacity","0%");
        plotFluidVelocity.style("opacity","0%");
        backGround.style("opacity","0%");
        canvasText.style("opacity","0%");
}