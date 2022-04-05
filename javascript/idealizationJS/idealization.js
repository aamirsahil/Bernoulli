var Canvas_Width = document.getElementById('rightMain').offsetWidth - 100;
var Canvas_Height = document.getElementById('rightMain').offsetHeight;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( Canvas_Width, Canvas_Height );
document.getElementById("rightMain").appendChild( renderer.domElement );
renderer.setClearColor( 0x9dc1fa, 1 );

// const light = new THREE.AmbientLight( 0xe0e0e0 ); // soft white light
// scene.add( light );
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

const loader = new THREE.GLTFLoader();

class Plane{
    constructor(){
        loader.load("../../Bernoulli/models/airplane/scene.gltf", (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.scale.set(.008,.008,.008);
            gltf.scene.position.set(0, 2, 0);
            this.plane = gltf.scene;
        });
        loader.load("../../Bernoulli/models/wing/scene.gltf", (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.scale.set(3.7,4.7,4.7);
            gltf.scene.position.set(-3.8, 0.3, 2.3);
            gltf.scene.rotation.set(degToRad(78.7), 0, 0);
            this.wing = gltf.scene;
            this.wing.visible = false;
        });
        let geometry = new THREE.PlaneGeometry( Canvas_Width, Canvas_Height );;
        let material = new THREE.MeshBasicMaterial( { color: 0x9dc1fa } );
        this.screen = new THREE.Mesh( geometry, material );
        this.screen.position.z = 1;
        this.screen.material.transparent = true;
        this.screen.material.opacity = 0;
        scene.add( this.screen );
    }
    rotate(len){
        len *= (1/sliderRange[1])*90*Math.PI/180;
        this.plane.rotation.y = -len;
        // this.wing.rotation.x = -len;
    }
    turnInvisible(){
        this.plane.visible = false;
        this.wing.visible = true;
        this.screen.visible = false;
    }
    opacity(length){
        this.plane.visible = true;
        this.wing.visible = false;
        this.screen.visible = true;
        let opacity = (length - sliderRange[0])/(sliderRange[1] - sliderRange[0]);
        this.screen.material.opacity = opacity;
    }
    wingMoving(length){
        let len = (length - sliderRange[2])/(sliderRange[3] - sliderRange[2]);
        let pos = {x: (4 + 3.8)*len + (-3.8),y: 0.3,z: 2.3};
        let rotX = (92.2 - 78.7)*len + 78.7;
        let rotZ = (210)*len;
        let scale = (8.7 - 4.7)*len + 4.7;

        this.wing.position.set(pos.x, pos.y, pos.z);
        this.wing.rotation.x = degToRad(rotX);
        this.wing.rotation.z = degToRad(rotZ);
        this.wing.scale.set(scale, scale, scale);
    }
    wingViewRot(angle){
        // angle = degToRad(angle);
        this.wing.rotation.x = degToRad(angle);
    }
}
let plane = new Plane();

class Camera{
    constructor(){
        this.camera = new THREE.PerspectiveCamera( 5, Canvas_Width / Canvas_Height, 0.1, 1000 );
        this.camera.position.z = 260;
    }
    zoom(len){
        len = len*(1/sliderRange[1]);
        let scale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([260, 90]);
        this.camera.position.z = scale(len);
        this.camera.updateProjectionMatrix();
    }
    resize(Canvas_Width, Canvas_Height){
        this.camera.aspect = Canvas_Width / Canvas_Height;
        this.camera.updateProjectionMatrix();
    
        renderer.setSize( Canvas_Width, Canvas_Height );
    }
}
let camera = new Camera();

var sliderRange = [0, 1/2, 1.2/2, 1]
d3.select('.slider').on("input",function(){
    let value = d3.select(this).property("value");
    let max = d3.select(this).property("max");
    let min = d3.select(this).property("min");
    let length = value/(max - min);

    
    if(length >= sliderRange[0] && length <= sliderRange[1]){
        //set rotation
        plane.rotate(length);
        //set opacity
        plane.opacity(length);
        //zoomin plane
        camera.zoom(length);
        setText(0);
    }
    else if(length > sliderRange[1] && length <= sliderRange[2]){
        plane.turnInvisible();
        setText(1);
    }
    else if(length > sliderRange[2] && length < sliderRange[3]){
        plane.wingMoving(length);
        setText(1);
    }
    else
        setText(2);
        
    //set model
    //set scale
    //set vector field
    //set text
});

function animate() {
    renderer.render( scene, camera.camera );
    // particle.map((p) => {
    //     p.update();
        // camera.checkBound(p.particle);
    // });
    requestAnimationFrame( animate );
}

setTimeout(()=>{
    animate();
}, 1000);

window.addEventListener("resize", function(){
    let Canvas_Width = document.getElementById('rightMain').offsetWidth - 100;
    let Canvas_Height = document.getElementById('rightMain').offsetHeight;
    camera.resize(Canvas_Width, Canvas_Height);
});

function degToRad(angle){
    return angle/360*2*Math.PI;
}

