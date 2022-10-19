var AnimateDom = AnimateDom||{};
(function (){

    AnimateDom.Dom = function (type,dom)//new or current
    {
        if(type == "new")
        {
            this.dom = document.createElement(dom);
            this.init(true);
        }
        else if(type == "current")
        {
            this.dom = dom;
            this.init(false);
        }

    }
    var p = AnimateDom.Dom.prototype;
    function defineCSS(cssAttr,cssName,unit)
    {
        // if(!unit) unit=0;
        Object.defineProperty(p, cssName, {
            get: function () {
                return parseFloat(this.dom.style.getPropertyValue(cssAttr));
            },
            set: function (value) {
                this.dom.style.setProperty(cssAttr,value + unit);
            }
        });
    }
    function defineTransform(transformAttr,defaultValue)
    {
        p["_" + transformAttr] = defaultValue;
        let getFun = function () {
                return  this["_" + transformAttr];
            };
        let setFun = function (value) {
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
        };
        p["get_" + transformAttr] = getFun;
        p["set_" + transformAttr] = setFun;
        Object.defineProperty(p, transformAttr, {
            get: getFun,
            set: setFun
        });
    }
    function initCSS()
    {
        defineCSS("width","width","px");
        defineCSS("height","height","px");
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
    p.delayTransformSet = true;
    p.init = function (iscss)
    {
        this._childList = [];

        this.className = "Dom";

        if(iscss)
        {
            this.dom.style.setProperty("padding",0);
            this.dom.style.setProperty("margin",0);
            this.dom.style.setProperty("position","absolute");
            this.dom.style.setProperty("perspective-origin","50% 50%");
            this.dom.style.setProperty("-webkit-perspective-origin","50% 50%");
            this.dom.style.setProperty("transform-style","preserve-3d");
            // this.dom.style.setProperty("backface-visibility","hidden");
            // this.dom.style.setProperty("-webkit-transform-origin","left top");
            // this.dom.style.setProperty("transform-origin","left top");
        }
        this.perspective = 1000;
        this.alpha = 1;//不然为NAN无法缓动
    }
    p.initStyle = function ()
    {
        this.dom.style.setProperty("padding",0);
        this.dom.style.setProperty("margin",0);
        this.dom.style.setProperty("position","absolute");
        this.dom.style.setProperty("perspective-origin","50% 50%");
        this.dom.style.setProperty("-webkit-perspective-origin","50% 50%");
        this.dom.style.setProperty("transform-style","preserve-3d");
    }
    p.addChild = function (child)
    {
        this.addChildAt(child,this.numChildren);
    }
    p.addChildAt = function (child,index)
    {
        if(index > this.numChildren) index = this.numChildren;
        this._childList[index] = child;
        if(child.className == "Dom")
        {
            this.dom.appendChild(child.dom)
        }
        else
        {
            console.log("非AnimateDom的Dom对象，不能加入AnimateDom的Dom")
        }
    }
    p.removeChild = function (child)
    {
        var index = this.getChildIndex(child);
        this.removeChildAt(index);
    }
    p.removeChildAt = function (index)
    {
        if(index > this.numChildren) index = this.numChildren;
        var child = this.getChildAt(index);
        this._childList.splice(index,1);
        child.dom.remove();
        return child;
    }
    p.getChildIndex = function (child)//这里的index并不影响z-index
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
    p.getChildAt = function(index)
    {
        if(index > this.numChildren-1) index = this.numChildren-1;
        return this._childList[index];
    }
    p.setTransform = function ()
    {
        this.dom.style.setProperty("transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");

        this.dom.style.setProperty("-ms-transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");

        this.dom.style.setProperty("-moz-transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");

        this.dom.style.setProperty("-webkit-transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");

        this.dom.style.setProperty("-o-transform","translateX(" + this._x + "px)" + " translateY(" + this._y + "px)" + " translateZ(" + this._z + "px)" + " rotate(" + this._rotation + "deg)" + " rotateX(" + this._rotationX + "deg)"
            + " rotateY(" + this._rotationY + "deg)" + " skewX(" + this._skewX + "deg)" + " skewY(" + this._skewY + "deg)" + " scaleX(" + this._scaleX + ")" + " scaleY(" + this._scaleY + ")");
    }
    Object.defineProperty(p, "val", {
        get: function () {
            return this.dom.innerHTML;
        },
        set: function (value) {
            this.dom.innerHTML = value
        }
    });
    Object.defineProperty(p, "alpha", {
        get: function () {
            return parseFloat(this.dom.style.getPropertyValue("opacity"));
        },
        set: function (value) {
            value = parseFloat(value);
            this.dom.style.setProperty("opacity",value);
            this.dom.style.setProperty("filter","alpha(opacity=" + value*100 + ")");
            this.dom.style.setProperty("-moz-opacity",value);
            this.dom.style.setProperty("-khtml-opacity",value);
        }
    });
    Object.defineProperty(p, "visible", {
        get: function () {
            let value = this.dom.getAttribute("display");
            if(value == "none")
            {
                return false;
            }
            else
            {
                return true;
            }
        },
        set: function (value) {
            if(value == false)
            {
                value = "none";
            }
            else
            {
                value = "block";
            }
            this.dom.style.setProperty("display",value);
        }
    });
    Object.defineProperty(p, "perspective", {
        get: function () {
            return this.dom.style.getPropertyValue("perspective");
        },
        set: function (value) {
            this.dom.style.setProperty("perspective",value);
            this.dom.style.setProperty("-webkit-perspective",value);
        }
    });
    Object.defineProperty(p, "src", {
        get: function () {
            return this.dom.getAttribute("src");
            },
        set: function (value) {
            this.dom.setAttribute("src",value);
        }
    });
    Object.defineProperty(p, "numChildren", {
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
    AnimateDom.set3DTransform = function (dom)
    {
        dom.style.setProperty("padding",0);
        dom.style.setProperty("margin",0);
        dom.style.setProperty("position","absolute");
        dom.style.setProperty("perspective-origin","50% 50%");
        dom.style.setProperty("-webkit-perspective-origin","50% 50%");
        dom.style.setProperty("transform-style","preserve-3d");
    }
    AnimateDom.extend = function(subclass, superclass) {
        function o() { this.constructor = subclass; }
        o.prototype = superclass.prototype;
        return (subclass.prototype = new o());
    };
    AnimateDom.promote = function(subclass, prefix) {
        var subP = subclass.prototype, supP = (Object.getPrototypeOf&&Object.getPrototypeOf(subP))||subP.__proto__;
        if (supP) {
            subP[(prefix+="_") + "constructor"] = supP.constructor; // constructor is not always innumerable
            for (var n in supP) {
                if (subP.hasOwnProperty(n) && (typeof supP[n] == "function"))
                {
                    subP[prefix + n] = supP[n];
                }
            }
        }
        return subclass;
    };
}())
