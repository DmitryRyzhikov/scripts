 /**
 * @Copyright Dmitry Ryzhikov, 2016
 *
 * Men faces construction script. Works only in pair with appropriate Illustrator file (MenFacesConstructionKit.ai)
 * Basic concepts:
 * 1. ILLUSTRATOR file contains basic blocks that are used for face building
 *
 * 2. Main block and basis for all other blocks is face. Face has three pin points - on top of
 * head curve - "topPin", on top part of nose - "middlePin", on bottom part of nose - "bottomPin".
 * All pins are circles. There are two possible types of faces: rectangle and triangle.
 *
 * 3. Other blocks (with number of variants) - eyes (6), lips (6), eyebrows(6), hair (14), beards (18), glasses (12).
 * Each block name composed as its category + Group + number. For example for eyes: eyesGroup1, ..., eyesGroup6.
 * Each block contains path element with name "pin". This is circle. This "pin is aligned" to appropriate
 * pin of face. Eyes aligned to middlePin, eyebrows aligned to middle pin, lips aligned to bottomPin,
 * beards aligned to bottomPin, glasses aligned to middlePin, hairs aligned to topPin.
 *
 * 4. For every generated face random-function calculates number of every group, then copies it and aligns
 * it to previously copied face group.
 *
 * 5. Same principle is used for repainting. On Illustrator files two groups of pathItems are defined: for
 * hair color (hairColor1 ... hairColor6) and for eyes color (eyesColor1 ... eyesColor6). Randomly generated
 * number of 1 to 6, appropriate pathItem is picked, its color is extracted.
 *
 * 6. Inside every group pathItems that should be repainted has name "color". This path items are found
 * and color from p.5 is applied as their fill color. IMPORTANT! Works for pathItems only, not working
 * for compoundPathItems.
 */

main();

function main() {
    var doc = checkThatDocumentIsOpen();

    if (doc) {
        createFaces();
    }
}

