//To calculate the profile of the graph
function u(x,h,k,c){
    let L = 1;
    let x0 = 1;
    return c*L/(1 + Math.exp(-k*(x - x0))) + h;
}
//calculate velocity state-------->the small lines that define the velocity
function velocityPath(x0 = 0){
    let num = 20;
    let minLen = dist*1;
    let maxLen = dist*5;
    let pow = 1;
    let pow2 = 1;

    let lenFactor = (maxLen - minLen)/Math.pow(num - 1,pow2);
    let posFactor = (totalLen + startPos - maxLen)/Math.pow(num - 1,pow);
    let vecLen = [...Array(num).keys()].map((d) => (Math.pow(d,1.2)*lenFactor + minLen));

    return [...Array(3*num).keys()].map( (d) => {
            let dTemp = d;
            d = d%num;
            let sepAtd = Math.pow(d+1,pow)*posFactor - Math.pow(d,pow)*posFactor;
            let dNew = (Math.pow(d,pow)*posFactor) + (x0 % sepAtd);
            let firstIndex = Math.min(bisect(x,dNew), totalNum - 1);
            let lastIndex = Math.min(bisect(x,dNew + vecLen[d]), totalNum - 1);
            if(dTemp<num)
                    return {
                            x1: dataVel.slice(0,totalNum)[firstIndex].x,
                            x2: dataVel.slice(0,totalNum)[lastIndex].x,
                            y1: dataVel.slice(0,totalNum)[firstIndex].y,
                            y2: dataVel.slice(0,totalNum)[lastIndex].y
                    }
            else if(dTemp<2*num)
                    return {
                            x1: dataVel.slice(totalNum,2*totalNum)[firstIndex].x,
                            x2: dataVel.slice(totalNum,2*totalNum)[lastIndex].x,
                            y1: dataVel.slice(totalNum,2*totalNum)[firstIndex].y,
                            y2: dataVel.slice(totalNum,2*totalNum)[lastIndex].y
                    }
            else
                    return {
                            x1: dataVel.slice(2*totalNum,3*totalNum)[firstIndex].x,
                            x2: dataVel.slice(2*totalNum,3*totalNum)[lastIndex].x,
                            y1: dataVel.slice(2*totalNum,3*totalNum)[firstIndex].y,
                            y2: dataVel.slice(2*totalNum,3*totalNum)[lastIndex].y
                    }
    }
);
}
//creating a array of co-ordinates that represent the location of the points
function createDataVel(){
    let dataVel0 = x.map( (d) => ({x: d, y: (u(d,-0.3,5,1) + u(d,+0.3,8,0.6))/2}));
    let dataVel1 = x.map( (d) => ({x: d, y: ((u(d,-0.3,5,1) + u(d,+0.3,8,0.6))/2 + u(d,-0.3,5,1))/2}));
    let dataVel2 = x.map( (d) => ({x: d, y: ((u(d,-0.3,5,1) + u(d,+0.3,8,0.6))/2 + u(d,+0.3,8,0.6))/2}));
    return dataVel0.concat(dataVel1, dataVel2);
}
//creating the colored sections----------->grey/yellow/red
function createSection(value = sliderStartPos, width = sectionWidthIndex){
    let x1 = [...Array(width).keys()].map( d => (value + d*dist));
    let x2 = [...Array(width).keys()].map( d => (value + d*dist)).reverse();
    let xSection = x1.concat(x2);
    return xSection.map((d,i) => ({x: d, y: (i<width)?u(d,-0.3,5,1):u(d,+0.3,8,0.6)}));
}
//to find the nearrest data of a given point in x
var bisect = d3.bisector(d => d).left;
//for moving the velocity with slider
let frameInter = d3.scaleLinear()
    .domain([0.53, 0.56])
    .range([0, 0.05]);