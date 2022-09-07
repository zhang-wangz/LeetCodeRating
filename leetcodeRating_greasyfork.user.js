// ==UserScript==
// @name         LeetCodeRating｜显示力扣周赛难度分
// @namespace    https://github.com/zhang-wangz
// @version      1.1.1
// @license      MIT
// @description  LeetCodeRating 力扣周赛分数显现，目前支持tag页面和题库页面
// @author       小东在刷题
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @homepageURL  https://github.com/zhang-wangz/LeetCodeRating
// @contributionURL https://www.showdoc.com.cn/2069209189620830
// @match        *://*leetcode.cn/problemset/*
// @match        *://*leetcode.cn/tag/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      zerotrac.github.io
// @grant        unsafeWindow
// @note         2022-09-07 1.1.0 支持tag页面和题库页面显示匹配的周赛分难度
// @note         2022-09-07 1.1.0 分数数据出自零神项目
// @note         2022-09-07 1.1.1 修改一些小bug
// ==/UserScript==

(function () {
    // 'use strict';
    var t2rate = {}
    var id1 = ""
    var id2 = ""
    var allUrl = "https://leetcode.cn/problemset/"
    var tagUrl = "https://leetcode.cn/tag"
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
        let head = document.querySelector("#__next > div > div > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.col-span-4.z-base.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(7) > div.-mx-4.md\\:mx-0 > div > div > div.border-b.border-divider-border-2.dark\\:border-dark-divider-border-2 > div")
        let score = document.createElement('div')
        score.setAttribute("colspan", "1")
        score.setAttribute("role", "columnheader")
        score.setAttribute("style", "box-sizing:border-box;flex:75 0 auto;min-width:0px;width:75px;cursor:pointer")
        score.setAttribute("class", "mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3 group hover:text-gray-7 dark:hover:text-dark-gray-7")
        score.innerHTML = '<div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis">周赛分</div></div>'
        head.insertBefore(score, head.childNodes[5])

        let flag = false
        function getData() {
            let arr = document.querySelector("#__next > div > div > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.col-span-4.z-base.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(7) > div.-mx-4.md\\:mx-0 > div > div > div:nth-child(2)")
            let childs = arr.childNodes
            for (let idx = 0; idx < childs.length; idx++) {
                let v = childs[idx]
                let t = v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                let data = t.split(".")
                let title = data[data.length - 1].trim()
                let node = document.createElement('div')
                node.setAttribute("mark", "1")
                node.setAttribute("role", "cell")
                node.setAttribute("style", "box-sizing:border-box;flex:75 0 auto;min-width:0px;width:75px")
                node.setAttribute("class", "mx-2 py-[11px]")
                let color = v.childNodes[4].childNodes[0]
                let span = document.createElement("span")
                span.setAttribute("class", color.getAttribute("class"))
                if (t2rate[title] == undefined) {
                    span.innerHTML = "未知"
                } else {
                    span.innerHTML = t2rate[title]
                }
                node.appendChild(span)
                if (!flag) {
                    v.insertBefore(node, v.childNodes[5])
                } else {
                    if (v.childNodes.length == 7) {
                        v.childNodes[5].innerHTML = node.innerHTML
                    } else {
                        v.insertBefore(node, v.childNodes[5])
                    }
                }
            }
            flag = true
        }
        setTimeout(getData, 2000)
        id1 = setInterval(getData, 1000)
        GM_setValue("all", id1)
    } else if (window.location.href.startsWith(tagUrl)) {
        let all = GM_getValue("all", -1)
        clearInterval(all)
        function getTagHeader() {
            let head = document.querySelector("#lc-content > div > div.css-207dbg-TableContainer.ermji1u1 > div > section > div > div.css-ibx34q-antdPaginationOverride-layer1-dropdown-layer1-hoverOverlayBg-layer1-card-layer1-layer0 > div > div > div > div > div > div > table > thead > tr")
            let score = document.createElement('th')
            score.setAttribute("class", "ant-table-cell ant-table-column-has-sorters")
            score.innerHTML = '<div class="ant-table-column-sorters"><span>竞赛分</span><span class="ant-table-column-sorter ant-table-column-sorter-full"><span class="ant-table-column-sorter-inner"><span role="img" aria-label="caret-up" class="anticon anticon-caret-up ant-table-column-sorter-up"></span></span></span></div>'
            head.insertBefore(score, head.childNodes[4])
        }

        let t
        function getTagData() {
            let arr = document.querySelector("#lc-content > div > div.css-207dbg-TableContainer.ermji1u1 > div > section > div > div.css-ibx34q-antdPaginationOverride-layer1-dropdown-layer1-hoverOverlayBg-layer1-card-layer1-layer0 > div > div > div > div > div > div > table > tbody")
            if (t != undefined && t == arr.firstChild.innerHTML) {
                return
            }
            let childs = arr.childNodes
            for (let idx = 0; idx < childs.length; idx++) {
                let v = childs[idx]
                let t = v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                let data = t.split(".")
                let title = data[data.length - 1].trim()
                let color = v.childNodes[3].childNodes[0]
                let node = document.createElement('td')
                node.setAttribute("class", "ant-table-cell")
                let span = document.createElement("span")
                span.setAttribute("class", color.getAttribute("class"))
                if (t2rate[title] == undefined) {
                    span.innerText = "未知"
                } else {
                    span.innerText = t2rate[title]
                }
                node.appendChild(span)
                v.insertBefore(node, v.childNodes[4])
            }
            t = deepclone(arr.firstChild.innerHTML)
        }
        setTimeout(getTagData, 2200)
        setTimeout(getTagHeader, 2200)
        id2 = setInterval(getTagData, 1200)
        GM_setValue("tag", id2)
    }
})();



