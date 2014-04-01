var expressionManager = (function (){
    var expressionStore = [];
    var functionStore = [];
    
    var displayExpression = '';
    
    var show = function (displayType, value) {
        $('body').trigger('display',[displayType,value]);
    };
    
    var active = new window.bodmosExpression();
    
    expressionStore[active.getID()] = active;
    
    var getExpressionFromId = function(id) {
        return '@exp#'+id;  
    };
    
    var prepareExpression = function (expression) {
        
        var finalExpression = '';
        var functionStart = false;
        for(var i=0; i<expression.length; i++) {
            var exp = expression[i];
            
            if(isNaN(exp)){
                
                if(exp.indexOf('@exp') != -1){
                    
                    // expression
                    finalExpression += '(' + prepareExpression(expressionStore[exp.substr(5,exp.length)].getExpression()) + ')';
                }else if(exp.match('[+*-/]')){ // operators
                    
                    if(functionStart)
                        finalExpression += ')';
                        
                    finalExpression += exp;    
                }else{
                    // functions - as of now Manage here
                    
                    if(exp === '%'){
                        finalExpression += '/100';
                    }else if(exp === '^'){ // power
                        var tempExpression = '';
                        var j;
                        for(j = finalExpression.length - 1; j >= 0; j--) {
                            if(!isNaN(finalExpression.charAt(j))){
                                tempExpression = finalExpression.charAt(j) + tempExpression;
                            }else{
                                break;
                            }
                        }
                        
                        finalExpression = finalExpression.substr(0, j + 1);
                        
                        finalExpression += 'Math.pow(' + tempExpression + ',' ;
                        
                        functionStart = true;
                    } else { // root
                        
                        var lastChar = finalExpression.charAt(finalExpression.length - 1);
                        
                        if(!isNaN(lastChar)){ // operators or braces
                            finalExpression += '*';   
                        }
                        finalExpression += 'Math.sqrt(' ;
                        
                        functionStart = true;
                    }
                    
                    
                }
                
            }else{
                finalExpression += exp;
            }
        }
        
        if(functionStart)
            finalExpression += ')';
        
        
        return finalExpression;
    };
    
    var update = function (value) {
    
        displayExpression += value;
        
        if(value === '('){
            // open new expression
            
            var lastActive = active;
            
            window.stack.push(lastActive);
            
            active = new window.bodmosExpression();
            expressionStore[active.getID()] = active;
            
            lastActive.update(getExpressionFromId(active.getID()));
            
        }else if(value === ')'){
            if(window.stack.size() > 0) {
                active.complete();
                active = window.stack.pop();
            }
        }else{
            active.update(value);
        }
        
        //show('main',displayExpression);
    };

    var clearRecent = function () {
        var length = displayExpression.length;
        var lastChar = displayExpression.charAt(length - 1);
        
        displayExpression = displayExpression.substr(0,length - 1);
        
        if(lastChar === ')'){
            var previousExpression = active.getLastExpression();
            
            if(previousExpression) {
                previousExpression = expressionStore[previousExpression];
                
                window.stack.push(active);
                previousExpression.open();
                active = previousExpression;
            }
            
        }else if(lastChar === '('){
            
            var lastExpression = getExpressionFromId(active.getID()) ;
            
            active.clear();
            
            active = window.stack.pop();
            
            active.clearRecent(lastExpression);
            
        }else{
            active.clearRecent(lastChar);    
        }
        //this.active.clearRecent(lastChar);
        if(length - 1 === 0 || length === 0){
            show('main',0);
        }else{
            show('main',displayExpression);    
        }
        
    };
    
    var clear = function () {
        window.stack.reset();
        expressionStore = [];
        
        displayExpression = '';
        active.complete();
        active = new window.bodmosExpression();
        
    };
    
    var postProcessExpression = function (expression){
        var newExpression = '';
        
        for(var i=0; i<expression.length; i++){
            var c = expression.charAt(i);
            
            if(c === '('){
                var lastChar = newExpression.charAt(newExpression.length - 1);
                
                if(!isNaN(lastChar)){ // if number
                       newExpression += '*';
                }
            }
            
            newExpression += c;
        }
        
        return newExpression;
    };
    
    var evaluate = function () {
        
        var val;
        try{
            
            
            
            val = eval(postProcessExpression(prepareExpression(active.getExpression())));
            
            if(!val)
                throw 'Error';
            
            $('body').trigger('addToHistory',[active.getExpression(),val]);
            
        }catch(Error){
            val = 'Error';
        }
        
        var promise = $.Deferred();
        
        promise.done($('body').trigger('clear'),$('body').trigger('result',[val + '']),clear());
        
        
    };
    
    $('body').on('expressionManagerReady', function (){
        
        $.Event('evaluate');
                        
        $('body').on('evaluate',function(){
            $('body').trigger('auxilary',['message','Evaluating']);
            
            var data = $('#mainDisplay').text().split('').reverse(); // as of now. Use deferred
            
            for(var i=0; i<data.length; i++){
                update(data[i]);    
            }
            
            evaluate();            
            
            $('body').trigger('auxilary',['message','Result']);
        });
        
        
    });    

})();

