var expressionManager = (function (){
    var expressionStore = [];
    var functionStore = [];
    
    var displayExpression = '';
        
    var active = new window.bodmosExpression();
    
    expressionStore[active.getID()] = active;
    
    var getExpressionFromId = function(id) {
        return '@exp#'+id;  
    };
    
    var evaluateExpression = function (expression) {
        var finalExpression = '';
        var functionStart = 0;
        
        for(var i=0; i<expression.length; i++){
            var exp = expression[i];
            
            switch(exp){
                    case exp.match(/[\d]/) && exp.match(/[\d]/)[0] : 
                        finalExpression += exp;
                        
                        if(expression[i+1] && expression[i+1].indexOf('@exp') != -1){
                            finalExpression += '*';
                        }
                    
                        break;
                    
                    case '.' :
                        finalExpression += exp;
                        break;
                    
                    case exp.match('[+*-/]') && exp.match('[+*-/]')[0] :
                        finalExpression += exp;
                        break;
                    case '%' :
                        finalExpression += '/100';
                        break;
                    case '^' :
                        
                        var tempExpression = '';
                        var j;
                                                                
                        for(j = finalExpression.length - 1; j >= 0; j--) {
                            if(!isNaN(finalExpression.charAt(j)) || finalExpression.charAt(j) === '.'){
                                tempExpression = finalExpression.charAt(j) + tempExpression;
                            }else{
                                break;
                            }
                        }
                        finalExpression = finalExpression.substr(0, j + 1);
                        finalExpression += 'Math.pow(' + tempExpression + ',' ;
                        functionStart += 1;
                        break;
                    
                    case exp.match(/\u221A/) && exp.match(/\u221A/)[0]:

                        var lastChar = finalExpression.charAt(finalExpression.length - 1);
                        if(lastChar && lastChar!= '' && !isNaN(lastChar)){ // operators or braces
                            finalExpression += '*';   
                        }
                        finalExpression += 'Math.sqrt(' ;
                        functionStart += 1;
                        
                        break;
                    case exp.match(/@exp#\d+/) && exp.match(/@exp#\d+/)[0]: // expression
                        finalExpression += evaluateExpression(expressionStore[exp.substr(5,exp.length)].getExpression());
                        
                        if(expression[i+1] && (expression[i+1].indexOf('@exp') != -1 || expression[i+1].match(/\d/))){
                            finalExpression += '*';
                        }
                    
                        break;
            }
        }
        
        for(var i=0; i<functionStart; i++){
            finalExpression += ')';
        }
                    
        
        finalExpression = eval(finalExpression);
        return finalExpression;
        
    };
    
    var prepareExpression = function (expression) {
        
        var finalExpression = '';
        var functionStart = false;
        for(var i=0; i<expression.length; i++) {
            var exp = expression[i];
            
            if(isNaN(exp)){
                
                if(exp.indexOf('@exp') != -1){
                    
                    // expression
                    finalExpression +=  prepareExpression() ;
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
                            
                            /*if((!isNaN(finalExpression.charAt(j)) || finalExpression.charAt(j) === ')' || finalExpression.charAt(j) === '(') && !isClosed){
                                if(finalExpression.charAt(j) === ')'){
                                    isClosed = false;
                                    openBraces = openBraces + 1;
                                }else if(finalExpression.charAt(j) === '('){
                                    openBraces = openBraces - 1;
                                    if(openBraces == 0){
                                        isClosed = true;   
                                    }
                                }*/
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
        
        console.log(finalExpression);
        finalExpression = eval(finalExpression);
        console.log(finalExpression);
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

    var clear = function () {
        window.stack.reset();
        expressionStore = [];
        
        displayExpression = '';
        active.complete();
        active = new window.bodmosExpression();
        
    };
    
    var postProcessExpression = function (expression){
        expression = expression + '';
        var newExpression = '';
        
        for(var i=0; i<expression.length; i++){
            var c = expression.charAt(i);
            
            if(c === '('){
                var lastChar = newExpression.charAt(newExpression.length - 1);
                
                if(!isNaN(lastChar) || lastChar === ')'){ // if number
                    if(i - 1 >= 0) 
                        newExpression += '*';
                }
            }else if(c === ')'){
                if(i + 1 < expression.length){
                    if(!isNaN(expression.charAt(i+1))) {
                        c = c + '*';   
                    }
                }
            }
            
            newExpression += c;
        }
        
        return newExpression;
    };
    
    var evaluate = function (his) {
        
        var val;
        try{
            
            //val = postProcessExpression(prepareExpression(active.getExpression()));
            val = evaluateExpression(active.getExpression());
            if(!val)
                throw 'Error';
            
            $('body').trigger('addToHistory',[his,val]);
            
        }catch(Error){
            val = 'Invalid Expression';
        }
        
        var promise = $.Deferred();
        
        promise.done($('body').trigger('clear'),$('body').trigger('result',[val + '']),clear());
        
        
    };
    
    $('body').on('expressionManagerReady', function (){
        
        $.Event('evaluate');
                        
        $('body').on('evaluate',function(){
            $('body').trigger('auxilary',['message','Evaluating']);
            
            var data = $('#mainDisplay').text().split('').reverse(); // as of now. Use deferred
            var his = '';
            for(var i=0; i<data.length; i++){
                his += data[i];
                update(data[i]);    
            }
            
            evaluate(his);            
            
            $('body').trigger('auxilary',['message','Result']);
        });
        
        
    });    

})();

