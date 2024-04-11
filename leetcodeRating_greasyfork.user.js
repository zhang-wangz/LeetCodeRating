// ==UserScript==
// @name         LeetCodeRating｜显示力扣周赛难度分
// @namespace    https://github.com/zhang-wangz
// @version      2.1.9
// @license      MIT
// @description  LeetCodeRating 力扣周赛分数显现，支持所有页面评分显示
// @author       小东是个阳光蛋(力扣名)
// @leetcodehomepage   https://leetcode.cn/u/runonline/
// @homepageURL  https://github.com/zhang-wangz/LeetCodeRating
// @contributionURL https://www.showdoc.com.cn/2069209189620830
// @run-at       document-end
// @match        *://*leetcode.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      zerotrac.github.io
// @connect      raw.gitmirror.com
// @connect      raw.githubusercontents.com
// @connect      raw.githubusercontent.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @require      https://unpkg.com/layui@2.9.6/dist/layui.js
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
// @note         2023-01-05 1.6.3 修改cdn访问方式和频率
// @note         2023-01-05 1.6.4 修改cdn地址避免检测访问频率
// @note         2023-01-05 1.6.5 修改更新时候打开的js地址，避免不能访问github的人无法更新插件
// @note         2023-01-24 1.6.6 1.题单页面与refine-leetcode插件兼容性修复 2. 增加题目页面refine-leetcode的计时器功能拦截开关
// @note         2023-01-24 1.6.7 删除无效打印
// @note         2023-01-24 1.6.9 增加各页面功能开关，同时修复部分页面评分不显示的bug
// @note         2023-01-25 1.6.10 修复若干bug，优化代码逻辑结构
// @note         2023-01-25 1.7.0 修复页面url改变时，循环添加事件监听导致的页面宕机问题
// @note         2023-02-01 1.7.3 拦截功能修改
// @note         2023-02-01 1.7.4 增加题目页面新旧版ui切换，让没参加内测的伙伴一起测试
// @note         2023-02-01 1.7.5 修复:插件的新旧版ui切换不影响力扣官方的按钮切换
// @note         2023-02-10 1.7.6 更新:插件拦截计时器功能默认不开启
// @note         2023-02-10 1.7.7 更新:增加题库页面去除vip题目显示功能，解决各部分插件冲突并优化
// @note         2023-02-11 1.7.8 更新:修复新功能去除vip题目显示缺陷，优化部分代码
// @note         2023-02-12 1.7.10 更新:去除拦截力扣api安全检测机制的功能，修复更新操作
// @note         2023-02-12 1.8.0 题库页面去除用户vip校验检查，不影响评分显示
// @note         2023-02-13 1.8.1 增加新功能模拟真实oj环境,去除拦截计时器功能
// @note         2023-02-17 1.8.2 修复力扣ui变更失效的功能
// @note         2023-02-20 1.8.3 增加力扣纸片人功能
// @note         2023-02-20 1.8.4 油猴官方不允许引入github js文件, 集成纸片人js到脚本当中
// @note         2023-02-20 1.8.5 修复引入js导致的bug
// @note         2023-02-21 1.8.6 使旧版题目页面NEW按钮可以移动避免遮挡其余页面元素，同时优化代码设计
// @note         2023-03-06 1.8.7 完善了一下灵茶页面和纸片人设计
// @note         2023-03-06 1.8.8 (版本号忘记改了)
// @note         2023-03-06 1.8.9 修复灵茶页面设计导致的竞赛页面异常
// @note         2023-03-07 1.8.10 修复因cdn.jsdelivr.net被dns污染而导致部分地区无法加载灵茶页面的问题
// @note         2023-03-13 1.9.0 修复因为评分数据对应的cdn域名变化导致edge等部分类chrome浏览器无法加载数据的问题
// @note         2023-03-14 1.9.1 不再屏蔽user报错信息展示，方便提issue时提供截图快速排查问题
// @note         2023-04-04 1.9.2 增加早8晚8自动切换lc dark模式功能
// @note         2023-04-06 1.9.3 增加新版学习计划的评分显示
// @note         2023-04-06 1.9.4 修复新版学习计划的评分显示，增加学习计划侧边栏评分显示
// @note         2023-04-11 1.9.5 修复因灵茶试炼文档变更导致的错误
// @note         2023-04-21 1.9.6 1.增加javascript分类之后将灵茶表格链接移动至灵茶题目中状态那一框 2.学习计划页面增加storm的算术评级字段
// @note         2023-05-04 1.9.7 修复新版学习计划因为黑暗模式切换导致的错误
// @note         2023-05-07 1.9.8 去除官方新版题目提交新增的备注按钮(太丑了),恢复插件原样
// @note         2023-05-12 1.9.9 增加新版在题目提交页面的时候自动切换tab title与题目描述页一致
// @note         2023-05-12 1.9.10 1.鉴于经常有dns被污染导致cdn访问不了的情况，开放vpn开关，如果开了vpn使用原生地址更好 2.题目提交页面去除插件使用的备注，保留官方的，遵守策略
// @note         2023-05-16 1.10.0 修复因官方ui变化新版ui不显示分数的问题
// @note         2023-05-19 1.10.1 修复因官方ui变化新版ui不显示分数的问题
// @note         2023-05-24 1.10.2 修复界面不一致导致的一些问题
// @note         2023-05-24 1.10.3 修复界面不一致导致的一些问题
// @note         2023-05-29 1.10.4 解决新版ui提交备注页面ui覆盖问题
// @note         2023-05-31 1.10.5 解决新版ui学习计划获取rating分数未击中题目难度显示undefined问题
// @note         2023-06-07 1.10.6 阻止新版题目页面输入代码时候的自动联想，因为有些实在不符合规则但还是会跳联想
// @note         2023-06-07 1.10.7 修复新bug
// @note         2023-06-19 1.10.8 修复新旧版切换ui更新导致的问题，更新纸片人一言api
// @note         2023-07-06 1.10.9 修复新旧版切换ui更新导致的问题
// @note         2023-07-06 1.10.10 不再强行控制新旧ui切换,导入leetcode自身切换机制
// @note         2023-07-11 2.0.0 题目提交页面ui修正
// @note         2023-07-11 2.0.1 题目页面ui修正
// @note         2023-07-16 2.0.2 题目页提交页面按钮独立, 修复流动布局造成的问题
// @note         2023-08-14 2.0.3 去除版本更新后已经无用的功能
// @note         2023-08-22 2.0.4 题目页面流动布局难度分修正
// @note         2023-08-23 2.0.5 题目页面流动布局存在不会自动排版的问题,导致点开相关流动布局之后元素位置紊乱,防止相应问题产生,挪移最后插入的周赛链接位置
// @note         2023-08-31 2.0.6 修复流动ui导致的一些问题, 增加流动ui下,题目页侧边栏分数显示
// @note         2023-08-31 2.0.7 修复流动ui导致的一些问题, 增加流动ui下,题目页侧边栏分数显示,更新机制问题修复
// @note         2023-09-01 2.0.8 修复ui变化导致的侧边栏相关问题
// @note         2023-09-01 2.0.9 修复ui变化导致的首页界面变化问题
// @note         2023-09-27 2.0.10 增加插件群聊信息, 有问题的可以加群询问问题, 企鹅群号, 654726006
// @note         2023-10-06 2.1.0 win平台题目页面部分信息显示不全的bug修复
// @note         2023-11-06 2.1.1 根据力扣ui变化, 修改部分功能的实现, 主要影响学习计划页面,pblist页面,题目边栏页面
// @note         2023-12-11 2.1.2 根据力扣ui变化, 修改部分功能的实现, 并优化题库页灵茶数据每日不统一的问题
// @note         2023-12-11 2.1.3 修复题目页左侧栏目刷新的bug问题
// @note         2023-12-11 2.1.4 恢复题目页左侧栏目的部分功能，并在之前的基础上修复功能缺陷
// @note         2024-04-10 2.1.5 因4月1号腾讯共享文档api调整,不能通过接口api去获取灵茶题集,所以修改了题库界面该功能展示
// @note         2024-04-10 2.1.6 4.10二次更新，题目页新增题目搜索功能，位于题目页左上方
// @note         2024-04-11 2.1.7 4.11 更新，修复layui css导入导致深色模式下a标签style固定为灰色的问题
// @note         2024-04-11 2.1.8 修复学习计划页面的缺失问题，修复题目页面左侧栏重复bug问题，回退搜索框为即搜即查模式
// @note         2024-04-11 2.1.8 题目页显示算术评级功能，点击显示功能评级详情
// ==/UserScript==

