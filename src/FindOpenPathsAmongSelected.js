if (documents.length > 0 && activeDocument.pathItems.length > 0){
 
          // remove selection from closed
          var selected = activeDocument.selection;
          if(selected){
                var selectedLength = selected.length;
                for (var i=0; i < selectedLength; i++){
                      var pathItem = selected[i];
                      
                      if(pathItem.closed){
                              pathItem.selected = false;
                      }    
                      
                }
           }
}