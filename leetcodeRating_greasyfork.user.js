// ==UserScript==
// @name         LeetCodeRating｜English
// @namespace    https://github.com/zhang-wangz
// @version      1.1.0
// @license      MIT
// @description  LeetCodeRating The score of the weekly competition is displayed, and currently supports the tag page, question bank page, problem_list page and question page
// @author       小东是个阳光蛋(Leetcode Nickname of chinese site
// @leetcodehomepage   https://leetcode.cn/u/runonline/
// @homepageURL  https://github.com/zhang-wangz/LeetCodeRating
// @contributionURL https://www.showdoc.com.cn/2069209189620830
// @match        *://*leetcode.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      zerotrac.github.io
// @connect      raw.staticdn.net
// @connect      raw.githubusercontents.com
// @connect      raw.githubusercontent.com
// @require      https://gcore.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://gcore.jsdelivr.net/gh/andywang425/BLTH@4368883c643af57c07117e43785cd28adcb0cb3e/assets/js/library/layer.min.js
// @resource css https://gcore.jsdelivr.net/gh/andywang425/BLTH@d25aa353c8c5b2d73d2217b1b43433a80100c61e/assets/css/layer.css
// @grant        unsafeWindow
// @run-at       document-end
// @note         2022-12-29 1.1.0 add english site support
// ==/UserScript==

