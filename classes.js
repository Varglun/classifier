class Dot {
    constructor(coords, radius = dot_radius, color) {
        this._x = coords[0];
        this._y = coords[1];
        this.radius = radius;
        this.color = color;
    }

    draw(shift_x = 0, shift_y = 0) {
        c.beginPath();
        c.arc(this.x + shift_x, this.y + shift_y, this.radius, 0 , 2*Math.PI);
        c.fillStyle = this.color;
        c.fill();
        c.stroke();        
    }

    check_correct(theta, theta0) {
        if (dotproduct([this.x, this.y], theta) + theta0 > 0) {
            return 0;
        } else {
            return 1;
        }

    } 

    get x() {
        return this._x;
    }
    
    get y() {
        return this._y;
    }
}

class Green_dot extends Dot {
    constructor(coords, radius) {
        super(coords, radius, 'green');
    }
}

class Red_dot extends Dot {
    constructor(coords, radius) {
        super(coords, radius, 'red');
    }
}

class Dynamic_Line {
    constructor(color = 'black') {
        this.color = color;
    }
    
    draw(coords_start, coords_end, shift_x = 0, shift_y = 0) {
        c.beginPath();
        c.arc(coords_start[0], coords_start[1], 5, 0 , 2*Math.PI);
        c.fillStyle = "black";
        c.fill();     
        c.stroke();
        c.beginPath();   
        c.arc(coords_end[0], coords_end[1], 5, 0 , 2*Math.PI);
        c.fillStyle = "black";
        c.fill();  
        c.stroke();
        c.beginPath(); 
        c.strokeStyle = this.color;
        c.moveTo(coords_start[0] + shift_x, coords_start[1] + shift_y);
        c.lineTo(coords_end[0] + shift_x, coords_end[1] + shift_y);
        // console.log(`line from ${coords_start} to ${coords_end}`);
        c.stroke();
    }
}



