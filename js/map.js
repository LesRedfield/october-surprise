function render() {
  uStates.draw("#statesvg");
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

function updateForecast() {

  let forecastContainer = d3.selectAll("#fc-box")
      .attr("class", "top-bar")
      .attr("width", 585)
      .attr("height", 100);

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

function updateStates() {
  STATES.forEach(function(stateName) {
    let nat = sampleData["National"].avg;
    let orig = data[stateName].overall;
    let shiftRate;

    if (nat >= 50.6) {
      shiftRate = (nat - 50.6) / 48.8;
      sampleData[stateName].avg = orig + (100 - orig) * shiftRate;
    } else {
      shiftRate = (50.6 - nat) / 50.6;
      sampleData[stateName].avg = orig - orig * shiftRate;
    }

    sampleData[stateName].color = newStateColor(stateName);

    updateStateColor("." + stateName, sampleData[stateName].color);
	});

  updateForecast();
}

function updateSliders(h, num, stateName, ss, natOverride = true) {
  let displacement;
  let rng;
  let deltaDisp;

  if (num === 1) {
    sampleData[stateName].avg = Math.round(h * 10) / 10;
    slideHandle(h, ss);
    slideHandle(h + (50 - Math.abs(h - 50)) / 5, ss, "2");
    slideHandle(h - (50 - Math.abs(h - 50)) / 5, ss, "3");
  } else if (num === 2) {
    if (h > 60) {
      rng = 100 - 60;
      displacement = 100 - h;
    } else {
      rng = 60;
      displacement = h;
    }
    deltaDisp = displacement / rng * 10;
    sampleData[stateName].avg = Math.round((h - deltaDisp) * 10) / 10;
    slideHandle(h - deltaDisp, ss);
    slideHandle(h, ss, "2");
    slideHandle(h - (2 * deltaDisp), ss, "3");
  } else if (num === 3) {
    if (h > 40) {
      rng = 100 - 40;
      displacement = 100 - h;
    } else {
      rng = 40;
      displacement = h;
    }
    deltaDisp = displacement / rng * 10;
    sampleData[stateName].avg = Math.round((h + deltaDisp) * 10) / 10;
    slideHandle(h + deltaDisp, ss);
    slideHandle(h + (2 * deltaDisp), ss, "2");
    slideHandle(h, ss, "3");
  }

  if (stateName === "National") {
    if (natOverride) {
      d3.select("#slider-SS-1").interrupt();
      d3.selectAll(".erase").text("");
      d3.selectAll(".state-slide").attr("width", "0px");
    }

    updateStates();
  } else {
    sampleData[stateName].color = newStateColor(stateName);

    updateStateColor("." + stateName, sampleData[stateName].color);
    updateForecast();
  }

}

function renderSliders(stateName = "National") {
  let abbr = "SS-";
  let idx = 5;
  let className = ".state-slide";

  if (stateName === "National") {
    abbr = "";
    idx = 3;
    className = ".nat-slide";
  }

  let svgs = d3.selectAll(className),
      margin = { right: 15, left: 15 },
      width = 170,
      height = +svg.attr("height");

  let sliders = svgs.append("g")
      .attr("class", "slider")
      .attr("id", function() {
        return "slider-" + abbr + this.parentElement.id[idx];
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
            updateSliders(x.invert(d3.event.x), Number(this.parentElement.parentElement.id[idx]), stateName, abbr);
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
        return "handle-" + abbr + this.parentElement.parentElement.id[idx];
      })
      .attr("r", 9);

  d3.select("#slider-SS-1").transition() // ss intro
      .duration(100)
      .tween("intro", function() {
        let i = d3.interpolate(sampleData[stateName].avg, sampleData[stateName].avg);
        return function(t) { updateSliders(i(t), 1, stateName, abbr); };
      });
}

function slideHandle(h, ss, num = "1") {
  let label = (num === "1") ? "OVERALL" : (num === "2") ? "WOMEN" : "MEN";

  d3.select("#handle-" + ss + num).attr("cx", x(h));

  d3.select("#hc-" + ss + num).selectAll("text").remove();
  d3.select("#hc-" + ss + num).text(function(d) { return Math.round(10 * h) / 10; });

  d3.select("#middle-" + ss + num).selectAll("text").remove();
  d3.select("#middle-" + ss + num).text(function(d) { return label; });

  d3.select("#dt-" + ss + num).selectAll("text").remove();
  d3.select("#dt-" + ss + num).text(function(d) { return Math.round(10 * (100 - h)) / 10; });
}
