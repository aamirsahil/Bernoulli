//function f1
function f1(x)
 {
    var temp = [];
    for (var i = 0; i < x.length; i ++)
    {
        temp.push(x[i]+100);
    }
    return temp;
 }
 //function f2
 function f2(x)
 {
    var temp = [];
    for (var i = 0; i < x.length; i ++)
    {
        temp.push(150+ Math.sin(x[i]/20)*50);
    }
    return temp;
 }
 //range function
function range(start,end,step)
{
    var ar = [];
    for (var i = start; i <= end; i += step)
    {
        ar.push(i);
    }
    return ar;
}

x1 = range(100,400,1);
y1 = f1(x1);
y2 = f2(x1);
function setup()
{  

  var canvas =createCanvas(700,500);
  canvas.parent("a")
  frameRate(100);
 
}
  function draw()
  {
  background(255,200,200);
 
  noFill(50,50,50);
  beginShape();
  stroke(30,30,30,50);
  for (i =0;i<y1.length;i++)
  {
    vertex(i+100,y2[i]);  
    vertex(i+100,y1[i]);
  }
  endShape();
 
  }


