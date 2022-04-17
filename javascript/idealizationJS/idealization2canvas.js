var canvasWidth = document.getElementById('rightMain').offsetWidth/1.5;
var canvasHeight = document.getElementById('rightMain').offsetHeight/1.1;
//To calculate the profile of the graph
function u(x,h,k,c){
    let L = 1;
    let x0 = 1;
    return c*L/(1 + Math.exp(-k*(x - x0))) + h;
}
//data for graphing
var totalNum = 201;
var totalLen = 2;
var dist = 2/totalNum;
var x = [...Array(totalNum).keys()].map( d => (d*dist));
var dataLower = x.map( (d) => ({x: d, y: u(d,-0.3,5,1)}));
var dataUpper = x.map( (d) => ({x: d, y: u(d,+0.3,8,0.6)}));
//width and height scale inside graph
var widthScale = d3.scaleLinear()
                    .domain([d3.min(x), d3.max(x)])
                    .range([0, canvasWidth]);
var heightScale = d3.scaleLinear()
                    .domain([d3.min(dataLower.map((d) => d.y)),d3.max(dataUpper.map((d) => d.y))])
                    .range([canvasHeight/2,20]);
//define the entire canvas(right side)
function setup(){
    canvas = createCanvas(canvasWidth, canvasHeight);
    cavasColor = "#c2e1f0"
    canvas.parent("#system");
    background(cavasColor);

    canvasXoffset = document.getElementById('system').getBoundingClientRect().x;
    canvasYoffset = document.getElementById('system').getBoundingClientRect().y;

    incSlider = createSlider(30, 100, 30);
    incSlider.parent("#system");
    incSlider.position(canvasXoffset + width/2, canvasYoffset + height/1.5);

    lenOfSection = 30;
    startPos = 0;
}
function draw(){
    background(cavasColor);
    //stream pipe
    stroke("black");
    strokeWeight(5);
    for(let i = 0;i<totalNum-1;i++){
        line(widthScale(x[i]), heightScale(dataUpper[i].y), widthScale(x[i+1]), heightScale(dataUpper[i+1].y));
        line(widthScale(x[i]), heightScale(dataLower[i].y), widthScale(x[i+1]), heightScale(dataLower[i+1].y));
      }
    //selection
    lenOfSection = incSlider.value();
    startPos = incSlider.value() - 30;
    stroke("grey");
    fill("grey");
    for(let i=startPos;i<lenOfSection+startPos;i++){
        rect(widthScale(x[i]), heightScale(dataLower[i].y), widthScale(x[i+1]) - widthScale(x[i]), heightScale(dataUpper[i].y) - heightScale(dataLower[i].y));
    }
}