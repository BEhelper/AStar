// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Part 1: https://youtu.be/aKYlikFAV4k
// Part 2: https://youtu.be/EaZxUCWAjb0
// Part 3: https://youtu.be/jwRT4PCT6RU

// 2 options for drawing the walls
// option 0 = corn maze
// option 1 = castle
// (Both look cool)
var drawingOption = 0;


//Set to true to allow diagonal moves
//This will also switch from Manhattan to Euclidean distance measures
var allowDiagonals = true;

// can the path go between the corners of two
// walls located diagonally next to each other
var canPassThroughCorners = false;

var cols = 50;
var rows = 50;


// % of cells that are walls
var percentWalls = (allowDiagonals ? (canPassThroughCorners ? 0.4 : 0.3) : 0.2);

// Timer
var t;
var timings = {};

function clearTimings() {
    timings = {};
}

function startTime() {
    t = millis();
}

function recordTime(n) {
    if (!timings[n]) {
        timings[n] = {
            sum: millis() - t,
            count: 1
        };
    } else {
        timings[n].sum = timings[n].sum + millis() - t;
        timings[n].count = timings[n].count + 1;
    }
}

function logTimings() {
    for (var prop in timings) {
        if (timings.hasOwnProperty(prop)) {
            console.log(prop + " = " + (timings[prop].sum / timings[prop].count).toString() + " ms");
        }
    }
}


function SettingBox(label, x, y, isSet, callback) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.isSet = isSet;
    this.callback = callback;

    this.show = function() {
        //noFill();
        strokeWeight(1);
        stroke(0);
        noFill();
        ellipse(this.x + 10, this.y + 10, 20, 20);
        if (this.isSet) {
            fill(0);
            ellipse(this.x + 10, this.y + 10, 3, 3);
        }
        fill(0);
        noStroke();
        text(label, this.x + 25, this.y + 15);
    }

    this.mouseClick = function(x, y) {
        if (x > this.x && x <= this.x + 20 &&
            y > this.y && y <= this.y + 20) {
            this.isSet = !this.isSet;
            if (this.callback != null)
                this.callback(this);
        }
    }
}

function Button(label, x, y, w, h, callback) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.callback = callback;

    this.show = function() {
        stroke(0);
        strokeWeight(1);
        noFill();
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        noStroke();
        text(this.label, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
    }

    this.mouseClick = function(x, y) {
        if (this.callback != null &&
            x > this.x && x <= this.x + this.w &&
            y > this.y && y <= this.y + this.h) {
            this.callback(this);
        }
    }
}


function RoomStyle(label, x, y, w, h, callback) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.callback = callback;
}


function createSlider() {

}


  // Start and end
  // start = grid[0][0];
  // end = grid[cols - 1][rows - 1];
  // start.wall = false;
  // end.wall = false;

function step(button) {
    pauseUnpause(true);
    stepsAllowed = 1;
}

function pauseUnpause(pause) {
    paused = pause;
    runPauseButton.label = paused ? "run" : "pause";
}

function runpause(button) {
    pauseUnpause(!paused);
}

function restart(button) {
    logTimings();
    clearTimings();
    initaliseSearchExample(cols, rows);
    pauseUnpause(true);
}

function toggleDiagonals() {
    allowDiagonals = !allowDiagonals;
}

function mouseClicked() {
    for (var i = 0; i < uiElements.length; i++) {
        uiElements[i].mouseClick(mouseX, mouseY);
    }

}

function doGUI() {
    for (var i = 0; i < uiElements.length; i++) {
        uiElements[i].show();
    }
}


function roomone(button) {
  var valX = sliderRoomX.value();
  var valY = sliderRoomY.value();
  var valW = sliderRoomW.value();
  var valH = sliderRoomH.value();
  console.log(valX);
  console.log(button.label);
  roomTypeOne = new RoomStyle("roomthis", valX, valY, valW, valH, roomone);
  logTimings();
  clearTimings();
  initaliseSearchExample(cols, rows);
  pauseUnpause(true);
    // pauseUnpause(!paused);
}


function sliderChanged() {
  var valX = sliderRoomX.value();
  var valY = sliderRoomY.value();
  var valW = sliderRoomW.value();
  var valH = sliderRoomH.value();
  console.log(valX);
  roomTypeOne = new RoomStyle("roomthis", valX, valY, valW, valH, roomone);
  logTimings();
  clearTimings();
  initaliseSearchExample(cols, rows);
  pauseUnpause(true);
}


var gamemap;
var uiElements = [];
var paused = true;
var pathfinder;
var status = "";
var stepsAllowed = 0;
var runPauseButton;

//brad
var roomTypeOne = new RoomStyle("roomthis", 6, 6, 6, 6, roomone);

function initaliseSearchExample(rows, cols) {
    mapGraphic = null;

    // BRAD

    // roomTypeOne = new RoomStyle("roomthis", 6, 6, 6, 6, roomone);


    gamemap = new MapFactory().getMap(cols, rows, 10, 10, 410, 410, allowDiagonals, percentWalls, roomTypeOne);
    start = gamemap.grid[0][0];
    end = gamemap.grid[cols - 1][rows - 1];
    start.wall = false;
    end.wall = false;

    pathfinder = new AStarPathFinder(gamemap, start, end, allowDiagonals);
}

