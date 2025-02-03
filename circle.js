class Circle {
    constructor() {
        this.type = 'circle'; 
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 10;
        this.segments = 10;
    }

    render() {
        let xy = this.position;
        let rgba = this.color;
        let size = this.size;

        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], xy[2]);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // draw
        var d = size/200.0;

        let angleStep = 360 / this.segments;
        for(var angle = 0; angle < 360; angle=angle+angleStep) {
            let center = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            
            let vec1 = [Math.cos(angle * Math.PI/180) * d, Math.sin(angle * Math.PI/180) * d];
            let vec2 = [Math.cos((angle + angleStep) * Math.PI/180) * d, Math.sin((angle + angleStep) * Math.PI/180) * d];

            let pt1 = [center[0] + vec1[0], center[1] + vec1[1]];
            let pt2 = [center[0] + vec2[0], center[1] + vec2[1]];


            drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
        }
    }
}