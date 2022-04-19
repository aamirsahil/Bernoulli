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

d3.selectAll(".ke1").on("click", () => {
        if(keState[0])
                d3.selectAll(".ke1").html("\\( \\frac{1}{2}m_1v_1^2 \\)");
        else
                d3.selectAll(".ke1").html("\\( KE_1 \\)");
        keState[0] = !keState[0];
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

d3.selectAll(".ke3").on("click", () => {
        if(keState[1])
                d3.selectAll(".ke3").html("\\( \\frac{1}{2}m_2v_2^2 \\)");
        else
                d3.selectAll(".ke3").html("\\( KE_3 \\)");
        keState[1] = !keState[1];
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});