function setup() {
    startTime();

    if (getURL().toLowerCase().indexOf("fullscreen") === -1) {
        createCanvas(600, 600);
    } else {
        var sz = min(windowWidth, windowHeight);
        createCanvas(sz, sz);
    }
    console.log('A*');

    initaliseSearchExample(cols, rows);

    runPauseButton = new Button("run", 430, 20, 90, 30, runpause);
    uiElements.push(runPauseButton);
    uiElements.push(new Button("step", 430, 70, 50, 30, step));
    uiElements.push(new Button("restart", 430, 120, 50, 30, restart));
    uiElements.push(new SettingBox("AllowDiag", 430, 180, allowDiagonals, toggleDiagonals));

    uiElements.push(new Button("new", 430, 220, 50, 30, roomone));

    sliderRoomX = createSlider(1, 12, 6, 1);
    sliderRoomX.position(460, 500);
    sliderRoomX.style('width', '100px');
    sliderRoomX.input(sliderChanged);

    sliderRoomY = createSlider(1, 12, 6, 1);
    sliderRoomY.position(460, 530);
    sliderRoomY.style('width', '100px');
    sliderRoomY.input(sliderChanged);

    sliderRoomW = createSlider(1, 12, 6, 1);
    sliderRoomW.position(460, 560);
    sliderRoomW.style('width', '100px');
    sliderRoomW.input(sliderChanged);

    sliderRoomH = createSlider(1, 12, 6, 1);
    sliderRoomH.position(460, 590);
    sliderRoomH.style('width', '100px');
    sliderRoomH.input(sliderChanged);

    recordTime("Setup");
}

function searchStep() {
    if (!paused || stepsAllowed > 0) {
        startTime();
        var result = pathfinder.step();
        recordTime("AStar Iteration");
        stepsAllowed--;

        switch (result) {
            case -1:
                status = "No Solution";
                logTimings();
                pauseUnpause(true);
                break;
            case 1:
                status = "Goal Reached!";
                logTimings();
                pauseUnpause(true);
                break;
            case 0:
                status = "Still Searching"
                break;
        }
    }
}

var mapGraphic = null;

function drawMap() {
    if (mapGraphic == null) {
        for (var i = 0; i < gamemap.cols; i++) {
            for (var j = 0; j < gamemap.rows; j++) {
                if (gamemap.grid[i][j].wall) {
                    gamemap.grid[i][j].show(color(255));
                }
            }
        }
        mapGraphic = get(gamemap.x, gamemap.y, gamemap.w, gamemap.h);
    }

    image(mapGraphic, gamemap.x, gamemap.y);
}

function draw() {

    searchStep();

    // Draw current state of everything
    background(255);

    doGUI();

    text("Search status - " + status, 10, 450);

    text("ROOM LAYOUT: ", 430, 300);
    var toproomtext = 320;
    var spacing = 30;
    text("x = " + sliderRoomX.value(), sliderRoomX.x + 75, toproomtext + (spacing * 0));
    text("y = "+ sliderRoomY.value(), sliderRoomY.x + 75, toproomtext + (spacing * 1));
    text("width = " + sliderRoomW.value(), sliderRoomW.x + 75, toproomtext + (spacing * 2));
    text("height = " + sliderRoomH.value(), sliderRoomH.x + 75, toproomtext + (spacing * 3));

    startTime();

    drawMap();

    for (var i = 0; i < pathfinder.closedSet.length; i++) {
        pathfinder.closedSet[i].show(color(255, 0, 0, 50));
    }

    var infoNode = null;

    for (var i = 0; i < pathfinder.openSet.length; i++) {
        var node = pathfinder.openSet[i];
        node.show(color(0, 255, 0, 50));
        if (mouseX > node.x && mouseX < node.x + node.width &&
            mouseY > node.y && mouseY < node.y + node.height) {
            infoNode = node;
        }
    }
    recordTime("Draw Grid");

    fill(0);
    if (infoNode != null) {
        var verticalSpacing = 200;
        text("f = " + infoNode.f, 280, verticalSpacing + 230);
        text("g = " + infoNode.g, 280, verticalSpacing + 250);
        text("h = " + infoNode.h, 280, verticalSpacing + 270);
        text("vh = " + infoNode.vh, 280, verticalSpacing + 290);

    }

    var path = calcPath(pathfinder.lastCheckedNode);
    drawPath(path);
}

function calcPath(endNode) {
    startTime();
    // Find the path by working backwards
    path = [];
    var temp = endNode;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }
    recordTime("Calc Path");
    return path
}

function drawPath(path) {
    // Drawing path as continuous line
    noFill();
    stroke(255, 0, 200);
    strokeWeight(gamemap.w / gamemap.cols / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);
    }
    endShape();
}
