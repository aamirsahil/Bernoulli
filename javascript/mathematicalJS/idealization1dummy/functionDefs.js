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
    }
    else if(length > sliderRange[2] && length <= sliderRange[3]){
        setText(2);
        setMarker(1);
        setPic(2);
    }
    else if(length > sliderRange[3] && length < sliderRange[4]){
            setText(3);
            setMarker(2);
            setPic(3);

    }
    else if(length > sliderRange[4] && length <= sliderRange[5]){
        setText(4);
        setMarker(3);
        setPic(4);
    }
    else if(length > sliderRange[5] && length <= sliderRange[6]){
        setText(5);
        setMarker(4);
        setPic(5);
    }
    else if(length > sliderRange[6] && length < sliderRange[7]){
            setText(6);
            setMarker(5);
            setPic(6);
    }
    else{
        setText(7);
        setMarker(6);
        setPic(7);
    }
});
function setPic(i){
        let picState = [...Array(7).keys()].map((d) => (d<=i)?"hidden":"visible");
        for(let j=1;j<8;j++)
                d3.select("#pic"+(j)).style("visibility", picState[j]);
}
function setOpacity(opacity,i,j){
    opacity = (opacity - sliderRange[i])/(sliderRange[j] - sliderRange[i])*100;
    return opacity;
}

function setMarker(i){
    let markerState = [...Array(8).keys()].map((d) => (d<=i)?blueSel:greyUnCel);
    for(let i=0;i<7;i++)
            d3.select("#marker"+(i+2)).style("fill", markerState[i]);
}

function setText(i){
    let textState = [...Array(8).keys()].map((d) => (d<=i)?"visible":"hidden");
    for(let j=0;j<8;j++)
            d3.select("#point0"+(j)).style("visibility", textState[j]);
}

function resetAll(){
    for(let i=0;i<7;i++){
            d3.select("#marker"+(i+2)).style("fill", greyUnCel);
            d3.select("#point0"+(i+1)).style("visibility", "hidden");
    }
    d3.select("#point05").style("visibility", "hidden");
}

// make everything fit on resizing
function svgResize()
{
    d3.select("#marker1")
        .attr("x", 0);
    d3.select("#marker2")
        .attr("x", (1/7)*d3.select("#pointers").style("width").replace("px", ""));
    d3.select("#marker3")
        .attr("x", (2/7)*d3.select("#pointers").style("width").replace("px", ""));
        d3.select("#marker4")
        .attr("x", (3/7)*d3.select("#pointers").style("width").replace("px", ""));
    d3.select("#marker5")
        .attr("x", (4/7)*d3.select("#pointers").style("width").replace("px", ""));
        d3.select("#marker6")
        .attr("x", (5/7)*d3.select("#pointers").style("width").replace("px", ""));
        d3.select("#marker7")
        .attr("x", (6/7)*d3.select("#pointers").style("width").replace("px", ""));
    d3.select("#marker8")
        .attr("x", 0.95*d3.select("#pointers").style("width").replace("px", ""));
}
window.addEventListener("load",svgResize());
// window.addEventListener("resize",svgResize());