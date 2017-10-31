//#include "Utils.js";

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


var numberOfRandomLinesToDraw;

function init() {
    //TODO open new illustrator file

    //use default art board name on new file
    var artBoardName = "Artboard 1";
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
    drawRectangleAroundArtBoard();
    drawStartingLines()
    drawRandomLines();

    // action: select all -> pathfinder divide -> selact all -> group
    runActionFromDefaultSet('selectAllDivideAndGroup');

    findGroupAndColorItInShadesOfGray();
    drawRectangleWithColorBurnBlendingMode();
    //TODO crop result

    // standard action: delete all unused panel items
    //runActionFromDefaultSet('Delete Unused Panel Items');

    // action: prepares web preview and saves EPS 10 file
    //runActionFromDefaultSet('prepareJpgAndSaveEps');
}

/*
 Finds art board by its name and returns its coordinates  rectangle
 */
function findArtboardRectangle(name) {
    var artboard = findArtBoardByName(name);
    if (artboard) {
        return artboard.artboardRect;
    }
}

/**
 * Due to problem that lines are not normally drawn near edges, we need to fix it by drawing lines in
 * every corner of arboard
 */
function drawStartingLines() {
    // in percents
    var allowedToTakeInEveryCorner = 0.1;
    var linesToDrawInEveryCorner = 5;

    var topToBottomFrom = 5;
    var topToBottomTo = Math.round(artBoardWidth * allowedToTakeInEveryCorner);

    // top-to-bottom lines
    for (var i = 0; i < linesToDrawInEveryCorner; i++) {
        var linePoints = new Array(1);
        linePoints[0] = new Array(artBoardTopLeftX + getRandomInt(topToBottomFrom, topToBottomTo), artBoardTopLeftY);
        linePoints[1] = new Array(artBoardTopLeftX + getRandomInt(topToBottomFrom, topToBottomTo), artBoardBottomRightY);
        drawLineFromPoints(linePoints);
    }

    for (var i = 0; i < linesToDrawInEveryCorner; i++) {
        var linePoints = new Array(1);
        linePoints[0] = new Array(artBoardBottomRightX - getRandomInt(topToBottomFrom, topToBottomTo), artBoardTopLeftY);
        linePoints[1] = new Array(artBoardBottomRightX - getRandomInt(topToBottomFrom, topToBottomTo), artBoardBottomRightY);
        drawLineFromPoints(linePoints);
    }


    var leftToRightFrom = 5;
    var leftToRightTo = Math.round(artBoardHeight * allowedToTakeInEveryCorner);
    // left-to-right lines
    for (var i = 0; i < linesToDrawInEveryCorner; i++) {
        var linePoints = new Array(1);
        linePoints[0] = new Array(artBoardTopLeftX, artBoardTopLeftY - getRandomInt(leftToRightFrom, leftToRightTo));
        linePoints[1] = new Array(artBoardBottomRightX, artBoardTopLeftY - getRandomInt(leftToRightFrom, leftToRightTo));
        drawLineFromPoints(linePoints);
    }

    for (var i = 0; i < linesToDrawInEveryCorner; i++) {
        var linePoints = new Array(1);
        linePoints[0] = new Array(artBoardTopLeftX, artBoardBottomRightY + getRandomInt(leftToRightFrom, leftToRightTo));
        linePoints[1] = new Array(artBoardBottomRightX, artBoardBottomRightY + getRandomInt(leftToRightFrom, leftToRightTo));
        drawLineFromPoints(linePoints);
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

    drawLineFromPoints(linePoints);
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

    drawLineFromPoints(linePoints);
}

function drawLineFromPoints(linePoints) {
    newPath = app.activeDocument.pathItems.add();
    newPath.setEntirePath(linePoints);
    newPath.stroked = true;

    var strokeCmykColor = new CMYKColor();
    strokeCmykColor.cyan = 0;
    strokeCmykColor.magenta = 0;
    strokeCmykColor.yellow = 0;
    strokeCmykColor.black = 99;

    newPath.strokeColor = strokeCmykColor;
    newPath.strokeWidth = 0.5;
}


function generateRandomNumberWithDelta(xMin, xMax) {
    var generated = getRandomInt(xMin - delta, xMax + delta);
    return generated;
}

function drawRectangleAroundArtBoard() {
    // top, left, width, height
    newRectangle = app.activeDocument.pathItems.rectangle(
        artBoardTopLeftY, artBoardTopLeftX, artBoardWidth, artBoardHeight
    );

    return newRectangle;
}

function drawRectangleWithColorBurnBlendingMode() {
    rectangle = drawRectangleAroundArtBoard();

    var redRGBColor = new RGBColor();
    redRGBColor.red = 226;
    redRGBColor.green = 6;
    redRGBColor.blue = 19;

    rectangle.stroked = false;
    rectangle.fillColor = redRGBColor;
    rectangle.blendingMode = BlendModes.COLORBURN;
}


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function runActionFromDefaultSet(actionName) {
    app.doScript(actionName, 'Default Actions', false);
}


/**
 * Finds group and colors all paths of this group to different shades of gray
 */
function findGroupAndColorItInShadesOfGray() {
    // After divide and group we basically have only one group
    var groupItems = activeDocument.groupItems;
    var myGroup = groupItems[0];

    var storage = [];
    findAllGroupObjectsByName(myGroup, "", storage);
    var objectsToColor = storage.length;
    for (var i = 0; i < objectsToColor; i++) {
        var colorObject = storage[i];

        //random black from 0 to 99
        var black = getRandomInt(5, 95);

        var cmykColor = new CMYKColor();
        cmykColor.black = black;
        cmykColor.cyan = 0;
        cmykColor.magenta = 0;
        cmykColor.yellow = 0;

        // Use the color object in the path item
        colorObject.filled = true;
        colorObject.fillColor = cmykColor;
    }
}

/*
 RECURSIVE.Searches all path items with certain name on any level of accepted group.
 All found items are collected in accepted storage
 */
function findAllGroupObjectsByName(group, name, storage) {
    if (!group) {
        return;
    }

    // find pathItems
    var groupDirectPathItems = group.pathItems;
    var pathItemsLength = groupDirectPathItems.length;
    if (pathItemsLength > 0) {
        for (var i = 0; i < pathItemsLength; i++) {
            var pathItem = groupDirectPathItems[i];
            if (pathItem.name == name) {
                storage.push(pathItem);
            }
        }
    }

    // check nested groups as well
    var nestedGroups = group.groupItems;
    var nestedGroupLength = nestedGroups.length;
    for (var i = 0; i < nestedGroupLength; i++) {
        var nestedGroup = nestedGroups[i];
        findAllGroupObjectsByName(nestedGroup, name, storage);
    }

}


function selectAll() {
    var allPaths = activeDocument.pathItems;
    var allPathsCount = allPaths.length;
    for (var i = 0; i < allPathsCount; i++) {
        allPaths[i].selected = true;
    }
}

// storage for groups
var myGroupsMap = null;

// returns group from groups map via key
function getGroupByName(groupName) {
    return myGroupsMap[groupName];
}

// because search on groups works quite slow, especially, when groups are copied, we should pre-store all
// groups with name like '%Group%' in map to get instant access in future
function activateGroupMap() {
    myGroupsMap = {};

    var groupItems = activeDocument.groupItems;

    var groupItemsLength = groupItems.length;
}


/*
 Accepts group of objects. Searches inside this group all objects with accepted name.
 Repaints found objects in accepted color.
 */
function recolorColorObjectsInGroup(group, nameOfItemsToColor, color) {
    $.writeln("Repainting. Group " + group.name + ", name " + nameOfItemsToColor + "  with RGB color[" + color.red + ";" + color.green + ";" + color.blue + "]");

    var storage = []; // or var storage = new Array();
    findAllGroupObjectsByName(group, nameOfItemsToColor, storage);
    var colorObjectsLength = storage.length;
    for (var i = 0; i < colorObjectsLength; i++) {
        var colorObject = storage[i];

        colorObject.fillColor = color;
    }
}

/*
 RECURSIVE.Searches all path items with certain name on any level of accepted group.
 All found items are collected in accepted storage
 */
function findAllGroupObjectsByName(group, name, storage) {
    if (!group) {
        return;
    }

    // find pathItems
    var groupDirectPathItems = group.pathItems;
    var pathItemsLength = groupDirectPathItems.length;
    if (pathItemsLength > 0) {
        for (var i = 0; i < pathItemsLength; i++) {
            var pathItem = groupDirectPathItems[i];
            if (pathItem.name == name) {
                storage.push(pathItem);
            }
        }
    }

    // check nested groups as well
    var nestedGroups = group.groupItems;
    var nestedGroupLength = nestedGroups.length;
    for (var i = 0; i < nestedGroupLength; i++) {
        var nestedGroup = nestedGroups[i];
        findAllGroupObjectsByName(nestedGroup, name, storage);
    }

}


/*
 Copies accepted group and aligns copied group to accepted face pin position (top, middle or bottom face pins)
 */
function copyGroupAndAlignItToFacePin(groupName, facePinPosition) {
    var originalGroup = findGroupItemByName(groupName);
    if (originalGroup) {
        var groupCopy = originalGroup.duplicate();

        groupCopy.name = originalGroup.name + "_copy";

        var copyGroupPosition = calculateGroupPositionAccordingToFacePin(groupCopy, facePinPosition);
        groupCopy.position = copyGroupPosition;
        groupCopy.zOrder(ZOrderMethod.BRINGTOFRONT);

        return groupCopy;
    }
}


/*
 Calculates group reposition to face pin. For this:
 1. Finds path element with name "pin" in accepted group (this should be center). Finds coordinates of "pin" element center
 2. Calculates difference between group top left corner cooordinates and "pin" center
 3. Because pin center should be combined with appropriate pin of face - then after reposition group top left corner should has the same offset from
 face pin, as it has from group pin. This offfset on both X and Y are calculated and returned.

 @group - group that reposition shold be calculated. This group should include path item circle with name "pin"
 @ facePinPosition - coordinates of appropriate face pin
 */
function calculateGroupPositionAccordingToFacePin(group, facePinPosition) {
    var pin = "pin";

    // find group pin and its central point
    var groupPinPathItem = findPathItemInGroupByName(group, pin);
    var groupPinCentralPoint = findPathItemCentralPoint(groupPinPathItem);

    // get group top left coordinates
    var groupPosition = group.position;

    // calculate difference between pin center coordinates and group top left coordinates
    var xAxisDifference = groupPinCentralPoint[0] - groupPosition[0];
    var yAxisDifference = groupPinCentralPoint[1] - groupPosition[1];

    // reposition of accepted group according to face pin position
    var groupRepositiionX = facePinPosition[0] - xAxisDifference;
    var groupRepositiionY = facePinPosition[1] - yAxisDifference;

    return [groupRepositiionX, groupRepositiionY];
}

/*
 Calculates pin central point coordinates. This works because pin is circle
 */
function findPathItemCentralPoint(pathItem) {
    var pathItemPosition = pathItem.position;

    var pathItemX = pathItemPosition[0];
    var pathItemY = pathItemPosition[1];
    var pathItemWidth = pathItem.width;
    var pathItemHeight = pathItem.height;

    // top pin central point position
    var pathItemCenterX = pathItemX + pathItemWidth / 2;
    var pathItemCenterY = pathItemY - pathItemHeight / 2;

    return [pathItemCenterX, pathItemCenterY];
}

/*
 RECURSIVE! Trying to find path item in group. Starts from direct path items of group, then
 recursively goes through all nested groups of accepted group. Returns first element with accepted name
 */
function findPathItemInGroupByName(group, name) {
    if (!group) {
        return;
    }

    var groupDirectPathItems = group.pathItems;
    var pathItemsLength = groupDirectPathItems.length;
    if (pathItemsLength > 0) {
        for (var i = 0; i < pathItemsLength; i++) {
            var pathItem = groupDirectPathItems[i];
            if (pathItem.name == name) {
                return pathItem;
            }
        }
    }

    var nestedGroups = group.groupItems;
    var nestedGroupLength = nestedGroups.length;
    for (var i = 0; i < nestedGroupLength; i++) {
        var nestedGroup = nestedGroups[i];
        var pathItem = findPathItemInGroupByName(nestedGroup, name);

        if (pathItem) {
            return pathItem;
        }
    }
}


/*
 Searches path item by its name. Returns first found result
 */
function findPathItemByName(name) {
    var pathItems = activeDocument.pathItems;

    var pathLength = pathItems.length;
    for (var i = 0; i < pathLength; i++) {
        var path = pathItems[i];
        if (path.name == name) {
            $.writeln("Found path item with name " + name);

            return path;
        }
    }

    $.writeln("Path item with name [" + name + "] is not found");
}

/*
 Searches group items by its name. Returns first found result
 */
function findGroupItemByName(name) {
    // first, try to find in map that stores pre-activated groups
    var group = getGroupByName(name);
    if (group) {
        $.writeln("Group is found inside [myGroupsMap] storage. Map key:" + name);
        return group;
    }

    $.writeln("Group is not found inside map. Searching group item with name " + name);
    var groupItems = activeDocument.groupItems;

    var groupItemsLength = groupItems.length;
    for (var i = 0; i < groupItemsLength; i++) {
        group = groupItems[i];

        if (group.name == name) {
            //$.writeln("Found group item with name " + name + ". Also adding group to [myGroupsMap]");
            //myGroupsMap[name] = group;
            $.writeln("Found group item with name " + name);

            return group;
        }
    }

    $.writeln("Group with name [" + name + "] is not found");
}

/*
 Searches art board by its name
 */
function findArtBoardByName(name) {
    var artboards = activeDocument.artboards;

    var length = artboards.length;
    for (var i = 0; i < length; i++) {
        var artboard = artboards[i];
        if (artboard.name == name) {
            $.writeln("Found artboard with name " + name);

            return artboard;
        }
    }

    $.writeln("Artboard with name [" + name + "] is not found");
}

function checkThatDocumentIsOpen() {

    if (documents.length > 0) {

        doc = activeDocument;

        return doc;

    } else {
        Window.alert("You must open at least one document.");
    }
}
