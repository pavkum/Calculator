var stack = {
    
    pos : 0,
    elem : [],
    
    push : function (o) {
        this.elem[this.pos++] = o;
    },
    
    pop : function () {
        this.elem[this.pos] = undefined;
        return this.elem[--this.pos];
    },
    
    size : function () {
        return this.pos;
    },
    
    reset : function () {
        while(this.pos !== 0){
            this.pop();
        }
    }
};

var historyQueue = {
    
    history : [],
    
    push : function (o) {
        if(history.length === 10){
            this.history.slice(1);
        }else{
            this.history.push(o);
        }

        window.localStorage.setItem('history',JSON.stringify(this.history));
    },
    
    load : function () {
        this.history = window.localStorage.getItem('history');
        if($.isEmptyObject(this.history))
            this.history = '[]';
        
        this.history = JSON.parse(this.history);
        
    },  
    
    get : function () {
        return this.history;   
    }
    
};

var constants = {
    keyListenEventType : 'touchstart',
    moveEventType : 'touchmove',
};