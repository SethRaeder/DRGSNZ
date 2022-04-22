import { SVG } from './svg.js'
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    //Class for canvas sprites
    constructor(position) {
        this.position = position;
    }

    draw() {

    }
}

const player = new Sprite({
    x: 0,
    y: 0
});

console.log("Hello")

var draw = SVG().addTo('body').size(300, 300)
var rect = draw.rect(100, 100).attr({ fill: '#f06' })