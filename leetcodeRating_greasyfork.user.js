// ==UserScript==
// @name         LeetCodeRating｜显示力扣周赛难度分
// @namespace    https://github.com/zhang-wangz
// @version      1.1.5
// @license      MIT
// @description  LeetCodeRating 力扣周赛分数显现，目前支持tag页面和题库页面
// @author       小东是个阳光蛋(力扣名
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @homepageURL  https://github.com/zhang-wangz/LeetCodeRating
// @contributionURL https://www.showdoc.com.cn/2069209189620830
// @match        *://*leetcode.cn/problemset/*
// @match        *://*leetcode.cn/tag/*
// @match        *://*leetcode.cn/problems/*/
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
// ==/UserScript==

(function () {
    // 'use strict';
    var t2rate = {}
    var id1 = ""
    var id2 = ""
    var id3 = ""
    var allUrl = "https://leetcode.cn/problemset"
    var tagUrl = "https://leetcode.cn/tag"
    var pbUrl = "https://leetcode.cn/problems"
    GM_xmlhttpRequest({
        method: "get",
        url: 'https://zerotrac.github.io/leetcode_problem_rating/data.json',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        },
        onload: function (res) {
            if (res.status === 200) {
                var data = jQuery.parseHTML(res.response)
                let dataStr = data[0].data
                let json = jQuery.parseJSON(dataStr)
                for (let i = 0; i < json.length; i++) {
                    t2rate[json[i].TitleZH] = Number.parseInt(json[i].Rating)
                }
            }
        },
        onerror: function (err) {
            console.log('error')
            console.log(err)
        }
    });

    function deepclone(obj) {
        let str = JSON.stringify(obj)
        return JSON.parse(str)
    }

    if (window.location.href.startsWith(allUrl)) {
        let tag = GM_getValue("tag", -2)
        clearInterval(tag)
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
                        nd = t2rate[title]
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

        let t
        let url
        function getTagData() {
            if (url != undefined && url != window.location.href) {
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
                        nd = t2rate[title]
                        v.childNodes[3].childNodes[0].innerHTML = nd
                    }
                }
                t = deepclone(arr.lastChild.innerHTML)
                url = window.location.href
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
        let tmp
        let lurl
        function getpb() {
            if (lurl != undefined && lurl != window.location.href) {
                location.reload()
            }
            let url = window.location.href.split("/")
            if (url[url.length - 3] != "problems") {
                return
            }
            try {
                let t = document.querySelector("#question-detail-main-tabs > div.css-1qqaagl-layer1.css-12hreja-TabContent.e16udao5 > div > div.css-xfm0cl-Container.eugt34i0 > h4 > a")
                let data = t.innerText.split(".")
                let title = data[data.length - 1].trim()
                let colorSpan = document.querySelector("#question-detail-main-tabs > div.css-1qqaagl-layer1.css-12hreja-TabContent.e16udao5 > div > div.css-xfm0cl-Container.eugt34i0 > div > span:nth-child(2)")
                if (tmp != undefined && tmp === colorSpan.parentNode.childNodes.length) {
                    return
                }
                let span = document.createElement("span")
                span.setAttribute("class", colorSpan.getAttribute("class"))
                span.setAttribute("data-degree", colorSpan.getAttribute("data-degree"))
                if (t2rate[title] != undefined) {
                    span.innerHTML = "难度分: " + t2rate[title]
                } else {
                    span.innerHTML = "难度分未知"
                }
                let pa = colorSpan.parentNode
                pa.insertBefore(span, pa.childNodes[2])
                tmp = deepclone(pa.childNodes.length)
                lurl = window.location.href
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


