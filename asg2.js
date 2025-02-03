var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {\n
    gl_FragColor = u_FragColor;
  }`

//global variables
let canvas;
let gl;

let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ModelViewMatrix;
 
let g_selectedSegments = 10;
let g_globalAngle = 0;
let g_globalAngle2 = 0;
let g_globalAngle3 = 0;
let g_globalScale = 1;
let cameraX = 0;
let cameraY = 0.2;
let cameraZ = 3.5;

var perspectiveTog = true;
var groundTog = true;
var surpDetailTog = true;
var charTog = true;
var shading = false;

let leftArmAngleX = 0;
let leftArmAngleY = 0;
let leftArmAngleZ = 0;

let RightArmAngleX = 0;
let RightArmAngleY = 0;
let RightArmAngleZ = 0;

let leftLegAngleX = 0;
let leftLegAngleY = 0;
let leftLegAngleZ = 0;

let RightLegAngleX = 0;
let RightLegAngleY = 0;
let RightLegAngleZ = 0;

let TorsoAngleX = 0;
let TorsoAngleY = 0;
let TorsoAngleZ = 0;

let HeadAngleX = 0;
let HeadAngleY = 0;
let HeadAngleZ = 0;

let leftFootAngle = 0;
let RightFootAngle = 0;

let ManElbowL = 0;
let ManElbowR = 0;

let ManKneeL = 0;
let ManKneeR = 0;

let CharHeight = 0;

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;
var pauseOffset = 0;

var AnimationTF = true;
var AnimationMode = 0;
let isDragging = false;

var leftOffArm = 0;
var leftOffElbow = 0;
var leftOffHead = 0;


function main() {
    console.log('Welcome to CSE 160');

    setupWebGL();
    connectVariablesToGLSL();
    addActionsFromHtmlUI();

    AnimationMode = Math.floor(Math.random() * 9);

    //gl.clearColor(g_canvasColor[0], g_canvasColor[1], g_canvasColor[2], g_canvasColor[3]);
    gl.clearColor(0.2, 0.45, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    renderScene();

    requestAnimationFrame(tick);
}

function tick() {
    if(AnimationTF){
      g_seconds = performance.now()/1000.0 - g_startTime;
    } //else {
    //    pauseOffset += performance.now()/1000.0-g_startTime-g_seconds;
    //}
    //console.log(pauseOffset);
    updateAnimationAngles();
    renderScene();
    requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if(AnimationTF) {
    if(AnimationMode == 0) {
      TorsoAngleZ = 3*Math.sin(2*g_seconds);
      leftArmAngleX = 10*Math.sin(g_seconds);
      leftArmAngleY = Math.abs(15*Math.sin(g_seconds));
      leftArmAngleZ = 5*Math.sin(g_seconds);

      RightArmAngleX = 10*Math.sin(g_seconds);
      RightArmAngleY = Math.abs(15*Math.sin(g_seconds));
      RightArmAngleZ = 5*Math.sin(g_seconds);

      HeadAngleZ = 5*Math.sin(2*g_seconds);
    }

    if(AnimationMode == 1) {
      // Wave
      //console.log(g_seconds);
      leftLegAngleY = 20;
      leftLegAngleZ = 7;
      RightLegAngleY = 20;
      RightLegAngleZ = 7;

      RightArmAngleX = 5*Math.sin(g_seconds);
      RightArmAngleY = Math.abs(15*Math.sin(g_seconds));
      RightArmAngleZ = 2*Math.sin(g_seconds);

      if(g_seconds < 0.2) {
        TorsoAngleZ = 15*Math.sin(100 * g_seconds);
      }
      if(g_seconds < 0.3) {
        TorsoAngleZ = 15*Math.sin(10 * g_seconds);
      }
      if(g_seconds < 0.6) {
        TorsoAngleZ = 15*Math.sin(2 * g_seconds);
      }

      if(g_seconds > 0.5 && g_seconds < 5) {
        //leftArmAngleY = 90*Math.sin(5 * g_seconds);
        leftArmAngleZ = Math.abs(120*Math.sin(5 * g_seconds)); 
        //TorsoAngleZ = 5*Math.sin(g_seconds / 0.6);
        //leftLegAngleX = (10*Math.sin(g_seconds));
        //leftLegAngleZ = -(10*Math.sin(0.5 * g_seconds));


        //RightLegAngleX = -(10*Math.sin(g_seconds));
      }

      HeadAngleZ = 5*Math.sin(g_seconds);

      if(g_seconds > 5.1 && g_seconds < 5.2) {
        TorsoAngleZ = 13.5;
        leftArmAngleZ = 30;
      }
      if(g_seconds > 5.2 && g_seconds < 5.25) {
        TorsoAngleZ = 10;
        leftArmAngleZ = 15;
      }
      if(g_seconds > 5.25 && g_seconds < 5.3) {
        TorsoAngleZ = 7.5;
        leftArmAngleZ = 7.5;
      }
      if(g_seconds > 5.3 && g_seconds < 5.35) {
        TorsoAngleZ = 5;
        leftArmAngleZ = 4.5;
      }
      if(g_seconds > 5.35 && g_seconds < 5.45) {
        TorsoAngleZ = 4.5;
        leftArmAngleZ = 3.5;
      }
      if(g_seconds > 5.45 && g_seconds < 5.5) {
        TorsoAngleZ = 0;
        leftArmAngleZ = 0;
      }
      if(g_seconds > 5.5 && g_seconds < 9.9) {
        leftArmAngleX = 5*Math.sin(g_seconds);
        leftArmAngleY = Math.abs(15*Math.sin(g_seconds));
        leftArmAngleZ = 2*Math.sin(g_seconds);
      }
      if(g_seconds > 10) {
        leftArmAngleX = 0;
        leftArmAngleY = 0;
        leftArmAngleZ = 0;
        leftLegAngleX = 0;
        leftLegAngleY = 0;
        leftLegAngleZ = 0;
        RightArmAngleX = 0;
        RightArmAngleY = 0;
        RightArmAngleZ = 0;
        RightLegAngleX = 0;
        RightLegAngleY = 0;
        RightLegAngleZ = 0;
        HeadAngleX = 0;
        HeadAngleY = 0;
        HeadAngleZ = 0;
        TorsoAngleX = 0;
        TorsoAngleY = 0;
        TorsoAngleZ = 0;
        leftFootAngle = 0;
        RightFootAngle = 0;
        ManElbowL = 0;
        ManElbowR = 0;
        ManKneeL = 0;
        ManKneeR = 0;
        CharHeight = 0;
        g_startTime = performance.now()/1000.0;
        g_seconds = performance.now()/1000.0-g_startTime;
      }
    }
    if(AnimationMode == 2) {
      // Walk cycle
      TorsoAngleZ = 3*Math.sin(2*g_seconds);
      TorsoAngleX = -Math.abs(5*Math.sin(g_seconds));
      HeadAngleZ = 5*Math.sin(g_seconds);
      HeadAngleX = -Math.abs(5*Math.sin(g_seconds));



      leftArmAngleX = 25*Math.sin(2*g_seconds);
      RightArmAngleX = -25*Math.sin(2*g_seconds);

      leftLegAngleX = -25*Math.sin(2*g_seconds);
      RightLegAngleX = 25*Math.sin(2*g_seconds);
      leftlegAngleZ = 5*Math.sin(2*g_seconds);
      RightLegAngleZ = -5*Math.sin(2*g_seconds);

      leftFootAngle = 25*Math.sin(2*g_seconds);
      RightFootAngle = -25*Math.sin(2*g_seconds);
      //leftArmAngleZ = 45*Math.sin(g_seconds);
      //RightArmAngleZ = -45*Math.sin(g_seconds);
      //leftLegAngleZ = -45*Math.sin(g_seconds);
      //RightLegAngleZ = 45*Math.sin(g_seconds);
    }
    if(AnimationMode == 3) {
      // Dance
      leftLegAngleX = 10*Math.sin(2*g_seconds);
      leftLegAngleY = 20 + 10*Math.sin(2*g_seconds);
      leftLegAngleZ = 7 - 4*Math.sin(5*g_seconds);
      RightLegAngleX = -10*Math.sin(3*g_seconds);
      RightLegAngleY = 20 + 10*Math.sin(2*g_seconds);
      RightLegAngleZ = 7 + 3*Math.sin(5*g_seconds);

      TorsoAngleY = 15*Math.sin(2*g_seconds);
      TorsoAngleZ = 3*Math.sin(2*g_seconds);
      TorsoAngleX = -Math.abs(10*Math.sin(g_seconds));
      HeadAngleZ = 5*Math.sin(g_seconds);
      HeadAngleX = -Math.abs(15*Math.sin(5 * g_seconds));

      leftArmAngleX = -Math.abs(20*Math.sin(2*g_seconds));
      leftArmAngleY = -Math.abs(15*Math.sin(2*g_seconds));
      leftArmAngleZ = Math.abs(120*Math.sin(2*g_seconds));

      RightArmAngleX = Math.abs(50*Math.sin(2*g_seconds));
      RightArmAngleY = -Math.abs(90*Math.sin(2*g_seconds));
      RightArmAngleZ = Math.abs(10*Math.sin(2*g_seconds));
    }

    if(AnimationMode == 4) {
      // Bored
      leftLegAngleX = 20*Math.sin(g_seconds);
      leftLegAngleY = -5;
      leftLegAngleZ = -2;
      RightLegAngleX = -5*Math.sin(g_seconds);
      RightLegAngleY = -5;
      RightLegAngleZ = -2;

      HeadAngleX = -Math.abs(10*Math.sin(0.5 * g_seconds));
      //HeadAngleY = 5*Math.sin(2*g_seconds);
      //HeadAngleZ = 5*Math.sin(2*g_seconds);

      TorsoAngleX = 5*Math.sin(g_seconds);

      leftArmAngleY = -80;
      leftArmAngleZ = -110;
      leftArmAngleX = 70;

      RightArmAngleY = -80;
      RightArmAngleZ = -110;
      RightArmAngleX = 70;
    }

    if(AnimationMode == 5) {
      // Tapping foot
      leftArmAngleX = 55 + 5*Math.sin(2*g_seconds);
      leftArmAngleY = -30;
      ManElbowL = -80 + 12*Math.sin(2*g_seconds);

      TorsoAngleY = 10;
      TorsoAngleX = -5 - Math.abs(3*Math.sin(g_seconds));

      HeadAngleX = -Math.abs(5*Math.sin(g_seconds));

      RightArmAngleX = 5*Math.sin(0.5 * g_seconds);
      RightArmAngleY = Math.abs(5*Math.sin(0.5 * g_seconds));
      RightArmAngleZ = 5*Math.sin(0.5 * g_seconds);

      leftLegAngleX = -10;
      leftLegAngleY = 20;
      leftFootAngle = -30;

      RightLegAngleX = 20
      RightLegAngleY = 25;
      RightLegAngleZ = 10;

      ManKneeR = 20 + 2*Math.sin(2*g_seconds);
      RightFootAngle = -5-Math.abs(30*Math.sin(7*g_seconds));

      CharHeight = -0.05

    }

    if(AnimationMode == 6) { 
      CharHeight = Math.abs(0.5*Math.sin(5+2*g_seconds));
      leftArmAngleX = -30 + Math.abs(75*Math.sin(2*g_seconds));
      RightArmAngleX = -30 + Math.abs(85*Math.sin(2*g_seconds));

      leftLegAngleX = 40*Math.sin(4*g_seconds);
      //leftLegAngleY = 20 + 10*Math.sin(2*g_seconds);
      //leftLegAngleZ = 7 - 4*Math.sin(5*g_seconds);
      RightLegAngleX = 25+50*Math.sin(4*g_seconds);
      //RightLegAngleY = 20 + 10*Math.sin(2*g_seconds);
      //RightLegAngleZ = 7 + 3*Math.sin(5*g_seconds);

      TorsoAngleX = -Math.abs(20*Math.sin(2*g_seconds));

      HeadAngleZ = 5*Math.sin(g_seconds);
    }

    if(AnimationMode == 7) {
      // Fist Pump

      //console.log(g_seconds);
      leftLegAngleY = 30;
      leftLegAngleZ = 14;
      RightLegAngleY = 20;
      RightLegAngleZ = 7;
    
      if(g_seconds < 0.8) {
        TorsoAngleY = -20 - Math.abs(10*Math.sin(2*g_seconds));
        TorsoAngleZ = -Math.abs(5*Math.sin(2*g_seconds));
        TorsoAngleX = -5-Math.abs(30*Math.sin(2*g_seconds));
      }

      if(g_seconds > 0.5 && g_seconds < 0.8) {
        leftArmAngleX = 110*Math.sin(1*g_seconds);
        ManElbowL = -40*Math.sin(1*g_seconds);
      }
      if (g_seconds > 0.8 && g_seconds < 1) {
        leftArmAngleX = 110*Math.sin(1*g_seconds)-120*Math.sin(1*g_seconds);
        ManElbowL = -40*Math.sin(1*g_seconds)-140*Math.sin(1*g_seconds);
      }

      if(g_seconds > 1 && g_seconds < 1.05) {
        TorsoAngleY = -29;
        TorsoAngleZ =  -5
        TorsoAngleX =  -35;
        leftArmAngleX = -20;
        ManElbowL = - 140;
      }
      if(g_seconds > 1.05 && g_seconds < 1.1) {
        TorsoAngleY = -28;
        TorsoAngleZ =  -5;
        TorsoAngleX =  -32;
        leftArmAngleX = -15;
        ManElbowL = - 120;

      }
      if(g_seconds > 1.1 && g_seconds < 1.15) {
        TorsoAngleY = -26;
        TorsoAngleZ =  -4;
        TorsoAngleX =  -29;
        leftArmAngleX = -10;
        ManElbowL = - 70;
      } 
      if(g_seconds > 1.15 && g_seconds < 1.2) {
        TorsoAngleY = -25;
        TorsoAngleZ =  -3;
        TorsoAngleX =  -24;
        leftArmAngleX = -5;
        ManElbowL = - 20;
      }
      if(g_seconds > 1.2 && g_seconds < 1.25) {
        TorsoAngleY = -23;
        TorsoAngleZ =  -2;
        TorsoAngleX =  -15;
        leftArmAngleX = 0;
        ManElbowL = - 10;
      }
      if(g_seconds > 1.25 && g_seconds < 1.3) {
        TorsoAngleY = -22;
        TorsoAngleZ =  1;
        TorsoAngleX =  -10;
        ManElbowL = - 5;
      }
      if(g_seconds > 1.3 && g_seconds < 1.35) {
        TorsoAngleY = -21;
        TorsoAngleZ =  1;
        TorsoAngleX =  -7;
        ManElbowL = 0;
      }
      if(g_seconds > 1.35 && g_seconds < 1.4) {
        TorsoAngleY = -20;
        TorsoAngleZ =  0;
        TorsoAngleX =  5;
      }

      leftArmAngleY = Math.abs(15*Math.sin(g_seconds));
      leftArmAngleZ = 2*Math.sin(g_seconds);

      RightArmAngleX = -5*Math.sin(g_seconds);
      RightArmAngleY = Math.abs(15*Math.sin(g_seconds));
      RightArmAngleZ = 2*Math.sin(g_seconds);

      leftLegAngleX = 20;
      ManKneeL = -20;
      leftFootAngle = 30;

      if(g_seconds > 1.8 && g_seconds < 2) {
        leftArmAngleX = 0;
        leftArmAngleY = 0;
        leftArmAngleZ = 0;
        leftLegAngleX = 0;
        leftLegAngleY = 0;
        leftLegAngleZ = 0;
        RightArmAngleX = 0;
        RightArmAngleY = 0;
        RightArmAngleZ = 0;
        RightLegAngleX = 0;
        RightLegAngleY = 0;
        RightLegAngleZ = 0;
        HeadAngleX = 0;
        HeadAngleY = 0;
        HeadAngleZ = 0;
        TorsoAngleX = 0;
        TorsoAngleY = 0;
        TorsoAngleZ = 0;
        leftFootAngle = 0;
        RightFootAngle = 0;
        ManElbowL = 0;
        ManElbowR = 0;
        ManKneeL = 0;
        ManKneeR = 0;
        CharHeight = 0;
        g_startTime = performance.now()/1000.0;
        g_seconds = performance.now()/1000.0-g_startTime;
      }


    }
    if(AnimationMode == 8) {
      // Face Palm
      TorsoAngleY = 10;
      TorsoAngleX = -10;
      leftLegAngleY = 20;
      leftLegAngleZ = 7;
      RightArmAngleX = 30;
      //RightLegAngleY = 50;
      RightLegAngleZ = 10;
      ManKneeR = -5;
      RightFootAngle = 10;


      RightArmAngleX = 10-5*Math.sin(g_seconds);
      RightArmAngleY = 15+Math.abs(15*Math.sin(g_seconds));
      RightArmAngleZ = -10+2*Math.sin(g_seconds);

      if(g_seconds < 0.5) {
        leftArmAngleX = 110*Math.sin(2*g_seconds);
        leftOffArm = leftArmAngleX;
        ManElbowL = -50*Math.sin(1*g_seconds);
        leftOffElbow = ManElbowL;
        HeadAngleX = 15*Math.sin(2*g_seconds);
        leftOffHead = HeadAngleX;
        //TorsoAngleY = -20 - Math.abs(10*Math.sin(2*g_seconds));
        //TorsoAngleZ = -Math.abs(5*Math.sin(2*g_seconds));
        //TorsoAngleX = -5-Math.abs(30*Math.sin(2*g_seconds));
      }

      if(g_seconds > 1 && g_seconds < 1.25) {
        HeadAngleX = leftOffHead - Math.abs(15*Math.sin(0.25 * g_seconds * Math.PI));

      }

      if(g_seconds > 0.7 && g_seconds < 4) {
        HeadAngleX = 15*Math.sin(2*g_seconds);
        HeadAngleY = 25*Math.sin(2 * g_seconds * Math.PI);
        leftArmAngleX = leftOffArm - 5 + 15*Math.sin(2*g_seconds);
        TorsoAngleX = -25*Math.sin(0.25*g_seconds);
      }

      if(g_seconds > 4 && g_seconds < 5) {
        HeadAngleY = 25*Math.sin(2 * g_seconds * Math.PI);
        leftOffArm = leftArmAngleX;
      }

      if(g_seconds >  5 && g_seconds < 5.5) {
        leftArmAngleX = leftOffArm + 90*Math.sin(2*g_seconds);
        ManElbowL = leftOffElbow - 50*Math.sin(2*g_seconds);
        HeadAngleX = leftOffHead - Math.abs(15*Math.sin(0.25*g_seconds));
      }


      if(g_seconds > 6) {
        leftArmAngleX = 0;
        leftArmAngleY = 0;
        leftArmAngleZ = 0;
        leftLegAngleX = 0;
        leftLegAngleY = 0;
        leftLegAngleZ = 0;
        RightArmAngleX = 0;
        RightArmAngleY = 0;
        RightArmAngleZ = 0;
        RightLegAngleX = 0;
        RightLegAngleY = 0;
        RightLegAngleZ = 0;
        HeadAngleX = 0;
        HeadAngleY = 0;
        HeadAngleZ = 0;
        TorsoAngleX = 0;
        TorsoAngleY = 0;
        TorsoAngleZ = 0;
        leftFootAngle = 0;
        RightFootAngle = 0;
        ManElbowL = 0;
        ManElbowR = 0;
        ManKneeL = 0;
        ManKneeR = 0;
        CharHeight = 0;
        g_startTime = performance.now()/1000.0;
        g_seconds = performance.now()/1000.0-g_startTime;
      }
    }
  }
}

function setupWebGL() {
    canvas = document.getElementById('webgl');

    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

    if (!gl) {
        console.log('Failed to get the WebGL context');
        return -1;
    }   
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function connectVariablesToGLSL() {
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
}

function renderGround() { 

  rgb_bush = [0.0, 0.875, 0.45, 1.0];
  rgb_grass = [0.0, 1.0, 0.45, 1.0];
  rgb_flower1 = [1.0, 1.0, 1.0, 1.0];
  rgb_flower2 = [1.0, 0.6, 0.6, 1.0];
  rgb_flower3 = [0.0, 0.5, 1.0, 1.0];
  rgb_flower4 = [0.8, 0.5, 1.0, 1.0];
  rgb_flower5 = [1.0, 0.8, 0.2, 1.0];

  var grass = new Disk (500);
  grass.color = rgb_grass;
  grass.matrix.rotate(270, 1, 0, 0);
  grass.matrix.translate(0.0, 0.0, -0.752);
  grass.matrix.scale(1.0, 1.0, 0.1);
  grass.render();



  // render flowers ------------------------------

  if(surpDetailTog) {
    var flow1 = new Flower(25, 50, 15, 8);
    flow1.color = [1.0, 1.0, 0.0, 1.0];
    flow1.petal_color = rgb_flower1;
    flow1.matrix.rotate(270, 1, 0, 0);
    flow1.matrix.translate(0.75, 0.5, -0.75);
    flow1.matrix.scale(0.5, 0.5, 0.5);
    flow1.render();

    var flow2 = new Flower(25, 50, 15, 8);
    flow2.color = [1.0, 1.0, 0.0, 1.0];
    flow2.petal_color = rgb_flower1;
    flow2.matrix.rotate(270, 1, 0, 0);
    flow2.matrix.translate(-0.8, 0.4, -0.75);
    flow2.matrix.scale(0.5, 0.5, 0.5);
    flow2.render();

    var flow3 = new Flower(25, 50, 15, 8);
    flow3.color = [1.0, 1.0, 0.0, 1.0];
    flow3.petal_color = rgb_flower1;
    flow3.matrix.rotate(270, 1, 0, 0);
    flow3.matrix.translate(0.6, -0.7, -0.75);
    flow3.matrix.scale(0.5, 0.5, 0.5);
    flow3.render();

    var flow4 = new Flower(25, 50, 15, 8);
    flow4.color = [1.0, 1.0, 0.0, 1.0];
    flow4.petal_color = rgb_flower2;
    flow4.matrix.rotate(270, 1, 0, 0);
    flow4.matrix.translate(0.5, 1.2, -0.75);
    flow4.matrix.scale(0.4, 0.4, 0.4);
    flow4.render();

    var flow5 = new Flower(25, 50, 15, 8);
    flow5.color = [1.0, 1.0, 0.0, 1.0];
    flow5.petal_color = rgb_flower2;
    flow5.matrix.rotate(270, 1, 0, 0);
    flow5.matrix.translate(-0.6, -0.8, -0.75);
    flow5.matrix.scale(0.4, 0.4, 0.4);
    flow5.render();

    var flow6 = new Flower(25, 50, 15, 8);
    flow6.color = [1.0, 1.0, 0.0, 1.0];
    flow6.petal_color = rgb_flower3;
    flow6.matrix.rotate(270, 1, 0, 0);
    flow6.matrix.translate(-1.3, 0.7, -0.75);
    flow6.matrix.scale(0.4, 0.4, 0.4);
    flow6.render();

    var flow7 = new Flower(25, 50, 15, 8);
    flow7.color = [1.0, 1.0, 0.0, 1.0];
    flow7.petal_color = rgb_flower3;
    flow7.matrix.rotate(270, 1, 0, 0);
    flow7.matrix.translate(1.4, -0.8, -0.75);
    flow7.matrix.scale(0.5, 0.5, 0.5);
    flow7.render();

    var flow8 = new Flower(25, 50, 15, 8);
    flow8.color = [1.0, 1.0, 0.0, 1.0];
    flow8.petal_color = rgb_flower3;
    flow8.matrix.rotate(270, 1, 0, 0);
    flow8.matrix.translate(1.0, -0.1, -0.75);
    flow8.matrix.scale(0.3, 0.3, 0.3);
    flow8.render();

    var flow9 = new Flower(25, 50, 15, 8);
    flow9.color = [1.0, 1.0, 0.0, 1.0];
    flow9.petal_color = rgb_flower3;
    flow9.matrix.rotate(270, 1, 0, 0);
    flow9.matrix.translate(-1.4, -0.8, -0.75);
    flow9.matrix.scale(0.45, 0.45, 0.45);
    flow9.render();

    var flow10 = new Flower(25, 50, 15, 8);
    flow10.color = [1.0, 1.0, 0.0, 1.0];
    flow10.petal_color = rgb_flower3;
    flow10.matrix.rotate(270, 1, 0, 0);
    flow10.matrix.translate(0.2, -1.8, -0.75);
    flow10.matrix.scale(0.35, 0.35, 0.35);
    flow10.render();

    var flow11 = new Flower(25, 50, 15, 8);
    flow11.color = [1.0, 1.0, 0.0, 1.0];
    flow11.petal_color = rgb_flower3;
    flow11.matrix.rotate(270, 1, 0, 0);
    flow11.matrix.translate(1.3, 1.4, -0.75);
    flow11.matrix.scale(0.35, 0.35, 0.35);
    flow11.render();

    var flow12 = new Flower(25, 50, 15, 8);
    flow12.color = [1.0, 1.0, 0.0, 1.0];
    flow12.petal_color = rgb_flower1;
    flow12.matrix.rotate(270, 1, 0, 0);
    flow12.matrix.translate(-1.3, 1.4, -0.75);
    flow12.matrix.scale(0.5, 0.5, 0.5);
    flow12.render();
    
    var flow13 = new Flower(25, 50, 15, 8);
    flow13.color = [1.0, 1.0, 0.0, 1.0];
    flow13.petal_color = rgb_flower1;
    flow13.matrix.rotate(270, 1, 0, 0);
    flow13.matrix.translate(0.8, 1.5, -0.75);
    flow13.matrix.scale(0.45, 0.45, 0.45);
    flow13.render();

    var flow14 = new Flower(25, 50, 15, 8);
    flow14.color = [1.0, 1.0, 0.0, 1.0];
    flow14.petal_color = rgb_flower1;
    flow14.matrix.rotate(270, 1, 0, 0);
    flow14.matrix.translate(1.7, 0.8, -0.75);
    flow14.matrix.scale(0.4, 0.4, 0.4);
    flow14.render();

    var flow15 = new Flower(25, 50, 15, 8);
    flow15.color = [1.0, 1.0, 0.0, 1.0];
    flow15.petal_color = rgb_flower1;
    flow15.matrix.rotate(270, 1, 0, 0);
    flow15.matrix.translate(-1.6, 0.9, -0.75);
    flow15.matrix.scale(0.6, 0.6, 0.6);
    flow15.render();

    var flow16 = new Flower(25, 50, 15, 8);
    flow16.color = [1.0, 1.0, 0.0, 1.0];
    flow16.petal_color = rgb_flower1;
    flow16.matrix.rotate(270, 1, 0, 0);
    flow16.matrix.translate(-1.6, 1.1, -0.75);
    flow16.matrix.scale(0.4, 0.4, 0.4);
    flow16.render();

    var flow17 = new Flower(25, 50, 15, 8);
    flow17.color = [1.0, 1.0, 0.0, 1.0];
    flow17.petal_color = rgb_flower1;
    flow17.matrix.rotate(270, 1, 0, 0);
    flow17.matrix.translate(1.6, -1.1, -0.75);
    flow17.matrix.scale(0.4, 0.4, 0.4);
    flow17.render();

    var flow18 = new Flower(25, 50, 15, 8);
    flow18.color = [1.0, 1.0, 0.0, 1.0];
    flow18.petal_color = rgb_flower1;
    flow18.matrix.rotate(270, 1, 0, 0);
    flow18.matrix.translate(1.3, -1.7, -0.75);
    flow18.matrix.scale(0.5, 0.5, 0.5);
    flow18.render();

    var flow19 = new Flower(25, 50, 15, 8);
    flow19.color = [1.0, 1.0, 0.0, 1.0];
    flow19.petal_color = rgb_flower1;
    flow19.matrix.rotate(270, 1, 0, 0);
    flow19.matrix.translate(0.8, -1.5, -0.75);
    flow19.matrix.scale(0.45, 0.45, 0.45);
    flow19.render();

    var flow20 = new Flower(25, 50, 15, 8);
    flow20.color = [1.0, 1.0, 0.0, 1.0];
    flow20.petal_color = rgb_flower1;
    flow20.matrix.rotate(270, 1, 0, 0);
    flow20.matrix.translate(1.5, -0.2, -0.75);
    flow20.matrix.scale(0.4, 0.4, 0.4);
    flow20.render();

    var flow21 = new Flower(25, 50, 15, 8);
    flow21.color = [1.0, 1.0, 0.0, 1.0];
    flow21.petal_color = rgb_flower1;
    flow21.matrix.rotate(270, 1, 0, 0);
    flow21.matrix.translate(-0.1, 1.2, -0.75);
    flow21.matrix.scale(0.55, 0.55, 0.55);
    flow21.render();

    var flow22 = new Flower(25, 50, 15, 8);
    flow22.color = [1.0, 1.0, 0.0, 1.0];
    flow22.petal_color = rgb_flower1;
    flow22.matrix.rotate(270, 1, 0, 0);
    flow22.matrix.translate(-0.3, 1.7, -0.75);
    flow22.matrix.scale(0.4, 0.4, 0.4);
    flow22.render();

    var flow23 = new Flower(25, 50, 15, 8);
    flow23.color = [1.0, 1.0, 0.0, 1.0];
    flow23.petal_color = rgb_flower1;
    flow23.matrix.rotate(270, 1, 0, 0);
    flow23.matrix.translate(-1.5, -0.2, -0.75);
    flow23.matrix.scale(0.4, 0.4, 0.4);
    flow23.render();

    var flow24 = new Flower(25, 50, 15, 8);
    flow24.color = [1.0, 1.0, 0.0, 1.0];
    flow24.petal_color = rgb_flower1;
    flow24.matrix.rotate(270, 1, 0, 0);
    flow24.matrix.translate(-2.0, 0.3, -0.75);
    flow24.matrix.scale(0.6, 0.6, 0.6);
    flow24.render();

    var flow25 = new Flower(25, 50, 15, 8);
    flow25.color = [1.0, 1.0, 0.0, 1.0];
    flow25.petal_color = rgb_flower1;
    flow25.matrix.rotate(270, 1, 0, 0);
    flow25.matrix.translate(-0.7, -1.6, -0.75);
    flow25.matrix.scale(0.45, 0.45, 0.45);
    flow25.render();

    var flow26 = new Flower(25, 50, 15, 8);
    flow26.color = [1.0, 1.0, 0.0, 1.0];
    flow26.petal_color = rgb_flower4;
    flow26.matrix.rotate(270, 1, 0, 0);
    flow26.matrix.translate(-1.0, 1.0, -0.75);
    flow26.matrix.scale(0.5, 0.5, 0.5);
    flow26.render();

    var flow27 = new Flower(25, 50, 15, 8);
    flow27.color = [1.0, 1.0, 0.0, 1.0];
    flow27.petal_color = rgb_flower4;
    flow27.matrix.rotate(270, 1, 0, 0);
    flow27.matrix.translate(-1.2, -1.8, -0.75);
    flow27.matrix.scale(0.5, 0.5, 0.5);
    flow27.render();

    var flow28 = new Flower(25, 50, 15, 8);
    flow28.color = [1.0, 1.0, 0.0, 1.0];
    flow28.petal_color = rgb_flower4;
    flow28.matrix.rotate(270, 1, 0, 0);
    flow28.matrix.translate(1.4, -1.2, -0.75);
    flow28.matrix.scale(0.5, 0.5, 0.5);
    flow28.render();

    var flow29 = new Flower(25, 50, 15, 8);
    flow29.color = [1.0, 1.0, 0.0, 1.0];
    flow29.petal_color = rgb_flower2;
    flow29.matrix.rotate(270, 1, 0, 0);
    flow29.matrix.translate(-1.4, 1.2, -0.75);
    flow29.matrix.scale(0.5, 0.5, 0.5);
    flow29.render();

    var flow30 = new Flower(25, 50, 15, 8);
    flow30.color = [1.0, 1.0, 0.0, 1.0];
    flow30.petal_color = rgb_flower2;
    flow30.matrix.rotate(270, 1, 0, 0);
    flow30.matrix.translate(0.4, 1.8, -0.75);
    flow30.matrix.scale(0.5, 0.5, 0.5);
    flow30.render();

    var flow31 = new Flower(25, 50, 15, 8);
    flow31.color = [1.0, 1.0, 0.0, 1.0];
    flow31.petal_color = rgb_flower2;
    flow31.matrix.rotate(270, 1, 0, 0);
    flow31.matrix.translate(0.8, -1.8, -0.75);
    flow31.matrix.scale(0.5, 0.5, 0.5);
    flow31.render();

    var flow32 = new Flower(25, 50, 15, 8);
    flow32.color = [1.0, 1.0, 0.0, 1.0];
    flow32.petal_color = rgb_flower5;
    flow32.matrix.rotate(270, 1, 0, 0);
    flow32.matrix.translate(-1.3, -0.5, -0.75);
    flow32.matrix.scale(0.5, 0.5, 0.5);
    flow32.render();

    var flow33 = new Flower(25, 50, 15, 8);
    flow33.color = [1.0, 1.0, 0.0, 1.0];
    flow33.petal_color = rgb_flower5;
    flow33.matrix.rotate(270, 1, 0, 0);
    flow33.matrix.translate(1.1, 0.8, -0.75);
    flow33.matrix.scale(0.5, 0.5, 0.5);
    flow33.render();

  }


  // render bushes ------------------------------

  var shadow = new Disk(65);
  shadow.color = rgb_bush;
  shadow.matrix.rotate(-90, 1, 0, 0);
  shadow.matrix.translate(0, 0, -0.751);
  shadow.render();
}

function renderCharacter() {
  var skin_color = [0.75, 0.45, 0.15, 1.0];
  //var shading = false;
  var body_segments = 10;

  var char_scale = 0.7;

  var Torso_Lower = new Cylinder([50, 47, 45, 44, 45, 47, 50], 130, shading, body_segments);
  Torso_Lower.color = skin_color;
  Torso_Lower.matrix.scale(char_scale, char_scale, char_scale);
  Torso_Lower.matrix.scale(1, 0.8, 0.65)
  Torso_Lower.matrix.translate(0.0, 0.14, 0.0);
  //Torso_Lower.matrix.rotate(45*Math.sin(g_seconds), 0, 0, 1);
  Torso_Lower.matrix.rotate(TorsoAngleX, 1, 0, 0);
  Torso_Lower.matrix.rotate(TorsoAngleY, 0, 1, 0);
  Torso_Lower.matrix.rotate(TorsoAngleZ, 0, 0, 1);
  Torso_Lower.matrix.translate(0.0, CharHeight, 0.0);
  var body_matrix = new Matrix4(Torso_Lower.matrix);
  //body.matrix.translate(-0.25, -0.75, 0.0);
  //body.matrix.rotate(-5, 1, 0, 0);
  //Torso_Lower.matrix.scale(0.5, 0.3, 0.5);
  Torso_Lower.render();

  var shoulders = new Cylinder([40, 50, 55, 50, 40], 100, shading, body_segments);
  shoulders.color = skin_color;
  shoulders.matrix = body_matrix;
  shoulders.matrix.translate(50/200, 0.73, 0);
  shoulders.matrix.rotate(90, 0, 0, 1);
  shoulders.render();

  var robeUpper = new Cylinder([65, 68, 58, 62, 66, 70], 130, shading, body_segments);
  robeUpper.color = [7/255, 115/255, 117/255, 1.0];
  robeUpper.matrix = new Matrix4(body_matrix);
  robeUpper.matrix.translate(0.05, 50/200, 0.0);
  robeUpper.matrix.scale(1, 1, 1);
  robeUpper.matrix.rotate(90, 0, 0, 1);
  robeUpper.render();

  var robeTrim = new Cylinder([72, 72], 25, shading, body_segments);
  robeTrim.color = [177/255, 67/255, 54/255, 1.0];
  robeTrim.matrix = new Matrix4(body_matrix);
  robeTrim.matrix.translate(-105/200, 50/200, 0.0);
  robeTrim.matrix.rotate(90, 0, 0, 1);
  robeTrim.render();

  var matrixHead = new Matrix4(body_matrix);

  var neck = new Cylinder([15, 13, 15], 50, shading, 6);
  neck.color = skin_color;
  neck.matrix = matrixHead;
  neck.matrix.rotate(-90, 0, 0, 1);
  neck.matrix.scale(1, 1, 1.3);
  neck.matrix.translate(-50/200, 0.17, 0.0);
  neck.matrix.scale(1.2, 1.2, 1.2);
  //neck.matrix.rotate(45*Math.sin(g_seconds), 0, 0, 1);
  neck.matrix.rotate(HeadAngleX, 1, 0, 0);
  neck.matrix.rotate(HeadAngleY, 0, 1, 0);
  neck.matrix.rotate(HeadAngleZ, 0, 0, 1);
  neck.render();

  var necklace = new Cylinder([30, 25], 10, shading, 6);
  necklace.color = [0.8, 0.6, 0.0, 1.0];
  necklace.matrix = new Matrix4(body_matrix);
  necklace.matrix.rotate(-90, 0, 0, 1);
  necklace.matrix.scale(1, 1, 1.3);
  necklace.matrix.translate(-50/200, 0.17, 0.0);
  necklace.matrix.scale(1.2, 1.2, 1.2);
  necklace.matrix.scale(1.2, 1.2, 1.2);
  necklace.render();

  var pendant = new Cylinder([10, 20], 40, shading, 4);
  pendant.color = [0.8, 0.6, 0.0, 1.0];
  pendant.matrix = new Matrix4(body_matrix);
  pendant.matrix.rotate(-90, 0, 0, 1);
  pendant.matrix.scale(1, 1, 1.3);
  pendant.matrix.translate(-50/200, 0.17, 0.0);
  pendant.matrix.scale(1.2, 1.2, 1.2);
  pendant.matrix.rotate(180, 1, 0, 0);
  pendant.matrix.rotate(27, 1, 0, 0);
  pendant.matrix.scale(1, 1, 0.5);
  pendant.matrix.translate(0, 0.07, 0.25);
  pendant.render();



  var head = new Cylinder([10, 20, 25, 30, 30, 30, 25, 20, 10], 75, shading, 8);
  head.color = skin_color;
  head.matrix = matrixHead;
  head.matrix.scale(1, 1, 1.3);
  head.matrix.scale(1.1, 1.1, 1.1);
  head.matrix.translate(0.0, 0.17, 0.0);
  head.render();

  var matrixMask = new Matrix4(matrixHead);

  var hat1 = new Cylinder([35, 35], 10, shading, 8);
  hat1.color = [0.7, 0.2, 0.0, 1.0];
  hat1.matrix = matrixHead;
  hat1.matrix.translate(0.0, 0.25, 0.0);
  hat1.render();

  var hat2 = new Cylinder([25, 45], 30, shading, 8, stripy = true);
  //hat2.color = [50/255, 149/255, 181/255, 1.0];
  hat2.color = [0.6, 0.8, 0.8, 1.0];
  hat2.matrix.translate(0.0, 0.1, 0.0);
  hat2.matrix = matrixHead;
  hat2.render();

  var hat3 = new Cylinder([10, 20, 25, 30, 30, 30, 25, 20, 10], 60, shading, 8);
  hat3.color = [0.7, 0.4, 0.4, 1.0];
  hat3.matrix = matrixHead;
  hat3.matrix.translate(0.0, 0.07, 0.0);
  hat3.render();

  var hat4 = new Cylinder([26, 26], 10, shading, 8);
  hat4.color = [0.7, 0.2, 0.0, 1.0];
  hat4.matrix = matrixHead;
  hat4.matrix.translate(0.0, 0.26, 0.0);
  hat4.render();

  var hat5 = new Cone(22, 110, shading, 8);
  hat5.color = [0.8, 0.9, 0.9, 1.0];
  hat5.matrix = matrixHead;
  hat5.matrix.translate(0.0, 0.05, 0.0);
  hat5.render();

  var hat6 = new Cylinder([7,7], 10, shading, 8);
  hat6.color = [0.7, 0.2, 0.0, 1.0];
  hat6.matrix = matrixHead;
  hat6.matrix.translate(0.0, 95/200, 0.0);
  hat6.render();

  var hat7 = new Cone(9, 30, shading, 8);
  hat7.color = [0.8, 0.6, 0.0, 1.0];
  hat7.matrix = matrixHead;
  hat7.matrix.translate(0.0, 0.13, 0.0);
  hat7.matrix.rotate(180, 0, 0, 1);
  hat7.render();

  var Mask1 = new Cylinder([70, 70, 70, 50, 20], 20, shading, 8);
  Mask1.color = [0.9, 0.9, 0.8, 1.0];
  Mask1.matrix = matrixMask;
  Mask1.matrix.rotate(270, 1, 0, 0);
  Mask1.matrix.scale(0.45, 0.45, 0.45);
  Mask1.matrix.translate(0.0, 0.255, 0.295);
  Mask1.render();

  var eyeBrow1 = new Triangle3d(200, 200);
  eyeBrow1.color = [0.0, 0.0, 0.0, 1.0];
  eyeBrow1.matrix = new Matrix4(matrixMask);
  eyeBrow1.matrix.translate(0.17, 0.1, 0.1);
  eyeBrow1.matrix.scale(0.1, 0.1, 0.1);
  eyeBrow1.matrix.rotate(-10, 0, 0, 1);
  eyeBrow1.render();

  var eyeBrow2 = new Triangle3d(200, 200);
  eyeBrow2.color = [0.0, 0.0, 0.0, 1.0];
  eyeBrow2.matrix = new Matrix4(matrixMask);
  eyeBrow2.matrix.translate(-0.17, 0.1, 0.1);
  eyeBrow2.matrix.scale(0.1, 0.1, 0.1);
  eyeBrow2.matrix.rotate(10, 0, 0, 1);
  eyeBrow2.render();

  var eye1 = new SemiDisk(10);
  eye1.color = [0.0, 0.0, 0.0, 1.0];
  eye1.matrix = new Matrix4(matrixMask);
  eye1.matrix.translate(0.17, 0.1, -0.02);
  eye1.matrix.rotate(90, 1, 0, 0);
  eye1.matrix.rotate(10, 0, 0, 1);
  eye1.matrix.scale(1.5, 1, 1);
  eye1.render();
  
  var eye2 = new SemiDisk(10);
  eye2.color = [0.0, 0.0, 0.0, 1.0];
  eye2.matrix = new Matrix4(matrixMask);
  eye2.matrix.translate(-0.17, 0.1, -0.02);
  eye2.matrix.rotate(90, 1, 0, 0);
  eye2.matrix.rotate(-10, 0, 0, 1);
  eye2.matrix.scale(1.5, 1, 1);
  eye2.render();

  var nose = new Triangle3d(200, 200, shading, 8);
  nose.color = [0.0, 0.0, 0.0, 1.0];
  nose.matrix = new Matrix4(matrixMask);
  nose.matrix.translate(0.0, 0.11, -0.068);
  nose.matrix.scale(0.1, 0.1, 0.1);
  nose.render();

  var noseSlit = new Triangle3d(100, 110, shading, 8);
  noseSlit.color = [0.9, 0.9, 0.8, 1.0];
  noseSlit.matrix = new Matrix4(matrixMask);
  noseSlit.matrix.translate(0.0, 0.1101, -0.069);
  noseSlit.matrix.scale(0.1, 0.1, 0.1);
  noseSlit.render();

  var mouth1 = new SemiDisk(40);
  mouth1.color = [0.0, 0.0, 0.0, 1.0];
  mouth1.matrix = new Matrix4(matrixMask);
  mouth1.matrix.translate(-0.12, 0.11, -0.095);
  mouth1.matrix.rotate(-90, 1, 0, 0);
  mouth1.matrix.rotate(55, 0, 0, 1);
  mouth1.matrix.scale(0.5, 0.25, 0.5);
  mouth1.render();

  var mouth2 = new SemiDisk(40);
  mouth2.color = [0.0, 0.0, 0.0, 1.0];
  mouth2.matrix = new Matrix4(matrixMask);
  mouth2.matrix.translate(0.12, 0.11, -0.095);
  mouth2.matrix.rotate(-90, 1, 0, 0);
  mouth2.matrix.rotate(-55, 0, 0, 1);
  mouth2.matrix.scale(0.5, 0.25, 0.5);
  mouth2.render();

  var mouth3 = new SemiDisk(40);
  mouth3.color = [0.0, 0.0, 0.0, 1.0];
  mouth3.matrix = new Matrix4(matrixMask);
  mouth3.matrix.translate(0.0, 0.11, -0.105);
  mouth3.matrix.rotate(-90, 1, 0, 0);
  mouth3.matrix.scale(0.75, 0.5, 0.5);
  mouth3.render();


  var cheek1 = new Disk(150);
  cheek1.color = [0.7, 0.4, 0.4, 1.0];
  cheek1.matrix = new Matrix4(matrixMask);
  cheek1.matrix.translate(0.24, 0.068, -0.15);
  cheek1.matrix.scale(0.1, 0.1, 0.1);
  cheek1.matrix.rotate(80, 1, 0, 0);
  cheek1.matrix.rotate(-20, 0, 1, 0);
  cheek1.render();

  var cheek2 = new Disk(150);
  cheek2.color = [0.7, 0.4, 0.4, 1.0];
  cheek2.matrix = new Matrix4(matrixMask);
  cheek2.matrix.translate(-0.24, 0.068, -0.15);
  cheek2.matrix.scale(0.1, 0.1, 0.1);
  cheek2.matrix.rotate(80, 1, 0, 0);
  cheek2.matrix.rotate(20, 0, 1, 0);
  cheek2.render();

  var hairTuft = new Triangle3d(170, 100);
  hairTuft.color = [0.1, 0.1, 0.1, 1.0];
  hairTuft.matrix = new Matrix4(matrixMask);
  hairTuft.matrix.translate(-0.45, 0.20, 0.1);
  //hairTuft.matrix.scale(0.1, 0.1, 0.1);
  hairTuft.matrix.rotate(35, 1, 0, 0);
  hairTuft.matrix.rotate(65, 0, 1, 0);
  hairTuft.render();

  var hairTuft2 = new Triangle3d(90, 80);
  hairTuft2.color = [0.1, 0.1, 0.1, 1.0];
  hairTuft2.matrix = new Matrix4(matrixMask);
  hairTuft2.matrix.translate(0.45, -0.02, 0.1);
  //hairTuft2.matrix.scale(0.1, 0.1, 0.1);
  hairTuft2.matrix.rotate(35, 1, 0, 0);
  hairTuft2.matrix.rotate(-35, 0, 0, 1);
  hairTuft2.matrix.rotate(-85, 0, 1, 0);
  hairTuft2.render();

  var hair = new Cylinder([65, 70], 80, shading, 8);
  hair.color = [0.1, 0.1, 0.1, 1.0];
  hair.matrix = new Matrix4(matrixMask);
  hair.matrix.rotate(-80, 1, 0, 0);
  hair.matrix.translate(0.0, -0.35, -0.28);
  hair.matrix.scale(1.3, 1.2, 1);
  hair.render();




  var Mask2 = new Flower(15, 50, 15, 15);
  Mask2.color = [0.8, 0.8, 0.8, 1.0];
  Mask2.petal_color = [0.7, 0.2, 0.0, 1.0];
  Mask1.matrix.rotate(270, 1, 0, 0);
  Mask2.matrix = matrixMask;
  Mask2.matrix.translate(0.5, -0.2, -0.05);
  Mask2.matrix.scale(2, 2, 2);
  Mask2.render();

  var Earing1 = new Cone (7, 30, shading, 8);
  Earing1.color = [0.7, 0.4, 0.4, 1.0];
  Earing1.matrix = new Matrix4(matrixMask);
  //Earing1.matrix.translate(0.5, -0.2, -0.05);
  //Earing1.matrix.scale(0.1, 0.1, 0.1);
  Earing1.matrix.rotate(90, 1, 0, 0);
  Earing1.render();

  var Mask3 = new Flower(15, 50, 15, 15);
  Mask3.color = [0.8, 0.8, 0.8, 1.0];
  Mask3.petal_color = [0.7, 0.2, 0.0, 1.0];
  Mask3.matrix = matrixMask;
  Mask3.matrix.translate(-0.5, 0, 0);
  Mask3.render();

  var Earing2 = new Cone (7, 30, shading, 8);
  Earing2.color = [0.7, 0.4, 0.4, 1.0];
  Earing2.matrix = new Matrix4(matrixMask);
  //Earing2.matrix.translate(-0.5, 0, 0);
  //Earing2.matrix.scale(0.1, 0.1, 0.1);
  Earing2.matrix.rotate(90, 1, 0, 0);
  Earing2.render();

  var MaskPerifs1 = new Matrix4(matrixMask);
  var MaskPerifs2 = new Matrix4(matrixMask);

  var Mask4 = new Cylinder([25, 50], 130, shading, 4);
  Mask4.color = [97/255, 190/255, 208/255, 1.0];
  Mask4.matrix = MaskPerifs1;
  Mask4.matrix.scale(1, 1, 0.25);
  Mask4.matrix.translate(0.0, 0.0, -0.15);
  maskPerifs1 = new Matrix4(MaskPerifs1);
  Mask4.matrix.rotate(45, 0, 1, 0);
  Mask4.matrix.rotate(20, 0, 0, 1);
  Mask4.render();

  var MaskDot1 = new Square3d(100,100);
  MaskDot1.color = [0.0, 0.0, 0.0, 1.0];
  MaskDot1.matrix = new Matrix4(maskPerifs1);
  MaskDot1.matrix.translate(-0.01, 0.5, 0.3);
  MaskDot1.matrix.scale(0.1, 0.1, 0.1);
  MaskDot1.matrix.rotate(10, 0, 0, 1);
  MaskDot1.matrix.rotate(20, 1, 0, 0);
  MaskDot1.render();

  //MaskDot.matrix.scale(2, 2, 0);
  MaskDot1.matrix.translate(-1.2, 0, 0);
  MaskDot1.render();

  MaskDot1.matrix.translate(-1.2, 0, 0);
  MaskDot1.render();

  MaskDot1.matrix.translate(0, 1, 0);
  MaskDot1.render();

  MaskDot1.matrix.translate(1.2, 0, 0);
  MaskDot1.render();

  MaskDot1.matrix.translate(1.2, 0, 0);
  MaskDot1.render();



  var Mask5 = new Cylinder([25, 50], 125, shading, 4);
  Mask5.color = [91/255, 181/255, 169/255, 1.0];
  Mask5.matrix = maskPerifs1;
  //Mask5.matrix.scale(1, 1, 0.25);
  Mask5.matrix.translate(0.1, 0.0, -0.5);
  Mask5.matrix.rotate(90, 0, 0, 1);
  Mask5.render();

  var MaskDot3 = new Square3d(100,100);
  MaskDot3.color = [0.0, 0.0, 0.0, 1.0];
  MaskDot3.matrix = new Matrix4(maskPerifs1);
  MaskDot3.matrix.translate(0.15, 0.45, 0.1);
  MaskDot3.matrix.scale(0.1, 0.1, 0.1);
  //MaskDot3.matrix.rotate(-10, 0, 0, 1);
  //MaskDot3.matrix.rotate(20, 1, 0, 0);
  MaskDot3.render();

  MaskDot3.matrix.translate(-1.5, 0, 1.18);
  MaskDot3.render();

  MaskDot3.matrix.translate(-1.5, 0, -1.18);
  MaskDot3.render();

  MaskDot3.matrix.translate(0, 1, 0.5);
  MaskDot3.render();

  MaskDot3.matrix.translate(1.5, 0, 1.15);
  MaskDot3.render();

  MaskDot3.matrix.translate(1.5, 0, -1.15);
  MaskDot3.render();

  


  var Mask6 = new Cylinder([25, 50], 130, shading, 4);
  Mask6.color = [97/255, 190/255, 208/255, 1.0];
  Mask6.matrix = MaskPerifs2;
  Mask6.matrix.scale(1, 1, 0.25);
  Mask6.matrix.translate(100/200, 0.0, -0.15);
  maskPerifs2 = new Matrix4(MaskPerifs2);
  Mask6.matrix.rotate(-45, 0, 1, 0);
  Mask6.matrix.rotate(-20, 0, 0, 1);
  Mask6.render();

  var MaskDot2 = new Square3d(100,100);
  MaskDot2.color = [0.0, 0.0, 0.0, 1.0];
  MaskDot2.matrix = new Matrix4(maskPerifs2);
  MaskDot2.matrix.translate(0.25, 0.465, 0.3);
  MaskDot2.matrix.scale(0.1, 0.1, 0.1);
  MaskDot2.matrix.rotate(-10, 0, 0, 1);
  MaskDot2.matrix.rotate(20, 1, 0, 0);
  MaskDot2.render();

  //MaskDot.matrix.scale(2, 2, 0);
  MaskDot2.matrix.translate(-1.2, 0, 0);
  MaskDot2.render();

  MaskDot2.matrix.translate(-1.2, 0, 0);
  MaskDot2.render();

  MaskDot2.matrix.translate(0, 1, 0);
  MaskDot2.render();

  MaskDot2.matrix.translate(1.2, 0, 0);
  MaskDot2.render();

  MaskDot2.matrix.translate(1.2, 0, 0);
  MaskDot2.render();
  

  var Mask7 = new Cylinder([25, 50], 125, shading, 4);
  Mask7.color = [91/255, 181/255, 169/255, 1.0];
  Mask7.matrix = maskPerifs2;
  //Mask7.matrix.scale(1, 1, 0.25);
  Mask7.matrix.translate(-0.1, 0.0, -0.5);
  Mask7.matrix.rotate(-90, 0, 0, 1);
  Mask7.render();

  var MaskDot4 = new Square3d(100,100);
  MaskDot4.color = [0.0, 0.0, 0.0, 1.0];
  MaskDot4.matrix = new Matrix4(maskPerifs2);
  MaskDot4.matrix.translate(0.15, 0.45, 0.1);
  MaskDot4.matrix.scale(0.1, 0.1, 0.1);
  //MaskDot4.matrix.rotate(-10, 0, 0, 1);
  //MaskDot4.matrix.rotate(20, 1, 0, 0);
  MaskDot4.render();

  MaskDot4.matrix.translate(-1.5, 0, 1.18);
  MaskDot4.render();

  MaskDot4.matrix.translate(-1.5, 0, -1.18);
  MaskDot4.render();

  MaskDot4.matrix.translate(0, 1, 0.5);
  MaskDot4.render();

  MaskDot4.matrix.translate(1.5, 0, 1.15);
  MaskDot4.render();

  MaskDot4.matrix.translate(1.5, 0, -1.15);
  MaskDot4.render();

  var mask8 = new Cylinder([25, 90], 250, shading, 4);
  mask8.color = [0.55, 0.7, 0.7, 1.0];
  mask8.matrix = new Matrix4(matrixMask);

 //mask8.matrix.scale(1, 1, 0.25);
  mask8.matrix.translate(50/200.0, -0.1, -0.255);
  mask8.matrix.scale(1, 1, 0.25);
  mask8.matrix.rotate(-25, 1, 0, 0);
  mask8.render();






  var matrixStateSave1 = new Matrix4(body_matrix);
  var matrixStateSave2 = new Matrix4(body_matrix);
  var matrixStateSave3 = new Matrix4(body_matrix);
  var matrixStateSave4 = new Matrix4(body_matrix);


  var leftshoulder = new Cylinder([13, 13], 26, shading, 4);
  leftshoulder.color =  skin_color;
  leftshoulder.matrix = body_matrix;
  leftshoulder.matrix.scale(1, 0.8, 1.5385)
  leftshoulder.matrix.scale(1.2, 1.2, 1.2)
  leftshoulder.matrix.translate(0.15, -0.07, 0);
  leftshoulder.matrix.rotate(45, 0, 1, 0);
  leftshoulder.render();

  var rightshoulder = new Cylinder([13, 13], 26, shading, 4);
  rightshoulder.color = skin_color;
  rightshoulder.matrix = body_matrix;
  rightshoulder.matrix.translate(0, 100/200 + 0.03, 0)
  rightshoulder.render();

  var leftUpperArm = new Cylinder([10, 10], 85, shading, 6);
  leftUpperArm.color = skin_color;
  leftUpperArm.matrix = matrixStateSave1;
  //var leftLowerArm_matrix = new Matrix4(leftUpperArm.matrix);
  leftUpperArm.matrix.rotate(180, 0, 0, 1);
  leftUpperArm.matrix.scale(1.25, 1, 1.5385)
  leftUpperArm.matrix.translate(-0.15, 0, 0);
  leftUpperArm.matrix.rotate(-70, 0, 0, 1);
  leftUpperArm.matrix.rotate(-leftArmAngleX, 1, 0, 0);
  leftUpperArm.matrix.rotate(leftArmAngleY, 0, 1, 0);
  leftUpperArm.matrix.rotate(leftArmAngleZ, 0, 0, 1);
  var leftLowerArm_matrix = new Matrix4(leftUpperArm.matrix);
  leftUpperArm.render();

  var leftElbow = new Cylinder([12, 12], 10, shading, 6);
  leftElbow.color = [0.8, 0.6, 0.0, 1.0];
  leftElbow.matrix = new Matrix4(leftLowerArm_matrix);
  leftElbow.matrix.translate(0, 0.4, 0);
  leftElbow.render();

  leftElbow.matrix.translate(0, -0.10, 0);
  leftElbow.render();

  leftElbow.matrix.translate(0, -0.10, 0);
  leftElbow.render();



  var leftLowerArm = new Cylinder([10, 8], 85, shading, 6);
  leftLowerArm.color = skin_color
  leftLowerArm.matrix = leftLowerArm_matrix;
  leftLowerArm.matrix.translate(0, 0.45, 0);
  leftLowerArm.matrix.rotate(-Math.abs(leftArmAngleX), 1, 0, 0);
  //leftLowerArm.matrix.rotate(leftArmAngleY, 0, 1, 0);
  leftLowerArm.matrix.rotate(0.2 * Math.abs(leftArmAngleZ), 0, 0, 1);
  leftLowerArm.matrix.rotate(ManElbowL, 1, 0, 0);
  leftLowerArm.render();

  var BraceletL = new Cylinder([10, 10], 25, shading, 6);
  BraceletL.color = [0.55, 0.7, 0.7, 1.0];
  BraceletL.matrix = new Matrix4(leftLowerArm_matrix);
  BraceletL.matrix.translate(0, 0.3, 0);
  BraceletL.render();

  var BraceletCuffL = new Flower(6, 15, 15, 8);
  BraceletCuffL.color = [0.8, 0.8, 0.8, 1.0];
  BraceletCuffL.petal_color = [0.7, 0.2, 0.0, 1.0];
  BraceletCuffL.matrix = new Matrix4(leftLowerArm_matrix);
  BraceletCuffL.matrix.translate(-0.05, 0.35, 0);
  BraceletCuffL.matrix.rotate(-90, 0, 1, 0);
  BraceletCuffL.matrix.scale(1.5, 1.5, 1.5);
  BraceletCuffL.render();

  var BraceletLinkL = new Cone(5, 15, shading, 6);
  BraceletLinkL.color = [0.7, 0.4, 0.4, 1.0];
  BraceletLinkL.matrix = new Matrix4(BraceletCuffL.matrix);
  //BraceletLinkL.matrix.translate(0, 0.3, 0);
  BraceletLinkL.matrix.rotate(90, 1, 0, 0);
  BraceletLinkL.render();

  var leftHand = new Cylinder([10, 15, 10], 25, shading, 6);
  leftHand.color = skin_color;
  leftHand.matrix = leftLowerArm_matrix;
  leftHand.matrix.translate(0, 0.40, 0);
  leftHand.render();


  var rightUpperArm = new Cylinder([10, 10], 85, shading, 6);
  rightUpperArm.color = skin_color
  rightUpperArm.matrix = matrixStateSave2;
  //rightUpperArm.matrix.rotate(180, 0, 0, 1);
  rightUpperArm.matrix.scale(1.25, 1, 1.5385)
  rightUpperArm.matrix.translate(0.15, 100/200, 0);
  rightUpperArm.matrix.rotate(70, 0, 0, 1);
  //rightUpperArm.matrix.rotate(-20, 0, 0, 1);
  rightUpperArm.matrix.rotate(-RightArmAngleX, 1, 0, 0);
  rightUpperArm.matrix.rotate(-RightArmAngleY, 0, 1, 0);
  rightUpperArm.matrix.rotate(-RightArmAngleZ, 0, 0, 1);
  var rightLowerArm_matrix = new Matrix4(rightUpperArm.matrix);
  rightUpperArm.render();

  var rightElbow = new Cylinder([12, 12], 10, shading, 6);
  rightElbow.color = [0.8, 0.6, 0.0, 1.0];
  rightElbow.matrix = new Matrix4(rightLowerArm_matrix);
  rightElbow.matrix.translate(0, 0.4, 0);
  rightElbow.render();

  rightElbow.matrix.translate(0, -0.10, 0);
  rightElbow.render();

  rightElbow.matrix.translate(0, -0.10, 0);
  rightElbow.render();




  var rightLowerArm = new Cylinder([10, 8], 85, shading, 6);
  rightLowerArm.color = skin_color;
  rightLowerArm.matrix = rightLowerArm_matrix;
  rightLowerArm.matrix.translate(0, 0.45, 0);
  rightLowerArm.matrix.rotate(-Math.abs(RightArmAngleX), 1, 0, 0);
  //rightLowerArm.matrix.rotate(-RightArmAngleY, 0, 1, 0);
  rightLowerArm.matrix.rotate(-0.2 * Math.abs(RightArmAngleZ), 0, 0, 1);
  rightLowerArm.matrix.rotate(ManElbowR, 1, 0, 0);
  rightLowerArm.render();

  var BraceletR = new Cylinder([10, 10], 25, shading, 6);
  BraceletR.color = [0.55, 0.7, 0.7, 1.0];
  BraceletR.matrix = new Matrix4(rightLowerArm_matrix);
  BraceletR.matrix.translate(0, 0.3, 0);
  BraceletR.render();

  var BraceletCuffR = new Flower(6, 15, 15, 8);
  BraceletCuffR.color = [0.8, 0.8, 0.8, 1.0];
  BraceletCuffR.petal_color = [0.7, 0.2, 0.0, 1.0];
  BraceletCuffR.matrix = new Matrix4(rightLowerArm_matrix);
  BraceletCuffR.matrix.translate(0.05, 0.35, 0);
  BraceletCuffR.matrix.rotate(90, 0, 1, 0);
  BraceletCuffR.matrix.scale(1.5, 1.5, 1.5);
  BraceletCuffR.render();

  var BraceletLinkR = new Cone(5, 15, shading, 6);
  BraceletLinkR.color = [0.7, 0.4, 0.4, 1.0];
  BraceletLinkR.matrix = new Matrix4(BraceletCuffR.matrix);
  //BraceletLinkR.matrix.translate(0, 0.3, 0);
  BraceletLinkR.matrix.rotate(90, 1, 0, 0);
  BraceletLinkR.render();



  var rightHand = new Cylinder([10, 15, 10], 25, shading, 6);
  rightHand.color = skin_color;
  rightHand.matrix = rightLowerArm_matrix;
  rightHand.matrix.translate(0, 0.40, 0);
  rightHand.render();

  
  var leftUpperLeg = new Cylinder([25, 20], 110, shading, 6);
  leftUpperLeg.color = skin_color;
  //leftUpperLeg.matrix = matrixStateSave3;
  //leftUpperLeg.matrix.scale(1.25, 1, 1.5385)
  leftUpperLeg.matrix.scale(0.7, 0.7, 0.7);
  leftUpperLeg.matrix.translate(0.12, 0.095, 0);
  leftUpperLeg.matrix.rotate(180, 0, 0, 1);
  leftUpperLeg.matrix.translate(0, -0.8 * CharHeight, 0);
  leftUpperLeg.matrix.rotate(-leftLegAngleX, 1, 0, 0);
  leftUpperLeg.matrix.rotate(leftLegAngleY, 0, 1, 0);
  leftUpperLeg.matrix.rotate(leftLegAngleZ, 0, 0, 1);
  var leftLowerLeg_matrix = new Matrix4(leftUpperLeg.matrix);
  leftUpperLeg.render();

  var leftLowerLeg = new Cylinder([20, 15], 110, shading, 6);
  leftLowerLeg.color = skin_color;
  leftLowerLeg.matrix = leftLowerLeg_matrix;
  leftLowerLeg.matrix.translate(0, 115/200, 0);
  //leftLowerLeg.matrix.rotate(-90, 0, 0, 1);
  leftLowerLeg.matrix.rotate(Math.abs(leftLegAngleX * 1.2), 1, 0, 0);
  leftLowerLeg.matrix.rotate(ManKneeL, 1, 0, 0);
  //leftLowerLeg.matrix.rotate(leftLegAngleY, 0, 1, 0);
  //leftLowerLeg.matrix.rotate(-leftLegAngleZ * 0.5, 0, 0, 1);
  leftLowerLeg.render();
  

  var leftFoot = new Cylinder([20, 21, 24], 80, shading, 4);
  leftFoot.color = [0.7, 0.2, 0.0, 1.0];
  leftFoot.matrix = new Matrix4(leftLowerLeg_matrix);
  leftFoot.matrix.scale(1, 0.5, 1);
  leftFoot.matrix.translate(0, 1.1, 0.1);
  leftFoot.matrix.rotate(leftFootAngle, 1, 0, 0);
  leftFoot.matrix.rotate(-90, 1, 0, 0);
  leftFoot.matrix.rotate(45, 0, 1, 0);
  leftFoot.render();

  var leftLace = new Cylinder([18, 18], 35, shading, 6);
  leftLace.color = [0.55, 0.7, 0.7, 1.0];
  leftLace.matrix = new Matrix4(leftLowerLeg_matrix);
  leftLace.matrix.translate(0, 0.35, 0.0);
  leftLace.render();




  var rightUpperLeg = new Cylinder([25, 20], 110, shading, 6);
  rightUpperLeg.color = skin_color;
  //rightUpperLeg.matrix = matrixStateSave4;
  //rightUpperLeg.matrix.rotate(180, 0, 1, 0);
  rightUpperLeg.matrix.scale(0.7, 0.7, 0.7)
  rightUpperLeg.matrix.translate(-0.12, 0.095, 0);
  rightUpperLeg.matrix.rotate(180, 0, 0, 1);
  rightUpperLeg.matrix.rotate(180, 0, 1, 0);
  rightUpperLeg.matrix.translate(0, -0.8 * CharHeight, 0);
  rightUpperLeg.matrix.rotate(RightLegAngleX, 1, 0, 0);
  rightUpperLeg.matrix.rotate(-RightLegAngleY, 0, 1, 0);
  rightUpperLeg.matrix.rotate(RightLegAngleZ, 0, 0, 1);
  var rightLowerLeg_matrix = new Matrix4(rightUpperLeg.matrix);
  rightUpperLeg.render();

  var rightLowerLeg = new Cylinder([20, 15], 110, shading, 6);
  rightLowerLeg.color = skin_color;
  rightLowerLeg.matrix = rightLowerLeg_matrix;
  rightLowerLeg.matrix.translate(0, 115/200, 0);
  //rightLowerLeg.matrix.rotate(-90, 0, 0, 1);
  rightLowerLeg.matrix.rotate(-Math.abs(RightLegAngleX * 1.2), 1, 0, 0);
  rightLowerLeg.matrix.rotate(ManKneeR, 1, 0, 0);
  //rightLowerLeg.matrix.rotate(-RightLegAngleY, 0, 1, 0);
  //rightLowerLeg.matrix.rotate(-RightLegAngleZ * 0.5, 0, 0, 1);
  rightLowerLeg.render();

  var rightFoot = new Cylinder([20, 21, 24], 80, shading, 4);
  rightFoot.color = [0.7, 0.2, 0.0, 1.0];
  rightFoot.matrix = new Matrix4(rightLowerLeg_matrix);
  rightFoot.matrix.scale(1, 0.5, 1);
  rightFoot.matrix.translate(0, 1.1, -0.1);
  rightFoot.matrix.rotate(RightFootAngle, 1, 0, 0);
  rightFoot.matrix.rotate(90, 1, 0, 0);
  rightFoot.matrix.rotate(45, 0, 1, 0);
  rightFoot.render();

  var rightLace = new Cylinder([18, 18], 35, shading, 6);
  rightLace.color = [0.55, 0.7, 0.7, 1.0];
  rightLace.matrix = new Matrix4(rightLowerLeg_matrix);
  rightLace.matrix.translate(0, 0.35, 0.0);
  rightLace.render();
  
  var robeLower = new Cylinder([60, 62.5, 67.5, 70, 68, 65], 200, shading, body_segments);
  robeLower.color = [15/255, 98/255, 113/255, 1.0];
  robeLower.matrix.scale(1, 0.8, 0.65)
  robeLower.matrix.scale(0.7, 0.7, 0.7);
  robeLower.matrix.translate(0, 0.29, 0.0);
  robeLower.matrix.translate(0, CharHeight, 0);

  //robeLower.matrix.translate(-0.6, 50/200, 0.0);
  robeLower.matrix.rotate(180, 0, 0, 1);
  //robeLower.matrix.rotate(20 *Math.sin(g_seconds), 1, 0, 0)
  robeLower.render();

  robelowersave1 = new Matrix4(robeLower.matrix);
  robelowersave2 = new Matrix4(robeLower.matrix);


  var robeTrim2 = new Cylinder([70, 66], 25, shading, body_segments);
  robeTrim2.color = [177/255, 67/255, 54/255, 1.0];
  robeTrim2.matrix = new Matrix4(robeLower.matrix);
  robeTrim2.matrix.translate(0, 1, 0.0);
  //robeTrim2.matrix.rotate(90, 0, 0, 1);
  robeTrim2.render();
  
  robeLower.matrix = new Matrix4(robelowersave1);
  robeLower.matrix.rotate(-0.8 * leftLegAngleX, 1, 0, 0)
  robeLower.matrix.rotate(0.7 * leftLegAngleZ, 0, 0, 1)
  robeLower.render();

  robeTrim2.matrix = new Matrix4(robeLower.matrix);
  robeTrim2.matrix.translate(0, 1, 0.0);
  robeTrim2.render();

  robeLower.matrix = new Matrix4(robelowersave2);
  robeLower.matrix.rotate(-0.8 * RightLegAngleX, 1, 0, 0)
  robeLower.matrix.rotate(-0.7 * RightLegAngleZ, 0, 0, 1)
  robeLower.render();

  robeTrim2.matrix = new Matrix4(robeLower.matrix);
  robeTrim2.matrix.translate(0, 1, 0.0);
  //robeTrim2.matrix.rotate(-0.7 * RightLegAngleX, 1, 0, 0);
  //robeTrim2.matrix.rotate(-0.7 * RightLegAngleZ, 0, 0, 1);
  robeTrim2.render();





}

function renderScene() {
    var startTime = performance.now();

    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (perspectiveTog) { 
      let fov = 50; // Field of view in degrees
      let aspect = canvas.width / canvas.height; // Aspect ratio
      let near = 0.1; // Near clipping plane
      let far = 100.0; // Far clipping plane

      let perspectiveMatrix = new Matrix4();
      perspectiveMatrix.setPerspective(fov, aspect, near, far);

      let viewMatrix = new Matrix4();
      viewMatrix.setLookAt(cameraX, cameraY, cameraZ, 0, 0, 0, 0, 1, 0);

      let modelViewMatrix = new Matrix4();
      modelViewMatrix.set(perspectiveMatrix).multiply(viewMatrix);

      var gobalRotMat = new Matrix4()
      gobalRotMat.setLookAt(cameraX, cameraY, cameraZ * g_globalScale, 0, 0, 0, 0, 1, 0);
      gobalRotMat.rotate(g_globalAngle + 180, 0, 1, 0);
      gobalRotMat.rotate(g_globalAngle2, 1, 0, 0);
      gobalRotMat.rotate(g_globalAngle3, 0, 0, 1);
      //gobalRotMat.scale(g_globalScale, g_globalScale, g_globalScale);
      //gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, gobalRotMat.elements);

      modelViewMatrix.set(perspectiveMatrix).multiply(gobalRotMat);

      gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, modelViewMatrix.elements);
    } else { 
      var gobalRotMat = new Matrix4()
      gobalRotMat.rotate(-g_globalAngle, 0, 1, 0);
      gobalRotMat.rotate(g_globalAngle2, 1, 0, 0);
      gobalRotMat.rotate(-g_globalAngle3, 0, 0, 1);
      gobalRotMat.scale(g_globalScale, g_globalScale, g_globalScale);
      gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, gobalRotMat.elements);
    }

    if (charTog) {renderCharacter();}

    if (groundTog) {renderGround();}
  
    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: " + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID) { 
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm) {
        console.log("Failed to get" + htmlID + "from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

function updateMousePosition (e) {
  g_globalAngle = e.pageX*0.5 + 180;
  g_globalAngle2 = e.pageY*0.5 + 180;
}

function onMouseDown(ev) {
  if(ev.shiftKey) return;
  isDragging = true;
  updateMousePosition(ev); // Optionally update position on initial click
}

function onMouseUp(ev) {
  if(ev.shiftKey) return;
  isDragging = false;
}

function onMouseMove(ev) {
  if(ev.shiftKey) return;
  if(isDragging) {
    updateMousePosition(ev);
  }
}

function addActionsFromHtmlUI() {
        document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = -1 * this.value; renderScene(); });
        document.getElementById('angleSlide2').addEventListener('mousemove', function() { g_globalAngle2 = -1 * this.value; renderScene(); });
        document.getElementById('angleSlide3').addEventListener('mousemove', function() { g_globalAngle3 = -1 * this.value; renderScene(); });
        document.getElementById('posSlide').addEventListener('mousemove', function() { g_globalScale = this.value; renderScene(); });

        document.getElementById('reset').onclick = function() {g_globalAngle = 0; g_globalAngle2 = 0; g_globalAngle3 = 0; cameraX = 0; cameraY = 0; cameraZ = 3.5; g_globalScale = 1; renderScene();};
        document.getElementById('PerspTog').onclick = function() {if(perspectiveTog){perspectiveTog=false;} else {perspectiveTog=true}; renderScene();};
        document.getElementById('toggle').onclick = function() {if(AnimationTF){AnimationTF=false;} else {AnimationTF=true}; renderScene();};
        document.getElementById('groundTog').onclick = function() {if(groundTog){groundTog=false;} else {groundTog=true}; renderScene();};
        document.getElementById('flowTog').onclick = function() {if(surpDetailTog){surpDetailTog=false;} else {surpDetailTog=true}; renderScene();};
        document.getElementById('charTog').onclick = function() {if(charTog){charTog=false;} else {charTog=true}; renderScene();};
        document.getElementById('shading').onclick = function() {if(shading){shading=false;} else {shading=true}; renderScene();};

        document.getElementById('yellowSlide').addEventListener('mousemove', function() { leftArmAngleX = this.value; renderScene(); });
        document.getElementById('yellowSlide2').addEventListener('mousemove', function() { leftArmAngleY = this.value; renderScene(); });
        document.getElementById('yellowSlide3').addEventListener('mousemove', function() { leftArmAngleZ = this.value; renderScene(); });

        document.getElementById('greenSlide').addEventListener('mousemove', function() { leftLegAngleX = this.value; renderScene(); });
        document.getElementById('greenSlide2').addEventListener('mousemove', function() { leftLegAngleY = this.value; renderScene(); });
        document.getElementById('greenSlide3').addEventListener('mousemove', function() { leftLegAngleZ = this.value; renderScene(); });

        document.getElementById('magentaSlide').addEventListener('mousemove', function() { RightArmAngleX = this.value; renderScene(); }); 
        document.getElementById('magentaSlide2').addEventListener('mousemove', function() { RightArmAngleY = this.value; renderScene(); });
        document.getElementById('magentaSlide3').addEventListener('mousemove', function() { RightArmAngleZ = this.value; renderScene(); });

        document.getElementById('cyanSlide').addEventListener('mousemove', function() { RightLegAngleX = this.value; renderScene(); });
        document.getElementById('cyanSlide2').addEventListener('mousemove', function() { RightLegAngleY = this.value; renderScene(); });
        document.getElementById('cyanSlide3').addEventListener('mousemove', function() { RightLegAngleZ = this.value; renderScene(); });

        
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mousemove', onMouseMove);

        document.addEventListener("click", (e) => {if (e.shiftKey) {
          AnimationMode = (1 + AnimationMode) % 9;
          console.log(AnimationMode);
          g_startTime = performance.now()/1000.0;
          leftArmAngleX = 0;
          leftArmAngleY = 0;
          leftArmAngleZ = 0;
          leftLegAngleX = 0;
          leftLegAngleY = 0;
          leftLegAngleZ = 0;
          RightArmAngleX = 0;
          RightArmAngleY = 0;
          RightArmAngleZ = 0;
          RightLegAngleX = 0;
          RightLegAngleY = 0;
          RightLegAngleZ = 0;
          HeadAngleX = 0;
          HeadAngleY = 0;
          HeadAngleZ = 0;
          TorsoAngleX = 0;
          TorsoAngleY = 0;
          TorsoAngleZ = 0;
          leftFootAngle = 0;
          RightFootAngle = 0;
          ManElbowL = 0;
          ManElbowR = 0;
          ManKneeL = 0;
          ManKneeR = 0;
          CharHeight = 0;
        }})
}