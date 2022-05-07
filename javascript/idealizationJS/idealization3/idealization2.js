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