function updateStates(previous) {
  STATES.forEach(function(stateName) {
    let nat = sampleData.National;
    let orig = data[stateName].overall;
    let shiftRate;

    let previous = sampleData[stateName].avg;
    let rand = Math.random();

    if (nat >= 51.2) {
      shiftRate = (nat - 51.2) / 48.8;
      sampleData[stateName].avg = orig + (100 - orig) * shiftRate;
    } else {
      shiftRate = (51.2 - nat) / 51.2;
      sampleData[stateName].avg = orig - 51.2 * shiftRate;
    }

    sampleData[stateName].color = newStateColor(stateName);

    updateStateColor("." + stateName, sampleData[stateName].color);
	});

  updateForecast();
}

function allColor(h) {
  return d3.hsl(h, 0.8, 0.8);
}

function renderSliders(h, num) {
  let displacement;
  let rng;
  let deltaDisp;

  if (num === 1) {
    sampleData.National = Math.round(h * 10) / 10;
    hue(h);
    hue2(h + (50 - Math.abs(h - 50)) / 5);
    hue3(h - (50 - Math.abs(h - 50)) / 5);
  } else if (num === 2) {
    if (h > 60) {
      rng = 100 - 60;
      displacement = 100 - h;
    } else {
      rng = 60;
      displacement = h;
    }
    deltaDisp = displacement / rng * 10;
    sampleData.National = Math.round((h - deltaDisp) * 10) / 10;
    hue(h - deltaDisp);
    hue2(h);
    hue3(h - (2 * deltaDisp));
  } else if (num === 3) {
    if (h > 40) {
      rng = 100 - 40;
      displacement = 100 - h;
    } else {
      rng = 40;
      displacement = h;
    }
    deltaDisp = displacement / rng * 10;
    sampleData.National = Math.round((h + deltaDisp) * 10) / 10;
    hue(h + deltaDisp);
    hue2(h + (2 * deltaDisp));
    hue3(h);
  }

  updateStates();
}

let svg = d3.select("#svg1");

let svgs = d3.selectAll(".nat-slide"),
    margin = { right: 15, left: 15 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height");

let x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

let sliders = svgs.append("g")
    .attr("class", "slider")
    .attr("id", function() {
      return "slider-" + this.parentElement.id[3];
    })
    .attr("transform", "translate(" + margin.left + "," + height * (3 / 5) + ")");

sliders.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start drag", function(d) {
          renderSliders(x.invert(d3.event.x), Number(this.parentElement.parentElement.id[3]));
        })
    );

sliders.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(5))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "%"; });

let handles = sliders.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("id", function() {
      return "handle-" + this.parentElement.parentElement.id[3];
    })
    .attr("r", 9);

d3.select("#slider-1").transition() // intro
    .duration(5000)
    .tween("hue", function() {
      let i = d3.interpolate(34, 51.2);
      return function(t) { renderSliders(i(t), 1); };
    });

function hue(h) {
  d3.select("#handle-1").attr("cx", x(h));

  d3.select("#hc-1").selectAll("text").remove();
  d3.select("#hc-1").text(function(d) {return Math.round(10 * h) / 10;});

  d3.select("#middle-1").selectAll("text").remove();
  d3.select("#middle-1").text(function(d) {return "OVERALL";});

  d3.select("#dt-1").selectAll("text").remove();
  d3.select("#dt-1").text(function(d) {return Math.round(10 * (100 - h)) / 10;});
}

function hue2(h) {
  d3.select("#handle-2").attr("cx", x(h));

  d3.select("#hc-2").selectAll("text").remove();
  d3.select("#hc-2").text(function(d) {return Math.round(10 * h) / 10;});

  d3.select("#middle-2").selectAll("text").remove();
  d3.select("#middle-2").text(function(d) {return "WOMEN";});

  d3.select("#dt-2").selectAll("text").remove();
  d3.select("#dt-2").text(function(d) {return Math.round(10 * (100 - h)) / 10;});
}

function hue3(h) {
  d3.select("#handle-3").attr("cx", x(h));

  d3.select("#hc-3").selectAll("text").remove();
  d3.select("#hc-3").text(function(d) {return Math.round(10 * h) / 10;});

  d3.select("#middle-3").selectAll("text").remove();
  d3.select("#middle-3").text(function(d) {return "MEN";});

  d3.select("#dt-3").selectAll("text").remove();
  d3.select("#dt-3").text(function(d) {return Math.round(10 * (100 - h)) / 10;});
}
