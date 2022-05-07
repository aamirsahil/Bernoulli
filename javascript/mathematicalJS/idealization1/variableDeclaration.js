// canvas dimension
var canvasWidth = document.getElementById('rightMain').offsetWidth - 2;
var canvasHeight = document.getElementById('rightMain').offsetHeight - 60;
// right slider range
var sliderRange = [0, 1/7, 2/7, 3/7, 4/7, 5/7, 6/7, 1];
let blueSel = "#5999e3";
let greyUnCel = "#a6a5a2";
//set height and width of the image
d3.select(".item1").style("width", (canvasWidth) + "px")
                .style("height", canvasHeight + "px");
d3.selectAll(".river").style("width", (canvasWidth) + "px")
                .style("height", canvasHeight + "px");