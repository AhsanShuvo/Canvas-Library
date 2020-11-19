# Canvas Library

`Canvas Library` helps you to draw various shapes, free drawing to design diagrams. You don't need to write codes to draw any shapes. You can freely draw any existing shapes on your will.Canvas handles it internally.

### How to use the library
#### Dependencies
 `Canvas Library` depends on `css` and `fabric js` to design built in and custom icons.You need to add multiple files in your html page in order to use `Canvas Library`. You need to add these files:
```bash
<script src="canvasLibrary.js"></script>
<link rel="stylesheet" href="canvasLibrary.style.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/3.6.6/fabric.min.js"></script>
```
 You have to initialize canvas in order to use `Canvas Library`. You can access library's properties by using `Canvas` object. So, you need to call `Canvas.createCanvas(arg)` to create canvas. You have to pass `id` of the `div` as parameter where you want to create canvas.
 
 You also need to add assets folder in the same directory. You can add background images in assets folder.

### methods()

`createCanvas(id)`
create canvas with buttons to draw diagrams  and icons. This method accepts id of the div as parameter.

`getJSON()`
saves the canvas as a json object.

`getSVG()`
returns the canvas a svg object.

`loadCanvasFromJSON(id, json)`
creates a canvas from json object which represents an existing canvas. It accepts id of the div and json object as parameter.

`loadCanvasFromSVG(id, svgUrl)`
creates a canvas from svg file which represents an existing canvas. It accepts id of the div and svgUrl as parameter.

**Note**: You have to set `height` and `width` of the div where you want to create canvas.