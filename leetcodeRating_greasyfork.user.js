// ==UserScript==
// @name         LeetCodeRating｜English
// @namespace    https://github.com/zhang-wangz
// @version      1.1.5
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
// @connect      raw.gitmirror.com
// @connect      raw.githubusercontents.com
// @connect      raw.githubusercontent.com
// @require      https://gcore.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://gcore.jsdelivr.net/gh/andywang425/BLTH@4368883c643af57c07117e43785cd28adcb0cb3e/assets/js/library/layer.min.js
// @resource css https://gcore.jsdelivr.net/gh/andywang425/BLTH@d25aa353c8c5b2d73d2217b1b43433a80100c61e/assets/css/layer.css
// @grant        unsafeWindow
// @run-at       document-end
// @note         2022-12-29 1.1.0 add english site support
// @note         2022-12-29 1.1.1 fix when the dark mode is turned on, the prompt display is abnormal
// @note         2023-01-05 1.1.2 modify the cdn access address
// @note         2023-08-05 1.1.3 remaintain the project
// @note         2023-09-20 1.1.4 fix the error that scores are not displayed properly due to ui changes in problem page
// @note         2023-12-14 1.1.5 fix the error that scores are not displayed properly due to ui changes in problem set page
// ==/UserScript==

(function () {
    'use strict';
    let t2rate = {}
    let latestpb = {}
    let version = "1.1.5"
    
    // a timer manager for all pages
    const TimerManager = {
        timers: {
            allProblems: null,      // 题目列表页 contains all the problems
            problem: null,          // 单题页 the specific problem page
            problemList: null       // 题单页 the problem list page
        },
        
        // 设置定时器 set timer
        set(type, intervalId) {
            this.clear(type);
            this.timers[type] = intervalId;
            console.log(`[TimerManager] Set timer for ${type}: ${intervalId}`);
        },
        
        // 清除指定类型的定时器 clear the timer for the specific type
        clear(type) {
            if (this.timers[type]) {
                clearInterval(this.timers[type]);
                console.log(`[TimerManager] Cleared timer for ${type}: ${this.timers[type]}`);
                this.timers[type] = null;
            }
        },
        
        // 清除所有定时器 clear all timers
        clearAll() {
            Object.keys(this.timers).forEach(type => {
                this.clear(type);
            });
            console.log('[TimerManager] Cleared all timers');
        },
        
        // 获取定时器ID get the timer id
        get(type) {
            return this.timers[type];
        }
    };
    let preDate
    let allProblemsUrl = "https://leetcode.com/problemset" // the problems page, contains all problems
    let problemListUrl = "https://leetcode.com/problem-list" // the problem list page, such as "https://leetcode.com/problem-list/array/"
    let problemUrl = "https://leetcode.com/problems" // the specific problem page, such as "https://leetcode.com/problems/two-sum/description/"
    GM_addStyle(GM_getResourceText("css"));

    // 深拷贝 deep clone
    function deepclone(obj) {
        let str = JSON.stringify(obj);
        return JSON.parse(str);
    }

    // 监听URL变化事件
    function initUrlChange() {
      let isLoad = false;
      const load = () => {
        if (isLoad) return;
        isLoad = true;
        const oldPushState = history.pushState;
        const oldReplaceState = history.replaceState;
        history.pushState = function pushState(...args) {
          const res = oldPushState.apply(this, args);
          window.dispatchEvent(new Event('urlchange'));
          return res;
        };
        history.replaceState = function replaceState(...args) {
          const res = oldReplaceState.apply(this, args);
          window.dispatchEvent(new Event('urlchange'));
          return res;
        };
        window.addEventListener('popstate', () => {
          window.dispatchEvent(new Event('urlchange'));
        });
      };
      return load;
    }

    // 获取数字 get the contest number
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
        console.log('[LeetCodeRating] getData() polling - ' + new Date().toLocaleTimeString());
        try {
            const problemList = document.querySelector("#__next > div > div > div:nth-child(2) > div > div:nth-child(4) > div:nth-child(2) > div > div > div:nth-child(2)")
      // pb页面加载时直接返回
            if (problemList == undefined) {
                return
            }

            // 防止过多的无效操作
            if (t != undefined && t == problemList.lastChild.innerHTML) {
                return
            }

            const problems = problemList.childNodes
            for (const problem of problems) {
                const length = problem.childNodes.length
                const problemTitle = problem.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                const problemIndex = parseInt(problemTitle.split(".")[0], 10)
                let problemDifficulty = problem.childNodes[4].childNodes[0].innerHTML
                if (t2rate[problemIndex] != undefined) {
                    console.log(`[LeetCodeRating] Found rating for problem ${problemIndex}: ${t2rate[problemIndex]["Rating"]}`);
                    problemDifficulty = t2rate[problemIndex]["Rating"]
                    problem.childNodes[4].childNodes[0].innerHTML = problemDifficulty
            } else {
                    // 检查是否当前显示的是数字分数，如果是则恢复原始难度
                    const currentText = problem.childNodes[4].childNodes[0].innerHTML;
                    if (/^\d+$/.test(currentText)) {
                        console.log(`[LeetCodeRating] No rating for problem ${problemIndex}, restoring original difficulty from numeric: ${currentText}`);
                        // 从DOM class或其他方式获取原始难度，这里先用通用方法
                        const difficultyElement = problem.childNodes[4].childNodes[0];
                        const classList = difficultyElement.getAttribute('class') || '';
                        
                        let originalDifficulty = "Unknown";
                        if (classList.includes('text-olive') || classList.includes('text-green')) {
                            originalDifficulty = "Easy";
                        } else if (classList.includes('text-yellow')) {
                            originalDifficulty = "Medium";
                        } else if (classList.includes('text-pink') || classList.includes('text-red')) {
                            originalDifficulty = "Hard";
                        }
                        
                        difficultyElement.innerHTML = originalDifficulty;
                    }
                }
            }
            t = deepclone(problemList.lastChild.innerHTML)
        } catch (e) {
            return
        }
    }




    function getPblistData() {
        console.log('[LeetCodeRating] getPblistData() polling - ' + new Date().toLocaleTimeString());
        try {
            const problemList = document.querySelector("#__next > div > div.mx-auto.mt-\\[50px\\].w-full.grow.p-4.md\\:mt-0.md\\:max-w-\\[888px\\].md\\:p-6.lg\\:max-w-screen-xl.bg-overlay-1.dark\\:bg-dark-overlay-1.md\\:bg-paper.md\\:dark\\:bg-dark-paper > div > div.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(2) > div.-mx-4.md\\:mx-0 > div > div > div:nth-child(2)")
            if (t != undefined && t == problemList.lastChild.innerHTML) {
                return
            }
            let problems = problemList.childNodes
            for (let problem of problems) {
                let length = problem.childNodes.length
                let problemTitle = problem.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerText
                let problemIndex = problemTitle.split(".")[0].trim()
                let problemDifficulty = problem.childNodes[4].childNodes[0].innerHTML

                if (t2rate[problemIndex] != undefined) {
                    problemDifficulty = t2rate[problemIndex]["Rating"]
                    problem.childNodes[4].childNodes[0].innerHTML = problemDifficulty
                } 
                else {
                    let nd2ch = { "text-olive dark:text-dark-olive": "Easy", "text-yellow dark:text-dark-yellow": "Medium", "text-pink dark:text-dark-pink": "Hard" }
                    let cls = problem.childNodes[4].childNodes[0].getAttribute("class")
                    problem.childNodes[4].childNodes[0].innerHTML = nd2ch[cls]
                }
            }
            t = deepclone(problemList.lastChild.innerHTML)
        } catch (e) {
            return
        }
    }

    function getpb() {
        console.log('[LeetCodeRating] getpb() polling - ' + new Date().toLocaleTimeString());
        try {

            // 旧版的标题位置
            let problemTitle = document.querySelector("#app > div > div.main__2_tD > div.content__3fR6 > div > div.side-tools-wrapper__1TS9 > div > div.css-1gd46d6-Container.e5i1odf0 > div.css-jtoecv > div > div.tab-pane__ncJk.css-1eusa4c-TabContent.e5i1odf5 > div > div.css-101rr4k > div.css-v3d350")
            console.log('[LeetCodeRating] Old version problemTitle:', problemTitle ? 'Found' : 'Not found');
            if (problemTitle == undefined) {
                // 新版逻辑
                problemTitle = document.querySelector("#qd-content > div > div.flexlayout__tab > div > div > div > div > div > a")
                console.log('[LeetCodeRating] New version problemTitle:', problemTitle ? 'Found' : 'Not found');
                if (problemTitle == undefined) {
                    console.log('[LeetCodeRating] getpb() - No problemTitle found, returning early');
                    t1 = "unknown"
                    return
                }
                const problemIndex = problemTitle.innerText.split(".")[0].trim()
                const colorSpan = document.querySelector("#qd-content > div > div.flexlayout__tab > div > div > div.flex.gap-1 > div") // 不确定要不要删除最后一个 "div"
                // const pa = colorSpan.parentNode.parentNode
                if (t1 != undefined && t1 == problemIndex) {
                    return
                }
                // 新版统计难度分数并且修改
                let problemDifficulty = colorSpan.getAttribute("class")
                if (t2rate[problemIndex] != undefined) {
                    console.log(`[LeetCodeRating] Found rating for problem ${problemIndex}: ${t2rate[problemIndex]["Rating"]}`);
                    colorSpan.innerHTML = t2rate[problemIndex]["Rating"]
      } else {
                    console.log(`[LeetCodeRating] No rating found for problem ${problemIndex}, restoring original difficulty`);
                    // 恢复原始难度显示
                    let difficultyMap = {
                        "text-olive": "Easy",
                        "text-yellow": "Medium", 
                        "text-pink": "Hard"
                    };
                    
                    // 检查class中包含哪种难度
                    let originalDifficulty = "Unknown";
                    for (let diffClass in difficultyMap) {
                        if (problemDifficulty && problemDifficulty.includes(diffClass)) {
                            originalDifficulty = difficultyMap[diffClass];
                            break;
                        }
                    }
                    colorSpan.innerHTML = originalDifficulty;
                }

                t1 = deepclone(problemIndex)
            }
        } catch (e) {
            return
        }
    }

    t2rate = JSON.parse(GM_getValue("t2ratedb", "{}").toString())
    console.log(`[Data Init] Loaded t2rate from storage, keys count: ${Object.keys(t2rate).length}`);
    
    latestpb = JSON.parse(GM_getValue("latestpb", "{}").toString())
    preDate = GM_getValue("preDate", "")
    let now = getCurrentDate(1)
    
    console.log(`[Data Init] preDate: ${preDate}, now: ${now}, tagVersion exists: ${t2rate["tagVersion"] != undefined}`);
    
    if (t2rate["tagVersion"] == undefined || (preDate == "" || preDate != now)) {
        console.log(`[Data Init] Need to fetch new data from server`);
        
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://raw.githubusercontents.com/zerotrac/leetcode_problem_rating/main/data.json' + "?timeStamp=" + new Date().getTime(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function (res) {
                if (res.status === 200) {
                    console.log(`[Data Init] Successfully fetched data from server`);
                    // 保留唯一标识
                    t2rate = {}
                    let dataStr = res.response
                    let json = eval(dataStr)
                    console.log(`[Data Init] Parsed ${json.length} problem records`);
                    
                    for (const element of json) {
                        t2rate[element.ID] = element
                        t2rate[element.ID]["Rating"] = Number.parseInt(Number.parseFloat(element["Rating"]) + 0.5)
                    }
                    t2rate["tagVersion"] = {}
                    console.log(`[Data Init] Processed t2rate, final keys count: ${Object.keys(t2rate).length}`);
                    console.log("everyday getdate once...")
                    preDate = now
                    GM_setValue("preDate", preDate)
                    GM_setValue("t2ratedb", JSON.stringify(t2rate))
      } else {
                    console.log(`[Data Init] Failed to fetch data, status: ${res.status}`);
                }
            },
            onerror: function (err) {
                console.log('error')
                console.log(err)
            }
        });
    }

    function clearAndStart(url, timeout, isAddEvent) {
        console.log(`[clearAndStart] Starting with URL: ${url}, timeout: ${timeout}`);
        
        // 清理所有定时器
        TimerManager.clearAll();

        // 根据URL匹配对应的页面类型和函数
        const pageConfig = {
            allProblems: { url: allProblemsUrl, func: getData, name: 'getData()' },
            problem: { url: problemUrl, func: getpb, name: 'getpb()' },
            problemList: { url: problemListUrl, func: getPblistData, name: 'getPblistData()' }
        };
        
        console.log(`[clearAndStart] Page config:`, pageConfig);
        console.log(`[clearAndStart] URL patterns - allProblems: ${allProblemsUrl}, problem: ${problemUrl}, problemList: ${problemListUrl}`);
        
        // 找到匹配的页面类型
        let currentPageType = null;
        for (const [type, config] of Object.entries(pageConfig)) {
            console.log(`[clearAndStart] Checking if ${url} starts with ${config.url}: ${url.startsWith(config.url)}`);
            if (url.startsWith(config.url)) {
                currentPageType = type;
                console.log(`[clearAndStart] Matched page type: ${currentPageType}`);
                  break;
                }
        }
        
        if (!currentPageType) {
            console.log(`[clearAndStart] No matching page type found for URL: ${url}`);
        }

        if (currentPageType) {
            // 智能重试机制：立即执行，如果失败则短暂延迟后重试
            const executeWithRetry = (func, funcName, maxRetries = 3) => {
                let retryCount = 0;
                const tryExecute = () => {
                    console.log(`[LeetCodeRating] Immediate execution for URL change: ${funcName} (attempt ${retryCount + 1})`);
                    
                    // 记录执行前的状态
                    const beforeState = { t1: t1, t: t };
                    func();
                    const afterState = { t1: t1, t: t };
                    
                    // 检查是否成功执行（状态有变化）
                    const hasChanges = JSON.stringify(beforeState) !== JSON.stringify(afterState);
                    
                    if (!hasChanges && retryCount < maxRetries) {
                        retryCount++;
                        console.log(`[LeetCodeRating] ${funcName} - No changes detected, retrying in ${200 * retryCount}ms...`);
                        setTimeout(tryExecute, 200 * retryCount); // 递增延迟: 200ms, 400ms, 600ms
                    } else if (hasChanges) {
                        console.log(`[LeetCodeRating] ${funcName} - Successfully executed with changes`);
          } else {
                        console.log(`[LeetCodeRating] ${funcName} - Max retries reached, will rely on timer`);
                    }
                };
                tryExecute();
            };

            const config = pageConfig[currentPageType];
            console.log(`[clearAndStart] Using config for ${currentPageType}:`, config);
            
            // 立即执行
            console.log(`[clearAndStart] Starting immediate execution for ${config.name}`);
            executeWithRetry(config.func, config.name);
            
            // 启动定时器
            console.log(`[clearAndStart] Starting timer for ${currentPageType} with ${timeout}ms interval`);
            const timerId = setInterval(config.func, timeout);
            TimerManager.set(currentPageType, timerId);
            
            // 特殊处理：单题页面同时启动题目列表检测
            if (currentPageType === 'problem') {
                console.log(`[clearAndStart] Special case: problem page, also starting getData timer`);
                executeWithRetry(getData, 'getData()');
                const allTimerId = setInterval(getData, timeout);
                TimerManager.set('allProblems', allTimerId);
            }
            
            console.log(`[clearAndStart] Setup complete for page type: ${currentPageType}`);
        } else {
            console.log(`[clearAndStart] No page type matched, no timers started`);
        }

        // 添加URL变化监听
      if (isAddEvent) {
        window.addEventListener('urlchange', () => {
                console.log('urlchange event happened');
          let newUrl = location.href;
                clearAndStart(newUrl, 2000, false);
        });
      }
    }

    [...document.querySelectorAll('*')].forEach(item => {
        item.oncopy = function (e) {
            e.stopPropagation();
        }
    });

    // 初始化URL变化监听
    initUrlChange()();

    // 版本更新机制 (仅在主页检查)
    if (window.location.href.startsWith(allProblemsUrl)) {
      GM_xmlhttpRequest({
            method: "get",
            url: 'https://raw.githubusercontents.com/zhang-wangz/LeetCodeRating/english/version.json' + "?timeStamp=" + new Date().getTime(),
        headers: {
                "Content-Type": "application/x-www-form-urlencoded"
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
                            content: '<pre style="color:#000">Update notice: <br/>leetcodeRating difficulty plugin has a new version, please go to update ~ <br/>' + "update content: <br/>" + upcontent + "</pre>",
                  yes: function (index, layer0) {
                                let c = window.open("https://raw.githubusercontents.com/zhang-wangz/LeetCodeRating/english/leetcodeRating_greasyfork.user.js" + "?timeStamp=" + new Date().getTime())
                                c.close()
                                layer.close(index)
                  }
                });
              } else {
                        console.log("leetcodeRating difficulty plugin is currently the latest version~")
            }
          }
        },
        onerror: function (err) {
                console.log('error')
                console.log(err)
        }
      });
    }

    // 启动主程序，使用2000ms间隔，并添加URL变化监听
    console.log(`[Script Init] Starting LeetCodeRating script v${version}`);
    console.log(`[Script Init] Current URL: ${location.href}`);
    console.log(`[Script Init] t2rate data available: ${Object.keys(t2rate).length} entries`);
    clearAndStart(location.href, 2000, true);
})();
