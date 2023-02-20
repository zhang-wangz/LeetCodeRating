var isindex = true
var visitor = "主人"

const spig = `<div id="spig" class="spig" hidden>
                        <div id="message">正在加载中……</div>
                        <div style="height=80px"/>
                        <div id="mumu" class="mumu"></div>
                        <div id="level">level loading...</div>
                    </div>`
const hitokoto = `<span class="hitokoto" id="hitokoto" style="display:none">Loading...</span>`
$("body").append(spig, hitokoto)

//右键菜单
jQuery(document).ready(function ($) {
    $("#spig").mousedown(function (e) {
        if(e.which==3){
             // <a href=\"http://www.yizhanzzw.com\" title=\"首页\">首页</a>
            showMessage("秘密通道:<br /><a href=\"https://leetcode.cn/problemset/all/\" title=\"题库\">题库</a>  ",10000);
        }
});
$("#spig").bind("contextmenu", function(e) {
    return false;
});
});


// 求等级
let userTag = ""
let level = 0
let score = 0
const queryProcess = '\n    query userQuestionProgress($userSlug: String!) {\n  userProfileUserQuestionProgress(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      difficulty\n      count\n    }\n    numFailedQuestions {\n      difficulty\n      count\n    }\n    numUntouchedQuestions {\n      difficulty\n      count\n    }\n  }\n}\n    '
const queryUser = '\n    query globalData {\n  userStatus {\n    isSignedIn\n    isPremium\n    username\n    realName\n    avatar\n    userSlug\n    isAdmin\n    checkedInToday\n    useTranslation\n    premiumExpiredAt\n    isTranslator\n    isSuperuser\n    isPhoneVerified\n    isVerified\n  }\n  jobsMyCompany {\n    nameSlug\n  }\n  commonNojPermissionTypes\n}\n    '

function getscore(userTag) {
    let list = { "query": queryProcess, "variables": { "userSlug" : userTag } };
    $.ajax({ type :"POST", url : "https://leetcode.cn/graphql/", data: JSON.stringify(list), success: function(res) {
        let levelData = res.data.userProfileUserQuestionProgress.numAcceptedQuestions
        levelData.forEach(e => {
            if (e.difficulty == "EASY")  score += e.count * 10
            else if (e.difficulty == "MEDIUM")  score += e.count * 20
            else if (e.difficulty == "HARD")  score += e.count * 100
        });
        level = score / 1000
        $("#level").text("level: " + Math.round(level).toString())
        console.log(level)
    }, async: false, xhrFields : { withCredentials: true }, contentType: "application/json;charset=UTF-8"})
}

$.ajax({ type :"POST", url : "https://leetcode.cn/graphql/", data: JSON.stringify({"query" : queryUser, "variables": {}}), success: function(res) {
    userTag = res.data.userStatus.userSlug
    // console.log(userTag)
}, async: false, xhrFields : { withCredentials: true }, contentType: "application/json;charset=UTF-8"})

if (userTag != "") {
    getscore(userTag)
} else {
    $("#level").text("请登录后再尝试获取level")
}
const dummySend = XMLHttpRequest.prototype.send
let addListener = () => {
    // console.log("addListener....")
    XMLHttpRequest.prototype.send = function (str) {
        const _onreadystatechange = this.onreadystatechange;
        this.onreadystatechange = (...args) => {
            if (this.readyState == this.DONE && this.responseURL.match("https://leetcode.cn/submissions/detail/.*/check/")) {
                let resp = JSON.parse(this.response)
                // console.log(resp)
                if (resp && resp.status_msg && resp.status_msg.includes("Accepted")) {
                    showMessage("恭喜主人成功提交， 当前分数为: " + score + ", 当前等级为: " + Math.round(level).toString())
                    console.log("恭喜主人成功提交， 当前分数为: " + score + ", 当前等级为: " + Math.round(level).toString())
                }
            }
            if (_onreadystatechange) {
                _onreadystatechange.apply(this, args);
            }
        }
        return dummySend.call(this, str);
    }
}
addListener()




