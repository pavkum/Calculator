var mode = (function () {
    
    var elem = $('#keypad');
    
    var width = elem.width();
    var height = elem.height();
    
    var keyManager = new keyStore();
    
    var modeChangeEvent = $.Event('modechange');
    var keypadReadyEvent = $.Event('keypadReady');
    
    var applyCSS = function(rows,columns) {
        var keyHeight = height / rows;
        var keyWidth =  width / columns;
                        
        var cells = $('#keypad .cell');
            
        for(var i=0; i<cells.length; i++) {
                
            var cell = cells.eq(i);
                
            cell.height(keyHeight);
            cell.css('line-height',keyHeight + 'px');
                
            var cellWidth = cell.data('cell-width') ? cell.data('cell-width') : 1;
            cell.width((cellWidth * keyWidth));
                
            keyManager.getKey(cell);
            
        }
    };
    
    var load = function (templateName,rows,columns) {
        var templateURL = 'templates/' + templateName + '.html';
        
        $.ajax({
                
                url : templateURL,
                
                method : 'GET',
                
                success : function (data) {
                    elem.html(data);
                    applyCSS(rows,columns);
                },
                
                error : function () {
                    elem.html('Error occurred while loading keypad...!!!');
                }
            });  
    };
    
    $('body').on('modechange', function (event, mode){
        
        if(mode === 'basic'){ // future use to load keypad layout using templates
            load('basic',4,6);
        }
        
    });
    
    $('body').on('keypadReady',function () {
        width = elem.width();
        height = elem.height();
        
        $('body').trigger('modechange','basic')
        
    });

})();



/*
var mode = function (templateName,maxWidth,maxHeight,keyManager) {
    
    this.templateURL = 'templates/' + templateName + '.html';
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.keyManager = keyManager;
    
    this.applyCSS = function (elem) {
        
        var height = this.maxHeight / this.rows;
        var width = this.maxWidth / this.columns;
                
        var cells = $('#keypad .cell');
        
        for(var i=0; i<cells.length; i++) {
            
            var cell = cells.eq(i);
            
            cell.height(height);
            cell.css('line-height',height + 'px');
            
            var cellWidth = cell.data('cell-width') ? cell.data('cell-width') : 1;
            cell.width((cellWidth * width) );
            
            keyManager.getKey(cell);
        }
        
    };
};

mode.prototype.load = function (elem) {
    var that = this;
    $.ajax({
        
        url : this.templateURL,
        
        method : 'GET',
        
        success : function (data) {
            elem.html(data);
            that.applyCSS(data);
        },
        
        error : function () {
            elem.html('Error occurred while loading keypad...!!!');
        }
    
    });  
};

var basicMode = function(maxWidth,maxHeight,keyManager) {
    this.rows = 4;
    this.columns = 6;
    mode.call(this,'basic',maxWidth,maxHeight,keyManager);
};

basicMode.prototype = new mode();
basicMode.prototype.constructor = mode;


var ModeManager = function (maxWidth,maxHeight,elem) {
    
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.elem = elem;
    
    this.basic = undefined;
    this.keyManager = new keyManager();
};

ModeManager.prototype.loadMode = function (mode) {
    
    this.elem.html();
    
    if(mode === 'basic'){
        if(!this.basic){
            this.basic = new basicMode(this.maxWidth,this.maxHeight,this.keyManager);
        }
        
        this.basic.load(this.elem);
    }
};
*/
