(function(){

  let uStates = {};

  uStates.draw = function(id, data) {

    function clicked(d) {
      d3.select("#svgSS1").selectAll("*").remove();
      d3.select("#svgSS2").selectAll("*").remove();
      d3.select("#svgSS3").selectAll("*").remove();

      let stateName = d.id;

      d3.select("#svgSS1").transition().attr("width", "200px");
      d3.select("#svgSS2").transition().attr("width", "200px");
      d3.select("#svgSS3").transition().attr("width", "200px");

      d3.select("#state-label").transition().text( function(d) { return stateName; } );

      d3.select("#hc-SS-1").selectAll("text").remove();
      d3.select("#hc-SS-1").text(function(d) {return Math.round(10 * data[stateName].avg) / 10;});

      d3.select("#middle-SS-1").selectAll("text").remove();

      d3.select("#dt-SS-1").selectAll("text").remove();
      d3.select("#dt-SS-1").text(function(d) {return Math.round(10 * (100 - data[stateName].avg)) / 10;});

      function renderSliders(h, num) {
        let displacement;
        let rng;
        let deltaDisp;

        if (num === 1) {
          data[stateName].avg = Math.round(h * 10) / 10;
          hue(h, "SS-");
          hue2(h + (50 - Math.abs(h - 50)) / 5, "SS-");
          hue3(h - (50 - Math.abs(h - 50)) / 5, "SS-");
        } else if (num === 2) {
          if (h > 60) {
            rng = 100 - 60;
            displacement = 100 - h;
          } else {
            rng = 60;
            displacement = h;
          }
          deltaDisp = displacement / rng * 10;
          data[stateName].avg = Math.round((h - deltaDisp) * 10) / 10;
          hue(h - deltaDisp, "SS-");
          hue2(h, "SS-");
          hue3(h - (2 * deltaDisp), "SS-");
        } else if (num === 3) {
          if (h > 40) {
            rng = 100 - 40;
            displacement = 100 - h;
          } else {
            rng = 40;
            displacement = h;
          }
          deltaDisp = displacement / rng * 10;
          data[stateName].avg = Math.round((h + deltaDisp) * 10) / 10;
          hue(h + deltaDisp, "SS-");
          hue2(h + (2 * deltaDisp), "SS-");
          hue3(h, "SS-");
        }
        data[stateName].color = newStateColor(stateName);

        updateStateColor("." + stateName, data[stateName].color);
        updateForecast();
      }

      let svgs = d3.selectAll(".state-slide"),
          margin = { right: 15, left: 15 },
          width = 170,
          height = +svg.attr("height");

      let sliders = svgs.append("g")
          .attr("class", "slider")
          .attr("id", function() {
            return "slider-SS-" + this.parentElement.id[5];
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
                renderSliders(x.invert(d3.event.x), Number(this.parentElement.parentElement.id[5]));
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
            return "handle-SS-" + this.parentElement.parentElement.id[5];
          })
          .attr("r", 9);

      d3.select("#slider-SS-1").transition() // intro
          .duration(2500)
          .tween("hue", function() {
            let i = d3.interpolate(20, sampleData[stateName].avg);
            return function(t) { renderSliders(i(t), 1); };
          });

    }

		d3.select(id).selectAll(".state")
			.data(STATEPATHS).enter().append("path")
      .attr("class", function(d){ return "state " + d.id; })
      .attr("d",function(d){ return d.d;})
			.style("fill",function(d){ return data[d.id].color; })
      .on("click", clicked);

  };

  this.uStates = uStates;
})();

function render() {
  uStates.draw("#statesvg", sampleData);
}

function stateColor(state) {
  if (data[state].overall > 54) {
    return "#0083D6";
  } else if (data[state].overall > 50) {
    return "#76CAFF";
  } else if (data[state].overall > 46) {
    return "salmon";
  } else {
    return "#FF4D38";
  }
}

function newStateColor(state) {
  if (sampleData[state].avg > 54) {
    return "#0083D6";
  } else if (sampleData[state].avg > 50) {
    return "76CAFF";
  } else if (sampleData[state].avg > 46) {
    return "salmon";
  } else {
    return "#FF4D38";
  }
}

