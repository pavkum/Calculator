var mathFunctions = function(representation, data) {
    //this.totalNumberOfArguments = 1; // 2 only for ^
    this.textualRepresentation = representation;
    this.data =  data;
};

mathFunctions.prototype.getExpression = function () {
    return this.textualRepresentation + '(' + this.data + ')';
};

//var square = function(data)