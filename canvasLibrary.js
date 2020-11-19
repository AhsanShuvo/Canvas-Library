const Canvas = (function(){
    var canvas = null; 
    var leftImage = null; 
    var rightImage = null;
    var objProperties = {
        sharp_rectangle: {
            width: 150,
            height: 70,
            strokeWidth: 1,
        },
        round_rectangle: {
            width: 150,
            height: 70,
            strokeWidth: 1,
            rx: 10,
            ry: 10
        },
        arrow: {
            left: 100,
            top: 100,
            strokeWidth: 3,
        },
        line: {
            width: 150,
            height: 2,
            strokeWidth: 0
        },
        cavity: {
            top: 200,
            parallel_left: 510,
            rect_left: 500,
            strokeWidth: 1.5,
            rect_width: 40,
            rect_height: 20,
            rect_rx: 40,
            rect_ry: 40
        },
        cloud: {
            radius: 20,
            strokeWidth: 3
        },
        etch_channel: {
            inner_length: 20,
            outer_length: 30,
            strokeWidth: 2,
            inner_top: 175,
            outer_top: 170,
            inner_left: 475,
            outer_left: 470,
        },
        laser_dril: {
            inner_radius: 4,
            outer_radius: 8,
            strokeWidth: 1,
            inner_top: 104,
            outer_top: 100,
            inner_left: 304,
            outer_left: 300
        },
        bruise: {
            top: 130,
            left: 330,
            strokeWidth: 1
        },
        twinning_wisp: {
            left: 100,
            top: 100,
            strokeWidth: 2
        },
        feather: {
            top: 200,
            left: 200,
            strokeWidth: 2
        },
        niddle: {
            top: 200,
            left: 200,
            width: 2,
            height: 100,
            angle: -30
        },
        intended_natural: {
            upper_top: 190,
            upper_left: 190,
            strokeWidth: 2,
            lower_top: 194,
            lower_left: 192
        },
        knot: {
            inner_top: 456,
            inner_left: 555,
            inner_width: 179,
            inner_height: 54,
            outer_left: 550,
            outer_top: 450,
            outer_height: 66,
            outer_width: 189,
            rx: 35,
            ry: 30,
            strokeWidth: 1 
        },
        natural: {
            strokeWidth: 1
        },
        pinpoint: {
            radius: 6,
            top: 200,
            left: 200
        }
    };

    var objPath = {
        CAVITY: 'M 0.3 1 L 4.2 19.8 \ M 8 0 L 12.3 20 \ M 16 0.5 L 20 19',
        BRUISE: 'M 0 0 L 5 -6 M 0 0 L 5 6 M 0 0 L -5 6 M 0 0 L -5 -6',
        TWINNING_WISP: 'M 0 0 \ C 8 -6 4 -4 10 -7 \ M 10 -10 L 10 -4 \ M 9.7 -7 L 20 -7 \
        C 25 -7 53 24 59 21 \ M 59 21 L 64 21 \ M 57 24 L 59 18 \ M 32 7 L 37 -1',
        FEATHER: 'M 0 0 \ C 8 -6 22 25 35 20',
        INTENDED_UPPER: 'M 0 0 L -8 8 M 0 0 L 12 10',
        INTENDED_LOWER: 'M 0 0 L -5 6 M 0 0 L 12 10',
        NATURAL: 'M 0 0 L 6 -7 L 12 0',
        ARROW: 'M 0 0 L 100 0 M 0 0 L 10 -2 M 0 0 L 10 2 L 10 -2 z'
    }
    const colorArray = [
        {
            color : 'black',
            id : 1,
            code : '#000000'
        },
        {
            color : 'blue',
            id : 2,
            code : '#0000FF'
        },
        {
            color : 'red',
            id : 3,
            code : '#FF0000'
        }
    ]
    var colorSelector = colorArray[0];
    var cursorEnum = {
        defaultX: 20,
        defaultY: 20
    };
    var imageType = null;
    var backgroundImageType = {
        full_background: 1,
        left_half: 2,
        right_half: 3
    }

    function createCanvas(id){
        if(canvas != null) canvas.clear();
        var parent = document.getElementById(id);
        if(parent != null){
            parent.innerHTML = html;
            var canvasArea = document.querySelector(".canvas-lib-canvas-div").getBoundingClientRect();
            canvas = new fabric.Canvas("canvas", {
                width: canvasArea.width,
                height: canvasArea.height,
                top: canvasArea.top,
                left: canvasArea.left
            });
            initializeEventHandler();
        }
    }

    function loadCanvasFromJSON(id, json){
        if(json != "" && json != null){
            createCanvas(id);
            if(canvas != null){
                var width = canvas.width; 
                var height = canvas.height;
                canvas.loadFromJSON(json, function(){
                    canvas.renderAll.bind(canvas);
                    canvas.setHeight(height);
                    canvas.setWidth(width);
                });
            }
        }
    }

    function loadCanvasFromSVG(id, svg){
        if(svg != null && svg != ''){
            createCanvas(id);
            if(canvas != null){
                var height = canvas.height;
                var width = canvas.width;
                fabric.loadSVGFromURL(svg, function(object, options){
                    canvas.setHeight(height);
                    canvas.setWidth(width);
                    var obj = fabric.util.groupSVGElements(object, options);
                    canvas.add(obj).renderAll();
                });
            }
        }
    }

    function initializeEventHandler(){
        document.getElementById('canvasLibFullBackgroundImageId').addEventListener('change', getImage);
        document.getElementById('canvasLibLeftHalfImageId').addEventListener('change', getImage);
        document.getElementById('canvasLibRightHalfImageId').addEventListener('change', getImage);
        document.getElementById('canvasLibRectangleSharp').addEventListener('click', createSharpRectangle);
        document.getElementById('canvasLibRectangleRound').addEventListener('click', createRoundRectangle);
        document.getElementById('canvasLibCavity').addEventListener('click', createCavity);
        document.getElementById('canvasLibCloud').addEventListener('click', createCloud);
        document.getElementById('canvasLibDrawLine').addEventListener('click', createLine);
        document.getElementById('canvasLibEtchChannel').addEventListener('click', createEtchChannel);
        document.getElementById('canvasLibDrawArrow').addEventListener('click', createArrow);
        document.getElementById('canvasLibLaserDril').addEventListener('click', createLaserDril);
        document.getElementById('canvasLibFreeDraw').addEventListener('click', createFreeDraw);
        document.getElementById('canvasLibBruise').addEventListener('click', createBruise);
        document.getElementById('canvasLibFullBackgroundImage').addEventListener('click', function(){
            invokeImageEvent(backgroundImageType.full_background);
        });
        document.getElementById('canvasLibLeftHalfImage').addEventListener('click', function(){
            invokeImageEvent(backgroundImageType.left_half);
        });
        document.getElementById('canvasLibRightHalfImage').addEventListener('click', function(){
            invokeImageEvent(backgroundImageType.right_half);
        });
        document.getElementById('canvasLibTwinningWisp').addEventListener('click', createTwinningWisp);
        document.getElementById('canvasLibPickColor').addEventListener('click', pickColor);
        document.getElementById('canvasLibFeather').addEventListener('click', createFeather);
        document.getElementById('canvasLibNiddle').addEventListener('click', createNiddle);
        document.getElementById('canvasLibIntendedNatural').addEventListener('click', createIntendedNatural);
        document.getElementById('canvasLibKnot').addEventListener('click', createKnot);
        document.getElementById('canvasLibNatural').addEventListener('click', createNatural);
        document.getElementById('canvasLibPinpoint').addEventListener('click', createPinpoint);
        document.getElementById('canvasLibRemove').addEventListener('click', removeActiveObject);
    }

    function createSharpRectangle (){
        var rect = new fabric.Rect({
            width: objProperties.sharp_rectangle.width,
            height: objProperties.sharp_rectangle.height,
            fill: colorSelector.code,
            strokeWidth: objProperties.sharp_rectangle.strokeWidth,
            top: cursorEnum.defaultY,
            left: cursorEnum.defaultX
        });
        canvas.add(rect);
    }

    function createRoundRectangle(){
        var roundRect = new fabric.Rect({
            width: objProperties.round_rectangle.width,
            height: objProperties.round_rectangle.height,
            rx: objProperties.round_rectangle.rx,
            ry: objProperties.round_rectangle.ry,
            fill: colorSelector.code,
            top: cursorEnum.defaultY,
            left: cursorEnum.defaultX,
            lines: [],
        });
        canvas.add(roundRect);
    }

    function createLine(){
        var line = new fabric.Rect({
            width: objProperties.line.width,
            height: objProperties.line.height,
            fill: colorSelector.code,
            strokeWidth: objProperties.line.strokeWidth,
            top: cursorEnum.defaultY,
            left: cursorEnum.defaultX,
            lines: []
        });
        canvas.add(line);
    }

    function createEtchChannel(){
        var etchChannelInner = new fabric.Rect({
            width: objProperties.etch_channel.inner_length,
            height: objProperties.etch_channel.inner_length,
            fill: '',
            stroke: colorSelector.code,
            strokeWidth: objProperties.etch_channel.strokeWidth,
            top: objProperties.etch_channel.inner_top,
            left: objProperties.etch_channel.inner_left,
            lines: []
        });
        var etchChannelOuter = new fabric.Rect({
            width: objProperties.etch_channel.outer_length,
            height: objProperties.etch_channel.outer_length,
            fill: '',
            stroke: colorSelector.code,
            strokeWidth: objProperties.etch_channel.strokeWidth,
            top: objProperties.etch_channel.outer_top,
            left: objProperties.etch_channel.outer_left,
            lines: []
        });
        etchChannel = new fabric.Group([etchChannelInner, etchChannelOuter]);
        canvas.add(etchChannel);
    }

    function createLaserDril(){
        var laserInner = new fabric.Circle({
            radius: objProperties.laser_dril.inner_radius,
            fill: colorSelector.code,
            top: objProperties.laser_dril.inner_top,
            left: objProperties.laser_dril.inner_left
        });
        var laserOuter = new fabric.Circle({
            radius: objProperties.laser_dril.outer_radius,
            fill: '',
            stroke: colorSelector.code,
            strokeWidth: objProperties.laser_dril.strokeWidth,
            top: objProperties.laser_dril.outer_top,
            left: objProperties.laser_dril.outer_left
        });
        var laserDrill = new fabric.Group([laserInner, laserOuter]);
        canvas.add(laserDrill);
    }

    function createArrow(){
        var path = new fabric.Path(objPath.ARROW, {
            left: objProperties.arrow.left,
            top: objProperties.arrow.top,
            stroke: colorSelector.code,
            strokeWidth: objProperties.arrow.strokeWidth,
        });
        canvas.add(path);
    }

    function createFreeDraw(){
        canvas.isDrawingMode = !canvas.isDrawingMode;
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = colorSelector.code;
    }

    function createBruise(){
        var bruise = new fabric.Path(objPath.BRUISE, {
            top: objProperties.bruise.top,
            left: objProperties.bruise.left,
            strokeWidth: objProperties.bruise.strokeWidth,
            stroke: colorSelector.code
        });
        canvas.add(bruise);
    }

    function createCavity(){
        var parallel = new fabric .Path(objPath.CAVITY, {
            top: objProperties.cavity.top,
            left: objProperties.cavity.parallel_left,
            stroke: colorSelector.code,
            strokeWidth: objProperties.cavity.strokeWidth
        });
        var rect = new fabric.Rect({
            width: objProperties.cavity.rect_width,
            height:objProperties.cavity.rect_height,
            rx: objProperties.cavity.rect_rx,
            ry: objProperties.cavity.rect_ry,
            top: objProperties.cavity.top,
            left: objProperties.cavity.rect_left,
            fill: '',
            stroke: colorSelector.code,
            strokeWidth: objProperties.cavity.strokeWidth
        });
        var cavity = new fabric.Group([parallel, rect]);
        canvas.add(cavity);
    }

    function createCloud(){
        var cloud = new fabric.Circle({
            radius: objProperties.cloud.radius,
            stroke: colorSelector.code,
            strokeWidth: objProperties.cloud.strokeWidth,
            fill: '', 
            left: cursorEnum.defaultX, 
            top: cursorEnum.defaultY, 
            strokeDashArray: [3, 5]
        });
        canvas.add(cloud);
    }

    function createTwinningWisp(){
        var twinningWisp = new fabric.Path(objPath.TWINNING_WISP, {
            left: objProperties.twinning_wisp.left, 
            top: objProperties.twinning_wisp.top,
            fill: '',
            stroke: colorSelector.code,
            strokeWidth: objProperties.twinning_wisp.strokeWidth
        });
        canvas.add(twinningWisp);
    }

    function pickColor(){
        var index = colorArray.indexOf(colorSelector);
        index = (index + 1) % colorArray.length;
        colorSelector = colorArray[index];
        document.getElementById('canvasLibPickColor').style.backgroundColor = colorSelector.code;
    }

    function createFeather(){
        var feather = new fabric.Path(objPath.FEATHER, {
            left: objProperties.feather.left,
            top: objProperties.feather.top,
            fill: '',
            stroke: colorSelector.code,
            strokeWidth: objProperties.feather.strokeWidth
        });
        canvas.add(feather);
    }

    function createNiddle(){
        var niddle = new fabric.Rect({
            width: objProperties.niddle.width,
            height: objProperties.niddle.height,
            fill: colorSelector.code,
            top: objProperties.niddle.top,
            left: objProperties.niddle.left,
            angle: objProperties.niddle.angle,
            lines: []
        });
        canvas.add(niddle);
    }

    function createIntendedNatural(){
        var indentedUpper = new fabric.Path(objPath.INTENDED_UPPER, {
            top: objProperties.intended_natural.upper_top,
            left: objProperties.intended_natural.upper_left,
            stroke: colorSelector.code,
            strokeWidth: objProperties.intended_natural.strokeWidth
        });
        var indentedLower = new fabric.Path(objPath.INTENDED_LOWER, {
            top: objProperties.intended_natural.lower_top,
            left: objProperties.intended_natural.lower_left,
            stroke: colorSelector.code,
            strokeWidth: objProperties.intended_natural.strokeWidth
        });
        var indentedNatural = new fabric.Group([indentedLower, indentedUpper]);
        canvas.add(indentedNatural);
    }

    function createKnot(){
        var knotInner = new fabric.Rect({
            top: objProperties.knot.inner_top,
            left: objProperties.knot.inner_left,
            width: objProperties.knot.inner_width,
            height: objProperties.knot.inner_height,
            fill: '',
            stroke: colorSelector.code,
            strokeWidth: objProperties.knot.strokeWidth,
            rx: objProperties.knot.rx,
            ry: objProperties.knot.ry
        });
        var knotOuter = new fabric.Rect({
            top: objProperties.knot.outer_top,
            left: objProperties.knot.outer_left,
            height: objProperties.knot.outer_height,
            width: objProperties.knot.outer_width,
            stroke: colorSelector.code,
            fill: '',
            strokeWidth: objProperties.knot.strokeWidth,
            rx: objProperties.knot.rx, 
            ry: objProperties.knot.ry,
        });
        var knot = new fabric.Group([knotInner, knotOuter]);
        canvas.add(knot);
    }

    function createNatural(){
        var natural = new fabric.Path(objPath.NATURAL, {
            top: cursorEnum.defaultY,
            left: cursorEnum.defaultX,
            stroke: colorSelector.code,
            strokeWidth: objProperties.natural.strokeWidth,
            fill: ''
        });
        canvas.add(natural);
    }

    function createPinpoint(){
        var pinpoint = new fabric.Circle({
            radius: objProperties.pinpoint.radius,
            fill: colorSelector.code,
            top: objProperties.pinpoint.top,
            left: objProperties.pinpoint.left
        });
        canvas.add(pinpoint);
    }

    function invokeImageEvent(id){
        imageType = id;
        if(id === backgroundImageType.full_background) document.getElementById("canvasLibFullBackgroundImageId").click();
        else if(id === backgroundImageType.left_half)document.getElementById("canvasLibLeftHalfImageId").click();
        else if(id === backgroundImageType.right_half) document.getElementById("canvasLibRightHalfImageId").click();
    }

    function removeActiveObject(){
        canvas.remove(canvas.getActiveObject());
    }

    function saveAsJSON(){
        var json = canvas.toJSON(['height', 'width', 'grid']);
        var canvasData = JSON.stringify(json);
        return canvasData;
    }

    function saveAsSVG(){
        var canvasData = canvas.toSVG();
        return canvasData;
    }

    function getImage(){
        var imagePath = null; 
        if(imageType  === backgroundImageType.full_background) imagePath = document.getElementById("canvasLibFullBackgroundImageId").value;
        else if(imageType === backgroundImageType.left_half) imagePath = document.getElementById("canvasLibLeftHalfImageId").value;
        else if(imageType === backgroundImageType.right_half)imagePath = document.getElementById("canvasLibRightHalfImageId").value;
        var imageId = imagePath.split('\\')[2];
        setBackgroundImage(imageId);
    }

    function setBackgroundImage(imageId){
        if(imageId != undefined){
            var imagePath = "assets/" + imageId;
            clearBackgroundImage();
            fabric.Image.fromURL(imagePath, function(image){
                if(imageType === backgroundImageType.full_background){
                    canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
                        scaleX: canvas.width / image.width,
                        scaleY: canvas.height / image.height
                    });
                }
                else {
                    fabric.Image.fromURL(imagePath, function(oimg){
                        var img = oimg.set({
                            top: 0, 
                            left: imageType === backgroundImageType.left_half ? 0 : canvas.width / 2,
                            scaleX: (canvas.width/2) / oimg.width,
                            scaleY: canvas.height / oimg.height,
                            selectable: false
                        });
                        canvas.add(img);
                        if(imageType === backgroundImageType.left_half) leftImage = img;
                        else if(imageType === backgroundImageType.right_half) rightImage = img;
                    });
                }
            });
        }  
    }

    function clearBackgroundImage(){
        if(imageType === backgroundImageType.full_background){
            if(leftImage != null) canvas.remove(leftImage);
            if(rightImage != null) canvas.remove(rightImage);
        }
        else if(imageType === backgroundImageType.left_half){
            if(leftImage != null) canvas.remove(leftImage);
            canvas.backgroundImage = false;
        }
        else if(imageType === backgroundImageType.right_half){
            if(rightImage != null) canvas.remove(rightImage);
            canvas.backgroundImage = false;
        }
    }

    var html =
        '<div class="canvas-lib-container">' +
            '<div class="canvas-lib-btnArea">'  +
                '<div class="canvas-lib-btnColumn">'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' +
                            '<img id="canvasLibRectangleSharp" class="canvas-lib-image" title="sharp rectangle" src="assets/logo/rectangle_sharp.png" alt="rectangle_sharp">' +
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibCavity" class="canvas-lib-image" title="cavity" src="assets/logo/cavity.png" alt="cavity">' +
                        '</div>' +
                    '</div>'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' +
                        '<img id="canvasLibRectangleRound" class="canvas-lib-image" title="round rectangle" src="assets/logo/rectangle_round.png" alt="rectangle_round">' +
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibCloud" class="canvas-lib-image" title="cloud" src="assets/logo/cloud.png" alt="cloud">' +
                        '</div>' + 
                    '</div>'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' +
                            '<img id="canvasLibDrawLine" class="canvas-lib-image" title="line" src="assets/logo/line.png" alt="line">' +
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibEtchChannel" class="canvas-lib-image" title="etch Channel" src="assets/logo/etchChannel.png" alt="etchChannel">' +
                        '</div>' + 
                    '</div>'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' +
                            '<img id="canvasLibDrawArrow" class="canvas-lib-image" title="arrow" src="assets/logo/arrow.png" alt="arrow">' +
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibLaserDril" class="canvas-lib-image" title="laser dril" src="assets/logo/laserDril.png" alt="laserdril">' +
                        '</div>' + 
                    '</div>'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' +
                            '<img id="canvasLibFreeDraw" class="canvas-lib-image" title="free drawing" src="assets/logo/free_drawing.png" alt="free_drawing">' +
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibBruise" class="canvas-lib-image" title="bruise" src="assets/logo/bruise.png" alt="bruise">' +
                        '</div>' + 
                    '</div>'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' +
                        '<img id="canvasLibFullBackgroundImage" class="canvas-lib-image" title="full background image" src="assets/logo/image.png" alt="image">' +
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibTwinningWisp" class="canvas-lib-image" title="twinning wisp" src="assets/logo/twinningWisp.png" alt="twinningWisp">' +
                        '</div>' + 
                    '</div>'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' + 
                            '<div id="canvasLibPickColor" class="canvas-lib-image" title="color" alt="color" style="background-color:black;">' +
                            '</div>' + 
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibFeather" class="canvas-lib-image" title="feather" src="assets/logo/feather.png" alt="feather">' +
                        '</div>' + 
                    '</div>'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' + 
                            '<img id="canvasLibNiddle" class="canvas-lib-image" title="niddle" src="assets/logo/niddle.png" alt="niddle">' +
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibIntendedNatural" class="canvas-lib-image" title="intended natural" src="assets/logo/intendedNatural.png" alt="intendedNatural">' +
                        '</div>' + 
                    '</div>'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' + 
                            '<img id="canvasLibKnot" class="canvas-lib-image" title="knot" src="assets/logo/knot.png" alt="knot">' +
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibNatural" class="canvas-lib-image" title="natural" src="assets/logo/natural.png" alt="natural">' +
                        '</div>' + 
                    '</div>'+
                    '<div class="canvas-lib-row">' +
                        '<div class="canvas-lib-block-left">' + 
                            '<img id="canvasLibLeftHalfImage" class="canvas-lib-image" title="left half image" src="assets/logo/image.png" alt="image">' +
                        '</div>' + 
                        '<div class="canvas-lib-block-right">' +
                            '<img id="canvasLibRightHalfImage" class="canvas-lib-image" title="right-half image" src="assets/logo/image.png" alt="image">' +
                        '</div>' + 
                    '</div>'+ 
                    '<div class="canvas-lib-row">' + 
                        '<div class="canvas-lib-block-left">' + 
                            '<img id="canvasLibPinpoint" class="canvas-lib-image" title="pinpoint" src="assets/logo/pinpoint.png" alt="pinpoint">' +
                        '</div>' + 
                        '<div class=canvas-lib-block-right>' +
                            '<img id="canvasLibRemove" class="canvas-lib-image" title="remove" src="assets/logo/remove.png" alt="remove">' +
                        '</div>' +
                    '</div>' +
                '</div>' + 
            '</div>' + 
            '<div class="canvas-lib-canvas-div">' +
                '<canvas id="canvas"></canvas>'+ 
            '</div>' + 
            '<div>'+ 
                '<input id="canvasLibFullBackgroundImageId" type="file" accept="image\*" hidden>' +
                '<input id="canvasLibRightHalfImageId" type="file" accept="image\*" hidden>' +
                '<input id="canvasLibLeftHalfImageId" type="file" accept="image\*" hidden>' +
            '</div>' + 
        '</div>' ;

        return {
            createCanvas : createCanvas,
            getJSON : saveAsJSON,
            getSVG : saveAsSVG,
            loadCanvasFromJSON : loadCanvasFromJSON,
            loadCanvasFromSVG : loadCanvasFromSVG
        }
})();