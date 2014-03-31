




var utilities = (function (){
    
    var copy = $('#copy');
    
    var paste = $('#paste');
    
    var history = $('#history');
    
    var isHistory = false;
    
    var copyEvent = $.Event('copy');
    var pastEvent = $.Event('paste');
    var historyEvent = $.Event('history');
   
    var toAuxilary = function(type,data){
        $('body').trigger('auxilary',[type,data]);
    };
    
    var copyOnSuccess = function () {
        toAuxilary('message','Copied');
    };
    
    var copyOnError = function () {
        toAuxilary('message','Copy Error');
    };
    
    var pasteOnSuccess = function (text) {
        // do validation later
        if(!updateExpression(text)){
            toAuxilary('message','Paste Error : Invalid char');
        }else{
            toAuxilary('message','Pasted');   
        }
    };
    
    var pasteOnError = function () {
        toAuxilary('message','Paste Error');
    };
    
    var updateExpression = function (expression) {
        expression = expression.replace(/ /g,'');
        if(!(/[^.\+\-\/\*\^\%\d\(\)\u2200-\u22FF]/.test(expression))){
           
           for(var i=0; i<expression.length; i++){
                $('body').trigger('update',expression.charAt(i));
            }
            return true;
        }else{
           return false;
        }
    };
    
    var populateHistoryData = function () {
        var history = window.historyQueue.get().slice();
        
        history = history.reverse();
        
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
    
    copy.on('click', function (){
        cordova.plugins.clipboard.copy($('div#mainDisplay').text(),copyOnSuccess,copyOnError); // dont directly use main display here
        
    });
    
    paste.on('click', function (){
        cordova.plugins.clipboard.paste(pasteOnSuccess,pasteOnError);
    });
    
    history.on('click', function (){
        if(!isHistory){
            populateHistoryData();
            history.text('Keypad');
            toAuxilary('menu','History');
        }else{
            history.text('History');
            toAuxilary('menu','');
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
        
        // Mode change is handled by controls in higher versions of calulator
        $('body').trigger('modechange','basic');
        
        //toAuxilary('menu','Calculator');
    });
    
})();

