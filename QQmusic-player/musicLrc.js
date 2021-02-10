(function(window){
    function Lyric(linkLrc){
        return new Lyric.prototype.init(linkLrc);
    }

    Lyric.prototype = {
        init: function(linkLrc){
            this.musicLrc = linkLrc;
        },
        times: [],
        lyrics: [],
        // 加载歌词方法
        loadMusicLrc: function(callback){
            var $this = this;
            
            // 每次调用方法时，清空之前存的时间与歌词，并清空页面上的歌词
            this.times = [];
            this.lyrics = [];
            $(".musicLrc").html("");

            $.ajax({
                // url地址
                url: $this.musicLrc,
                // 响应体结果
                dataType: "text",
                // 成功后的回调函数
                success: function(data){
                    // 匹配含有时间的歌词
                    // 将歌词文件以换行符把每一行分开，并返回一个数组
                    var array = data.split("\n");
                    // 创建正则表达式 例:[00:23.93]
                    var RegExp = /\[(\d*:\d*\.\d*)\]/;
                    // 遍历歌词数组中的每一行
                    $.each(array,function(index,lrc){
                        // 将每一行内容以‘]’符号分割，取其中代表歌词的元素
                        var lrcStr = lrc.split("]")[1];
                        // 如果该行歌词为空，则跳过本次遍历，进行下次循环
                        if(lrcStr.length <= 1) return true;
                        // 如果取到了歌词，将它插入到lyrics数组中存起来
                        $this.lyrics.push(lrcStr);
                        // .exec() 用于检索字符串中的正则表达式的匹配。该函数返回一个数组，其中存放匹配的结果。未找到则返回null。
                        var res = RegExp.exec(lrc);
                        // 正则表达式匹配失败就跳过，进行下次循环
                        if(res == null) return true;
                        // 正则表达式中小括号框起来的部分 00:23.93
                        var timeStr = res[1];
                        // 将取到的时间转换为以秒(s)为单位的数，并将它插入到time数组中存起来
                        var timeArr = timeStr.split(":");
                        var min = Number(timeArr[0]);
                        var sec = Number(timeArr[1]);
                        var time = parseFloat((min*60 + sec).toFixed(2));
                        $this.times.push(time);
                    })
                    // 加载歌词完毕，执行回调函数
                    callback();
                },
                // 失败后的回调函数
                error: function(e){
                    console.log(e);
                }
            });
        },
        // 根据歌曲进度滚动歌词
        lrcIndex: 0,
        runLrc: function(currenttime){
            $this1 = this;
            // 判断歌曲当前时间是否大于时间数组中的时间
            if(currenttime >= this.times[this.lrcIndex]){
                // 歌词列表中对应的那句歌词点亮
                $(".musicLrc p").eq(this.lrcIndex).css("color","green");
                // 其他的歌词字体颜色恢复
                $(".musicLrc p").eq(this.lrcIndex).siblings().css("color","rgb(183,183,183)");
                // 当第三局歌词点亮时，歌曲开始相应的滚动
                if($this1.lrcIndex >= 2){
                    var topRun = ($this1.lrcIndex-1) * -30;
                    $(".musicLrc p").eq(0).animate({
                        marginTop: topRun
                    },500)
                }
                // 完成一次歌词点亮操作，标识值+1
                this.lrcIndex++;
            }
        }
    };

    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);