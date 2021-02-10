(function(window){
    function Progress($playBarLength,$playBarGo,$playBarTo){
        return new Progress.prototype.init($playBarLength,$playBarGo,$playBarTo);
    }

    Progress.prototype = {
        init: function($playBarLength,$playBarGo,$playBarTo){
            // 将接收到的参数保存
            this.playBarLength = $playBarLength;
            this.playBarGo = $playBarGo;
            this.playBarTo = $playBarTo;
        },
        // 进度条点击方法
        progressClick: function(callBack){
            // 将progress中的this改为$this，方便之后点击事件函数中调用
            var $this = this;
            // 监听进度条的点击事件
            this.playBarLength.click(function(e){
                // 获取进度条与页面左边的距离
                var barLeft = $(this).offset().left;
                // 获取鼠标点击的地方与页面左边的距离
                var mouseLeft = e.pageX;
                // 算出当前进度长度，并设置最大值不能大于总进度条长度
                var goWidth = mouseLeft-barLeft;
                if(goWidth >= $this.playBarLength.width()){
                    goWidth = $this.playBarLength.width();
                }
                // 设置当前的进度长度
                $this.playBarGo.css("width",goWidth);
                // 当外部调用musicTimeUpDate方法时传进来一个函数，再将处理好的数据传递个这个回调函数callBack
                var value = goWidth / $(this).width();
                callBack(value);
            })
        },
        // 设置一个标识值，判断是否在拖拽
        isMove: false,
        // 进度条拖拽方法
        progressMove: function(callBack){
            var $this = this;
            var barGoWidth;
            // 监听鼠标按下
            this.playBarLength.mousedown(function(){
                // 获取进度条与页面左边的距离
                var barLeft = $(this).offset().left;
                // 监听鼠标移动
                $(document).mousemove(function(e){
                    // 拖拽时将 isMove 改为 true
                    $this.isMove = true;
                    // 获取鼠标的位置与页面左边的距离
                    var mouseLeft = e.pageX;
                    // 算出当前进度长度，并设置最大值不能大于总进度条长度
                    var goWidth = mouseLeft-barLeft;
                    barGoWidth = goWidth;
                    if(goWidth >= $this.playBarLength.width()){
                        goWidth = $this.playBarLength.width();
                    }
                    // 设置当前的进度长度
                    $this.playBarGo.css("width",goWidth);
                });
            });
            // 监听鼠标松开
            this.playBarLength.mouseup(function(){
                // 关闭监听鼠标移动的函数
                $(document).off("mousemove");
                // 算出鼠标松开时，当前进度与总进度条长度的比例，并将参数传出
                var value = barGoWidth / $(this).width();
                // 当外部调用musicTimeUpDate方法时传进来一个函数，再将处理好的数据传递个这个回调函数callBack
                callBack(value);
                // 拖拽完毕后将标识值改回 false
                $this.isMove = false;
            })
        },
        // 进度条同步时间方法
        setProgress: function(value){
            // 如果进度条在拖拽中，直接中断函数
            if(this.isMove){return};
            // 根据当前歌曲时间与总时长的比例，设置当前进度长度
            this.playBarGo.css("width",value + "%");
        }
    }

    // 将init函数对象的原型地址 设置为 Progress的原型；后续init通过隐式原型链也可以调用Progress里的方法与变量
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);