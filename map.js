function updateStates() {
  ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
  "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
  "MI", "WY", "MT", "ID", "WA", "TX", "CA", "AZ", "NV", "UT",
  "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
  "WI", "MO", "AR", "OK", "KS", "LA", "VA"]
  	.forEach(function(stateName) {
      let nat = sampleData.National;
      let orig = data[stateName].overall;
      let shiftRate;

      // debugger

      if (nat >= 53.7) {
        shiftRate = (nat - 53.7) / 46.3;
        sampleData[stateName].avg = orig + (100 - orig) * shiftRate;
      } else {
        shiftRate = (53.7 - nat) / 53.7;
        sampleData[stateName].avg = orig - 53.7 * shiftRate;
      }

      sampleData[stateName].color = newStateColor(stateName);

      updateStateColor("." + stateName, sampleData[stateName].color);
  	});

  updateForecast();
}

// function newHandleColor(h) {
//   if (h > 54) {
//     return "blue";
//   } else if (h > 50) {
//     return "lightblue";
//   } else if (h > 46) {
//     return "salmon";
//   } else {
//     return "red";
//   }
// }

function allColor(h) {
  return d3.hsl(h, 0.8, 0.8);
}

function renderSliders1(h) {
  sampleData.National = Math.round(h * 10) / 10;
  updateStates();

  hue(h);
  hue2(h + (50 - Math.abs(h - 50)) / 5);
  hue3(h - (50 - Math.abs(h - 50)) / 5);
}

function renderSliders2(h) {
  let displacement;
  let rng;

  if (h > 60) {
    rng = 100 - 60;
    displacement = 100 - h;
    // debugger
  } else {
    rng = 60;
    displacement = h;
  }
  // debugger
  let deltaDisp = displacement / rng * 10;

  // debugger

  sampleData.National = Math.round((h - deltaDisp) * 10) / 10;
  updateStates();

  hue(h - deltaDisp);
  hue2(h);
  hue3(h - (2 * deltaDisp));
}

function renderSliders3(h) {
  let displacement;
  let rng;

  if (h > 40) {
    rng = 100 - 40;
    displacement = 100 - h;
    // debugger
  } else {
    rng = 40;
    displacement = h;
  }
  // debugger
  let deltaDisp = displacement / rng * 10;

  sampleData.National = Math.round((h + deltaDisp) * 10) / 10;
  updateStates();

  hue(h + deltaDisp);
  hue2(h + (2 * deltaDisp));
  hue3(h);
}


var svg = d3.select("#svg1"),
    margin = {right: 15, left: 15},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height");

svg.text(function(d) { return "NATIONAL"; });

var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height * (3 / 5) + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { renderSliders1(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(4))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "%"; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider.transition() // Gratuitous intro!
.duration(2500)
.tween("hue", function() {
  var i = d3.interpolate(34, 53.7);
  return function(t) { renderSliders1(i(t)); };
});


function hue(h) {
  // debugger
  handle.attr("cx", x(h));

  // svg.style("background-color", newHandleColor(h));

  d3.select("#hc-1").selectAll("text").remove();
  d3.select("#hc-1").text(function(d) {return Math.round(10 * sampleData.National) / 10;});

  d3.select("#middle-1").selectAll("text").remove();
  d3.select("#middle-1").text(function(d) {return "OVERALL";});

  d3.select("#dt-1").selectAll("text").remove();
  d3.select("#dt-1").text(function(d) {return Math.round(10 * (100 - sampleData.National)) / 10;});
}



var svg2 = d3.select("#svg2"),
    margin = {right: 15, left: 15},
    width = +svg2.attr("width") - margin.left - margin.right,
    height = +svg2.attr("height");

var xb = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

var slider2 = svg2.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height * (3 / 5) + ")");

slider2.append("line")
    .attr("class", "track")
    .attr("x1", xb.range()[0])
    .attr("x2", xb.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider2.interrupt(); })
        .on("start drag", function() { renderSliders2(xb.invert(d3.event.x)); }));

slider2.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(xb.ticks(5))
  .enter().append("text")
    .attr("x", xb)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "%"; });

var handle2 = slider2.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

// slider2.transition() // Gratuitous intro!
//     .duration(2500)
//     .tween("hue2", function() {
//       var i = d3.interpolate(0, 50);
//       return function(t) { renderSliders2(i(t)); };
//     });

function hue2(h) {
  handle2.attr("cx", xb(h));
  // svg2.style("background-color", newHandleColor(h));

  d3.select("#hc-2").selectAll("text").remove();
  d3.select("#hc-2").text(function(d) {return Math.round(10 * h) / 10;});

  d3.select("#middle-2").selectAll("text").remove();
  d3.select("#middle-2").text(function(d) {return "WOMEN";});

  d3.select("#dt-2").selectAll("text").remove();
  d3.select("#dt-2").text(function(d) {return Math.round(10 * (100 - h)) / 10;});
}

var svg3 = d3.select("#svg3"),
    margin = {right: 15, left: 15},
    width = +svg3.attr("width") - margin.left - margin.right,
    height = +svg3.attr("height");

var xc = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

var slider3 = svg3.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height * (3 / 5) + ")");

slider3.append("line")
    .attr("class", "track")
    .attr("x1", xc.range()[0])
    .attr("x2", xc.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider3.interrupt(); })
        .on("start drag", function() { renderSliders3(xc.invert(d3.event.x)); }));

slider3.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(xc.ticks(5))
  .enter().append("text")
    .attr("x", xc)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "%"; });

var handle3 = slider3.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

// slider3.transition() // Gratuitous intro!
//     .duration(750)
//     .tween("hue3", function() {
//       var i = d3.interpolate(0, 50);
//       return function(t) { renderSliders3(i(t)); };
//     });

function hue3(h) {
  handle3.attr("cx", xc(h));

  // svg3.style("background-color", newHandleColor(h));

  d3.select("#hc-3").selectAll("text").remove();
  d3.select("#hc-3").text(function(d) {return Math.round(10 * h) / 10;});

  d3.select("#middle-3").selectAll("text").remove();
  d3.select("#middle-3").text(function(d) {return "MEN";});

  d3.select("#dt-3").selectAll("text").remove();
  d3.select("#dt-3").text(function(d) {return Math.round(10 * (100 - h)) / 10;});
}
