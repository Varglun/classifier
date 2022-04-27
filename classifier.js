const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
let x_center = canvas.width / 2;
let y_center = canvas.height / 2;


let green_coord_x = [];
let green_coord_y = [];
let red_coord_x = [];
let red_coord_y = [];

function gen_theta() {
    let alpha = Math.random()*2*Math.PI;
    console.log(`alpha = ${alpha}`);
    let x = Math.cos(alpha);
    let y = Math.sin(alpha);
    return [x, y];
}

function gen_theta0() {
    let theta0_sign = Math.floor(Math.random()*2)*2 - 1;
    let theta0_abs = Math.random() * Math.min(x_center, y_center) * 0.8;
    console.log(`theta0 = ${theta0_sign * theta0_abs}`);
    return theta0_sign * theta0_abs;
}

function gen_line() {
    let x0 = - theta0 / theta[0] + x_center;
    let y0 = y_center;
    let x1 = x_center;
    let y1 = - theta0 / theta[1] + y_center;
    console.log(x0, y0, x1, y1);

    return [x0, y0, x1, y1];

} 



let theta = gen_theta();
let theta0 = gen_theta0();
let line_coords = gen_line();

c.beginPath();
// c.rect(0, 0, canvas.width, canvas.height);
let line_coord_0_x = line_coords[0];
let line_coord_0_y = line_coords[1];
let line_coord_1_x = line_coords[2];
let line_coord_1_y = line_coords[3];
c.moveTo(line_coord_0_x, line_coord_0_y);
c.lineTo(line_coord_1_x, line_coord_1_y);
c.stroke();

function dotproduct(vec1, vec2) {
    let ans = 0;
    for (let i = 0; i < vec1.length; i++) {
        ans += vec1[i] * vec2[i];
    }
    return ans;
}

let draw_line = false;
let button_dl = document.querySelector("#draw_line");
let check_dl = false;
button_dl.addEventListener("click", function() {
    draw_line = true;
})

let line_start_x = 0;
let line_start_y = 0;
let line_finish_x = 0;
let line_finish_y = 0;

let mouse_x;
let mouse_y;

canvas.addEventListener("mousemove", function(event) {
    mouse_x = event.offsetX;
    mouse_y = event.offsetY;
    // c.beginPath();
    // c.moveTo(line_start_x, line_start_y);
    // c.lineTo(event.offsetX, event.offsetY);
    // c.fillStyle = 'black';
    // c.fillRect(event.offsetX, event.offsetY, 10, 10);
    // c.stroke();
})


canvas.addEventListener("click", function(event) {
    // console.log(event)
    if (draw_line == false) {
        console.log("Draw a point");
        if (dotproduct(theta, [event.offsetX - x_center, event.offsetY - y_center]) + theta0 >= 0) {
            green_coord_x.push(event.offsetX);
            green_coord_y.push(event.offsetY);
            // c.beginPath();
            // c.arc(event.offsetX, event.offsetY, 5, 0 , 2*Math.PI);
            // c.fillStyle = "green";
            // c.fill();
            // c.stroke();
        } else {
            red_coord_x.push(event.offsetX);
            red_coord_y.push(event.offsetY);            
            // c.beginPath();
            // c.arc(event.offsetX, event.offsetY, 5, 0 , 2*Math.PI);
            // c.fillStyle = "red";
            // c.fill();
            // c.stroke();        
        }
    } else { 
        // c.moveTo(line_start_x, line_start_y);      
        if (check_dl == false) {
            check_dl = true;   
            line_start_x = event.offsetX;
            line_start_y = event.offsetY;            
        } else {
            check_dl = false;   
            line_finish_x = event.offsetX;
            line_finish_y = event.offsetY;
            
        }
        
  
    }

    
});

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < green_coord_x.length; i++) {
        c.beginPath();
        c.arc(green_coord_x[i], green_coord_y[i], 5, 0 , 2*Math.PI);
        c.fillStyle = "green";
        c.fill();
        c.stroke();
    }
    for (let i = 0; i < red_coord_x.length; i++) {
        c.beginPath();
        c.arc(red_coord_x[i], red_coord_y[i], 5, 0 , 2*Math.PI);
        c.fillStyle = "red";
        c.fill();
        c.stroke();
    }   
    if (check_dl == true) {        
        console.log("drawing a line");
        c.beginPath();
        c.moveTo(line_start_x, line_start_y);
        c.lineTo(mouse_x, mouse_y);
        c.stroke();
    }
    if (draw_line == true) {
        c.beginPath();
        c.arc(line_start_x, line_start_y, 5, 0 , 2*Math.PI);
        c.fillStyle = "black";
        c.fill();
        c.stroke();  
        if (check_dl == false) {
            c.beginPath();
            c.arc(line_finish_x, line_finish_y, 5, 0 , 2*Math.PI);
            c.fillStyle = "black";
            c.fill();
            c.moveTo(line_start_x, line_start_y);
            c.lineTo(line_finish_x, line_finish_y);
            c.stroke();            
        }
    }
}

animate();