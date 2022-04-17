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
        "/03_idealization.html",
        "/03_idealization2.html",
        "/04_descretization.html",
        "/05_geometric.html",
        "/05_geometric2.html",
        "/06_mathematical.html",
        "/06_mathematical2.html",
        "/06_mathematical3.html",
    ];
    
    let loc = window.location.pathname.replace("/Bernoulli", "");
    let i =0;
    
    switch(loc){
        case link[0]:
            break;
        case link[1]:
        case link[2]:
            i=1;
            break;
        case link[3]:
            i=2;
            break;
        case link[4]:
        case link[5]:
            i=3;
            break;
        case link[6]:
        case link[7]:
        case link[8]:
            i=4;
            break;
    }
    let width = d3.select(".svgNav").style("width").replace("px","");
    let xStart = parseInt(width/6);
    let xOffset = 20;
    let xEnd = (i+1)*xStart + xOffset;
    xOffset = 92;
    xStart += xOffset;
    

    d3.select("#track").attr("d", "M " +  xStart + " 15 H " + xEnd);
});
var link = [
    "/01_overview.html",
    "/02_reality.html",
    "/03_idealization.html",
    "/03_idealization2.html",
    "/04_descretization.html",
    "/05_geometric.html",
    "/05_geometric2.html",
    "/06_mathematical.html",
    "/06_mathematical2.html",
    "/06_mathematical3.html",
    "/07_summary.html"
];
var loc = window.location.pathname.replace("/Bernoulli", "");
var linkIndex = link.indexOf(loc);
d3.select("#nextBtn").on("mousedown", ()=>{
    window.location = link[linkIndex+1];
});
// d3.select("#prevBtn").on("mousedown", ()=>{
//     window.location = link[linkIndex-1];
// });