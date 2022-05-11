//To calculate the profile of the graph
function u(x,a,b){
    return 1/2*((a+b) + (b-a)*Math.tanh(3*x));
}
//data for graphing
var totalNum = 201;
var totalLen = 10;
var dist = 10/totalNum;
var x = [...Array(totalNum).keys()].map( d => (d*dist) - 5);

function createSection(){
    let x1 = [...Array(totalNum).keys()].map( d => (d*dist) - 5);
    let x2 = [...Array(totalNum).keys()].map( d => (d*dist) - 5).reverse();
    let xSection = x1.concat(x2);
    return xSection.map((d,i) => ({x: d, y: (i<totalNum)?u(d, toH(h1) - r1, toH(h2) - r2):u(d, toH(h1) + r1, toH(h2) + r2)}));
}