class Classifier {
    constructor(center_x, center_y, width, height) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.width = width;
        this.height = height;
        this.trials = 0;
        this.green_dots = [];
        this.red_dots = [];
        this.theta = gen_theta();
        this.theta0 = gen_theta0(this.width, this.height);
        this.class_line = new Dynamic_Line();
        this.separator = new Dynamic_Line('red');
        this.best_class = gen_theta();
        this.best_class0 = gen_theta0(this.width, this.height);
    }

    draw_separator() {
        // let coord_x0 = (- this.theta0 - this.theta[1] * (-this.height/2)) / this.theta[0] + this.center_x;
        // let coord_y0 = -this.height/2 + this.center_y;
        // let coord_x1 = -this.width/2 + this.center_x;
        // let coord_y1 = (- this.theta0 - this.theta[1] * (-this.width/2))/ this.theta[1] + this.center_y;
        // console.log(`theta: ${this.theta}`);
        // console.log(`theta0: ${this.theta0}`);
        let coord_x0 = (- this.theta0 - this.theta[1] * (-this.height/2)) / this.theta[0];
        let coord_y0 = -this.height/2;
        let coord_x1 = -this.width/2;
        let coord_y1 = (- this.theta0 - this.theta[0] * (-this.width/2))/ this.theta[1];
        // console.log(`x0: ${coord_x0}, y0: ${coord_y0}`);
        // console.log(`x1: ${coord_x1}, y1: ${coord_y1}`);
        this.separator.draw(this.loc_to_gl([coord_x0, coord_y0]), this.loc_to_gl([coord_x1, coord_y1]));
    }

    draw_best_class() {
        let coord_x0 = - this.best_class0 / this.best_class[0] + this.center_x;
        let coord_y0 = this.center_y;
        let coord_x1 = this.center_x;
        let coord_y1 = - this.best_class0 / this.best_class[1] + this.center_y;
        // console.log(`x0: ${coord_x0}, y0: ${coord_y0}`);
        this.class_line.draw([coord_x0, coord_y0], [coord_x1, coord_y1]);
    }

    draw_rect() {
        c.rect(this.center_x - this.width / 2, this.center_y - this.height / 2, this.width, this.height)
        c.fillStyle = 'white';
        c.strokeStyle = 'black';
        c.fill();
        c.stroke();
    }

    add_green_dot(loc_coord) {
        console.log(`green dot at ${loc_coord}`);
        this.green_dots.push(new Green_dot(loc_coord));    
    }

    add_red_dot(loc_coord) {
        console.log(`red dot at ${loc_coord}`);
        this.red_dots.push(new Red_dot(loc_coord));
    }

    add_dot(gl_coord) {
        if (this.check_coord_inside(gl_coord)) {
            this.trials += 1;
            let loc_coord = this.gl_to_loc(gl_coord);
            if (dotproduct(this.theta, loc_coord) + this.theta0 >= 0) {
                this.add_green_dot(loc_coord);
            } else {
                this.add_red_dot(loc_coord);
            }
        }       
    }

    draw_dots() {
        // draw green dots
        for (let gr_dot of this.green_dots) {
            gr_dot.draw(this.center_x, this.center_y);
        }
        // draw red dots
        for (let rd_dot of this.red_dots) {
            rd_dot.draw(this.center_x, this.center_y);
        }  
    }

    draw_dynamic_line(coords_start, coords_end) {
        this.class_line.draw(coords_start, coords_end);
    }

    // draw_dynamic_line

    find_score (gl_coords_start, gl_coords_end) {
        console.log("findfing score with coords:", gl_coords_start, gl_coords_end);
        let vec_ans = line_to_vec(this.gl_to_loc(gl_coords_start), this.gl_to_loc(gl_coords_end));
        let vec1 = [vec_ans[0], vec_ans[1]];
        let a1 = vec_ans[2];
        console.log(`vec_ans = ${vec_ans}, vec1 = ${vec1}, a1 = ${a1}`);
        let direct = dotproduct(vec1, this.theta) >= 0;
        console.log(`direct = ${direct}`);
        let ans = 0;
        for (let i = 0; i < 1000000; i++) {
            let rand_x = this.width * ( -1 / 2 + 1 / 1000 * (i % 1000));
            let rand_y = this.height * ( -1 / 2 + 1 / 1000 * Math.floor(i / 1000));
            if (direct) {
                if ((dotproduct(vec1, [rand_x, rand_y]) + a1) * (dotproduct(this.theta, [rand_x, rand_y]) + this.theta0) < 0) {
                    ans += 1;
                }
            } else {
                if ((dotproduct(vec1, [rand_x, rand_y]) + a1) * (dotproduct(this.theta, [rand_x, rand_y]) + this.theta0) > 0) {
                    ans += 1;
                }
            }
            if (i%100956 == 0) {
                console.log(`coords: ${rand_x}, ${rand_y}. Dotproduct = ${(dotproduct(vec1, [rand_x, rand_y]) + a1) * (dotproduct(this.theta, [rand_x, rand_y]) + this.theta0)}`)
                console.log(`ans = ${ans}`);
            }
        }
        ans = 1 - ans / 1000000;
        return ans * Math.pow(coef_ans, this.trials);
    }

    // change coordinates from global to local and wiseverse
    gl_to_loc(glob_coords) {
        let loc_x = glob_coords[0] - this.center_x;
        let loc_y = glob_coords[1] - this.center_y;
        return [loc_x, loc_y];
    }
    loc_to_gl(loc_coords) {
        let gl_x = loc_coords[0] + this.center_x;
        let gl_y = loc_coords[1] + this.center_y;
        return [gl_x, gl_y];
    }    

    check_coord_inside(gl_coord) {
        let loc_coor = this.gl_to_loc(gl_coord);
        if (Math.abs(loc_coor[0]) <= this.width / 2 && Math.abs(loc_coor[1]) <= this.height / 2) {
            return true;
        } else {
            return false;
        }
    }

    add_best_dot() {
        // if (this.trials < 2) {
            let rand_x = (Math.random() - 1/2) * this.width;
            let rand_y = (Math.random() - 1/2) * this.height;
            this.add_dot(this.loc_to_gl([rand_x, rand_y]));
        // } else {

        // }
    }

    calc_best_classifier () {
        for (let i = 0; i < 20; i++) {
            for (let gr_dot of this.green_dots) {
                if (gr_dot.check_correct(this.best_class, this.best_class0) == 1) {
                    this.best_class[0] -= gr_dot.x;
                    this.best_class[1] -= gr_dot.y;
                    this.best_class0 -= 1;

                }
            }
            for (let rd_dot of this.red_dots) {
                if (rd_dot.check_correct(this.best_class, this.best_class0) == 0) {
                    this.best_class[0] -= rd_dot.x;
                    this.best_class[1] -= rd_dot.y;
                    this.best_class0 -= 1;

                }
            }
        }
    }

    find_auto_score() {
        let coord_x0 = - this.best_class0 / this.best_class[0] + this.center_x;
        let coord_y0 = this.center_y;
        let coord_x1 = this.center_x;
        let coord_y1 = - this.best_class0 / this.best_class[1] + this.center_y;
        return this.find_score([coord_x0, coord_y0], [coord_x1, coord_y1]);
    }

    // next_dot() {

    // }
}


