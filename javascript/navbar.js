var desc = ["Reality", "Idealization", "Discretization", "Geometric", "Mathematical"];
for(let i = 1; i < 6; i++)
{
    let text = document.getElementById("text" + i.toString());
    text.innerHTML = desc[i-1];
}
document.getElementById('track').setAttribute('stroke','#007a85')

window.addEventListener("load", ()=>{
    let link = [
        "/02_reality.html",
        "/03_idealizationYY.html",
        // "/03_idealization.html",
        // "/03_idealization3.html",
        "/03_idealization2.html",
        "/04_descretization.html",
        "/04_descretization2.html",
        "/04_descretization3.html",
        // "/05_geometric.html",
        // "/05_geometric2.html",
        // "/06_mathematical.html",
        "/06_mathematical2.html",
        "/06_mathematical4.html",
        "/06_mathematical3.html",
    ];
    
    let loc = window.location.pathname.replace("/Bernoulli", "");
    let i =0;
    
    switch(loc){
        case link[0]:
            break;
        case link[1]:
            i=1;
            break;
        case link[2]:
            i=2;
            break;
        case link[3]:
        case link[4]:
        case link[5]:
            i=3;
            break;
        case link[7]:
        case link[8]:
        case link[6]:
            i=4;
            break;
        // case link[8]:
        // case link[9]:
        // case link[10]:
        //     i=4;
        //     break;
    }
    let width = d3.select(".svgNav").style("width").replace("px","");
    let xStart = parseInt(width/6);
    let xOffset = 20;
    let xEnd = (i+1)*xStart + xOffset;
    xOffset = 92;
    xStart += xOffset;
    

    d3.select("#track").attr("d", "M " +  xStart + " 15 H " + xEnd);
    fadeIn();
});
var link = [
    "/01_overview.html",
    "/02_reality.html",
    "/03_idealizationYY.html",
    // "/03_idealization.html",
    // "/03_idealization3.html",
    "/03_idealization2.html",
    "/04_descretization.html",
    "/04_descretization2.html",
    "/04_descretization3.html",
    // "/05_geometric.html",
    // "/05_geometric2.html",
    // "/06_mathematical.html",
    "/06_mathematical2.html",
    "/06_mathematical4.html",
    "/06_mathematical3.html",
    "/07_summary.html"
];
var loc = window.location.pathname.replace("/Bernoulli", "");
var linkIndex = link.indexOf(loc);
d3.select("#nextBtn").on("mousedown", ()=>{
    window.location = "/Bernoulli" + link[linkIndex+1];
});
// d3.select("#prevBtn").on("mousedown", ()=>{
//     window.location = link[linkIndex-1];
// });
function fadeIn(){
    // d3.select("body").append("div").attr("id", "fade")
    //     .style("font-size","50px").style("width", "100vw").style("height", "100vh")
    //     .style("position", "fixed").style("top", "0vh").style("left", "0vw")
    //     .style("background", "black").style("z-index", "100").style("animation", "fade 2s forwards");
}