var calculator = (function (){
    var width = $(window).width();
    var height = $(window).height();
    
    function initialize () {
        $('.container').width(width ); // padding of 2px
        $('.container').height(height);
        
        // reset height and width incase of padding
        width = $('.container').width();
        height = $('.container').height();
        
        // set Display Height
        
        $('#auxilary').height(height * 0.03);
        $('#auxilary').css('line-height',height * 0.03+'px');
        
        $('#mainDisplay').height(height * 0.05);
        $('#mainDisplay').css('line-height',height * 0.05+'px');
        
        $('#scroll').height(height * 0.03);
        $('#scroll').css('line-height',height * 0.03+'px');
        
        // keypad container Height
        var keypadHeight = (height - ( $('.header').outerHeight() + $('.display').outerHeight() 
                           + $('.keypad').outerHeight())); // display total height + height of padding
    
        $('.keypad').width(width);
        $('.keypad').height(keypadHeight); // 1% top bottom padding
        
        // controls Height
        $('.controls').height(keypadHeight * 0.10);
        var cells = $('.controls .cell');
            
        for(var i=0; i<cells.length; i++) {
            var cell = cells.eq(i);
            cell.height(keypadHeight * 0.10);
            
            cell.css('line-height',(keypadHeight * 0.1) + 'px');
        }
        
        // numeric keypad height
        var elem = $('#keypad');
    
        elem.width(width);
        elem.height(keypadHeight * 0.9);
        
        // History Height
        elem = $('#calculationHistory');
        
        elem.width(width);
        elem.height(keypadHeight * 0.9);
        
        // History Item height
        
        elem = $('.historyItem');
        elem.width((width * 0.5) - 1);
        elem.css('line-height',keypadHeight * 0.9 * 0.2 + 'px');
        elem.height(keypadHeight * 0.9 * 0.2);
    }
    
    function toggleHistoryAndNumericKeypad () {
        $('#keypad').toggle();
        $('#calculationHistory').toggle();
    }
    
    
    function initializeComponents () {
        
        $('body').on('historynumericpad',toggleHistoryAndNumericKeypad);
        
        $('body').trigger('keypadReady');
        $('body').trigger('displayReady');
        $('body').trigger('expressionManagerReady');
        $('body').trigger('utilitiesReady');
    }
    
    $(document).ready(function (){
    //$(document).on('deviceready' , function (){
        initialize();
        initializeComponents();
    }); 
    
})();

/*


















var calculator = function () {
};

calculator.prototype.initialize = function() {
    
    var width = $(window).width();
    var height = $(window).height();

    $('.container').width(width ); // padding of 2px
    $('.container').height(height);
    
    width = $('.container').width();
    height = $('.container').height();
    
    $('#mainDisplay').height(height * 0.15);
    $('#mainDisplay').css('line-height',height * 0.15+'px');
    
    
    
    this.loadMode(width,height);
    
};


calculator.prototype.loadMode = function (width,height) {
    // by this time keypad wouldn't be loaded
    
    
    var keypadHeight = (height - ( $('.header').outerHeight() + $('.display').outerHeight() + $('.keypad').outerHeight())); // display total height + height of padding
    
    $('.keypad').height(keypadHeight); // 1% top bottom padding
        
    $('.controls').height(keypadHeight * 0.10);
    var cells = $('.controls .cell');
        
    for(var i=0; i<cells.length; i++) {
        var cell = cells.eq(i);
        cell.height(keypadHeight * 0.10);
        
        cell.css('line-height',(keypadHeight * 0.1) + 'px');
        
    }
    
    var elem = $('#keypad');
    
    elem.width(width);
    elem.height(keypadHeight * 0.9);
    $('body').trigger('keypadReady');
    $('body').trigger('modechange',['basic']);
    
    
    /*if(!this.modeManager){
        this.modeManager = new ModeManager(width,(keypadHeight*0.90) ,elem);
    }else{
        this.modeManager.resetSize(width,keypadHeight * 0.85);   
    }
    
    this.modeManager.loadMode('basic');
    
    
};

$(document).ready(function () {
    //if(!window.initialize)
        //initialize();
});
document.addEventListener('deviceready', function () {
    //if(!window.initialize)
        initialize();
});

function initialize() {
    
    var calc = new calculator();
    calc.initialize();  
    
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
    
    
    var disp = new display();

    var displayEvent = $.Event('display');
    
    $('body').on('display',function(e,displayType,data){
        if(displayType === 'main'){
            disp.toMainDisplay(data);
        }else{
            disp.toMainDisplay(data);
        }
    }); 
    
    window.initialize = true;
       
}


/*
$(document).ready(function(){
    var calc = new calculator();

    calc.initialize();  
    
    $(window).resize(function(){
        
        calc.initialize();    
    });
});

*/


