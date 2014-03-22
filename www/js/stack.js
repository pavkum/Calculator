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