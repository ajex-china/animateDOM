var AnimateDom = AnimateDom||{};
(function (){
    function RotationCard(type,dom){
        this.Dom_constructor(type,dom);
    }
    var p = AnimateDom.extend(RotationCard,AnimateDom.Dom);
    p.initCard = function (front,back)
    {
        if(!front||!back ) return null;
        if(!front.className||!back.className)
        {
            console.log("请传入animate包装过的dom对象")
            return null;
        }
        this.front = front;
        this.back = back;
        this.front.rotationY = 181;//按照算法一开始应该是180的，但是chrome初始化设置180的时候会有显示不全的bug
        this.addChild(front);
        this.addChild(back);
        front.visible = false;
    }
    p.setRotationY = function (value)
    {
        var _value = value%360;
        if(_value>=90&&_value<=270)
        {

            this.front.visible = true;
            this.back.visible = false;
        }
        else
        {
            this.front.visible = false;
            this.back.visible = true;
        }
        this.set_rotationY(value);
    }
    p.getRotationY = function ()
    {
        return this.get_rotationY();
    }
    Object.defineProperties(p, {
        rotationY: { get: p.getRotationY, set: p.setRotationY },
    });
    AnimateDom.RotationCard = AnimateDom.promote(RotationCard, "Dom");
}())
