var key = function (value) {
    this.value = value;
};

key.prototype.attachHandler = function (elem) {
    
    // key press event as well
    
    var that = this;
    $(elem).on('touchstart',function () {
    //$(elem).click(function (){
        that.click();
    });
}

key.prototype.click = function () {
        $('body').trigger('update',this.value);  
};

var clearAll = function() {
    // C key
    key.call(this,'');
};

clearAll.prototype = new key();
clearAll.prototype.constructor = key;

clearAll.prototype.click = function () {
        $('body').trigger('clear');  
};

var clearRecent = function() {
    // CE key
    key.call(this,'');
};

clearRecent.prototype = new key();
clearRecent.prototype.constructor = key;

clearRecent.prototype.click = function () {
    $('body').trigger('clearRecent');  
};


var equals = function () {
    
    key.call(this,'');
};

equals.prototype = new key();
equals.prototype.constructor = key;

equals.prototype.click = function () {
    $('body').trigger('evaluate');  
};


var keyStore = function () {
    
    this.keyStore = [];
    
    this.keyStore['equals'] = new equals();
    this.keyStore['clearRecent'] = new clearRecent();
    this.keyStore['clearAll'] = new clearAll();
    
};

keyStore.prototype.getKey = function (elem) {
    
    var type = elem.data('type');
    var keyValue = elem.data('key');
    
    if(type === 'number' || type === 'operation'){
        var numberKey = new key(keyValue);
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



