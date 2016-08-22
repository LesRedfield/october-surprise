function tooltipHtml(n, d){
	return "<h4>"+n+"</h4><table>"+
		"<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
		"<tr><td>Average</td><td>"+(d.avg)+"</td></tr>"+
		"<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
		"</table>";
}

var sampleData ={};
["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
"ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
"MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
"CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
"WI", "MO", "AR", "OK", "KS", "LS", "VA"]
	.forEach(function(d){
		var low=Math.round(100*Math.random()),
			mid=Math.round(100*Math.random()),
			high=Math.round(100*Math.random());
		sampleData[d]={low:d3.min([low,mid,high]), high:d3.max([low,mid,high]),
				avg:Math.round((low+mid+high)/3), color:d3.interpolate("#ffffcc", "#800026")(low/100)};
	});


uStates.draw("#statesvg", sampleData, tooltipHtml);

d3.select(self.frameElement).style("height", "600px");

$(function() {
  new Dragdealer('overall-slider', {
    animationCallback: function(x, y) {
      $('#overall-slider .value').text(Math.round(x * 100));
    }
  });
});

$(function() {
  new Dragdealer('just-a-slider', {
    animationCallback: function(x, y) {
      $('#just-a-slider .value').text(Math.round(x * 100));
    }
  });
});

function allColor(h) {
  return d3.hsl(h, 0.8, 0.8);
}

function renderSliders1(h) {
  hue(h);
  hue2(1.2 * h);
  hue3(0.8 * h);
}

function renderSliders2(h) {
  hue(5 / 6 * h);
  hue2(h);
  hue3(2 / 3 * h);
}

function renderSliders3(h) {
  hue(6 / 5 * h);
  hue2(3 / 2 * h);
  hue3(h);
}


var svg = d3.select("#svg1"),
    margin = {right: 50, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height");

var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

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
  .data(x.ticks(10))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "%"; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider.transition() // Gratuitous intro!
    .duration(750)
    .tween("hue", function() {
      var i = d3.interpolate(0, 50);
      return function(t) { renderSliders1(i(t)); };
    });

function hue(h) {
  // debugger
  handle.attr("cx", x(h));
  svg.style("background-color", allColor(h));
}



var svg2 = d3.select("#svg2"),
    margin = {right: 50, left: 50},
    width = +svg2.attr("width") - margin.left - margin.right,
    height = +svg2.attr("height");

var xb = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

var slider2 = svg2.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

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
  .data(xb.ticks(10))
  .enter().append("text")
    .attr("x", xb)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "%"; });

var handle2 = slider2.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

// slider2.transition() // Gratuitous intro!
//     .duration(750)
//     .tween("hue2", function() {
//       var i = d3.interpolate(0, 50);
//       return function(t) { renderSliders2(i(t)); };
//     });

function hue2(h) {
  handle2.attr("cx", xb(h));
  svg2.style("background-color", allColor(h));

}

var svg3 = d3.select("#svg3"),
    margin = {right: 50, left: 50},
    width = +svg3.attr("width") - margin.left - margin.right,
    height = +svg3.attr("height");

var xc = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width])
    .clamp(true);

var slider3 = svg3.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

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
  .data(xc.ticks(10))
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
  svg3.style("background-color", allColor(h));

}
