

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
