//slider drag-right
slider.on("onchange", (value)=>{
        setValues(value);
        setSection(value);
    
        setDataPointer();
        setDataLine();
        setDispLine(value);
    
        setAnim(value);
        setForce();
        setArea();
});