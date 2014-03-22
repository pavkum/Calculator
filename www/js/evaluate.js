var evaluationEvent = $.Event('evaluate');

$('body').on('evaluate',function(eve,displayPad){
    var value;
    //preValidate();
    try{
        value = eval(window.value);
        
        if(isNaN(value)){
            window.value = undefined;
        }else{
            if(isFinite(value)){
                window.value = value;
            }else{
                window.value = undefined;
            }
        }
        
    }catch(Error){
        value = "Error";
    }
    
    displayPad.toMainDisplay(value);
    //window.value = undefined;
});


