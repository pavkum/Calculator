var display = (function (){
    var mainDisplay = $('#mainDisplay');
    
    var scrollLeft = $('#scrollLeft');
    var scrollRight = $('#scrollRight');
    
    var message = $('#message');
    var menu = $('#menu');
    
    var messageTimer = undefined;
    var displayScrollHeight = 0;
    
    var prependPos = mainDisplay;    
    
    var addToDisplay = function (value) {
        
        scrollToCursor();
        
        if(prependPos === mainDisplay){
            prependPos.html('');
            prependPos.prepend("<div class='displayCell cursor'>"+value+"</div>");
            unitWidth = 0;
            prependPos = mainDisplay.children().eq(0);
            
        }else{
            prependPos.removeClass('cursor');
            prependPos.before("<div class='displayCell cursor'>"+value+"</div>");
            prependPos = prependPos.prev();
        }
        
        prependPos.addClass('visible');
    
        if(isOverflow()){ // when new elem is added
            mainDisplay.find('.visible').last().removeClass('visible');
        }
          
        updateScrollInfo();
    };
    
    var scrollToCursor = function () {
        if(!prependPos.is(':visible')){
            
            var index = mainDisplay.find('.cursor').index();
            
            if(index < mainDisplay.find('.visible').first().index()){
                
                var diff = mainDisplay.find('.visible').first().index();
                
                for(var i=0; i< diff; i++){
                    displayScrollLeft();
                }
            }else{
                
                var diff = mainDisplay.find('.visible').last().index();
                
                for(var i=0; i< diff; i++){
                    displayScrollRight();
                }
            }
        }
    };
    
    var displayScrollLeft = function () {
        var prev = mainDisplay.find('.visible').first().prev();
        if(prev.length > 0){
            prev.addClass('visible');
            mainDisplay.find('.visible').last().removeClass('visible');       
        }   
    };
    
    var displayScrollRight = function () {
        var next = mainDisplay.find('.visible').last().next();
        if(next.length > 0){
            next.addClass('visible');     
            mainDisplay.find('.visible').first().removeClass('visible');
        }
    };
    
    var isOverflow = function () {
        var currScrollHeight = mainDisplay.prop('scrollHeight');
        
        if(currScrollHeight > displayScrollHeight)
            return true;
        else
            return false;
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
        displayScrollHeight = mainDisplay.prop('scrollHeight');
        
        clear();
        
        
        $('body').on('display',function(e,value){
            addToDisplay(value);
            // display type is advaced. Will implement later
        });
        
        $('body').on('result',function (event,value){
            addToDisplay(value);
            prependPos = mainDisplay;
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
            
            if(touchHandler.curX && touchHandler.prevX){
            
                if(touchHandler.curX >= touchHandler.prevX){//scroll right
                    displayScrollRight();
                }else{
                    displayScrollLeft();
                }
                updateScrollInfo();
            }
            
            event.preventDefault();
        });
        
        $('body').on('screen',function(event){
            var d = $.Deferred();
            
            var data = {};
            
            data.message = mainDisplay.text().split('').reverse();
            d.resolve(data);
            return d;
        });
        
    });
    
})();
