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
  "use strict"
  let t2rate = {}
  const version = "1.1.5"
  const DEBUG_MODE = false
  if (!DEBUG_MODE) {
    console.log = () => {}
  }

  // a timer manager for all pages
  const TimerManager = {
    timers: {
      allProblems: null, // 题目列表页 contains all the problems
      problem: null, // 单题页 the specific problem page
      problemList: null, // 题单页 the problem list page
    },

    // 设置定时器 set timer
    set(type, intervalId) {
      this.clear(type)
      this.timers[type] = intervalId
      console.log(`[TimerManager] Set timer for ${type}: ${intervalId}`)
    },

    // 清除指定类型的定时器 clear the timer for the specific type
    clear(type) {
      if (this.timers[type]) {
        clearInterval(this.timers[type])
        console.log(
          `[TimerManager] Cleared timer for ${type}: ${this.timers[type]}`
        )
        this.timers[type] = null
      }
    },

    // 清除所有定时器 clear all timers
    clearAll() {
      Object.keys(this.timers).forEach((type) => {
        this.clear(type)
      })
      console.log("[TimerManager] Cleared all timers")
    },

    // 获取定时器ID get the timer id
    get(type) {
      return this.timers[type]
    },
  }
  let preDate
  const allProblemsUrl = "https://leetcode.com/problemset" // the problems page, contains all problems
  const problemListUrl = "https://leetcode.com/problem-list" // the problem list page, such as "https://leetcode.com/problem-list/array/"
  const problemUrl = "https://leetcode.com/problems" // the specific problem page, such as "https://leetcode.com/problems/two-sum/description/"
  GM_addStyle(GM_getResourceText("css"))

  // 深拷贝 deep clone
  function deepclone(obj) {
    const str = JSON.stringify(obj)
    return JSON.parse(str)
  }

  // URL变化监听管理器 (已注释掉，改用纯定时器方式)
  /*
  const UrlChangeManager = {
    isInitialized: false,
    urlChangeHandler: null,
    
    // 初始化URL变化监听
    init() {
      if (this.isInitialized) return
      this.isInitialized = true
      
      const oldPushState = history.pushState
      const oldReplaceState = history.replaceState
      
      history.pushState = function pushState(...args) {
        const res = oldPushState.apply(this, args)
        window.dispatchEvent(new Event("urlchange"))
        return res
      }
      
      history.replaceState = function replaceState(...args) {
        const res = oldReplaceState.apply(this, args)
        window.dispatchEvent(new Event("urlchange"))
        return res
      }
      
      window.addEventListener("popstate", () => {
        window.dispatchEvent(new Event("urlchange"))
      })
      
      console.log("[UrlChangeManager] URL change detection initialized")
    },
    
    // 设置URL变化处理器（确保只有一个）
    setHandler(handler) {
      // 移除旧的处理器
      if (this.urlChangeHandler) {
        window.removeEventListener("urlchange", this.urlChangeHandler)
        console.log("[UrlChangeManager] Removed old urlchange handler")
      }
      
      // 设置新的处理器
      this.urlChangeHandler = handler
      window.addEventListener("urlchange", this.urlChangeHandler)
      console.log("[UrlChangeManager] Set new urlchange handler")
    },
    
    // 清理处理器
    clearHandler() {
      if (this.urlChangeHandler) {
        window.removeEventListener("urlchange", this.urlChangeHandler)
        this.urlChangeHandler = null
        console.log("[UrlChangeManager] Cleared urlchange handler")
      }
    }
  }

  // 监听URL变化事件（保持向后兼容）
  function initUrlChange() {
    return () => UrlChangeManager.init()
  }
  */

  // 获取时间
  function getCurrentDate(format) {
    const now = new Date()
    const year = now.getFullYear() //得到年份
    let month = now.getMonth() //得到月份
    let date = now.getDate() //得到日期
    let hour = now.getHours() //得到小时
    let minu = now.getMinutes() //得到分钟
    let sec = now.getSeconds() //得到秒
    month = month + 1
    if (month < 10) month = "0" + month
    if (date < 10) date = "0" + date
    if (hour < 10) hour = "0" + hour
    if (minu < 10) minu = "0" + minu
    if (sec < 10) sec = "0" + sec
    let time = ""
    // 精确到天
    if (format == 1) {
      time = year + "年" + month + "月" + date + "日"
    }
    // 精确到分
    else if (format == 2) {
      time =
        year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec
    }
    return time
  }

  function getProblemIndex(problem) {
    // we can't use problem.id because for some problems, the id here is not the problem index, so we have to extract problem index from title text
    const titleElement = problem.querySelector(".text-body .ellipsis")
    if (!titleElement) return null
    const titleText = titleElement.textContent || titleElement.innerText
    const match = titleText.match(/^(\d+)\.\s/)
    if (!match) return null
    return match[1]
  }

  let lastProcessedListContent
  let lastProcessedProblemId
  // let lastProcessedUrl = ""  // URL变化检测相关
  // let urlChangeTimeout = null  // URL变化检测相关
  function getAllProblemsData() {
    console.log(
      "[LeetCodeRating] getAllProblemsData() polling - " +
        new Date().toLocaleTimeString()
    )
    try {
      // find the element in devtools and click "copy JS path"
      const problemList = document.querySelector(
        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.lg\\:max-w-screen-xl.dark\\:bg-dark-layer-bg.lc-dsw-xl\\:max-w-none.flex.bg-white.p-0.md\\:max-w-none.md\\:p-0 > div > div.flex.w-full.flex-1.overflow-hidden > div > div.flex.flex-1.justify-center.overflow-hidden > div > div.mt-4.flex.flex-col.items-center.gap-4 > div.w-full.flex-1 > div"
      )
      console.log("getAllProblemsData problemList", problemList)
      // pb页面加载时直接返回
      if (problemList == undefined) {
        return
      }

      // 防止过多的无效操作
      if (
        lastProcessedListContent != undefined &&
        lastProcessedListContent == problemList.innerHTML
      ) {
        console.log("lastProcessedListContent", lastProcessedListContent)
        return
      }

      const problems = problemList.childNodes
      console.log("getAllProblemsData problems", problems)
      console.log("problems[0]", problems[0])
      for (const problem of problems) {
        const problemIndex = getProblemIndex(problem)
        if (problemIndex == null) continue

        // get the difficulty display for the current problem
        const problemDifficulty = problem.querySelector(
          'p[class*="text-sd-easy"], p[class*="text-sd-medium"], p[class*="text-sd-hard"]'
        )
        if (problemDifficulty && t2rate[problemIndex] != undefined) {
          problemDifficulty.innerHTML = t2rate[problemIndex].Rating
        }
      }
      lastProcessedListContent = deepclone(problemList.innerHTML)
    } catch (e) {
      return
    }
  }

  function getProblemListData() {
    console.log(
      "[LeetCodeRating] getProblemListData() polling - " +
        new Date().toLocaleTimeString()
    )
    try {
      const problemList = document.querySelector(
        "#__next > div.flex.min-h-screen.min-w-\\[360px\\].flex-col.text-label-1.dark\\:text-dark-label-1 > div.mx-auto.w-full.grow.lg\\:max-w-screen-xl.dark\\:bg-dark-layer-bg.lc-dsw-xl\\:max-w-none.flex.bg-white.p-0.md\\:max-w-none.md\\:p-0 > div > div.lc-dsw-lg\\:flex-row.lc-dsw-lg\\:px-6.lc-dsw-lg\\:gap-8.lc-dsw-lg\\:justify-center.lc-dsw-xl\\:pl-10.flex.min-h-\\[600px\\].flex-1.flex-col.justify-start.px-4 > div.lc-dsw-lg\\:max-w-\\[699px\\].mt-6.flex.w-full.flex-col.items-center.gap-4 > div.lc-dsw-lg\\:max-w-\\[699px\\].w-full.flex-1 > div > div > div.absolute.left-0.top-0.h-full.w-full > div"
      )

      if (problemList == undefined) {
        return
      }

      if (
        lastProcessedListContent != undefined &&
        lastProcessedListContent == problemList.innerHTML
      ) {
        return
      }
      const problems = problemList.childNodes
      for (const problem of problems) {
        const problemIndex = getProblemIndex(problem)
        if (problemIndex == null) continue

        const problemDifficulty = problem.querySelector(
          'p[class*="text-sd-easy"], p[class*="text-sd-medium"], p[class*="text-sd-hard"]'
        )
        if (problemDifficulty && t2rate[problemIndex] != undefined) {
          problemDifficulty.innerHTML = t2rate[problemIndex].Rating
        }
      }
      lastProcessedListContent = deepclone(problemList.lastChild.innerHTML)
    } catch (e) {
      return
    }
  }

  function getProblemData() {
    console.log(
      "[LeetCodeRating] getProblemData() polling - " +
        new Date().toLocaleTimeString()
    )
    try {
      const problemTitle = document.querySelector(
        "#qd-content > div > div.flexlayout__tab > div > div > div > div > div > a"
      )

      console.log(
        "[LeetCodeRating] problemTitle:",
        problemTitle ? "Found" : "Not found"
      )
      if (problemTitle == undefined) {
        lastProcessedProblemId = "unknown"
        return
      }

      const problemIndex = problemTitle.innerText.split(".")[0].trim()

      if (
        lastProcessedProblemId != undefined &&
        lastProcessedProblemId == problemIndex
      ) {
        return
      }

      const colorSpan = document.querySelector(
        "#qd-content > div > div.flexlayout__tab > div > div > div.flex.gap-1 > div"
      )

      // 新版统计难度分数并且修改
      if (t2rate[problemIndex] != undefined) {
        console.log(
          `[LeetCodeRating] Found rating for problem ${problemIndex}: ${t2rate[problemIndex].Rating}`
        )
        colorSpan.innerHTML = t2rate[problemIndex].Rating
      } else {
        console.log(
          `[LeetCodeRating] No rating found for problem ${problemIndex}, restoring original difficulty`
        )
        // 恢复原始难度显示
        const problemDifficulty = colorSpan.getAttribute("class")
        const difficultyMap = {
          "text-difficulty-easy": "Easy",
          "text-difficulty-medium": "Medium",
          "text-difficulty-hard": "Hard",
        }

        // 检查class中包含哪种难度
        let originalDifficulty = "Unknown"
        for (const diffClass in difficultyMap) {
          if (problemDifficulty && problemDifficulty.includes(diffClass)) {
            originalDifficulty = difficultyMap[diffClass]
            break
          }
        }
        colorSpan.innerHTML = originalDifficulty
      }

      lastProcessedProblemId = deepclone(problemIndex)
    } catch (e) {
      return
    }
  }

  t2rate = JSON.parse(GM_getValue("t2ratedb", "{}").toString())
  console.log(
    `[Data Init] Loaded t2rate from storage, keys count: ${
      Object.keys(t2rate).length
    }`
  )

  //   latestpb = JSON.parse(GM_getValue("latestpb", "{}").toString())
  preDate = GM_getValue("preDate", "")
  const now = getCurrentDate(1)

  console.log(
    `[Data Init] preDate: ${preDate}, now: ${now}, tagVersion exists: ${
      t2rate.tagVersion != undefined
    }`
  )

  if (t2rate.tagVersion == undefined || preDate == "" || preDate != now) {
    console.log(`[Data Init] Need to fetch new data from server`)

    GM_xmlhttpRequest({
      method: "get",
      url:
        "https://raw.githubusercontents.com/zerotrac/leetcode_problem_rating/main/data.json" +
        "?timeStamp=" +
        new Date().getTime(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      onload: function (res) {
        if (res.status === 200) {
          console.log(`[Data Init] Successfully fetched data from server`)
          // 保留唯一标识
          t2rate = {}
          const dataStr = res.response
          const json = eval(dataStr)
          console.log(`[Data Init] Parsed ${json.length} problem records`)

          for (const element of json) {
            t2rate[element.ID] = element
            t2rate[element.ID].Rating = Number.parseInt(
              Number.parseFloat(element.Rating) + 0.5
            )
          }
          t2rate.tagVersion = {}
          console.log(
            `[Data Init] Processed t2rate, final keys count: ${
              Object.keys(t2rate).length
            }`
          )
          console.log("everyday getdate once...")
          preDate = now
          GM_setValue("preDate", preDate)
          GM_setValue("t2ratedb", JSON.stringify(t2rate))
        } else {
          console.log(`[Data Init] Failed to fetch data, status: ${res.status}`)
        }
      },
      onerror: function (err) {
        console.log("error")
        console.log(err)
      },
    })
  }

  function startTimers(url, timeout) {
    console.log(`[startTimers] Starting with URL: ${url}, timeout: ${timeout}`)

    // 清理所有定时器
    TimerManager.clearAll()

    // 根据URL匹配对应的页面类型和函数
    const pageConfig = {
      allProblems: {
        url: allProblemsUrl,
        func: getAllProblemsData,
        name: "getAllProblemsData()",
      },
      problem: {
        url: problemUrl,
        func: getProblemData,
        name: "getProblemData()",
      },
      problemList: {
        url: problemListUrl,
        func: getProblemListData,
        name: "getProblemListData()",
      },
    }

    console.log(`[startTimers] Page config:`, pageConfig)
    console.log(
      `[startTimers] URL patterns - allProblems: ${allProblemsUrl}, problem: ${problemUrl}, problemList: ${problemListUrl}`
    )

    // 找到匹配的页面类型
    let currentPageType = null
    for (const [type, config] of Object.entries(pageConfig)) {
      console.log(
        `[startTimers] Checking if ${url} starts with ${
          config.url
        }: ${url.startsWith(config.url)}`
      )
      if (url.startsWith(config.url)) {
        currentPageType = type
        console.log(`[startTimers] Matched page type: ${currentPageType}`)
        break
      }
    }

    if (!currentPageType) {
      console.log(`[startTimers] No matching page type found for URL: ${url}`)
      return
    }

    const config = pageConfig[currentPageType]
    console.log(`[startTimers] Using config for ${currentPageType}:`, config)

    // 立即执行一次
    console.log(`[startTimers] Starting immediate execution for ${config.name}`)
    config.func()

    // 启动定时器
    console.log(
      `[startTimers] Starting timer for ${currentPageType} with ${timeout}ms interval`
    )
    const timerId = setInterval(config.func, timeout)
    TimerManager.set(currentPageType, timerId)

    console.log(
      `[startTimers] Setup complete for page type: ${currentPageType}`
    )
  }

  // 原版的 clearAndStart 函数 (已注释掉，改用 startTimers)
  /*
  function clearAndStart(url, timeout, isAddEvent) {
    console.log(
      `[clearAndStart] Starting with URL: ${url}, timeout: ${timeout}`
    )

    // 清理所有定时器
    TimerManager.clearAll()

    // 根据URL匹配对应的页面类型和函数
    const pageConfig = {
      allProblems: {
        url: allProblemsUrl,
        func: getAllProblemsData,
        name: "getAllProblemsData()",
      },
      problem: {
        url: problemUrl,
        func: getProblemData,
        name: "getProblemData()",
      },
      problemList: {
        url: problemListUrl,
        func: getProblemListData,
        name: "getProblemListData()",
      },
    }

    console.log(`[clearAndStart] Page config:`, pageConfig)
    console.log(
      `[clearAndStart] URL patterns - allProblems: ${allProblemsUrl}, problem: ${problemUrl}, problemList: ${problemListUrl}`
    )

    // 找到匹配的页面类型
    let currentPageType = null
    for (const [type, config] of Object.entries(pageConfig)) {
      console.log(
        `[clearAndStart] Checking if ${url} starts with ${
          config.url
        }: ${url.startsWith(config.url)}`
      )
      if (url.startsWith(config.url)) {
        currentPageType = type
        console.log(`[clearAndStart] Matched page type: ${currentPageType}`)
        break
      }
    }

    if (!currentPageType) {
      console.log(`[clearAndStart] No matching page type found for URL: ${url}`)
    }

    if (currentPageType) {
      // 智能重试机制：立即执行，如果失败则短暂延迟后重试
      const executeWithRetry = (func, funcName, maxRetries = 3) => {
        let retryCount = 0
        const tryExecute = () => {
          console.log(
            `[LeetCodeRating] Immediate execution for URL change: ${funcName} (attempt ${
              retryCount + 1
            })`
          )

          // 记录执行前的状态
          const beforeState = {
            lastProcessedProblemId: lastProcessedProblemId,
            lastProcessedListContent: lastProcessedListContent,
          }
          func()
          const afterState = {
            lastProcessedProblemId: lastProcessedProblemId,
            lastProcessedListContent: lastProcessedListContent,
          }

          // 检查是否成功执行（状态有变化）
          const hasChanges =
            JSON.stringify(beforeState) !== JSON.stringify(afterState)

          if (!hasChanges && retryCount < maxRetries) {
            retryCount++
            console.log(
              `[LeetCodeRating] ${funcName} - No changes detected, retrying in ${
                200 * retryCount
              }ms...`
            )
            setTimeout(tryExecute, 200 * retryCount) // 递增延迟: 200ms, 400ms, 600ms
          } else if (hasChanges) {
            console.log(
              `[LeetCodeRating] ${funcName} - Successfully executed with changes`
            )
          } else {
            console.log(
              `[LeetCodeRating] ${funcName} - Max retries reached, will rely on timer`
            )
          }
        }
        tryExecute()
      }

      const config = pageConfig[currentPageType]
      console.log(
        `[clearAndStart] Using config for ${currentPageType}:`,
        config
      )

      // 立即执行
      console.log(
        `[clearAndStart] Starting immediate execution for ${config.name}`
      )
      executeWithRetry(config.func, config.name)

      // 启动定时器
      console.log(
        `[clearAndStart] Starting timer for ${currentPageType} with ${timeout}ms interval`
      )
      const timerId = setInterval(config.func, timeout)
      TimerManager.set(currentPageType, timerId)

      console.log(
        `[clearAndStart] Setup complete for page type: ${currentPageType}`
      )
    } else {
      console.log(`[clearAndStart] No page type matched, no timers started`)
    }

    // 添加URL变化监听 (已注释掉，改用纯定时器方式)
    if (isAddEvent) {
      const urlChangeHandler = () => {
        console.log("urlchange event happened")
        const newUrl = location.href
        
        // 防抖处理：如果URL没有变化，忽略此次事件
        if (newUrl === lastProcessedUrl) {
          console.log("[UrlChangeManager] URL unchanged, ignoring event")
          return
        }
        
        // 清除之前的延时器
        if (urlChangeTimeout) {
          clearTimeout(urlChangeTimeout)
        }
        
        // 延时执行，防止频繁触发
        urlChangeTimeout = setTimeout(() => {
          console.log(`[UrlChangeManager] Processing URL change: ${lastProcessedUrl} -> ${newUrl}`)
          lastProcessedUrl = newUrl
          clearAndStart(newUrl, 2000, false)
          urlChangeTimeout = null
        }, 100) // 100ms防抖延时
      }
      UrlChangeManager.setHandler(urlChangeHandler)
    }
  }
  */

  [...document.querySelectorAll("*")].forEach((item) => {
    item.oncopy = function (e) {
      e.stopPropagation()
    }
  })

  // 初始化URL变化监听 (已注释掉，改用纯定时器方式)
  // initUrlChange()()

  // 版本更新机制 (仅在主页检查)
  if (window.location.href.startsWith(allProblemsUrl)) {
    GM_xmlhttpRequest({
      method: "get",
      url:
        "https://raw.githubusercontents.com/zhang-wangz/LeetCodeRating/english/version.json" +
        "?timeStamp=" +
        new Date().getTime(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      onload: function (res) {
        if (res.status === 200) {
          console.log("enter home page check version once...")
          const dataStr = res.response
          const json = JSON.parse(dataStr)
          const v = json.version
          const upcontent = json.content
          if (v != version) {
            layer.open({
              content:
                '<pre style="color:#000">Update notice: <br/>leetcodeRating difficulty plugin has a new version, please go to update ~ <br/>' +
                "update content: <br/>" +
                upcontent +
                "</pre>",
              yes: function (index) {
                const c = window.open(
                  "https://raw.githubusercontents.com/zhang-wangz/LeetCodeRating/english/leetcodeRating_greasyfork.user.js" +
                    "?timeStamp=" +
                    new Date().getTime()
                )
                c.close()
                layer.close(index)
              },
            })
          } else {
            console.log(
              "leetcodeRating difficulty plugin is currently the latest version~"
            )
          }
        }
      },
      onerror: function (err) {
        console.log("error")
        console.log(err)
      },
    })
  }

  // 启动主程序，使用2000ms间隔
  console.log(`[Script Init] Starting LeetCodeRating script v${version}`)
  console.log(`[Script Init] Current URL: ${location.href}`)
  console.log(
    `[Script Init] t2rate data available: ${Object.keys(t2rate).length} entries`
  )

  startTimers(location.href, 2000)  // 2秒间隔
})()
