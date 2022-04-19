//define canvas-------------->right side
var canvas = d3.select("#system")
                .attr("width",canvasWidth)
                .attr("height",canvasHeight)
                .style("overflow","visible");
//the position axis
var axisX = d3.axisBottom(widthScale)
            .ticks(5);
//adding the x axis
canvas.append("g")
        .attr("transform","translate(" + graphXOffset +"," + (canvasHeight/2 + graphYOffset + 60) + ")")
        .attr("class", "xAxis")
        .call(axisX);
//initial height indicator------------------------------------------------------>left
canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".dataLine")
        .data([{x1: dataVel.slice(0,totalNum)[index].x, y1: lineBase,
        x2: dataVel.slice(0,totalNum)[index].x, y2: dataVel.slice(0,totalNum)[index].y}])
        .enter()
                .append("line")
                .attr("class", "dataLine")
                .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
                .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
                .attr("fill","none")
                .attr("stroke", "red")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray",3);
//initial height indicator------------------------------------------------------>right
canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".dataLine")
        .data([{x1: dataVel.slice(0,totalNum)[index + sectionWidthIndex].x, y1: lineBase,
        x2: dataVel.slice(0,totalNum)[index + sectionWidthIndex].x, y2: dataVel.slice(0,totalNum)[index + sectionWidthIndex].y}])
        .enter()
                .append("line")
                .attr("class", "dataLine")
                .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
                .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
                .attr("fill","none")
                .attr("stroke", "red")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray",3).style;
//initial point indicator--------------------------------------------------------------------->left
canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("circle")
                .attr("class", ".dataPointer")
                .attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x))
                .attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y)).attr("r", 2).attr("fill","none")
                .attr("stroke", "red").attr("stroke-width",1);
//initial point indicator--------------------------------------------------------------------->right
canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("circle")
                .attr("class", ".dataPointer")
                .attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) - 3)
                .attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].y)).attr("r", 2).attr("fill","none")
                .attr("stroke", "red").attr("stroke-width",1);   
//drag message
canvas.append("g")
            .attr("transform", "translate(" + (graphXOffset) + "," + (heightScale(-1)+60) + ")")
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .text("Drag this slider to see variation in parameters, P,v and h, at differnt position, x!")
            .style("fill","rgb(73, 7, 134)")
            .style("font-size","2.5vh");
//adding text------------->position
canvas.append("text")
        .attr("text-anchor", "end")
        .attr("x", canvasWidth/2 - graphOffeset/2)
        .attr("y", (canvasHeight/2+graphYOffset) + 30)
        .text("Position");
//adding slider
canvas.append("g").attr("class","moveSlider")
    .attr("transform", "translate(" + graphXOffset + "," + heightScale(-1) + ")")
    .call(slider);