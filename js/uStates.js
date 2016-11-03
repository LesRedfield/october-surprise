(function(){

  this.uStates = {};

  uStates.draw = function(id) {

    function clicked(d) {
      d3.selectAll(".state-slide").selectAll("*").remove();

      let stateName = d.id;

      d3.selectAll(".state-slide").transition().attr("width", "200px");

      d3.select("#state-label").transition().text( function(d) { return stateName; } );

      renderSliders(stateName);
    }

		d3.select(id).selectAll(".state")
			.data(STATEPATHS).enter().append("path")
      .attr("class", function(d){ return "state " + d.id; })
      .attr("d",function(d){ return d.d;})
			.style("fill",function(d){ return sampleData[d.id].color; })
      .on("click", clicked);
  };

})();

let sampleData = {};

STATES.forEach(function(d) {
  let men = Math.round(100*Math.random()),
      avg = data[d].overall,
      women = Math.round(100*Math.random());

  sampleData[d] = {
    men: d3.min([men,women]),
    women: d3.max([men,women]),
    avg: avg
  };

  sampleData[d].color = newStateColor(d);
});

sampleData["National"] = {
  avg: 51.2
};

render();

let svg = d3.select("#svg1");

let x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 170])
    .clamp(true);

renderSliders();

d3.select("#slider-1").transition() // nat intro
    .duration(2500)
    .tween("intro", function() {
      let i = d3.interpolate(34, 51.2);
      return function(t) { updateSliders(i(t), 1, "National", "", false); };
    });
