var stack={pos:0,elem:[],push:function(e){this.elem[this.pos++]=e},pop:function(){return this.elem[this.pos]=void 0,this.elem[--this.pos]},size:function(){return this.pos},reset:function(){for(;0!==this.pos;)this.pop()}},historyQueue={history:[],push:function(e){10===history.length?this.history.slice(1):this.history.push(e),window.localStorage.setItem("history",JSON.stringify(this.history))},load:function(){this.history=window.localStorage.getItem("history"),$.isEmptyObject(this.history)&&(this.history="[]"),this.history=JSON.parse(this.history)},get:function(){return this.history}},constants={keyListenEventType:"touchstart",moveEventType:"touchmove"},utilities=function(){var e=$("#copy"),i=$("#paste"),t=$("#history"),n=!1,s=($.Event("copy"),$.Event("paste"),$.Event("history"),function(e,i){$("body").trigger("auxilary",[e,i])}),r=function(){s("message","Copied")},o=function(){s("message","Copy Error")},a=function(e){return e&&""!==e?void(p(e)?s("message","Pasted"):s("message","Invalid char")):void s("message","Empty")},l=function(){s("message","Paste Error")},p=function(e){if(e=e.replace(/ /g,""),/[^.\+\-\/\*\^\%\d\(\)\u2200-\u22FF]/.test(e))return!1;for(var i=0;i<e.length;i++)$("body").trigger("display",e.charAt(i));return!0},c=function(){var e=window.historyQueue.get().slice();e=e.reverse();for(var i=0;10>i;i++){var t=e[i];t&&t.expression?($("#expression"+i).text(t.expression.toString().replace(/,/g,"")).css("background","#1E8BC3").css("text-align","left").show(),$("#result"+i).text(t.result).show()):$("#expression"+i).text("No Data").css("background","#19B5FE").css("text-align","right").show()}};e.on(constants.keyListenEventType,function(){for(var e=$("#mainDisplay").text().split("").reverse(),i="",t=0;t<e.length;t++)i+=e[t];return i=i.trim(),""===i?void s("message","Empty"):void cordova.plugins.clipboard.copy(i,r,o)}),i.on(constants.keyListenEventType,function(){cordova.plugins.clipboard.paste(a,l)}),t.on(constants.keyListenEventType,function(){n?(t.text("History"),s("menu","")):(c(),t.text("Keypad"),s("menu","History")),n=!n,$("body").trigger("historynumericpad")}),$("body").on("addToHistory",function(e,i,t){var n={};n.expression=i,n.result=t,window.historyQueue.push(n)}),$(".historyItem").on(constants.keyListenEventType,function(e){var i=$(e.currentTarget).find(".expression");$("body").trigger("clear"),p(i.text())||$("body").trigger("display","Error")}),$("body").on("utilitiesReady",function(){window.historyQueue.load(),$("body").trigger("modechange","basic")})}(),display=function(){var e=$("#mainDisplay"),i=$("#scrollLeft"),t=$("#scrollRight"),n=$("#message"),s=$("#menu"),r=void 0,o=0,a=e,l=function(i){d(),a===e?(a.html(""),a.prepend("<div class='displayCell cursor'>"+i+"</div>"),unitWidth=0,a=e.children().eq(0)):(a.removeClass("cursor"),a.before("<div class='displayCell cursor'>"+i+"</div>"),a=a.prev()),a.addClass("visible"),p(),v()},p=function(){f()&&e.find(".visible").last().removeClass("visible"),f()&&p()},c=function(){f&&e.find(".visible").first().removeClass("visible"),f()&&c()},d=function(){if(!a.is(":visible")){var i=e.find(".cursor").index();if(i<e.find(".visible").first().index())for(var t=e.find(".visible").first().index(),n=0;t>n;n++)h();else for(var t=e.find(".visible").last().index(),n=0;t>n;n++)u()}},h=function(){var i=e.find(".visible").first().prev();i.length>0&&(i.addClass("visible"),p())},u=function(){var i=e.find(".visible").last().next();i.length>0&&(i.addClass("visible"),c())},f=function(){var i=e.prop("scrollHeight");return i>o?!0:!1},y={};y.curX=void 0,y.prevX=void 0,y.timer=void 0;var v=function(){e.find(".visible").last().next().length>0?i.css("visibility","visible"):i.css("visibility","hidden"),e.find(".visible").first().prev().length>0?t.css("visibility","visible"):t.css("visibility","hidden")},x=function(){e.html('<div class="displayCell visible">&nbsp;</div>'),a=e,v()},g=function(){if(d(),a!=e){var i=a.next();a.remove();var t=e.children().length;if(0===i.length&&0!=t)i=e.children().eq(0);else{if(0===t)return void x();var n=e.find(".visible").last().next();n.length>0&&n.addClass("visible")}i.addClass("cursor"),a=i,d(),v()}else x()};$("body").on("displayReady",function(){$.Event("display");o=e.prop("scrollHeight"),x(),$("body").on("display",function(e,i){l(i)}),$("body").on("result",function(i,t){for(var n=0;n<t.length;n++)l(t.charAt(n));("Infinity"==t||"Invalid Expression"==t)&&(a=e)}),$("body").on("auxilary",function(e,i,t){"message"===i?(r&&(clearTimeout(r),r=void 0),n.text(t),r=setTimeout(function(){n.text("")},1e3)):"menu"===i&&s.text(t)}),$("body").on("clear",function(){x()}),$("body").on("clearRecent",function(){g()}),e.bind(constants.keyListenEventType,function(i){a!=e&&(a.removeClass("cursor"),a=$(i.target),a.addClass("cursor"))}),e.bind(constants.moveEventType,function(e){var i=e.originalEvent.changedTouches[0].clientX;y.prevX=y.curX,y.curX=i,y.timer&&(clearTimeout(y.timer),y.timer=void 0),y.timer=setTimeout(function(){y.curX=void 0,y.prevX=void 0,y.timer=void 0},1e3),y.curX&&y.prevX&&(y.curX>=y.prevX?u():h(),v()),e.preventDefault()}),$("body").on("screen",function(){var i=$.Deferred(),t={};return t.message=e.text().split("").reverse(),i.resolve(t),i})})}(),key=function(e){this.value=e};key.prototype.attachHandler=function(e){var i=this;$(e).on(constants.keyListenEventType,function(){i.click()})},key.prototype.click=function(){$("body").trigger("display",this.value)};var clearAll=function(){key.call(this,"")};clearAll.prototype=new key,clearAll.prototype.constructor=key,clearAll.prototype.click=function(){$("body").trigger("clear")};var clearRecent=function(){key.call(this,"")};clearRecent.prototype=new key,clearRecent.prototype.constructor=key,clearRecent.prototype.click=function(){$("body").trigger("clearRecent")};var equals=function(){key.call(this,"")};equals.prototype=new key,equals.prototype.constructor=key,equals.prototype.click=function(){$("body").trigger("evaluate")};var keyStore=function(){this.keyStore=[],this.keyStore.equals=new equals,this.keyStore.clearRecent=new clearRecent,this.keyStore.clearAll=new clearAll};keyStore.prototype.getKey=function(e){var i=e.data("type"),t=e.data("key");if("number"===i||"operation"===i){var n=new key(t);return n.attachHandler(e),n}var s=this.keyStore[t];return s?(s.attachHandler(e),s):void 0};var mode=function(){var e=$("#keypad"),i=e.width(),t=e.height(),n=new keyStore,s=($.Event("modechange"),$.Event("keypadReady"),function(e,s){var r=t/e,o=i/s,e=$("#keypad .row");e.width(i),e.height(r),e.css("line-height",r+"px");for(var a=0;a<e.length;a++)for(var l=e.eq(a).children(),p=0;p<l.length;p++){var c=l.eq(p),d=c.data("cell-width")?c.data("cell-width"):1;c.width(d*o),n.getKey(c)}}),r=function(i,t,n){var r="templates/"+i+".html";$.ajax({url:r,method:"GET",success:function(i){e.html(i),s(t,n)},error:function(){e.html("Error occurred while loading keypad...!!!")}})};$("body").on("modechange",function(e,i){"basic"===i&&r("basic",4,6)}),$("body").on("keypadReady",function(){i=e.width(),t=e.height()})}(),SEPERATOR="|",IDGen={id:0,getID:function(){return this.id++}},bodmosExpression=function(){this.expression="",this.id=IDGen.getID(),this.isExpression=function(e){return-1!=e.indexOf("@exp")?!0:!1},this.completionStatus=!1};bodmosExpression.prototype.update=function(e){this.completionStatus||(this.expression+=e+SEPERATOR)},bodmosExpression.prototype.clearRecent=function(e){var i=this.expression.length;this.expression=i>1?this.expression.substr(0,this.expression.length-(e.length+1)):""},bodmosExpression.prototype.getLastExpression=function(){var e;try{e=this.expression.charAt(this.expression.length-2)}catch(i){}return e},bodmosExpression.prototype.clear=function(){},bodmosExpression.prototype.getID=function(){return this.id},bodmosExpression.prototype.complete=function(){this.completionStatus=!0},bodmosExpression.prototype.open=function(){this.completionStatus=!1},bodmosExpression.prototype.getExpression=function(){return this.expression.split(window.SEPERATOR)};var expressionManager=function(){var expressionStore=[],functionStore=[],displayExpression="",active=new window.bodmosExpression;expressionStore[active.getID()]=active;var getExpressionFromId=function(e){return"@exp#"+e},evaluateExpression=function(expression){for(var finalExpression="",functionStart=0,i=0;i<expression.length;i++){var exp=expression[i];switch(exp){case exp.match(/[\d]/)&&exp.match(/[\d]/)[0]:finalExpression+=exp,expression[i+1]&&-1!=expression[i+1].indexOf("@exp")&&(finalExpression+="*");break;case".":finalExpression+=exp;break;case exp.match("[+*-/]")&&exp.match("[+*-/]")[0]:finalExpression+=exp;break;case"%":finalExpression+="/100";break;case"^":var tempExpression="",j;for(j=finalExpression.length-1;j>=0&&(!isNaN(finalExpression.charAt(j))||"."===finalExpression.charAt(j));j--)tempExpression=finalExpression.charAt(j)+tempExpression;finalExpression=finalExpression.substr(0,j+1),finalExpression+="Math.pow("+tempExpression+",",functionStart+=1;break;case exp.match(/\u221A/)&&exp.match(/\u221A/)[0]:var lastChar=finalExpression.charAt(finalExpression.length-1);lastChar&&""!=lastChar&&!isNaN(lastChar)&&(finalExpression+="*"),finalExpression+="Math.sqrt(",functionStart+=1;break;case exp.match(/@exp#\d+/)&&exp.match(/@exp#\d+/)[0]:finalExpression+=evaluateExpression(expressionStore[exp.substr(5,exp.length)].getExpression()),expression[i+1]&&(-1!=expression[i+1].indexOf("@exp")||expression[i+1].match(/\d/))&&(finalExpression+="*")}}for(var i=0;functionStart>i;i++)finalExpression+=")";return finalExpression=eval(finalExpression)},prepareExpression=function(expression){for(var finalExpression="",functionStart=!1,i=0;i<expression.length;i++){var exp=expression[i];if(isNaN(exp))if(-1!=exp.indexOf("@exp"))finalExpression+=prepareExpression();else if(exp.match("[+*-/]"))functionStart&&(finalExpression+=")"),finalExpression+=exp;else if("%"===exp)finalExpression+="/100";else if("^"===exp){var tempExpression="",j;for(j=finalExpression.length-1;j>=0&&!isNaN(finalExpression.charAt(j));j--)tempExpression=finalExpression.charAt(j)+tempExpression;finalExpression=finalExpression.substr(0,j+1),finalExpression+="Math.pow("+tempExpression+",",functionStart=!0}else{var lastChar=finalExpression.charAt(finalExpression.length-1);isNaN(lastChar)||(finalExpression+="*"),finalExpression+="Math.sqrt(",functionStart=!0}else finalExpression+=exp}return functionStart&&(finalExpression+=")"),console.log(finalExpression),finalExpression=eval(finalExpression),console.log(finalExpression),finalExpression},update=function(e){if(displayExpression+=e,"("===e){var i=active;window.stack.push(i),active=new window.bodmosExpression,expressionStore[active.getID()]=active,i.update(getExpressionFromId(active.getID()))}else")"===e?window.stack.size()>0&&(active.complete(),active=window.stack.pop()):active.update(e)},clear=function(){window.stack.reset(),expressionStore=[],displayExpression="",active.complete(),active=new window.bodmosExpression},postProcessExpression=function(e){e+="";for(var i="",t=0;t<e.length;t++){var n=e.charAt(t);if("("===n){var s=i.charAt(i.length-1);isNaN(s)&&")"!==s||t-1>=0&&(i+="*")}else")"===n&&t+1<e.length&&(isNaN(e.charAt(t+1))||(n+="*"));i+=n}return i},evaluate=function(e){var i;try{if(i=evaluateExpression(active.getExpression()),!i)throw"Error";$("body").trigger("addToHistory",[e,i])}catch(t){i="Invalid Expression"}var n=$.Deferred();n.done($("body").trigger("clear"),$("body").trigger("result",[i+""]),clear())};$("body").on("expressionManagerReady",function(){$.Event("evaluate"),$("body").on("evaluate",function(){$("body").trigger("auxilary",["message","Evaluating"]);for(var e=$("#mainDisplay").text().split("").reverse(),i="",t=0;t<e.length;t++)i+=e[t],update(e[t]);evaluate(i),$("body").trigger("auxilary",["message","Result"])})})}(),calculator=function(){function e(){$(".container").width(s),$(".container").height(r),s=$(".container").width(),r=$(".container").height(),s>r&&$(".header").css("padding","3%"),$("#auxilary").height(.04*r),$("#auxilary").css("line-height",.04*r+"px"),$(".mainDisplay>table").height(.05*r);var e=r-($(".header").outerHeight()+$(".display").outerHeight()+$(".keypad").outerHeight());$(".keypad").width(s),$(".keypad").height(e),$(".controls").height(.1*e);for(var i=$(".controls .cell"),t=0;t<i.length;t++){var n=i.eq(t);n.height(.1*e),n.css("line-height",.1*e+"px")}var o=$("#keypad");o.width(s),o.height(.9*e),o=$("#calculationHistory"),o.width(s),o.height(.9*e),o=$(".historyItem"),o.width(s),o.css("line-height",.9*e*.1*.96-1+"px"),o.height(.9*e*.1-1)}function i(){$("#keypad").toggle(),$("#calculationHistory").toggle()}function t(){$("body").on("historynumericpad",i),$("body").trigger("keypadReady"),$("body").trigger("displayReady"),$("body").trigger("expressionManagerReady"),$("body").trigger("utilitiesReady")}function n(i){i.orientation&&(s=$(window).width(),r=$(window).height(),"portrait"==$.event.special.orientationchange.orientation(),e())}var s=$(window).width(),r=$(window).height();$(document).on("deviceready",function(){e(),t(),$(window).bind("orientationchange",n)})}();