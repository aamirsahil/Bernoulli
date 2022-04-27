// for resetting everything
function resetAll(){
    setText(-1);
    setMarker(-1);
    crossSectionVisible = false;
}
// setting text
function setText(i){
    let textState = [...Array(5).keys()].map((d) => (d<=i)?"visible":"hidden");
    for(let j=0;j<5;j++)
            d3.select("#point0"+(j+1)).style("visibility", textState[j]);
}
// set marker color
let blueSel = "#5999e3";
let greyUnCel = "#a6a5a2";
function setMarker(i){
        let markerState = [...Array(5).keys()].map((d) => (d<=i)?blueSel:greyUnCel);
        for(let i=0;i<5;i++)
                d3.select("#marker"+(i+1)).style("fill", markerState[i]);
}
// set Region visibility
function setFillOpacity(value){
    fillOpacity = fillOpacityScale(value);
}