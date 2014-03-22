var expression = function () {
    this.currentExpression = '';
    this.count = 0;
    this.expressionHolder = [];
    
    this.complexOperations = []; // check for ascii codes
    
    this.complexOperations['94'] = 'Math.pow(cur,new)';
    this.complexOperations['8730'] = 'Math.sqrt(new)';
    
    this.spanNewExpressionHolder = function () {
        this.currentExpression = '';
        this.expressionHolder[++this.count] = this.currentExpression;
    };
    
    this.isComplexOperation = function (data) {
        if(isNaN(data)){
            if(this.complexOperations[data.charCodeAt(0)]){
                return this.complexOperations[data.charCodeAt(0)];
            }
            return false;
        }else{
            return false;
        }
    };
    
    this.addToExpression = function (data) {
        var compExp = this.isComplexOperation(data);
        if(compExp){
            
            if(compExp.indexOf('cur') != -1){
                compExp = compExp.replace('cur','{' + this.currentExpression + '}'); // wrap current expression so that it will be easier while earasing
                compExp = compExp.replace('new','this.expressionHolder[' + (this.count+1) + ']');
                
                this.currentExpression = compExp;
                
            }else{
                compExp = compExp.replace('new','this.expressionHolder[' + (this.count+1) + ']');
                
                this.currentExpression = '{' + this.currentExpression + '}';

                this.currentExpression += compExp ;
                
            }
            console.log(this.currentExpression);
            this.expressionHolder[this.count] = this.currentExpression;
            this.spanNewExpressionHolder();
            
        }else{
            this.currentExpression += data;
            this.expressionHolder[this.count] = this.currentExpression;
            console.log(this.currentExpression);
        }
    };

    this.clearRecentlyUpdatedExpression = function (lastChar) {
        var compExp = this.isComplexOperation(lastChar);
        var length = this.currentExpression.length;
        // apparently length of zero signifies we need to set decrement count and clear in previous expression
        if(length === 0){
            this.expressionHolder[this.count--] = undefined;
            // all current expression if ends they end with a function, so there will be a closing bracket
            
            this.currentExpression = this.expressionHolder[this.count];
            
            var openingBracesPos = this.currentExpression.indexOf('{');
            var closingBracesPos = this.currentExpression.indexOf('}');
            
            this.currentExpression = this.currentExpression.substr(openingBracesPos,closingBracesPos);
            this.expressionHolder[this.count] = this.currentExpression;
            console.log(this.currentExpression);
            
        }else{
            this.currentExpression = this.currentExpression.substr(0,length - 1);
            this.expressionHolder[this.count] = this.currentExpression;
            console.log(this.currentExpression);
        }
    };
    
    

};

expression.prototype.update = function (data) {
    this.addToExpression(data);
    //console.log(this.currentExpression);
};

expression.prototype.clearRecent = function (lastChar) {
    this.clearRecentlyUpdatedExpression(lastChar);
};

expression.prototype.clear = function () {
    for(var i=this.count; i>=0; i--){
        this.expressionHolder[i] = undefined;
    }
    
    this.count = 0;
    this.currentExpression = '';
    
};

expression.prototype.getExpression = function () {
    var exp;
    for(var i=this.count; i>=0; i--){
        var expression = this.expressionHolder[i];
        expression = expression.replace('{','');
        expression = expression.replace('}','');
        
        if(i > 0) {
            var outerLoop = this.expressionHolder[i-1];
            outerLoop = outerLoop.replace('this.expressionHolder['+ i + ']',expression);
            this.expressionHolder[i-1] = outerLoop;
        }else{
            exp = this.expressionHolder[i];
        }
    }
    
    return exp;
};

expression.prototype.evaluate = function () {
    
    var result;
    
    for(var i=this.count; i>=0; i--){
        var expression = this.expressionHolder[i];
        expression = expression.replace('{','');
        expression = expression.replace('}','');
        try{
            result = eval(expression); 
            
            if(!isNaN(result)){
                if(isFinite(result)){
                    if(i > 0){
                        var outerLoop = this.expressionHolder[i-1];
                        outerLoop = outerLoop.replace('this.expressionHolder['+ i + ']',result);
                        this.expressionHolder[i-1] = outerLoop;
                    }else{
                        this.clear();
                        this.sendToDisplay('main',result);
                    }
                }else{
                    this.clear();
                    i = -1;
                    this.sendToDisplay('main',result);
                    // send message
                    break;
                }
            }
            
        }catch(error){
            this.clear();
            i = -1;
            this.sendToDisplay('main','Error');
            // send error message
            break;            
        }
    }
    
};

