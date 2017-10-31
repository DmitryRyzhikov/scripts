#include "Utils.js";

main();

function main() {
    var doc = checkThatDocumentIsOpen();

    if (doc) {
        init();
        execute();
    }
}

var delta;
var artBoardTopLeftX;
var artBoardTopLeftY;
var artBoardBottomRightX;
var artBoardBottomRightY;
var artBoardWidth;
var artBoardHeight;
var artBoardName;

var numberOfCirclesToDraw;

function init() {

    //use default art board name on new file
    artBoardName = "Artboard 1";
    numberOfCirclesToDraw = 300;
    delta = 0;

    var artBoardRect = findArtboardRectangle(artBoardName);
    artBoardTopLeftX = artBoardRect[0];
    artBoardTopLeftY = artBoardRect[1];
    artBoardBottomRightX = artBoardRect[2];
    artBoardBottomRightY = artBoardRect[3];
    artBoardWidth = Math.abs(artBoardBottomRightX - artBoardTopLeftX);
    artBoardHeight = Math.abs(artBoardBottomRightY - artBoardTopLeftY);

    // default stroke color (gray 90%)
    var newRGBColor = new RGBColor();
    newRGBColor.red = 64;
    newRGBColor.green = 64;
    newRGBColor.blue = 65;

    //default stroke properties
    app.activeDocument.defaultStroked = true;
    app.activeDocument.defaultStrokeColor = newRGBColor;
    app.activeDocument.defaultStrokeWidth = 0.5;
}

function execute() {
    drawRectangleAroundArtBoard(artBoardName);
    drawRandowCircles();

    // action: select all -> pathfinder divide -> selact all -> group
    runActionFromDefaultSet('selectAllDivideAndGroup');

    findSingleGroupAndColorItPathsInShadesOfGray();
    drawRectangleWithColorBurnBlendingMode();
}

function drawRandowCircles() {
    for (var i = 0; i < numberOfCirclesToDraw; i++) {

        var randomTopCoordinate = artBoardTopLeftY + 0.1 * artBoardHeight - getRandomInt(0, artBoardHeight);
        var randomLeftCoordinate = artBoardTopLeftX - 0.1 * artBoardWidth+ getRandomInt(0, artBoardWidth);
        var randomDiameter = getRandomInt(20, 200);

        drawCircle(randomTopCoordinate, randomLeftCoordinate, randomDiameter);
    }
}

function drawRectangleWithColorBurnBlendingMode() {
    rectangle = drawRectangleAroundArtBoard(artBoardName);

    var redRGBColor = new RGBColor();
    redRGBColor.red = 226;
    redRGBColor.green = 6;
    redRGBColor.blue = 19;

    rectangle.stroked = false;
    rectangle.fillColor = redRGBColor;
    rectangle.blendingMode = BlendModes.COLORBURN;
}
