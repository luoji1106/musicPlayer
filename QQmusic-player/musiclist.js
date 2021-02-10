// 1. 引入express
// const {response,request} = require("express");
const express = require("express");
// const { url } = require("inspector");

// 2. 创建应用对象
const app = express();

// 3. 创建路由规则
app.all("/musicInfo",(request,response)=>{
    // 设置响应头  设置允许跨域
    response.setHeader('Access-Control-Allow-origin','*');
    const arr = [
        {
            "name": "江南",
            "singer": "林俊杰",
            "albun": "2006就是俊杰世界巡迴演唱会",
            "time": "4:28",
            "link_url": "source/江南.mp3",
            "cover": "source/江南.jpg",
            "link_lrc": "source/江南.lrc"
        },
        {
            "name": "搁浅",
            "singer": "周杰伦",
            "albun": "七里香",
            "time": "3:58",
            "link_url": "source/搁浅.mp3",
            "cover": "source/搁浅.jpg",
            "link_lrc": "source/搁浅.lrc"
        },
        {
            "name": "一路向北",
            "singer": "周杰伦",
            "albun": "Initial J",
            "time": "4:54",
            "link_url": "source/一路向北.mp3",
            "cover": "source/一路向北.jpg",
            "link_lrc": "source/一路向北.lrc"
        },
        {
            "name": "Poker Face",
            "singer": "Lady Gaga",
            "albun": "The Fame",
            "time": "3:58",
            "link_url": "source/Poker Face.mp3",
            "cover": "source/Poker Face.jpg",
            "link_lrc": "source/Poker Face.lrc"
        },
        {
            "name": "明明就",
            "singer": "周杰伦",
            "albun": "12新作",
            "time": "4:18",
            "link_url": "source/明明就.mp3",
            "cover": "source/明明就.jpg",
            "link_lrc": "source/明明就.lrc"
        },
        {
            "name": "你把我灌醉",
            "singer": "邓紫棋",
            "albun": "The Best of G.E.M. 2008-2012",
            "time": "4:45",
            "link_url": "source/你把我灌醉.mp3",
            "cover": "source/你把我灌醉.jpg",
            "link_lrc": "source/你把我灌醉.lrc"
        },
        {
            "name": "再见",
            "singer": "邓紫棋",
            "albun": "新的心跳",
            "time": "3:26",
            "link_url": "source/再见.mp3",
            "cover": "source/再见.jpg",
            "link_lrc": "source/再见.lrc"
        },
        {
            "name": "Lemon",
            "singer": "米津玄师",
            "albun": "STRAY SHEEP",
            "time": "4:15",
            "link_url": "source/Lemon.mp3",
            "cover": "source/Lemon.jpg",
            "link_lrc": "source/Lemon.lrc"
        },
        {
            "name": "霍元甲",
            "singer": "周杰伦",
            "albun": "霍元甲",
            "time": "4:38",
            "link_url": "source/霍元甲.mp3",
            "cover": "source/霍元甲.jpg",
            "link_lrc": "source/霍元甲.lrc"
        },
        {
            "name": "她说",
            "singer": "林俊杰",
            "albun": "她说",
            "time": "5:20",
            "link_url": "source/她说.mp3",
            "cover": "source/她说.jpg",
            "link_lrc": "source/她说.lrc"
        },
        {
            "name": "句号",
            "singer": "邓紫棋",
            "albun": "摩天动物园",
            "time": "3:55",
            "link_url": "source/句号.mp3",
            "cover": "source/句号.jpg",
            "link_lrc": "source/句号.lrc"
        },
        {
            "name": "不能说的秘密",
            "singer": "周杰伦",
            "albun": "不能说的秘密 电影原声带",
            "time": "4:56",
            "link_url": "source/不能说的秘密.mp3",
            "cover": "source/不能说的秘密.jpg",
            "link_lrc": "source/不能说的秘密.lrc"
        }
    ];
    // 将数组转化为字符串
    let str = JSON.stringify(arr);
    // send只能发送字符串
    response.send(str);
});

// 4. 监听端口启动服务
app.listen(7000,()=>{
    console.log("服务器已启动，端口7000监听中...");
});