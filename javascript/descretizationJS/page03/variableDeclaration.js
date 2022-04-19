//Number of points
let totalNum = 201;
//x len of the graph
let totalLen = 1;
//starting point of the plot--------->graph ploted from u(startPos) to u(startPos + totalLen)
var startPos = 0.5;
let dist = totalLen/(totalNum-1);
//for creating greyed sections
var sectionWidthLen = (1.4 - 0.5);
var sectionWidthIndex = parseInt(sectionWidthLen*totalNum/totalLen);
//data for the yellow section
var sectionWidthLenInitial = (0);
var sectionWidthIndexInital = parseInt(sectionWidthLenInitial*totalNum/totalLen);
//data for the red section
var sectionWidthLenFinal = (0);
var sectionWidthFinal = parseInt(sectionWidthLenFinal*totalNum/totalLen);
//slider min and max
let sliderStartPos = 0.53;
let sliderEndPos = 0.56;
let sliderWidth = totalLen - sectionWidthLen + startPos; 
//canvas dims
var canvasWidth = window.innerWidth/2;
var canvasHeight = window.innerHeight/1.5;