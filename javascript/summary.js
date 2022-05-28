d3.select('#slider1').on("input",function(){

    let value = d3.select(this).property("value");
    let max = d3.select(this).property("max");
    let min = d3.select(this).property("min");
    let length = value/(max - min);

    setText(length);
    setCanvas(length);
});
var textSliderRange = [0,1/14,8/14,10/14,12/14,1]
var text = [
    "We started with a real life example.",
    "We then idealized the system.",
    "Focused our analysis on a fluid element.",
    "Placed the system in a geometric grid and calculated the net work done, change in kinetic and potential energy.",
    "Fed the details into equation of conservation of energy to obtain the Bernoulli's equation."
    ]
function setText(length)
{
    if(length <= textSliderRange[1])
        document.getElementById('text').innerHTML = text[0];
    else if(length <= textSliderRange[2])
        document.getElementById('text').innerHTML = text[1];
    else if(length <= textSliderRange[3])
        document.getElementById('text').innerHTML = text[2];
    else if(length <= textSliderRange[4])
        document.getElementById('text').innerHTML = text[3];
    else
        document.getElementById('text').innerHTML = text[4];
}
var lenScale = d3.scaleLinear()
                .domain([0, 1])
                .range([0, 14]);
function setCanvas(length)
{
    let len = parseInt(lenScale(length));
    setPic(len);
}

function setPic(i){
    let picState = [...Array(14).keys()].map((d) => (d<=i)?"hidden":"visible");
    for(let j=1;j<15;j++)
            d3.select("#pic"+(j)).style("visibility", picState[j]);
}