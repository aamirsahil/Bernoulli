let theta = 45;
let F = 0;
let A = 56;
let a = 0.5;
let b = 1.5;
let v1 = 250;
let rho = 1.225;
let dt = 2/250;
let g = 9.8;

d3.select("#theta").on("input", () => {
    theta = parseFloat(d3.select("#theta").property("value"));
    d3.select("#F_input").html(theta);
    F = calculateF();
    d3.select("#F").html(F.toFixed(2) - 1330018); 
}
);
function calculateF(){
    let rad = degToRad(theta);
    let h = a*Math.tan(rad);
    let v2 = f(h)/dt;

    let dp = rho*g*h + 0.5*rho*Math.pow(v2,2) - 0.5*rho*Math.pow(v1,2);

    return dp*A;
}
d3.select("#F").html("hey");
let degToRad = (d) => {
    return Math.PI/180*d;
}
let f = (h) => {
    return Math.sqrt((Math.pow(h,2) + Math.pow(a,2))) + Math.sqrt((Math.pow(h,2) + Math.pow(b,2)));
}