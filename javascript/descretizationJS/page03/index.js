//slider drag-right
slider.on("onchange", (value)=>{
        setValues(value);
        setSection(value);
    
        setDataLine();
        setDispLine(value);
    
        setAnim(value);
        setArea();

        cirInNum(value);
        seTdsText(value);
});

d3.selectAll(".pe1").on("click", () => {
        if(peState[0])
                d3.selectAll(".pe1").html("\\( m_1gh_1 \\)");
        else
                d3.selectAll(".pe1").html("\\( PE_1 \\)");
        peState[0] = !peState[0];
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

d3.selectAll(".pe3").on("click", () => {
        if(peState[1])
                d3.selectAll(".pe3").html("\\( m_2gh_2 \\)");
        else
                d3.selectAll(".pe3").html("\\( PE_3 \\)");
        peState[1] = !peState[1];
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});