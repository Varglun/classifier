function gen_theta() {
    let alpha = Math.random()*2*Math.PI;
    let x = Math.cos(alpha);
    let y = Math.sin(alpha);
    return [x, y];
}

function gen_theta0(width, height) {
    let theta0_sign = Math.floor(Math.random()*2)*2 - 1;
    let theta0_abs = Math.random() * Math.min(width, height) * 0.5;
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

function dotproduct(vec1, vec2) {
    let ans = 0;
    for (let i = 0; i < vec1.length; i++) {
        ans += vec1[i] * vec2[i];
    }
    return ans;
}

function intersection(vec1, a1, vec2, a2) {
    console.log(`intersection: vec1 = ${vec1}, vec2 = ${vec2}`);
    let x;
    let y;
    if (vec1[0] == 0) {
        y = -a1 / vec1[1];
        if (vec2[1] == 0) {
            x = -a2 /vec2[0];
        } else {
            x = (-vec2[1] * y - a2) / vec2[0];
        }
    } else if (vec1[1] == 0) {
        x = -a1 / vec1[0];
        if (vec2[0] == 0) {
            y = -a2 / vec2[1];
        } else {
            y = (-a2 - vec2[0] * x) / vec2[1];
        }
    } else if (vec2[0] == 0) {
        y = -a2 / vec2[1];
        x = (-vec1[1] * y - a1) / vec1[0];
    } else if (vec2[1] == 0) {
        x = -a2 / vec2[0];
        y = (-a1 - vec1[0] * x) / vec1[1];
    } else {
        x = (vec2[1]*a1/vec1[1] - a2)/(vec2[0] - vec2[1]*vec1[0]/vec1[1]);
        y = -(a1 + vec1[0]*x)/vec1[1];
    }

    console.log(`intersection: x = ${x}, y = ${y}`);
    return [x, y];
}

function line_to_vec(coords_start, coords_end) {
    let th0 = 1;
    let vec = intersection(coords_start, th0, coords_end, th0);
    let thx = vec[0];
    let thy = vec[1];
    let th_abs = Math.sqrt(Math.pow(thx, 2) + Math.pow(thy, 2));
    thx = thx / th_abs;
    thy = thy / th_abs;
    th0 = th0 / th_abs;
    console.log(`line to vec: vec = ${vec}, th_abs = ${th_abs}`)
    return [thx, thy, th0];
}
