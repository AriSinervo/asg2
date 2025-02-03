class Cone {
    constructor(radius, height, shading=true, segments=36, stripy = false) {
        this.size = radius;
        this.height = height / 200.0;
        this.stripy = stripy;
        this.position = [0.0, 0.0, 0.0];
        this.color = [1, 1, 1, 1];
        this.shading = shading;
        this.segments = segments;
        this.matrix = new Matrix4();

        this.buffer = null;
        this.vertices = null;

        this.generateVeritces();
        this.initBuffers();
    }
    
    generateVeritces() {
        var rgba = this.color;

        var v = [];
        var d = this.size/200.0;

        let angleStep = 360 / this.segments;
        let center = [this.position[0], this.position[1], this.position[2]];
        let apex = [this.position[0], this.position[1] + this.height, this.position[2]];

        for(var angle = 0; angle < 360; angle=angle+angleStep) {
            var angle1 = angle;
            var angle2 = angle + angleStep;
            var shade = 1.0;

            var vec1 = [Math.cos(angle1 * Math.PI/180) * d, Math.sin(angle1 * Math.PI/180) * d];
            var vec2 = [Math.cos(angle2 * Math.PI/180) * d, Math.sin(angle2 * Math.PI/180) * d];

            var pt1 = [-(center[0] + vec1[1]), center[1], -(center[2] + vec1[0])];
            var pt2 = [-(center[0] + vec2[1]), center[1], -(center[2] + vec2[0])];


            if (this.stripy) {
                shade = Math.sqrt(Math.sin(angle)**2)
            } else {
                shade = 1.4 - (Math.sin(( (angle1) * Math.PI / 360 )));
            }

            if(this.shading) { gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]); }
            v.push(center[0], center[1], center[2], pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2]);
            if(this.shading) { gl.uniform4f(u_FragColor, rgba[0]*shade, rgba[1]*shade, rgba[2]*shade, rgba[3]); }
            v.push(apex[0], apex[1], apex[2], pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2]);
        }
        this.vertices = new Float32Array(v);
    }

    initBuffers() {
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        }
    }

    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);      
    }
}

class Disk {
    constructor(radius) {
        this.size = radius;
        this.position = [0.0, 0.0, 0.0];
        this.color = [1, 1, 1, 1];
        this.segments = 36;
        this.matrix = new Matrix4();

        this.buffer = null;
        this.vertices = null;

        this.generateVertices();
        this.initBuffers();
    }

    generateVertices() {
        var d = this.size/200.0;
        let v = [];
        let angleStep = 360 / this.segments;
        let center = [this.position[0], this.position[1], this.position[2]];

        for(var angle = 0; angle < 360; angle=angle+angleStep) {
            var angle1 = angle;
            var angle2 = angle + angleStep;

            var vec1 = [Math.cos(angle1 * Math.PI/180) * d, Math.sin(angle1 * Math.PI/180) * d];
            var vec2 = [Math.cos(angle2 * Math.PI/180) * d, Math.sin(angle2 * Math.PI/180) * d];

            var pt1 = [center[0] + vec1[0], center[1] + vec1[1], center[2]];
            var pt2 = [center[0] + vec2[0], center[1] + vec2[1], center[2]];

            v.push(center[0], center[1], center[2], pt1[0], pt1[1], pt1[2], pt2[0], pt2[1], pt2[2]);
        }

        this.vertices = new Float32Array(v);
    }

    initBuffers() {
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        }
    }
    
    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}

class SemiDisk {
    constructor(radius, angle=180, segments=36) {
        this.radius = radius;
        this.angle = angle;
        this.segments = segments;
        this.position = [0.0, 0.0, 0.0];
        this.color = [1, 1, 1, 1];
        this.matrix = new Matrix4();

        this.buffer = null;
        this.vertices = null;

        this.generateVertices();
        this.initBuffers();
    }

    generateVertices() {
        let vertices = [];
        let angleStep = this.angle / this.segments;

        for (let angle = 0; angle < this.angle; angle += angleStep) {
            let angle1 = angle;
            let angle2 = angle + angleStep;

            let vec1 = [
                Math.cos((angle1 * Math.PI) / 180) * this.radius / 200.0,
                Math.sin((angle1 * Math.PI) / 180) * this.radius / 200.0,
            ];
            let vec2 = [
                Math.cos((angle2 * Math.PI) / 180) * this.radius / 200.0,
                Math.sin((angle2 * Math.PI) / 180) * this.radius / 200.0,
            ];

            let pt1 = [this.position[0] + vec1[0], this.position[1] + vec1[1]];
            let pt2 = [this.position[0] + vec2[0], this.position[1] + vec2[1]];

            vertices.push(
                this.position[0], this.position[1],
                pt1[0], pt1[1],
                pt2[0], pt2[1]
            );
        }

        this.vertices = new Float32Array(vertices);
    }