function setText(i){
    switch(i){
        case 0:
            d3.select("#point1").style("visibility", "hidden");
            d3.select("#point2").style("visibility", "hidden");
            d3.select("#marker2").style("fill", "#a6a5a2");
            d3.select("#marker3").style("fill", "#a6a5a2");
            break;
        case 1:
            d3.select("#point1").style("visibility", "visible");
            d3.select("#point2").style("visibility", "hidden");
            d3.select("#marker2").style("fill", "#5999e3");
            d3.select("#marker3").style("fill", "#a6a5a2");
            break;
        case 2:
            d3.select("#point1").style("visibility", "visible");
            d3.select("#point2").style("visibility", "visible");
            d3.select("#marker2").style("fill", "#5999e3");
            d3.select("#marker3").style("fill", "#5999e3");
            break;
    }
}

function svgResize()
{
    d3.select("#marker1")
        .attr("x", 0);
    d3.select("#marker2")
        .attr("x", (1/2)*d3.select("#pointers").style("width").replace("px", ""));
    d3.select("#marker3")
        .attr("x", 0.95*d3.select("#pointers").style("width").replace("px", ""));
}

window.addEventListener("load",svgResize());
// window.addEventListener("resize",svgResize());

//define the entire canvas(right side)
var canvas = d3.select("#sliderWing")
                .attr("width",10)
                .attr("height",100)
                .style("overflow","visible");
//create the slider
var slider = d3
    .sliderLeft()
    .min(80)
    .max(100)
    .height(130)
    .ticks(5)
    .default(92.2);
//call slider
canvas.append("g").attr("class","moveSlider")
    .attr("transform", "translate( " + (Canvas_Width - 10) + " , " + (Canvas_Height/2 - 130/2) + " )")
    .call(slider);
//slider drag-right
slider.on("onchange", (value)=>{
    console.log(value);
    plane.wingViewRot(value);
});







// class Particles{
//     constructor(i){
//         const geometry = new THREE.SphereGeometry( .05, 32, 16 );
//         const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
//         const sphere = new THREE.Mesh( geometry, material );
//         scene.add( sphere );
//         this.particle = sphere;
//         this.particle.position.set(i,i,0);
//         this.speed = 0;
//     }
//     update(){
//         this.particle.position.x += this.speed;
//     }
// }
// let particle = new Array(10).fill().map((e,i) => {
//     return new Particles(i);
// });


















// d3.select(".sliderX").on("input", () => {
//     let value = d3.select(".sliderX").property("value");
//     d3.select("#sliderX").html(value);
//     value = degToRad(value);
//     plane.rotateWingX(value);
// });
// d3.select(".sliderY").on("input", () => {
//     let value = d3.select(".sliderY").property("value");
//     d3.select("#sliderY").html(value);
//     value = degToRad(value);
//     plane.rotateWingY(value);
// });
// d3.select(".sliderZ").on("input", () => {
//     let value = d3.select(".sliderZ").property("value");
//     d3.select("#sliderZ").html(value);
//     value = degToRad(value);
//     plane.rotateWingZ(value);
// });

// d3.select(".sliderMX").on("input", () => {
//     let value = d3.select(".sliderMX").property("value");
//     d3.select("#sliderMX").html(value);
//     plane.posWingX(value);
// });
// d3.select(".sliderMY").on("input", () => {
//     let value = d3.select(".sliderMY").property("value");
//     d3.select("#sliderMY").html(value);
//     plane.posWingY(value);
// });
// d3.select(".sliderMZ").on("input", () => {
//     let value = d3.select(".sliderMZ").property("value");
//     d3.select("#sliderMZ").html(value);
//     plane.posWingZ(value);
// });

// d3.select(".sliderSX").on("input", () => {
//     let value = d3.select(".sliderSX").property("value");
//     d3.select("#sliderSX").html(value);
//     plane.scaleWing(value);
// });
// d3.select(".sliderSY").on("input", () => {
//     let value = d3.select(".sliderSY").property("value");
//     d3.select("#sliderSY").html(value);
//     plane.scaleWingY(value);
// });
// d3.select(".sliderSZ").on("input", () => {
//     let value = d3.select(".sliderSZ").property("value");
//     d3.select("#sliderSZ").html(value);
//     plane.scaleWingZ(value);
// });


    // rotateWingX(angle){
    //     this.wing.rotation.x = angle;
    // }
    // rotateWingY(angle){
    //     this.wing.rotation.y = angle; 
    // }
    // rotateWingZ(angle){
    //     this.wing.rotation.z = angle;
    // }
    // posWingX(angle){
    //     this.wing.position.x = angle;
    // }
    // posWingY(angle){
    //     this.wing.position.y = angle; 
    // }
    // posWingZ(angle){
    //     this.wing.position.z = angle;
    // }
    // scaleWing(angle){
    //     this.wing.scale.x = angle;
    //     this.wing.scale.y = angle;
    //     this.wing.scale.z = angle;
    // }
    // scaleWingX(angle){
    //     this.wing.scale.x = angle;
    // }
    // scaleWingY(angle){
    //     this.wing.scale.y = angle; 
    // }
    // scaleWingZ(angle){
    //     this.wing.scale.z = angle;
    // }
