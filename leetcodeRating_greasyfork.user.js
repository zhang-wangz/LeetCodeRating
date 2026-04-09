// ==UserScript==
// @name         LeetCodeRating｜English
// @namespace    https://github.com/zhang-wangz
// @version      2.0.0
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
// @noframes
// @run-at       document-end
// @note         2022-12-29 1.1.0 add english site support
// @note         2022-12-29 1.1.1 fix when the dark mode is turned on, the prompt display is abnormal
// @note         2023-01-05 1.1.2 modify the cdn access address
// @note         2023-08-05 1.1.3 remaintain the project
// @note         2023-09-20 1.1.4 fix the error that scores are not displayed properly due to ui changes in problem page
// @note         2023-12-14 1.1.5 fix the error that scores are not displayed properly due to ui changes in problem set page
// @note         2025-08-21 2.0.0 refactor the plugin, change the refresh and update logic
// ==/UserScript==

(function () {
  "use strict"
  let t2rate = {}
  const version = "2.0.0"
  const DEBUG_MODE = false

  const originalConsoleLog = console.log
  if (!DEBUG_MODE) {
    try {
      console.log = function(...args) {
      }
    } catch (e) {
      window.console = Object.assign({}, console, {
        log: function(...args) {
        }
      })
    }
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

  let lastProcessedProblemId

  function replaceDifficultyWithRating(difficultyLabel) {
    // 从难度标签向上遍历，找到包含题号的祖先行
    let row = difficultyLabel.parentElement
    while (row && !row.querySelector(".text-body .ellipsis")) {
      row = row.parentElement
      if (!row || row === document.body) return
    }
    const titleEl = row.querySelector(".text-body .ellipsis")
    if (!titleEl) return
    const match = (titleEl.textContent || "").match(/^(\d+)\.\s/)
    if (!match) return
    const problemIndex = match[1]
    if (t2rate[problemIndex] != undefined) {
      difficultyLabel.innerHTML = t2rate[problemIndex].Rating
    }
  }

  function getAllProblemsData() {
    console.log(
      "[LeetCodeRating] getAllProblemsData() - " +
        new Date().toLocaleTimeString()
    )
    try {
      const difficultyLabels = document.querySelectorAll(
        'p[class*="text-sd-easy"], p[class*="text-sd-medium"], p[class*="text-sd-hard"]'
      )
      if (difficultyLabels.length === 0) return

      // 用已处理标记避免重复操作
      let unprocessed = 0
      for (const label of difficultyLabels) {
        if (!label.dataset.lcRatingProcessed) unprocessed++
      }
      if (unprocessed === 0) return

      console.log(
        `[LeetCodeRating] Found ${difficultyLabels.length} difficulty labels, ${unprocessed} unprocessed`
      )
      for (const label of difficultyLabels) {
        if (label.dataset.lcRatingProcessed) continue
        replaceDifficultyWithRating(label)
        label.dataset.lcRatingProcessed = "1"
      }
    } catch (e) {
      return
    }
  }

  function getProblemListData() {
    console.log(
      "[LeetCodeRating] getProblemListData() - " +
        new Date().toLocaleTimeString()
    )
    // problem-list 页面与 problemset 页面使用相同的难度标签结构
    getAllProblemsData()
  }

  function getProblemData() {
    console.log(
      "[LeetCodeRating] getProblemData() - " +
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
        "https://raw.githubusercontent.com/zerotrac/leetcode_problem_rating/main/data.json" +
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
          const json = JSON.parse(dataStr)
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
          // 数据加载完成后立即尝试处理当前页面
          tryProcess()
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

  // ==================== 页面处理调度 ====================

  // 根据当前 URL 判断页面类型
  function getPageType() {
    const url = location.href
    // 注意：/problemset 以 /problems 开头，必须先匹配 problemset 再匹配 problems
    if (url.startsWith(allProblemsUrl)) return "allProblems"
    if (url.startsWith(problemListUrl)) return "problemList"
    if (url.startsWith(problemUrl)) return "problem"
    return null
  }

  const pageFuncs = {
    allProblems: getAllProblemsData,
    problem: getProblemData,
    problemList: getProblemListData,
  }

  function tryProcess() {
    const pageType = getPageType()
    if (pageType && pageFuncs[pageType]) {
      pageFuncs[pageType]()
    }
  }

  // ==================== URL 变化检测 ====================
  // Monkey-patch history.pushState / replaceState 以检测 SPA 导航

  let lastUrl = location.href
  const origPushState = history.pushState
  const origReplaceState = history.replaceState

  function onUrlChange() {
    const newUrl = location.href
    if (newUrl !== lastUrl) {
      console.log(`[UrlChange] ${lastUrl} -> ${newUrl}`)
      lastUrl = newUrl
      // 重置缓存，确保新页面内容会被处理
      document.querySelectorAll('[data-lc-rating-processed]').forEach(el => {
        delete el.dataset.lcRatingProcessed
      })
      lastProcessedProblemId = undefined
      tryProcess()
    }
  }

  history.pushState = function (...args) {
    const result = origPushState.apply(this, args)
    onUrlChange()
    return result
  }

  history.replaceState = function (...args) {
    const result = origReplaceState.apply(this, args)
    onUrlChange()
    return result
  }

  window.addEventListener("popstate", onUrlChange)

  // ==================== MutationObserver ====================
  // 监听 DOM 变化，debounce 后处理（处理 URL 变化后 React 异步渲染的情况）

  let debounceTimer = null
  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(tryProcess, 300)
  })
  observer.observe(document.body, { childList: true, subtree: true })

  // ==================== 其他初始化 ====================

  ;[...document.querySelectorAll("*")].forEach((item) => {
    item.oncopy = function (e) {
      e.stopPropagation()
    }
  })

  // 版本更新机制 (仅在主页检查)
  if (window.location.href.startsWith(allProblemsUrl)) {
    GM_xmlhttpRequest({
      method: "get",
      url:
        "https://raw.githubusercontent.com/zhang-wangz/LeetCodeRating/english/version.json" +
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
                '<div style="color:#000; padding: 8px;">' +
                '<p><strong>LeetCodeRating</strong> has a new version!</p>' +
                '<p><strong>Update content:</strong></p>' +
                '<div style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin: 8px 0;">' +
                upcontent +
                '</div>' +
                '</div>',
              btn: ['Install Update', 'Later'],
              yes: function (index) {
                // 打开脚本页面，让用户可以安装更新
                window.open(
                  "https://raw.githubusercontent.com/zhang-wangz/LeetCodeRating/english/leetcodeRating_greasyfork.user.js" +
                    "?timeStamp=" +
                    new Date().getTime(),
                  "_blank"
                )
                layer.close(index)
              },
              btn2: function (index) {
                layer.close(index)
              }
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

  // 初始处理当前页面
  console.log(`[Script Init] Starting LeetCodeRating script v${version}`)
  console.log(`[Script Init] Current URL: ${location.href}`)
  console.log(
    `[Script Init] t2rate data available: ${Object.keys(t2rate).length} entries`
  )
  tryProcess()
})()
