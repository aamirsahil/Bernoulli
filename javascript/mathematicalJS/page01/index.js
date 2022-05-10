//slider drag-right
slider.on("onchange", (value)=>{
        setValues(value);
        setSection(value);

        setDataLine();
        setDispLine(value);
    
        setAnim(value);
        setForce();
        setArea();

        seTdsText(value);
});