var calculator = (function (){
    var width = $(window).width();
    var height = $(window).height();
    
    function initialize () {
        $('.container').width(width ); // padding of 2px
        $('.container').height(height);
        
        // reset height and width incase of padding
        width = $('.container').width();
        height = $('.container').height();
        
        
        if(width > height){ // assume as tablet
            $('.header').css('padding','3%');
        }
        
        
        // set Display Height
        
        $('#auxilary').height(height * 0.04);
        $('#auxilary').css('line-height',height * 0.04+'px');
        
        $('.mainDisplay>table').height(height * 0.05);
        //$('#mainDisplay').css('line-height',height * 0.05+'px');
        
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
        elem.width(width );
        elem.css('line-height',keypadHeight * 0.9 * 0.1 * 0.96 - 1 + 'px');
        elem.height(keypadHeight * 0.9 * 0.1 - 1);
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
    
    function orientationHandler(event) {
        if(event.orientation){
            width = $(window).width();
            height = $(window).height();
            if ($.event.special.orientationchange.orientation() == "portrait") {
                initialize();
                //initializeComponents();         //do something
            }
            else {
                initialize();
                //initializeComponents();         //do something
            }
        }
    }
    
    //$(document).ready(function (){
    $(document).on('deviceready' , function (){
        initialize();
        initializeComponents();
        
        $(window).bind('orientationchange', orientationHandler);
    }); 
    
})();
