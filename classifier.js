const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

let theta = [Math.random()*5 - 2.5, Math.random()*5 - 2.5];
// let theta0 = -1 * (500 + Math.random()*3000);
let theta0_sign = Math.floor(Math.random()*2)*2 - 1;
let theta0_abs = Math.random()*100;
let theta0 = theta0_sign * theta0_abs;
let x0 = - theta0 / theta[0] + canvas.width / 2;
let y0 = - theta0 / theta[1] + canvas.height / 2;

console.log(`theta = ${theta}`);
console.log(`theta0 = ${theta0}`);
console.log(`x0 = ${x0}`);
console.log(`y0 = ${y0}`);

c.beginPath();
c.rect(0, 0, canvas.width, canvas.height);
let line_coord_0_x = x0;
let line_coord_0_y = 0;
let line_coord_1_x = 0;
let line_coord_1_y = y0;
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


window.addEventListener("click", function(event) {
    // console.log(event)
    if (dotproduct(theta, [event.offsetX, event.offsetY]) + theta0 >= 0) {
        c.beginPath();
        c.arc(event.offsetX, event.offsetY, 5, 0 , 2*Math.PI);
        c.fillStyle = "green";
        c.fill();
        c.stroke();
    } else {
        c.beginPath();
        c.arc(event.offsetX, event.offsetY, 5, 0 , 2*Math.PI);
        c.fillStyle = "red";
        c.fill();
        c.stroke();        
    }
    
});