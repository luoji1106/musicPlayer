$(function(){
    // 将音乐内容信息绑定
    var $audio = $("#audio");
    var player = new Player($audio);
    // 歌曲进度条实例对象
    var progress;
    // 音量进度条实例对象
    var voiceProgress;
    // 歌词实例对象
    var lyric;

    // 通过ajax获取本地歌曲文件信息
    getMusicInfo();
    function getMusicInfo(){
        $.ajax({
            // url地址
            url: "http://localhost:7000/musicInfo",
            // 请求类型
            type: "GET",
            // 响应体结果
            dataType: "json",
            // 成功后的回调函数
            success: function(data){
                // 将获取到的音乐数据传入播放函数
                player.musicList = data;
                // 遍历获取到的结果，创建每一条音乐
                $.each(data,function(index,music){
                    var $music = createMusic(index,music);
                    $(".musicTitle li:last-child").after($music);
                });
                // 设置界面初始化背景等样式
                initMusicInfo(data[0]);
                // 设置界面初始化歌词
                initMusicLrc(data[0]);
            },
            // 失败后的回调函数
            error: function(e){
                console.log(e);
            }
        });
    }

    // 操作页面的进度条
    operationBar();
    function operationBar(){
        // 歌曲进度条控制方法
        var $playBarLength = $(".play-bar-length"); //总进度条
        var $playBarGo = $(".play-bar-go"); //显示当前进度
        var $playBarTo = $(".play-bar-to"); //小圆点
        progress = new Progress($playBarLength,$playBarGo,$playBarTo);
        // 进度条点击方法
        progress.progressClick(function(value){
            player.setMusicTo(value);
        });
        // 进度条拖拽方法
        progress.progressMove(function(value){
            player.setMusicTo(value);
        });

        // 音量进度条控制方法
        var $voiceBarLength = $(".voice-bar-length"); //总进度条
        var $voiceBarGo = $(".voice-bar-go"); //显示当前进度
        var $voiceBarTo = $(".voice-bar-to"); //小圆点
        voiceProgress = new Progress($voiceBarLength,$voiceBarGo,$voiceBarTo);
        // 进度条点击方法
        voiceProgress.progressClick(function(value){
            player.setVoiceTo(value);
        });
        // 进度条拖拽方法
        voiceProgress.progressMove(function(value){
            player.setVoiceTo(value);
        });
        // 监听音量图标的点击
        $(".music-voice").click(function(){
            // 判断音量图标是否为喇叭
            if($(this).find("use").attr("xlink:href") == "#icon-laba"){
                // 将图标切换成静音
                $(this).find("use").attr("xlink:href","#icon-jingyin");
                // 调用方法将音量调成0
                player.setVoiceTo(0);
                // 将音量进度条长度调成0
                $(".voice-bar-go").css("width","0");
            }else{
                // 将图标切换成喇叭
                $(this).find("use").attr("xlink:href","#icon-laba");
                // 调用方法将音量调成0.3
                player.setVoiceTo(0.3);
                // 将音量进度条长度调成30px
                $(".voice-bar-go").css("width","30");
            }
        })
        // 点击进度条时，使音量图标切换回喇叭
        $(".voice-bar-length").click(function(){
            $(".music-voice use").attr("xlink:href","#icon-laba");
        })
    }

    // 页面初始化函数
    function initMusicInfo(music){
        var $musicImg = $(".cover");
        var $musicName = $(".info-musicName>span");
        var $musicSinger = $(".info-singer>span");
        var $musicDVD = $(".info-dvdName>span");
        var $barMusicName = $(".nameTime>a");
        var $barMusicTime = $(".musicTime");
        var $backImg = $(".backImg");

        $musicImg.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicDVD.text(music.albun);
        $barMusicName.text(music.name + " / " + music.singer);
        $barMusicTime.text("00:00 / " + music.time);
        $backImg.css("background",`url(${music.cover})`);
    }

    //页面初始化歌词
    function initMusicLrc(musicc){
        lyric = new Lyric(musicc.link_lrc);
        lyric.loadMusicLrc(function(){
            $.each(lyric.lyrics,function(index,lrc){
                $lrcP = $(`<p>${lrc}</p>`);
                $(".musicLrc").append($lrcP);
            })
        });
    }

    // 歌曲列表的滚动条设置
    $(".musicTitle").mCustomScrollbar();

    // 点击复选框选中或取消，由于歌曲列表是加载页面后再创建出来的，所以用事件委托
    $(".musicTitle").delegate(".listMusic .listChecked","click",function(){
        $(this).toggleClass("checked");
    })
    // 点击全选框，所有复选框选中或取消
    $(".listChecked").eq(0).click(function(){
        if($(this).attr("class") == "listChecked"){
            $(".musicTitle").find(".listChecked").addClass("checked");
        }else{
            $(".musicTitle").find(".listChecked").removeClass("checked");
        }
    })

    // 移入列表时显示选项
    $(".musicTitle").delegate(".listMusic","mouseenter",function(){
        $(this).find(".listTime span").css("display","none");
        $(this).find("svg").stop().fadeIn(100);
    })
    // 移出列表时关闭选项
    $(".musicTitle").delegate(".listMusic","mouseleave",function(){
        $(this).find(".listTime span").css("display","block");
        $(this).find("svg").stop().fadeOut(100);
    })

    // 子菜单播放暂停按钮的监听
    $(".musicTitle").delegate(".listMusic #go-stop>use","click",function(){
        // 优化代码
        var $listLi = $(this).parents(".listMusic");
        // 判断当前点击的按钮的状态
        if($(this).attr("xlink:href") == "#icon-jixu"){
            // 将播放按钮改为暂停按钮
            $(this).attr("xlink:href","#icon-zantingtingzhi");
            // 将其他音乐li中的暂停按钮改为播放按钮
            $listLi.siblings().find("#go-stop>use").attr("xlink:href","#icon-jixu");
            // 将底部的播放按钮同步改为暂停按钮并更改title
            $(".footer .music-stop use").attr("xlink:href","#icon-zantingtingzhi");
            $(".music-stop").attr("title","暂停");
            // 将点击的这一栏音乐字体颜色改为高亮
            $listLi.find("span").css("color","#fff");
            // 将除点击的音乐外其他音乐li中的字体颜色改回暗淡
            $listLi.siblings().find("span").css("color","rgb(183,183,183)");
            // 将点击的这一栏的序号去掉，将背景改为音浪图片,并将其他音乐栏中的音浪图片去除
            $listLi.find(".listNum>span").css("color","rgb(255,255,255,0)");
            $listLi.find(".listNum").addClass("sound-w");
            $listLi.siblings().find(".listNum").removeClass("sound-w");
            // 播放音乐
            player.playMusic($listLi.get(0).index,$listLi.get(0).music);
            // 切换歌曲信息与背景
            initMusicInfo($listLi.get(0).music);
            // 切换歌词信息
            initMusicLrc($listLi.get(0).music);
        }else{
            // 将播放按钮改为播放按钮
            $(this).attr("xlink:href","#icon-jixu");
            // 将底部的播放按钮同步改为播放按钮并更改title
            $(".footer .music-stop use").attr("xlink:href","#icon-jixu");
            $(".music-stop").attr("title","播放");
            // 将点击的这一栏音乐字体颜色改会暗淡
            $listLi.find("span").css("color","rgb(183,183,183)");
            // 将音浪图片去除
            $listLi.find(".listNum").removeClass("sound-w");
            // 暂停音乐
            player.playMusic($listLi.get(0).index,$listLi.get(0).music);
        }
    })
    
    // 创建歌曲函数
    function createMusic(index,music){
        $item = $(`<li class="listMusic">
                    <div class="listChecked"><i></i></div>
                    <div class="listNum"><span>${index+1}</span></div>
                    <div class="listName">
                        <span>${music.name}</span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-xiazai1"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-tianjiadao"></use>
                        </svg>
                        <svg  id="go-stop" class="icon" aria-hidden="true">
                            <use xlink:href="#icon-jixu"></use>
                        </svg>
                    </div>
                    <div class="singer"><span>${music.singer}</span></div>
                    <div class="listTime">
                        <span>${music.time}</span>
                        <svg class="icon" aria-hidden="true" id="removeMusic">
                            <use xlink:href="#icon-shanchu"></use>
                        </svg>
                    </div>
                </li>`);
        // 将index和歌曲信息绑定在当前创建的歌曲上
        $item.get(0).index = index;
        $item.get(0).music = music;
    
        return $item;
    }

    // 底部开始暂停按钮控制
    $(".music-stop use").click(function(){
        if(player.musicIndex == -1){
            $(".listMusic").eq(0).find("#go-stop>use").trigger("click");
        }else{
            $(".listMusic").eq(player.musicIndex).find("#go-stop>use").trigger("click");
        }
    });

    // 切换上一首歌曲
    $(".music-before use").click(function(){
        // 判断当前播放的歌曲是否是第一首
        if(player.musicIndex > 0){
            // 切换上一首
            $(".listMusic").eq(player.musicIndex-1).find("#go-stop>use").trigger("click");
        }else{
            // 直接跳转最后一首
            $(".listMusic").eq($(".listMusic").length-1).find("#go-stop>use").trigger("click");
        }
    });

    // 切换下一首歌曲
    $(".music-next use").click(function(){
        // 判断当前播放的歌曲是否是最后一首
        if(player.musicIndex < $(".listMusic").length-1){
            // 切换下一首
            $(".listMusic").eq(player.musicIndex+1).find("#go-stop>use").trigger("click");   
        }else{
            // 直接跳转第一首
            $(".listMusic").eq(0).find("#go-stop>use").trigger("click");
        }
    });

    // 删除音乐
    $(".musicTitle").delegate("#removeMusic>use","click",function(){
        // 获取当前删除的音乐li
        var $Li = $(this).parents(".listMusic");
        // 通过player的原型链查找removeMusic（删除歌曲文件）方法并调用，将当前要删除的歌曲绑定的index传入
        player.removeMusic($Li.get(0).index);
        // 删除歌曲li
        $Li.remove();
        // 遍历当前剩余的歌曲
        $(".listMusic").each(function(index,li){
            // 重新排序每个歌曲上绑定的 index值
            li.index = index;
            // 将歌曲列表的序号重新定义顺序
            $(li).find(".listNum>span").text(index + 1);
        })
    })

    // 点击总选项中的删除按钮，删除所有复选框选中的歌曲
    $(".Option li:nth-child(4)").click(function(){
        // 找到所有选中的复选框
        var listArr = $(".listMusic .checked");
        // 触发所有选中的复选框所在的音乐节点里的删除按钮
        for(i=0;i<listArr.length;i++){
            $(listArr[i]).parents(".listMusic").find("#removeMusic use").trigger("click");
        }

    })

    // 监听歌曲播放进度
    player.musicTimeUpDate(function(currenttime,duration,timeStr){
        // 修改底部歌曲时间
        $(".musicTime").text(timeStr);
        // 算出当前歌曲时间与总时间的比例
        var value = currenttime / duration * 100;
        // 根据时间比例改变歌曲进度条的长度
        progress.setProgress(value);
        // 播放完自动跳转下一首
        if(value == 100){
            $(".music-next use").trigger("click");
        };
        // 根据歌曲进度滚动歌词
        lyric.runLrc(currenttime);
    });

});
