// ==UserScript==
// @name         LeetCodeRating｜显示力扣周赛难度分
// @namespace    https://github.com/zhang-wangz
// @version      1.6.3
// @license      MIT
// @description  LeetCodeRating 力扣周赛分数显现，目前支持tag页面,题库页面,company页面,problem_list页面和题目页面
// @author       小东是个阳光蛋(力扣名
// @leetcodehomepage   https://leetcode.cn/u/runonline/
// @homepageURL  https://github.com/zhang-wangz/LeetCodeRating
// @contributionURL https://www.showdoc.com.cn/2069209189620830
// @match        *://*leetcode.cn/*
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
// @note         2022-09-09 1.2.2 在具体问题页面，翻译成英文后，数据消失，是因为只保存了中文，增加英文对应数据
// @note         2022-09-10 1.2.3 修复在具体问题页面，快速切换导致的数据缺失问题
// @note         2022-09-11 1.2.4 重构所有实现，取消所有依赖包优化性能，同步优化未知周赛时pb页面隐藏周赛链接
// @note         2022-09-11 1.2.5 fix 缓存
// @note         2022-09-11 1.2.6 fix当 hover题目后面的反馈按钮的时候,会不断的添加周赛link的bug
// @note         2022-09-11 1.2.7 更新具体问题页面， 题目侧边弹出页难度分显示
// @note         2022-09-12 1.2.8 重构数据标识为题目id，因为lc不计算剑指offer，lcp这种题号，id作为标识更加准确些
// @note         2022-09-12 1.2.9 修改数据唯一标识，使得用户数据缓存更新
// @note         2022-09-12 1.2.10 修复刷新机制导致的bug
// @note         2022-09-14 1.3.0 支持company页面
// @note         2022-09-14 1.3.1 支持力扣复制时去除署名
// @note         2022-09-14 1.3.2 修复力扣新增的题库和tag页面 设置按钮里点击显示企业之后出现的bug
// @note         2022-09-22 1.3.3 增加具体问题页面竞赛题属于Q几
// @note         2022-10-08 1.3.4 题库页面增加灵茶の试炼按钮
// @note         2022-10-08 1.3.5 更换灵茶按钮颜色使得更加美观
// @note         2022-10-08 1.3.6 增加problem_list页面的分数展示
// @note         2022-10-09 1.3.7 使用document-end功能，去除加载上的1s延迟并且增加脚本更新机制
// @note         2022-10-09 1.3.8 更新connect list
// @note         2022-10-09 1.3.9 增加时间戳使GM_xmlhttpRequest缓存机制失效
// @note         2022-10-09 1.3.10 修正时间戳标识
// @note         2022-10-10 1.4.0 增加首页近日灵茶
// @note         2022-10-10 1.4.1 修复更新频率
// @note         2022-10-10 1.4.2 修改layer名称
// @note         2022-10-11 1.4.3 修复难度数据过长和page页面名称，考虑到github文件加载缓存机制，更换检查频率到首页
// @note         2022-10-11 1.4.4 修复灵茶里面特殊字符<造成的显示问题
// @note         2022-10-12 1.4.5 修复company页面
// @note         2022-10-13 1.4.6 修复因为缓存导致可能一天出现两次不同灵茶的问题
// @note         2022-10-13 1.4.7 修复脚本版本bug
// @note         2022-10-19 1.4.8 兼容新版pb内测页面
// @note         2022-10-19 1.4.9 版本获取github CDN网站维护，更新使用原生网站
// @note         2022-10-31 1.4.10 修复之前就有的缺陷，当周赛在中文站最早的第83周赛之前时，跳转到英文站
// @note         2022-10-31 1.5.0 cdn网站维护结束，还原为cdn使用，同时修复灵茶抓取格式，如果不存在该url，就不读取
// @note         2022-11-11 1.5.1 增加首页搜索页面的题目难度分并且修复新版题目页面难度分，同时整理代码结构
// @note         2022-11-12 1.5.2 整理目录结构
// @note         2022-11-14 1.5.3 修复版本目录结构
// @note         2022-11-14 1.5.4 修复layer弹出窗关闭功能
// @note         2022-11-22 1.5.5 修复当获取茶数据为空时改为默认值处理
// @note         2022-11-22 1.5.6 修复当获取茶数据为空时改为默认值处理
// @note         2022-12-07 1.5.7 修改获取rating分数也使用cdn方式
// @note         2022-12-21 1.5.8 跟随新版ui页面设计进行修改
// @note         2022-12-29 1.5.9 修复已知问题
// @note         2022-12-29 1.6.0 修复力扣开启darkmode时候，提示语显示异常
// @note         2022-12-31 1.6.1 使新版ui中题目提交记录界面趋向于旧版设计
// @note         2022-12-31 1.6.2 修复版本异常
// @note         2022-12-31 1.6.3 修改cdn访问方式和频率
// ==/UserScript==

