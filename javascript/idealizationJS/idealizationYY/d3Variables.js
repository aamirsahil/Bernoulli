// text fluid flow
// canvas.append("g")
//         .append("text")
//         .style("font-size", "2rem")
//         .attr("x", 0)
//         .attr("y", 15)
//         .attr("dy", ".35em")
//         .text( "Flowing fluid")
//         .style("fill", "#035704");
// plot the circles that represent the points
var plotFluidPointsObs = canvas.append("g")
        .selectAll(".plotPointObs")
        .data(fluidPointsObs)
        .enter()
                .append("circle")
                .attr("class", "plotPointObs")
                .attr("cx",d => d.x1).attr("cy", d => d.y1)
                .attr("r", 5).attr("fill", "black").style("visibility", "hidden");
// plot the lines that represent the vectors
var plotFluidVelocityObs = canvas.append("g")
        .selectAll(".plotVelocityObs")
        .data(fluidPointsObs)
        .enter()
                .append("line")
                .attr("class", "plotVelocityObs")
                .attr("x1", d => d.x1)
                .attr("x2", d => d.x2)
                .attr("y1", d => d.y1)
                .attr("y2", d => d.y2)
                .attr("fill","none")
                .attr("stroke", "red")
                .attr("stroke-width", 2).style("visibility", "hidden").attr("marker-end","url(#arrow)");
// plot the circles that represent the points
var plotFluidPointsLinear = canvas.append("g")
        .selectAll(".plotPointLinear")
        .data(fluidPointsLinear)
        .enter()
                .append("circle")
                .attr("class", "plotPointLinear")
                .attr("cx",d => d.x1).attr("cy", d => d.y1)
                .attr("r", 5).attr("fill", "black").style("visibility", "hidden");
// plot the lines that represent the vectors
var plotFluidVelocityLinear = canvas.append("g")
        .selectAll(".plotVelocityLinear")
        .data(fluidPointsLinear)
        .enter()
                .append("line")
                .attr("class", "plotVelocityLinear")
                .attr("x1", d => d.x1)
                .attr("x2", d => d.x2)
                .attr("y1", d => d.y1)
                .attr("y2", d => d.y2)
                .attr("fill","none")
                .attr("stroke", "red")
                .attr("stroke-width", 2).style("visibility", "hidden").attr("marker-end","url(#arrow)");
//streamLine plots
// no obstacle
var plotLinearStreamLine = canvas.append("g")
                .selectAll(".plotLinearStreamline")
                .data([linearData[7]])
                .enter()
                        .append("path")
                        .attr("class", "plotLinearStreamline")
                        .attr("d", line)
                        .attr("fill","none")
                        .attr("stroke", "green")
                        .attr("stroke-width", 5)
                        .attr("stroke-dasharray",10).style("visibility", "hidden");
// obsctacle
var plotCompleteStreamLine = canvas.append("g")
                .selectAll(".plotCompleteStreamline")
                .data([completeData[7]])
                .enter()
                        .append("path")
                        .attr("class", "plotCompleteStreamline")
                        .attr("d", line)
                        .attr("fill","none")
                        .attr("stroke", "green")
                        .attr("stroke-width", 5)
                        .attr("stroke-dasharray",10).style("visibility", "hidden");
// text that says streamline
var streamText = canvas.append("g")
                .append("text")
                .style("font-size", "2rem")
                .attr("x", widthScale(completeData[7][50].x))
                .attr("y", heightScale(completeData[7][50].y + 0.5))
                .attr("dy", ".35em")
                .text( "Streamline").attr("font-weight", "bold")
                .style("fill", "#035704").style("visibility", "hidden");
// 2nd streamLine
// no obstacle
var plotLinearStreamLine2 = canvas.append("g")
                .selectAll(".plotLinearStreamline")
                .data([linearData[3]])
                .enter()
                        .append("path")
                        .attr("class", "plotLinearStreamline")
                        .attr("d", line)
                        .attr("fill","none")
                        .attr("stroke", "green")
                        .attr("stroke-width", 5)
                        .attr("stroke-dasharray",10).style("visibility", "hidden");
// obsctacle
var plotCompleteStreamLine2 = canvas.append("g")
                .selectAll(".plotCompleteStreamline")
                .data([completeData[3]])
                .enter()
                        .append("path")
                        .attr("class", "plotCompleteStreamline")
                        .attr("d", line)
                        .attr("fill","none")
                        .attr("stroke", "green")
                        .attr("stroke-width", 5)
                        .attr("stroke-dasharray",10).style("visibility", "hidden");
// text that says streamline
var streamText2 = canvas.append("g")
                .append("text")
                .style("font-size", "2rem")
                .attr("x", widthScale(completeData[3][50].x))
                .attr("y", heightScale(completeData[3][50].y + 0.5))
                .attr("dy", ".35em")
                .text( "Streamline").attr("font-weight", "bold")
                .style("fill", "#035704").style("visibility", "hidden");

// airFoil
var airFoil = canvas.append("g").attr("class","airFoil")
                .attr("transform", "translate("+ ((canvasWidth - foilWidth)/2) + "," + ((canvasHeight - foilHeight)/2) +")")
                .append("path")
                .attr("d",foilPath).attr("fill",foilColor);
// text that says streamline
var obstacleText = canvas.append("g")
                .append("text")
                .style("font-size", "2rem")
                .attr("x", canvasWidth/2.2)
                .attr("y", canvasHeight/2.2)
                .attr("dy", ".15em")
                .text( "Obstacle")
                .style("fill", "black");