      /**
 * @Copyright Dmitry Ryzhikov, 2016
      Colors in random gray colors only selected objects
 */

main();

function main() {
    var doc = checkThatDocumentIsOpen();

    if (doc) {
        handle();
    }
}

function handle() {
  
          var selected = activeDocument.selection;
          if(selected && selected.length){
                var selectedLength = selected.length;
                for (var i=0; i < selectedLength; i++){
                      var pathItem = selected[i];
                      

                      
                      //random black from 0 to 99
                      var black = getRandomInt(5, 95);

                      var cmykColor = new CMYKColor();
                      cmykColor.black = black;
                      cmykColor.cyan = 0;
                      cmykColor.magenta = 0;
                      cmykColor.yellow = 0;

                      // Use the color object in the path item
                      pathItem.filled = true;
                      pathItem.fillColor = cmykColor;

                }
           } else {
                Window.alert("You must select at least one object for recolor.");             
           }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkThatDocumentIsOpen() {

    if (documents.length > 0) {

        doc = activeDocument;
        return doc;

    } else {
        Window.alert("You must open at least one document.");
    }
}