(function () {
    'use strict';
    let t2rate = {}
    let latestpb = {}
    let id1 = ""
    let id2 = ""
    let id3 = ""
    let id4 = ""
    let id5 = ""
    let id6 = ""
    let version = "1.1.0"
    let preDate
    let allUrl = "https://leetcode.com/problemset"
    let tagUrl = "https://leetcode.com/tag"
    let pblistUrl = "https://leetcode.com/problem-list"
    let pbUrl = "https://leetcode.com/problems"
    GM_addStyle(GM_getResourceText("css"));

    // 深拷贝
    function deepclone(obj) {
        let str = JSON.stringify(obj);
        return JSON.parse(str);
    }

    // 获取数字
    function getcontestNumber(url) {
        return parseInt(url.substr(15));
    }

    // 获取时间
    function getCurrentDate(format) {
        let now = new Date();
        let year = now.getFullYear(); //得到年份
        let month = now.getMonth(); //得到月份
        let date = now.getDate(); //得到日期
        let hour = now.getHours(); //得到小时
        let minu = now.getMinutes(); //得到分钟
        let sec = now.getSeconds(); //得到秒
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        let time = "";
        // 精确到天
        if (format == 1) {
            time = year + "年" + month + "月" + date + "日";
        }
        // 精确到分
        else if (format == 2) {
            time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
        }
        return time;
    }



    let t  // all and tag
    let t1, le // pb
    function getData() {
        try {
            let arr = document.querySelector("#__next > div > div > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.col-span-4.z-base.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(7) > div.-mx-4.md\\:mx-0 > div > div > div:nth-child(2)")
            // pb页面加载时直接返回
            if (arr == undefined) {
                return 
            }

            // 防止过多的无效操作
            if (t != undefined && t == arr.lastChild.innerHTML) {
                return
            }

            let childs = arr.childNodes
            for (let idx = 0; idx < childs.length; idx++) {
                let v = childs[idx]
                let length = v.childNodes.length
                let t = v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                let data = t.split(".")
                let id = data[0].trim()
                let nd = v.childNodes[length - 2].childNodes[0].innerHTML
                if (t2rate[id] != undefined) {
                    nd = t2rate[id]["Rating"]
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd
                } else {
                    let nd2ch = { "text-olive dark:text-dark-olive": "Easy", "text-yellow dark:text-dark-yellow": "Medium", "text-pink dark:text-dark-pink": "Hard" }
                    let cls = v.childNodes[length - 2].childNodes[0].getAttribute("class")
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd2ch[cls]
                }
            }
            t = deepclone(arr.lastChild.innerHTML)
        } catch (e) {
            return
        }
    }

    function getTagData() {
        if (!window.location.href.startsWith(tagUrl)) {
            clearInterval(id2)
            id3 = setInterval(getpb, 1)
            GM_setValue("pb", id3)
            return
        }
        try {
            let arr = document.querySelector("#app > div > div.ant-row.content__xk8m > div > div > div > table > tbody")
            if (t != undefined && t == arr.lastChild.innerHTML) {
                return
            }
            let childs = arr.childNodes
            for (const element of childs) {
                let v = element
                let length = v.childNodes.length
                let idText = v.childNodes[1].innerText
                let id = idText.trim()
                let nd = v.childNodes[length - 2].childNodes[0].innerHTML
                if (t2rate[id] != undefined) {
                    nd = t2rate[id]["Rating"]
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd
                } else {
                    let nd2ch = { "label label-success round": "Easy", "label label-warning round": "Medium", "label label-danger round": "Hard" }
                    let clr = v.childNodes[length - 2].childNodes[0].getAttribute("class")
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd2ch[clr]
                }
            }
            t = deepclone(arr.lastChild.innerHTML)
        } catch (e) {
            return
        }
    }


    function getPblistData() {
        if (!window.location.href.startsWith(pblistUrl)) {
            clearInterval(id5)
            id3 = setInterval(getpb, 1)
            GM_setValue("pb", id3)
            return
        }
        try {
            let arr = document.querySelector("#__next > div > div.mx-auto.mt-\\[50px\\].w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.bg-overlay-1.dark\\:bg-dark-overlay-1.md\\:bg-paper.md\\:dark\\:bg-dark-paper > div > div.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(2) > div.-mx-4.md\\:mx-0 > div > div > div:nth-child(2)")
            if (t != undefined && t == arr.lastChild.innerHTML) {
                return
            }
            let childs = arr.childNodes
            for (const element of childs) {
                let v = element
                let length = v.childNodes.length
                let t = v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                let data = t.split(".")
                let id = data[0].trim()
                let nd = v.childNodes[length - 2].childNodes[0].innerHTML

                if (t2rate[id] != undefined) {
                    nd = t2rate[id]["Rating"]
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd
                } else {
                    let nd2ch = { "text-olive dark:text-dark-olive": "Easy", "text-yellow dark:text-dark-yellow": "Medium", "text-pink dark:text-dark-pink": "Hard" }
                    let cls = v.childNodes[length - 2].childNodes[0].getAttribute("class")
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd2ch[cls]
                }
            }
            t = deepclone(arr.lastChild.innerHTML)
        } catch (e) {
            return
        }
    }

    function getpb() {
        if (!window.location.href.startsWith(pbUrl)) {
            clearInterval(id3)
            if (window.location.href.startsWith(allUrl)){
                id1 = setInterval(getData, 1)
                GM_setValue("all", id1)
            }else if (window.location.href.startsWith(tagUrl)) {
                id2 = setInterval(getTagData, 1)
                GM_setValue("tag", id2)
            } else if (window.location.href.startsWith(pblistUrl)) {
                id5 = setInterval(getPblistData, 1)
                GM_setValue("pblist", id5)
            }
            return
        }

        try {

            // 旧版的标题位置
            let t = document.querySelector("#app > div > div.main__2_tD > div.content__3fR6 > div > div.side-tools-wrapper__1TS9 > div > div.css-1gd46d6-Container.e5i1odf0 > div.css-jtoecv > div > div.tab-pane__ncJk.css-1eusa4c-TabContent.e5i1odf5 > div > div.css-101rr4k > div.css-v3d350")
            if (t == undefined){
                // 新版逻辑
                t = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div > div.w-full.px-5.pt-4 > div > div:nth-child(1) > div.flex-1 > div > div > span")
                if (t == undefined) {
                    t1 = "unknown"
                    return 
                }
                let data = t.innerText.split(".")
                let id = data[0].trim()
                let colorSpan = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div > div.w-full.px-5.pt-4 > div > div.mt-3.flex.space-x-4 > div:nth-child(1) > div")
                let pa = colorSpan.parentNode.parentNode
                if (t1 != undefined && t1 == id) {
                    return
                }
                // 新版统计难度分数并且修改
                let nd = colorSpan.getAttribute("class")
                let nd2ch = { "dark:text-dark-olive text-olive": "Easy", "dark:bg-dark-yellow text-yellow": "Medium", "dark:text-dark-pink text-pink": "Hard" }
                if (t2rate[id] != undefined) {
                    colorSpan.innerHTML = t2rate[id]["Rating"]
                } else {
                    for (let item in nd2ch) {
                        if (nd.toString().includes(item)) {
                            colorSpan.innerHTML = nd2ch[item]
                            break
                        }
                    }
                }
                // 新版逻辑，准备做周赛链接,如果已经不存在组件就执行操作
                let url = "https://leetcode.com/contest/"
                let zhUrl = "https://leetcode.com/contest/"
                let q = pa.lastChild
                let le = pa.childNodes.length
                if (q.textContent == "") {
                    let abody = document.createElement("a")
                    abody.setAttribute("data-small-spacing", "true")
                    abody.setAttribute("class", "css-nabodd-Button e167268t1")

                    let abody2 = document.createElement("a")
                    abody2.setAttribute("data-small-spacing", "true")
                    abody2.setAttribute("class", "css-nabodd-Button e167268t1")

                    let span = document.createElement("span")
                    let span2 = document.createElement("span")
                    // ContestID_en  ContestSlug
                    if (t2rate[id] != undefined) {
                        let contestUrl;
                        let num = getcontestNumber(t2rate[id]["ContestSlug"])
                        if (num < 83) { contestUrl = zhUrl } else { contestUrl = url }
                        span.innerText = t2rate[id]["ContestID_en"]
                        span2.innerText = t2rate[id]["ProblemIndex"]

                        abody.setAttribute("href", contestUrl + t2rate[id]["ContestSlug"])
                        abody.setAttribute("target", "_blank")
                        abody.removeAttribute("hidden")

                        abody2.setAttribute("href", contestUrl + t2rate[id]["ContestSlug"] + "/problems/" + t2rate[id]["TitleSlug"])
                        abody2.setAttribute("target", "_blank")
                        abody2.removeAttribute("hidden")
                    } else {
                        span.innerText = "对应周赛未知"
                        abody.setAttribute("href", "")
                        abody.setAttribute("target", "_self")
                        abody.setAttribute("hidden", "true")

                        span2.innerText = "未知"
                        abody2.setAttribute("href", "")
                        abody2.setAttribute("target", "_self")
                        abody2.setAttribute("hidden", "true")
                    }
                    abody.appendChild(span)
                    abody2.appendChild(span2)
                    pa.appendChild(abody)
                    pa.appendChild(abody2)
                } else if(q.textContent.charAt(0) == "Q" || q.textContent == "未知") {  // 存在就直接替换
                    if (t2rate[id] != undefined) {
                        let contestUrl;
                        let num = getcontestNumber(t2rate[id]["ContestSlug"])
                        if (num < 83) { contestUrl = zhUrl } else { contestUrl = url }
                        pa.childNodes[le - 2].childNodes[0].innerText = t2rate[id]["ContestID_en"]
                        pa.childNodes[le - 2].setAttribute("href", contestUrl + t2rate[id]["ContestSlug"])
                        pa.childNodes[le - 2].setAttribute("target", "_blank")
                        pa.childNodes[le - 2].removeAttribute("hidden")

                        pa.childNodes[le - 1].childNodes[0].innerText = t2rate[id]["ProblemIndex"]
                        pa.childNodes[le - 1].setAttribute("href", contestUrl + t2rate[id]["ContestSlug"] + "/problems/" + t2rate[id]["TitleSlug"])
                        pa.childNodes[le - 1].setAttribute("target", "_blank")
                        pa.childNodes[le - 1].removeAttribute("hidden")
                    } else {
                        pa.childNodes[le - 2].childNodes[0].innerText = "对应周赛未知"
                        pa.childNodes[le - 2].setAttribute("href", "")
                        pa.childNodes[le - 2].setAttribute("target", "_self")
                        pa.childNodes[le - 2].setAttribute("hidden", "true")

                        pa.childNodes[le - 1].childNodes[0].innerText = "未知"
                        pa.childNodes[le - 1].setAttribute("href", "")
                        pa.childNodes[le - 1].setAttribute("target", "_self")
                        pa.childNodes[le - 1].setAttribute("hidden", "true")
                    }
                }
                t1 = deepclone(id)

            }else {
                // 旧版逻辑，使用参数t和t1，分别代表标题的html和标题id

                // 旧版题目左侧列表里面所有分数
                let pbAll = document.querySelector("body > div.question-picker-detail__2A9V.show__GfjG > div.question-picker-detail-menu__3NQq.show__3hiR > div.lc-theme-dark.question-picker-questions-wrapper__13qM > div")
                if (pbAll != undefined) {
                    let childs = pbAll.childNodes
                    for (const element of childs) {
                        let v = element
                        let length = v.childNodes.length
                        let t = v.childNodes[0].childNodes[1].innerText
                        let data = t.split(" ")[0]
                        let id = data.slice(1)
                        let nd = v.childNodes[length - 1].childNodes[0].innerText
                        if (t2rate[id] != undefined) {
                            nd = t2rate[id]["Rating"]
                            v.childNodes[length - 1].childNodes[0].innerText = nd
                        }
                    }
                }
                // 旧版标题修改位置
                let data = t.innerText.split(".")
                let id = data[0].trim()
                let colorSpan = document.querySelector("#app > div > div.main__2_tD > div.content__3fR6 > div > div.side-tools-wrapper__1TS9 > div > div.css-1gd46d6-Container.e5i1odf0 > div.css-jtoecv > div > div.tab-pane__ncJk.css-1eusa4c-TabContent.e5i1odf5 > div > div.css-101rr4k > div.css-10o4wqw > div")
                let pa = colorSpan.parentNode
                if ((t1 != undefined && t1 == id) && (le != undefined && le <= pa.childNodes.length)) {
                    return
                }
                // 统计难度分数
                let nd = colorSpan.getAttribute("diff")
                let nd2ch = { "easy": "Easy", "medium": "Medium", "hard": "Hard" }
                if (t2rate[id] != undefined) {
                    colorSpan.innerHTML = t2rate[id]["Rating"]
                } else {
                    colorSpan.innerHTML = nd2ch[nd]
                }
                // 准备做周赛链接,如果已经不存在组件就执行操作
                let url = "https://leetcode.com/contest/"
                let zhUrl = "https://leetcode.com/contest/"
                if (le == undefined || le != pa.childNodes.length) {

                    let button = document.createElement("button")
                    button.setAttribute("class", "btn__r7r7 css-1rdgofi")
                    let abody = document.createElement("a")
                    abody.setAttribute("style", "color: #546E7A;")

                    let button2 = document.createElement("button")
                    button2.setAttribute("class", "btn__r7r7 css-1rdgofi")
                    let abody2 = document.createElement("a")
                    abody2.setAttribute("style", "color: #546E7A;")

                    // ContestID_en  ContestSlug
                    if (t2rate[id] != undefined) {
                        let contestUrl;
                        let num = getcontestNumber(t2rate[id]["ContestSlug"])
                        if (num < 83) { contestUrl = zhUrl } else { contestUrl = url }
                        abody.innerText = t2rate[id]["ContestID_en"]
                        abody2.innerText = t2rate[id]["ProblemIndex"]

                        abody.setAttribute("href", contestUrl + t2rate[id]["ContestSlug"])
                        abody.setAttribute("target", "_blank")
                        abody.removeAttribute("hidden")

                        abody2.setAttribute("href", contestUrl + t2rate[id]["ContestSlug"] + "/problems/" + t2rate[id]["TitleSlug"])
                        abody2.setAttribute("target", "_blank")
                        abody2.removeAttribute("hidden")
                    } else {
                        span.innerText = "对应周赛未知"
                        abody.setAttribute("href", "")
                        abody.setAttribute("target", "_self")
                        abody.setAttribute("hidden", "true")

                        span2.innerText = "未知"
                        abody2.setAttribute("href", "")
                        abody2.setAttribute("target", "_self")
                        abody2.setAttribute("hidden", "true")
                    }

                    button.appendChild(abody)
                    button2.appendChild(abody2)
                    pa.appendChild(button)
                    pa.appendChild(button2)
                } else if (le == pa.childNodes.length) {  // 存在就直接替换
                    if (t2rate[id] != undefined) {
                        let contestUrl;
                        let num = getcontestNumber(t2rate[id]["ContestSlug"])
                        if (num < 83) { contestUrl = zhUrl } else { contestUrl = url }
                        pa.childNodes[le - 2].childNodes[0].innerText = t2rate[id]["ContestID_en"]
                        pa.childNodes[le - 2].setAttribute("href", contestUrl + t2rate[id]["ContestSlug"])
                        pa.childNodes[le - 2].setAttribute("target", "_blank")
                        pa.childNodes[le - 2].removeAttribute("hidden")

                        pa.childNodes[le - 1].childNodes[0].childNodes[0].innerText = t2rate[id]["ProblemIndex"]
                        pa.childNodes[le - 1].childNodes[0].setAttribute("href", contestUrl + t2rate[id]["ContestSlug"] + "/problems/" + t2rate[id]["TitleSlug"])
                        pa.childNodes[le - 1].childNodes[0].setAttribute("target", "_blank")
                        pa.childNodes[le - 1].childNodes[0].removeAttribute("hidden")
                    } else {
                        pa.childNodes[le - 2].childNodes[0].innerText = "对应周赛未知"
                        pa.childNodes[le - 2].setAttribute("href", "")
                        pa.childNodes[le - 2].setAttribute("target", "_self")
                        pa.childNodes[le - 2].setAttribute("hidden", "true")

                        pa.childNodes[le - 1].childNodes[0].childNodes[0].innerText = "未知"
                        pa.childNodes[le - 1].childNodes[0].setAttribute("href", "")
                        pa.childNodes[le - 1].childNodes[0].setAttribute("target", "_self")
                        pa.childNodes[le - 1].childNodes[0].setAttribute("hidden", "true")
                    }
                }
                le = pa.childNodes.length
                t1 = deepclone(id)
            }
        } catch (e) {
            return
        }
    }

    t2rate = JSON.parse(GM_getValue("t2ratedb", "{}").toString())
    latestpb = JSON.parse(GM_getValue("latestpb", "{}").toString())
    preDate = GM_getValue("preDate", "")
    let now = getCurrentDate(1)
    if (t2rate["idx13"] == undefined || (preDate == "" || preDate != now)) {
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://raw.staticdn.net/zerotrac/leetcode_problem_rating/main/data.json' + "?timeStamp=" + new Date().getTime(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
            },
            onload: function (res) {
                if (res.status === 200) {
                    // 保留唯一标识
                    t2rate = {}
                    let dataStr = res.response
                    let json = eval(dataStr)
                    for (const element of json) {
                        t2rate[element.ID] = element
                        t2rate[element.ID]["Rating"] = Number.parseInt(Number.parseFloat(element["Rating"]) + 0.5)
                    }
                    t2rate["idx13"] = -13
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
        });
    }
    
    function clearAndStart(start, func, timeout) {
        let lst = ['all', 'tag', 'pb', 'company', 'pblist', 'search']
        lst.forEach(each => {
            if (each !== start) {
                let tmp = GM_getValue(each, -1)
                clearInterval(tmp)
            }
        })
        if (start !== "") {
            let cnt = lst.indexOf(start) + 1
            switch (cnt) {
                case 1:
                    id1 = setInterval(func, timeout)
                    GM_setValue(start, id1)
                    break
                case 2:
                    id2 = setInterval(func, timeout)
                    GM_setValue(start, id2)
                    break 
                case 3:
                    id3 = setInterval(func, timeout)
                    GM_setValue(start, id3)
                    break   
                case 4:
                    id4 = setInterval(func, timeout)
                    GM_setValue(start, id4)
                    break
                case 5:
                    id5 = setInterval(func, timeout)
                    GM_setValue(start, id5)
                    break
                case 6:
                    id6 = setInterval(func, timeout)
                    GM_setValue(start, id6)
                    break
            }
        }
    }

    [...document.querySelectorAll('*')].forEach(item => {
        item.oncopy = function (e) {
            e.stopPropagation();
        }
    });

    if (window.location.href.startsWith(allUrl)) {
        // 版本更新机制
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://raw.staticdn.net/zhang-wangz/LeetCodeRating/english/version.json' + "?timeStamp=" + new Date().getTime(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
            },
            onload: function (res) {
                if (res.status === 200) {
                    console.log("enter home page check version once...")
                    let dataStr = res.response
                    let json = JSON.parse(dataStr)
                    let v = json["version"]
                    let upcontent = json["content"]
                    if (v != version) {
                        layer.open({
                            content: 'Update notice: <br/>leetcodeRating difficulty plugin has a new version, please go to update ~ <br/>' + "update content: <br/>" + upcontent,
                            yes: function (index, layer0) {
                                let c = window.open("https://github.com/zhang-wangz/LeetCodeRating/raw/english/leetcodeRating_greasyfork.user.js")
                                c.close()
                                layer.close(index)
                            }
                        });
                    } else {
                        console.log("leetcodeRating难度分插件当前已经是最新版本~")
                    }
                }
            },
            onerror: function (err) {
                console.log('error')
                console.log(err)
            }
        });

        clearAndStart('all', getData, 1)
    } else if (window.location.href.startsWith(tagUrl)) {
        clearAndStart('tag', getTagData, 1)
    } else if (window.location.href.startsWith(pbUrl)) {
        clearAndStart('pb', getpb, 1)
        let id = setInterval(getData, 1)
        GM_setValue("all", id)
    } else if (window.location.href.startsWith(pblistUrl)) {
        clearAndStart('pblist', getPblistData, 1)
    } else {
        clearAndStart('', undefined, 1)
    }
})();
