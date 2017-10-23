      /**
 * @Copyright Dmitry Ryzhikov, 2016

 */

main();

function main() {
    var doc = checkThatDocumentIsOpen();

    if (doc) {
        handle();
    }
}

function handle() {
    var diamondGroup = findGroupItemByName("myGroup");

    var storage = [];
    findAllGroupObjectsByName(diamondGroup, "", storage);
    var colorObjectsLength = storage.length;
    for (var i = 0; i < colorObjectsLength; i++) {
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
 Accepts group of objects. Searches inside this group all objects with accepted name.
 Repaints found objects in accepted color.
 */
function recolorColorObjectsInGroup(group, nameOfItemsToColor, color) {
    $.writeln("Repainting. Group " + group.name + ", name [" + nameOfItemsToColor + "] with RGB color[" + color.red + ";" + color.green + ";" + color.blue + "]");

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


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
 Calculates pin cental point coordinates. This works because pin is circle
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
        var pathItem =  findPathItemInGroupByName(nestedGroup, name);
        
        if(pathItem){
          return pathItem;
        }
    }
}


/*
 Finds artboard by its name and returns its coordinates  rectangle
 */
function findArtboardCoorditantes(name) {
    var artboard = findArtboardByName(name);
    if (artboard) {
        return artboard.artboardRect;
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
    $.writeln("Searching group item with name " + name);
    var groupItems = activeDocument.groupItems;

    var groupItemsLength = groupItems.length;
    for (var i = 0; i < groupItemsLength; i++) {
        var group = groupItems[i];
        if (group.name == name) {
            $.writeln("Found group item with name " + name);

            return group;
        }
    }

    $.writeln("Group with name [" + name + "] is not found");
}

/*
 Searches artboard by its name
 */
function findArtboardByName(name) {
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