    initBuffers() {
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        }
    }
    
    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 2);
    }
}

class Cylinder {
    constructor(facet_widths, height, shading=true, segments=36,) {
        if(facet_widths.length < 2) {
            console.log("Too few facets needs minimum of top and bottom");
            return -1;
        }
        this.height = height / 200.0;
        this.facets =   facet_widths.length;
        this.facet_widths = facet_widths;
        this.bottom = facet_widths[0];
        this.top = facet_widths[facet_widths.length - 1];
        this.position = [0.0, this.height/2, 0.0];
        this.color = [1, 1, 1, 1];
        this.shading = shading;
        this.segments = segments;
        this.matrix = new Matrix4();

        this.buffer = null;
        this.vertices = null;

        this.generateVertices();
        this.initBuffers();
    }

    generateVertices() {
        let v = [];
        var rgba = this.color;
        var steps = this.height / (this.facets - 1);
        var db = this.bottom/200.0;
        var dt = this.top/200.0;

        let angleStep = 360 / this.segments;
        let center = [this.position[0], this.position[1] - this.height/2, this.position[2]];
        let apex = [this.position[0], this.position[1] + this.height/2, this.position[2]];

        for(var angle = 0; angle < 360; angle=angle+angleStep) {
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            var angle1 = angle;
            var angle2 = angle + angleStep;
            var shade = 1.0;

            var vec1 = [Math.cos(angle1 * Math.PI/180), Math.sin(angle1 * Math.PI/180)];
            var vec2 = [Math.cos(angle2 * Math.PI/180), Math.sin(angle2 * Math.PI/180)];

            var pt1 = [-(center[0] + vec1[1]), center[1], -(center[2] + vec1[0])];
            var pt2 = [-(center[0] + vec2[1]), center[1], -(center[2] + vec2[0])];

            v.push(apex[0], apex[1], apex[2], pt1[0] * dt, pt1[1] + this.height, pt1[2] * dt, pt2[0] * dt, pt2[1] + this.height, pt2[2] * dt);
            v.push(center[0], center[1], center[2], pt1[0] * db, pt1[1], pt1[2] * db, pt2[0] * db, pt2[1], pt2[2] * db);

            if(this.shading) {
                shade = 1.65 - (Math.sin((angle1 * Math.PI / 360 )));
            }
            
            var prev_pt1 = [pt1[0] * db, pt1[1], pt1[2] * db];
            var prev_pt2 = [pt2[0] * db, pt2[1], pt2[2] * db];

            if(this.shading) { gl.uniform4f(u_FragColor, rgba[0]*shade, rgba[1]*shade, rgba[2]*shade, rgba[3]); }
                     
            if(this.facets > 2) {
                for(var i = 1; i <= this.facets - 2; i++) {
                    var rad = this.facet_widths[i] / 200.0;
                    
                    //drawTriangle3D([center[0], center[1] + steps * i, center[2], pt1[0] * rad, pt1[1] + steps * i, pt1[2] * rad, pt2[0] * rad, pt2[1] + steps * i, pt2[2] * rad]);

                    v.push(prev_pt1[0], prev_pt1[1], prev_pt1[2], pt1[0] * rad, pt1[1] + steps * i, pt1[2] * rad, pt2[0] * rad, pt2[1] + steps * i, pt2[2] * rad);
                    v.push(prev_pt1[0], prev_pt1[1], prev_pt1[2], prev_pt2[0], prev_pt2[1], prev_pt2[2], pt2[0] * rad, pt2[1] + steps * i, pt2[2] * rad);
                    prev_pt1 = [pt1[0] * rad, pt1[1] + steps * i, pt1[2] * rad];
                    prev_pt2 = [pt2[0] * rad, pt2[1] + steps * i, pt2[2] * rad];
                }
            }
            v.push(prev_pt1[0], prev_pt1[1], prev_pt1[2], pt1[0] * dt, pt1[1] + this.height, pt1[2] * dt, pt2[0] * dt, pt2[1] + this.height, pt2[2] * dt);
            v.push(prev_pt1[0], prev_pt1[1], prev_pt1[2], prev_pt2[0], prev_pt2[1], prev_pt2[2], pt2[0] * dt, pt2[1] + this.height, pt2[2] * dt);
        }
        this.vertices = new Float32Array(v);
    }

