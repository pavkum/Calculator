var display = (function (){
    var mainDisplay = $('#mainDisplay');
    
    var scrollLeft = $('#scrollLeft');
    var scrollRight = $('#scrollRight');
    
    var message = $('#message');
    var menu = $('#menu');
    
    var messageTimer = undefined;
    
    var displayScrollWidth = 0;
    
    var show = function (data) {
        mainDisplay.text(data);  
        updateScrollInfo();
    };
    
    var touchHandler = {};
    touchHandler.curX = undefined;
    touchHandler.prevX = undefined;
    touchHandler.timer = undefined;
    
    var updateScrollInfo = function () {
        var curWidth = mainDisplay.prop('scrollWidth');
                
        if(curWidth > displayScrollWidth){ // always show current entered element
            mainDisplay.scrollLeft(curWidth - displayScrollWidth);
        }
        
        updateScrollBar(mainDisplay.scrollLeft() , curWidth - displayScrollWidth);
    };
    
    var updateScrollBar = function (pscrollLeft, pscrollPos) {
        if(pscrollLeft > 0 && pscrollPos > 0 && pscrollPos == pscrollLeft){ // extreme right
            scrollLeft.hide();
            scrollRight.show();
        }else if(pscrollLeft === 0){ // extreme left
            // 2 cases - no scroll bar and extreme right scrollbar
            if(pscrollPos > 0){ // scrolled to extreme left but lengthy data
                scrollRight.hide();
                scrollLeft.show();
            }else{ // no scroll
                scrollLeft.hide();
                scrollRight.hide();
            }
        }else{// lengthy data and some where in between, make both scrolls visible
            scrollLeft.show();
            scrollRight.show();
        }
    };
    
    var clear = function () {
        show(0);   
    };
    
    $('body').on('displayReady' , function (){
        var displayEvent = $.Event('display');
        displayScrollWidth = mainDisplay.prop('scrollWidth');
        
        clear();
        
        
        $('body').on('display',function(e,displayType,data){
            show(data);
            // display type is advaced. Will implement later
        });
        
        mainDisplay.on('scroll',function (event){
            
            var curWidth = mainDisplay.prop('scrollWidth');
            
            updateScrollBar(mainDisplay.scrollLeft() , curWidth - displayScrollWidth );
        });
        
        $('body').on('auxilary', function (event, type, data){
            if(type === 'message'){
                
                if(messageTimer){
                    clearTimeout(messageTimer);
                    messageTimer = undefined;
                }
                
                message.text(data);
                
                messageTimer = setTimeout(function(){
                    message.text('');
                },1000);
                
            }else if(type === 'menu'){
                menu.text(data);
            }else {
                // no implementation   
            }
        });
        
        mainDisplay.bind('touchmove',function(event){
            var x = event.originalEvent.changedTouches[0].clientX;
            touchHandler.prevX = touchHandler.curX;
            touchHandler.curX = x;
            
            if(touchHandler.timer){
                clearTimeout(touchHandler.timer);
                touchHandler.timer = undefined;
            }
            
            touchHandler.timer = setTimeout(function(){
                touchHandler.curX = undefined;
                touchHandler.prevX = undefined;
                touchHandler.timer = undefined;
            },1000);
            
            if(touchHandler.curX && touchHandler.prevX){
                if(touchHandler.curX > touchHandler.prevX){
                       mainDisplay.scrollLeft(touchHandler.curX - touchHandler.prevX);
                }else{
                    mainDisplay.scrollLeft(-touchHandler.curX + touchHandler.prevX)
                }
                
                var curWidth = mainDisplay.prop('scrollWidth');
                updateScrollBar(mainDisplay.scrollLeft() , curWidth - displayScrollWidth );
            }
            
            event.preventDefault();
            //$('body').trigger('auxilary',['message',x]);
        });
        
    });
    
})();
