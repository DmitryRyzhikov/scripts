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

var numberOfRandomLinesToDraw;

function init() {

    //use default art board name on new file
    artBoardName = "Artboard 1";
    numberOfRandomLinesToDraw = 150;
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
    drawStartingLines()
    drawRandomLines();

    // action: select all -> pathfinder divide -> selact all -> group
    runActionFromDefaultSet('selectAllDivideAndGroup');

    findSingleGroupAndColorItPathsInShadesOfGray();
    drawRectangleWithColorBurnBlendingMode();
    //TODO crop result

    // standard action: delete all unused panel items
    //runActionFromDefaultSet('Delete Unused Panel Items');

    // action: prepares web preview and saves EPS 10 file
    //runActionFromDefaultSet('prepareJpgAndSaveEps');
}

/**
 * Due to problem that lines are not normally drawn near edges, we need to fix it by drawing lines in
 * every corner of art board
 */
function drawStartingLines() {
    // in percents
    var allowedToTakeInEveryCorner = 0.15;
    var linesToDrawInEveryCorner = 6;

    var topToBottomFrom = 5;
    var topToBottomTo = Math.round(artBoardWidth * allowedToTakeInEveryCorner);

    // top-to-bottom lines
    for (var i = 0; i < linesToDrawInEveryCorner; i++) {
        var linePoints = new Array(1);
        linePoints[0] = new Array(artBoardTopLeftX + getRandomInt(topToBottomFrom, topToBottomTo), artBoardTopLeftY);
        linePoints[1] = new Array(artBoardTopLeftX + getRandomInt(topToBottomFrom, topToBottomTo), artBoardBottomRightY);
        drawPathFromPoints(linePoints);
    }

    for (var i = 0; i < linesToDrawInEveryCorner; i++) {
        var linePoints = new Array(1);
        linePoints[0] = new Array(artBoardBottomRightX - getRandomInt(topToBottomFrom, topToBottomTo), artBoardTopLeftY);
        linePoints[1] = new Array(artBoardBottomRightX - getRandomInt(topToBottomFrom, topToBottomTo), artBoardBottomRightY);
        drawPathFromPoints(linePoints);
    }

    // left-to-right lines
    var leftToRightFrom = 5;
    var leftToRightTo = Math.round(artBoardHeight * allowedToTakeInEveryCorner);
    // left-to-right lines
    for (var i = 0; i < linesToDrawInEveryCorner; i++) {
        var linePoints = new Array(1);
        linePoints[0] = new Array(artBoardTopLeftX, artBoardTopLeftY - getRandomInt(leftToRightFrom, leftToRightTo));
        linePoints[1] = new Array(artBoardBottomRightX, artBoardTopLeftY - getRandomInt(leftToRightFrom, leftToRightTo));
        drawPathFromPoints(linePoints);
    }

    for (var i = 0; i < linesToDrawInEveryCorner; i++) {
        var linePoints = new Array(1);
        linePoints[0] = new Array(artBoardTopLeftX, artBoardBottomRightY + getRandomInt(leftToRightFrom, leftToRightTo));
        linePoints[1] = new Array(artBoardBottomRightX, artBoardBottomRightY + getRandomInt(leftToRightFrom, leftToRightTo));
        drawPathFromPoints(linePoints);
    }
}

function drawRandomLines() {
    for (var i = 0; i < numberOfRandomLinesToDraw; i++) {
        var randomNum = getRandomInt(1, 2);
        if (randomNum == 1) {
            drawTopToBottomLine();
        } else {
            drawLeftToRightLine();
        }
    }
}

/**
 * Draw random line from top part of art board to bottom part.
 */
function drawTopToBottomLine() {
    $.writeln("Drawing top to bottom line");
    var linePoints = new Array(1);

    var topPointX = generateRandomNumberWithDelta(artBoardTopLeftX, artBoardBottomRightX);
    var topPointY = artBoardTopLeftY + delta;
    $.writeln("Top point. X =" + topPointX + ", Y = " + topPointY);
    linePoints[0] = new Array(topPointX, topPointY);

    var bottomPointX = generateRandomNumberWithDelta(artBoardTopLeftX, artBoardBottomRightX);
    var bottomPointY = artBoardBottomRightY - delta;
    $.writeln("Bottom point. X =" + bottomPointX + ", Y = " + bottomPointY);
    linePoints[1] = new Array(bottomPointX, bottomPointY);

    drawPathFromPoints(linePoints);
}

/**
 * Draw random line from left part of art board to right part.
 */
function drawLeftToRightLine() {
    $.writeln("Drawing left to right line");
    var linePoints = new Array(1);

    var leftPointX = artBoardTopLeftX - delta;
    var leftPointY = generateRandomNumberWithDelta(artBoardTopLeftY, artBoardBottomRightY);
    $.writeln("Left point. X =" + leftPointX + ", Y = " + leftPointY);
    linePoints[0] = new Array(leftPointX, leftPointY);

    var rightPointX = artBoardBottomRightX + delta;
    var rightPointY = generateRandomNumberWithDelta(artBoardTopLeftY, artBoardBottomRightY);
    $.writeln("Bottom point. X =" + rightPointX + ", Y = " + rightPointY);
    linePoints[1] = new Array(rightPointX, rightPointY);

    drawPathFromPoints(linePoints);
}


function generateRandomNumberWithDelta(xMin, xMax) {
    var generated = getRandomInt(xMin - delta, xMax + delta);
    return generated;
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
