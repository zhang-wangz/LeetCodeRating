// ==UserScript==
// @name         LeetCodeRating｜显示力扣周赛难度分
// @namespace    https://github.com/zhang-wangz
// @version      1.2.1
// @license      MIT
// @description  LeetCodeRating 力扣周赛分数显现，目前支持tag页面,题库页面和题目页面
// @author       小东是个阳光蛋(力扣名
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @homepageURL  https://github.com/zhang-wangz/LeetCodeRating
// @contributionURL https://www.showdoc.com.cn/2069209189620830
// @match        *://*leetcode.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      zerotrac.github.io
// @grant        unsafeWindow
// @note         2022-09-07 1.1.0 支持tag页面和题库页面显示匹配的周赛分难度
// @note         2022-09-07 1.1.0 分数数据出自零神项目
// @note         2022-09-07 1.1.1 修改一些小bug
// @note         2022-09-07 1.1.2 合并难度和周赛分，有周赛分的地方显示分数，没有则显示难度
// @note         2022-09-07 1.1.3 处理报错信息，净化浏览器console面板
// @note         2022-09-08 1.1.4 problems页面增加难度分显示
// @note         2022-09-08 1.1.5 修复tag页面跳转problems页面bug
// @note         2022-09-08 1.1.6 增加描述，更新插件范围为全体界面，在其他界面时删除功能优化性能
// @note         2022-09-08 1.1.7 增强数据管理，每天只获取一遍分数数据，优化效率
// @note         2022-09-09 1.1.8 修复pb页面点击下一页难度分没有变化的bug
// @note         2022-09-09 1.1.9 修复pb页面当出现会员题，点击上下页出现的bug
// @note         2022-09-09 1.1.10 修复pb页面点击评论/题解再点回题目描述，难度分消失的bug
// @note         2022-09-09 1.2.0 修改pb UI，和题库页面保持一致，有难度分直接替换原本的难度标识
// @note         2022-09-09 1.2.1 增加对应周赛链接
// ==/UserScript==

