var draw = SVG().addTo('body').size(600, 600)
var rect = draw.image('assets/charZephyr/preview/previewIdle.svg')
rect.animate(2000, 1000, 'now').move(150, 150)
rect.animate(1000, 2000, 'now').move(0, 0)