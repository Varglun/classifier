const coef_ans = 1; // multiplier for each trial
const dot_radius = 5; // default radius of dots
const canvas_width = 500;
const canvas_height = 400;

const canvas_player = document.querySelector('#player');
const c_player = canvas_player.getContext('2d');
canvas_player.width = canvas_width;
canvas_player.height = canvas_height;

const canvas_enemy = document.querySelector('#enemy');
const c_enemy = canvas_enemy.getContext('2d');
canvas_enemy.width = canvas_width;
canvas_enemy.height = canvas_height;

let player_cl = new Classifier(canvas_width, canvas_height);
let enemy_cl = new Classifier(canvas_width, canvas_height);


let check_dl = false;
let draw_line = false;
let mouse_x;
let mouse_y;
let line_start_x = 0;
let line_start_y = 0;
let line_finish_x = 0;
let line_finish_y = 0;
let let_draw_line = false;
let button_dl = document.querySelector("#draw_line");
let button_sl = document.querySelector("#submit_line");

button_dl.addEventListener("click", function() {
    draw_line = true;
    canvas.addEventListener("mousemove", function (event) {
        mouse_x = event.offsetX;
        mouse_y = event.offsetY;
    })    
})

function animate() {
    window.requestAnimationFrame(animate);
    player.draw_rect();
    enemy.draw_rect();
    player.draw_dots();
    enemy.draw_dots();
    if (let_draw_line == true) {
        if (check_dl == false) {
            player.draw_dynamic_line([line_start_x, line_start_y], [line_finish_x, line_finish_y]);
            if (draw_seprators) {
                player.draw_separator();
                enemy.draw_best_class();
                enemy.draw_separator();
                player.draw_best_class();

            }

        } else {
            player.draw_dynamic_line([line_start_x, line_start_y], [mouse_x, mouse_y]);
        }
    }
}

// animate();

canvas.addEventListener("click", function(event) {
    if (draw_line == false) {
        player.add_dot([event.offsetX, event.offsetY]);
        enemy.add_best_dot();
    } else {  
        let_draw_line = true;
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

let draw_seprators = false;

button_sl.addEventListener("click", function() {
    draw_seprators = true;
    // canvas.removeEventListener("mousemove", handler);
    let ans = player.find_score([line_start_x, line_start_y], [line_finish_x, line_finish_y]);
    let pc_ans = enemy.find_auto_score();
    let player_auto_ans = player.find_auto_score();
    console.log("player auto: ", player_auto_ans);
    console.log("player best separator:", player.best_class, player.best_class0);
    console.log("player theta: ", player.theta, player.theta0);
    points.innerHTML = "Your score: " + (ans).toFixed(2);
    pc_points.innerHTML = "PC score: " + (pc_ans).toFixed(2);
    console.log("enemy separator: ", enemy.best_class, enemy.best_class0);
    console.log("enemy theta: ", enemy.theta, enemy.theta0);
})

player.draw_separator();
enemy.draw_separator();