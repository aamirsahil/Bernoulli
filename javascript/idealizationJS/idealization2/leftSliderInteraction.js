d3.select("#myRange").on("input", () => {
    let value = d3.select("#myRange").property("value");
    let max = d3.select("#myRange").property("max");
    let min = d3.select("#myRange").property("min");
    let length = value/(max - min);

    if(length == (sliderRange[0])){
        resetAll();
    }
    else if(length > sliderRange[0] && length <= sliderRange[1]){
        setText(0);
        setMarker(0);
        setFillOpacity(value);
    }
    else if(length > sliderRange[1] && length <= sliderRange[2]){
        setText(1);
        crossSectionVisible = true;
        setMarker(1);
    }
    else if(length > sliderRange[2] && length <= sliderRange[3]){
        setText(2);
        setMarker(2);
    }
    else if(length > sliderRange[3] && length < sliderRange[4]){
        setText(3);
        setMarker(3);
    }
    else{
        setText(4);
        setMarker(4);
    }
});