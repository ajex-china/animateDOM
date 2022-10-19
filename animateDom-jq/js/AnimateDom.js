var AnimateDom = AnimateDom||{};
(function (){

    AnimateDom.Dom = function (type,dom)//new or current
    {
        if(type == "new")
        {
            var _dom = dom;
            if(!dom) _dom = "div"
            this.dom = $("<" + _dom  + "></" + _dom + ">");
        }
        else if(type == "current")
        {
            this.dom = dom;
        }
        this.init();
    }
    function defineCSS(cssAttr,cssName)
    {
        Object.defineProperty(AnimateDom.Dom.prototype, cssName, {
            get: function () {
                return parseFloat(this.dom.css(cssAttr));
            },
            set: function (value) {
                this.dom.css(cssAttr,value);
            }
        });
    }
    function defineTransform(transformAttr,defaultValue)
    {
        AnimateDom.Dom.prototype["_" + transformAttr] = defaultValue;
        Object.defineProperty(AnimateDom.Dom.prototype, transformAttr, {
            get: function () {
                return  this["_" + transformAttr];
            },
            set: function (value) {
                this["_" + transformAttr] = value;
                // this.setTransform();
                if(this.delayTransformSet)
                {
                    if(this.timeoutNo)
                    {
                        clearTimeout(this.timeoutNo)
                    }
                    this.timeoutNo = setTimeout(this.setTransform.bind(this),0)
                }
               else
                {
                    this.setTransform();
                }
            }
        });
    }
    function initCSS()
    {
        defineCSS("width","width");
        defineCSS("height","height");
        defineCSS("z-index","z_index");
    }
    function initTransform()
    {
        defineTransform("x",0);
        defineTransform("y",0);
        defineTransform("z",0);
        defineTransform("rotation",0);
        defineTransform("rotationX",0);
        defineTransform("rotationY",0);
        defineTransform("skewX",0);
        defineTransform("skewY",0);
        defineTransform("scaleX",1);
        defineTransform("scaleY",1);
    }
    initTransform();
    initCSS();
    AnimateDom.Dom.prototype.delayTransformSet = true;
    AnimateDom.Dom.prototype.init = function ()
    {
        this._childList = [];

        this.className = "Dom";

        this.dom.css("padding",0);
        this.dom.css("margin",0);
        this.dom.css("position","absolute");
        this.dom.css("perspective-origin","50% 50%");
        this.dom.css("-webkit-perspective-origin","50% 50%");
        this.dom.css("transform-style","preserve-3d");
        this.perspective = 1000;
        // this.dom.css("backface-visibility","hidden");
        // this.dom.css("-webkit-transform-origin","left top");
        // this.dom.css("transform-origin","left top");

    }
    AnimateDom.Dom.prototype.addChild = function (child)
    {
        this.addChildAt(child,this.numChildren);
    }
    AnimateDom.Dom.prototype.addChildAt = function (child,index)
    {
        if(index > this.numChildren) index = this.numChildren;
        this._childList[index] = child;
        if(child.className == "Dom")
        {
            this.dom.append(child.dom)
        }
        else
        {
            console.log("非AnimateDom的Dom对象，不能加入AnimateDom的Dom")
        }
    }
    AnimateDom.Dom.prototype.removeChild = function (child)
    {
        var index = this.getChildIndex(child);
        this.removeChildAt(index);
    }
    AnimateDom.Dom.prototype.removeChildAt = function (index)
    {
        if(index > this.numChildren) index = this.numChildren;
        var child = this.getChildAt(index);
        this._childList.splice(index,1);
        child.dom.remove();
        return child;
    }
    AnimateDom.Dom.prototype.getChildIndex = function (child)//这里的index并不影响z-index
    {
        var index;
        for(var i=0;i<this._childList.length;i++)
        {
            if(this._childList[i] == child)
            {
                index = i;
                break;
            }
        }
        return index;
    }
    AnimateDom.Dom.prototype.getChildAt = function(index)
    {
        if(index > this.numChildren-1) index = this.numChildren-1;
        return this._childList[index];
    }
    // AnimateDom.Dom.prototype._attrDictionary = {
    //     "x":["left"],
    //     "y":["top"],
    //     "alpha":["opacity"]
    // }
    // AnimateDom.Dom.prototype.attrChange = function (attr)
    // {
    //     return this._attrDictionary[attr];
    // }
    // AnimateDom.Dom.prototype.animate = function (params,speed,easing,fn)//jq动画
    // {
    //     var newParams = {}
    //     for(var key in params)
    //     {
    //         var value = params[key];
    //         if(this.attrChange(key))
    //         {
    //             var list = this.attrChange(key);
    //             for(var i=0;i<list.length;i++)
    //             {
    //                 newParams[list[i]] = value;
    //             }
    //         }
    //         else
    //         {
    //             newParams[key] = params[key];
    //         }
    //     }
    //     this.dom.animate(newParams,speed,easing,fn);
    // }
    AnimateDom.Dom.prototype.setTransform = function ()
    {
        this.dom.css("transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");

        this.dom.css("-ms-transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");

        this.dom.css("-moz-transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");

        this.dom.css("-webkit-transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");

        this.dom.css("-o-transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");
    }
    Object.defineProperty(AnimateDom.Dom.prototype, "val", {
        get: function () {
            return this.dom.val()
        },
        set: function (value) {
            this.dom.val(value)
        }
    });
    Object.defineProperty(AnimateDom.Dom.prototype, "text", {
        get: function () {
            return this.dom.text()
        },
        set: function (value) {
            this.dom.text(value)
        }
    });
    Object.defineProperty(AnimateDom.Dom.prototype, "html", {
        get: function () {
            return this.dom.html()
        },
        set: function (value) {
            this.dom.html(value)
        }
    });
    Object.defineProperty(AnimateDom.Dom.prototype, "alpha", {
        get: function () {
            return parseFloat(this.dom.css("opacity"));
        },
        set: function (value) {
            value = parseFloat(value);
            this.dom.css("opacity",value);
            this.dom.css("filter","alpha(opacity=" + value*100 + ")");
            this.dom.css("-moz-opacity",value);
            this.dom.css("-khtml-opacity",value);
        }
    });
    Object.defineProperty(AnimateDom.Dom.prototype, "perspective", {
        get: function () {
            return this.dom.css("perspective");
        },
        set: function (value) {
            this.dom.css("perspective",value);
            this.dom.css("-webkit-perspective",value);
        }
    });
    Object.defineProperty(AnimateDom.Dom.prototype, "src", {
        get: function () {
            return this.dom.attr("src");
            },
        set: function (value) {
            this.dom.attr("src",value);
        }
    });
    Object.defineProperty(AnimateDom.Dom.prototype, "numChildren", {
        get: function () {
            return this._childList.length;
        }
    });
}())

var AnimateDom = AnimateDom||{};
(function (){
    AnimateDom.getDom = function (dom)//获取现有dom
    {
        return new AnimateDom.Dom("current",dom)
    }
    AnimateDom.newDom = function (name)//生成新dom
    {
        return new AnimateDom.Dom("new",name)
    }
}())