    initBuffers() {
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        }
    }

    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }


}

class Flower {
    constructor(inner, outer, petal_angle=30, segments=36, shading=true) {
        this.inner = inner;
        this.outer = outer;
        this.petal_angle = petal_angle;
        this.segments = segments;
        this.shading = shading;
        this.position = [0.0, 0.0, 0.0];
        this.color = [1, 1, 1, 1];
        this.petal_color = [1, 1, 1, 1];
        this.matrix = new Matrix4();
    }
    
    render() {
        var rgba1 = this.color;
        var rgba2 = this.petal_color;
        
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var d = this.inner/200.0;
        var dp = this.outer/200.0;

        var height_from_angle = (this.outer * Math.tan(this.petal_angle * Math.PI / 180)) / 200.0;
        
        let angleStep = 360 / this.segments;
        let center = [this.position[0], this.position[1], this.position[2]];

        for(var angle = 0; angle < 360; angle=angle+angleStep) {
            var angle1 = angle;
            var angle2 = angle + angleStep;

            var vec1 = [Math.cos(angle1 * Math.PI/180), Math.sin(angle1 * Math.PI/180)];
            var vec2 = [Math.cos(angle2 * Math.PI/180), Math.sin(angle2 * Math.PI/180)];

            var pt1 = [center[0] + vec1[0], center[1] + vec1[1], center[2]];
            var pt2 = [center[0] + vec2[0], center[1] + vec2[1], center[2]];

            gl.uniform4f(u_FragColor, rgba1[0], rgba1[1], rgba1[2], rgba1[3]);
            drawTriangle3D([center[0], center[1], center[2], pt1[0] * d, pt1[1] * d, pt1[2], pt2[0] * d, pt2[1] * d, pt2[2]]);
            gl.uniform4f(u_FragColor, rgba2[0], rgba2[1], rgba2[2], rgba2[3]);
            drawTriangle3D([pt1[0] * d, pt1[1] * d, pt1[2], pt2[0] * d, pt2[1] * d, pt2[2], pt2[0] * dp, pt2[1] * dp, pt2[2] + height_from_angle]);

        }
    }
}

class Triangle3d {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.position = [0.0, 0.0, 0.0];
        this.color = [1, 1, 1, 1];
        this.matrix = new Matrix4();

        this.buffer = null;
        this.vertices = null;

        this.generateVertices();
        this.initBuffers();
    }

    generateVertices() {
        var w = this.width / 200.0;
        var h = this.height / 200.0;
        var pt1 = [this.position[0] - w / 2, this.position[1], this.position[2]];
        var pt2 = [this.position[0] + w / 2, this.position[1], this.position[2]];
        var pt3 = [this.position[0], this.position[1] + h, this.position[2]];

        this.vertices = new Float32Array([
            pt1[0], pt1[1], pt1[2],
            pt2[0], pt2[1], pt2[2],
            pt3[0], pt3[1], pt3[2]
        ]);
    }

    initBuffers() {
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        }
    }

    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        this.matrix.rotate(90, 1, 0, 0);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}

class Square3d {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.position = [0.0, 0.0, 0.0];
        this.color = [1, 1, 1, 1];
        this.matrix = new Matrix4();

        this.buffer = null;
        this.vertices = null;

        this.generateVertices();
        this.initBuffers();
    }

    generateVertices() {
        var w = this.width / 200.0;
        var h = this.height / 200.0;
        var pt1 = [this.position[0] - w / 2, this.position[1] - h / 2, this.position[2]];
        var pt2 = [this.position[0] + w / 2, this.position[1] - h / 2, this.position[2]];
        var pt3 = [this.position[0] + w / 2, this.position[1] + h / 2, this.position[2]];
        var pt4 = [this.position[0] - w / 2, this.position[1] + h / 2, this.position[2]];

        this.vertices = new Float32Array([
            pt1[0], pt1[1], pt1[2],
            pt2[0], pt2[1], pt2[2],
            pt3[0], pt3[1], pt3[2],
            pt4[0], pt4[1], pt4[2]
        ]);
    }

    initBuffers() {
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            if (!this.buffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        }
    }

    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //this.matrix.rotate(90, 1, 0, 0);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length / 3);
    }
}