// 鼠标在消息上时
jQuery(document).ready(function ($) {
    $("#message").hover(function () {
        $("#message").fadeTo("100", 1);
    });
});


//鼠标在上方时
jQuery(document).ready(function ($) {
    //$(".mumu").jrumble({rangeX: 2,rangeY: 2,rangeRot: 1});
    $(".mumu").mouseover(function () {
        $(".mumu").fadeTo("300", 0.3);
        msgs = ["我隐身了，你看不到我", "我会隐身哦！嘿嘿！", "别动手动脚的，把手拿开！", "把手拿开我才出来！"];
        var i = Math.floor(Math.random() * msgs.length);
        showMessage(msgs[i]);
    });
    $(".mumu").mouseout(function () {
        $(".mumu").fadeTo("300", 1)
    });
});

// jQuery(document).ready(function($) {

//     window.setInterval(function() {
//         // , weather.c[0], weather.c[2], weather.c[5], weather.c[7]
//         let msgs = [$("#hitokoto").text()];
//         // let i = Math.floor(Math.random() * msgs.length);
//         showMessage(msgs[0]);
//     }, 5000);
// });

//开始
jQuery(document).ready(function ($) {
    if (isindex) { //如果是主页
        let now = (new Date()).getHours();
        if (now > 0 && now <= 6) {
            showMessage(visitor + ' 你是夜猫子呀？还不睡觉，明天起的来么你？', 6000);
        } else if (now > 6 && now <= 11) {
            showMessage(visitor + ' 早上好，早起的鸟儿有虫吃噢！早起的虫儿被鸟吃，你是鸟儿还是虫儿？嘻嘻！', 6000);
        } else if (now > 11 && now <= 14) {
            showMessage(visitor + ' 中午了，吃饭了么？不要饿着了，饿死了谁来挺我呀！', 6000);
        } else if (now > 14 && now <= 18) {
            showMessage(visitor + ' 中午的时光真难熬！还好有你在！', 6000);
        } else {
            showMessage(visitor + ' 快来逗我玩吧！', 6000);
        }
    }
    else {
        showMessage('力扣欢迎你～', 6000);
    }
    $(".spig").animate({
        top: $(".spig").offset().top + 300,
        left: document.body.offsetWidth - 160
    },
	{
        queue: false,
        duration: 1000
	});
});

// jQuery(document).ready(function($) {
//     window.setInterval(function() {
//         msgs = [$("#hitokoto").text()];
//         //if(weather.state)msgs.concat(weather.c);
//         var i = Math.floor(Math.random() * msgs.length);
//         s = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7, -0.75];
//         var i1 = Math.floor(Math.random() * s.length);
//         var i2 = Math.floor(Math.random() * s.length);
//         $(".spig").animate({
//             left: document.body.offsetWidth / 2 * (1 + s[i1]),
//             top: document.body.offsetheight / 2 * (1 + s[i1])
//         },
//         {
//             duration: 2000,
//             complete: showMessage(msgs[i])
//         });
//     },
//     45000);
// });


var spig_top = 50;
//滚动条移动
jQuery(document).ready(function ($) {
    var f = $(".spig").offset().top;
    $(window).scroll(function () {
        $(".spig").animate({
            top: $(window).scrollTop() + f +300
        },
		{
            queue: false,
            duration: 1000
		});
    });
});

