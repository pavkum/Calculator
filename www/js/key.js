var key = function (value) {
    this.value = value;
};

key.prototype.attachHandler = function (elem) {
    
    // key press event as well
    
    var that = this;
    $(elem).on('click',function () {
    //$(elem).click(function (){
        that.click();
    });
}

key.prototype.click = function () {
        $('body').trigger('update',this.value);  
};

var clearAll = function(expressionEvaluator) {
    // C key
    key.call(this,'',expressionEvaluator);
};

clearAll.prototype = new key();
clearAll.prototype.constructor = key;

clearAll.prototype.click = function () {
        $('body').trigger('clear');  
};

var clearRecent = function(expressionEvaluator) {
    // CE key
    key.call(this,'',expressionEvaluator);
};

clearRecent.prototype = new key();
clearRecent.prototype.constructor = key;

clearRecent.prototype.click = function () {
    $('body').trigger('clearRecent');  
};


var point = function(expressionEvaluator) {
    key.call(this,'.' , expressionEvaluator);  
};


point.prototype = new key();
point.prototype.constructor = key;


point.prototype.click = function () {
    var val = window.value;
    
    if(val){
        if(val.indexOf(this.value) == -1)
            val = val + '' + this.value;
    }else{
        val = '' + this.value;
    }
    
    this.expressionEvaluator.toMainDisplay(val);
    window.value = this.expressionEvaluator.getMainDisplay();
};


var equals = function (expressionEvaluator) {
    
    key.call(this,'',expressionEvaluator);
};

equals.prototype = new key();
equals.prototype.constructor = key;

equals.prototype.click = function () {
    $('body').trigger('evaluate',this.expressionEvaluator);  
};


var keyManager = function (expressionEvaluator) {
    this.expressionEvaluator = expressionEvaluator;
    this.keyStore = [];
    
    this.keyStore['point'] = new point(this.expressionEvaluator);
    this.keyStore['equals'] = new equals(this.expressionEvaluator);
    this.keyStore['clearRecent'] = new clearRecent(this.expressionEvaluator);
    this.keyStore['clearAll'] = new clearAll(this.expressionEvaluator);
    
};

keyManager.prototype.getKey = function (elem) {
    
    var type = elem.data('type');
    var keyValue = elem.data('key');
    
    if(type === 'number' || type === 'operation'){
        var numberKey = new key(keyValue,this.expressionEvaluator);
        numberKey.attachHandler(elem);
        return numberKey;
    }else{
        var k = this.keyStore[keyValue];
        if(k){
            k.attachHandler(elem);
            return k;    
        }
        
    }
};

