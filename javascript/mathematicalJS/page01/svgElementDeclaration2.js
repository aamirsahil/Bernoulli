//plot the pipe outline
//lower
var plotLower = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .selectAll(".plot")
            .data([dataLower])
            .enter()
                .append("path")
                .attr("class", "plot")
                .attr("d",line)
                .attr("fill","none")
                .attr("stroke", "red")
                .attr("stroke-width", 2);
// upper
var plotUpper = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .selectAll(".plot")
            .data([dataUpper])
            .enter()
                .append("path")
                .attr("class", "plot")
                .attr("d",line)
                .attr("fill","none")
                .attr("stroke", "red")
                .attr("stroke-width", 2);
//the grey portion
var plotSection = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .selectAll(".plotSection")
            .data([dataSection])
            .enter()
                .append("path")
                .attr("class", "plotSection")
                .attr("d",line)
                .attr("fill","grey")
                .attr("stroke", "black")
                .attr("stroke-width", 1).style("opacity", "50%");
//yellow portion
var plotSectionInital = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .selectAll(".plotSectionInitial")
            .data([dataSectionInitial])
            .enter()
                .append("path")
                .attr("class", "plotSectionInitial")
                .attr("d",line)
                .attr("fill","yellow")
                .attr("stroke", "black")
                .attr("stroke-width", 1).style("opacity", "50%");
//red portion
var plotSectionFinal = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .selectAll(".plotSectionFinal")
            .data([dataSectionFinal])
            .enter()
                .append("path")
                .attr("class", "plotSectionFinal")
                .attr("d",line)
                .attr("fill","green")
                .attr("stroke", "black")
                .attr("stroke-width", 1).style("opacity", "50%");
//plot velocity vectors
var plotVelocity = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset) + ")")
        .selectAll(".plotVelocity")
        .data(velocityState)
        .enter()
                .append("line")
                .attr("class", "plotVelocity")
                .attr("x1", d => widthScale(d.x1))
                .attr("x2", d => widthScale(d.x2))
                .attr("y1", d => heightScale(d.y1))
                .attr("y2", d => heightScale(d.y2))
                .attr("fill","none")
                .attr("stroke", "green")
                .attr("stroke-width", 2).style("opacity", "25%");
//plot points
var plotPoint = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset) + ")")
        .selectAll(".plotPoint")
        .data(velocityState)
        .enter()
                .append("circle")
                .attr("class", "plotPoint")
                .attr("cx",d => widthScale(d.x1)).attr("cy", d => heightScale(d.y1))
                .attr("r", 2).attr("fill", "black").style("opacity", "25%");
//plot height indicator line----------------------------------->left
var dataLine1 = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".dataLine")
        .data([{x1: dataVel.slice(0,totalNum)[index].x, y1: lineBase,
        x2: dataVel.slice(0,totalNum)[index].x, y2: dataVel.slice(2*totalNum,3*totalNum)[index].y}])
        .enter()
                .append("line")
                .attr("class", "dataLine")
                .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
                .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
                .attr("fill","none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray",3);
//plot height indicator line----------------------------------->right
var dataLine2 = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".dataLine")
    .data([{x1: dataVel.slice(0,totalNum)[index + sectionWidthIndex].x, y1: lineBase,
    x2: dataVel.slice(0,totalNum)[index + sectionWidthIndex].x, y2: dataVel.slice(2*totalNum,3*totalNum)[index + sectionWidthIndex].y}])
    .enter()
            .append("line")
            .attr("class", "dataLine")
            .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",3);