(function () {
    // 'use strict';
    var t2rate = {}
    var id1 = ""
    var id2 = ""
    var id3 = ""
    var preDate
    var allUrl = "https://leetcode.cn/problemset"
    var tagUrl = "https://leetcode.cn/tag"
    var pbUrl = "https://leetcode.cn/problems"

    // 深拷贝
    function deepclone(obj) {
        let str = JSON.stringify(obj)
        return JSON.parse(str)
    }

    // 获取时间
    function getCurrentDate(format) {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日期
        var day = now.getDay(); //得到周几
        var hour = now.getHours(); //得到小时
        var minu = now.getMinutes(); //得到分钟
        var sec = now.getSeconds(); //得到秒
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        var time = "";
        //精确到天
        if (format == 1) {
            time = year + "年" + month + "月" + date + "日";
        }
        //精确到分
        else if (format == 2) {
            time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
        }
        return time;
    }

    t2rate = JSON.parse(GM_getValue("t2ratedb", "{}").toString())
    preDate = GM_getValue("preDate", "")
    let now = getCurrentDate(1)
    if (t2rate["idx"] == undefined || (preDate == "" || preDate != now)) {
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://zerotrac.github.io/leetcode_problem_rating/data.json',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
            },
            onload: function (res) {
                if (res.status === 200) {
                    // 保留唯一标识
                    var data = jQuery.parseHTML(res.response)
                    let dataStr = data[0].data
                    let json = jQuery.parseJSON(dataStr)
                    for (let i = 0; i < json.length; i++) {
                        t2rate[json[i].TitleZH] = {}
                        t2rate[json[i].TitleZH]["rating"] = Number.parseInt(json[i].Rating)
                        t2rate[json[i].TitleZH]["ContestID_zh"] = json[i].ContestID_zh
                        t2rate[json[i].TitleZH]["ContestSlug"] = json[i].ContestSlug
                    }
                    t2rate["idx"] = -4
                    console.log("everyday getdate once...")

                    preDate = now
                    GM_setValue("preDate", preDate)
                    GM_setValue("t2ratedb", JSON.stringify(t2rate))
                }
            },
            onerror: function (err) {
                console.log('error')
                console.log(err)
            }
        })
    }

    if (window.location.href.startsWith(allUrl)) {
        let tag = GM_getValue("tag", -2)
        clearInterval(tag)
        let pb = GM_getValue("pb", -3)
        clearInterval(pb)
        let t

        function getData() {
            try {
                let arr = document.querySelector("#__next > div > div > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.col-span-4.z-base.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(7) > div.-mx-4.md\\:mx-0 > div > div > div:nth-child(2)")
                // 防止过多的无效操作
                if (t != undefined && t == arr.lastChild.innerHTML) {
                    return
                }

                let childs = arr.childNodes
                for (let idx = 0; idx < childs.length; idx++) {
                    let v = childs[idx]
                    let t = v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                    let data = t.split(".")
                    let title = data[data.length - 1].trim()
                    let nd = v.childNodes[4].childNodes[0].innerHTML
                    if (t2rate[title] != undefined) {
                        nd = t2rate[title]["rating"]
                        v.childNodes[4].childNodes[0].innerHTML = nd
                    }
                }
                t = deepclone(arr.lastChild.innerHTML)
            } catch (e) {
                return
            }
        }

        setTimeout(getData, 2000)
        id1 = setInterval(getData, 1000)
        GM_setValue("all", id1)
    } else if (window.location.href.startsWith(tagUrl)) {
        let all = GM_getValue("all", -1)
        clearInterval(all)
        let pb = GM_getValue("pb", -3)
        clearInterval(pb)

        let t

        function getTagData() {
            if (!window.location.href.startsWith(tagUrl)) {
                location.reload()
            }
            try {
                let arr = document.querySelector("#lc-content > div > div.css-207dbg-TableContainer.ermji1u1 > div > section > div > div.css-ibx34q-antdPaginationOverride-layer1-dropdown-layer1-hoverOverlayBg-layer1-card-layer1-layer0 > div > div > div > div > div > div > table > tbody")
                if (t != undefined && t == arr.lastChild.innerHTML) {
                    return
                }
                let childs = arr.childNodes
                for (let idx = 0; idx < childs.length; idx++) {
                    let v = childs[idx]
                    let t = v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                    let data = t.split(".")
                    let title = data[data.length - 1].trim()
                    let nd = v.childNodes[3].childNodes[0].innerHTML
                    if (t2rate[title] != undefined) {
                        nd = t2rate[title]["rating"]
                        v.childNodes[3].childNodes[0].innerHTML = nd
                    }
                }
                t = deepclone(arr.lastChild.innerHTML)
            } catch (e) {
                return
            }
        }

        setTimeout(getTagData, 2200)
        id2 = setInterval(getTagData, 1200)
        GM_setValue("tag", id2)
    } else if (window.location.href.startsWith(pbUrl)) {
        let all = GM_getValue("all", -1)
        let tag = GM_getValue("tag", -2)
        clearInterval(all)
        clearInterval(tag)

        let t1
        let le

        function getpb() {
            if (!window.location.href.startsWith(pbUrl)) {
                location.reload()
            }
            try {
                let t = document.querySelector("#question-detail-main-tabs > div.css-1qqaagl-layer1.css-12hreja-TabContent.e16udao5 > div > div.css-xfm0cl-Container.eugt34i0 > h4 > a")
                if (t == undefined) {
                    t1 = "unknown"
                    return
                }
                let data = t.innerText.split(".")
                let title = data[data.length - 1].trim()
                if (t1 != undefined && t1 == title) {
                    return
                }
                // 统计难度分数
                let colorSpan = document.querySelector("#question-detail-main-tabs > div.css-1qqaagl-layer1.css-12hreja-TabContent.e16udao5 > div > div.css-xfm0cl-Container.eugt34i0 > div > span:nth-child(2)")
                let pa = colorSpan.parentNode
                let nd = colorSpan.getAttribute("data-degree")
                let nd2ch = {"easy": "简单", "medium": "中等", "hard": "困难"}
                if (t2rate[title] != undefined) {
                    colorSpan.innerHTML = t2rate[title]["rating"]
                } else {
                    colorSpan.innerHTML = nd2ch[nd]
                }
                // 准备做周赛链接,如果已经不存在组件就执行操作
                let url = "https://leetcode.cn/contest/"
                if (le == undefined || le != pa.childNodes.length) {
                    let abody = document.createElement("a")
                    abody.setAttribute("data-small-spacing", "true")
                    abody.setAttribute("class", "css-nabodd-Button e167268t1")
                    let span = document.createElement("span")
                    // ContestID_zh  ContestSlug
                    if (t2rate[title] != undefined) {
                        span.innerText = t2rate[title]["ContestID_zh"]
                        abody.setAttribute("href", url + t2rate[title]["ContestSlug"])
                        abody.setAttribute("target", "_blank")
                    } else {
                        span.innerText = "对应周赛未知"
                        abody.setAttribute("href", "")
                        abody.setAttribute("target", "_self")
                    }
                    abody.appendChild(span)
                    pa.appendChild(abody)
                } else if (le == pa.childNodes.length) {  // 存在就直接替换
                    if (t2rate[title] != undefined) {
                        pa.childNodes[le - 1].childNodes[0].innerText = t2rate[title]["ContestID_zh"]
                        pa.childNodes[le - 1].setAttribute("href", url + t2rate[title]["ContestSlug"])
                        pa.childNodes[le - 1].setAttribute("target", "_blank")
                    } else {
                        pa.childNodes[le - 1].childNodes[0].innerText = "对应周赛未知"
                        pa.childNodes[le - 1].setAttribute("href", "")
                        pa.childNodes[le - 1].setAttribute("target", "_self")
                    }
                }
                le = pa.childNodes.length
                t1 = deepclone(title)
            } catch (e) {
                return
            }
        }

        setTimeout(getpb, 2000)
        id3 = setInterval(getpb, 1000)
        GM_setValue("pb", id3)
    } else {
        let all = GM_getValue("all", -1)
        let tag = GM_getValue("tag", -2)
        let pb = GM_getValue("pb", -3)
        clearInterval(all)
        clearInterval(tag)
        clearInterval(pb)
    }
})();


