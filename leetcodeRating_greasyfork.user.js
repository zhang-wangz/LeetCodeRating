// ==UserScript==
// @name         LeetCodeRating｜English
// @namespace    https://github.com/zhang-wangz
// @version      2.0.3
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
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
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
// @note         2026-04-15 2.0.1 fix problem page rating display after LeetCode UI update; fix rating not shown on first install or daily first data fetch
// @note         2026-08-03 2.0.2 add an optional Chinese problem link with automatic light and dark theme support
// @note         2026-08-07 2.0.3 fix problem page rating being restored to difficulty after refresh
// ==/UserScript==

(function () {
  "use strict"
  let t2rate = {}
  const version = "2.0.3"
  const DEBUG_MODE = false
  const chineseLinkId = "leetcode-rating-chinese-link"
  const chineseLinkEnabledKey = "chineseProblemLinkEnabled"
  const problemDifficultySelector =
    '[class*="text-difficulty-easy"], [class*="text-difficulty-medium"], [class*="text-difficulty-hard"]'
  let chineseLinkEnabled = GM_getValue(chineseLinkEnabledKey, true)
  let chineseLinkMenuId = null

  if (!DEBUG_MODE) {
    try {
      console.log = () => {}
    } catch (e) {}
  }

  let preDate
  const allProblemsUrl = "https://leetcode.com/problemset" // the problems page, contains all problems
  const problemListUrl = "https://leetcode.com/problem-list" // the problem list page, such as "https://leetcode.com/problem-list/array/"
  const problemUrl = "https://leetcode.com/problems/" // the specific problem page, such as "https://leetcode.com/problems/two-sum/description/"
  GM_addStyle(GM_getResourceText("css"))

  let lastProcessedProblemId
  let observedDifficultyElement = null
  let difficultyObserver = null
  let difficultyDebounceTimer = null

  function scheduleDifficultyProcess() {
    if (difficultyDebounceTimer) clearTimeout(difficultyDebounceTimer)
    difficultyDebounceTimer = setTimeout(tryProcess, 100)
  }

  function disconnectDifficultyObserver() {
    if (difficultyObserver) difficultyObserver.disconnect()
    if (difficultyDebounceTimer) clearTimeout(difficultyDebounceTimer)
    observedDifficultyElement = null
    difficultyObserver = null
    difficultyDebounceTimer = null
  }

  function observeDifficultyElement(element) {
    if (element === observedDifficultyElement) return

    disconnectDifficultyObserver()
    observedDifficultyElement = element
    difficultyObserver = new MutationObserver(scheduleDifficultyProcess)
    difficultyObserver.observe(element, {
      childList: true,
      characterData: true,
      subtree: true,
    })
  }

  function getChineseProblemUrl() {
    const chineseUrl = new URL(location.href)
    chineseUrl.protocol = "https:"
    chineseUrl.hostname = "leetcode.cn"
    return chineseUrl.toString()
  }

  function createGlobeIcon() {
    const svgNamespace = "http://www.w3.org/2000/svg"
    const icon = document.createElementNS(svgNamespace, "svg")
    icon.setAttribute("aria-hidden", "true")
    icon.setAttribute("viewBox", "0 0 24 24")
    icon.setAttribute("fill", "none")
    icon.setAttribute("stroke", "currentColor")
    icon.setAttribute("stroke-width", "2")
    icon.setAttribute("class", "h-3.5 w-3.5")

    const circle = document.createElementNS(svgNamespace, "circle")
    circle.setAttribute("cx", "12")
    circle.setAttribute("cy", "12")
    circle.setAttribute("r", "9")

    const latitude = document.createElementNS(svgNamespace, "path")
    latitude.setAttribute("d", "M3 12h18")

    const longitude = document.createElementNS(svgNamespace, "path")
    longitude.setAttribute("d", "M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18")

    icon.append(circle, latitude, longitude)
    return icon
  }

  function syncChineseProblemLink(pageType) {
    const existingLink = document.getElementById(chineseLinkId)
    if (!chineseLinkEnabled || pageType !== "problem") {
      if (existingLink) existingLink.remove()
      return
    }

    const difficultyLabel = document.querySelector(problemDifficultySelector)
    const metadataRow = difficultyLabel && difficultyLabel.parentElement
    if (!metadataRow) return

    const metadataButtons = Array.from(metadataRow.children)
    const nativeButton = metadataButtons.find(
      element =>
        element !== existingLink &&
        element.classList.contains("cursor-pointer")
    )
    const hintButton = metadataButtons.find(
      element =>
        element !== existingLink &&
        (element.textContent || "").trim() === "Hint"
    )
    const link = existingLink || document.createElement("a")
    link.id = chineseLinkId
    link.href = getChineseProblemUrl()
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.title = "Open this problem on LeetCode China"
    link.setAttribute("aria-label", link.title)
    link.className = nativeButton
      ? nativeButton.className
      : "relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary cursor-pointer transition-colors hover:bg-fill-primary hover:text-text-primary text-sd-secondary-foreground hover:opacity-80"
    link.style.textDecoration = "none"

    if (!existingLink) {
      link.append(createGlobeIcon(), document.createTextNode("Chinese"))
    }
    if (hintButton && link.previousElementSibling !== hintButton) {
      hintButton.insertAdjacentElement("afterend", link)
    } else if (
      !hintButton &&
      (link.parentElement !== metadataRow || link !== metadataRow.lastElementChild)
    ) {
      metadataRow.append(link)
    }
  }

  function registerChineseLinkMenu() {
    if (chineseLinkMenuId !== null) {
      GM_unregisterMenuCommand(chineseLinkMenuId)
    }
    const menuLabel = chineseLinkEnabled
      ? "Hide Chinese problem link"
      : "Show Chinese problem link"
    chineseLinkMenuId = GM_registerMenuCommand(menuLabel, () => {
      chineseLinkEnabled = !chineseLinkEnabled
      GM_setValue(chineseLinkEnabledKey, chineseLinkEnabled)
      registerChineseLinkMenu()
      tryProcess()
    })
  }

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
    if (t2rate[problemIndex] !== undefined) {
      difficultyLabel.textContent = t2rate[problemIndex].Rating
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
      console.error("[LeetCodeRating] getAllProblemsData error:", e)
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
      // 从 URL 提取题目 slug，再从页面标题链接中提取题号
      const problemLinks = document.querySelectorAll('a[href^="/problems/"]')
      let problemIndex = null
      for (const link of problemLinks) {
        const match = (link.textContent || "").match(/^(\d+)\.\s/)
        if (match) {
          problemIndex = match[1]
          break
        }
      }

      if (problemIndex == null) {
        return
      }

      const colorSpan = document.querySelector(problemDifficultySelector)
      if (!colorSpan) return

      observeDifficultyElement(colorSpan)

      let expectedText
      if (t2rate[problemIndex] !== undefined) {
        console.log(
          `[LeetCodeRating] Found rating for problem ${problemIndex}: ${t2rate[problemIndex].Rating}`
        )
        expectedText = String(t2rate[problemIndex].Rating)
      } else {
        console.log(
          `[LeetCodeRating] No rating found for problem ${problemIndex}, restoring original difficulty`
        )
        const classList = colorSpan.getAttribute("class") || ""
        if (classList.includes("text-difficulty-easy")) expectedText = "Easy"
        else if (classList.includes("text-difficulty-medium")) expectedText = "Medium"
        else if (classList.includes("text-difficulty-hard")) expectedText = "Hard"
      }

      if (expectedText === undefined) return

      const currentText = (colorSpan.textContent || "").trim()
      if (
        lastProcessedProblemId === problemIndex &&
        currentText === expectedText
      ) {
        return
      }

      if (currentText !== expectedText) {
        colorSpan.textContent = expectedText
      }
      lastProcessedProblemId = problemIndex
    } catch (e) {
      console.error("[LeetCodeRating] getProblemData error:", e)
      return
    }
  }

  t2rate = JSON.parse(GM_getValue("t2ratedb", "{}").toString())
  console.log(
    `[Data Init] Loaded t2rate from storage, keys count: ${
      Object.keys(t2rate).length
    }`
  )

  preDate = GM_getValue("preDate", "")
  const now = new Date().toISOString().slice(0, 10)

  const t2rateInitialized = GM_getValue("t2rateInitialized", "")

  console.log(
    `[Data Init] preDate: ${preDate}, now: ${now}, initialized: ${t2rateInitialized !== ""}`
  )

  if (t2rateInitialized === "" || preDate !== now) {
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
        if (res.status !== 200) {
          console.log(`[Data Init] Failed to fetch data, status: ${res.status}`)
          return
        }
        console.log(`[Data Init] Successfully fetched data from server`)
        try {
          const dataStr = res.response
          const json = JSON.parse(dataStr)
          console.log(`[Data Init] Parsed ${json.length} problem records`)

          // 暂存到 newRate，解析或处理失败时不破坏已有缓存
          const newRate = {}
          for (const element of json) {
            newRate[element.ID] = element
            newRate[element.ID].Rating = Math.round(parseFloat(element.Rating))
          }
          t2rate = newRate
          console.log(
            `[Data Init] Processed t2rate, final keys count: ${
              Object.keys(t2rate).length
            }`
          )
          preDate = now
          GM_setValue("preDate", preDate)
          GM_setValue("t2ratedb", JSON.stringify(t2rate))
          GM_setValue("t2rateInitialized", "1")
          // 重置状态，确保当前页面用新数据重新处理
          lastProcessedProblemId = undefined
          document.querySelectorAll('[data-lc-rating-processed]').forEach(el => {
            delete el.dataset.lcRatingProcessed
          })
          tryProcess()
        } catch (e) {
          console.error("[Data Init] Failed to parse/process data:", e)
          console.error(
            "[Data Init] Response snippet:",
            (res.response || "").slice(0, 200)
          )
        }
      },
      onerror: function (err) {
        console.error("[Data Init] Failed to fetch data:", err)
      },
    })
  }

  // ==================== 页面处理调度 ====================

  // 根据当前 URL 判断页面类型
  function getPageType() {
    const url = location.href
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
    if (pageType !== "problem") disconnectDifficultyObserver()
    syncChineseProblemLink(pageType)
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

  let pageDebounceTimer = null
  const observer = new MutationObserver(() => {
    if (pageDebounceTimer) clearTimeout(pageDebounceTimer)
    pageDebounceTimer = setTimeout(tryProcess, 300)
  })
  observer.observe(document.body, { childList: true, subtree: true })

  // ==================== 其他初始化 ====================

  registerChineseLinkMenu()
  document.addEventListener('copy', e => e.stopPropagation(), true)

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
          const updateContent = json.content
          if (v !== version) {
            layer.open({
              content:
                '<div style="color:#000; padding: 8px;">' +
                '<p><strong>LeetCodeRating</strong> has a new version!</p>' +
                '<p><strong>Update content:</strong></p>' +
                '<div style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin: 8px 0;">' +
                updateContent +
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
        console.error("[Version Check] Failed to fetch version:", err)
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
