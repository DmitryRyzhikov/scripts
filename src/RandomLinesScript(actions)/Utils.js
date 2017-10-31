/**
 * @Copyright Dmitry Ryzhikov, 2017
 */


function checkThatDocumentIsOpen() {
    if (documents.length > 0) {
        doc = activeDocument;

        return doc;
    } else {
        Window.alert("You must open at least one document.");
    }
}


/**
 * Example of usage:
 * drawCircle(artBoardCentralPointY, artBoardCentralPointX, 100);
 *
 * @param top - Y coordinate of top left point of rectangle drawn around circle
 * @param left - X coordinate of top left point of rectangle drawn around circle
 * @param diameter - diameter of circle
 * @returns reference to drawn circle
 */
function drawCircle(top, left, diameter) {
    var circle = app.activeDocument.pathItems.ellipse(top, left, diameter, diameter, false, false);

    return circle;
}


/**
 * Draw line from line points array, that contains pairs of X&Y coordinates.
 *
 * @param linePoints array with line points
 */
function drawPathFromPoints(linePoints) {
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


/**
 *
 * @param artBoardName name of art board to draw rectangle around
 * @returns rectangle drawn around art board with accepted name
 */
function drawRectangleAroundArtBoard(artBoardName) {
    var artBoardRect = findArtboardRectangle(artBoardName);

    //top left corner
    artBoardTopLeftX = artBoardRect[0];
    artBoardTopLeftY = artBoardRect[1];

    //bottom right corner
    artBoardBottomRightX = artBoardRect[2];
    artBoardBottomRightY = artBoardRect[3];

    // calculate rectangle dimensions
    artBoardWidth = Math.abs(artBoardBottomRightX - artBoardTopLeftX);
    artBoardHeight = Math.abs(artBoardBottomRightY - artBoardTopLeftY);


    // top, left, width, height
    newRectangle = app.activeDocument.pathItems.rectangle(
        artBoardTopLeftY, artBoardTopLeftX, artBoardWidth, artBoardHeight
    );

    return newRectangle;
}


/*
 RECURSIVE! Trying to find path item in group. Starts from direct path items of group, then
 recursively goes through all nested groups of accepted group. Returns first element with accepted name
 */
function findPathItemInGroupByName(group, pathItemName) {
    if (!group) {
        return;
    }

    var groupDirectPathItems = group.pathItems;
    var pathItemsLength = groupDirectPathItems.length;
    if (pathItemsLength > 0) {
        for (var i = 0; i < pathItemsLength; i++) {
            var pathItem = groupDirectPathItems[i];
            if (pathItem.name == pathItemName) {
                return pathItem;
            }
        }
    }

    var nestedGroups = group.groupItems;
    var nestedGroupLength = nestedGroups.length;
    for (var i = 0; i < nestedGroupLength; i++) {
        var nestedGroup = nestedGroups[i];
        var pathItem = findPathItemInGroupByName(nestedGroup, pathItemName);

        if (pathItem) {
            return pathItem;
        }
    }
}


/**
 * @param pathItemName - path item
 * @returns first path item found by name among all path items of active document
 */
function findPathItemByName(pathItemName) {
    var pathItems = activeDocument.pathItems;

    var pathLength = pathItems.length;
    for (var i = 0; i < pathLength; i++) {
        var path = pathItems[i];
        if (path.name == pathItemName) {
            $.writeln("Found path item with name " + pathItemName);

            return path;
        }
    }

    $.writeln("Path item with name [" + pathItemName + "] is not found");
}

/**
 * Finds group and colors all paths of this group to different shades of gray
 */
function findSingleGroupAndColorItPathsInShadesOfGray() {
    // After divide and group we basically have only one group
    var groupItems = activeDocument.groupItems;
    var myGroup = groupItems[0];

    var storage = [];
    findAllGroupObjectsByName(myGroup, "", storage);

    var objectsToColorLength = storage.length;
    for (var i = 0; i < objectsToColorLength; i++) {
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


/**
 *  RECURSIVE.Searches all path items with certain name on any level of accepted group.
 *  All found items are collected in accepted storage
 *
 * @param group - parent group (top level)
 * @param pathItemNameToFind - path item to find
 * @param storage
 */
function findAllGroupObjectsByName(group, pathItemNameToFind, storage) {
    if (!group) {
        return;
    }

    // find pathItems
    var groupDirectPathItems = group.pathItems;
    var pathItemsLength = groupDirectPathItems.length;
    if (pathItemsLength > 0) {
        for (var i = 0; i < pathItemsLength; i++) {
            var pathItem = groupDirectPathItems[i];
            if (pathItem.name == pathItemNameToFind) {
                storage.push(pathItem);
            }
        }
    }

    // check nested groups as well
    var nestedGroups = group.groupItems;
    var nestedGroupLength = nestedGroups.length;
    for (var i = 0; i < nestedGroupLength; i++) {
        var nestedGroup = nestedGroups[i];
        findAllGroupObjectsByName(nestedGroup, pathItemNameToFind, storage);
    }

}

/*
 * Searches art board by its name
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


/**
 * Finds art board by its name and returns its coordinates  rectangle
 */
function findArtboardRectangle(name) {
    var artboard = findArtBoardByName(name);
    if (artboard) {
        return artboard.artboardRect;
    }
}


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function print(toPrint) {
    $.writeln(toPrint);
}


/**
 * Select ALL paths existing in active document
 */
function selectAll() {
    var allPaths = activeDocument.pathItems;
    var allPathsCount = allPaths.length;
    for (var i = 0; i < allPathsCount; i++) {
        allPaths[i].selected = true;
    }
}


/**
 * Runs action from default set
 * @param actionName name of action from default set [Default Actions] to run
 */
function runActionFromDefaultSet(actionName) {
    app.doScript(actionName, 'Default Actions', false);
}