(function () {
    'use strict';

    let version = "2.1.9"


    // 页面相关url
    const allUrl = "https://leetcode.cn/problemset/.*"
    const tagUrl = "https://leetcode.cn/tag/.*"
    const companyUrl = "https://leetcode.cn/company/.*"
    const pblistUrl = "https://leetcode.cn/problem-list/.*"
    const pbUrl = "https://leetcode.cn/problems/.*"
    const searchUrl = "https://leetcode.cn/search/.*"
    const studyUrl = "https://leetcode.cn/studyplan/.*"

    // req相关url
    const lcnojgo = "https://leetcode.cn/graphql/noj-go/"
    const lcgraphql = "https://leetcode.cn/graphql/"
    const chContestUrl = "https://leetcode.cn/contest/"
    const zhContestUrl = "https://leetcode.com/contest/"

    // 灵茶相关url
    const teaSheetUrl = "https://docs.qq.com/sheet/DWGFoRGVZRmxNaXFz"
    const lc0x3fsolveUrl = "https://huxulm.github.io/lc-rating/search"

    // 用于延时函数的通用id
    let id = ""

    // rank 相关数据
    let t2rate = JSON.parse(GM_getValue("t2ratedb", "{}").toString())
    // 题目名称-id ContestID_zh-ID
    let pbName2Id = JSON.parse(GM_getValue("pbName2Id", "{}").toString())
    let preDate = GM_getValue("preDate", "")
    // level数据
    let levelData = JSON.parse(GM_getValue("levelData", "{}").toString())
    // 是否使用动态布局
    let localVal = localStorage.getItem("used-dynamic-layout")
    let isDynamic = localVal != null ? localVal.includes("true") : false

    // 同步函数
    function waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
        let targetNodes, btargetsFound;
        if (typeof iframeSelector == "null")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents().find (selectorTxt);

        if (targetNodes  &&  targetNodes.length > 0) {
            btargetsFound   = true;
            targetNodes.each (function(){
                let jThis           = $(this);
                let alreadyFound = jThis.data ('alreadyFound')  ||  false;
                if (!alreadyFound) {
                    let cancelFound = actionFunction (jThis);
                    if (cancelFound) btargetsFound = false;
                    else jThis.data ('alreadyFound', true);
                }
            });
        } else {
            btargetsFound = false;
        }
        let controlObj      = waitForKeyElements.controlObj  ||  {};
        let controlKey      = selectorTxt.replace (/[^\w]/g, "_");
        let timeControl     = controlObj [controlKey];
        if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
            clearInterval (timeControl);
            delete controlObj [controlKey]
        }
        else {
            if (!timeControl) {
                timeControl = setInterval (function() {
                        waitForKeyElements(selectorTxt,actionFunction,bWaitOnce,iframeSelector);
                    },300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }


    let ajaxReq = (type, reqUrl, headers, data, successFuc, withCredentials=true) => {
        $.ajax({
            // 请求方式
            type : type,
            // 请求的媒体类型
            contentType: "application/json;charset=UTF-8",
            // 请求地址
            url: reqUrl,
            // 数据，json字符串
            data : data != null? JSON.stringify(data): null,
            // 同步方式
            async: false,
            xhrFields: {
                withCredentials: true
            },
            headers: headers,
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
    }

    // 刷新菜单
    script_setting()
    // 注册urlchange事件
    initUrlChange()()


    // 常量数据
    const dummySend = XMLHttpRequest.prototype.send
    const regDiss = '.*//leetcode.cn/problems/.*/discussion/.*'
    const regSovle = '.*//leetcode.cn/problems/.*/solutions/.*'
    const regPbSubmission = '.*//leetcode.cn/problems/.*/submissions/.*';
    const queryProblemsetQuestionList = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
        ) {
            hasMore
            total
            questions {
            acRate
            difficulty
            freqBar
            frontendQuestionId
            isFavor
            paidOnly
            solutionNum
            status
            title
            titleCn
            titleSlug
            topicTags {
                name
                nameTranslated
                id
                slug
            }
            extra {
                hasVideoSolution
                topCompanyTags {
                imgUrl
                slug
                numSubscribed
                }
            }
            }
        }
    }`

    // css 渲染
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`)
    // 监听urlchange事件定义
    function initUrlChange() {
        let isLoad = false
        const load = () => {
            if (isLoad) return
            isLoad = true
            const oldPushState = history.pushState
            const oldReplaceState = history.replaceState
            history.pushState = function pushState(...args) {
                const res = oldPushState.apply(this, args)
                window.dispatchEvent(new Event('urlchange'))
                return res
            }
            history.replaceState = function replaceState(...args) {
                const res = oldReplaceState.apply(this, args)
                window.dispatchEvent(new Event('urlchange'))
                return res
            }
            window.addEventListener('popstate', () => {
                window.dispatchEvent(new Event('urlchange'))
            })
        }
        return load
    }


    let isVpn = !GM_getValue("switchvpn")
    // 访问相关url
    let versionUrl, sciptUrl, rakingUrl, levelUrl
    if (isVpn) {
        versionUrl = "https://raw.githubusercontent.com/zhang-wangz/LeetCodeRating/main/version.json"
        sciptUrl = "https://raw.githubusercontent.com/zhang-wangz/LeetCodeRating/main/leetcodeRating_greasyfork.user.js"
        rakingUrl = "https://zerotrac.github.io/leetcode_problem_rating/data.json"
        levelUrl = "https://raw.githubusercontent.com/zhang-wangz/LeetCodeRating/main/stormlevel/data.json"
    } else {
        versionUrl = "https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/version.json"
        sciptUrl = "https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/leetcodeRating_greasyfork.user.js"
        rakingUrl = "https://raw.gitmirror.com/zerotrac/leetcode_problem_rating/main/data.json"
        levelUrl = "https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/stormlevel/data.json"
    }

    // 获取必须获取的数据
    getNeedData()

    // 菜单方法定义
    function script_setting(){
        let menu_ALL = [
            ['switchvpn', 'vpn', '是否使用cdn访问数据', false, false],
            ['switchTea', '0x3f tea', '题库页灵茶信息显示', true, true],
            ['switchpbRepo', 'pbRepo function', '题库页周赛难度评分(不包括灵茶)', true, false],
            ['switchdelvip', 'delvip function', '题库页去除vip加锁题目', false, true],
            ['switchpbscore', 'pb function', '题目页周赛难度评分', true, true],
            ['switchcode', 'switchcode function', '题目页代码输入阻止联想', false, true],
            ['switchpbside', 'switchpbside function', '题目页侧边栏分数显示', true, true],
            ['switchpbsearch', 'switchpbsearch function', '题目页题目搜索框', true, true],
            ['switchsearch', 'search function', '题目搜索页周赛难度评分', true, false],
            ['switchtag', 'tag function', 'tag题单页周赛难度评分(动态规划等分类题库)', true, false],
            // ['switchcompany', 'company function', '公司题单页周赛难度评分', true, false],
            ['switchpblist', 'pbList function', 'pbList题单页评分', true, false],
            ['switchstudy', 'studyplan function', '学习计划周赛难度评分', true, false],
            ['switchcontestpage', 'contestpage function', '竞赛页面双栏布局', true, false],
            ['switchlevel', 'studyplan level function', '算术评级(显示左侧栏和学习计划中)', true, false],
            ['switchrealoj', 'delvip function', '模拟oj环境(去除通过率,难度,周赛Qidx等)', false, true],
            ['switchdark', 'dark function', '自动切换白天黑夜模式(早8晚8切换制)', false, true],
            ['switchperson', 'person function', '纸片人', false, true],
        ], menu_ID = [], menu_ID_Content = [];
        for (const element of menu_ALL){ // 如果读取到的值为 null 就写入默认值
            if (GM_getValue(element[0]) == null){GM_setValue(element[0], element[3])};
        }
        registerMenuCommand();

        // 注册脚本菜单
        function registerMenuCommand() {
            if (menu_ID.length > menu_ALL.length){ // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
                for (const element of menu_ID){
                    GM_unregisterMenuCommand(element);
                }
            }
            for (let i=0;i < menu_ALL.length;i++){ // 循环注册脚本菜单
                menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
                let content = `${menu_ALL[i][3]?'✅':'❎'} ${ menu_ALL[i][2]}`
                menu_ID[i] = GM_registerMenuCommand(content, function(){ menu_switch(`${menu_ALL[i][0]}`,`${menu_ALL[i][1]}`,`${menu_ALL[i][2]}`,`${menu_ALL[i][3]}`)});
                menu_ID_Content[i] = content
            }
            menu_ID[menu_ID.length] = GM_registerMenuCommand(`🏁 当前版本 ${version}`, function () {window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/450890-leetcoderating-%E6%98%BE%E7%A4%BA%E5%8A%9B%E6%89%A3%E5%91%A8%E8%B5%9B%E9%9A%BE%E5%BA%A6%E5%88%86', {active: true,insert: true,setParent: true});});
            menu_ID_Content[menu_ID_Content.length] = `🏁 当前版本 ${version}`
            menu_ID[menu_ID.length+1] = GM_registerMenuCommand(`🏁 企业群号 654726006`, function () {});
            menu_ID_Content[menu_ID_Content.length+1] = `🏁 654726006`
        }

        //切换选项
        function menu_switch(name, ename, cname, value){
            if(value == 'false'){
                GM_setValue(`${name}`, true);
                registerMenuCommand(); // 重新注册脚本菜单
                location.reload(); // 刷新网页
                GM_notification({text: `「${cname}」已开启\n`, timeout: 3500}); // 提示消息
            } else {
                GM_setValue(`${name}`, false);
                registerMenuCommand(); // 重新注册脚本菜单
                location.reload(); // 刷新网页
                GM_notification({text: `「${cname}」已关闭\n`, timeout: 3500}); // 提示消息
            }
            registerMenuCommand(); // 重新注册脚本菜单
        }
    }

    // 首次加载重置
    // 题目页面监听变化
    localStorage.removeItem("urlchange")
    localStorage.removeItem("themechange")
    function observerpb() {
        let observer = new MutationObserver(function(mutationsList, observer) {
            // 检查每个变化
            mutationsList.forEach(function(mutation) {
                themechange();
            });
        });
        // 配置 MutationObserver 监听的内容和选项
        let config = { attributes: true, childList: false, subtree: true };
        observer.observe(document, config);
        function themechange() {
            let url = window.location.href
            let urlchange = localStorage.getItem("urlchange")
            let theme = localStorage.getItem("lc-dark-side")
            let themecg = localStorage.getItem("themechange")
            if ((urlchange == null || url != urlchange) || (themecg == null || theme != themecg)) {
                let style = document.createElement("style");
                style.type = "text/css";
                style.innerHTML = `
                    a {
                        color: inherit !important;
                        text-decoration: inherit !important;
                    }
                `;
                console.log("修改layui a属性style")
                if (theme == "dark") {
                    style.innerHTML += `
                    .layui-menu-body-title {
                        color : #333 !important;
                    }
                    `
                }
                document.head.appendChild(style);
                localStorage.setItem("urlchange", url)
                localStorage.setItem("themechange", theme)
            }
        }
    }


    // lc 基础req
    let baseReq = (type, reqUrl, query, variables, successFuc) => {
        //请求参数
        let list = {"query":query, "variables":variables };
        //
        ajaxReq(type, reqUrl, null, list, successFuc)
    };

    // post请求
    let postReq = (reqUrl, query, variables, successFuc) => {
        baseReq("POST", reqUrl, query, variables, successFuc)
    }

    let lcTheme = (mode) => {
        let headers = {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7',
            'content-type': 'application/json',
        }
        let body = {
            operationName: 'setTheme',
            query: '\n    mutation setTheme($darkMode: String!) {\n  setDarkSide(darkMode: $darkMode)\n}\n    ',
            variables: {
                'darkMode': mode
            },
        }
        ajaxReq("POST", lcnojgo, headers, body, ()=>{})
    }

    if(GM_getValue("switchdark")) {
        let h = new Date().getHours()
        if (h >= 8 && h < 20) {
            lcTheme('light')
            localStorage.setItem("lc-dark-side", "light")
            console.log("修改至light mode...")
        }
        else {
            lcTheme('dark')
            localStorage.setItem("lc-dark-side", "dark")
            console.log("修改至dark mode...")
        }
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
        else if (format == 3) {
            time = year + "/" + month + "/" + date;
        }
        return time;
    }

    GM_addStyle(`
        .containerlingtea {
            background: rgba(233, 183, 33, 0.2);
            white-space: pre-wrap;
            word-wrap: break-word;
            display: block;
        }
    `)

    // 因为力扣未捕获错误信息，所以重写一下removechild方法
    const removeChildFn = Node.prototype.removeChild;
    Node.prototype.removeChild = function (n) {
        let err = null;
        try {
            err = removeChildFn.call(this, n); // 正常删除
        } catch(error) {
            if(!error.toString().includes("NotFoundError")) console.log("力扣api发生错误: ", error.toString().substr(0, 150))
        }
        return err
    }

    // 竞赛页面双栏布局
    // 来源 better contest page / author ExplodingKonjac
    let switchcontestpage = GM_getValue("switchcontestpage")
    if(location.href.match("https://leetcode.cn/contest/.*/problems/.*") && switchcontestpage) {
        const CSS = `
            body {
                display: flex;
                flex-direction: column;
            }

            body .content-wrapper {
                height: 0;
                min-height: 0 !important;
                flex: 1;
                display: flex;
                flex-direction: column;
                padding-bottom: 0 !important;
            }

            .content-wrapper #base_content {
                display: flex;
                overflow: hidden;
                height: 0;
                flex: 1;
            }

            .content-wrapper #base_content > .container {
                width: 40%;
                overflow: scroll;
            }

            .content-wrapper #base_content > .container .question-content {
                overflow: unset !important;
            }

            .content-wrapper #base_content > .container .question-content > pre {
                white-space: break-spaces;
            }

            .content-wrapper #base_content > .editor-container {
                flex: 1;
                overflow: scroll;
            }

            .content-wrapper #base_content > .editor-container .container {
                width: 100% !important;
            }

            .content-wrapper #base_content > .custom-resize {
                width: 4px;
                height: 100%;
                background: #eee;
                cursor: ew-resize;
                margin: 0 2px;
            }

            .content-wrapper #base_content > .custom-resize:hover {
                background: #1a90ff;
            }
        `

        const storageKey = '--previous-editor-size';
        (function () {
        const $css = document.createElement('style')
        $css.innerHTML = CSS
        document.head.append($css)
        const $problem = document.querySelector('.content-wrapper #base_content > .container')
        const $editor = document.querySelector('.content-wrapper #base_content > .editor-container')
        const $resize = document.createElement('div')
        if (localStorage.getItem(storageKey)) {
            $problem.style.width = localStorage.getItem(storageKey)
        }
        $editor.parentElement.insertBefore($resize, $editor)
        $resize.classList.add('custom-resize')
        let currentSize, startX, resizing = false
        $resize.addEventListener('mousedown', (e) => {
            currentSize = $problem.getBoundingClientRect().width
            startX = e.clientX
            resizing = true
            $resize.style.background = '#1a90ff'
        })
        window.addEventListener('mousemove', (e) => {
            if (!resizing) return
            const deltaX = e.clientX - startX
            const newSize = Math.max(450, Math.min(1200, currentSize + deltaX))
            $problem.style.width = `${newSize}px`
            e.preventDefault()
        })
        window.addEventListener('mouseup', (e) => {
            if (!resizing) return
            e.preventDefault()
            resizing = false
            $resize.style.background = ''
            localStorage.setItem(storageKey, $problem.style.width)
        })
        })()
    }


    // window.onerror = function(message, source, lineno, colno, error) {
    //     message.preventDefault()
    //     console.log("力扣api发生错误:", message.message)
    //     return true
    // }

    function callback(tag, variables) {
        let data;
        if (tag == 'query problemsetQuestionList') {
            postReq(lcgraphql, queryProblemsetQuestionList, variables, (res) => {
                res.data.problemsetQuestionList.questions = res.data.problemsetQuestionList.questions.filter(e => !e.paidOnly)
                data = res
            })
        }
        return data
    }

    // 写一个拦截题库页面的工具
    const originalOpen = XMLHttpRequest.prototype.open
    function intercept() {
        XMLHttpRequest.prototype.open = function newOpen(method, url, async, user, password, disbaleIntercept) {
            if (!disbaleIntercept && method.toLocaleLowerCase() === 'post' && url === `/graphql/`) {
                const originalSend = this.send
                this.send = async str => {
                    try {
                        if (typeof str === 'string') {
                            let tag
                            const body = JSON.parse(str)
                            if ( body.query && body.query.includes('query problemsetQuestionList')) {
                                tag = 'query problemsetQuestionList'
                                for (const key of ['response', 'responseText']) {
                                    Object.defineProperty(this, key, {
                                        get: function() {
                                            const data = callback(tag, body.variables)
                                            return JSON.stringify(data)
                                        },
                                        configurable: true,
                                    })
                                }
                            }
                            str = JSON.stringify(body)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    return originalSend.call(this, str)
                }
            }
            originalOpen.apply(this, [method, url, async, user, password])
        }
    }

    function restore() {
        XMLHttpRequest.prototype.open = originalOpen
    }

    if(GM_getValue("switchdelvip")) intercept(); else restore()


    let t1, le // pb
    let tFirst, tLast  // all
    function getData() {
        let switchpbRepo = GM_getValue("switchpbRepo")
        let switchTea = GM_getValue("switchTea")
        let switchrealoj = GM_getValue("switchrealoj")
        let arrList = document.querySelectorAll("div[role='rowgroup']")
        let arr = arrList[0]
        for (let ele of arrList) {
            if (ele.childNodes.length != 0) {
                arr = ele 
                break
            }
        }
        // pb页面加载时直接返回
        if (arr == null) {
            return
        }
        let lastchild = arr.lastChild
        let first = switchTea ? 1 : 0
        if ((!switchpbRepo || (tFirst && tFirst == arr.childNodes[first].textContent && tLast && tLast == lastchild.textContent))
            && (!switchTea || arr.childNodes[0].childNodes[2].textContent == "灵神题解集")
            && (!switchrealoj) || lastchild.textContent.includes("隐藏")) {
            return
        }
        
        t2rate = JSON.parse(GM_getValue("t2ratedb", "{}").toString())

        // 灵茶题目渲染
        if (switchTea) {
            // console.log(arr.childNodes[0].childNodes[2].textContent)
            if (arr.childNodes[0].childNodes[2].textContent != "灵神题解集") {
                let div = document.createElement('div')
                div.setAttribute("role", "row")
                div.setAttribute("style", "display:flex;flex:1 0 auto;min-width:0px")
                div.setAttribute("class", "odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4")
                div.innerHTML += `<div role="cell" style="box-sizing:border-box;flex:60 0 auto;min-width:0px;width:60px" class="mx-2 py-[11px]"><a href="" target='_blank'>${getCurrentDate(3)}</a</div>`
                div.innerHTML += `<div role="cell" style="box-sizing:border-box;flex:160 0 auto;min-width:0px;width:160px" class="mx-2 py-[11px]"><div class="max-w-[302px] flex items-center"><div class="overflow-hidden"><div class="flex items-center"><div class="truncate overflow-hidden"><a href=${teaSheetUrl}  target="_blank" class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s">灵茶题集</a></div></div></div></div></div>`
                div.innerHTML += `<div role="cell" style="box-sizing:border-box;flex:96 0 auto;min-width:0px;width:96px" class="mx-2 py-[11px]"><span class="flex items-center space-x-2 text-label-1 dark:text-dark-label-1"><a href="${lc0x3fsolveUrl}" class="truncate" target="_blank" hover:text-blue-s aria-label="solution">灵神题解集</a></span></div><div \
                    role="cell" style="box-sizing:border-box;flex:82 0 auto;min-width:0px;width:82px" class="mx-2 py-[11px]"><span><a href="javascript:;" class="truncate" aria-label="solution">——</a></span></div><div \
                    role="cell" style="box-sizing:border-box;flex:60 0 auto;min-width:0px;width:60px" class="mx-2 py-[11px]"><span class="text-purple dark:text-dark-purple">——</span></div><div \
                    role="cell" style="box-sizing:border-box;flex:88 0 auto;min-width:0px;width:88px" class="mx-2 py-[11px]"><span><a href="javascript:;" >——</a></span></div>`
                arr.insertBefore(div, arr.childNodes[0])
                console.log("has refreshed ling pb...")
            }

        }
        // console.log(tFirst)
        // console.log(tLast)
        if (switchpbRepo) {
            let allpbHead = document.querySelector("div[role='row']")
            let rateRefresh = false
            let headndidx, acrateidx
            let i = 0
            allpbHead.childNodes.forEach(e => {
                if (e.textContent.includes("难度")) {
                    headndidx = i
                }
                if (e.textContent.includes("通过率")) {
                    acrateidx = i
                }
                if (e.textContent.includes("题目评分")){
                    rateRefresh = true
                }
                i += 1
            })
            // console.log(pbtitleidx)
            let childs = arr.childNodes
            let idx = switchTea ? 1 : 0
            let childLength = childs.length
            for (;idx < childLength;idx++) {
                let v = childs[idx]
                if (!v.childNodes[1]) return
                let t = v.childNodes[1].textContent
                // console.log(t)
                let data = t.split(".")
                let id = data[0].trim()
                let nd = v.childNodes[headndidx].childNodes[0].innerHTML
                if (switchrealoj) {
                    v.childNodes[acrateidx].textContent = "隐藏"
                    v.childNodes[headndidx].textContent = "隐藏"
                    continue
                }
                if (t2rate[id] != null && !rateRefresh){
                    nd = t2rate[id]["Rating"]
                    v.childNodes[headndidx].childNodes[0].innerHTML = nd
                } else {
                    let nd2ch = { "text-olive dark:text-dark-olive": "简单", "text-yellow dark:text-dark-yellow": "中等", "text-pink dark:text-dark-pink": "困难" }
                    let cls = v.childNodes[headndidx].childNodes[0].getAttribute("class")
                    v.childNodes[headndidx].childNodes[0].innerHTML = nd2ch[cls]
                }
            }
            tFirst = arr.childNodes[first].textContent
            tLast = lastchild.textContent
            console.log("has refreshed problemlist...")
        }
    }

    let tagt, tagf;
    function getTagData() {
        if (!GM_getValue("switchtag")) return;
        // 筛选更新
        let arr = document.querySelector(".ant-table-tbody")
        let head = document.querySelector(".ant-table-cell")
        if(head == null) return
        head = head.parentNode
        if (tagt && arr.lastChild && tagt == arr.lastChild.textContent
            && tagf && arr.firstChild && tagf == arr.firstChild.textContent) {
            return
        }
        let rateRefresh = false
        // 确认难度序列
        let headndidx
        for (let i = 0; i < head.childNodes.length; i++) {
            let headEle = head.childNodes[i]
            // console.log(headEle.textContent)
            if (headEle.textContent.includes("难度")) {
                headndidx = i
            }
            if (headEle.textContent.includes("题目评分")){
                rateRefresh = true
            }
        }
        let childs = arr.childNodes
        for (const element of childs) {
            let v = element
            if (!v.childNodes[1]) return
            let t = v.childNodes[1].textContent
            let data = t.split(".")
            let id = data[0].trim()
            let nd = v.childNodes[headndidx].childNodes[0].innerHTML
            if (t2rate[id] != null && !rateRefresh) {
                nd = t2rate[id]["Rating"]
                v.childNodes[headndidx].childNodes[0].innerHTML = nd
            } else {
                let nd2ch = { "rgba(var(--dsw-difficulty-easy-rgb), 1)": "简单", "rgba(var(--dsw-difficulty-medium-rgb), 1)": "中等", "rgba(var(--dsw-difficulty-hard-rgb), 1)": "困难" }
                let clr = v.childNodes[headndidx].childNodes[0].getAttribute("color")
                v.childNodes[headndidx].childNodes[0].innerHTML = nd2ch[clr]
            }
        }
        if(arr.lastChild) tagt = arr.lastChild.textContent
        if(arr.firstChild) tagf = arr.firstChild.textContent
        console.log("has refreshed...")
    }

    let companyt, companyf;
    function getCompanyData() {
        if (!GM_getValue("switchcompany")) return;
        let arr = document.querySelector(".ant-table-tbody")
        let head = document.querySelector(".ant-table-cell")
        if(head == null) return
        head = head.parentNode
        if (companyt && arr.lastChild && companyt == arr.lastChild.textContent
            && companyf && arr.firstChild && companyf == arr.firstChild.textContent) {
            return
        }
        // 确认难度序列
        let rateRefresh = false
        let headndidx
        for (let i = 0; i < head.childNodes.length; i++) {
            let headEle = head.childNodes[i]
            if (headEle.textContent.includes("难度")) {
                headndidx = i
            }
            if (headEle.textContent.includes("题目评分")){
                rateRefresh = true
            }
        }
        let childs = arr.childNodes
        for (const element of childs) {
            let v = element
            if (!v.childNodes[1]) return
            let t = v.childNodes[1].textContent
            let data = t.split(".")
            let id = data[0].trim()
            let nd = v.childNodes[headndidx].childNodes[0].innerHTML
            if (t2rate[id] != null && !rateRefresh) {
                nd = t2rate[id]["Rating"]
                v.childNodes[headndidx].childNodes[0].innerHTML = nd
            } else {
                let nd2ch = { "rgba(var(--dsw-difficulty-easy-rgb), 1)": "简单", "rgba(var(--dsw-difficulty-medium-rgb), 1)": "中等", "rgba(var(--dsw-difficulty-hard-rgb), 1)": "困难" }
                let clr = v.childNodes[headndidx].childNodes[0].getAttribute("color")
                v.childNodes[headndidx].childNodes[0].innerHTML = nd2ch[clr]
            }
        }
        if(arr.lastChild) companyt = arr.lastChild.textContent
        if(arr.firstChild) companyf = arr.firstChild.textContent
        console.log("has refreshed...")
    }

    let pblistt, pblistf;
    function getPblistData() {
        if (!GM_getValue("switchpblist")) return;
        let arrList = document.querySelectorAll("div[role='rowgroup']")
        let arr = arrList[0]
        for (let ele of arrList) {
            if (ele.childNodes.length != 0) {
                arr = ele 
                break
            }
        }
        if (arr == null) return
        if (pblistt != null && arr.lastChild && pblistt == arr.lastChild.textContent
            && arr.firstChild && pblistf == arr.firstChild.textContent) {
            return
        }
        let head = document.querySelector("div[role='row']")
        // 确认难度序列
        let rateRefresh = false
        let headndidx;
        for (let i = 0; i < head.childNodes.length; i++) {
            let headEle = head.childNodes[i]
            if (headEle.textContent.includes("难度")) {
                headndidx = i
            }
            if (headEle.textContent.includes("题目评分")){
                rateRefresh = true
            }

        }
        let childs = arr.childNodes
        for (const element of childs) {
            let v = element
            if (!v.childNodes[1]) return
            let t = v.childNodes[1].textContent
            let data = t.split(".")
            let id = data[0].trim()
            let nd = v.childNodes[headndidx].textContent
            if (t2rate[id] != null && !rateRefresh) {
                nd = t2rate[id]["Rating"]
                v.childNodes[headndidx].childNodes[0].innerHTML = nd
            } else {
                let nd2ch = { "text-olive dark:text-dark-olive": "简单", "text-yellow dark:text-dark-yellow": "中等", "text-pink dark:text-dark-pink": "困难" }
                let cls = v.childNodes[headndidx].childNodes[0].getAttribute("class")
                v.childNodes[headndidx].childNodes[0].innerHTML = nd2ch[cls]
            }
        }
        if(arr.lastChild) pblistt = arr.lastChild.textContent
        if(arr.firstChild) pblistf = arr.firstChild.textContent
        console.log("has refreshed...")
    }

    function getSearch() {
        if (!GM_getValue("switchsearch")) return
        let arr = $("div[role='table']")
        if (arr.length == 0) return
        arr = arr[0].childNodes[1]

        let head = document.querySelector("div[role='row']")
        if (!head) rerurn
        // 确认难度序列
        let rateRefresh = false
        let headndidx
        for (let i = 0; i < head.childNodes.length; i++) {
            let headEle = head.childNodes[i]
            if (headEle.textContent.includes("难度")) {
                headndidx = i
            }
            if (headEle.textContent.includes("题目评分")){
                rateRefresh = true
            }
        }
        if (!arr) return
        let childs = arr.childNodes
        for (const element of childs) {
            let v = element
            if (!v.childNodes[1]) return
            let t = v.childNodes[1].textContent
            let data = t.split(".")
            let id = data[0].trim()
            let nd = v.childNodes[headndidx].childNodes[0].innerHTML
            if (t2rate[id] != null && !rateRefresh) {
                nd = t2rate[id]["Rating"]
                v.childNodes[headndidx].childNodes[0].innerHTML = nd
            } else {
                let nd2ch = { "text-green-s": "简单", "text-yellow": "中等", "text-red-s": "困难" }
                let clr = v.childNodes[headndidx].childNodes[0].getAttribute("class")
                v.childNodes[headndidx].childNodes[0].innerHTML = nd2ch[clr]
            }
        }
    }
    // 只确认一次
    let studyf;
    function getStudyData(css_selector) {
        if (!GM_getValue("switchstudy")) return;
        levelData = JSON.parse(GM_getValue("levelData", "{}").toString())
        let totArr = null
        // 如果传入的是已经找到的node元素, 就不再搜索
        if (css_selector instanceof Element) {
            totArr = css_selector
        }  else {
            totArr = document.querySelector(css_selector)
        }
        if (totArr == null) return;
        let first = totArr.firstChild.childNodes[0].textContent
        if (studyf && studyf == first) {
            return
        }
        let childs = totArr.childNodes
        for (const arr of childs) {
            for (let pbidx = 1; pbidx < arr.childNodes.length; pbidx++) {
                let pb = arr.childNodes[pbidx]
                let pbNameLabel = pb.querySelector(".truncate")
                let pbName = pbNameLabel.textContent
                let nd = pb.childNodes[0].childNodes[1].childNodes[1]
                let id = pbName2Id[pbName]
                pbName = pbName.split(" ").join("") //去除中间的空格
                let level = levelData[pbName]
                // console.log(pbName, level)
                let hit = false
                let darkn2c = {"text-lc-green-60": "简单", "text-lc-yellow-60": "中等", "text-lc-red-60": "困难" }
                let lightn2c = {"text-lc-green-60": "简单", "text-lc-yellow-60": "中等", "text-lc-red-60": "困难" }
                // rating
                if (id && t2rate[id]) {
                    // console.log(id)
                    let ndRate = t2rate[id]["Rating"]
                    nd.textContent = ndRate
                    hit = true
                } else {
                    if (!nd) break
                    let clr = nd.getAttribute("class")
                    let flag = true
                    for (let c in lightn2c) {
                        if (!flag) break
                        if (clr.includes(c)) {
                            nd.innerHTML = lightn2c[c] 
                            flag= false
                        }
                    }
                    for (let c in darkn2c) {
                        if (!flag) break
                        if (clr.includes(c)) {
                            nd.innerHTML = darkn2c[c] 
                            flag= false
                        }
                    }
                }
                // level渲染
                if (level && GM_getValue("switchlevel")) {
                    // console.log(pbName, level)
                    let text = document.createElement('span')
                    text.style = nd.getAttribute("style")
                    text.innerHTML = "算术评级: " + level["Level"].toString()
                    if (hit) text.style.paddingRight = "125px" // 命中之后宽度不一样
                    else text.style.paddingRight = "130px" 
                    nd.parentNode.insertBefore(text, nd)
                }
            }
        }
        if(totArr.firstChild.childNodes[0]) studyf = totArr.firstChild.childNodes[0].textContent
        console.log("has refreshed...")
    }

    let pbsidef;
    function getpbside(css_selector) {
        let totArr = null
        // 如果传入的是已经找到的node元素, 就不再搜索
        if (css_selector instanceof Element) {
            totArr = css_selector
        }  else {
            totArr = document.querySelector(css_selector)
        }
        if (totArr == null) return;
        let first = totArr.firstChild.childNodes[0].textContent
        if (pbsidef && pbsidef == first) {
            return
        }
        let childs = totArr.childNodes
        for (const arr of childs) {
            // 特殊判定， 如果大于30则是每日一日列表
            let pbidx = 1;
            if (arr.childNodes.length >= 30) pbidx = 0;
            for (; pbidx < arr.childNodes.length; pbidx++) {
                let pb = arr.childNodes[pbidx]
                let pbName = pb.childNodes[0].childNodes[1].childNodes[0].textContent
                let nd = pb.childNodes[0].childNodes[1].childNodes[1]
                let data = pbName.split(".")
                pbName = data[1]
                let id = data[0]
                if (pbName == null) {
                    pbName = ""
                } else {
                    pbName = pbName.split(" ").join("")
                }
                let level = levelData[pbName]
                // console.log(pbName)
                // console.log(level)
                let hit = false
                let darkn2c = {"text-lc-green-60": "简单", "text-lc-yellow-60": "中等", "text-lc-red-60": "困难" }
                let lightn2c = {"text-lc-green-60": "简单", "text-lc-yellow-60": "中等", "text-lc-red-60": "困难" }
                // rating
                if (id && t2rate[id]) {
                    let ndRate = t2rate[id]["Rating"]
                    nd.textContent = ndRate
                    hit = true
                } else {
                    if (!nd) break
                    let clr = nd.getAttribute("class")
                    if (clr == null) console.log(nd);
                    let flag = true
                    for (let c in lightn2c) {
                        if (!flag) break
                        if (clr.includes(c)) {
                            nd.innerHTML = lightn2c[c] 
                            flag= false
                        }
                    }
                    for (let c in darkn2c) {
                        if (!flag) break
                        if (clr.includes(c)) {
                            nd.innerHTML = darkn2c[c] 
                            flag= false
                        }
                    }
                }
                // level渲染
                if (level && GM_getValue("switchlevel")) {
                    let text = document.createElement('span')
                    text.style = nd.getAttribute("style")
                    text.innerHTML = "算术评级: " + level["Level"].toString()
                    if (hit) text.style.paddingRight = "75px" // 命中之后宽度不一样
                    else text.style.paddingRight = "80px" 
                    nd.parentNode.insertBefore(text, nd)
                }
            }
        }
        if(totArr.firstChild.childNodes[0]) pbsidef = totArr.firstChild.childNodes[0].textContent
        console.log("已经刷新侧边栏envType分数...")
    }


    // var lang, statusQus
    let eventhappend = function() {
        let key = document.querySelector('.inputarea')
        key.setAttribute('aria-autocomplete','both')
        key.setAttribute('aria-haspopup',false)
        key.removeAttribute('data-focus-visible-added')
        key.removeAttribute('aria-activedescendant')
    }
    
    function getpbsideData() {
        // 左侧栏分数显示
        let searchParams = location.search
        levelData = JSON.parse(GM_getValue("levelData", "{}").toString())
        // ?envType=study-plan-v2&envId=leetcode-75
        if (searchParams.indexOf("?") != -1) { 
            let str = searchParams.substring(1); 
            let strs = str.split("="); 
            let code = strs[0];
            // 参数含有envType就是使用标签进行渲染
            if (code.includes("envType")) {
                let overflow = document.querySelector(".overflow-auto.p-5")
                if (overflow == null) return
                let studyplan = overflow.childNodes[0].childNodes[1];
                if(!studyplan) studyf = null
                if(GM_getValue("switchstudy") && studyplan) {
                    getpbside(studyplan)
                }
            }
        } else {
            // 题目页面题库展开栏
            let overflow = document.querySelector(".overflow-auto.p-5")
            if (overflow == null) return
            let pbarr = overflow?.childNodes[0]?.childNodes[1]?.childNodes[0];
            if (pbarr == null) return
            if (pbsidef == pbarr.firstChild.textContent) return
            if (pbarr != null) {
                for (const onepb of pbarr.childNodes) {
                    let pbName = onepb.childNodes[0]?.childNodes[1]?.childNodes[0]?.textContent
                    if (pbName == null) return
                    let nd = onepb.childNodes[0]?.childNodes[1]?.childNodes[1]
                    if (nd == null) return 
                    // 如果为算术，说明当前已被替换过
                    if (nd.textContent.includes("算术")) continue
                    pbName2Id = JSON.parse(GM_getValue("pbName2Id", "{}").toString())
                    let data = pbName.split(".")
                    pbName = data[1]
                    if (pbName == null) {
                        pbName = ""
                    } else {
                        pbName = pbName.split(" ").join("")
                    }
                    let level = levelData[pbName]
                    // console.log(pbName)
                    // console.log(level)
                    let hit = false
                    let id = data[0]
                    let darkn2c =  {"text-lc-green-60": "简单", "text-lc-yellow-60": "中等", "text-lc-red-60": "困难" }
                    let lightn2c =  {"text-lc-green-60": "简单", "text-lc-yellow-60": "中等", "text-lc-red-60": "困难" }
                    // rating
                    if (id && t2rate[id]) {
                        let ndRate = t2rate[id]["Rating"]
                        nd.textContent = ndRate
                        hit = true
                    } else {
                        if (!nd) break
                        let clr = nd.getAttribute("class")
                        // console.log(nd)
                        // console.log(clr)
                        let flag = true
                        for (let c in lightn2c) {
                            if (!flag) break
                            if (clr.includes(c)) {
                                nd.innerText = lightn2c[c] 
                                flag = false
                            }
                        }
                        for (let c in darkn2c) {
                            if (!flag) break
                            if (clr.includes(c)) {
                                nd.innerText = darkn2c[c] 
                                flag = false
                            }
                        }
                    }
                    // level渲染
                    if (level && GM_getValue("switchlevel")) {
                        let text = document.createElement('span')
                        text.style = nd.getAttribute("style")
                        text.innerHTML = "算术评级: " + level["Level"].toString()
                        if (hit) text.style.paddingRight = "75px" // 命中之后宽度不一样
                        else text.style.paddingRight = "80px" 
                        nd.parentNode.insertBefore(text, nd)
                    }
                }
                pbsidef = pbarr.firstChild.textContent
                console.log("已经刷新侧边栏题库分数...")
            }
        }
    }

    function createSearchBtn() {
        if(!GM_getValue("switchpbsearch")) return
        if (document.querySelector("#id-dropdown") == null) {
            // 题目页面才渲染并且监听标签变化
            observerpb()
            $(document.body).append(`<link href="https://unpkg.com/layui@2.9.6/dist/css/layui.css" rel="stylesheet">`)
            // 做个搜索框
            let div = document.createElement("div")
            div.setAttribute("class", "layui-inline")
            div.innerHTML += `<input name="" placeholder="请输入题号或关键字" class="layui-input" id="id-dropdown">`
            let center = document.querySelector('.flex.items-center')
            center = center?.childNodes[0]?.childNodes[0]?.childNodes[0]
            if (center == null) return
            if (center.childNodes.length > 0) center.insertBefore(div, center.childNodes[1])
            else center.appendChild(div)
            layui.use(function(){
                let dropdown = layui.dropdown;
                let $ = layui.$;
                let inst = dropdown.render({
                    elem: '#id-dropdown',
                    data: [],
                    click: function(obj){
                        this.elem.val(obj.title);
                        this.elem.attr('data-id', obj.id)
                    }
                });
                
                $(inst.config.elem).on('input propertychange', function(event) {
                    let elem = $(this);
                    let value = elem.val().trim();
                    elem.removeAttr('data-id');
                    let dataNew = findData(value);
                    dropdown.reloadData(inst.config.id, {
                        data: dataNew
                    })
                });

                $(inst.config.elem).on('blur', function() {
                    let elem = $(this);
                    let dataId = elem.attr('data-id');
                    if (!dataId) {
                        elem.val('');
                    }
                });
                function findData(value) {
                    return getsearch(value);
                }
                function getsearch(search) {
                    let queryT = `
                        query problemsetQuestions($in: ProblemsetQuestionsInput!) {
                            problemsetQuestions(in: $in) {
                            hasMore
                            questions {
                                titleCn
                                titleSlug
                                title
                                frontendId
                                acRate
                                solutionNum
                                difficulty
                                userQuestionStatus
                            }
                            }
                        }
                    `
                    let list = { "query": queryT, operationName: "problemsetQuestions", "variables": {"in" : {"query": search, "limit": 10, "offset":0}} };
                    let resLst = []
                    $.ajax({ type :"POST", url : lcnojgo, data: JSON.stringify(list), success: function(res) {
                        let data = res.data.problemsetQuestions.questions
                        for (let idx = 0; idx < data.length; idx++){
                            let resp = data[idx]
                            let item = {}
                            item.id = idx
                            item.title = resp.frontendId + "." +resp.titleCn
                            item.href = "https://leetcode.cn/problems/" + resp.titleSlug
                            item.target = "_self"
                            resLst.push(item)
                        }
                    }, async: false, xhrFields : { withCredentials: true }, contentType: "application/json;charset=UTF-8"})
                    return resLst
                }
            });
        }
    }
    function getpb() {
        let switchrealoj = GM_getValue("switchrealoj")
        // 左边栏
        if(GM_getValue("switchpbside")) getpbsideData()
        // 搜索功能
        createSearchBtn()
        // 题目页面
        let curUrl = location.href
        // 只有描述页才进行加载
        let isDescript = !curUrl.match(regDiss) && !curUrl.match(regSovle) && !curUrl.match(regPbSubmission)
        if (isDescript) {
            if (isDynamic) {
                // 流动布局逻辑
                let t = document.querySelector(".text-title-large")
                if (t == null) {
                    t1 = "unknown"
                    return
                }
                let data = t.textContent.split(".")
                let id = data[0].trim()
                if (t1 != null && t1 == id) {
                    return
                }
                let title = data[1]
                if (title == null ) {
                    title = ""
                } else {
                    title = title.split(" ").join("").trim()
                }
                // console.log(title)
                let colorA = ['.text-difficulty-hard', '.text-difficulty-easy','.text-difficulty-medium']
                let colorSpan;
                for (const color of colorA) {
                    colorSpan = document.querySelector(color)
                    if (colorSpan) break
                }
                if (!colorSpan) {
                    console.log("color ele not found")
                    return
                }
                // code提示功能
                if (GM_getValue("switchcode")) {
                    waitForKeyElements(".overflowingContentWidgets", ()=>{
                        $('.overflowingContentWidgets').remove()
                    });
                    let div = document.querySelector('div.h-full.w-full')
                    div.onkeydown = function(event) {
                        if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode == 13) {
                            eventhappend()
                        }
                    }
                }
                // 统计难度分数并且修改
                let nd = colorSpan.getAttribute("class")
                let nd2ch = { "text-difficulty-easy": "简单", "text-difficulty-medium": "中等", "text-difficulty-hard": "困难" }
                if (switchrealoj || (t2rate[id] != null && GM_getValue("switchpbscore"))) {
                    if (switchrealoj) colorSpan.remove()
                    else if(t2rate[id] != null) colorSpan.innerHTML = t2rate[id]["Rating"]
                } else {
                    for (let item in nd2ch) {
                        if (nd.toString().includes(item)) {
                            colorSpan.innerHTML = nd2ch[item]
                            break
                        }
                    }
                }
                
                // 逻辑，准备做周赛链接,如果已经不存在组件就执行操作
                let url = chContestUrl
                let zhUrl = zhContestUrl
                let tips = colorSpan.parentNode
                let tipsPa = tips.parentNode
                // tips 一栏的父亲节点第一子元素的位置, 插入后变成竞赛信息位置
                let tipsChildone = tipsPa.childNodes[1]
                // 题目内容, 插入后变成原tips栏目
                let pbDescription = tipsPa.childNodes[2]
                if (pbDescription.getAttribute("data-track-load") != null) {
                    let divTips = document.createElement("div")
                    divTips.setAttribute("class", "flex gap-1")
                    let abody = document.createElement("a")
                    abody.setAttribute("data-small-spacing", "true")
                    abody.setAttribute("class", "css-nabodd-Button e167268t1 hover:text-blue-s")
                    let abody2 = document.createElement("a")
                    abody2.setAttribute("data-small-spacing", "true")
                    abody2.setAttribute("class", "css-nabodd-Button e167268t1 hover:text-blue-s")
                    
                    let abody3 = document.createElement("a")
                    abody2.setAttribute("data-small-spacing", "true")
                    abody2.setAttribute("class", "css-nabodd-Button e167268t1 hover:text-blue-s")
                    let span = document.createElement("span")
                    let span2 = document.createElement("span")
                    let span3 = document.createElement("span")
                    let levelData = JSON.parse(GM_getValue("levelData", "{}").toString())
                    if (levelData[title] != null) {
                        let des = "算术评级: " + levelData[title]["Level"].toString()
                        span3.innerText = des
                        span3.onclick = function(e) {
                            e.preventDefault();
                            let des = `
                                1      无算法要求
                                2      知道常用数据结构和算法并简单使用
                                3      理解常用数据结构和算法
                                4      掌握常用数据结构和算法
                                5      熟练掌握常用数据结构和算法，初步了解高级数据结构
                                6      深入理解并灵活应用数据结构和算法，理解高级数据结构
                                7      结合多方面的数据结构和算法，处理较复杂问题
                                8      掌握不同的数据结构与算法之间的关联性，处理复杂问题，掌握高级数据结构
                                9      处理复杂问题，对时间复杂度的要求更严格
                                10     非常复杂的问题，非常高深的数据结构和算法(例如线段树、树状数组)
                                11     竞赛内容，知识点超出面试范围
                            `
                            layer.open({
                                type: 1 // Page 层类型
                                ,area: ['700px', '320px']
                                ,title: '算术评级说明'
                                ,shade: 0.6 // 遮罩透明度
                                ,maxmin: true // 允许全屏最小化
                                ,anim: 5 // 0-6的动画形式，-1不开启
                                ,content: `<p class="containerlingtea" style="padding:10px;color:#000;">${des}</p>`
                            });
                        }
                        abody3.removeAttribute("hidden")
                    } else {
                        span3.innerText = "未知评级"
                        abody3.setAttribute("hidden", "true")
                    }
                    // ContestID_zh  ContestSlug
                    abody3.setAttribute("href", "")
                    abody3.setAttribute("style", "padding-right: 10px;")
                    abody3.setAttribute("target", "_blank")
                    if (t2rate[id] != null) {
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
                        if(switchrealoj) abody2.setAttribute("hidden", true)
                        else abody2.removeAttribute("hidden")
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
                    abody.setAttribute("style", "padding-right: 10px;")
                    abody2.setAttribute("style", "padding-top: 1.5px;")
                    abody.appendChild(span)
                    abody2.appendChild(span2)
                    abody3.appendChild(span3)
                    divTips.appendChild(abody3)
                    divTips.appendChild(abody)
                    divTips.appendChild(abody2)
                    tipsPa.insertBefore(divTips, tips)
                } else if ( tipsChildone.childNodes != null
                            && tipsChildone.childNodes.length >= 2 
                            && (tipsChildone.childNodes[2].textContent.includes("Q") 
                            || tipsChildone.childNodes[2].textContent.includes("未知"))) { 
                    let pa = tipsChildone
                    let le = pa.childNodes.length
                    // 存在就直接替换
                    let levelData = JSON.parse(GM_getValue("levelData", "{}").toString())
                    if (levelData[title] != null) {
                        let des = "算术评级: " + levelData[title]["Level"].toString()
                        pa.childNodes[le - 3].childNodes[0].innerText = des
                        pa.childNodes[le - 3].childNodes[0].onclick = function(e) {
                            e.preventDefault();
                            let des = `
                                1      无算法要求
                                2      知道常用数据结构和算法并简单使用
                                3      理解常用数据结构和算法
                                4      掌握常用数据结构和算法
                                5      熟练掌握常用数据结构和算法，初步了解高级数据结构
                                6      深入理解并灵活应用数据结构和算法，理解高级数据结构
                                7      结合多方面的数据结构和算法，处理较复杂问题
                                8      掌握不同的数据结构与算法之间的关联性，处理复杂问题，掌握高级数据结构
                                9      处理复杂问题，对时间复杂度的要求更严格
                                10     非常复杂的问题，非常高深的数据结构和算法(例如线段树、树状数组)
                                11     竞赛内容，知识点超出面试范围
                            `
                            layer.open({
                                type: 1 // Page 层类型
                                ,area: ['700px', '320px']
                                ,title: '算术评级说明'
                                ,shade: 0.6 // 遮罩透明度
                                ,maxmin: true // 允许全屏最小化
                                ,anim: 5 // 0-6的动画形式，-1不开启
                                ,content: `<p class="containerlingtea" style="padding:10px;color:#000;">${des}</p>`
                            });
                        }
                        pa.childNodes[le - 3].removeAttribute("hidden")
                    } else {
                        pa.childNodes[le - 3].childNodes[0].innerText = "未知评级"
                        pa.childNodes[le - 3].childNodes[0].setAttribute("hidden", "true")
                    }
                    // ContestID_zh  ContestSlug
                    if (t2rate[id] != null) {
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
                        if(switchrealoj) pa.childNodes[le - 1].setAttribute("hidden", "true")
                        else pa.childNodes[le - 1].removeAttribute("hidden")
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
                t1 = id
            } else {
                // 新版逻辑
                let t = document.querySelector(".text-lg")
                if (t == null) {
                    t1 = "unknown"
                    return
                }
                // let pb = location.href
                // let titleTag = pb.substring(pb.indexOf("problems")+9, pb.indexOf("description")-1)
                let data = t.textContent.split(".")
                let id = data[0].trim()
                let colorA = ['.text-pink', '.text-olive','.text-yellow']
                let colorSpan;
                for (const color of colorA) {
                    colorSpan = document.querySelector(color)
                    if (colorSpan) break
                }
                if (!colorSpan) {
                    console.log("color ele not found")
                    return
                }
                let pa = colorSpan.parentNode
                if (t1 != null && t1 == id) {
                    return
                }
                if (GM_getValue("switchcode")) {
                    waitForKeyElements(".overflowingContentWidgets", ()=>{
                        $('.overflowingContentWidgets').remove()
                    });
                    let div = document.querySelector('div.h-full.w-full')
                    div.onkeydown = function(event) {
                        if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode == 13) {
                            eventhappend()
                        }
                    }
                }

                // 新版统计难度分数并且修改
                let nd = colorSpan.getAttribute("class")
                let nd2ch = { "text-olive dark:text-dark-olive": "简单", "text-yellow dark:text-dark-yellow": "中等", "text-pink dark:text-dark-pink": "困难" }
                if (switchrealoj || (t2rate[id] != null)) {
                    if (switchrealoj) colorSpan.remove()
                    else if(t2rate[id] != null) colorSpan.innerHTML = t2rate[id]["Rating"]
                } else {
                    for (let item in nd2ch) {
                        if (nd.toString().includes(item)) {
                            colorSpan.innerHTML = nd2ch[item]
                            break
                        }
                    }
                }
                // 新版逻辑，准备做周赛链接,如果已经不存在组件就执行操作
                let url = chContestUrl
                let zhUrl = zhContestUrl
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
                    if (t2rate[id] != null) {
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
                        if(switchrealoj) abody2.setAttribute("hidden", true)
                        else abody2.removeAttribute("hidden")
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
                    if (t2rate[id] != null) {
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
                        if(switchrealoj) pa.childNodes[le - 1].setAttribute("hidden", "true")
                        else pa.childNodes[le - 1].removeAttribute("hidden")
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
                t1 = id
            }
        }
    }


    function clearAndStart(url, timeout, isAddEvent) {
            let start = ""
            let targetIdx = -1
            let pageLst = ['all', 'tag', 'pb', 'company', 'pblist', 'search', 'study']
            let urlLst = [allUrl, tagUrl, pbUrl, companyUrl, pblistUrl, searchUrl, studyUrl]
            let funcLst = [getData, getTagData, getpb, getCompanyData, getPblistData, getSearch, getStudyData]
            for (let index = 0; index < urlLst.length; index++) {
                const element = urlLst[index];
                if (url.match(element)) {
                    targetIdx = index
                    // console.log(targetIdx, url)
                } else if (!url.match(element)) {
                    let tmp = GM_getValue(pageLst[index], -1)
                    clearInterval(tmp)
                }
            }
            if(targetIdx != -1) start = pageLst[targetIdx]
            if (start != "") {
                let css_selector = "div.relative.flex.w-full.flex-col > .flex.w-full.flex-col.gap-4"
                if(start == 'study') id = setInterval(getStudyData, timeout, css_selector)
                else id = setInterval(funcLst[targetIdx], timeout)
                GM_setValue(start, id)
            }
            if (isAddEvent) {
                // 只需要定位urlchange变更
                window.addEventListener("urlchange", () => {
                    console.log("urlchange/event/happened")
                    let newUrl = location.href
                    clearAndStart(newUrl, 1000, false)
                })
            }
    }

    // 获取界面所需数据, 需要在菜单页面刷新前进行更新
    function getNeedData() {
        // 更新分数数据
        async function getScore() {
            let now = getCurrentDate(1)
            preDate = GM_getValue("preDate", "")
            if (t2rate["tagVersion6"] == null || (preDate == "" || preDate != now)) {
                // 每天重置为空
                GM_setValue("pbSubmissionInfo", "{}")
                let res = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "get",
                        url: rakingUrl + "?timeStamp=" + new Date().getTime(),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        onload: function (res) {
                            resolve(res)
                        },
                        onerror: function (err) {
                            console.log('error')
                            console.log(err)
                        }
                    });
                });
                if (res.status === 200) {
                    // 保留唯一标识
                    t2rate = {}
                    pbName2Id = {}
                    let dataStr = res.response
                    let json = eval(dataStr)
                    for (const element of json) {
                        t2rate[element.ID] = element
                        t2rate[element.ID]["Rating"] = Number.parseInt(Number.parseFloat(element["Rating"]) + 0.5)
                        pbName2Id[element.TitleZH] = element.ID
                    }
                    t2rate["tagVersion6"] = {}
                    console.log("everyday getdate once...")
                    preDate = now
                    GM_setValue("preDate", preDate)
                    GM_setValue("t2ratedb", JSON.stringify(t2rate))
                    GM_setValue("pbName2Id", JSON.stringify(pbName2Id))
                }
            }
        }
        getScore()

        // 更新level数据
        async function getPromiseLevel() {
            let week = new Date().getDay()
            if (levelData["tagVersion20"] == null || week == 1) {
                let res = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "get",
                        url: levelUrl + "?timeStamp=" + new Date().getTime(),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        onload: function (res) {
                            resolve(res)
                        },
                        onerror: function (err) {
                            console.log('error')
                            console.log(err)
                        }
                    });
                });
                if (res.status === 200) {
                    levelData = {}
                    let dataStr = res.response
                    let json = eval(dataStr)
                    for (const element of json) {
                        if (typeof element.TitleZH == 'string') {
                            let title = element.TitleZH.split(" ").join("")
                            levelData[title] = element
                        }
                    }
                    levelData["tagVersion20"] = {}
                    console.log("every Monday get level once...")
                    GM_setValue("levelData", JSON.stringify(levelData))
                }
            }
        }
        getPromiseLevel()
        
    
        if (location.href.match(allUrl)) {
            // 版本更新机制
            GM_xmlhttpRequest({
                method: "get",
                url: versionUrl + "?timeStamp=" + new Date().getTime(),
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
                                area: ['400px', '260px'],
                                content: '<pre class="versioncontent" style="color:#000">更新通知: <br/>leetcodeRating有新的版本' + v +'啦,请前往更新~ <br/>' + "更新内容: <br/>" + upcontent + "</pre>",
                                yes: function (index, layer0) {
                                    let c = window.open(sciptUrl + "?timeStamp=" + new Date().getTime())
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
        }
    }

    // 定时启动函数程序
    clearAndStart(location.href, 1, true)
    GM_addStyle(`
        .versioncontent {
            white-space: pre-wrap;
            word-wrap: break-word;
            display: block;
        }
    `)

// spig js 纸片人相关
if (GM_getValue("switchperson")) {
    // url数据
    let imgUrl = "https://i.ibb.co/89XdTMf/Spig.png"
//    let imgUrl = "https://raw.githubusercontents.com/zhang-wangz/LeetCodeRating/main/assets/samplespig.png"
    let checkUrl = "https://leetcode.cn/submissions/detail/.*/check/"

    const isindex = true
    const visitor = "主人"
    let msgs = []

    // 求等级用的数据
    let userTag = null
    let level = 0
    let score = 0
    const queryProcess = '\n    query userQuestionProgress($userSlug: String!) {\n  userProfileUserQuestionProgress(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      difficulty\n      count\n    }\n    numFailedQuestions {\n      difficulty\n      count\n    }\n    numUntouchedQuestions {\n      difficulty\n      count\n    }\n  }\n}\n    '
    const queryUser = '\n    query globalData {\n  userStatus {\n    isSignedIn\n    isPremium\n    username\n    realName\n    avatar\n    userSlug\n    isAdmin\n    checkedInToday\n    useTranslation\n    premiumExpiredAt\n    isTranslator\n    isSuperuser\n    isPhoneVerified\n    isVerified\n  }\n  jobsMyCompany {\n    nameSlug\n  }\n  commonNojPermissionTypes\n}\n    '
    GM_addStyle(`
        .spig {
            display:block;
            width:154px;
            height:190px;
            position:absolute;
            top: -150px;
            left: 160px;
            z-index:9999;
        }
        #message {
            line-height:170%;
            color :#191919;
            border: 1px solid #c4c4c4;
            background:#ddd;
            -moz-border-radius:5px;
            -webkit-border-radius:5px;
            border-radius:5px;
            min-height:1em;
            padding:5px;
            top:-30px;
            position:absolute;
            text-align:center;
            width:auto !important;
            z-index:10000;
            -moz-box-shadow:0 0 15px #eeeeee;
            -webkit-box-shadow:0 0 15px #eeeeee;
            border-color:#eeeeee;
            box-shadow:0 0 15px #eeeeee;
            outline:none;
            opacity: 0.75 !important;
        }
        .mumu {
            width:154px;
            height:190px;
            cursor: move;
            background:url(${imgUrl}) no-repeat;
        }

        #level {
            text-align:center;
            z-index:9999;
            color :#191919;
        }
    `)

    const spig = `<div id="spig" class="spig" hidden>
                            <div id="message">正在加载中……</div>
                            <div style="height=80px"/>
                            <div id="mumu" class="mumu"></div>
                            <div id="level">level loading...</div>
                        </div>`
    const hitokoto = `<span class="hitokoto" id="hitokoto" style="display:none">Loading...</span>`
    $("body").append(spig, hitokoto)

    // 消息函数
    let showMessage = (a, b) => {
        if (b == null) b = 10000;
        $("#mumu").css({"opacity":"0.5 !important"})
        $("#message").hide().stop();
        $("#message").html(a);
        $("#message").fadeIn();
        $("#message").fadeTo("1", 1);
        $("#message").fadeOut(b);
        $("#mumu").css({"opacity":"1 !important"})
    };

    // 右键菜单
    jQuery(document).ready(function ($) {
        $("#spig").mousedown(function (e) {
            if(e.which == 3){
                showMessage(`秘密通道:<br/> <a href="${allUrl}" title="题库">题库</a>`,10000);
            }
        });
        $("#spig").bind("contextmenu", function(e) {
            return false;
        });
    });

    function getscore(userTag) {
        let list = { "query": queryProcess, "variables": { "userSlug" : userTag } };
        $.ajax({ type :"POST", url : lcgraphql, data: JSON.stringify(list), success: function(res) {
            let levelData = res.data.userProfileUserQuestionProgress.numAcceptedQuestions
            levelData.forEach(e => {
                if (e.difficulty == "EASY")  score += e.count * 10
                else if (e.difficulty == "MEDIUM")  score += e.count * 20
                else if (e.difficulty == "HARD")  score += e.count * 100
            });
            level = score / 1000
            $("#level").text("level: " + Math.trunc(level).toString())
            console.log("目前纸片人的等级是: " + Math.trunc(level).toString())
        }, async: false, xhrFields : { withCredentials: true }, contentType: "application/json;charset=UTF-8"})
    }

    $.ajax({ type :"POST", url : lcgraphql, data: JSON.stringify({"query" : queryUser, "variables": {}}), success: function(res) {
        userTag = res.data.userStatus.userSlug
        // console.log(userTag)
    }, async: false, xhrFields : { withCredentials: true }, contentType: "application/json;charset=UTF-8"})

    if (userTag != null) {
        getscore(userTag)
    } else {
        // console.log(userTag)
        $("#level").text("请登录后再尝试获取level")
    }
    // 监听分数提交
    let addListener2 = () => {
        XMLHttpRequest.prototype.send = function (str) {
            const _onreadystatechange = this.onreadystatechange;
            this.onreadystatechange = (...args) => {
                if (this.readyState == this.DONE && this.responseURL.match(checkUrl)) {
                    let resp = JSON.parse(this.response)
                    // console.log(resp)
                    if (resp && resp.status_msg && resp.status_msg.includes("Accepted")) {
                        showMessage("恭喜主人成功提交， 当前分数为: " + score + ", 当前等级为: " + Math.trunc(level).toString())
                        console.log("恭喜主人成功提交， 当前分数为: " + score + ", 当前等级为: " + Math.trunc(level).toString())
                    } else if (resp && resp.status_msg && !resp.status_msg.includes("Accepted"))  {
                        showMessage("很遗憾，主人提交失败，不过也不要气馁呀，加油! <br/> 当前分数为: " + score + ", 当前等级为: " + Math.trunc(level).toString())
                        console.log("很遗憾，主人提交失败，不过也不要气馁呀，加油! 当前分数为: " + score + ", 当前等级为: " + Math.trunc(level).toString())
                    }
                }
                if (_onreadystatechange) {
                    _onreadystatechange.apply(this, args);
                }
            }
            return dummySend.call(this, str);
        }
    }
    addListener2()

    // 鼠标在消息上时
    jQuery(document).ready(function ($) {
        $("#message").hover(function () {
            $("#message").fadeTo("100", 1);
        });
    });

    // 鼠标在上方时
    jQuery(document).ready(function ($) {
        $(".mumu").mouseover(function () {
            $(".mumu").fadeTo("300", 0.3);
            msgs = ["我隐身了，你看不到我", "我会隐身哦！嘿嘿！", "别动手动脚的，把手拿开！", "把手拿开我才出来！"];
            let i = Math.floor(Math.random() * msgs.length);
            showMessage(msgs[i]);
        });
        $(".mumu").mouseout(function () {
            $(".mumu").fadeTo("300", 1)
        });
    });

    function msgPageWelcome(url, isAddEvent) {
        let urlLst = [allUrl, tagUrl, pbUrl, companyUrl, pblistUrl, searchUrl]
        let msgShow = ["欢迎来到题库页, 美好的一天从做每日一题开始~", "欢迎来到分类题库页面，针对专题练习有利于进步哦～", "欢迎来到做题页面，让我看看是谁光看不做？🐰", "欢迎来到公司题库，针对专门的公司题目练习有利于面试呢", "欢迎来到题单页面~", "欢迎来到搜索页，在这里你能搜到一切你想做的题！"]
        for (let index = 0; index < urlLst.length; index++) {
            const element = urlLst[index];
            if (url.match(element)) {
                // console.log(msgShow[index])
                showMessage(msgShow[index])
            }
        }
        if (isAddEvent) {
            window.addEventListener("urlchange", () => {
                let newUrl = location.href
                msgPageWelcome(newUrl, false)
            })
        }
    }

    // 开始
    jQuery(document).ready(function ($) {
        if (isindex) { // 如果是主页
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
            msgPageWelcome(location.href, true)
        }
        else {
            showMessage('力扣欢迎你～', 6000);
        }
        let top = $("#spig").offset().top + 150
        let left = document.body.offsetWidth - 160
        if (location.href.match(pbUrl)) {
            top = $("#spig").offset().top + 200
        }
        $("#spig").attr("hidden", false)
        $("#spig").css({top : top, left : left})

    });

    // 随滚动条移动
    jQuery(document).ready(function ($) {
        let f = $(".spig").offset().top;
        $(window).scroll(function () {
            $(".spig").animate({
                top: $(window).scrollTop() + f + 150
            },
            {
                queue: false,
                duration: 1000
            });
        });
    });

    // 鼠标点击时
    jQuery(document).ready(function ($) {
        let stat_click = 0;
        let i = 0;
        $(".mumu").click(function () {
            if (!ismove) {
                stat_click++;
                if (stat_click > 4) {
                    msgs = ["你有完没完呀？", "你已经摸我" + stat_click + "次了", "非礼呀！救命！OH，My ladygaga"];
                    i = Math.floor(Math.random() * msgs.length);
                    showMessage(msgs[i]);
                } else {
                    msgs = ["筋斗云！~我飞！", "我跑呀跑呀跑！~~", "别摸我，有什么好摸的！", "惹不起你，我还躲不起你么？", "不要摸我了，我会告诉你老婆来打你的！", "干嘛动我呀！小心我咬你！"];
                    i = Math.floor(Math.random() * msgs.length);
                    showMessage(msgs[i]);
                }
            let s = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6,0.7,0.75,-0.1, -0.2, -0.3, -0.4, -0.5, -0.6,-0.7,-0.75];
            let i1 = Math.floor(Math.random() * s.length);
            let i2 = Math.floor(Math.random() * s.length);
                $(".spig").animate({
                left: document.body.offsetWidth/2*(1+s[i1]),
                top:  document.body.offsetHeight/2*(1+s[i2])
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

    // 拖动
    let _move = false;
    let ismove = false; // 移动标记
    let _x, _y; // 鼠标离控件左上角的相对位置

    jQuery(document).ready(function ($) {
        $("#spig").mousedown(function (e) {
            _move = true;
            _x = e.pageX - parseInt($("#spig").css("left"));
            _y = e.pageY - parseInt($("#spig").css("top"));
        });
        $(document).mousemove(function (e) {
            if (_move) {
                let x = e.pageX - _x;
                let y = e.pageY - _y;
                let wx = $(window).width() - $('#spig').width();
                let dy = $(document).height() - $('#spig').height();
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

    // 纸片人一言api
    // $("#spig").attr("hidden", false)
    let hitokotohtml = function() {
        let msgShow = [$("#hitokoto").text()];
        showMessage(msgShow[0]);
        setTimeout(hitokotohtml, 15000)
    }
    setTimeout(hitokotohtml, 6000)

    function getkoto(){
        $.get("https://v1.hitokoto.cn/?c=j&encode=json").then(res => {echokoto(res);}).catch(xhr=>xhr)
        setTimeout(getkoto, 6000)
    }
    function echokoto(result){
        let hc = eval(result);
        document.getElementById("hitokoto").textContent = hc.hitokoto;
        // console.log(hc.content)
    }
    setTimeout(getkoto, 5000);
}

})();
