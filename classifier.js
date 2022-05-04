const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
let x_center = canvas.width / 2;
let y_center = canvas.height / 2;

const coef_ans = 0.95;
let trials = 0;

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

// c.beginPath();
// let line_coord_0_x = line_coords[0];
// let line_coord_0_y = line_coords[1];
// let line_coord_1_x = line_coords[2];
// let line_coord_1_y = line_coords[3];
// c.moveTo(line_coord_0_x, line_coord_0_y);
// c.lineTo(line_coord_1_x, line_coord_1_y);
// c.stroke();

function dotproduct(vec1, vec2) {
    let ans = 0;
    for (let i = 0; i < vec1.length; i++) {
        ans += vec1[i] * vec2[i];
    }
    return ans;
}

let draw_line = false;
let button_dl = document.querySelector("#draw_line");
let button_sl = document.querySelector("#submit_line");
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
})


canvas.addEventListener("click", function(event) {
    if (draw_line == false) {
        trials += 1;
        console.log("Draw a point");
        if (dotproduct(theta, [event.offsetX - x_center, event.offsetY - y_center]) + theta0 >= 0) {
            green_coord_x.push(event.offsetX);
            green_coord_y.push(event.offsetY);
        } else {
            red_coord_x.push(event.offsetX);
            red_coord_y.push(event.offsetY);   
        }
    } else {  
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

let show_points = false;

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


function intersection(vec1, a1, vec2, a2) {
    let x = (vec2[1]*a1/vec1[1] - a2)/(vec2[0] - vec2[1]*vec1[0]/vec1[1]);
    let y = -(a1 + vec1[0]*x)/vec1[1];
    return [x, y];
}

function line_to_vec(x1, y1, x2, y2) {
    let th0 = 1;
    let vec = intersection([x1, y1], th0, [x2, y2], th0);
    let thx = vec[0];
    let thy = vec[1];
    let th_abs = Math.sqrt(Math.pow(thx, 2) + Math.pow(thy, 2));
    thx = thx / th_abs;
    thy = thy / th_abs;
    th0 = th0 / th_abs;
    return [thx, thy, th0];
}

function find_wrong_area (vec1, a1, vec2, a2) {
    let direct = dotproduct(vec1, vec2) >= 0;
    let ans = 0;
    for (let i = 0; i < 1000000; i++) {
        let rand_x = canvas.width * (Math.random() - 0.5);
        let rand_y = canvas.height * (Math.random() - 0.5);
        if (direct) {
            if ((dotproduct(vec1, [rand_x, rand_y]) + a1) * (dotproduct(vec2, [rand_x, rand_y]) + a2) < 0) {
                ans += 1;
            }
        } else {
            if ((dotproduct(vec1, [rand_x, rand_y]) + a1) * (dotproduct(vec2, [rand_x, rand_y]) + a2) > 0) {
                ans += 1;
            }
        }
    }
    ans = ans / 1000000;
    return ans;
}

let points = document.querySelector("#points");

button_sl.addEventListener("click", function() {
    let vec_ans = line_to_vec(line_start_x - x_center, line_start_y - y_center, line_finish_x - x_center, line_finish_y - y_center);
    let ans = 1 - find_wrong_area([vec_ans[0], vec_ans[1]], vec_ans[2], theta, theta0);
    points.innerHTML = "Your score: " + (ans * Math.pow(coef_ans, trials)).toFixed(2);
})