function createFaces() {
    // offsets
    var artboardXOffset = 75;
    var artboardYOffset = -25;

    var pictureXOffset = 175;
    var pictureYOffset = -195;

    // face parts variables
    var artboardName = "artboardCanvas";
    var faceGroupName = "faceGroup";
    var lipsGroupName = "lipsGroup";
    var eyesGroupName = "eyesGroup";
    var eyeBrowsGroupName = "eyebrowsGroup";
    var beardsGroupName = "beardsGroup";
    var hairGroupName = "hairGroup";
    var glassesGroupName = "glassesGroup";
    var handsGroupName = "handsGroup"

    // color variables
    var eyesColorGroupKey = "eyesColorGroup";
    var hairColorGroupKey = "hairColorGroup";
    var lipsColorGroupKey = "lipsColorGroup"
    var colorOne = "color";
    var colorTwo = "color2";
    var colorThree = "color3";

    // pins variables
    var topPin = "topPin";
    var middlePin = "middlePin";
    var bottomPin = "bottomPin";
    var pin = "pin";

    var artboardRect = findArtboardCoorditantes(artboardName);
    var artboardTopLeftX = artboardRect[0];
    var artboardTopLeftY = artboardRect[1];

    var counter = 0;
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 4; y++) {
            counter++;

            // calculate top left point of face group
            var copyGroupX = artboardTopLeftX + artboardXOffset + (x * pictureXOffset);
            var copyGroupY = artboardTopLeftY + artboardYOffset + (y * pictureYOffset);

            $.writeln("\n\nFace " + counter + ". Calculated position. [" + copyGroupX + ";" + copyGroupY + "]");

            //face group
            var faceGroupNumber = getRandomInt(1, 1);
            var group = findGroupItemByName(faceGroupName + faceGroupNumber);
            if (group) {
                var copyGroup = group.duplicate();
                var groupPosition = [copyGroupX, copyGroupY];
                copyGroup.position = groupPosition;
                copyGroup.name = group.name + "_copy";

                //face top pin
                var topPinPathItem = findPathItemInGroupByName(copyGroup, topPin);
                var topPinCenterPosition = findPathItemCentralPoint(topPinPathItem);

                // face middle pin
                var middlePinPathItem = findPathItemInGroupByName(copyGroup, middlePin);
                var middlePinCenterPosition = findPathItemCentralPoint(middlePinPathItem);

                //face bottom pin
                var bottomPinPathItem = findPathItemInGroupByName(copyGroup, bottomPin);
                var bottomPinCenterPosition = findPathItemCentralPoint(bottomPinPathItem);

                //--------------------------------------------------------------------COLORS
                //get random lips colors (10)
                var lipsColorNumber = getRandomInt(1, 10);
                var lipsColorGroup = findGroupItemByName(lipsColorGroupKey + lipsColorNumber);
                var lipsColorOnePathItem = findPathItemInGroupByName(lipsColorGroup, colorOne);
                var lipsColorTwoPathItem = findPathItemInGroupByName(lipsColorGroup, colorTwo);
                var lipsColorOne = lipsColorOnePathItem.fillColor;
                var lipsColorTwo = lipsColorTwoPathItem.fillColor;
                
                //get random eyes color (6)
                var eyesColorNumber = getRandomInt(1, 6);
                var eyesColorGroup = findGroupItemByName(eyesColorGroupKey + eyesColorNumber);
                var eyesColorPathItem = findPathItemInGroupByName(eyesColorGroup, colorOne)
                var eyesColor = eyesColorPathItem.fillColor;

                //get random hair colors (7)
                var hairColorNumber = getRandomInt(1, 7);
                var hairColorGroup = findGroupItemByName(hairColorGroupKey + hairColorNumber);
                var hairColorOnePathItem = findPathItemInGroupByName(hairColorGroup, colorOne);
                var hairColorTwoPathItem = findPathItemInGroupByName(hairColorGroup, colorTwo);
                var hairColorThreePathItem = findPathItemInGroupByName(hairColorGroup, colorThree);
                var hairColorOne = hairColorOnePathItem.fillColor;
                var hairColorTwo = hairColorTwoPathItem.fillColor;
                var hairColorThree = hairColorThreePathItem.fillColor;

                //-------------------------------------------------------------------- EYES
                // copy and align eyes group (20)
                var eyesGroupNumber = getRandomInt(1, 20);
                var eyesCopyGroup = copyGroupAndAlignItToFacePin(eyesGroupName + eyesGroupNumber, middlePinCenterPosition);
                //recolor eyes
                recolorColorObjectsInGroup(eyesCopyGroup, colorOne, eyesColor); 

                //-------------------------------------------------------------------- LIPS
                // copy and align lips group (23)
                var lipsGroupNumber = getRandomInt(18, 26);
                var lipsCopyGroup = copyGroupAndAlignItToFacePin(lipsGroupName + lipsGroupNumber, bottomPinCenterPosition);
                //recolor lips - two colors used
                recolorColorObjectsInGroup(lipsCopyGroup, colorOne, lipsColorOne);
                recolorColorObjectsInGroup(lipsCopyGroup, colorTwo, lipsColorTwo);

                //-------------------------------------------------------------------- EYEBROWS
                // copy and align eyebrows group (6)
                var eyebrowsGroupNumber = getRandomInt(1, 6);
                var eyebrowsCopyGroup = copyGroupAndAlignItToFacePin(eyeBrowsGroupName + eyebrowsGroupNumber, middlePinCenterPosition);
                // recolor eyebrows
                recolorColorObjectsInGroup(eyebrowsCopyGroup, colorOne, hairColorOne);

                //-------------------------------------------------------------------- HAIR
                // copy and align hair group
                var hairGroupNumber = getRandomInt(6, 8);
                var hairCopyGroup = copyGroupAndAlignItToFacePin(hairGroupName + hairGroupNumber, topPinCenterPosition);
                // recolor hair
                recolorColorObjectsInGroup(hairCopyGroup, colorOne, hairColorOne);
                recolorColorObjectsInGroup(hairCopyGroup, colorTwo, hairColorTwo);
                recolorColorObjectsInGroup(hairCopyGroup, colorThree, hairColorThree);

                //-------------------------------------------------------------------- HANDS
                // copy and align hands group
                var handsGroupNumber = getRandomInt(1, 2);
                var handsCopyGroup = copyGroupAndAlignItToFacePin(handsGroupName + handsGroupNumber, bottomPinCenterPosition);
                // recolor nails
                recolorColorObjectsInGroup(handsCopyGroup, colorOne, lipsColorOne);
                

                //-------------------------------------------------------------------- GLASSES
                // copy and align glasses group
//                var glassesGroupNumber = getRandomInt(1, 12);
//                copyGroupAndAlignItToFacePin(glassesGroupName + glassesGroupNumber, middlePinCenterPosition);

            }
        }
    }
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

        if (!doc.saved) {
            Window.alert("This script needs to modify your document. Please save it before running this script.");
        }
        return doc;

    } else {
        Window.alert("You must open at least one document.");
    }
}
