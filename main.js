var AMOEBA = "●";

var numRows = 20;
var numCols = 20;
var state = "play";

var prison = [
	{"x": 0, "y": 0},
  {"x": 0, "y": 1},
  {"x": 1, "y": 0}
];

var amoebae = [
	{"x": 0, "y": 0}
];

var grid = clickableGrid(numRows, numCols);
document.getElementById("grid").replaceWith(grid);
rebuildProblem();

function setState(s) {
	state = s;
 	rebuildProblem();

  var infoText = ""
  if (state == "editPrison") {
  	infoText = "Click cells to toggle their prison state. (red=prison, white=free)";
  }

  if (state == "editAmoebae") {
  	infoText = "Click cells to toggle their amoeba state. (circle=amoeba, empty=no amoeba)";
  }

  if (state == "play") {
  	infoText = "Escape from the prison (red) by clicking the amoebae (circles).";
  }

  document.getElementById("infoText").innerHTML = infoText;
}

function handleClick(elem, row, col, i) {
	console.log(elem, row, col, i);
  if (state == "editPrison") {
  	var isPrison = false;
  	prison.forEach(function(cell, index, object) {
      if (cell.x == col && cell.y == row) {
      	object.splice(index, 1);
        isPrison = true;
      }
    })
    if (!isPrison) {
    	prison.push({"x": col, "y": row});
    }
    rebuildProblem();
  }

  if (state == "editAmoebae") {
  	var isAmoeba = false;
  	amoebae.forEach(function(cell, index, object) {
      if (cell.x == col && cell.y == row) {
      	object.splice(index, 1);
        isAmoeba = true;
      }
    })
    if (!isAmoeba) {
    	amoebae.push({"x": col, "y": row});
    }
    rebuildProblem();
  }

  if (state == "play") {
  	if (elem.innerHTML == "") {
    	return;
    }
  	cellBelow = grid.childNodes[row+1].childNodes[col];
	  cellRight = grid.childNodes[row].childNodes[col+1];
    if (cellBelow.innerHTML == "" && cellRight.innerHTML == "") {
      elem.innerHTML = "";
      cellBelow.innerHTML = AMOEBA;
      cellRight.innerHTML = AMOEBA;
    }

    var escaped = true;
    prison.forEach(function(cell) {
      if (grid.childNodes[cell.y].childNodes[cell.x].innerHTML != "") {
        escaped = false;
      }
    })

    if (escaped) {
      document.getElementById("infoText").innerHTML = "You have escaped!"
    }
  }
}

function clickableGrid(rows, cols){
	var grid = document.createElement('table');
  grid.id = 'grid';
  for (var row = 0; row < rows; ++row) {
  	var tr = grid.appendChild(document.createElement('tr'));
    for (var col = 0; col < cols; ++col) {
    	var cell = tr.appendChild(document.createElement('td'));
      cell.innerHTML = "";
      cell.addEventListener('click', (function(elem, row, col) {
	      return function() {
        	handleClick(elem, row, col);
        }
      })(cell, row, col), false);
    }
  }
  return grid;
}

function addPrisonToGrid() {
	prison.forEach(function(cell) {
  	grid.childNodes[cell.y].childNodes[cell.x].className = "prison";
  })
}

function addAmoebaToGrid() {
	amoebae.forEach(function(cell) {
  	grid.childNodes[cell.y].childNodes[cell.x].innerHTML = AMOEBA;
  })
}

function rebuildProblem() {
   grid.childNodes.forEach(function(row) {
     row.childNodes.forEach(function(col) {
       col.className = "";
       col.innerHTML = "";
     })
   })
	addPrisonToGrid();
	addAmoebaToGrid();
}
