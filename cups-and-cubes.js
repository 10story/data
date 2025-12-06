
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Algebra Studio Balance Lab</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.2/p5.min.js"></script>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      height: 100vh; 
      background: #fff; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      position: relative; 
      overflow: hidden;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }
    #canvas-container { 
      position: relative; 
      width: 800px;
      height: 600px;
      border: 1px solid #ccc;
      border-top: none;
    }
    canvas { 
      display: block;
      width: 800px;
      height: 600px;
      touch-action: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
    }
    .controls {
      width: 802px;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      border: 1px solid #ccc;
      border-bottom: none;
      z-index: 30;
    }
    .left-controls {
      display: flex;
      align-items: center;
    }
    .center-controls {
      display: flex;
      align-items: center;
      gap: 25px;
    }
    .right-controls {
      display: flex;
      align-items: center;
    }
    .input-box {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
    .input-box label {
      font-family: Arial, sans-serif;
      font-size: 18px;
      margin-right: 5px;
      line-height: 30px;
    }
    .input-box input {
      padding: 3px;
      width: 60px;
      font-size: 18px;
      border: 1px solid #ccc;
      -moz-appearance: textfield;
    }
    .input-box input::-webkit-outer-spin-button, .input-box input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .clear-button {
      padding: 2px 8px;
      font-size: 12px;
      margin-right: 5px;
    }
    .problem-selector {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .problem-selector select {
      padding: 4px 8px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    .new-problem-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: transform 0.1s;
    }
    .new-problem-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(0,0,0,0.3);
    }
    .new-problem-button:active {
      transform: translateY(0px);
    }
  </style>
</head>
<body>
  <div class="controls">
    <div class="left-controls">
      <div class="input-box">
        <label>x =</label><input type="number" id="xInput" placeholder=" " step="0.01">
      </div>
      <button class="check-button" id="checkButton" style="padding: 2px 8px; font-size: 12px; margin-right: 5px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Check</button>
    </div>
    <div class="center-controls">
      <button class="clear-button" id="newSetupButton">Clear Setup</button>
      <div class="problem-selector">
        <label>Type:</label>
        <select id="problemType">
          <option value="create-your-own">Create Your Own</option>
          <option value="positive-numbers">Equations with Positive Numbers</option>
          <option value="negative-numbers">Equations with Negative Numbers</option>
          <option value="distributive">Distributive Property</option>
          <option value="challenge">Challenge</option>
        </select>
      </div>
    </div>
    <div class="right-controls">
      <button class="new-problem-button" id="newProblemButton">New Equation</button>
    </div>
  </div>
  <div id="canvas-container">
  </div>

  <script>
    // Global variables
    let cups = [];
    let cubes = [];
    let sourceElements = [];
    let selectedElement = null;
    let leftSide = { cups: 0, positiveConst: 0, negativeConst: 0 };
    let rightSide = { cups: 0, positiveConst: 0, negativeConst: 0 };
    const ON_BALANCE_THRESHOLD = 130;
    let xValue = 0;
    let showEquality = false;
    let isEqual = false;
    let balanceTilt = 0;
    let currentEquation = null;
    let targetLeft = { cups: 0, positiveConst: 0, negativeConst: 0 };
    let targetRight = { cups: 0, positiveConst: 0, negativeConst: 0 };
    let setupCorrect = false;
    let equationBalanced = false;
    let showCubesInCups = true;
    let animatingZeroPairs = [];

    // P5.js setup function
    function setup() {
      let canvas = createCanvas(800, 600);
      canvas.parent('canvas-container');
      
      // Initialize source elements
      sourceElements.push({ x: 300, y: 30, type: 'cup', side: 'source', width: 60, height: 50 });
      sourceElements.push({ x: 400, y: 50, type: 'cube', value: 1, side: 'source', color: 'green' });
      sourceElements.push({ x: 460, y: 50, type: 'cube', value: -1, side: 'source', color: 'black' });
      
      // Event listeners
      document.getElementById('newSetupButton').addEventListener('click', clearSetup);
      document.getElementById('newProblemButton').addEventListener('click', generateNewProblem);
      document.getElementById('checkButton').addEventListener('click', checkEquality);
      document.getElementById('xInput').addEventListener('input', updateEquation);
      document.getElementById('problemType').addEventListener('change', updateNewEquationButton);
      
      updateCheckButton();
      updateNewEquationButton();
    }

    // P5.js draw function
    function draw() {
      background(255);
      
      updateZeroPairAnimations();
      
      // Draw balance fulcrum
      stroke(0);
      strokeWeight(2);
      fill(0);
      triangle(400, 405, 380, 425, 420, 425);
      
      // Draw balance beam with gap in middle to show separate pans
      stroke(0);
      strokeWeight(2);
      if (balanceTilt === -1) {
        line(50, 425, 385, 410); // Left pan
        line(415, 390, 750, 375); // Right pan
      } else if (balanceTilt === 1) {
        line(50, 375, 385, 390); // Left pan
        line(415, 410, 750, 425); // Right pan
      } else {
        line(50, 400, 385, 400); // Left pan
        line(415, 400, 750, 400); // Right pan
      }
      
      // Draw white equals sign centered in fulcrum triangle
      fill(255);
      noStroke();
      textSize(20);
      textAlign(CENTER);
      text("=", 400, 422);

      // Draw source elements
      for (let elem of sourceElements) {
        if (elem.type === 'cup') {
          drawCup(elem.x, elem.y, elem.width, elem.height);
        } else {
          drawCube(elem.x, elem.y, elem.color);
        }
      }

      // Draw cups on balance
      for (let cup of cups) {
        drawCup(cup.x, cup.y, 80, 70);
        if (cup.containsCubes && showCubesInCups) {
          let baseY = cup.y + 70;
          let centerX = cup.x + 40;
          
          for (let i = 0; i < cup.containsCubes.length; i++) {
            let cube = cup.containsCubes[i];
            let row = Math.floor(i / 3);
            let col = i % 3;
            let xOffset = centerX - 30 + col * 22;
            let yOffset = baseY - (row + 1) * 22;
            
            if (yOffset + 16 <= cup.y + 70) {
              drawCube(xOffset, yOffset, cube.color, true, false, cube.proportion || 1);
            }
          }
        }
      }

      // Draw cubes on balance
      for (let cube of cubes) {
        if (cube.y < 400) {
          drawCube(cube.x, cube.y, cube.color);
        }
      }

      // Draw zero pair animations
      drawZeroPairAnimations();

      // Draw selected element
      if (selectedElement && selectedElement.type === 'cube' && selectedElement.y < 400) {
        drawCube(selectedElement.x, selectedElement.y, selectedElement.color);
      }

      // Draw side labels
      textSize(12);
      textAlign(CENTER);
      fill(150);
      if (balanceTilt === -1) {
        text('LEFT', 200, 430);
        text('RIGHT', 600, 390);
      } else if (balanceTilt === 1) {
        text('LEFT', 200, 390);
        text('RIGHT', 600, 430);
      } else {
        text('LEFT', 200, 415);
        text('RIGHT', 600, 415);
      }

      // Draw equations
      textSize(32);
      fill(0);
      let leftEq, rightEq;
      
      if (showEquality) {
        leftEq = buildEquationWithSubstitution(leftSide);
        rightEq = buildEquationWithSubstitution(rightSide);
      } else {
        leftEq = buildEquation(leftSide);
        rightEq = buildEquation(rightSide);
      }
      
      text(leftEq, 200, 505);
      text(rightEq, 600, 505);

      // Draw equality symbol
      if (showEquality) {
        textSize(48);
        textAlign(CENTER);
        if (isEqual) {
          fill(0, 200, 0);
          text('=', 400, 505);
        } else {
          fill(255, 0, 0);
          text('≠', 400, 505);
        }
      }

      // Draw current equation
      textSize(36);
      textAlign(LEFT);
      fill(0);
      if (currentEquation) {
        text(currentEquation, 20, 40);
      }
      
      // Draw check marks
      if (setupCorrect || equationBalanced) {
        fill(0, 200, 0);
        textSize(48);
        textAlign(RIGHT);
        if (equationBalanced) {
          text("✓✓✓", 780, 50);
        } else if (setupCorrect) {
          text("✓", 780, 50);
        }
      }
    }

    function clearSetup() {
      // Clear contents of existing cups first
      for (let cup of cups) {
        cup.containsCubes = [];
      }
      
      // Then clear the arrays
      cups = [];
      cubes = [];
      
      // Reset values
      xValue = 0;
      document.getElementById('xInput').value = '';
      showEquality = false;
      balanceTilt = 0;
      equationBalanced = false;
      setupCorrect = false;
      currentEquation = null;
      targetLeft = { cups: 0, positiveConst: 0, negativeConst: 0 };
      targetRight = { cups: 0, positiveConst: 0, negativeConst: 0 };
      updateCheckButton();
      recalculateSides();
    }

    function generateNewProblem() {
      let problemType = document.getElementById('problemType').value;
      
      // Don't generate if Create Your Own is selected
      if (problemType === 'create-your-own') {
        return;
      }
      
      clearSetup();
      
      if (problemType === 'positive-numbers') {
        generatePositiveNumberProblem();
      } else if (problemType === 'negative-numbers') {
        generateNegativeNumberProblem();
      } else if (problemType === 'distributive') {
        generateDistributiveProblem();
      } else if (problemType === 'challenge') {
        generateChallengeProblem();
      }
      
      updateCheckButton();
      recalculateSides();
    }

    function generatePositiveNumberProblem() {
      let solution = Math.floor(Math.random() * 12) + 1; // 1-12
      let type = Math.floor(Math.random() * 3);
      
      if (type === 0) {
        // x + a = b
        let a = Math.floor(Math.random() * Math.min(11, 12 - solution)) + 1;
        let b = solution + a;
        currentEquation = 'x + ' + a + ' = ' + b;
        targetLeft = { cups: 1, positiveConst: a, negativeConst: 0 };
        targetRight = { cups: 0, positiveConst: b, negativeConst: 0 };
      } else if (type === 1) {
        // ax = b
        let a = Math.floor(Math.random() * 4) + 2; // 2-5
        if (a * solution <= 12) {
          let b = a * solution;
          currentEquation = a + 'x = ' + b;
          targetLeft = { cups: a, positiveConst: 0, negativeConst: 0 };
          targetRight = { cups: 0, positiveConst: b, negativeConst: 0 };
        } else {
          // Fallback to addition
          let a = Math.floor(Math.random() * Math.min(11, 12 - solution)) + 1;
          let b = solution + a;
          currentEquation = 'x + ' + a + ' = ' + b;
          targetLeft = { cups: 1, positiveConst: a, negativeConst: 0 };
          targetRight = { cups: 0, positiveConst: b, negativeConst: 0 };
        }
      } else {
        // ax + b = c
        let a = Math.floor(Math.random() * 3) + 2; // 2-4
        let b = Math.floor(Math.random() * Math.min(8, 12 - (a * solution))) + 1;
        let c = a * solution + b;
        if (c <= 12) {
          currentEquation = a + 'x + ' + b + ' = ' + c;
          targetLeft = { cups: a, positiveConst: b, negativeConst: 0 };
          targetRight = { cups: 0, positiveConst: c, negativeConst: 0 };
        } else {
          // Fallback to simpler equation
          let a = Math.floor(Math.random() * Math.min(11, 12 - solution)) + 1;
          let b = solution + a;
          currentEquation = 'x + ' + a + ' = ' + b;
          targetLeft = { cups: 1, positiveConst: a, negativeConst: 0 };
          targetRight = { cups: 0, positiveConst: b, negativeConst: 0 };
        }
      }
    }

    function generateNegativeNumberProblem() {
      let solution = Math.floor(Math.random() * 12) + 1; // 1-12
      let type = Math.floor(Math.random() * 2);
      
      if (type === 0) {
        // x - a = b
        let a = Math.floor(Math.random() * Math.min(solution - 1, 11)) + 1;
        let b = solution - a;
        if (b > 0) {
          currentEquation = 'x - ' + a + ' = ' + b;
          targetLeft = { cups: 1, positiveConst: 0, negativeConst: -a };
          targetRight = { cups: 0, positiveConst: b, negativeConst: 0 };
        } else {
          // Alternative: a - x = b
          a = Math.floor(Math.random() * 11) + 2; // 2-12
          let b = a - solution;
          if (b > 0 && b <= 12) {
            currentEquation = a + ' - x = ' + b;
            targetLeft = { cups: 0, positiveConst: a, negativeConst: 0 };
            targetRight = { cups: 1, positiveConst: b, negativeConst: 0 };
          }
        }
      } else {
        // ax - b = c
        let a = Math.floor(Math.random() * 3) + 2; // 2-4
        let b = Math.floor(Math.random() * Math.min(a * solution - 1, 11)) + 1;
        let c = a * solution - b;
        if (c > 0 && c <= 12) {
          currentEquation = a + 'x - ' + b + ' = ' + c;
          targetLeft = { cups: a, positiveConst: 0, negativeConst: -b };
          targetRight = { cups: 0, positiveConst: c, negativeConst: 0 };
        }
      }
    }

    function generateDistributiveProblem() {
      let solution = Math.floor(Math.random() * 6) + 1; // 1-6 (smaller for distributive)
      let a = Math.floor(Math.random() * 5) + 2; // 2-6 (more variety)
      let b = Math.floor(Math.random() * 4) + 1; // 1-4
      let c = a * (solution + b);
      
      if (c <= 12) {
        currentEquation = a + '(x + ' + b + ') = ' + c;
        // This expands to ax + ab = c
        targetLeft = { cups: a, positiveConst: a * b, negativeConst: 0 };
        targetRight = { cups: 0, positiveConst: c, negativeConst: 0 };
      } else {
        // Try different values
        a = Math.floor(Math.random() * 3) + 2; // 2-4
        b = Math.floor(Math.random() * 3) + 1; // 1-3
        c = a * (solution + b);
        if (c <= 12) {
          currentEquation = a + '(x + ' + b + ') = ' + c;
          targetLeft = { cups: a, positiveConst: a * b, negativeConst: 0 };
          targetRight = { cups: 0, positiveConst: c, negativeConst: 0 };
        } else {
          // Final fallback
          currentEquation = '3(x + 1) = 12';
          targetLeft = { cups: 3, positiveConst: 3, negativeConst: 0 };
          targetRight = { cups: 0, positiveConst: 12, negativeConst: 0 };
        }
      }
    }

    function generateChallengeProblem() {
      let solution = Math.floor(Math.random() * 12) + 1; // 1-12
      let type = Math.floor(Math.random() * 2);
      
      if (type === 0) {
        // ax + b = cx + d (variables on both sides)
        let a = Math.floor(Math.random() * 4) + 2; // 2-5
        let c = Math.floor(Math.random() * 3) + 1; // 1-3
        while (a === c) {
          c = Math.floor(Math.random() * 3) + 1;
        }
        
        let b = Math.floor(Math.random() * 8) + 1; // 1-8
        let d = b + solution * (a - c);
        
        if (d > 0 && d <= 12) {
          currentEquation = a + 'x + ' + b + ' = ' + (c > 1 ? c : '') + 'x + ' + d;
          targetLeft = { cups: a, positiveConst: b, negativeConst: 0 };
          targetRight = { cups: c, positiveConst: d, negativeConst: 0 };
        } else {
          // Fallback to simpler
          a = 3; c = 1; b = 5;
          d = b + solution * (a - c);
          if (d <= 12) {
            currentEquation = a + 'x + ' + b + ' = x + ' + d;
            targetLeft = { cups: a, positiveConst: b, negativeConst: 0 };
            targetRight = { cups: c, positiveConst: d, negativeConst: 0 };
          }
        }
      } else {
        // More complex single-side equation
        let a = Math.floor(Math.random() * 3) + 2;
        let b = Math.floor(Math.random() * 6) + 1;
        let c = Math.floor(Math.random() * 6) + 1;
        let d = a * solution + b - c;
        
        if (d > 0 && d <= 12) {
          currentEquation = a + 'x + ' + b + ' - ' + c + ' = ' + d;
          targetLeft = { cups: a, positiveConst: b, negativeConst: -c };
          targetRight = { cups: 0, positiveConst: d, negativeConst: 0 };
        }
      }
    }

    function buildEquation(side) {
      let n = side.cups;
      let y = side.positiveConst;
      let z = side.negativeConst;
      
      if (n === 0 && y === 0 && z === 0) return '';
      
      let parts = [];
      if (n > 1) parts.push(n + 'x');
      else if (n === 1) parts.push('x');
      if (y > 0) parts.push((parts.length > 0 ? '+ ' : '') + y);
      if (z < 0) parts.push((parts.length > 0 ? '' : '') + z);
      return parts.join(' ') || '0';
    }

    function buildEquationWithSubstitution(side) {
      let n = side.cups;
      let y = side.positiveConst;
      let z = side.negativeConst;
      
      if (n === 0 && y === 0 && z === 0) return '0';
      
      let parts = [];
      if (n > 1) parts.push(n + '(' + xValue + ')');
      else if (n === 1) parts.push('' + xValue);
      if (y > 0) parts.push((parts.length > 0 ? '+ ' : '') + y);
      if (z < 0) parts.push((parts.length > 0 ? '' : '') + z);
      return parts.join(' ') || '0';
    }

    function drawCup(x, y, width, height) {
      width = width || 80;
      height = height || 70;
      
      fill(240, 248, 255, 180);
      stroke(180, 200, 220);
      strokeWeight(2);
      beginShape();
      vertex(x + width, y);
      vertex(x + width * 0.9, y + height);
      vertex(x + width * 0.1, y + height);
      vertex(x + 0, y);
      endShape(CLOSE);
      
      stroke(200, 215, 235);
      strokeWeight(1);
      line(x, y, x + width, y);
      
      fill(255, 255, 255, 100);
      noStroke();
      beginShape();
      vertex(x + width * 0.85, y + height - 10);
      vertex(x + width * 0.15, y + height - 10);
      vertex(x + width * 0.2, y + height);
      vertex(x + width * 0.8, y + height);
      endShape(CLOSE);
    }

    function drawCube(x, y, color, inCup, isHalf, proportion) {
      proportion = proportion || 1;
      let size = 16;
      let width = size * proportion;
      
      if (color === 'green') {
        fill(0, 140, 0);
        stroke(0, 100, 0);
        strokeWeight(1);
        rect(x, y + 4, width, size);
        
        fill(0, 180, 0);
        noStroke();
        beginShape();
        vertex(x, y + 4);
        vertex(x + 4, y);
        vertex(x + width + 4, y);
        vertex(x + width, y + 4);
        endShape(CLOSE);
        
        fill(0, 110, 0);
        beginShape();
        vertex(x + width, y + 4);
        vertex(x + width + 4, y);
        vertex(x + width + 4, y + size);
        vertex(x + width, y + size + 4);
        endShape(CLOSE);
      } else {
        fill(80, 80, 80);
        stroke(50, 50, 50);
        strokeWeight(1);
        rect(x, y + 4, width, size);
        
        fill(120, 120, 120);
        noStroke();
        beginShape();
        vertex(x, y + 4);
        vertex(x + 4, y);
        vertex(x + width + 4, y);
        vertex(x + width, y + 4);
        endShape(CLOSE);
        
        fill(60, 60, 60);
        beginShape();
        vertex(x + width, y + 4);
        vertex(x + width + 4, y);
        vertex(x + width + 4, y + size);
        vertex(x + width, y + size + 4);
        endShape(CLOSE);
      }
    }

    function populateCupWithCurrentX(cup) {
      cup.containsCubes = [];
      let cubeColor = xValue >= 0 ? 'green' : 'black';
      let absXValue = Math.abs(xValue);
      
      let wholeCubes = Math.floor(absXValue);
      let fractionalPart = absXValue - wholeCubes;
      
      for (let i = 0; i < wholeCubes; i++) {
        cup.containsCubes.push({ color: cubeColor, value: 1, proportion: 1 });
      }
      
      if (fractionalPart > 0) {
        cup.containsCubes.push({ color: cubeColor, value: fractionalPart, proportion: fractionalPart });
      }
    }

    function updateEquation() {
      let inputValue = document.getElementById('xInput').value;
      if (inputValue === '') {
        xValue = 0;
      } else {
        let parsedValue = parseFloat(inputValue);
        if (!isNaN(parsedValue)) {
          xValue = parsedValue;
        } else {
          xValue = 0;
          document.getElementById('xInput').value = '';
        }
      }
      
      // Update all existing cups with new x value
      for (let cup of cups) {
        populateCupWithCurrentX(cup);
      }
      
      showEquality = false;
      balanceTilt = 0;
      updateCheckButton();
      recalculateSides();
    }

    function updateCheckButton() {
      let checkButton = document.getElementById('checkButton');
      let inputValue = document.getElementById('xInput').value;
      
      if (inputValue !== '') {
        checkButton.style.opacity = '1';
        checkButton.style.cursor = 'pointer';
        checkButton.disabled = false;
      } else {
        checkButton.style.opacity = '0.5';
        checkButton.style.cursor = 'not-allowed';
        checkButton.disabled = true;
      }
    }

    function updateNewEquationButton() {
      let newProblemButton = document.getElementById('newProblemButton');
      let problemType = document.getElementById('problemType').value;
      
      if (problemType === 'create-your-own') {
        newProblemButton.style.opacity = '0.5';
        newProblemButton.style.cursor = 'not-allowed';
        newProblemButton.disabled = true;
      } else {
        newProblemButton.style.opacity = '1';
        newProblemButton.style.cursor = 'pointer';
        newProblemButton.disabled = false;
      }
    }

    function checkEquality() {
      // Don't proceed if button is disabled
      if (document.getElementById('checkButton').disabled) {
        return;
      }
      
      if (showEquality) {
        // If already showing equality, return to un-checked state
        showEquality = false;
        balanceTilt = 0;
        equationBalanced = false;
      } else {
        // If not showing equality, perform the check
        let leftValue = calculateSideValue(leftSide);
        let rightValue = calculateSideValue(rightSide);
        isEqual = (leftValue === rightValue);
        showEquality = true;
        
        if (isEqual) {
          equationBalanced = true;
        } else {
          equationBalanced = false;
        }
        
        balanceTilt = 0;
      }
    }

    function calculateSideValue(side) {
      return side.cups * xValue + side.positiveConst + side.negativeConst;
    }

    function recalculateSides() {
      leftSide = { cups: 0, positiveConst: 0, negativeConst: 0 };
      rightSide = { cups: 0, positiveConst: 0, negativeConst: 0 };

      for (let cup of cups) {
        if (cup.side === 'left') leftSide.cups++;
        else if (cup.side === 'right') rightSide.cups++;
      }

      for (let cube of cubes) {
        if (cube.y < 400 && cube.side) {
          if (cube.side === 'left') {
            if (cube.color === 'green') leftSide.positiveConst += cube.value;
            else leftSide.negativeConst += cube.value;
          } else if (cube.side === 'right') {
            if (cube.color === 'green') rightSide.positiveConst += cube.value;
            else rightSide.negativeConst += cube.value;
          }
        }
      }
      
      checkSetupCorrect();
    }

    function checkSetupCorrect() {
      if (!currentEquation) {
        setupCorrect = false;
        return;
      }
      
      let leftMatches = (leftSide.cups === targetLeft.cups && 
                        leftSide.positiveConst === targetLeft.positiveConst && 
                        leftSide.negativeConst === targetLeft.negativeConst);
      let rightMatches = (rightSide.cups === targetRight.cups && 
                         rightSide.positiveConst === targetRight.positiveConst && 
                         rightSide.negativeConst === targetRight.negativeConst);
      
      let physicalSetupCorrect = leftMatches && rightMatches;
      
      let inputValue = document.getElementById('xInput').value;
      if (inputValue === '' && physicalSetupCorrect) {
        setupCorrect = true;
      } else {
        setupCorrect = false;
      }
    }

    // Zero pair animation functions
    function updateZeroPairAnimations() {
      for (let i = animatingZeroPairs.length - 1; i >= 0; i--) {
        let pair = animatingZeroPairs[i];
        pair.animationFrame++;
        
        pair.cube1.y += 3;
        pair.cube2.y += 3;
        
        if (pair.cube1.y > 450) {
          animatingZeroPairs.splice(i, 1);
        }
      }
    }

    function drawZeroPairAnimations() {
      for (let pair of animatingZeroPairs) {
        drawCube(pair.cube1.x, pair.cube1.y, pair.cube1.color);
        drawCube(pair.cube2.x, pair.cube2.y, pair.cube2.color);
      }
    }

    function checkZeroPairCollision(draggedCube) {
      if (!draggedCube || draggedCube.type !== 'cube') return false;
      
      for (let otherCube of cubes) {
        if (otherCube === draggedCube) continue;
        if (otherCube.color === draggedCube.color) continue;
        if (otherCube.y >= 400) continue;
        
        let distance = Math.sqrt(
          Math.pow(draggedCube.x - otherCube.x, 2) + 
          Math.pow(draggedCube.y - otherCube.y, 2)
        );
        
        if (distance < 25) {
          createZeroPair(draggedCube, otherCube);
          return true;
        }
      }
      return false;
    }

    function createZeroPair(cube1, cube2) {
      let index1 = cubes.indexOf(cube1);
      let index2 = cubes.indexOf(cube2);
      
      if (index1 > -1) cubes.splice(index1, 1);
      if (index2 > -1) cubes.splice(index2, 1);
      
      let lockX = (cube1.x + cube2.x) / 2;
      let lockY = (cube1.y + cube2.y) / 2;
      
      animatingZeroPairs.push({
        cube1: { x: lockX, y: lockY, color: cube1.color },
        cube2: { x: lockX + 20, y: lockY, color: cube2.color },
        animationFrame: 0
      });
      
      selectedElement = null;
      showEquality = false;
      balanceTilt = 0;
      equationBalanced = false;
      recalculateSides();
    }

    // Mouse and touch interaction functions
    function mousePressed() {
      let x = mouseX || (touches && touches.length > 0 ? touches[0].x : 0);
      let y = mouseY || (touches && touches.length > 0 ? touches[0].y : 0);
      
      selectedElement = null;
      
      // Check for existing cup selection (prioritize over cubes for easier selection)
      for (let cup of cups) {
        if (x > cup.x && x < cup.x + 80 && y > cup.y && y < cup.y + 70) {
          selectedElement = cup;
          selectedElement.isRepositioning = true;
          return;
        }
      }
      
      // Check for existing cube selection
      for (let cube of cubes) {
        if (x > cube.x && x < cube.x + 40 && y > cube.y && y < cube.y + 40) {
          selectedElement = cube;
          selectedElement.isRepositioning = true;
          return;
        }
      }
      
      // Check for source element selection (creating new elements)
      for (let elem of sourceElements) {
        let elemWidth = elem.type === 'cup' ? elem.width : 40;
        let elemHeight = elem.type === 'cup' ? elem.height : 40;
        if (x > elem.x && x < elem.x + elemWidth && y > elem.y && y < elem.y + elemHeight) {
          if (elem.type === 'cup') {
            selectedElement = { x: x - 40, y: y - 35, type: 'cup', side: null, containsCubes: [], isRepositioning: false };
            cups.push(selectedElement);
          } else if (elem.type === 'cube') {
            selectedElement = { x: x - 20, y: y - 20, type: 'cube', value: elem.value, side: null, color: elem.color, isRepositioning: false };
            cubes.push(selectedElement);
          }
          return;
        }
      }
    }

    function mouseDragged() {
      if (!selectedElement) return;
      
      let x = mouseX || (touches && touches.length > 0 ? touches[0].x : 0);
      let y = mouseY || (touches && touches.length > 0 ? touches[0].y : 0);
      
      if (selectedElement.type === 'cup') {
        selectedElement.x = x - 40;
        selectedElement.y = y - 35;
        
        // If repositioning an existing cup, constrain to left side of its pan
        if (selectedElement.isRepositioning && selectedElement.side) {
          if (selectedElement.side === 'left') {
            // Keep on left side of left pan
            if (selectedElement.x < 50) selectedElement.x = 50;
            if (selectedElement.x > 230) selectedElement.x = 230;
          } else if (selectedElement.side === 'right') {
            // Keep on left side of right pan  
            if (selectedElement.x < 400) selectedElement.x = 400;
            if (selectedElement.x > 530) selectedElement.x = 530;
          }
          // Keep within vertical bounds of balance
          if (selectedElement.y < 150) selectedElement.y = 150;
          if (selectedElement.y > 350) selectedElement.y = 350;
        }
      } else if (selectedElement.type === 'cube') {
        selectedElement.x = x - 20;
        selectedElement.y = y - 20;
        
        // If repositioning an existing cube, constrain to right side of its pan
        if (selectedElement.isRepositioning && selectedElement.side) {
          if (selectedElement.side === 'left') {
            // Keep on right side of left pan (constant area)
            if (selectedElement.x < 250) selectedElement.x = 250;
            if (selectedElement.x > 380) selectedElement.x = 380;
          } else if (selectedElement.side === 'right') {
            // Keep on right side of right pan (constant area)
            if (selectedElement.x < 580) selectedElement.x = 580;
            if (selectedElement.x > 750) selectedElement.x = 750;
          }
          // Keep within vertical bounds of balance
          if (selectedElement.y < 150) selectedElement.y = 150;
          if (selectedElement.y > 380) selectedElement.y = 380;
        } else {
          // Check for zero pair collision while dragging new cubes
          let collisionHappened = checkZeroPairCollision(selectedElement);
          if (collisionHappened) {
            return; // Exit early if collision happened
          }
        }
      }
    }

    function mouseReleased() {
      if (!selectedElement) return;
      
      // Delete if dragged to top or bottom
      if (mouseY < 50 || mouseY > 500) {
        if (selectedElement.type === 'cup') {
          let index = cups.indexOf(selectedElement);
          if (index > -1) cups.splice(index, 1);
        } else if (selectedElement.type === 'cube') {
          let index = cubes.indexOf(selectedElement);
          if (index > -1) cubes.splice(index, 1);
        }
        selectedElement = null;
        recalculateSides();
        return;
      }

      // Special handling for cubes dropped in cups
      if (selectedElement.type === 'cube') {
        // Check if dropped in a cup first
        let droppedInCup = null;
        for (let cup of cups) {
          if (selectedElement.x + 20 > cup.x && selectedElement.x + 20 < cup.x + 80 && 
              selectedElement.y + 20 > cup.y && selectedElement.y + 20 < cup.y + 70) {
            droppedInCup = cup;
            break;
          }
        }
        
        if (droppedInCup) {
          // Dropped in cup - increment x value
          let valueChange = selectedElement.color === 'green' ? 1 : -1;
          xValue += valueChange;
          document.getElementById('xInput').value = xValue;
          
          let index = cubes.indexOf(selectedElement);
          if (index > -1) cubes.splice(index, 1);
          
          updateEquation();
          selectedElement = null;
          return;
        }
        
        // Check if dropped on balance area (below y=400 and above y=130)
        if (selectedElement.y > ON_BALANCE_THRESHOLD && selectedElement.y < 400) {
          let newSide = selectedElement.x < 400 ? 'left' : 'right';
          
          if (selectedElement.isRepositioning) {
            // If repositioning and staying on same side, don't reorganize
            if (selectedElement.side === newSide) {
              selectedElement = null;
              recalculateSides();
              return;
            } else {
              // Moving to different side - reorganize
              selectedElement.side = newSide;
              organizeCubes();
            }
          } else {
            // New cube placement - auto-organize
            selectedElement.side = newSide;
            organizeCubes();
          }
          
          selectedElement = null;
          recalculateSides();
          return;
        } else {
          // Dropped outside balance area - delete cube
          let index = cubes.indexOf(selectedElement);
          if (index > -1) cubes.splice(index, 1);
          selectedElement = null;
          recalculateSides();
          return;
        }
      }
      
      // Normal placement logic for cups
      if (selectedElement.type === 'cup') {
        // Only place cups on the balance area
        if (selectedElement.y > ON_BALANCE_THRESHOLD && selectedElement.y < 400) {
          let newSide = selectedElement.x < 400 ? 'left' : 'right';
          
          if (selectedElement.isRepositioning) {
            // If repositioning and staying on same side, don't reorganize
            if (selectedElement.side === newSide) {
              selectedElement = null;
              recalculateSides();
              return;
            } else {
              // Moving to different side - reorganize
              selectedElement.side = newSide;
              organizeCups();
            }
          } else {
            // New cup placement
            selectedElement.side = newSide;
            populateCupWithCurrentX(selectedElement);
            organizeCups();
          }
          
          selectedElement = null;
          recalculateSides();
        } else {
          // Cup dropped outside balance area - delete it
          let index = cups.indexOf(selectedElement);
          if (index > -1) cups.splice(index, 1);
          selectedElement = null;
          recalculateSides();
        }
      }
    }

    function organizeCups() {
      let leftCups = cups.filter(c => c.side === 'left');
      let rightCups = cups.filter(c => c.side === 'right');
      
      // Left pan cups go on left side of left pan
      for (let i = 0; i < leftCups.length; i++) {
        let row = Math.floor(i / 2);
        let col = i % 2;
        leftCups[i].x = 50 + col * 90;
        leftCups[i].y = 300 - row * 90;
      }
      
      // Right pan cups go on LEFT side of right pan (mirror left pan behavior)
      for (let i = 0; i < rightCups.length; i++) {
        let row = Math.floor(i / 2);
        let col = i % 2;
        rightCups[i].x = 400 + col * 90;
        rightCups[i].y = 300 - row * 90;
      }
    }

    function organizeCubes() {
      let leftGreen = cubes.filter(c => c.side === 'left' && c.color === 'green' && c.y < 400);
      let leftBlack = cubes.filter(c => c.side === 'left' && c.color === 'black' && c.y < 400);
      let rightGreen = cubes.filter(c => c.side === 'right' && c.color === 'green' && c.y < 400);
      let rightBlack = cubes.filter(c => c.side === 'right' && c.color === 'black' && c.y < 400);
      
      // Organize left side cubes (to the right of left side cups)
      for (let i = 0; i < leftGreen.length; i++) {
        let row = Math.floor(i / 3);
        let col = i % 3;
        leftGreen[i].x = 250 + col * 22;
        leftGreen[i].y = 370 - (row + 1) * 22;
      }
      
      for (let i = 0; i < leftBlack.length; i++) {
        let row = Math.floor(i / 3);
        let col = i % 3;
        leftBlack[i].x = 338 + col * 22;
        leftBlack[i].y = 370 - (row + 1) * 22;
      }
      
      // Organize right side cubes (to the right of right side cups)
      for (let i = 0; i < rightGreen.length; i++) {
        let row = Math.floor(i / 3);
        let col = i % 3;
        rightGreen[i].x = 580 + col * 22;
        rightGreen[i].y = 370 - (row + 1) * 22;
      }
      
      for (let i = 0; i < rightBlack.length; i++) {
        let row = Math.floor(i / 3);
        let col = i % 3;
        rightBlack[i].x = 668 + col * 22;
        rightBlack[i].y = 370 - (row + 1) * 22;
      }
    }

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
