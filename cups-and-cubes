<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Algebra Studio Balance Lab</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js"></script>
  <style>
    body { 
      margin: 0; 
      padding: 20px;
      min-height: 100vh; 
      background: #f0f0f0; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      font-family: 'Poppins', sans-serif;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      touch-action: none;
    }
    #canvas-container { 
      position: relative; 
      width: 800px;
      height: 700px;
      background: white;
      border: 1px solid #ccc;
      overflow: hidden;
    }
    canvas { 
      display: block;
      touch-action: none;
    }
  </style>
</head>
<body>
  <div id="canvas-container"></div>

  <script>
    // =====================
    // STATE
    // =====================
    let cups = [];
    let cubes = [];
    let selectedElement = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    // Target equation: ax + b = c
    let targetA = 2;
    let targetB = 3;
    let targetC = 7;
    let targetSolution = 2;
    
    // Current state on balance
    let leftSide = { cups: 0, cubes: 0 };
    let rightSide = { cups: 0, cubes: 0 };
    
    // Phases: 'build', 'solve', 'solved'
    let phase = 'build';
    let setupCorrect = false;
    let solveButtonHover = false;
    let clearButtonHover = false;
    
    // Solving
    let xValue = 0;
    let xInputFocused = false;
    let solvingSteps = [];
    
    // Animation
    let fadingElements = [];
    let successGlow = 0;
    let poppinsFont;
    
    // Layout constants
    const EQUATION_Y = 50;
    const STEPS_START_Y = 95;
    const BALANCE_BEAM_Y = 420;
    const SOURCE_Y = 540;
    const BALANCE_LEFT_CENTER = 250;
    const BALANCE_RIGHT_CENTER = 550;

    // =====================
    // SETUP
    // =====================
    function setup() {
      let canvas = createCanvas(800, 700);
      canvas.parent('canvas-container');
      generateNewProblem();
    }

    // =====================
    // PROBLEM GENERATION
    // =====================
    function generateNewProblem() {
      targetSolution = floor(random(1, 6));
      targetA = floor(random(1, 5));
      targetB = floor(random(1, 7));
      targetC = targetA * targetSolution + targetB;
      
      cups = [];
      cubes = [];
      leftSide = { cups: 0, cubes: 0 };
      rightSide = { cups: 0, cubes: 0 };
      phase = 'build';
      setupCorrect = false;
      xValue = 0;
      solvingSteps = [];
      successGlow = 0;
    }

    // =====================
    // DRAW
    // =====================
    function draw() {
      background(255);
      
      updateAnimations();
      
      drawEquationArea();
      drawSolvingSteps();
      drawBalance();
      drawElementsOnBalance();
      drawSourceArea();
      drawButtons();
      
      if (selectedElement) {
        drawDraggedElement(selectedElement);
      }
      
      drawFadingElements();
    }

    // =====================
    // EQUATION AREA
    // =====================
    function drawEquationArea() {
      textAlign(CENTER, CENTER);
      textSize(48);
      textFont('Poppins');
      fill(50);
      
      let eqStr = formatEquation(targetA, targetB, targetC);
      text(eqStr, 400, EQUATION_Y);
      
      if (setupCorrect && phase === 'build') {
        drawCheckmark(580, EQUATION_Y, 1, color(34, 197, 94));
      }
      
      if (phase === 'solved') {
        if (successGlow > 0) {
          noStroke();
          fill(34, 197, 94, successGlow * 30);
          ellipse(400, EQUATION_Y, 500 + successGlow * 30, 100 + successGlow * 15);
        }
        drawCheckmark(560, EQUATION_Y, 1.2, color(34, 197, 94));
        drawCheckmark(610, EQUATION_Y, 1.2, color(34, 197, 94));
        drawCheckmark(660, EQUATION_Y, 1.2, color(34, 197, 94));
      }
    }
    
    function formatEquation(a, b, c) {
      let left = '';
      if (a === 1) {
        left = 'x';
      } else {
        left = a + 'x';
      }
      left += ' + ' + b;
      return left + ' = ' + c;
    }
    
    function drawCheckmark(x, y, scale, col) {
      push();
      translate(x, y);
      stroke(col);
      strokeWeight(5 * scale);
      noFill();
      beginShape();
      vertex(-15 * scale, 0);
      vertex(-5 * scale, 10 * scale);
      vertex(15 * scale, -10 * scale);
      endShape();
      pop();
    }

    // =====================
    // SOLVING STEPS
    // =====================
    function drawSolvingSteps() {
      if (solvingSteps.length === 0) return;
      
      textAlign(CENTER, CENTER);
      textFont('Poppins');
      textSize(32);
      
      let y = STEPS_START_Y;
      for (let i = 0; i < solvingSteps.length; i++) {
        fill(70);
        text(solvingSteps[i], 400, y);
        y += 42;
      }
    }

    // =====================
    // BALANCE
    // =====================
    function drawBalance() {
      // Fulcrum triangle
      fill(0);
      noStroke();
      triangle(400, BALANCE_BEAM_Y + 5, 375, BALANCE_BEAM_Y + 40, 425, BALANCE_BEAM_Y + 40);
      
      // Equals sign in fulcrum
      fill(255);
      noStroke();
      textSize(24);
      textAlign(CENTER, CENTER);
      text("=", 400, BALANCE_BEAM_Y + 25);
      
      // Balance beam
      stroke(0);
      strokeWeight(3);
      line(50, BALANCE_BEAM_Y, 375, BALANCE_BEAM_Y);
      line(425, BALANCE_BEAM_Y, 750, BALANCE_BEAM_Y);
      
      // Side labels
      fill(150);
      noStroke();
      textSize(14);
      textFont('Poppins');
      text('LEFT', BALANCE_LEFT_CENTER, BALANCE_BEAM_Y + 20);
      text('RIGHT', BALANCE_RIGHT_CENTER, BALANCE_BEAM_Y + 20);
      
      // Current equation display
      drawCurrentEquation();
    }
    
    function drawCurrentEquation() {
      let leftEq = buildSideEquation(leftSide);
      let rightEq = buildSideEquation(rightSide);
      
      if (leftEq === '' && rightEq === '') return;
      
      textSize(28);
      textFont('Poppins');
      textAlign(CENTER, CENTER);
      fill(80);
      
      let y = BALANCE_BEAM_Y + 55;
      text(leftEq || '0', BALANCE_LEFT_CENTER, y);
      text('=', 400, y);
      text(rightEq || '0', BALANCE_RIGHT_CENTER, y);
    }
    
    function buildSideEquation(side) {
      let parts = [];
      if (side.cups > 0) {
        if (side.cups === 1) {
          parts.push('x');
        } else {
          parts.push(side.cups + 'x');
        }
      }
      if (side.cubes > 0) {
        if (parts.length > 0) {
          parts.push('+ ' + side.cubes);
        } else {
          parts.push('' + side.cubes);
        }
      }
      return parts.join(' ');
    }

    // =====================
    // ELEMENTS ON BALANCE
    // =====================
    function drawElementsOnBalance() {
      // Draw cups with their contained cubes
      for (let cup of cups) {
        if (cup !== selectedElement) {
          drawCup(cup.x, cup.y, 80, 70);
          
          // In solve mode, draw cubes inside cups
          if (phase === 'solve' || phase === 'solved') {
            drawCubesInCup(cup);
          }
        }
      }
      
      // Draw loose cubes (only in build mode)
      if (phase === 'build') {
        for (let cube of cubes) {
          if (cube !== selectedElement) {
            drawCubeStack(cube.x, cube.y, cube.value);
          }
        }
      }
    }
    
    function drawCubesInCup(cup) {
      if (xValue <= 0) return;
      
      let cubesPerRow = 3;
      let cubeSize = 18;
      let startX = cup.x - 25;
      let startY = cup.y + 25;
      
      for (let i = 0; i < xValue && i < 12; i++) {
        let row = floor(i / cubesPerRow);
        let col = i % cubesPerRow;
        let cx = startX + col * (cubeSize + 2);
        let cy = startY - row * (cubeSize + 2);
        drawSingleCube(cx, cy, cubeSize, 'green');
      }
    }
    
    function drawCup(x, y, w, h) {
      // Cup body - translucent trapezoid like original
      fill(240, 248, 255, 180);
      stroke(180, 200, 220);
      strokeWeight(2);
      
      beginShape();
      vertex(x - w/2, y - h/2);
      vertex(x + w/2, y - h/2);
      vertex(x + w/2 * 0.85, y + h/2);
      vertex(x - w/2 * 0.85, y + h/2);
      endShape(CLOSE);
      
      // Top rim highlight
      stroke(200, 215, 235);
      strokeWeight(1);
      line(x - w/2, y - h/2, x + w/2, y - h/2);
      
      // Bottom shine
      fill(255, 255, 255, 100);
      noStroke();
      beginShape();
      vertex(x - w/2 * 0.7, y + h/2 - 8);
      vertex(x + w/2 * 0.7, y + h/2 - 8);
      vertex(x + w/2 * 0.65, y + h/2);
      vertex(x - w/2 * 0.65, y + h/2);
      endShape(CLOSE);
    }
    
    function drawCubeStack(x, y, value) {
      // Draw multiple cubes stacked/grouped based on value
      let size = 22;
      
      if (value === 1) {
        drawSingleCube(x, y, size, 'green');
      } else if (value === 3) {
        // 3 cubes in a row
        drawSingleCube(x - size, y, size, 'green');
        drawSingleCube(x, y, size, 'green');
        drawSingleCube(x + size, y, size, 'green');
      } else if (value === 9) {
        // 3x3 grid
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            drawSingleCube(x - size + col * size, y - size + row * size, size - 2, 'green');
          }
        }
      }
    }
    
    function drawSingleCube(x, y, size, col) {
      let s = size;
      let offset = s * 0.25;
      
      if (col === 'green') {
        // Right face
        fill(0, 110, 0);
        noStroke();
        beginShape();
        vertex(x + s/2, y - s/2 + offset);
        vertex(x + s/2 + offset, y - s/2);
        vertex(x + s/2 + offset, y + s/2);
        vertex(x + s/2, y + s/2 + offset);
        endShape(CLOSE);
        
        // Top face
        fill(0, 180, 0);
        beginShape();
        vertex(x - s/2, y - s/2 + offset);
        vertex(x - s/2 + offset, y - s/2);
        vertex(x + s/2 + offset, y - s/2);
        vertex(x + s/2, y - s/2 + offset);
        endShape(CLOSE);
        
        // Front face
        fill(0, 140, 0);
        stroke(0, 100, 0);
        strokeWeight(1);
        rect(x - s/2, y - s/2 + offset, s, s);
      } else {
        // Black cube
        fill(60, 60, 60);
        noStroke();
        beginShape();
        vertex(x + s/2, y - s/2 + offset);
        vertex(x + s/2 + offset, y - s/2);
        vertex(x + s/2 + offset, y + s/2);
        vertex(x + s/2, y + s/2 + offset);
        endShape(CLOSE);
        
        fill(120, 120, 120);
        beginShape();
        vertex(x - s/2, y - s/2 + offset);
        vertex(x - s/2 + offset, y - s/2);
        vertex(x + s/2 + offset, y - s/2);
        vertex(x + s/2, y - s/2 + offset);
        endShape(CLOSE);
        
        fill(80, 80, 80);
        stroke(50, 50, 50);
        strokeWeight(1);
        rect(x - s/2, y - s/2 + offset, s, s);
      }
    }
    
    function drawDraggedElement(elem) {
      push();
      // Slight scale up when dragging
      if (elem.type === 'cup') {
        drawCup(elem.x, elem.y, 85, 75);
      } else {
        drawCubeStack(elem.x, elem.y, elem.value);
      }
      pop();
    }

    // =====================
    // SOURCE AREA
    // =====================
    function drawSourceArea() {
      // Background
      noStroke();
      fill(250, 250, 250);
      rect(50, SOURCE_Y - 50, 700, 120, 8);
      
      // Divider line
      stroke(230);
      strokeWeight(1);
      line(50, SOURCE_Y - 50, 750, SOURCE_Y - 50);
      
      // Source cup
      drawCup(120, SOURCE_Y + 10, 70, 60);
      fill(150);
      noStroke();
      textSize(11);
      textFont('Poppins');
      textAlign(CENTER);
      text('cup = x', 120, SOURCE_Y + 55);
      
      // Single cube
      drawSingleCube(250, SOURCE_Y + 10, 24, 'green');
      fill(150);
      text('+1', 250, SOURCE_Y + 55);
      
      // 3-cube block
      drawCubeStack(380, SOURCE_Y + 10, 3);
      fill(150);
      text('+3', 380, SOURCE_Y + 55);
      
      // 9-cube block
      drawCubeStack(550, SOURCE_Y + 10, 9);
      fill(150);
      text('+9', 550, SOURCE_Y + 55);
    }

    // =====================
    // BUTTONS
    // =====================
    function drawButtons() {
      // Clear button
      let clearX = 680;
      let clearY = SOURCE_Y + 10;
      let clearW = 70;
      let clearH = 34;
      
      fill(clearButtonHover ? 235 : 245);
      stroke(200);
      strokeWeight(1);
      rect(clearX - clearW/2, clearY - clearH/2, clearW, clearH, 6);
      
      fill(120);
      noStroke();
      textSize(14);
      textFont('Poppins');
      textAlign(CENTER, CENTER);
      text('Clear', clearX, clearY);
      
      // Solve button
      if (setupCorrect && phase === 'build') {
        let solveX = 400;
        let solveY = BALANCE_BEAM_Y + 100;
        let solveW = 120;
        let solveH = 44;
        
        if (solveButtonHover) {
          fill(80, 45, 130);
        } else {
          fill(100, 60, 160);
        }
        noStroke();
        rect(solveX - solveW/2, solveY - solveH/2, solveW, solveH, 10);
        
        fill(255);
        textSize(18);
        textFont('Poppins');
        text('Solve', solveX, solveY);
      }
      
      // X input in solve mode
      if (phase === 'solve' || phase === 'solved') {
        drawXInput();
      }
    }
    
    function drawXInput() {
      let inputX = 400;
      let inputY = BALANCE_BEAM_Y + 100;
      
      fill(80);
      textSize(24);
      textFont('Poppins');
      textAlign(CENTER, CENTER);
      text('x =', inputX - 60, inputY);
      
      // Input box
      fill(255);
      stroke(phase === 'solved' ? color(34, 197, 94) : 180);
      strokeWeight(phase === 'solved' ? 3 : 1);
      rect(inputX - 25, inputY - 20, 70, 40, 6);
      
      // Value
      fill(50);
      noStroke();
      textSize(24);
      text(xValue, inputX + 10, inputY);
      
      // Hint
      if (phase === 'solve') {
        fill(170);
        textSize(13);
        text('drop cubes in cups or type a number', inputX + 10, inputY + 40);
      }
    }

    // =====================
    // FADING ELEMENTS
    // =====================
    function drawFadingElements() {
      for (let elem of fadingElements) {
        push();
        tint(255, elem.alpha);
        if (elem.type === 'cup') {
          // Fade by reducing opacity
          fill(240, 248, 255, elem.alpha * 0.7);
          stroke(180, 200, 220, elem.alpha);
          strokeWeight(2);
          beginShape();
          vertex(elem.x - 40, elem.y - 35);
          vertex(elem.x + 40, elem.y - 35);
          vertex(elem.x + 34, elem.y + 35);
          vertex(elem.x - 34, elem.y + 35);
          endShape(CLOSE);
        } else {
          // Simplified fade for cubes
          fill(0, 140, 0, elem.alpha);
          noStroke();
          rect(elem.x - 11, elem.y - 11, 22, 22);
        }
        pop();
      }
    }
    
    function updateAnimations() {
      for (let i = fadingElements.length - 1; i >= 0; i--) {
        fadingElements[i].alpha -= 12;
        if (fadingElements[i].alpha <= 0) {
          fadingElements.splice(i, 1);
        }
      }
      
      if (phase === 'solved' && successGlow < 5) {
        successGlow += 0.15;
      }
    }

    // =====================
    // INTERACTION
    // =====================
    function mousePressed() {
      let mx = mouseX;
      let my = mouseY;
      
      // Clear button
      if (mx > 645 && mx < 715 && my > SOURCE_Y - 7 && my < SOURCE_Y + 27) {
        clearWithFade();
        return;
      }
      
      // Solve button
      if (setupCorrect && phase === 'build') {
        if (mx > 340 && mx < 460 && my > BALANCE_BEAM_Y + 78 && my < BALANCE_BEAM_Y + 122) {
          startSolveMode();
          return;
        }
      }
      
      // X input click (to focus for keyboard input)
      if ((phase === 'solve' || phase === 'solved') && mx > 375 && mx < 445 && my > BALANCE_BEAM_Y + 80 && my < BALANCE_BEAM_Y + 120) {
        xInputFocused = true;
        return;
      }
      
      // Drag existing elements (build mode only)
      if (phase === 'build') {
        for (let cup of cups) {
          if (dist(mx, my, cup.x, cup.y) < 45) {
            selectedElement = cup;
            dragOffsetX = cup.x - mx;
            dragOffsetY = cup.y - my;
            return;
          }
        }
        for (let cube of cubes) {
          let hitSize = cube.value === 9 ? 40 : (cube.value === 3 ? 35 : 20);
          if (dist(mx, my, cube.x, cube.y) < hitSize) {
            selectedElement = cube;
            dragOffsetX = cube.x - mx;
            dragOffsetY = cube.y - my;
            return;
          }
        }
      }
      
      // Create new elements from source
      // Cup
      if (dist(mx, my, 120, SOURCE_Y + 10) < 45 && phase === 'build') {
        let newCup = { type: 'cup', x: mx, y: my, side: null };
        cups.push(newCup);
        selectedElement = newCup;
        dragOffsetX = 0;
        dragOffsetY = 0;
        return;
      }
      
      // Single cube
      if (dist(mx, my, 250, SOURCE_Y + 10) < 30) {
        let newCube = { type: 'cube', x: mx, y: my, side: null, value: 1 };
        cubes.push(newCube);
        selectedElement = newCube;
        dragOffsetX = 0;
        dragOffsetY = 0;
        return;
      }
      
      // 3-cube
      if (dist(mx, my, 380, SOURCE_Y + 10) < 40) {
        let newCube = { type: 'cube', x: mx, y: my, side: null, value: 3 };
        cubes.push(newCube);
        selectedElement = newCube;
        dragOffsetX = 0;
        dragOffsetY = 0;
        return;
      }
      
      // 9-cube
      if (dist(mx, my, 550, SOURCE_Y + 10) < 50) {
        let newCube = { type: 'cube', x: mx, y: my, side: null, value: 9 };
        cubes.push(newCube);
        selectedElement = newCube;
        dragOffsetX = 0;
        dragOffsetY = 0;
        return;
      }
    }
    
    function mouseDragged() {
      if (selectedElement) {
        selectedElement.x = mouseX + dragOffsetX;
        selectedElement.y = mouseY + dragOffsetY;
      }
    }
    
    function mouseReleased() {
      if (!selectedElement) return;
      
      let elem = selectedElement;
      selectedElement = null;
      
      let onBalance = elem.y < BALANCE_BEAM_Y - 10 && elem.y > BALANCE_BEAM_Y - 180;
      let onLeft = elem.x > 50 && elem.x < 375;
      let onRight = elem.x > 425 && elem.x < 750;
      
      if (onBalance && (onLeft || onRight)) {
        elem.side = onLeft ? 'left' : 'right';
        
        // In solve mode, cubes dropped anywhere add to x value
        if ((phase === 'solve') && elem.type === 'cube') {
          xValue += elem.value;
          // Remove from cubes array
          let idx = cubes.indexOf(elem);
          if (idx > -1) cubes.splice(idx, 1);
          checkSolved();
          return;
        }
        
        organizeElements();
        recalculateSides();
        checkSetup();
      } else {
        // Remove element
        if (elem.type === 'cup') {
          let idx = cups.indexOf(elem);
          if (idx > -1) {
            fadingElements.push({ ...elem, alpha: 255 });
            cups.splice(idx, 1);
          }
        } else {
          let idx = cubes.indexOf(elem);
          if (idx > -1) {
            fadingElements.push({ ...elem, alpha: 255 });
            cubes.splice(idx, 1);
          }
        }
        recalculateSides();
        checkSetup();
      }
    }
    
    function mouseMoved() {
      solveButtonHover = (setupCorrect && phase === 'build' && 
                          mouseX > 340 && mouseX < 460 && 
                          mouseY > BALANCE_BEAM_Y + 78 && mouseY < BALANCE_BEAM_Y + 122);
      clearButtonHover = (mouseX > 645 && mouseX < 715 && 
                          mouseY > SOURCE_Y - 7 && mouseY < SOURCE_Y + 27);
    }
    
    function keyPressed() {
      if (phase === 'solve') {
        if (key >= '0' && key <= '9') {
          xValue = xValue * 10 + int(key);
          if (xValue > 99) xValue = int(key);
          checkSolved();
        } else if (keyCode === BACKSPACE) {
          xValue = floor(xValue / 10);
        } else if (keyCode === ENTER) {
          checkSolved();
        }
      }
    }

    // =====================
    // ORGANIZE & CALCULATE
    // =====================
    function organizeElements() {
      let leftCups = cups.filter(c => c.side === 'left');
      let rightCups = cups.filter(c => c.side === 'right');
      
      // Position cups
      for (let i = 0; i < leftCups.length; i++) {
        let row = floor(i / 2);
        let col = i % 2;
        leftCups[i].x = 150 + col * 100;
        leftCups[i].y = BALANCE_BEAM_Y - 60 - row * 85;
      }
      
      for (let i = 0; i < rightCups.length; i++) {
        let row = floor(i / 2);
        let col = i % 2;
        rightCups[i].x = 500 + col * 100;
        rightCups[i].y = BALANCE_BEAM_Y - 60 - row * 85;
      }
      
      // Position loose cubes (constants)
      let leftCubes = cubes.filter(c => c.side === 'left');
      let rightCubes = cubes.filter(c => c.side === 'right');
      
      let leftCubeX = 300;
      for (let i = 0; i < leftCubes.length; i++) {
        leftCubes[i].x = leftCubeX;
        leftCubes[i].y = BALANCE_BEAM_Y - 50;
        leftCubeX += leftCubes[i].value === 9 ? 70 : (leftCubes[i].value === 3 ? 55 : 30);
      }
      
      let rightCubeX = 620;
      for (let i = 0; i < rightCubes.length; i++) {
        rightCubes[i].x = rightCubeX;
        rightCubes[i].y = BALANCE_BEAM_Y - 50;
        rightCubeX += rightCubes[i].value === 9 ? 70 : (rightCubes[i].value === 3 ? 55 : 30);
      }
    }
    
    function recalculateSides() {
      leftSide.cups = cups.filter(c => c.side === 'left').length;
      leftSide.cubes = cubes.filter(c => c.side === 'left').reduce((sum, c) => sum + c.value, 0);
      rightSide.cups = cups.filter(c => c.side === 'right').length;
      rightSide.cubes = cubes.filter(c => c.side === 'right').reduce((sum, c) => sum + c.value, 0);
    }
    
    function checkSetup() {
      let leftMatch = (leftSide.cups === targetA && leftSide.cubes === targetB);
      let rightMatch = (rightSide.cups === 0 && rightSide.cubes === targetC);
      setupCorrect = leftMatch && rightMatch;
    }

    // =====================
    // SOLVE MODE
    // =====================
    function startSolveMode() {
      phase = 'solve';
      solvingSteps = [];
      xValue = 0;
      // Remove loose cubes from balance for cleaner solve view
      cubes = [];
    }
    
    function checkSolved() {
      if (xValue === targetSolution) {
        solvingSteps = [];
        
        // Build the solving steps (inverted triangle)
        let step1Right = targetC - targetB;
        if (targetA === 1) {
          solvingSteps.push('x = ' + step1Right);
        } else {
          solvingSteps.push(targetA + 'x = ' + step1Right);
          solvingSteps.push('x = ' + targetSolution);
        }
        
        phase = 'solved';
        successGlow = 0;
      }
    }

    // =====================
    // CLEAR
    // =====================
    function clearWithFade() {
      for (let cup of cups) {
        fadingElements.push({ ...cup, alpha: 255 });
      }
      for (let cube of cubes) {
        fadingElements.push({ ...cube, alpha: 255 });
      }
      
      cups = [];
      cubes = [];
      leftSide = { cups: 0, cubes: 0 };
      rightSide = { cups: 0, cubes: 0 };
      setupCorrect = false;
      xValue = 0;
      solvingSteps = [];
      
      // Generate new problem on clear
      setTimeout(() => {
        generateNewProblem();
      }, 300);
    }

    // =====================
    // TOUCH SUPPORT
    // =====================
    function touchStarted() {
      mousePressed();
      return false;
    }
    
    function touchMoved() {
      mouseDragged();
      return false;
    }
    
    function touchEnded() {
      mouseReleased();
      return false;
    }
  </script>
</body>
</html>
