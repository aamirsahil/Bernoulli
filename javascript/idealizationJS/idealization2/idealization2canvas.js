// anim
let frame = 0;
let speed = 0.01;
createVelocityPoints();
//define the entire canvas(right side)
function setup(){
    canvas = createCanvas(canvasWidth, canvasHeight);
    cavasColor = "#abdcff"
    canvas.parent("#system");
    background(cavasColor);

    canvasXoffset = document.getElementById('system').getBoundingClientRect().x;
    canvasYoffset = document.getElementById('system').getBoundingClientRect().y;

    lenOfSection = 30;
    startPos = 0;

    // show streamLine
    streamLineShow = false;
    streamFlow = false;
    // Slider for parameters
    setUpSliders();
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
    if(streamLineShow){
        // 3 streamLines
        stroke("red");
        strokeWeight(1);
        for(let i = 0;i<totalNum-1;i++){
            line(widthScale(x[i]), heightScale(streamLineMid[i].y), widthScale(x[i+1]), heightScale(streamLineMid[i+1].y));
            line(widthScale(x[i]), heightScale(streamLineUp[i].y), widthScale(x[i+1]), heightScale(streamLineUp[i+1].y));
            line(widthScale(x[i]), heightScale(streamLineLow[i].y), widthScale(x[i+1]), heightScale(streamLineLow[i+1].y));
        }
    }
    //printing particles
    fill("black");
    stroke("black");
    strokeWeight(3);
    if(streamFlow)
        createVelocityPoints();
    velPointsMid.map( (d) => {
        ellipse(widthScale(d.x), heightScale(d.y), 10, 10);
    });
    velPointsUp.map( (d) => {
        ellipse(widthScale(d.x), heightScale(d.y), 10, 10);
    });
    velPointsLow.map( (d) => {
        ellipse(widthScale(d.x), heightScale(d.y), 10, 10);
    });
}


    // incSlider = createSlider(30, 100, 30);
    // incSlider.parent("#system");
    // incSlider.position(canvasXoffset + width/2, canvasYoffset + height/1.5);

    //selection
    // lenOfSection = incSlider.value();
    // startPos = incSlider.value() - 30;
    // stroke("grey");
    // fill("grey");
    // for(let i=startPos;i<lenOfSection+startPos;i++){
    //     rect(widthScale(x[i]), heightScale(dataLower[i].y), widthScale(x[i+1]) - widthScale(x[i]), heightScale(dataUpper[i].y) - heightScale(dataLower[i].y));
    // }

        // setupObstacle
    // stroke("black");
    // strokeWeight(5);
    // for(let i = 0;i<totalNum-1;i++){
    //     line(widthScaleObs(x[i]), heightScaleObs(obstacleUpper[i].y), widthScaleObs(x[i+1]), heightScaleObs(obstacleUpper[i+1].y));
    //     line(widthScaleObs(x[i]), heightScaleObs(obstacleLower[i].y), widthScaleObs(x[i+1]), heightScaleObs(obstacleLower[i+1].y));
    //   }
    // selection
    // stroke("grey");
    // fill("grey");
    // for(let i=0;i<totalNum-1;i++){
    //     rect(widthScaleObs(x[i]), heightScaleObs(obstacleLower[i].y), widthScaleObs(x[i+1]) - widthScaleObs(x[i]), heightScaleObs(obstacleUpper[i].y) - heightScaleObs(obstacleLower[i].y));
    // }
    // drawStreamLines
    // stroke("yellow");
    // strokeWeight(1);
    // line(0, streamLineY.one, width, streamLineY.one);
    // line(0, streamLineY.two, width, streamLineY.two);
    // line(0, streamLineY.three, width, streamLineY.three);
    // thick StreamLine
    // fill(128, 128, 128, fillOpacity);
    // rect(0, streamLineY.one, width, streamLineY.three - streamLineY.one);
    // crosssection
    // noFill();
    // (crossSectionVisible)?stroke("yellow"):noStroke();
    // ellipse(crossSectionPos.x + 50, crossSectionPos.y, 25, 2*(streamLineY.three - streamLineY.two));

    //move velocity points
    // movePoints(width);
        // streamLine data
    // streamLineY = { one: velocityPoints[6].y,
    //                 two: velocityPoints[6 + 6].y,
    //                 three: velocityPoints[6 + 12].y};
        // crosssection
    // crossSectionPos = {
    //     x: velocityPoints[6+6].x,
    //     y: velocityPoints[6+6].y
    // };