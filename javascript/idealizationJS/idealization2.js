// import { foilPath } from '../descretizationJS/svg.js';
// import { setMarker, setText, resetAll } from './rightSliderInteractions.js';

// var bisect = d3.bisector(d => d).left;

// //background

// var sliderRange = [0, 1/4, 2/4, 3/4, 1]
// d3.select("#myRange").on("input", () => {
//         let value = d3.select("#myRange").property("value");
//         let max = d3.select("#myRange").property("max");
//         let min = d3.select("#myRange").property("min");
//         let length = value/(max - min);
    
//         if(length == (sliderRange[0])){
//         }
//         else if(length > sliderRange[0] && length <= sliderRange[1]){
//             setText(0);
//         }
//         else if(length > sliderRange[1] && length <= sliderRange[2]){
//             setText(1);
//             setMarker(0);
//         }
//         else if(length > sliderRange[2] && length <= sliderRange[3]){
//             setText(2);
//             setMarker(1);
//         }
//         else if(length > sliderRange[3] && length < sliderRange[4]){
//                 setText(3);
//                 setMarker(2);
//         }
//         else{
//                 setText(4);
//                 setMarker(3);
//         }
// });

// function svgResize()
// {
//     d3.select("#marker1")
//         .attr("x", 0);
//     d3.select("#marker2")
//         .attr("x", (1/4)*d3.select("#pointers").style("width").replace("px", ""));
//     d3.select("#marker3")
//         .attr("x", (2/4)*d3.select("#pointers").style("width").replace("px", ""));
//         d3.select("#marker4")
//         .attr("x", (3/4)*d3.select("#pointers").style("width").replace("px", ""));
//     d3.select("#marker5")
//         .attr("x", 0.95*d3.select("#pointers").style("width").replace("px", ""));
// }
// window.addEventListener("load",svgResize());
// // window.addEventListener("resize",svgResize());