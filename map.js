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
