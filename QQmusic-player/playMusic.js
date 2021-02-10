(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }

    Player.prototype = {
        // 接收到的响应结果
        musicList: [],
        
        init: function($audio){
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        // 设置一个歌曲初始标识值
        musicIndex: -1,
        // 播放歌曲方法
        playMusic: function(index,music){
            // 通过歌曲标识值判断是否是同一首音乐
            if(index == this.musicIndex){
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                // 播放不同的音乐
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                // 将歌曲标识值设为当前播放的音乐下标
                this.musicIndex = index;
            }
        },
        // 删除音乐文件方法
        removeMusic: function(index){
            // 删除index对应的歌曲文件
            this.musicList.splice(index,1);

            // 如果删除的歌曲是正在播放的，切换成下一首
            if(index == this.musicIndex){
                $(".music-next use").trigger("click");
            };
            // 当删除的歌曲在当前播放的歌曲前面时，将歌曲标识值 musicIndex -1，防止删除后切换上下首歌曲时出错
            if(index < this.musicIndex){
                this.musicIndex -= 1;
            };
        },
        // 获取底部歌曲已播放的时间的方法
        getMusicCurrenttime: function(){
            // currentTime:数字值，表示当前播放的时间，以秒计
            return this.audio.currentTime;
        },
        // 获取底部歌曲总时长的方法
        getMusicDuration: function(){
            // duration:数字，表示视频或音频的长度，以秒计。如果未设置音频/视频，则返回 NaN 
            return this.audio.duration;
        },
        // 监听歌曲播放进度（timeupdate方法）
        musicTimeUpDate: function(callBack){
            $this = this;
            this.$audio.on("timeupdate",function(){
                // 歌曲当前时间
                var currenttime = $this.audio.currentTime;
                // 歌曲总时间
                var duration = $this.audio.duration;
                // 将时间转成 00：00 的格式
                var timeStr = $this.formatTime(currenttime,duration);
                // 当外部调用musicTimeUpDate方法时传进来一个函数，再将处理好的数据传递个这个回调函数callBack
                callBack(currenttime,duration,timeStr);
            })
        },
        // 转化歌曲时间格式的函数
        formatTime: function(currenttime,duration){
            curMin = parseInt(currenttime / 60);
            curSec = parseInt(currenttime % 60);
            if(curMin < 10){
                curMin = "0" + curMin;
            }
            if(curSec < 10){
                curSec = "0" + curSec;
            }

            durMin = parseInt(duration / 60);
            durSec = parseInt(duration % 60);
            if(durMin < 10){
                durMin = "0" + durMin;
            }
            if(durSec < 10){
                durSec = "0" + durSec;
            }

            // 将刚载入歌曲时的总时长设为 00:00, 不然刚加载时会显示 NaN
            if(curMin + ":" + curSec == "00:00"){
                durMin = durSec = "00";
            }
            return curMin + ":" + curSec + " / " + durMin + ":" + durSec;
        },
        // 操作进度条控制音乐同步
        setMusicTo: function(value){
            if(isNaN(value) || this.$audio.attr("src") == "") return;
            this.audio.currentTime = this.audio.duration * value;
        },
        // 操作进度条控制音量同步
        setVoiceTo: function(value){
            if(isNaN(value) || value < 0 || value > 1) return;
            this.audio.volume = value;
        },
    }

    // 将init函数对象的原型地址 设置为 Player的原型；后续init通过隐式原型链也可以调用Player里的方法与变量
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);