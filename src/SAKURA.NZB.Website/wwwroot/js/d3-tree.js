/* D3 Tree */
/* Copyright 2013 Peter Cook (@prcweb); Licensed MIT */

// Tree configuration
var branches = [];
var seed = { i: 0, x: 420, y: 600, a: 0, l: 130, d: 0 }; // a = angle, l = length, d = depth
var da = 0.5; // Angle delta
var dl = 0.8; // Length delta (factor)
var ar = 0.7; // Randomness
var maxDepth = 7;

var colorIdx = 0;
var stroke = '#000000';
var colorSheet = ['#d2d4dc', '#afafaf', '#f8f8fa', '#e5e6eb', '#c0c2ce',
                '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff',
                '#77aaff', '#99ccff', '#bbeeff', '#5588ff', '#3366ff',
                '#009688', '#35a79c', '#54b2a9', '#65c3ba', '#83d0c9',
                '#a67c00', '#bf9b30', '#ffbf00', '#ffcf40', '#ffdc73',
                '#ff00a9', '#fb9f9f', '#ff0065', '#ffbfd3', '#fb5858',
                '#ee4035', '#f37736', '#fdf498', '#7bc043', '#0392cf',
                '#a69eb0', '#efeff2', '#f2e2cd', '#dadae3', '#000000'];

// Tree creation functions
function branch(b) {
    var end = endPt(b), daR, newB;

    branches.push(b);

    if (b.d === maxDepth)
        return;

    // Left branch
    daR = ar * Math.random() - ar * 0.5;
    newB = {
        i: branches.length,
        x: end.x,
        y: end.y,
        a: b.a - da + daR,
        l: b.l * dl,
        d: b.d + 1,
        parent: b.i
    };
    branch(newB);

    // Right branch
    daR = ar * Math.random() - ar * 0.5;
    newB = {
        i: branches.length,
        x: end.x,
        y: end.y,
        a: b.a + da + daR,
        l: b.l * dl,
        d: b.d + 1,
        parent: b.i
    };
    branch(newB);
}

function regenerate(initialise) {
    branches = [];
    branch(seed);
    initialise ? create() : update();
}

function endPt(b) {
    // Return endpoint of branch
    var x = b.x + b.l * Math.sin(b.a);
    var y = b.y - b.l * Math.cos(b.a);
    return { x: x, y: y };
}


// D3 functions
function x1(d) { return d.x; }
function y1(d) { return d.y; }
function x2(d) { return endPt(d).x; }
function y2(d) { return endPt(d).y; }
function highlightParents(d) {
    var colour = d3.event.type === 'mouseover' ? 'green' : stroke;
    var depth = d.d;
    for (var i = 0; i <= depth; i++) {
        d3.select('#id-' + parseInt(d.i)).style('stroke', colour);
        d = branches[d.parent];
    }
}

function create() {
    d3.select('svg')
		.selectAll('line')
		.data(branches)
		.enter()
		.append('line')
		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2)
		.style('stroke-width', function (d) { return parseInt(maxDepth + 1 - d.d) + 'px'; })
		.attr('id', function (d) { return 'id-' + d.i; })
		.on('mouseover', highlightParents)
		.on('mouseout', highlightParents);
}

function update() {
    // comment out due to angular zone bug
    //.transition()  
    d3.select('svg')
		.selectAll('line')
		.data(branches)

		.attr('x1', x1)
		.attr('y1', y1)
		.attr('x2', x2)
		.attr('y2', y2);
}

function recolor() {
    stroke = colorSheet[colorIdx % colorSheet.length];
    colorIdx++;

    d3.select('svg')
       .selectAll('line')
       .style('stroke', function () {
           return stroke;
       });

    //$('line').css('stroke', stroke);
    d3.selectAll('.recolor')
      .style('color', function () {
          return stroke;
      });
}

d3.selectAll('.regenerate')
	.on('click', regenerate);

d3.selectAll('.recolor')
	.on('click', recolor);

regenerate(true);

var interval = 5000;
setInterval(recolor, interval);
setInterval(regenerate, colorSheet.length * interval);