function updateStateColor(state, color) {
  d3.select("#statesvg").select(state)
    .style("fill", color);
}

var sampleData = {};

STATES.forEach(function(d) {
  let men = Math.round(100*Math.random()),
      avg = data[d].overall,
      women = Math.round(100*Math.random());
      color = stateColor(d);

  sampleData[d] = {
    men: d3.min([men,women]),
    women: d3.max([men,women]),
    avg: avg,
    color: color
  };
});

render();

function forecast() {
  let hc = 0;
  let dt = 0;

  STATES.forEach(function(state) {
    if (data[state].overall > 50) {
      hc += data[state].votes;
    } else {
      dt += data[state].votes;
    }
  });

  return [
    {"name": "Trump", "votes": dt, "x": 25, "color": "#FF4D38"},
    {"name": "Clinton", "votes": hc, "x": 500, "color": "#0083D6"}
  ];
}

var forecast = forecast();

let forecastContainer = d3.selectAll("#fc-box")
    .attr("class", "top-bar")
    .attr("width", 585)
    .attr("height", 100);

let text = forecastContainer.selectAll("text")
    .data(forecast)
    .enter()
    .append("text");

let textLabels = text
    .attr("x", function(d) { return d.x; })
    .attr("y", 75)
    .text( function (d) { return d.votes; })
    .attr("font-size", "75px")
    .attr("font-weight", "bold")
    .attr("fill", function(d) { return d.color; });

function updateForecast() {

  forecastContainer.selectAll("text").remove();

  let hc = 0;
  let dt = 0;

  STATES.forEach(function(state) {
    if (sampleData[state].avg > 50) {
      hc += data[state].votes;
    } else {
      dt += data[state].votes;
    }
  });

  let forecast = [
    {"name": "Trump", "votes": dt, "x": 100, "color": "#FF4D38"},
    {"name": "Clinton", "votes": hc, "x": 380, "color": "#0083D6"}
  ];

  let text = forecastContainer.selectAll("text")
      .data(forecast)
      .enter()
      .append("text");

  let textLabels = text
      .attr("x", function(d) { return d.x; })
      .attr("y", 75)
      .text( function (d) { return d.votes; })
      .attr("font-size", "75px")
      .attr("font-weight", "bold")
      .attr("fill", function(d) { return d.color; });
}

///////////

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

function hue(h, ss = "") {
  d3.select("#handle-" + ss + "1").attr("cx", x(h));

  d3.select("#hc-" + ss + "1").selectAll("text").remove();
  d3.select("#hc-" + ss + "1").text(function(d) {return Math.round(10 * h) / 10;});

  d3.select("#middle-" + ss + "1").selectAll("text").remove();
  d3.select("#middle-" + ss + "1").text(function(d) {return "OVERALL";});

  d3.select("#dt-" + ss + "1").selectAll("text").remove();
  d3.select("#dt-" + ss + "1").text(function(d) {return Math.round(10 * (100 - h)) / 10;});
}

function hue2(h, ss = "") {
  d3.select("#handle-" + ss + "2").attr("cx", x(h));

  d3.select("#hc-" + ss + "2").selectAll("text").remove();
  d3.select("#hc-" + ss + "2").text(function(d) {return Math.round(10 * h) / 10;});

  d3.select("#middle-" + ss + "2").selectAll("text").remove();
  d3.select("#middle-" + ss + "2").text(function(d) {return "WOMEN";});

  d3.select("#dt-" + ss + "2").selectAll("text").remove();
  d3.select("#dt-" + ss + "2").text(function(d) {return Math.round(10 * (100 - h)) / 10;});
}

function hue3(h, ss = "") {
  d3.select("#handle-" + ss + "3").attr("cx", x(h));

  d3.select("#hc-" + ss + "3").selectAll("text").remove();
  d3.select("#hc-" + ss + "3").text(function(d) {return Math.round(10 * h) / 10;});

  d3.select("#middle-" + ss + "3").selectAll("text").remove();
  d3.select("#middle-" + ss + "3").text(function(d) {return "MEN";});

  d3.select("#dt-" + ss + "3").selectAll("text").remove();
  d3.select("#dt-" + ss + "3").text(function(d) {return Math.round(10 * (100 - h)) / 10;});
}
