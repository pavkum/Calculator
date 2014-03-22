var expressionManager = function () {
  
    this.expressionStore = [];
    this.functionStore = [];
    
    this.displayExpression = '';
    
    this.show = function (displayType, value) {
        $('body').trigger('display',[displayType,value]);
    };
    
    this.active = new window.bodmosExpression();
    
    this.expressionStore[this.active.getID()] = this.active;
    
    this.getExpressionFromId = function(id) {
        return '@exp#'+id;  
    };
    
    this.prepareExpression = function (expression) {
        var finalExpression = '';
        var functionStart = false;
        for(var i=0; i<expression.length; i++) {
            var exp = expression[i];
            if(isNaN(exp)){
                
                if(exp.indexOf('@exp') != -1){
                    // expression
                    finalExpression += '(' + this.prepareExpression(this.expressionStore[exp.substr(5,exp.length)].getExpression()) + ')';
                }else if(exp.match('[+*-/]')){ // operators
                    
                    if(functionStart)
                        finalExpression += ')';
                        
                    finalExpression += exp;    
                }else{
                    // functions - as of now Manage here
                    if(exp === '^'){ // power
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
                    } else { // root
                        finalExpression += 'Math.sqrt(' ;
                    }
                    
                    functionStart = true;
                }
                
            }else{
                finalExpression += exp;
            }
        }
        
        if(functionStart)
            finalExpression += ')';
        
        console.log('final : '+finalExpression);
        return finalExpression;
    };
};

expressionManager.prototype.update = function (value) {
    
    this.displayExpression += value;
    
    if(value === '('){
        // open new expression
        
        var lastActive = this.active;
        
        window.stack.push(lastActive);
        
        this.active = new window.bodmosExpression();
        this.expressionStore[this.active.getID()] = this.active;
        
        lastActive.update(this.getExpressionFromId(this.active.getID()));
        
    }else if(value === ')'){
        if(window.stack.size() > 0) {
            this.active.complete();
            this.active = window.stack.pop();
        }
    }else{
        this.active.update(value);
    }
    
    this.show('main',this.displayExpression);
};

expressionManager.prototype.clearRecent = function () {
    var length = this.displayExpression.length;
    var lastChar = this.displayExpression.charAt(length - 1);
    
    this.displayExpression = this.displayExpression.substr(0,length - 1);
    
    if(lastChar === ')'){
        var previousExpression = this.active.getLastExpression();
        
        if(previousExpression) {
            previousExpression = this.expressionStore[previousExpression];
            
            window.stack.push(this.active);
            previousExpression.open();
            this.active = previousExpression;
        }
        
    }else if(lastChar === '('){
        
        var lastExpression = this.getExpressionFromId(this.active.getID()) ;
        
        this.active.clear();
        
        this.active = window.stack.pop();
        
        this.active.clearRecent(lastExpression);
        
    }else{
        this.active.clearRecent(lastChar);    
    }
    //this.active.clearRecent(lastChar);
    if(length - 1 === 0 || length === 0){
        this.show('main',0);
    }else{
        this.show('main',this.displayExpression);    
    }
    
};

expressionManager.prototype.clear = function () {
    window.stack.reset();
    this.expressionStore = [];
    
    this.displayExpression = '';
    this.active.complete();
    this.active = new window.bodmosExpression();
    
    this.show('main',0);
};

expressionManager.prototype.evaluate = function () {
    var val;
    try{
        val = eval(this.prepareExpression(this.active.getExpression()));
    }catch(Error){
        val = 'Error';
    }
    
    this.show('main',val);
};

/*$(document).ready(function (){
    var exp = new expressionManager();
    
    $.Event('evaluate');
    $.Event('update');
    $.Event('clear');
    $.Event('clearRecent');
    
    $('body').on('evaluate',function(){
        exp.evaluate(); 
    });
    
    $('body').on('update',function(e,val) {
        exp.update(val);
    });
    
    $('body').on('clear',function(){
        exp.clear();
    });
    
    $('body').on('clearRecent',function(){
        exp.clearRecent(); 
    });
});*/