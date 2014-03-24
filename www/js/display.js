var display = (function (){
    var mainDisplay = $('#mainDisplay');
    
    var scrollLeft = $('#scrollLeft');
    var scrollRight = $('#scrollRight');
    
    var displayScrollWidth = 0;
    
    var show = function (data) {
        mainDisplay.text(data);  
        updateScroll();
    };
    
    var updateScroll = function () {
        var curWidth = mainDisplay.prop('scrollWidth');
        
        if(curWidth > displayScrollWidth){
            var scrollLeft = mainDisplay.scrollLeft();
            mainDisplay.scrollLeft(curWidth - displayScrollWidth);
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
            debugger;
        });
        
        
        
    });
    
})();

/*
var display = function () {
    this.mainDisplay = $('#mainDisplay');
    this.auxilaryDisplay = $('#auxilaryDisplay');
    
    this.clear();
};

display.prototype.toMainDisplay = function (data) {
    $(this.mainDisplay).text(data);
};

display.prototype.toAuxilaryDisplay = function (data){
    $(this.auxilaryDisplay).text(data);  
};

display.prototype.clear = function () {
    this.clearMainDisplay();
    this.clearAuxilaryDisplay();
};

display.prototype.getMainDisplay = function () {
    return $(this.mainDisplay).text();
};

display.prototype.clearMainDisplay = function () {
    this.toMainDisplay(0);
};

display.prototype.clearAuxilaryDisplay = function () {
    this.toAuxilaryDisplay('');
};



$(document).ready(function(){
    var disp = new display();

    var displayEvent = $.Event('display');
    
    $('body').on('display',function(e,displayType,data){
        if(displayType === 'main'){
            disp.toMainDisplay(data);
        }else{
            disp.toMainDisplay(data);
        }
    });    
    
    
    
});
*/

