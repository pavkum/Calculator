




var utilities = (function (){
    
    var copy = $('#copy');
    
    var paste = $('#paste');
    
    var history = $('#history');
    
    var isHistory = false;
    
    var copyEvent = $.Event('copy');
    var pastEvent = $.Event('paste');
    var historyEvent = $.Event('history');
   
    
    var copyOnSuccess = function () {
        copy.text('Copied');
        
        setTimeout(function (){
            copy.text('Copy');
        },1000);
    };
    
    var copyOnError = function () {
        copy.text('Copied');
        
        setTimeout(function (){
            copy.text('Copy');
        },1000);
    };
    
    var pasteOnSuccess = function (text) {
        // do validation later
        if(!updateExpression(text)){
            paste.text('Error');
        
            setTimeout(function (){
                paste.text('Paste');
            },1000);
        }
    };
    
    var pasteOnError = function () {
        paste.text('Error');
        
        setTimeout(function (){
            paste.text('Paste');
        },1000);
    };
    
    var updateExpression = function (expression) {
        expression = expression.replace(/ /g,'');
        if(!(/[^\+\-\/\*\^\%\d\(\)\u2200-\u22FF]/.test(expression))){
           
           for(var i=0; i<expression.length; i++){
                $('body').trigger('update',expression.charAt(i));
            }
           
        }else{
           return false;
        }
    };
    
    var populateHistoryData = function () {
        var history = window.historyQueue.get().reverse();
        
        //$('.historyItem').text('').show();
        
        for(var i = 0; i < history.length; i++){
            var hisItem = history[i];
            
            $('#expression'+i).text(hisItem.expression.toString().replace(/,/g ,'')).show();
            $('#result'+i).text(hisItem.result).show();
        }
        
        /*for(var i = 0; i < 10; i++){
            var hisItem = history[0];
            
            $('#item'+i).text(hisItem.expression).show();
        }*/
    };
    
    copy.on('touchstart', function (){
        cordova.plugins.clipboard.copy($('#mainDisplay').text(),copyOnSuccess,copyOnError); // dont directly use main display here
        
    });
    
    paste.on('touchstart', function (){
        cordova.plugins.clipboard.paste(pasteOnSuccess,pasteOnError);
    });
    
    history.on('touchstart', function (){
        if(!isHistory){
            populateHistoryData();
            history.text('Keypad');
        }else{
            history.text('History');
        }
        
        isHistory = !isHistory;
        
        $('body').trigger('historynumericpad');
    });
    
    $('body').on('addToHistory' , function (event, expression, result){
        var obj = {};
        obj.expression = expression;
        obj.result = result;
        
        window.historyQueue.push(obj);
    });
    
    $('.historyItem').on('touchstart',function (event){
        var expressionElem = $(event.currentTarget).find('.expression');
        
        $('body').trigger('clear');// put it in jquery deferred;
        if(!updateExpression(expressionElem.text())){
            $('body').trigger('display','Error'); 
        }
    });
    
    $('body').on('utilitiesReady' , function (){
        window.historyQueue.load();
    });
    
})();