var bodmosExpression = function (operation) {
    
    this.stringExpression = undefined;
    this.children = [];
    this.expression = new expression();
    
    this.operation = operation; // future use. like Math.sin(). We apply sin operation to the value calculated inside brackets

};

bodmosExpression.prototype.update = function (data) {
    this.expression.update(data);
};

bodmosExpression.prototype.clearRecent = function (lastChar) {
    
    this.expression.clearRecent(lastChar);  
};

bodmosExpression.prototype.addChild = function(child) {
    var length = this.children.length;
    this.children[length] = child;
};

bodmosExpression.prototype.getLastChild = function () {
    var length = this.children.length;
    return this.children[length - 1];
};

bodmosExpression.prototype.removeLastChild = function () {
    var length = this.children.length;
    this.children.splice(length-1,1);
};

bodmosExpression.prototype.getExpression = function () {
    return this.stringExpression;  
};

bodmosExpression.prototype.complete = function () {
    
    this.stringExpression =  this.expression.getExpression() ;
    /*
    if(this.children.length === 0)
        return  this.expression.getExpression() ;
    else
        return '';
    */  
};

bodmosExpression.prototype.clear = function () {
    // children would be zero by the time it comes here
    
    var length = this.children.length;
    
    for(var i = length - 1; i >= 0; i--) {
        var child = this.children[i];
        child.clear();
        this.removeLastChild();
    }
    
    this.expression.clear();
    
    this.expression = undefined;
};

var expressionManager = function () {
    this.displayExpression = '';
    this.bodmosExpression = new bodmosExpression();
    
    this.stack = [];
    this.stackCount = 0;
    
    this.push = function (oper) {
        
        var child;
        
        if(oper === 'add') {
            child = new bodmosExpression();
            this.bodmosExpression.addChild(child);
        } else if(oper === 'clear'){
            child = this.bodmosExpression.getLastChild();            
        }
        
        this.stack[this.stackCount++] = this.bodmosExpression;
        this.bodmosExpression = child;
    };
    
    this.pop = function () {
        this.bodmosExpression = this.stack[--this.stackCount];        
    };
    
    this.sendToDisplay = function (displayType,data) {
        $('body').trigger('display',[displayType,data]);  
    };
};

expressionManager.prototype.update = function (data) {
    this.displayExpression += data;  
    
    //this.bodmosExpression.update(data);
    
    if(isNaN(data)){
        if(data === '('){
            //this.bodmosExpression.update(data);
            this.push('add');
        }else if(data === ')'){
            var expression = this.bodmosExpression.complete();
            this.pop();
            //this.bodmosExpression.update(expression);
            //this.bodmosExpression.update(data);
        }else{
            this.bodmosExpression.update(data);
        }
    }else{
        this.bodmosExpression.update(data);
    }
    
    
    this.sendToDisplay('main',this.displayExpression);
};

expressionManager.prototype.clearRecent = function () {
    if(this.displayExpression.length > 0){
        var length = this.displayExpression.length;
        var lastChar = this.displayExpression.charAt(length - 1);
        this.displayExpression = this.displayExpression.substr(0,length - 1) + '';
    
        

        if(lastChar === ')'){
            this.push('clear');
        }else if(lastChar === '('){
            this.bodmosExpression.clear();
            this.pop();
            this.bodmosExpression.removeLastChild();
        }else{
            this.bodmosExpression.clearRecent(lastChar);   
        }

        if((length - 1) === 0){
            this.sendToDisplay('main',0);
        }else{
            this.sendToDisplay('main',this.displayExpression);
        }
    }
};

expressionManager.prototype.clear = function () {
    this.bodmosExpression.clear();
    while(this.stockCount > 0){
        this.bodmosExpression.clear();    
    }
    
    this.bodmosExpression = new bodmosExpression();
    this.displayExpression = '';
    this.sendToDisplay('main',0);
};

expressionManager.prototype.evaluate = function () {
    var expression = this.bodmosExpression.complete();
    expression = expression.replace('{','');
    expression = expression.replace('}','');
    console.log(expression);
    
    var result ;
    
    try{
        result = eval(expression);
    }catch(Err){
        result = 'Error';
    }
    
    this.sendToDisplay('main',result);
};


$(document).ready(function(){
    var exp = new expressionManager();

    var evaluationEvent = $.Event('evaluate');
    var updateEvent = $.Event('update');
    var clearEvent = $.Event('clear');
    var clearRecentEvent = $.Event('clearRecent')
    
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
});

