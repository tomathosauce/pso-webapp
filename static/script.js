var matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var choose, yourturn, start = true, metaturn;

function erase() {
  matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  $("svg").fadeOut('fast');
  $("td div").css("background", "#ffe659");
  if(metaturn===true){
    yourturn = true
  } else {
    yourturn = false;
    setTimeout(function(){
    if(choose===1){
      moves(matrix,showC)
    } else {
      moves(matrix,showX)
    }
    },1000)
  }
}

function autoclear() {
  if (matrix.count() === 9) {
    console.log('!!!!!!!!!')
    setTimeout(function(){
      erase();
    },1500)
  } else if (cm(matrix, 3)[0] === true || cm(matrix, 3)[1] === true) {
    let three = cm(matrix, "", "n")
      .map(x => "#r" + x[0] + " .c" + x[1] + " div")
      .join(", ");
    $(three).css("transition", "background .3s").delay(1000).css("background", "#ff5f3f");
    console.log(three);
    setTimeout(function() {
      erase();
    }, 1500);
  }
}

$(document).keypress(function(e) {
  console.log(e.which);
  if (e.which == 122) {
    yourturn = true;
    choose = 0;
  } else if (e.which == 120) {
    yourturn = true;
    choose = 1;
  } else if (e.which == 99) {
    erase();
  } else if (e.which === 118) {
    moves(matrix, showC);
  } else if (e.which === 98) {
    moves(matrix, showX);
  }
});

