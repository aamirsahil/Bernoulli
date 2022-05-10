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
    "We started with an real life example which we needed to model to understand airplane lift.",
    "Only the essential elements are kept and we idealized the system to study its relation.",
    "The system is then divided into smaller elements such that the governing physics is same in each division.",
    "The entire system is then placed in a geometric grid and we define necessary metrics to describe the system.",
    "Through analytical or numerical manipulation we obtain the relationship between the physical quantities under investigation."
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