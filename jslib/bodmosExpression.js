var SEPERATOR = '|';

var IDGen = {
    
    id : 0,
    
    getID : function () {
        return this.id++;
    },
};

var bodmosExpression = function () {
    this.expression = '';
    this.id = IDGen.getID();
    
    this.isExpression = function (data) {
        if(data.indexOf('@exp') != -1){
            return true;
        }else{
            return false;
        }
    };
    
    this.completionStatus = false;
};

bodmosExpression.prototype.update = function (data) {
    if(!this.completionStatus)
        this.expression += data + SEPERATOR;
};

bodmosExpression.prototype.clearRecent = function (lastChar) {
    // remove last seperator
    
    // as of now remove only last 2 characters
    
    // check lastchar length and add +1 to it as seperator, providing lastChar is taken care by expression Manager
    
    var length = this.expression.length;
    if(length > 1){
        this.expression = this.expression.substr(0, this.expression.length - (lastChar.length + 1));
    }else{
        // when we press clear recent when emptys
        this.expression = '';
    }
    /*
    
    
    if(length > 1){
        this.expression = this.expression.substr(0, length - 2);
    }*/
    
};

bodmosExpression.prototype.getLastExpression = function () {
    
    var lastID;
    
    try{
        lastID = this.expression.charAt(this.expression.length - 2);      
    }catch(Error){
        
    }
    
    return lastID;
    
};

bodmosExpression.prototype.clear = function () {
    
};

bodmosExpression.prototype.getID = function () {
    return this.id;
};

bodmosExpression.prototype.complete = function () {
    this.completionStatus = true;  
};

bodmosExpression.prototype.open = function () {
    this.completionStatus = false;
};

bodmosExpression.prototype.getExpression = function () {
    return this.expression.split(window.SEPERATOR);  
};