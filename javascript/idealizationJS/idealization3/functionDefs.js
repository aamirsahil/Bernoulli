//To calculate the profile of the graph
function u(x,a,b){
    return 1/2*((a+b) + (b-a)*Math.tanh(x));
}
//To calculate velocity
function du(x,k,c,x0=1, L=5){
    return c*L*k*x*Math.exp(-k*(x - x0))/Math.pow(1 + Math.exp(-k*(x - x0)), 2);
}
function createVelocityPoints(){
    let colNum = 10;
    let colDist = 2/colNum;
    frame += speed;
    frame %= colDist;
    velPointsMid = [...Array(colNum).keys()].map( (d) => ({x: (d*colDist) - 1 + frame,
            y: (u((d*colDist) - 1 + frame, h1 - r1, h2 - r2) + u((d*colDist) - 1 + frame, h1 + r1, h2 + r2))/2
            }));
    velPointsUp = [...Array(colNum).keys()].map( (d) => ({x: (d*colDist) - 1 + frame,
           y: u((d*colDist) - 1 + frame, h1 - r1, h2 - r2)/4 + 3*u((d*colDist) - 1 + frame, h1 + r1, h2 + r2)/4
            }));
    velPointsLow = [...Array(colNum).keys()].map( (d) => ({x: (d*colDist) - 1 + frame,
            y: 3*u((d*colDist) - 1 + frame, h1 - r1, h2 - r2)/4 + u((d*colDist) - 1 + frame, h1 + r1, h2 + r2)/4
            }));
}

function setUpSliders(){
    sliderHObs = createSlider(0,2,1, 0.1);
    paragraphHObs = createP('Obstacle height');
    checkboxSLine = createCheckbox('StreamLine', false);
    checkboxFlow = createCheckbox('Flow', false);

    sliderHObs.parent("#system");
    paragraphHObs.parent("#system");
    checkboxSLine.parent("#system");
    checkboxFlow.parent("#system");

    sliderHObs.style('width', '110px');

    sliderHObs.position(canvasXoffset + 560, canvasYoffset + height - 20);
    paragraphHObs.position(canvasXoffset + 560, canvasYoffset + height - 40);
    checkboxSLine.position(canvasXoffset + 80, canvasYoffset);
    checkboxFlow.position(canvasXoffset + 200, canvasYoffset);

    sliderHObs.input(updateParam);

    checkboxSLine.changed(checkBoxEventSline);
    checkboxFlow.changed(checkBoxEventFlow);
}

function updateParam(){
    let hObsTor2 = d3.scaleLinear()
                    .domain([ 0, 2])
                    .range([1, 0.5]);

    hObs = sliderHObs.value();
    r2 =  hObsTor2(hObs);
    h2 = hObs + r2 + 0.4;
    dataLower = x.map( (d) => ({x: d, y: u(d, h1 - r1, h2 - r2)}));
    dataUpper = x.map( (d) => ({x: d, y: u(d, h1 + r1, h2 + r2)}));
    streamLineMid = x.map( (d) => ({x: d,
        y: (u(d, h1 - r1, h2 - r2) + u(d, h1 + r1, h2 + r2))/2
        }));
    streamLineUp = x.map( (d) => ({x: d,
        y: u(d, h1 - r1, h2 - r2)/4 + 3*u(d, h1 + r1, h2 + r2)/4
            }));
    streamLineLow = x.map( (d) => ({x: d,
            y: 3*u(d, h1 - r1, h2 - r2)/4 + u(d, h1 + r1, h2 + r2)/4
            }));
    obstacleUpper = x.map( (d) => ({x: d, y: hObs*Math.sqrt(d)}));
    obstacleLower = x.map( (d) => ({x: d, y: -0.15*hObs*Math.sqrt(d)}));
    createVelocityPoints();
}
function checkBoxEventSline(){
    streamLineShow = !streamLineShow;
}
function checkBoxEventFlow(){
    streamFlow = !streamFlow;
}