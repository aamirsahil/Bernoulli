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
function movePoints(width){
    velocityPoints.forEach( (d,i) => {
        let col = parseInt(i/6);
        let speedX = 1;
        d.x += speedX;
        d.x %= (width);
    });
}
function setUpSliders(){
    sliderH1 = createSlider(-3,3,0, 0.1);
    paragraphH1 = createP('Height 1');
    sliderH2 = createSlider(-3,3,0, 0.1);
    paragraphH2 = createP('Height 2');
    sliderR1 = createSlider(0.5,2,1, 0.1);
    paragraphR1 = createP('Radius 1');
    sliderR2 = createSlider(0.5,2,1, 0.1);
    paragraphR2 = createP('Radius 2');
    checkboxSLine = createCheckbox('StreamLine', false);
    checkboxFlow = createCheckbox('Flow', false);

    sliderH1.parent("#system");
    paragraphH1.parent("#system");
    sliderH2.parent("#system");
    paragraphH2.parent("#system");
    sliderR1.parent("#system");
    paragraphR1.parent("#system");
    sliderR2.parent("#system");
    paragraphR2.parent("#system");
    checkboxSLine.parent("#system");
    checkboxFlow.parent("#system");

    sliderH1.style('width', '110px');
    sliderH2.style('width', '110px');
    sliderR1.style('width', '110px');
    sliderR2.style('width', '110px');

    sliderH1.position(canvasXoffset + 80, canvasYoffset + height - 20);
    paragraphH1.position(canvasXoffset + 80, canvasYoffset + height - 40);
    sliderH2.position(canvasXoffset + 200, canvasYoffset + height - 20);
    paragraphH2.position(canvasXoffset + 200, canvasYoffset + height - 40);
    sliderR1.position(canvasXoffset + 320, canvasYoffset + height - 20);
    paragraphR1.position(canvasXoffset + 320, canvasYoffset + height - 40);
    sliderR2.position(canvasXoffset + 440, canvasYoffset + height - 20);
    paragraphR2.position(canvasXoffset + 440, canvasYoffset + height - 40);
    checkboxSLine.position(canvasXoffset + 80, canvasYoffset);
    checkboxFlow.position(canvasXoffset + 200, canvasYoffset);

    sliderH1.input(updateParam);
    sliderH2.input(updateParam);
    sliderR1.input(updateParam);
    sliderR2.input(updateParam);

    checkboxSLine.changed(checkBoxEventSline);
    checkboxFlow.changed(checkBoxEventFlow);
}

function updateParam(){
    h1 = sliderH1.value();
    h2 = sliderH2.value();
    r1 = sliderR1.value();
    r2 = sliderR2.value();
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
    createVelocityPoints();
}
function checkBoxEventSline(){
    streamLineShow = !streamLineShow;
}
function checkBoxEventFlow(){
    streamFlow = !streamFlow;
}