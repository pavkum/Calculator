var display = (function (){
    var mainDisplay = $('#mainDisplay');
    
    var scrollLeft = $('#scrollLeft');
    var scrollRight = $('#scrollRight');
    
    var message = $('#message');
    var menu = $('#menu');
    
    var messageTimer = undefined;
    
    var displayScrollWidth = 0;
    var displayScrollHeight = 0;
    
    var unitWidth = 0;
    
    var prependPos = mainDisplay;    
    
    var addToDisplay = function (value) {
        
        if(!prependPos.is(':visible')){
            
            var index = mainDisplay.find('.cursor').index();
            
            if(index < mainDisplay.find('.visible').first().index()){
                
                var diff = mainDisplay.find('.visible').first().index();
                
                for(var i=0; i< diff; i++){
                    var prev = mainDisplay.find('.visible').first().prev();
                    if(prev.length > 0){
                        prev.addClass('visible');
                        mainDisplay.find('.visible').last().removeClass('visible');       
                    }   
                }
                // scroll left      
            }else{
                
                var diff = mainDisplay.find('.visible').last().index();
                
                for(var i=0; i< diff; i++){
                    var next = mainDisplay.find('.visible').last().next();
                    if(next.length > 0){
                        next.addClass('visible');     
                        mainDisplay.find('.visible').first().removeClass('visible');
                    }
                }
                // scroll right
            }
        }
        
        if(prependPos === mainDisplay){
            prependPos.html('');
            prependPos.prepend("<div class='displayCell cursor'>"+value+"</div>");
            unitWidth = 0;
            prependPos = mainDisplay.children().eq(0);
            /*unitWidth = prependPos.outerWidth();
            
            if(mainDisplay.width() % unitWidth != 0){
                var diff = mainDisplay.width() % unitWidth;
                mainDisplay.width(mainDisplay.width() - diff + 1);
                
                //diff = diff - 2; // adjustment
                
                //if(diff > 0){
                
                
                scrollLeft.width(scrollLeft.width + diff/2);
                scrollRight.width(scrollRight.width + diff/2);
                mainDisplay.css('margin-left',diff/2);
                displayScrollWidth = mainDisplay.width();
                    
                //}
            }*/
            
        }else{
            prependPos.removeClass('cursor');
            prependPos.before("<div class='displayCell cursor'>"+value+"</div>");
            prependPos = prependPos.prev();
        }
        
        prependPos.addClass('visible');
    
        unitWidth += prependPos.outerWidth();
    
        if(isOverflow()){ // when new elem is added
            mainDisplay.find('.visible').last().removeClass('visible');
        }
        
              
        updateScrollInfo();
    };
    
    var isOverflow = function () {
        var currScrollHeight = mainDisplay.prop('scrollHeight');
        
        if(currScrollHeight > displayScrollHeight)
            return true;
        else
            return false;
    };
    
    
    var updateOldScrollInfo = function () {
        var curWidth = mainDisplay.prop('scrollWidth');
                
        if(curWidth > displayScrollWidth){ // always show current entered element
            mainDisplay.scrollLeft(curWidth - displayScrollWidth);
        }
        
        updateScrollBar(mainDisplay.scrollLeft() , curWidth - displayScrollWidth);
    };
    
    
    var show = function (data) {
        //mainDisplay.text(data); 
        mainDisplay.focus();
        var cursorPos = mainDisplay.prop('selectionStart');
        var v = mainDisplay.val();
        var textBefore = v.substring(0,  cursorPos );
        var  textAfter  = v.substring( cursorPos, v.length );
        mainDisplay.val( textBefore+ data +textAfter );
        mainDisplay.setCursorPosition(cursorPos);
        //mainDisplay.val(mainDisplay.val() + data);
        //updateScrollInfo();
    };
    
    var touchHandler = {};
    touchHandler.curX = undefined;
    touchHandler.prevX = undefined;
    touchHandler.timer = undefined;
    
    var updateScrollInfo = function () {
        if(mainDisplay.find('.visible').last().next().length > 0){
            scrollLeft.css('visibility','visible'); 
        }else{
            scrollLeft.css('visibility','hidden'); 
        }
        
        if(mainDisplay.find('.visible').first().prev().length > 0){
            scrollRight.css('visibility','visible'); 
        }else{
            scrollRight.css('visibility','hidden'); 
        }
        
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
        mainDisplay.html('<div class="displayCell visible">&nbsp;</div>');
        prependPos = mainDisplay;
        
        updateScrollInfo();
    };
    
    var clearRecent = function () {
        if(prependPos && prependPos.next().length != 0){
            var elem = prependPos;
            prependPos = prependPos.next();
            
            if(prependPos.length == 0){
                prependPos = mainDisplay.children().eq(0);
            }
            prependPos.addClass('cursor');
            
            elem.remove();
            
            if(mainDisplay.children().length === 0){
                prependPos = mainDisplay;   
            }
            mainDisplay.find('.visible').last().next().addClass('visible');
        }
    };
    
    $('body').on('displayReady' , function (){
        var displayEvent = $.Event('display');
        displayScrollWidth = mainDisplay.prop('scrollWidth');
        displayScrollHeight = mainDisplay.prop('scrollHeight');
        
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
        
        $('body').on('proxy',function (event,value){
            addToDisplay(value);
            //show(value);
        });
        
        $('body').on('clear',function(){
            clear();
        });
        
        $('body').on('clearRecent',function(){
            clearRecent(); 
        });
        
        mainDisplay.bind('click',function (event){
            if(prependPos != mainDisplay){
                prependPos.removeClass('cursor');
                prependPos = $(event.target);
                prependPos.addClass('cursor');    
            }
        });
        
        mainDisplay.bind('touchmove',function(event){
            var x = event.originalEvent.changedTouches[0].clientX;
            //var x = event.clientX;
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
            
            $('body').trigger('auxilary',['message',touchHandler.curX + ':' + touchHandler.prevX]);
            
            if(touchHandler.curX && touchHandler.prevX){
                var curWidth = mainDisplay.prop('scrollWidth');
                
                
                if(touchHandler.curX >= touchHandler.prevX){//scroll right
                    
                    var next = mainDisplay.find('.visible').last().next();
                    if(next.length > 0){
                        next.addClass('visible');     
                        mainDisplay.find('.visible').first().removeClass('visible');
                    }
                    
                    
                    
                    //mainDisplay.scrollLeft(mainDisplay.scrollLeft() - (curWidth / 2.5));
                       //mainDisplay.scrollLeft(touchHandler.curX - touchHandler.prevX);
                }else{
                    
                    var prev = mainDisplay.find('.visible').first().prev();
                        
                        if(prev.length > 0){
                            prev.addClass('visible');
                            mainDisplay.find('.visible').last().removeClass('visible');       
                        }
                    
                    //mainDisplay.scrollLeft(mainDisplay.scrollLeft() + (curWidth / 2.5));
                    //mainDisplay.scrollLeft(touchHandler.curX)
                }
                updateScrollInfo();
                //updateScrollBar(mainDisplay.scrollLeft() , curWidth - displayScrollWidth );
            }
            
            event.preventDefault();
            //$('body').trigger('auxilary',['message',x]);
        });
        
    });
    
})();
