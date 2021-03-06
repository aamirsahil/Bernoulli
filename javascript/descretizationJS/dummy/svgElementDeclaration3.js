//plot line dx indicator-------------------------------------------->left
var dataLine1dx = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".dataLine")
    .data([{
            x1: dataVel.slice(0,totalNum)[index].x, 
            y1: dataVel.slice(0,totalNum)[index].y/2,
            x2: dataVel.slice(0,totalNum)[index].x + (sliderStartPos - sliderStartPos)*totalNum/totalLen, 
            y2: dataVel.slice(0,totalNum)[index].y/2}])
    .enter()
            .append("line")
            .attr("class", "dataLine")
            .attr("x1",(d) => (widthScale(d.x1))).attr("x2",(d) => (widthScale(d.x2)))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",3);
//plot line dx indicator-------------------------------------------->right
var dataLine2dx = canvas.append("g")
    .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
    .selectAll(".dataLine")
    .data([{
            x1: dataVel.slice(0,totalNum)[index + sectionWidthIndex].x, 
            y1: dataVel.slice(0,totalNum)[index + sectionWidthIndex].y/2,
            x2: dataVel.slice(0,totalNum)[index + sectionWidthIndex].x + (sliderStartPos - sliderStartPos)*totalNum/totalLen, 
            y2: dataVel.slice(0,totalNum)[index + sectionWidthIndex].y/2}])
    .enter()
            .append("line")
            .attr("class", "dataLine")
            .attr("x1",(d) => (widthScale(d.x1) - 3)).attr("x2",(d) => (widthScale(d.x2) - 3))
            .attr("y1",(d) => heightScale(d.y1)).attr("y2",(d) => heightScale(d.y2))
            .attr("fill","none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray",3);
//plot pointer circles(moving)-------------------------------------->left
var dataPointer1 = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("circle")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x))
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y)).attr("r", 2).attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1);
//plot pointer circles(moving)-------------------------------------->right
var dataPointer2 = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("circle")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) - 3)
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].y)).attr("r", 2).attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1);
//plot cross-section------------------------------------------------>left
var A1 = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("ellipse")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index].x) - 3)
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index].y))
            .attr("rx", 30)
            .attr("ry", -2*(heightScale(dataVel.slice(0,totalNum)[index].y) - 
                        heightScale(dataVel.slice(totalNum,2*totalNum)[index].y)))
            .attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1).attr("stroke-dasharray",3);
//plot cross-section------------------------------------------------>right
var A2 = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .append("ellipse")
            .attr("class", ".dataPointer")
            .attr("cx",widthScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].x) - 3)
            .attr("cy", heightScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].y))
            .attr("rx", 10)
            .attr("ry", -2*(heightScale(dataVel.slice(0,totalNum)[index + sectionWidthIndex].y) - 
                        heightScale(dataVel.slice(totalNum,2*totalNum)[index + sectionWidthIndex].y)))
            .attr("fill","none")
            .attr("stroke", "black").attr("stroke-width",1).attr("stroke-dasharray",3);
//plot force arrows------------------------------------------------------->left
var forceVectorLeft = canvas.append("g").attr("class", "forceLeft")
                .attr("transform","translate(" + (graphXOffset - 20) + "," + graphYOffset + ")")
                .selectAll(".forceVectorLeft")
                .data(forcePositionsLeft)
                .enter()
                    .append("g")
                    .attr("transform", (d) => "translate(" + d.x + ","+ d.y +")")
                    .append("path")
                    .attr("class", ".forceVectorLeft")
                    .attr("d", "M 0 0 H 20 L 15 -5 V 5 L 20 0")
                    .attr("stroke", "black")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-width", 4)
                    .style("animation", "forceMoveLeft 2s infinite");
//plot force arrows------------------------------------------------------->left
var forceVectorRight = canvas.append("g").attr("class", "forceRight")
                .attr("transform","translate(" + (graphXOffset) + "," + graphYOffset + ")")
                .selectAll(".forceVectorLeft")
                .data(forcePositionsRight)
                .enter()
                    .append("g")
                    .attr("transform", (d) => "translate(" + d.x + ","+ d.y +")")
                    .append("path")
                    .attr("class", ".forceVectorLeft")
                    .attr("d", "M 20 0 H 0 L 5 -5 V 5 L 0 0")
                    .attr("stroke", "black")
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-width", 4)
                    .style("animation", "forceMoveRight 2s infinite");