function randomR(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript by Francisc

Array.prototype.copy = function() {
  return JSON.parse(JSON.stringify(this));
};

Array.prototype.count = function() {
  return this.map(x => x.map(y => Math.abs(y)))
    .reduce((x, y) => x.concat(y))
    .reduce((x, y) => x + y);
};

Array.prototype.options = function(n, a) {
  let all = [];
  for (let i = 0; i < this.length; i++) {
    for (let j = 0; j < this[i].length; j++) {
      if (this[i][j] === 0) {
        let thiscopy = this.copy();
        thiscopy[i][j] = n;
        if (a === "n") {
          all.push([thiscopy, i, j]);
        } else {
          all.push(thiscopy);
        }
      }
    }
  }
  return all.toString() === "" ? [false] : all;
};

function cm(arr, n, a) {
  var hold = [[], []].concat(arr);
  var barr = [[], []].concat(arr.map((x, i) => x.map((y, j) => [y, i, j])));
  let b = [false, false];

  for (let i = 0; i < arr.length; i++) {
    let k = [];
    if (a !== "n") {
      for (let j = 0; j < arr[i].length; j++) {
        k.push(arr[j][i]);
      }
      hold.push(k);
    } else {
      for (let j = 0; j < arr[i].length; j++) {
        k.push([arr[j][i], j, i]);
      }
      barr.push(k);
    }
  }
  for (let i = 0; i < arr.length; i++) {
    if (a !== "n") {
      hold[0].push(arr[i][i]);
    } else {
      barr[0].push([arr[i][i], i, i]);
    }
  }
  for (let j = 0; j < arr.length; j++) {
    if (a !== "n") {
      hold[1].push(arr[Math.abs(j - 2)][j]);
    } else {
      barr[1].push([arr[Math.abs(j - 2)][j], Math.abs(j - 2), j]);
    }
  }
  for (let i = 0; i < 8; i++) {
    if (a !== "n") {
      if (hold[i][0] + hold[i][1] + hold[i][2] === n) {
        b[0] = true;
      }
      if (hold[i][0] + hold[i][1] + hold[i][2] === n * -1) {
        b[1] = true;
      }
    } else {
      if (Math.abs(barr[i][0][0] + barr[i][1][0] + barr[i][2][0]) === 3) {
        return barr[i].map(x => [x[1], x[2]]);
      }
    }
  }
  return a === "n" ? barr : b;
}

function algo(array, n, level) {
  if (n === 1 && array.count() === 2) {
    var sideCases = [[0, 1], [1, 0], [1, 2], [2, 1]];
    //check for sides
    for (var i = 0; i < sideCases.length; i++) {
      let y = sideCases[i][0], x = sideCases[i][1];
      if (array[y][x] === 1) {
        if (
          array[y].indexOf(-1) !== -1 ||
          [array[0][x], array[1][x], array[2][x]].indexOf(-1) !== -1
        ) {
          return 0;
        }
        return -1;
      }
    }
    //check for center
    if (array[1][1] === 1) {
      for (var j = 0; j < sideCases.length; j++) {
        if (array[sideCases[j][0]][sideCases[j][1]] === -1) {
          return -1;
        }
      }
      return 0;
    }
    //check for corners
    var c = [[0, 0], [0, 2], [2, 0], [2, 2]];
    for (var k = 0; k < c.length; k++) {
      if (array[c[k][0]][c[k][1]] === 1) {
        if (array[1][1] !== -1) {
          return -1;
        } else {
          return 0;
        }
      }
    }
  }

  var precheck = cm(array, 3);
  if (precheck[0] === true) {
    return -1;
  } else if (precheck[1] === true) {
    return 2;
  }

  if (precheck[0] === false && precheck[1] === false && array.count() === 9) {
    return 0;
  }

  return array
    .options(n)
    .map(function(x) {
      if (x !== false) {
        let check = cm(x, 3);
        let check2 = cm(x, 2);

        if (check[1] === true) {
          return 1;
        } else if (check[0] === true) {
          return -1;
        } else if (check2[0] === true && n === -1) {
          return -1;
        } else if (check2[1] === true && n === 1) {
          return 1;
        } else {
          if (x.count() === 9) {
            return 0;
          } else {
            return algo(x, n * -1, level + 1);
          }
        }
      }
    })
    .sort(function(x, y) {
      if (n === 1) {
        if (x > y) {
          return 1;
        } else if (x < y) {
          return -1;
        }
        return 0;
      } else {
        if (x < y) {
          return 1;
        } else if (x > y) {
          return -1;
        }
        return 0;
      }
    })[0];
}

function moves(arr, move) {
  let random = [randomR(0, 3), randomR(0, 3)];
  if (matrix.toString().replace(/\,|\-/g, "").match(/0{9}/) !== null) {
    matrix[random[0]][random[1]] = -1;
    move(random[0], random[1]);
  } else {
    let de = arr.options(-1, "n").map(x => [algo(x[0], 1, 0), x[1], x[2]]);
    console.log(de);
    let max = Math.max(...de.map(x => x[0]));
    de = de.filter(function(x) {
      if (x[0] === max) {
        return true;
      }
      return false;
    });

    let finalMove = de[randomR(0, de.length)];
    console.log(de);
    matrix[finalMove[1]][finalMove[2]] = -1;
    move(finalMove[1], finalMove[2]);
  }
  yourturn = true;
}

function showX(r, c) {
  let coor = "#r" + r + " .c" + c;
  $(coor + " .circle").css("display", "none");
  $(coor + " .x").css("display", "block");
  $(coor + " .x .l1")
    .addClass("showline1")
    .delay(100)
    .css("stroke-dashoffset", "0");
  $(coor + " .x .l2")
    .addClass("showline2")
    .delay(200)
    .css("stroke-dashoffset", "0");
  autoclear();
}

function showC(r, c) {
  let coor = "#r" + r + " .c" + c;
  $(coor + " .x, " + coor + " .x").css("display", "none");
  $(coor + " .circle").css("display", "block");
  $(coor + " .circle .path")
    .addClass("showcircle")
    .delay(100)
    .css("stroke-dashoffset", "0");
  autoclear();
}

function anim() {
  var th = $(this),
    pa = th.parent(),
    c = pa.attr("class"),
    r = pa.parent().attr("id"),
    column = c.match(/\d/)[0],
    row = r.match(/\d/)[0];
  if (start === false) {
    if (matrix[row][column] === 0 && yourturn === true) {
      matrix[row][column] = 1;
      if (choose == 1) {
        showX(row, column);
        yourturn = false;
        setTimeout(function() {
          moves(matrix, showC);
        }, 700);
      } else {
        showC(row, column);
        yourturn = false;
        setTimeout(function() {
          moves(matrix, showX);
        }, 700);
      }
    }
    console.log(yourturn);
    console.log(choose);
  } else {
    if (r === "r1") {
      if (c === "c1") {
        $("#r1 .c1 div").css("background", "white");
        $("#r1 .c2 div").css("background", "#ff9138");
        metaturn = true;
        yourturn = true;
      } else if (c === "c2") {
        metaturn = false;
        yourturn = false;
        $("#r1 .c2 div").css("background", "white");
        $("#r1 .c1 div").css("background", "#ff9138");
      }
      startGame();
    } else if (r === "r2") {
      if (c === "c1") {
        $("#r2 .c1 div").css("background", "white");
        $("#r2 .c2 div").css("background", "#ff5f3f");
        choose = 1;
      } else if (c === "c2") {
        choose = 0;
        $("#r2 .c2 div").css("background", "white");
        $("#r2 .c1 div").css("background", "#ff5f3f");
      }
      startGame();
    }
  }
}

function startGame() {
  if (yourturn !== undefined && choose !== undefined) {
    $("span, .xs, .circles").delay(300).fadeOut("slow", function() {
      start = false;
    });
    $("td div, body")
      .css("transition", "background .4s")
      .css("background", "#ffe659");
    if (yourturn === false) {
      if (choose === 1) {
        setTimeout(function() {
          moves(matrix, showC);
        }, 2000);
      } else {
        setTimeout(function() {
          moves(matrix, showX);
        }, 2000);
      }
    }
  }
}

$("td div").click(anim);