(function () {
    'use strict';

    let id1 = ""
    let id2 = ""
    let id3 = ""
    let id4 = ""
    let id5 = ""
    let id6 = ""
    let version = "1.6.3"

    // rank 相关数据
    let t2rate = JSON.parse(GM_getValue("t2ratedb", "{}").toString())
    let latestpb = JSON.parse(GM_getValue("latestpb", "{}").toString())
    let preDate = GM_getValue("preDate", "")

    // 题目提交数据
    let pbSubmissionInfo = JSON.parse(GM_getValue("pbSubmissionInfo", "{}").toString())
    let questiontag = ""
    let updateFlag = false

    // url相关数据
    const allUrl = "https://leetcode.cn/problemset"
    const tagUrl = "https://leetcode.cn/tag"
    const companyUrl = "https://leetcode.cn/company"
    const pblistUrl = "https://leetcode.cn/problem-list"
    const pbUrl = "https://leetcode.cn/problems"
    const searchUrl = "https://leetcode.cn/search"

    // 常量数据
    const dummySend = XMLHttpRequest.prototype.send
    const regPbSubmission = 'https://leetcode.cn/problems/.*/submissions/.*';
    const queryPbSubmission ='\n    query submissionList($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!, $lang: String, $status: SubmissionStatusEnum) {\n  submissionList(\n    offset: $offset\n    limit: $limit\n    lastKey: $lastKey\n    questionSlug: $questionSlug\n    lang: $lang\n    status: $status\n  ) {\n    lastKey\n    hasNext\n    submissions {\n      id\n      title\n      status\n      statusDisplay\n      lang\n      langName: langVerboseName\n      runtime\n      timestamp\n      url\n      isPending\n      memory\n      submissionComment {\n        comment\n      }\n    }\n  }\n}\n    '
    const langMap = {
        "所有语言": null,
        "C++" : "cpp",
        "Java" : "java",
        "Python": "python",
        "Python3": "python3",
        "MySQL": "mysql",
        "MS SQL Server": "mssql",
        "Oracle": "oraclesql",
        "C": "c",
        "C#": "csharp",
        "JavaScript": "javascript",
        "Ruby": "ruby",
        "Bash": "bash",
        "Swift": "swift",
        "Go": "golang",
        "Scala": "scala",
        "HTML": "html",
        "Python ML": "pythonml",
        "Kotlin": "kotlin",
        "Rust": "rust",
        "PHP": "php",
        "TypeScript": "typescript",
        "Racket": "racket",
        "Erlang": "erlang",
        "Elixir": "elixir",
        "Dart": "dart",
    }
    const statusMap = {
        "所有状态" : null,
        "执行通过" : "AC",
        "错误解答" : "WA",
        "超出内存限制" : "MLE",
        "超出输出限制" : "OLE",
        "超出时间限制" : "TLE",
        "执行出错" : "RE",
        "内部出错" : "IE",
        "编译出错" : "CE",
        "超时" : "TO",
    }

    // 如果有数据就会直接初始化，否则初始化为空
    pbSubmissionInfo = JSON.parse(GM_getValue("pbSubmissionInfo", "{}").toString())
    GM_addStyle(GM_getResourceText("css"));


    // lc 基础req
    let baseReq = (query, variables, successFuc, type) => {
        //请求参数
        var list = { "query":query, "variables":variables };
        //
        $.ajax({
            // 请求方式
            type : type,
            // 请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            // 请求地址
            url : "https://leetcode.cn/graphql/",
            // 数据，json字符串
            data : JSON.stringify(list),
            // 同步方式
            async: false,
            xhrFields: {
                withCredentials: true
            },
            // 请求成功
            success : function(result) {
                successFuc(result)
            },
            // 请求失败，包含具体的错误信息
            error : function(e){
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    };
    // 修改参数
    let submissionLst = []
    let next = true

    let postReq = (query, variables, successFuc) => {
        baseReq(query, variables, successFuc, "POST")
    }

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

    function checksolve(){
        layer.open({
            type: 1 // Page 层类型
            ,area: ['650px', '450px']
            ,title: '题解说明'
            ,shade: 0.6 // 遮罩透明度
            ,maxmin: true // 允许全屏最小化
            ,anim: 5 // 0-6的动画形式，-1不开启
            ,content: `<pre style="padding:20px;color:#000;">${latestpb["solve"]['str']}</pre>`
        });
    }

    function checkout(){
        layer.open({
            type: 1 // Page 层类型
            ,area: ['650px', '450px']
            ,title: '输入/输出'
            ,shade: 0.6 // 遮罩透明度
            ,maxmin: true // 允许全屏最小化
            ,anim: 5 // 0-6的动画形式，-1不开启
            ,content: `<pre style="padding:20px;color:#000;">${latestpb["out"]["str"]}</pre>`
        });
    }

    function checktrans(){
        latestpb["pb"]["str"] = latestpb["pb"]["str"].replace('<', "&lt;").replace('>', "&gt;")
        layer.open({
            type: 0
            ,area: ['650px', '450px']
            ,title: '中文翻译'
            ,shade: 0.6 // 遮罩透明度
            ,maxmin: true // 允许全屏最小化
            ,anim: 5 // 0-6的动画形式，-1不开启
            ,content: `<pre style="padding:20px;color:#000;">${latestpb["pb"]["str"]}</pre>`
        });
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
            let head = document.querySelector("#__next > div > div > div.grid.grid-cols-4.gap-4.md\\:grid-cols-3.lg\\:grid-cols-4.lg\\:gap-6 > div.col-span-4.z-base.md\\:col-span-2.lg\\:col-span-3 > div.relative.flex.items-center.space-x-4.py-3.my-4.-ml-4.overflow-hidden.pl-4")
            let l = head.childNodes.length
            let last = head.childNodes[l - 1]
            if (arr.childNodes[0].childNodes[2].childNodes[0].childNodes[0].innerText != "题解") {
                t2rate = JSON.parse(GM_getValue("t2ratedb", "{}").toString())
                latestpb = JSON.parse(GM_getValue("latestpb", "{}").toString())
                let div = document.createElement('div')
                div.setAttribute("role", "row")
                div.setAttribute("style", "display:flex;flex:1 0 auto;min-width:0px")
                div.setAttribute("class", "odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4")
                if (latestpb["url"]["url"] != "") {
                    div.innerHTML = `<div role="cell" style="box-sizing:border-box;flex:60 0 auto;min-width:0px;width:60px" class="mx-2 py-[11px]">${latestpb["date"]["str"]}</div><div \
                    role="cell" style="box-sizing:border-box;flex:160 0 auto;min-width:0px;width:160px" class="mx-2 py-[11px]"><div class="max-w-[302px] flex items-center"><div class="overflow-hidden"><div class="flex items-center"><div class="truncate overflow-hidden"><a href="${latestpb["url"]["url"]}"  target="_blank" class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s">&nbsp近日灵茶</a></div></div></div></div></div><div \
                    role="cell" style="box-sizing:border-box;flex:96 0 auto;min-width:0px;width:96px" class="mx-2 py-[11px]"><span class="flex items-center space-x-2 text-label-1 dark:text-dark-label-1"><a href="javascript:;" class="truncate" aria-label="solution">题解</a></span></div><div \
                    role="cell" style="box-sizing:border-box;flex:82 0 auto;min-width:0px;width:82px" class="mx-2 py-[11px]"><span><a href="javascript:;" class="truncate" aria-label="solution">输入/输出</a></span></div><div \
                    role="cell" style="box-sizing:border-box;flex:60 0 auto;min-width:0px;width:60px" class="mx-2 py-[11px]"><span class="text-purple dark:text-dark-purple">${latestpb['nd']['str'].substr(0,4)}</span></div><div \
                    role="cell" style="box-sizing:border-box;flex:88 0 auto;min-width:0px;width:88px" class="mx-2 py-[11px]"><span><a href="javascript:;" >中文翻译</a></span></div>`
                }else {
                    div.innerHTML = `<div role="cell" style="box-sizing:border-box;flex:60 0 auto;min-width:0px;width:60px" class="mx-2 py-[11px]">${latestpb["date"]["str"]}</div><div \
                    role="cell" style="box-sizing:border-box;flex:160 0 auto;min-width:0px;width:160px" class="mx-2 py-[11px]"><div class="max-w-[302px] flex items-center"><div class="overflow-hidden"><div class="flex items-center"><div class="truncate overflow-hidden"><p class="h-5">&nbsp近日灵茶</p></div></div></div></div></div><div \
                    role="cell" style="box-sizing:border-box;flex:96 0 auto;min-width:0px;width:96px" class="mx-2 py-[11px]"><span class="flex items-center space-x-2 text-label-1 dark:text-dark-label-1"><a href="javascript:;" class="truncate" aria-label="solution">题解</a></span></div><div \
                    role="cell" style="box-sizing:border-box;flex:82 0 auto;min-width:0px;width:82px" class="mx-2 py-[11px]"><span><a href="javascript:;" class="truncate" aria-label="solution">输入/输出</a></span></div><div \
                    role="cell" style="box-sizing:border-box;flex:60 0 auto;min-width:0px;width:60px" class="mx-2 py-[11px]"><span class="text-purple dark:text-dark-purple">${latestpb['nd']['str'].substr(0,4)}</span></div><div \
                    role="cell" style="box-sizing:border-box;flex:88 0 auto;min-width:0px;width:88px" class="mx-2 py-[11px]"><span><a href="javascript:;" >中文翻译</a></span></div>`
                }

                div.childNodes[2].childNodes[0].childNodes[0].addEventListener("click", (e)=>{
                    e.preventDefault();
                    checksolve();
                });
                div.childNodes[3].childNodes[0].childNodes[0].addEventListener("click", (e)=> {
                    e.preventDefault();
                    checkout();
                })
                div.childNodes[5].childNodes[0].childNodes[0].addEventListener("click", (e)=> {
                    e.preventDefault();
                    checktrans();
                })
                arr.insertBefore(div, arr.childNodes[0])
            }

            // 防止过多的无效操作
            if (t != undefined && t == arr.lastChild.innerHTML
                && last.childNodes[0].childNodes[1] instanceof Text
                && last.childNodes[0].childNodes[1].textContent == "灵茶の试炼") {
                return
            }

            let childs = arr.childNodes
            for (let idx = 1; idx < childs.length; idx++) {
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
                    let nd2ch = { "text-olive dark:text-dark-olive": "简单", "text-yellow dark:text-dark-yellow": "中等", "text-pink dark:text-dark-pink": "困难" }
                    let cls = v.childNodes[length - 2].childNodes[0].getAttribute("class")
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd2ch[cls]
                }
            }
            t = deepclone(arr.lastChild.innerHTML)

            if (last.childNodes[0].childNodes[1].textContent != "灵茶の试炼") {
                let tea = document.createElement("a")
                tea.innerHTML = '<div class="flex items-center space-x-2 whitespace-nowrap rounded-full px-4 py-[10px] leading-tight pointer-event-none text-base bg-fill-3 dark:bg-dark-fill-3 text-label-2 dark:text-dark-label-2 hover:bg-fill-2 dark:hover:bg-dark-fill-2 hover:text-label-2 dark:hover:text-dark-label-2"><svg \
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="text-gray-9 dark:text-dark-gray-9 mr-2 hidden h-[18px] w-[18px] lg:block"><path fill-rule="evenodd" d="M12 22c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm6-6l2 2v1H4v-1l2-2v-5c0-3.08 1.64-5.64 4.5-6.32V4c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v.68C16.37 5.36 18 7.93 18 11v5zm-2 1v-6c0-2.48-1.51-4.5-4-4.5S8 8.52 8 11v6h8z" clip-rule="evenodd"></path> \
                                    </svg>灵茶の试炼</div>'
                tea.setAttribute("href", "https://docs.qq.com/sheet/DWGFoRGVZRmxNaXFz")
                tea.setAttribute("target", "_blank")
                head.appendChild(tea)
            }
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
            let arr = document.querySelector("#lc-content > div > div.css-207dbg-TableContainer.ermji1u1 > div > section > div > div.css-ibx34q-antdPaginationOverride-layer1-dropdown-layer1-hoverOverlayBg-layer1-card-layer1-layer0 > div > div > div > div > div > div > table > tbody")
            if (t != undefined && t == arr.lastChild.innerHTML) {
                return
            }
            let childs = arr.childNodes
            for (const element of childs) {
                let v = element
                let length = v.childNodes.length
                let t = v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                let data = t.split(".")
                let id = data[0].trim()
                let nd = v.childNodes[length - 2].childNodes[0].innerHTML
                if (t2rate[id] != undefined) {
                    nd = t2rate[id]["Rating"]
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd
                } else {
                    let nd2ch = { "rgba(var(--dsw-difficulty-easy-rgb), 1)": "简单", "rgba(var(--dsw-difficulty-medium-rgb), 1)": "中等", "rgba(var(--dsw-difficulty-hard-rgb), 1)": "困难" }
                    let clr = v.childNodes[length - 2].childNodes[0].getAttribute("color")
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd2ch[clr]
                }
            }
            t = deepclone(arr.lastChild.innerHTML)
        } catch (e) {
            return
        }
    }

    function getCompanyData() {
        if (!window.location.href.startsWith(companyUrl)) {
            clearInterval(id4)
            id3 = setInterval(getpb, 1)
            GM_setValue("pb", id3)
            return
        }
        try {
            let arr = document.querySelector("#lc-content > div > div.css-207dbg-TableContainer.ermji1u1 > div > section > div > div.css-ibx34q-antdPaginationOverride-layer1-dropdown-layer1-hoverOverlayBg-layer1-card-layer1-layer0 > div > div > div > div > div > div > table > tbody")
            if (t != undefined && t == arr.lastChild.innerHTML) {
                return
            }
            let childs = arr.childNodes
            for (const element of childs) {
                let v = element
                let length = v.childNodes.length
                let t = v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                let data = t.split(".")
                let id = data[0].trim()
                let nd = v.childNodes[length - 3].childNodes[0].innerHTML
                if (t2rate[id] != undefined) {
                    nd = t2rate[id]["Rating"]
                    v.childNodes[length - 3].childNodes[0].innerHTML = nd
                } else {
                    let nd2ch = { "rgba(var(--dsw-difficulty-easy-rgb), 1)": "简单", "rgba(var(--dsw-difficulty-medium-rgb), 1)": "中等", "rgba(var(--dsw-difficulty-hard-rgb), 1)": "困难" }
                    let clr = v.childNodes[length - 3].childNodes[0].getAttribute("color")
                    v.childNodes[length - 3].childNodes[0].innerHTML = nd2ch[clr]
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
            let arr = document.querySelector("#__next > div > div > div > div.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(2) > div.-mx-4.md\\:mx-0 > div > div > div:nth-child(2)")
            if (t != undefined && t == arr.lastChild.innerHTML) {
                return
            }
            let childs = arr.childNodes
            for (const element of childs) {
                let v = element
                let length = v.childNodes.length
                let t = v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                let data = t.split(".")
                let id = data[0].trim()
                let nd = v.childNodes[length - 2].childNodes[0].innerHTML
                if (t2rate[id] != undefined) {
                    nd = t2rate[id]["Rating"]
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd
                } else {
                    let nd2ch = { "text-olive dark:text-dark-olive": "简单", "text-yellow dark:text-dark-yellow": "中等", "text-pink dark:text-dark-pink": "困难" }
                    let cls = v.childNodes[length - 2].childNodes[0].getAttribute("class")
                    v.childNodes[length - 2].childNodes[0].innerHTML = nd2ch[cls]
                }
            }
            t = deepclone(arr.lastChild.innerHTML)
        } catch (e) {
            return
        }
    }

    function getSearch() {
        if (!window.location.href.startsWith(searchUrl)) {
            clearInterval(id4)
            if (window.location.href.startsWith(allUrl)){
                id1 = setInterval(getData, 1)
                GM_setValue("all", id1)
            }else if (window.location.href.startsWith(tagUrl)) {
                id2 = setInterval(getTagData, 1)
                GM_setValue("tag", id2)
            } else if (window.location.href.startsWith(pbUrl)) {
                id3 = setInterval(getpb, 1)
                GM_setValue("pb", id3)
            } else if (window.location.href.startsWith(companyUrl)) {
                id4 = setInterval(getCompanyData, 1)
                GM_setValue("company", id4)
            } else if (window.location.href.startsWith(pblistUrl)) {
                id5 = setInterval(getPblistData, 1)
                GM_setValue("pblist", id5)
            }
            return
        }
        try {
            let arr = document.querySelector("#headlessui-tabs-panel-11 > div > div.mx-auto.mt-6.w-\\[880px\\].rounded.bg-layer-1.pt-2.pb-4.shadow-level1.dark\\:bg-dark-layer-1.dark\\:shadow-dark-level1 > div > div.border-t.border-divider-border-2.px-4.dark\\:border-dark-divider-border-2")
            if (arr == undefined) {
                return
            }
            let childs = arr.childNodes
            for (const element of childs) {
                let v = element
                let length = v.childNodes.length
                let t = v.childNodes[1].childNodes[0].childNodes[0].innerText
                let data = t.split(".")
                let id = data[0].trim()
                let nd = v.childNodes[length - 1].childNodes[0].innerHTML
                if (t2rate[id] != undefined) {
                    nd = t2rate[id]["Rating"]
                    v.childNodes[length - 1].childNodes[0].innerHTML = nd
                } else {
                    let nd2ch = { "text-green-s": "简单", "text-yellow": "中等", "text-red-s": "困难" }
                    let clr = v.childNodes[length - 1].childNodes[0].getAttribute("class")
                    v.childNodes[length - 1].childNodes[0].innerHTML = nd2ch[clr]
                }
            }
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
            } else if (window.location.href.startsWith(searchUrl)) {
                id6 = setInterval(getSearch, 1)
                GM_setValue("search", id6)
            } else if (window.location.href.startsWith(companyUrl)) {
                id4 = setInterval(getCompanyData, 1)
                GM_setValue("company", id4)
            } else if (window.location.href.startsWith(pblistUrl)) {
                id5 = setInterval(getPblistData, 1)
                GM_setValue("pblist", id5)
            }
            return
        }
        // 新版本
        let nextData = document.getElementById("__NEXT_DATA__")
        let statusEle = window.location.href.match(regPbSubmission)

        if(nextData) {
            if (!window.location.href.startsWith(pbUrl)) questiontag = ""
            if(statusEle) {
                let submissionUrl = window.location.href
                let data = submissionUrl.split("/")
                questiontag = data[data.length-3]
                if (data[data.length-2] != "submissions") questiontag = data[data.length-4]
                let statusOrlangPa = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div.sticky.top-0.w-full.bg-layer-1.dark\\:bg-dark-layer-1 > div")
                if (statusOrlangPa == undefined) return;
                let statusQus = statusOrlangPa.childNodes[0].childNodes[0].childNodes[0]
                let lang = statusOrlangPa.childNodes[1].childNodes[0].childNodes[0]
                if (lang == undefined || statusQus == undefined) return;
                updateSubmissionLst(statusEle, questiontag, lang.innerText, statusQus.innerText);
                return;
            }
        }
        try {
            // 旧版的标题位置
            let t = document.querySelector("#question-detail-main-tabs > div.css-1qqaagl-layer1.css-12hreja-TabContent.e16udao5 > div > div.css-xfm0cl-Container.eugt34i0 > h4 > a")
            if (t == undefined){
                // 新版逻辑
                t = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div > div.w-full.px-5.pt-4 > div > div:nth-child(1) > div.flex-1 > div > div > span")
                if (t == undefined) {
                    t1 = "unknown"
                    return
                }
                let data = t.innerText.split(".")
                let id = data[0].trim()
                let colorSpan = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div > div.w-full.px-5.pt-4 > div > div.mt-3.flex.space-x-4 > div:nth-child(1)")
                let pa = colorSpan.parentNode
                if (t1 != undefined && t1 == id) {
                    return
                }
                // 新版统计难度分数并且修改
                let nd = colorSpan.getAttribute("class")
                let nd2ch = { "text-olive dark:text-dark-olive": "简单", "text-yellow dark:text-dark-yellow": "中等", "text-pink dark:text-dark-pink": "困难" }
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
                let url = "https://leetcode.cn/contest/"
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
                    // ContestID_zh  ContestSlug
                    if (t2rate[id] != undefined) {
                        let contestUrl;
                        let num = getcontestNumber(t2rate[id]["ContestSlug"])
                        if (num < 83) { contestUrl = zhUrl } else { contestUrl = url }
                        span.innerText = t2rate[id]["ContestID_zh"]
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
                        pa.childNodes[le - 2].childNodes[0].innerText = t2rate[id]["ContestID_zh"]
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
                let colorSpan = document.querySelector("#question-detail-main-tabs > div.css-1qqaagl-layer1.css-12hreja-TabContent.e16udao5 > div > div.css-xfm0cl-Container.eugt34i0 > div > span:nth-child(2)")
                let pa = colorSpan.parentNode
                if ((t1 != undefined && t1 == id) && (le != undefined && le <= pa.childNodes.length)) {
                    return
                }
                // 统计难度分数
                let nd = colorSpan.getAttribute("data-degree")
                let nd2ch = { "easy": "简单", "medium": "中等", "hard": "困难" }
                if (t2rate[id] != undefined) {
                    colorSpan.innerHTML = t2rate[id]["Rating"]
                } else {
                    colorSpan.innerHTML = nd2ch[nd]
                }
                // 准备做周赛链接,如果已经不存在组件就执行操作
                let url = "https://leetcode.cn/contest/"
                let zhUrl = "https://leetcode.com/contest/"
                if (le == undefined || le != pa.childNodes.length) {
                    let abody = document.createElement("a")
                    abody.setAttribute("data-small-spacing", "true")
                    abody.setAttribute("class", "css-nabodd-Button e167268t1")

                    let button = document.createElement("button")
                    button.setAttribute("class", "css-nabodd-Button e167268t1")
                    let abody2 = document.createElement("a")
                    abody2.setAttribute("data-small-spacing", "true")
                    abody2.setAttribute("class", "css-nabodd-Button e167268t1")

                    let span = document.createElement("span")
                    let span2 = document.createElement("span")
                    // ContestID_zh  ContestSlug
                    if (t2rate[id] != undefined) {
                        let contestUrl;
                        let num = getcontestNumber(t2rate[id]["ContestSlug"])
                        if (num < 83) { contestUrl = zhUrl } else { contestUrl = url }
                        span.innerText = t2rate[id]["ContestID_zh"]
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
                    button.appendChild(abody2)
                    pa.appendChild(abody)
                    pa.appendChild(button)
                } else if (le == pa.childNodes.length) {  // 存在就直接替换
                    if (t2rate[id] != undefined) {
                        let contestUrl;
                        let num = getcontestNumber(t2rate[id]["ContestSlug"])
                        if (num < 83) { contestUrl = zhUrl } else { contestUrl = url }
                        pa.childNodes[le - 2].childNodes[0].innerText = t2rate[id]["ContestID_zh"]
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


    let QuerySubmissionUpdate = (questiontag, lang, statusQus) => {
        let key = questiontag + langMap[lang] + statusMap[statusQus]
        pbSubmissionInfo = JSON.parse(GM_getValue("pbSubmissionInfo", "{}").toString())
        let saveData = (key, lst) => {
            pbSubmissionInfo[key] = lst
            GM_setValue("pbSubmissionInfo", JSON.stringify(pbSubmissionInfo))
        }

        let successFuc = (res) => {
            let data = res.data.submissionList
            let submissions = data.submissions
            next = deepclone(data.hasNext)
            // console.log("req success: ", data)
            submissionLst = deepclone(submissionLst.concat(submissions))
            saveData(key, submissionLst)
            console.log("update submission data: ", questiontag, langMap[lang], statusMap[statusQus])
        }
        var variables = {
            "questionSlug": questiontag,
            "offset": 0,
            "limit": 40,
            "lastKey": null,
            "status": null,
            "lang": langMap[lang],
            "status": statusMap[statusQus],
        };
        next = true
        submissionLst = []
        let cnt = 0
        while(next) {
            postReq(queryPbSubmission, variables, successFuc)
            variables.offset += 40
            cnt += 1
            // console.log("第" + cnt + "步")
        }
    }

    let addListener = () => {
        // console.log("addListener....")
        XMLHttpRequest.prototype.send = function () {
            const _onreadystatechange = this.onreadystatechange;
            this.onreadystatechange = (...args) => {
                if (this.readyState === this.DONE && this.responseURL == "https://leetcode.cn/graphql/noj-go/") {
                    if (this.status === 200 || this.response.type === "application/json") {
                        // console.log("update list....")
                        updateFlag = true
                    }
                }
                if (_onreadystatechange) {
                    _onreadystatechange.apply(this, args);
                }
            }
            dummySend.apply(this, arguments);
        }
    }

    let updateSubmissionLst = (statusEle, questiontag, lang, statusQus) => {
        // 数据替换操作
        try{
            let key = questiontag + langMap[lang] + statusMap[statusQus]
            if (questiontag != "" && statusEle) {
                let arr = document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div > div > div.flex.h-full.w-full.overflow-y-auto > div > div.h-full.w-full")
                if (arr == undefined) return
                let childs = arr.childNodes
                if (childs.length == 1 || childs.length == 0) return;

                // 已经替换过就直接返回
                var lastNode = childs[childs.length-2]
                if (!lastNode.hasChildNodes()) {
                    lastNode = childs[childs.length-3]
                }
                var lastIcon = lastNode.childNodes[0].childNodes[1]
                var first = childs[0].childNodes[0].childNodes[1]
                if (!updateFlag && lastIcon.childNodes.length > 1 && first.childNodes.length > 1) {
                    return
                }
                if (updateFlag) updateFlag = false
                QuerySubmissionUpdate(questiontag, lang, statusQus)
                pbSubmissionInfo = JSON.parse(GM_getValue("pbSubmissionInfo", "{}").toString())
                let subLst = pbSubmissionInfo[key]
                // console.log("替换数据: ", subLst)
                if (subLst == undefined || subLst.length == 0) return
                for (let i = 0; i < childs.length; i++) {
                    let v = childs[i]
                    let icon = v.childNodes[0].childNodes[1].childNodes[0]
                    let pa = icon.parentNode
                    let copy1 = icon.cloneNode(true);
                    copy1.innerText = subLst[i]["runtime"]
                    let copy2 = icon.cloneNode(true);
                    copy2.innerText = subLst[i]["memory"]
                    let copy3 = icon.cloneNode(true);
                    copy3.innerText = subLst[i]["submissionComment"] == null ? "无备注" : subLst[i]["submissionComment"]["comment"]
                    if (pa.childNodes.length > 1) {
                        // console.log("replace", copy1, copy2)
                        pa.replaceChild(copy1, pa.childNodes[1])
                        pa.replaceChild(copy2, pa.childNodes[2])
                        pa.replaceChild(copy3, pa.childNodes[3])
                    } else {
                        pa.appendChild(copy1);
                        pa.appendChild(copy2);
                        pa.appendChild(copy3);
                    }
                }
            }
        }catch(error){
            // do nothing
        }
    }


    let now = getCurrentDate(1)
    preDate = GM_getValue("preDate", "")
    if (t2rate["tagVersion3"] == undefined || (preDate == "" || preDate != now)) {
        // 每天重置为空
        pbSubmissionInfo = JSON.parse("{}")
        GM_setValue("pbSubmissionInfo", JSON.stringify(pbSubmissionInfo))

        GM_xmlhttpRequest({
            method: "get",
            url: 'https://raw.staticdn.net/zerotrac/leetcode_problem_rating/main/data.json' + "?timeStamp=" + new Date().getTime(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
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
                    t2rate["tagVersion3"] = {}
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
            url: 'https://raw.staticdn.net/zhang-wangz/LeetCodeRating/main/version.json' + "?timeStamp=" + new Date().getTime(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
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
                            content: '<pre style="color:#000">更新通知: <br/>leetcodeRating难度分插件有新的版本啦,请前往更新~ <br/>' + "更新内容: <br/>" + upcontent + "</pre>",
                            yes: function (index, layer0) {
                                let c = window.open("https://github.com/zhang-wangz/LeetCodeRating/raw/main/leetcodeRating_greasyfork.user.js")
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

        // 获取茶数据
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://raw.staticdn.net/zhang-wangz/LeetCodeRating/main/tencentdoc/tea.json' + "?timeStamp=" + new Date().getTime(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            onload: function (res) {
                if (res.status === 200) {
                    console.log("enter home page gettea once...")
                    latestpb = {}
                    let dataStr = res.response
                    let json = JSON.parse(dataStr)
                    let al = json["算法趣题"][1]
                    latestpb["date"] = al[0] || {'str':''};latestpb["pb"] = al[1] || {'str':''};latestpb["url"] = al[1] || {'url':''};
                    latestpb["out"] = al[2] || {'str':''};latestpb["nd"] = al[3] || {'str':''};latestpb["solve"] = al[4] || {'str':''};
                    latestpb["blank"] = al[5] || {'str':''};
                    GM_setValue("latestpb", JSON.stringify(latestpb))
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
        clearAndStart('pb', getpb, 100)
        addListener();
        let id = setInterval(getData, 1)
        GM_setValue("all", id)
    } else if (window.location.href.startsWith(companyUrl)) {
        clearAndStart('company', getCompanyData, 1)
    } else if (window.location.href.startsWith(pblistUrl)) {
        clearAndStart('pblist', getPblistData, 1)
    } else if (window.location.href.startsWith(searchUrl)){
        clearAndStart('search', getSearch, 100)
    } else {
        clearAndStart('', undefined, 1)
    }
})();