//鼠标点击时
jQuery(document).ready(function ($) {
    var stat_click = 0;
    $(".mumu").click(function () {
        if (!ismove) {
            stat_click++;
            if (stat_click > 4) {
                msgs = ["你有完没完呀？", "你已经摸我" + stat_click + "次了", "非礼呀！救命！OH，My ladygaga"];
                var i = Math.floor(Math.random() * msgs.length);
                showMessage(msgs[i]);
            } else {
                msgs = ["筋斗云！~我飞！", "我跑呀跑呀跑！~~", "别摸我，有什么好摸的！", "惹不起你，我还躲不起你么？", "不要摸我了，我会告诉你老婆来打你的！", "干嘛动我呀！小心我咬你！"];
                var i = Math.floor(Math.random() * msgs.length);
                showMessage(msgs[i]);
            }
        s = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6,0.7,0.75,-0.1, -0.2, -0.3, -0.4, -0.5, -0.6,-0.7,-0.75];
        var i1 = Math.floor(Math.random() * s.length);
        var i2 = Math.floor(Math.random() * s.length);
            $(".spig").animate({
            left: document.body.offsetWidth/2*(1+s[i1]),
            top:  document.body.offsetHeight/2*(1+s[i1])
            },
			{
                duration: 500,
                complete: showMessage(msgs[i])
			});
        } else {
            ismove = false;
        }
    });
});
//显示消息函数 
function showMessage(a, b) {
    if (b == null) b = 5000;
    // $("#mumu").css({"opacity":"0.5 !important"})
    $("#message").hide().stop();
    $("#message").html(a);
    $("#message").fadeIn();
    $("#message").fadeTo("1", 1);
    $("#message").fadeOut(b);
    // $("#mumu").css({"opacity":"1 !important"})
};

//拖动
var _move = false;
var ismove = false; //移动标记
var _x, _y; //鼠标离控件左上角的相对位置
jQuery(document).ready(function ($) {
    $("#spig").mousedown(function (e) {
        _move = true;
        _x = e.pageX - parseInt($("#spig").css("left"));
        _y = e.pageY - parseInt($("#spig").css("top"));
    });
    $(document).mousemove(function (e) {
        if (_move) {
            var x = e.pageX - _x; 
            var y = e.pageY - _y;
            var wx = $(window).width() - $('#spig').width();
            var dy = $(document).height() - $('#spig').height();
            if(x >= 0 && x <= wx && y > 0 && y <= dy) {
                $("#spig").css({
                    top: y,
                    left: x
                }); //控件新位置
            ismove = true;
            }
        }
    }).mouseup(function () {
        _move = false;
    });
});


function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
    return null;
}
function setCookie(name, value, days) {
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "; expires=" + date.toGMTString()
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/"
}
var weather = Array();
weather.s = false;
jQuery(document).ready(function($) {
    var date = new Date();
    weather.d = "" + date.getFullYear() + date.getMonth() + date.getDay();
    weather.ck = getCookie("weather");
    if (weather.ck == null || weather.d != getCookie("wea_tstamp")) {
        $.ajax({
            dataType: "jsonp",
            success: function(data) {
                if (data.success != 1) {
                    return;
                }
                weather.s = true;
                weather.c = Array();
                weather.c[0] = "今天是" + data.result[0].days + "，" + data.result[0].week;
                weather.c[1] = data.result[0].citynm + "今天" + data.result[0].temp_high + "°C到" + data.result[0].temp_low + "°C";
                weather.c[2] = data.result[0].citynm + "今天" + data.result[0].weather;
                weather.c[3] = data.result[0].citynm + "今天" + data.result[0].winp + "，" + data.result[0].wind;
                weather.c[4] = data.result[0].citynm + "明天" + data.result[1].temp_high + "°C到" + data.result[1].temp_low + "°C";
                weather.c[5] = data.result[0].citynm + "明天" + data.result[1].weather;
                weather.c[6] = data.result[0].citynm + "后天" + data.result[2].temp_high + "°C到" + data.result[2].temp_low + "°C";
                weather.c[7] = data.result[0].citynm + "后天" + data.result[2].weather;
                setCookie("wea_tstamp", weather.d, 1);
                setCookie("weather", encodeURI(weather.c.join(",")), 1);
            },
            type: "GET",
            url: "https://myhloliapi.sinaapp.com/weather/?callback=?"
        });
    } else {
        weather.s = true;
        weather.c = decodeURI(weather.ck).split(",");
    }
});
