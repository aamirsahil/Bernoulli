//define canvas-------------->right side
var canvas = d3.select("#system")
                .attr("width",canvasWidth)
                .attr("height",canvasHeight)
                .style("overflow","visible");
canvas.append("rect")
                .attr("x",0).attr("y",0)
                .attr("width", canvasWidth).attr("height",canvasHeight)
                .attr("fill", "#abdcff");
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
        x2: dataVel.slice(0,totalNum)[index].x, y2: dataLower[index].y}])
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
        x2: dataVel.slice(0,totalNum)[index + sectionWidthIndex].x, y2: dataLower[index + sectionWidthIndex].y}])
        .enter()
                .append("line")
                .attr("class", "dataLine")
                .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
                .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
                .attr("fill","none")
                .attr("stroke", "red")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray",3).style; 
//drag message
canvas.append("g")
            .attr("transform", "translate(" + (graphXOffset + 90) + "," + (heightScale(-0.9)) + ")")
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .text("Drag this slider see how the kinetic energy changes!")
            .style("fill","rgb(73, 7, 134)")
            .style("font-size","2.5vh");
//adding text------------->position
canvas.append("text")
        .attr("text-anchor", "end")
        .attr("x", canvasWidth/2 - graphOffeset/2)
        .attr("y", (canvasHeight/2+graphYOffset) + 30)
        .text("Position");
//adding text------------->mass 1
canvas.append("text")
        .attr("text-anchor", "end")
        .attr("x", canvasWidth/5)
        .attr("y", (canvasHeight/6+graphYOffset) + 30)//\u03c1
        .append("tspan")
        .attr("font-size", "20px").text("m").append("tspan").attr("font-size", "15px").text("1")
        .append("tspan").attr("font-size", "20px").text(" = \u03c1gA").append("tspan").attr("font-size", "15px").text("1")
        .append("tspan").attr("font-size", "20px").text("ds").append("tspan").attr("font-size", "15px").text("1");
//adding text------------->mass 2
canvas.append("text")
        .attr("text-anchor", "end")
        .attr("x", canvasWidth - graphOffeset/2)
        .attr("y", (graphYOffset) - 10)
        .append("tspan")
        .attr("font-size", "20px").text("m").append("tspan").attr("font-size", "15px").text("2")
        .append("tspan").attr("font-size", "20px").text(" = \u03c1gA").append("tspan").attr("font-size", "15px").text("2")
        .append("tspan").attr("font-size", "20px").text("ds").append("tspan").attr("font-size", "15px").text("2");

//adding slider
canvas.append("g").attr("class","moveSlider")
    .attr("transform", "translate(" + graphXOffset + "," + heightScale(-1) + ")")
    .call(slider);

//adding text------------->h1
canvas.append("text")
                .attr("class", "h")
                .attr("text-anchor", "end")
                .attr("x", widthScale(dataVel.slice(0,totalNum)[index].x) + 30)
                .attr("y", 290)
                .append("tspan")
                .attr("font-size", "20px").text("h").append("tspan").attr("font-size", "15px").text("1");
//adding text------------->h2
canvas.append("text")
                .attr("class", "h")
                .attr("text-anchor", "end")
                .attr("x", widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) + 30)
                .attr("y", 200)
                .append("tspan")
                .attr("font-size", "20px").text("h").append("tspan").attr("font-size", "15px").text("2");