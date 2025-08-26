// ==UserScript==
// @name         LeetCodeRating｜显示力扣周赛难度分
// @namespace    https://github.com/zhang-wangz
// @version      3.0.9
// @license      MIT
// @description  LeetCodeRating 力扣周赛分数显现和相关力扣小功能，目前浏览器更新规则，使用该插件前请手动打开浏览器开发者模式再食用～
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
// @connect      hub.gitmirror.com
// @connect      raw.githubusercontents.com
// @connect      raw.githubusercontent.com
// @require      https://unpkg.com/jquery@3.5.1/dist/jquery.min.js
// @require      https://unpkg.com/layui@2.9.6/dist/layui.js
// @grant        unsafeWindow
// ==/UserScript==

(async function () {
  // 分离用户方法
  function userScript() {
    'use strict';

    const version = '3.0.9';
    let pbstatusVersion = 'version21';
    let t2rateVersion = 'Version12';
    let levelVersion = 'Version26';
    // xhr劫持时使用，保留原始
    const dummySend = XMLHttpRequest.prototype.send;
    const originalOpen = XMLHttpRequest.prototype.open;

    // 保留所有observe，每次触发都删除旧的
    const observerMap = new WeakMap();

    // css 渲染
    $(document.body).append(
      `<link href="https://unpkg.com/leetcoderatingjs@1.0.7/index.min.css" rel="stylesheet">`
    );

    // 页面相关url
    const allUrl = 'https://leetcode.cn/problemset/.*';
    const pblistUrl = 'https://leetcode.cn/problem-list/.*';
    const pbUrl = 'https://leetcode.{2,7}/problems/.*';
    // 限定pbstatus使用, 不匹配题解链接
    const pbSolutionUrl = 'https://leetcode.{2,7}/problems/.*/solution.*';
    const pbSubmissionsUrl = 'https://leetcode.{2,7}/problems/.*/submissions.*';

    const searchUrl = 'https://leetcode.cn/search/.*';
    const studyUrl = 'https://leetcode.cn/studyplan/.*';
    const problemUrl = 'https://leetcode.cn/problemset';
    const discussUrl = 'https://leetcode.cn/discuss/.*';

    // req相关url
    const lcnojgo = 'https://leetcode.cn/graphql/noj-go/';
    const lcgraphql = 'https://leetcode.cn/graphql/';
    const chContestUrl = 'https://leetcode.cn/contest/';
    const zhContestUrl = 'https://leetcode.com/contest/';

    // 灵茶相关url
    const teaSheetUrl = 'https://docs.qq.com/sheet/DWGFoRGVZRmxNaXFz';
    // 因为ui更新，暂时去除，没有位置存放当前位置了
    // const lc0x3fsolveUrl = "https://huxulm.github.io/lc-rating/search"

    // 用于延时函数的通用id
    let id = '';
    // 制片人url, 通过接口从version.json拿取
    let papermanpic = '';

    // rank 相关数据
    let t2rate = JSON.parse(GM_getValue('t2ratedb', '{}').toString());
    // pbstatus数据
    let pbstatus = JSON.parse(GM_getValue('pbstatus', '{}').toString());
    // 题目名称-id ContestID_zh-ID
    // 中文
    let pbName2Id = JSON.parse(GM_getValue('pbName2Id', '{}').toString());
    // 英文
    let pbNamee2Id = JSON.parse(GM_getValue('pbNamee2Id', '{}').toString());
    // preDate为更新分数使用，preDate1为更新版本使用
    let preDate = GM_getValue('preDate', '');
    let preDate1 = GM_getValue('preDate1', '');
    // level数据
    let levelData = JSON.parse(GM_getValue('levelData', '{}').toString());
    // 中文
    let levelTc2Id = JSON.parse(GM_getValue('levelTc2Id', '{}').toString());
    // 英文
    let levelTe2Id = JSON.parse(GM_getValue('levelTe2Id', '{}').toString());
    // 是否使用动态布局, 现在的版本只剩下动态布局，没有之前的经典布局了，所以本地内存也没有了之前存储的kv值
    let isDynamic = true;

    // 因为字符显示问题，暂时去除
    // <span class="layui-progress-text myfont">0%</span>
    const pbstatusContent = `
          <div style="text-align: center; padding: 1rem; height: 100%; display: flex; flex-direction: column; justify-content: center;">
              <strong class="myfont"> 希望有大佬可以美化这丑丑的界面～ =v= </strong>
              <p style="padding-top: 10px;"></p>
              <div class="layui-progress layui-progress-big" lay-showPercent="true" lay-filter="demo-filter-progress">
                  <div class="layui-progress-bar" lay-percent="0%">
                  </div>
              </div>
              <p style="padding-top: 20px;"></p>
              <div class="layui-btn-container" style="">
                  <button id="statusasyc" class="layui-btn layui-btn-radius" lay-on="loading">同步</button>
              </div>
          </div>
          `;

    const pbstatusContent1 = `
          <div style="text-align: center; padding: 1rem; height: 100%; display: flex; flex-direction: column; justify-content: center;">
              <strong class="myfont"> 希望有大佬可以美化这丑丑的界面～ =v= </strong>
              <p style="padding-top: 10px;"></p>
              <div class="layui-progress layui-progress-big" lay-showPercent="true" lay-filter="demo-filter-progress1">
                  <div class="layui-progress-bar" lay-percent="0%">
                  </div>
              </div>
              <p style="padding-top: 20px;"></p>
              <div class="layui-btn-container" style="">
                  <button id="statusasyc1" class="layui-btn layui-btn-radius" lay-on="loading1">重置</button>
              </div>
          </div>
          `;
    const levelContent = `
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
          `;

    // layer复用
    const layer_sync = {
      type: 1,
      content: pbstatusContent,
      title: '同步所有题目状态',
      area: ['550px', '250px'],
      shade: 0.6,
      shadeClose: true
    };

    // layer复用
    const layer_sync1 = {
      type: 1,
      content: pbstatusContent1,
      title: '重置当前页面题目状态',
      area: ['550px', '250px'],
      shade: 0.6,
      shadeClose: true
    };

    const open_layer_sync = () => {
      layer.open(layer_sync);
      layui.element.render('progress', 'demo-filter-progress');
    };

    const open_layer_sync1 = () => {
      layer.open(layer_sync1);
      layui.element.render('progress', 'demo-filter-progress1');
    };

    // 判断observer是否已存在，如果存在，则断开重新创建
    function observerReplace(item, newObserver) {
      const oldObserver = observerMap.get(item);
      if (oldObserver) {
        oldObserver.disconnect();
      }
      observerMap.set(item, newObserver);
    }

    // ElementGetter依赖相关
    let ElementGetter = (function () {
      const _jQuery = Symbol('jQuery');
      const _window = Symbol('window');
      const _matches = Symbol('matches');
      const _MutationObs = Symbol('MutationObs');
      const _listeners = Symbol('listeners');
      const _addObserver = Symbol('addObserver');
      const _addFilter = Symbol('addFilter');
      const _removeFilter = Symbol('removeFilter');
      const _query = Symbol('query');
      const _getOne = Symbol('getOne');
      const _getList = Symbol('getList');
      class ElementGetter {
        [_addObserver](target, callback) {
          const observer = new this[_MutationObs](mutations => {
            for (const mutation of mutations) {
              if (mutation.type === 'attributes') {
                callback(mutation.target);
                if (observer.canceled) return;
              }
              for (const node of mutation.addedNodes) {
                if (node instanceof Element) callback(node);
                if (observer.canceled) return;
              }
            }
          });
          observer.canceled = false;
          observer.observe(target, { childList: true, subtree: true, attributes: true });
          return () => {
            observer.canceled = true;
            observer.disconnect();
          };
        }
        [_addFilter](target, filter) {
          let listener = this[_listeners].get(target);
          if (!listener) {
            listener = {
              filters: new Set(),
              remove: this[_addObserver](target, el => {
                listener.filters.forEach(f => f(el));
              })
            };
            this[_listeners].set(target, listener);
          }
          listener.filters.add(filter);
        }
        [_removeFilter](target, filter) {
          const listener = this[_listeners].get(target);
          if (!listener) return;
          listener.filters.delete(filter);
          if (!listener.filters.size) {
            listener.remove();
            this[_listeners].delete(target);
          }
        }
        [_query](all, selector, parent, includeParent) {
          const $ = this[_jQuery];
          if ($) {
            let jNodes = includeParent ? $(parent) : $([]);
            jNodes = jNodes.add([...parent.querySelectorAll('*')]).filter(selector);
            if (all) {
              return $.map(jNodes, el => $(el));
            } else {
              return jNodes.length ? $(jNodes.get(0)) : null;
            }
          } else {
            const checkParent = includeParent && this[_matches].call(parent, selector);
            if (all) {
              const result = checkParent ? [parent] : [];
              result.push(...parent.querySelectorAll(selector));
              return result;
            } else {
              return checkParent ? parent : parent.querySelector(selector);
            }
          }
        }
        [_getOne](selector, parent, timeout) {
          return new Promise(resolve => {
            const node = this[_query](false, selector, parent, false);
            if (node) return resolve(node);
            let timer;
            const filter = el => {
              const node = this[_query](false, selector, el, true);
              if (node) {
                this[_removeFilter](parent, filter);
                timer && clearTimeout(timer);
                resolve(node);
              }
            };
            this[_addFilter](parent, filter);
            if (timeout > 0) {
              timer = setTimeout(() => {
                this[_removeFilter](parent, filter);
                resolve(null);
              }, timeout);
            }
          });
        }
        [_getList](selectorList, parent, timeout) {
          return Promise.all(
            selectorList.map(selector => this[_getOne](selector, parent, timeout))
          );
        }
        constructor(jQuery) {
          this[_jQuery] = jQuery && jQuery.fn && jQuery.fn.jquery ? jQuery : null;
          this[_window] = window.unsafeWindow || document.defaultView || window;
          const elProto = this[_window].Element.prototype;
          this[_matches] =
            elProto.matches ||
            elProto.matchesSelector ||
            elProto.mozMatchesSelector ||
            elProto.oMatchesSelector ||
            elProto.webkitMatchesSelector;
          this[_MutationObs] =
            this[_window].MutationObserver ||
            this[_window].WebkitMutationObserver ||
            this[_window].MozMutationObserver;
          this[_listeners] = new WeakMap();
        }
        get(selector, ...args) {
          const parent = (typeof args[0] !== 'number' && args.shift()) || this[_window].document;
          const timeout = args[0] || 0;
          if (Array.isArray(selector)) {
            return this[_getList](selector, parent, timeout);
          } else {
            return this[_getOne](selector, parent, timeout);
          }
        }
        each(selector, ...args) {
          const parent = (typeof args[0] !== 'function' && args.shift()) || this[_window].document;
          const callback = args[0];
          const refs = new WeakSet();
          const nodes = this[_query](true, selector, parent, false);
          for (const node of nodes) {
            refs.add(this[_jQuery] ? node.get(0) : node);
            if (callback(node, false) === false) return;
          }
          const filter = el => {
            const nodes = this[_query](true, selector, el, true);
            for (const node of nodes) {
              const _el = this[_jQuery] ? node.get(0) : node;
              if (!refs.has(_el)) {
                refs.add(_el);
                if (callback(node, true) === false) {
                  return this[_removeFilter](parent, filter);
                }
              }
            }
          };
          this[_addFilter](parent, filter);
        }
        create(domString, parent) {
          const template = this[_window].document.createElement('template');
          template.innerHTML = domString;
          const node = template.content.firstElementChild || template.content.firstChild;
          parent ? parent.appendChild(node) : node.remove();
          return node;
        }
      }
      return ElementGetter;
    })();

    // 监听相关, 监听之后提出变化并且重启插件
    let debounceTimer = null;
    let isSelfChanging = false;
    const observedElements = new WeakMap();

    function observeIfNeeded(target) {
      if (!target || !(target instanceof Node)) return;
      if (observedElements.has(target)) return;

      const observer = new MutationObserver(mutationsList => {
        if (isSelfChanging) return;
        if (debounceTimer) return;
        console.log('内容变化，执行 clearAndStart');
        clearAndStart(location.href, 500, false);
        debounceTimer = setTimeout(() => {
          debounceTimer = null;
        }, 5000); // 连续变化时只触发一次
      });

      observer.observe(target, {
        childList: true,
        characterData: true,
        subtree: true
      });

      observedElements.set(target, observer);
    }

    function getPbNameId(pbName) {
      pbName2Id = JSON.parse(GM_getValue('pbName2Id', '{}').toString());
      pbNamee2Id = JSON.parse(GM_getValue('pbNamee2Id', '{}').toString());
      let id = null;
      if (pbName2Id[pbName]) {
        id = pbName2Id[pbName];
      } else if (pbNamee2Id[pbName]) {
        id = pbNamee2Id[pbName];
      }
      return id;
    }

    function getLevelId(pbName) {
      levelTc2Id = JSON.parse(GM_getValue('levelTc2Id', '{}').toString());
      levelTe2Id = JSON.parse(GM_getValue('levelTe2Id', '{}').toString());
      if (levelTc2Id[pbName]) {
        return levelTc2Id[pbName];
      }
      if (levelTe2Id[pbName]) {
        return levelTe2Id[pbName];
      }
      return null;
    }

    // 同步函数
    function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
      let targetNodes, btargetsFound;
      if (typeof iframeSelector == 'null') targetNodes = $(selectorTxt);
      else targetNodes = $(iframeSelector).contents().find(selectorTxt);

      if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        targetNodes.each(function () {
          let jThis = $(this);
          let alreadyFound = jThis.data('alreadyFound') || false;
          if (!alreadyFound) {
            let cancelFound = actionFunction(jThis);
            if (cancelFound) btargetsFound = false;
            else jThis.data('alreadyFound', true);
          }
        });
      } else {
        btargetsFound = false;
      }
      let controlObj = waitForKeyElements.controlObj || {};
      let controlKey = selectorTxt.replace(/[^\w]/g, '_');
      let timeControl = controlObj[controlKey];
      if (btargetsFound && bWaitOnce && timeControl) {
        clearInterval(timeControl);
        delete controlObj[controlKey];
      } else {
        if (!timeControl) {
          timeControl = setInterval(function () {
            waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
          }, 300);
          controlObj[controlKey] = timeControl;
        }
      }
      waitForKeyElements.controlObj = controlObj;
    }

    const ajaxReq = (type, reqUrl, headers, data, successFuc, asyn = false) => {
      return $.ajax({
        // 请求方式
        type: type,
        // 请求的媒体类型
        contentType: 'application/json;charset=UTF-8',
        // 请求地址
        url: reqUrl,
        // 数据，json字符串
        data: data != null ? JSON.stringify(data) : null,
        // 同步方式
        async: asyn,
        xhrFields: {
          withCredentials: true
        },
        headers: headers,
        // 请求成功
        success: function (result) {
          successFuc(result);
        },
        // 请求失败，包含具体的错误信息
        error: function (e) {
          console.log(e.status);
          console.log(e.responseText);
        }
      });
    };

    // 刷新菜单
    script_setting();
    // 注册urlchange事件
    initUrlChange()();

    // 常量数据
    const regDiss = '.*//leetcode.cn/problems/.*/discussion/.*';
    const regSovle = '.*//leetcode.cn/problems/.*/solutions/.*';
    const regPbSubmission = '.*//leetcode.cn/problems/.*/submissions/.*';

    // 监听urlchange事件定义
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

    let isVpn = !GM_getValue('switchvpn');
    // 访问相关url
    let versionUrl, sciptUrl, rakingUrl, levelUrl;
    if (isVpn) {
      versionUrl = 'https://raw.githubusercontent.com/zhang-wangz/LeetCodeRating/main/version.json';
      sciptUrl =
        'https://raw.githubusercontent.com/zhang-wangz/LeetCodeRating/main/leetcodeRating_greasyfork.user.js';
      rakingUrl = 'https://zerotrac.github.io/leetcode_problem_rating/data.json';
      levelUrl =
        'https://raw.githubusercontent.com/zhang-wangz/LeetCodeRating/main/stormlevel/data.json';
    } else {
      versionUrl = 'https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/version.json';
      sciptUrl =
        'https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/leetcodeRating_greasyfork.user.js';
      rakingUrl = 'https://raw.gitmirror.com/zerotrac/leetcode_problem_rating/main/data.json';
      levelUrl = 'https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/stormlevel/data.json';
    }

    // 菜单方法定义
    function script_setting() {
      let menu_ALL = [
          ['switchvpn', 'vpn', '是否使用cdn访问数据', false, false],
          ['switchupdate', 'switchupdate', '是否每天最多只更新一次', true, true],
          ['switchcopyright', 'pb function', '题解复制去除版权信息', true, true],
          ['switchTea', '0x3f tea', '题库页灵茶信息显示', true, true],
          ['switchpbRepo', 'pbRepo function', '题库页周赛难度评分(不包括灵茶)', true, false],
          ['switchpbscore', 'pb function', '题目页周赛难度评分', true, true],
          ['switchpbside', 'switchpbside function', '题目页侧边栏分数显示', true, true],
          ['switchpbsearch', 'switchpbsearch function', '题目页题目搜索框', true, true],
          ['switchsearch', 'search function', '题目搜索页周赛难度评分', true, false],
          [
            'switchpblist',
            'pbList function',
            '题单页周赛难度评分(包含自定义和官方题单)',
            true,
            false
          ],
          ['switchpblistRateDisplay', 'pbList function', '题单页一直显示通过率', true, false],
          ['switchstudy', 'studyplan function', '学习计划周赛难度评分', true, false],
          [
            'switchlevel',
            'studyplan level function',
            '算术评级(显示题库/题单/题目/学习计划页)',
            true,
            false
          ],
          [
            'switchrealoj',
            'delvip function',
            '模拟oj环境(去除通过率,难度,周赛Qidx等)',
            false,
            true
          ],
          ['switchdark', 'dark function', '自动切换白天黑夜模式(早8晚8切换制)', false, true],
          ['switchpbstatus', 'pbstatus function', '讨论区和题目页显示题目完成状态', true, true],
          [
            'switchpbstatusscoredefault',
            'pbstatusscore function',
            '题目完成状态增加难度分和会员题状态',
            false,
            true
          ],
          [
            'switchpbstatusLocationRight',
            'switchpbstatusLocation function',
            '题目显示完成状态(位置改为右方)',
            false,
            true
          ],
          [
            'switchpbstatusBtn',
            'pbstatusBtn function',
            '讨论区和题目页添加同步题目状态按钮',
            true,
            true
          ],
          [
            'switchpbstatusresetBtn',
            'pbstatusResetBtn function',
            '讨论页重置当前题目状态按钮',
            true,
            true
          ],
          ['switchperson', 'person function', '纸片人', false, true]
        ],
        menu_ID = [],
        menu_ID_Content = [];
      for (const element of menu_ALL) {
        // 如果读取到的值为 null 就写入默认值
        if (GM_getValue(element[0]) == null) {
          GM_setValue(element[0], element[3]);
        }
      }
      registerMenuCommand();

      // 注册脚本菜单
      function registerMenuCommand() {
        if (menu_ID.length > menu_ALL.length) {
          // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
          for (const element of menu_ID) {
            GM_unregisterMenuCommand(element);
          }
        }
        for (let i = 0; i < menu_ALL.length; i++) {
          // 循环注册脚本菜单
          menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
          let content = `${menu_ALL[i][3] ? '✅' : '❎'} ${menu_ALL[i][2]}`;
          menu_ID[i] = GM_registerMenuCommand(content, function () {
            menu_switch(
              `${menu_ALL[i][0]}`,
              `${menu_ALL[i][1]}`,
              `${menu_ALL[i][2]}`,
              `${menu_ALL[i][3]}`
            );
          });
          menu_ID_Content[i] = content;
        }
        menu_ID[menu_ID.length] = GM_registerMenuCommand(`🏁 当前版本 ${version}`, function () {});
        menu_ID_Content[menu_ID_Content.length] = `🏁 当前版本 ${version}`;
        menu_ID[menu_ID.length + 1] = GM_registerMenuCommand(
          `🏁 企鹅群号 654726006`,
          function () {}
        );
        menu_ID_Content[menu_ID_Content.length + 1] = `🏁 654726006`;
      }

      //切换选项
      function menu_switch(name, ename, cname, value) {
        if (value == 'false') {
          GM_setValue(`${name}`, true);
          registerMenuCommand(); // 重新注册脚本菜单
          location.reload(); // 刷新网页
          GM_notification({ text: `「${cname}」已开启\n`, timeout: 3500 }); // 提示消息
        } else {
          GM_setValue(`${name}`, false);
          registerMenuCommand(); // 重新注册脚本菜单
          location.reload(); // 刷新网页
          GM_notification({ text: `「${cname}」已关闭\n`, timeout: 3500 }); // 提示消息
        }
        registerMenuCommand(); // 重新注册脚本菜单
      }
    }

    function copyNoRight() {
      new ElementGetter().each('.WRmCx > div:has(code)', document, item => {
        addCopy(item);
        let observer = new MutationObserver(function (mutationsList, observer) {
          // 检查每个变化
          mutationsList.forEach(function (mutation) {
            addCopy(item);
          });
        });
        observerReplace(item, observer);
        // 配置 MutationObserver 监听的内容和选项
        let config = { attributes: false, childList: true, subtree: false };
        observer.observe(item, config);
      });

      function addCopy(item) {
        let nowShow = item.querySelector('div:not(.hidden) > div.group.relative > pre > code');
        // console.log(nowShow);
        let copyNode = nowShow.parentElement.nextElementSibling.cloneNode(true);
        nowShow.parentElement.nextElementSibling.setAttribute('hidden', true);
        copyNode.classList.add('copyNode');
        copyNode.onclick = function () {
          let nowShow = item.querySelector('div:not(.hidden) > div.group.relative > pre > code');
          navigator.clipboard.writeText(nowShow.textContent).then(() => {
            layer.msg('复制成功');
          });
        };
        nowShow.parentNode.parentNode.appendChild(copyNode);
      }
    }

    // lc 基础req
    let baseReq = (type, reqUrl, query, variables, successFuc) => {
      //请求参数
      let list = { query: query, variables: variables };
      //
      ajaxReq(type, reqUrl, null, list, successFuc);
    };

    // post请求
    let postReq = (reqUrl, query, variables, successFuc) => {
      baseReq('POST', reqUrl, query, variables, successFuc);
    };

    // 基础函数休眠
    async function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    let lcTheme = mode => {
      let headers = {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7',
        'content-type': 'application/json'
      };
      let body = {
        operationName: 'setTheme',
        query:
          '\n    mutation setTheme($darkMode: String!) {\n  setDarkSide(darkMode: $darkMode)\n}\n    ',
        variables: {
          darkMode: mode
        }
      };
      ajaxReq('POST', lcnojgo, headers, body, () => {});
    };

    if (GM_getValue('switchdark')) {
      let h = new Date().getHours();
      if (h >= 8 && h < 20) {
        lcTheme('light');
        localStorage.setItem('lc-dark-side', 'light');
        console.log('修改至light mode...');
      } else {
        lcTheme('dark');
        localStorage.setItem('lc-dark-side', 'dark');
        console.log('修改至dark mode...');
      }
    }

    function allPbPostData(skip, limit) {
      let reqs = {
        query: `
    query problemsetQuestionListV2($filters: QuestionFilterInput, $limit: Int, $searchKeyword: String, $skip: Int, $sortBy: QuestionSortByInput, $categorySlug: String) {
  problemsetQuestionListV2(
    filters: $filters
    limit: $limit
    searchKeyword: $searchKeyword
    skip: $skip
    sortBy: $sortBy
    categorySlug: $categorySlug
  ) {
    questions {
      id
      titleSlug
      title
      translatedTitle
      questionFrontendId
      paidOnly
      difficulty
      topicTags {
        name
        slug
        nameTranslated
      }
      status
      isInMyFavorites
      frequency
      acRate
      contestPoint
    }
    totalLength
    finishedLength
    hasMore
  }
}
    `,
        variables: {
          categorySlug: 'all-code-essentials',
          searchKeyword: '',
          skip: skip,
          limit: limit,
          filters: {
            filterCombineType: 'ALL',
            statusFilter: {
              questionStatuses: [],
              operator: 'IS'
            },
            difficultyFilter: {
              difficulties: [],
              operator: 'IS'
            },
            languageFilter: {
              languageSlugs: [],
              operator: 'IS'
            },
            topicFilter: {
              topicSlugs: [],
              operator: 'IS'
            },
            acceptanceFilter: {},
            frequencyFilter: {},
            frontendIdFilter: {},
            lastSubmittedFilter: {},
            publishedFilter: {},
            companyFilter: {
              companySlugs: [],
              operator: 'IS'
            },
            positionFilter: {
              positionSlugs: [],
              operator: 'IS'
            },
            contestPointFilter: {
              contestPoints: [],
              operator: 'IS'
            },
            premiumFilter: {
              premiumStatus: [],
              operator: 'IS'
            }
          },
          sortBy: {
            sortField: 'CUSTOM',
            sortOrder: 'ASCENDING'
          }
        },
        operationName: 'problemsetQuestionListV2'
      };
      reqs.key = 'LeetcodeRating';
      return reqs;
    }

    function getpbCnt() {
      let total = 0;
      let headers = {
        'Content-Type': 'application/json'
      };
      ajaxReq('POST', lcgraphql, headers, allPbPostData(0, 0), res => {
        total = res.data.problemsetQuestionListV2.totalLength;
      });
      return total;
    }

    // 从题目链接提取slug
    // 在这之前需要匹配出所有符合条件的a标签链接
    function getSlug(problemUrl) {
      let preUrl = 'https://leetcode-cn.com/problems/';
      let nowurl = 'https://leetcode.cn/problems/';
      if (problemUrl.startsWith(preUrl)) return problemUrl.replace(preUrl, '').split('/')[0];
      else if (problemUrl.startsWith(nowurl)) return problemUrl.replace(nowurl, '').split('/')[0];
      return null;
    }

    // 获取题目相关内容
    function getpbRelation(pburl) {
      let pbstatus = JSON.parse(GM_getValue('pbstatus', '{}').toString());
      let titleSlug = getSlug(pburl);
      if (!titleSlug) return [null, null, null];
      let status = pbstatus[titleSlug] == null ? 'TO_DO' : pbstatus[titleSlug]['status'];
      // 获取分数
      let score;
      let idExist = pbstatus[titleSlug] != null && t2rate[pbstatus[titleSlug]['id']] != null;
      if (idExist) {
        score = t2rate[pbstatus[titleSlug]['id']]['Rating'];
      }
      let paid = pbstatus[titleSlug] == null ? null : pbstatus[titleSlug]['paidOnly'];
      return [status, score, paid];
    }

    // 1 ac 2 tried 3 not_started
    function getPbstatusIcon(code, score, paid) {
      let value;
      switch (code) {
        case 1:
          value = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="myiconsvg h-[18px] w-[18px]  text-green-s dark:text-dark-green-s"><path fill-rule="evenodd" d="M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> `;
          break;
        case 2:
          value = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1.6 0 12.5 14" width="1.2em" height="1.2em" fill="currentColor" class="myiconsvg text-message-warning dark:text-message-warning"><path d="M6.998 7v-.6a.6.6 0 00-.6.6h.6zm.05 0h.6a.6.6 0 00-.6-.6V7zm0 .045v.6a.6.6 0 00.6-.6h-.6zm-.05 0h-.6a.6.6 0 00.6.6v-.6zm5-.045a5 5 0 01-5 5v1.2a6.2 6.2 0 006.2-6.2h-1.2zm-5 5a5 5 0 01-5-5h-1.2a6.2 6.2 0 006.2 6.2V12zm-5-5a5 5 0 015-5V.8A6.2 6.2 0 00.798 7h1.2zm5-5a5 5 0 015 5h1.2a6.2 6.2 0 00-6.2-6.2V2zm2.2 5a2.2 2.2 0 01-2.2 2.2v1.2a3.4 3.4 0 003.4-3.4h-1.2zm-2.2 2.2a2.2 2.2 0 01-2.2-2.2h-1.2a3.4 3.4 0 003.4 3.4V9.2zM4.798 7a2.2 2.2 0 012.2-2.2V3.6a3.4 3.4 0 00-3.4 3.4h1.2zm2.2-2.2a2.2 2.2 0 012.2 2.2h1.2a3.4 3.4 0 00-3.4-3.4v1.2zm0 2.8h.05V6.4h-.05v1.2zm-.55-.6v.045h1.2V7h-1.2zm.6-.555h-.05v1.2h.05v-1.2zm.55.6V7h-1.2v.045h1.2z"></path></svg> `;
          break;
        // code3 的时候需要调整style，所以设置了class，调整在css中
        case 3:
          value = `<svg class="myiconsvg" width="21" height="20">
                              <circle class="mycircle" stroke="black" stroke-width="2" fill="white"></circle>
                          </svg> `;
          break;
        default:
          value = '';
          break;
      }
      //  [难度分 1980] (会员题)
      if (GM_getValue('switchpbstatusscoredefault')) {
        if (score) {
          value += ` [难度分 ${score}] `;
        }
        if (paid != null && paid != false) {
          value += ` (会员题) `;
        }
      }
      return value;
    }

    function handleLink(link) {
      // 每日一题或者是标签icon内容，不做更改直接跳过
      // no-underline是标题
      // rounded排除每日一题的火花和题目侧边栏，火花一开始刷新时候href为空，直到lc请求接口之后才显示每日一题链接，所以有一瞬间的时间会错误识别
      if (
        link.href.includes('daily-question') ||
        link.getAttribute('class')?.includes('rounded') ||
        link.getAttribute('data-state') ||
        link.getAttribute('class')?.includes('no-underline')
      ) {
        link.setAttribute('linkId', 'leetcodeRating');
        return;
      }
      // console.log(link.href)
      // console.log(link)
      let linkId = link.getAttribute('linkId');
      if (linkId != null && linkId == 'leetcodeRating') {
        console.log(getSlug(link.href) + '已经替换..., 略过');
        return;
      }
      let [status, score, paid] = getpbRelation(link.href);
      if (!status) {
        link.setAttribute('linkId', 'leetcodeRating');
        return;
      }
      // console.log(status);
      // 1 SOLVED 2 ATTEMPTED 3 TO_DO
      let code = status == 'TO_DO' ? 3 : status == 'SOLVED' ? 1 : 2;
      // console.log(code);
      let iconStr = getPbstatusIcon(code, score, paid);
      let iconEle = document.createElement('span');
      iconEle.innerHTML = iconStr;
      // console.log(iconEle);
      // 获取元素的父节点
      link.setAttribute('linkId', 'leetcodeRating');
      const parent = link.parentNode;
      // 改变方位
      // 功能不开启的时候移动到左边-历史遗留问题
      if (!GM_getValue('switchpbstatusLocationRight')) {
        parent.insertBefore(iconEle, link);
      } else {
        if (link.nextSibling) {
          parent.insertBefore(iconEle, link.nextSibling);
        } else {
          parent.appendChild(iconEle);
        }
      }
    }

    async function createstatusBtn() {
      // console.log("start...")
      if (document.querySelector('#statusBtn')) return;
      let span = document.createElement('span');
      span.setAttribute('data-small-spacing', 'true');
      span.setAttribute('hidden', 'true');
      span.setAttribute('id', 'statusBtn');

      let span1 = document.createElement('span');
      span1.setAttribute('data-small-spacing', 'true');
      span1.setAttribute('hidden', 'true');
      span1.setAttribute('id', 'statusBtn');
      // 判断同步按钮
      if (GM_getValue('switchpbstatusBtn')) {
        span.removeAttribute('hidden');
        // console.log(levelData[id])
        span.innerHTML = `<i style="font-size:12px;" class="layui-icon layui-icon-refresh"></i> 同步题目状态`;
        span.onclick = open_layer_sync;
        // 使用layui的渲染
        layuiload();
      }
      // 判断重置按钮
      if (GM_getValue('switchpbstatusresetBtn')) {
        span1.removeAttribute('hidden');
        // console.log(levelData[id])
        span1.innerHTML = `<i style="font-size:12px;" class="layui-icon layui-icon-refresh"></i> 重置当前页面题目状态`;
        span1.onclick = open_layer_sync1;
        // 使用layui的渲染
        layuiload1();
      }
      new ElementGetter().each('.flex-wrap.items-center', document, userinfo => {
        if (userinfo?.lastChild?.textContent?.includes('发布于')) {
          // console.log(userinfo)
          span.setAttribute('class', userinfo.lastChild.getAttribute('class'));
          span.setAttribute('class', span.getAttribute('class') + ' hover:text-blue-s');
          span.setAttribute('style', 'cursor:pointer');

          span1.setAttribute('class', userinfo.lastChild.getAttribute('class'));
          span1.setAttribute('class', span1.getAttribute('class') + ' hover:text-blue-s');
          span1.setAttribute('style', 'cursor:pointer');
          if (!span.getAttribute('hidden')) userinfo.appendChild(span);
          if (!span1.getAttribute('hidden')) userinfo.appendChild(span1);
        }
      });
      // console.log("end...")
    }


    // 监听变化
    // 改变大小
    // style监听影响不大，所以不放到initfunction中，url变化重启流程
    let whetherSolution = location.href.match(pbUrl);
    if (whetherSolution) {
      // 左边
      console.log('执行插入题目显示按钮style...');
      if (!GM_getValue('switchpbstatusLocationRight')) {
        GM_addStyle(`
                  circle.mycircle {
                      cx: 9;
                      cy: 9;
                      r: 7;
                  }
              `);
      } else {
        // 右边
        GM_addStyle(`
                  circle.mycircle {
                      cx: 13;
                      cy: 9;
                      r: 7;
                  }
              `);
      }
    } else {
      // 左边
      if (!GM_getValue('switchpbstatusLocationRight')) {
        GM_addStyle(`
                  circle.mycircle {
                      cx: 8;
                      cy: 9;
                      r: 7;
                  }
              `);
      } else {
        // 右边
        GM_addStyle(`
                  circle.mycircle {
                      cx: 13;
                      cy: 10;
                      r: 7;
                  }
              `);
      }
    }

    function realOpr() {
      // 只有讨论区才制作同步按钮，题解区不做更改
      if (window.location.href.match(discussUrl)) {
        createstatusBtn();
      }
      // 只有讨论区和题目页进行a标签制作
      if (window.location.href.match(discussUrl) || window.location.href.match(pbUrl)) {
        // 获取所有的<a>标签
        let links = document.querySelectorAll('a');
        // 过滤出符合条件的<a>标签
        let matchingLinks = Array.from(links).filter(link => {
          return (
            !link.getAttribute('linkId') &&
            link.href.match(pbUrl) &&
            !link.href.match(pbSolutionUrl) &&
            !link.href.match(pbSubmissionsUrl)
          );
        });
        // console.log(matchingLinks);
        // 符合条件的<a>标签
        matchingLinks.forEach(link => {
          handleLink(link);
        });
      }
    }

    // 创建题目状态icon
    function waitOprpbStatus() {
      if (GM_getValue('switchpbstatus')) {
        if (window.location.href.match(discussUrl) || window.location.href.match(pbUrl)) {
          let css_flag = '';
          if (window.location.href.match(discussUrl)) {
            // css_flag = ".css-qciawt-Wrapper";
            css_flag = '.relative.flex';
          } else {
            css_flag = '#qd-content';
          }
          new ElementGetter().each(css_flag, document, item => {
            if (window.location.href.match(discussUrl)) realOpr();
            let observer = new MutationObserver(function (mutationsList, observer) {
              // 检查变化
              mutationsList.forEach(function (mutation) {
                realOpr();
              });
            });
            observerReplace(item, observer);
            // 配置 MutationObserver 监听的内容和选项
            let config = { attributes: false, childList: true, subtree: true };
            observer.observe(item, config);
          });
        }
      }
    }

    function pbsubmitListen() {
      var originalFetch = fetch;
      window.unsafeWindow.fetch = function () {
        return originalFetch.apply(this, arguments).then(function (response) {
          let checkUrl = 'https://leetcode.cn/submissions/detail/[0-9]*/check/.*';
          let clonedResponse = response.clone();
          clonedResponse.text().then(function (bodyText) {
            if (
              clonedResponse.url.match(checkUrl) &&
              clonedResponse.status == 200 &&
              clonedResponse.ok
            ) {
              console.log('HTTP请求完成：', arguments[0]);
              let resp = JSON.parse(bodyText);
              console.log('响应数据：', resp);
              if (resp?.status_msg?.includes('Accepted')) {
                let pbstatus = JSON.parse(GM_getValue('pbstatus', '{}').toString());
                let slug = getSlug(location.href);
                if (!pbstatus[slug]) pbstatus[slug] = {};
                pbstatus[slug]['status'] = 'SOLVED';
                GM_setValue('pbstatus', JSON.stringify(pbstatus));
                console.log('提交成功，当前题目状态已更新');
              } else if (resp?.status_msg && !resp.status_msg.includes('Accepted')) {
                let pbstatus = JSON.parse(GM_getValue('pbstatus', '{}').toString());
                let slug = getSlug(location.href);
                // 同步一下之前的记录是什么状态
                let query =
                  '\n    query userQuestionStatus($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    status\n  }\n}\n    ';
                let headers = {
                  'Content-Type': 'application/json'
                };
                let postdata = {
                  query: query,
                  variables: {
                    titleSlug: slug
                  },
                  operationName: 'userQuestionStatus'
                };
                let status;
                ajaxReq('POST', lcgraphql, headers, postdata, response => {
                  console.log('用户题目状态: ', response.data.question.status);
                  status = response.data.question.status;
                });
                // 如果之前为ac状态，那么停止更新，直接返回
                if (status && status == 'ac') {
                  if (!pbstatus[slug]) pbstatus[slug] = {};
                  pbstatus[slug]['status'] = 'SOLVED';
                  GM_setValue('pbstatus', JSON.stringify(pbstatus));
                  console.log('提交失败,但是之前已经ac过该题，所以状态为ac');
                } else {
                  // 之前没有提交过或者提交过但是没有ac的状态，那么仍然更新为提交失败状态
                  if (!pbstatus[slug]) pbstatus[slug] = {};
                  pbstatus[slug]['status'] = 'ATTEMPTED';
                  GM_setValue('pbstatus', JSON.stringify(pbstatus));
                  console.log('提交失败, 当前题目状态已更新');
                }
              }
            }
          });
          return response;
        });
      };
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
      if (month < 10) month = '0' + month;
      if (date < 10) date = '0' + date;
      if (hour < 10) hour = '0' + hour;
      if (minu < 10) minu = '0' + minu;
      if (sec < 10) sec = '0' + sec;
      let time = '';
      // 精确到天
      if (format == 1) {
        time = year + '年' + month + '月' + date + '日';
      }
      // 精确到分
      else if (format == 2) {
        time = year + '-' + month + '-' + date + ' ' + hour + ':' + minu + ':' + sec;
      } else if (format == 3) {
        time = year + '/' + month + '/' + date;
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
      `);

    // 因为力扣未捕获错误信息，所以重写一下removechild方法
    const removeChildFn = Node.prototype.removeChild;
    Node.prototype.removeChild = function (n) {
      let err = null;
      try {
        err = removeChildFn.call(this, n); // 正常删除
      } catch (error) {
        if (!error.toString().includes('NotFoundError'))
          console.log('力扣api发生错误: ', error.toString().substr(0, 150));
      }
      return err;
    };

    function createProblemCard({ title, pburl, difficulty, rate, parentNodeList }) {
      const $a = $('<a>', {
        class: 'group flex flex-col rounded-[8px] duration-300',
        id: Date.now(), // 随便给个唯一id
        target: '_blank',
        href: pburl // 跳转链接
      });

      const $div1 = $('<div>', {
        class: 'flex h-[44px] w-full items-center space-x-3 px-4'
      });

      const $wrapper = $('<div>', {
        style: 'transform: translateX(-3px);'
      });

      // 嵌套的小结构
      const $inner1 = $('<div>', {
        class: 'flex items-center justify-center w-[20px] h-[20px]'
      }).append(
        $('<svg>', {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 576 512',
          fill: 'currentColor',
          class: 'w-4 h-4 text-yellow-400', // 大小4×4，黄色
          html: `
                      <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3
                      153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6
                      328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3
                      1.7l-137-73.2-137 73.2c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5
                      l26.2-155.6-111-108.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9
                      19.3-16.3l153.2-22.6 68.6-141.3C270.4 5.2 278.7 0 287.9 0z"/>
                  `
        })
      );

      // 第二块内容
      const $inner2 = $('<div>', {
        class: 'relative flex h-full w-full cursor-pointer items-center'
      }).append(
        $('<div>', { class: 'flex w-0 flex-1 items-center space-x-2' }).append(
          $('<div>', { class: 'text-body text-sd-foreground max-w-[90%] font-medium' }).append(
            $('<div>', { class: 'ellipsis line-clamp-1' }).text(title)
          )
        ),
        $('<div>', {
          class:
            'text-sd-muted-foreground flex w-[70px] items-center justify-center text-sm opacity-0 group-hover:opacity-100 lc-xl:opacity-100',
          'data-state': 'closed'
        }).text(rate),
        $('<p>', { class: 'mx-0 text-[14px] lc-xl:mx-4' }).text(difficulty)
      );

      // 第三个部分 小竖条
      const $inner3 = $('<div>', { 'data-state': 'closed' }).append(
        $('<div>', { class: 'flex gap-0.5 px-1' }).append(
          Array.from({ length: 8 }).map(() =>
            $('<div>', { class: 'h-2 w-0.5 rounded bg-sd-foreground opacity-20' })
          )
        )
      );

      // 收藏
      const $inner4 = $('<div>', {
        class: 'hover:bg-sd-accent flex h-7 w-7 items-center justify-center rounded opacity-0',
        type: 'button',
        'aria-haspopup': 'dialog',
        'aria-expanded': 'false',
        'aria-controls': 'xxx',
        'data-state': 'closed'
      }).append(
        $('<div>', {
          class:
            'relative text-[14px] leading-[normal] p-[1px] before:block before:h-3.5 before:w-3.5 text-sd-muted-foreground',
          html: ''
        })
      );

      $div1.append($inner1, $inner2, $inner3, $inner4);
      $wrapper.append($div1);
      $a.append($wrapper);
      // 插入到第一个父元素的最前面
      if (parentNodeList && parentNodeList.childNodes.length > 0) {
        const firstChild = parentNodeList.childNodes[0];
        if (firstChild) {
          parentNodeList.insertBefore($a[0], firstChild);
        } else {
          parentNodeList.appendChild($a[0]);
        }
      }
    }

    let lcCnt = 0;
    let pbSetCnt = 0;
    function getData() {
      let switchpbRepo = GM_getValue('switchpbRepo');
      let switchTea = GM_getValue('switchTea');
      let switchrealoj = GM_getValue('switchrealoj');
      let switchlevel = GM_getValue('switchlevel');
      let arr = document.querySelector('[class*="pb-[80px]"]');
      let everydatpbidx = 0;
      // pb页面加载时直接返回
      if (arr == null) {
        return;
      }
      observeIfNeeded(arr);
      isSelfChanging = true;
      try {
        if (pbSetCnt && pbSetCnt == arr.childNodes.length) {
          console.log('第' + lcCnt + '次刷新插件...');
          // 到达次数之后删除定时防止卡顿
          if (lcCnt == shortCnt) {
            console.log('到达当前功能指定刷新次数, 检测暂时无更新, 暂停刷新...');
            clearId('all');
          }
          lcCnt += 1;
          return;
        }
        t2rate = JSON.parse(GM_getValue('t2ratedb', '{}').toString());
        // 灵茶题目渲染
        if (switchTea) {
          let first = arr.firstChild;
          if (!first.textContent.includes('灵茶题集')) {
            createProblemCard({
              title: '灵茶题集' + '-' + getCurrentDate(3),
              pburl: teaSheetUrl,
              difficulty: '暂无',
              rate: '暂无',
              parentNodeList: arr
            });
          }
          // 经过灵茶之后，无论如何数量都会变成1
          everydatpbidx = 1;
        }
        if (switchpbRepo) {
          let childs = arr.childNodes;
          let idx = switchTea ? 1 : 0;
          let childLength = childs.length;
          for (; idx < childLength; idx++) {
            let v = childs[idx];
            // 如果元素第一个就不存在或undifined就直接返回
            if (!v) return;
            let t = v.textContent;

            let data = t.split('.');
            let id = data[0].trim();
            let $item = $(v);
            let difficulty = $item.find('.text-sd-medium, .text-sd-easy, .text-sd-hard').first();
            let passRate = difficulty.siblings('div.text-sd-muted-foreground').first();
            // 如果没有难度和通过率属性，则跳过步骤
            if (difficulty.length <= 0 || passRate.length <= 0) continue;
            if (switchrealoj) {
              // 难度修改为隐藏
              if (difficulty.length > 0) {
                difficulty.text('隐藏');
                difficulty.removeClass('text-sd-easy text-sd-medium text-sd-hard');
              }

              // 通过率修改为隐藏
              if (passRate.length > 0) {
                passRate.text('隐藏');
              }
              continue;
            }
            // 因为lc请求是有缓存的，所以多次刷新的时候同一个位置会是不同的题目，这时候需要还原
            if (t2rate[id] != null) {
              let ndScore = t2rate[id]['Rating'];
              difficulty.text(ndScore);
              // 修改尺寸使得数字分数和文字比如(困难)保持在同一行
              passRate.removeClass('w-[70px]');
              passRate.addClass('w-[55px]');
            } else {
              let nd2ch = {
                'mx-0 text-[14px] text-sd-easy lc-xl:mx-4': '简单',
                'mx-0 text-[14px] text-sd-medium lc-xl:mx-4': '中等',
                'mx-0 text-[14px] text-sd-hard lc-xl:mx-4': '困难'
              };
              difficulty.text(nd2ch[difficulty.attr('class')]);
              // 恢复原有大小尺寸
              passRate.removeClass('w-[55px]');
              passRate.addClass('w-[70px]');
            }

            // 增加算术评级插入操作
            if (switchlevel) {
              let level = levelData[id];
              let levelText = level ? '算术评级: ' + level['Level'] : '';
              let $existingLevel = passRate.siblings('.arithmetic-level');
              // 如果已经操作过
              if ($existingLevel.length > 0) {
                // 如果含有算术评级则更新文本，如果没有则删除原来插入的数据
                if (level) {
                  $existingLevel.text(levelText);
                } else {
                  $existingLevel.remove();
                }
              } else if (level) {
                // 如果没有操作过
                // 如果含有算术评级则插入，如果没有算术评级，则不做任何操作
                // 构造新的算术等级元素（保持结构一致）
                const $level = $('<div></div>')
                  .addClass(passRate.attr('class')) // 复用样式
                  .addClass('arithmetic-level') // 自定义类作为标记
                  .text(levelText);
                // 去除灰色颜色和尺寸限制
                $level
                  .removeClass('w-[70px] w-[55px] text-sd-muted-foreground')
                  .addClass('min-w-[100px]');
                // 如果插入的为每日一题位置，需要修改尺寸，左移8px
                if (idx == everydatpbidx) {
                  $level.css('transform', 'translateX(-8px)');
                }
                // 插入到通过率前面
                passRate.before($level);
              }
            }
          }
          console.log('has refreshed problemlist...');
        }
        pbSetCnt = arr.childNodes.length;
      } finally {
        isSelfChanging = false;
      }
    }

    // pblist插件刷新次数
    let pbListCnt = 0;
    // pblist当前刷新之后列表所含题目数量
    let pbListpbCnt = 0;
    function getPblistData() {
      if (!GM_getValue('switchpblist')) return;
      let switchrealoj = GM_getValue('switchrealoj');
      let switchlevel = GM_getValue('switchlevel');
      let switchpblistRateDisplay = GM_getValue('switchpblistRateDisplay');
      let pre = document.querySelector('.w-full .pb-20');
      let arr = pre?.childNodes[0]?.lastChild?.childNodes[0];
      if (!arr) return;
      // 设置监听官方渲染，并标记当前自己修改不被监听
      observeIfNeeded(arr);
      isSelfChanging = true;
      try {
        // console.log(arr)
        // console.log(pbListpbCnt)
        // console.log(arr.childNodes.length)
        if (pbListpbCnt && pbListpbCnt == arr.childNodes.length) {
          console.log('第' + pbListCnt + '次刷新插件...');
          // 到达次数之后删除定时防止卡顿
          if (pbListCnt == shortCnt) {
            console.log('到达当前功能指定刷新次数, 检测暂时无更新, 暂停刷新...');
            console.log('清理标记');
            clearId('pblist');
          }
          pbListCnt += 1;
          return;
        }
        t2rate = JSON.parse(GM_getValue('t2ratedb', '{}').toString());
        let childs = arr.childNodes;
        let childLength = childs.length;
        for (let idx = 0; idx < childLength; idx++) {
          let v = childs[idx];
          if (!v) return;
          let t = v.textContent;
          let data = t.split('.');
          let id = data[0].trim();
          // console.log(id)
          // 如果不是a标签，说明是自定义题单，需要多进一层
          let $item = $(v);
          let difficulty = $item.find('.text-sd-medium, .text-sd-easy, .text-sd-hard').first();
          let passRate = difficulty.siblings('div.text-sd-muted-foreground').first();
          if (switchpblistRateDisplay) passRate.removeClass('opacity-0').addClass('opacity-100');
          // 如果没有难度属性，则跳过步骤
          if (difficulty.length <= 0 || passRate.length <= 0) continue;
          if (switchrealoj) {
            // 难度修改为隐藏
            if (difficulty.length > 0) {
              difficulty.text('隐藏');
              difficulty.removeClass('text-sd-easy text-sd-medium text-sd-hard');
            }

            // 通过率修改为隐藏
            if (passRate.length > 0) {
              passRate.text('隐藏');
            }
            continue;
          }

          // 插入竞赛分数
          if (t2rate[id] != null) {
            let ndScore = t2rate[id]['Rating'];
            difficulty.text(ndScore);
            // 修改尺寸使得数字分数和文字比如(困难)保持在同一行
            passRate.removeClass('w-[70px]');
            passRate.addClass('w-[55px]');
          } else {
            let nd2ch = {
              'mx-0 text-[14px] text-sd-easy lc-xl:mx-4': '简单',
              'mx-0 text-[14px] text-sd-medium lc-xl:mx-4': '中等',
              'mx-0 text-[14px] text-sd-hard lc-xl:mx-4': '困难'
            };
            difficulty.text(nd2ch[difficulty.attr('class')]);
            // 恢复原有大小尺寸
            passRate.removeClass('w-[55px]');
            passRate.addClass('w-[70px]');
          }

          // 增加算术评级插入操作
          if (switchlevel) {
            let level = levelData[id];
            let levelText = level ? '算术评级: ' + level['Level'] : '';
            let $existingLevel = passRate.siblings('.arithmetic-level');
            // 如果已经操作过
            if ($existingLevel.length > 0) {
              // 如果含有算术评级则更新文本，如果没有则删除原来插入的数据
              if (level) {
                $existingLevel.text(levelText);
              } else {
                $existingLevel.remove();
              }
            } else if (level) {
              // 如果没有操作过
              // 如果含有算术评级则插入，如果没有算术评级，则不做任何操作
              // 构造新的算术等级元素（保持结构一致）
              const $level = $('<div></div>')
                .addClass(passRate.attr('class')) // 复用样式
                .addClass('arithmetic-level') // 自定义类作为标记
                .text(levelText);
              // 去除灰色颜色和尺寸限制
              $level
                .removeClass('opacity-0 w-[70px] w-[55px] text-sd-muted-foreground')
                .addClass('min-w-[100px] opacity-100');
              // 插入到通过率前面
              passRate.before($level);
            }
          }
        }
        console.log('has refreshed...');
        pbListpbCnt = arr.childNodes.length;
      } finally {
        isSelfChanging = false;
      }
    }

    function getSearch() {
      if (!GM_getValue('switchsearch')) return;
      let arr = $("div[role='table']");
      if (arr.length == 0) return;
      arr = arr[0].childNodes[1];

      let head = document.querySelector("div[role='row']");
      if (!head) rerurn;
      // 确认难度序列
      let rateRefresh = false;
      let headndidx;
      for (let i = 0; i < head.childNodes.length; i++) {
        let headEle = head.childNodes[i];
        if (headEle.textContent.includes('难度')) {
          headndidx = i;
        }
        if (headEle.textContent.includes('题目评分')) {
          rateRefresh = true;
        }
      }
      if (!arr) return;
      let childs = arr.childNodes;
      for (const element of childs) {
        let v = element;
        if (!v.childNodes[1]) return;
        let t = v.childNodes[1].textContent;
        let data = t.split('.');
        let id = data[0].trim();
        let nd = v.childNodes[headndidx].childNodes[0].innerHTML;
        if (t2rate[id] != null && !rateRefresh) {
          nd = t2rate[id]['Rating'];
          v.childNodes[headndidx].childNodes[0].innerHTML = nd;
        } else {
          let nd2ch = { 'text-green-s': '简单', 'text-yellow': '中等', 'text-red-s': '困难' };
          let clr = v.childNodes[headndidx].childNodes[0].getAttribute('class');
          v.childNodes[headndidx].childNodes[0].innerHTML = nd2ch[clr];
        }
      }
    }

    /**
     * 渲染 rating
     * @param {HTMLElement} nd 要操作的节点
     * @param {string | undefined} ndRate rating
     * @param {Record<string, string>} lightn2c 亮模式难度列表
     * @param {Record<string, string>} darkn2c 暗模式难度列表
     * @returns {boolean} 是否命中
     */
    function renderRating(nd, ndRate, lightn2c, darkn2c) {
      // 如果传入不是nd则直接返回
      let clr = nd.classList;
      if (clr.length === 0) return false;
      for (const [className, text] of Object.entries({ ...lightn2c, ...darkn2c })) {
        if (clr.contains(className)) {
          // 如果难度分存在，则替换分数
          if (ndRate) {
            nd.textContent = ndRate;
            return true;
          }
          // 如果难度分不存在，则恢复本身
          nd.innerText = text;
          return false;
        }
      }

      return false;
    }

    /**
     * 渲染 level
     * @param {HTMLElement} nd 要操作的节点
     * @param {string | undefined} level 评级
     * @param {DOMTokenList} cls class 列表
     * @param {boolean} hit 是否命中
     * @param {number} padding 单位: px, 默认80
     */
    function renderLevel(nd, level, cls, hit, padding = 80) {
      if (level && GM_getValue('switchlevel') ) {
        let text = document.createElement('span');
        text.classList.add(...cls);
        text.innerHTML = '算术评级: ' + level;
        text.style = nd.getAttribute('style');
        text.style.paddingRight = `${hit ? padding - 5 : padding}px`; // 命中之后宽度不一样
        if (nd.parentNode.getAttribute("level") == null) {
          nd.parentNode.insertBefore(text, nd);
          nd.parentNode.setAttribute("level", "LeetcodeRating")
        } else {
          // 如果已经存在了就进行刷新
          nd.previousSibling.innerHTML = '算术评级: ' + level;
        }
      }
    }

    /**
     * 修正侧边栏高亮题目的样式
     * @param {HTMLElement} listNode 侧边栏列表节点
     * @param {string} cssSelector 子节点选择器
     */
    function fixSiderbarProblemHighlight(listNode, cssSelector) {
      // console.log("修正侧边栏高亮题目样式");
      const pbList = listNode.querySelectorAll(cssSelector);

      pbList.forEach(div => {
        const levelSpan = div.querySelector(':scope > span');
        const pbDiv = div.querySelector(':scope > div > div');
        if (!levelSpan) return;

        if (pbDiv.className !== levelSpan.className) {
          // 如果className不一致，说明是高亮状态不一致
          levelSpan.className = pbDiv.className;
        }
      });
    }

    // 确认之后不再刷新
    let studyf;
    let studyCnt = 0;
    function getStudyData(css_selector) {
      if (!GM_getValue('switchstudy')) return;
      levelData = JSON.parse(GM_getValue('levelData', '{}').toString());
      let totArr = null;
      // 如果传入的是已经找到的node元素, 就不再搜索
      if (css_selector instanceof Element) {
        totArr = css_selector;
      } else {
        totArr = document.querySelector(css_selector);
      }
      if (totArr == null) return;
      let first = totArr.firstChild?.textContent;
      if (studyf && first && studyf == first) {
        // 到达次数之后删除定时防止卡顿
        if (studyCnt == shortCnt) {
          clearId('study');
        }
        studyCnt += 1;
        return;
      }
      let childs = totArr.childNodes;
      for (const arr of childs) {
        for (let pbidx = 1; pbidx < arr.childNodes.length; pbidx++) {
          let pb = arr.childNodes[pbidx];
          let pbNameLabel = pb.querySelector('.truncate');
          if (pbNameLabel == null) continue;
          let pbName = pbNameLabel.textContent;
          if (pb.getAttribute("study") != null ) continue;
          let nd = pb.childNodes[0].childNodes[1].childNodes[1];
          let pbhtml = pb?.childNodes[0]?.childNodes[1]?.childNodes[0]?.childNodes[0];
          pbName = pbName.trim();

          // 保证 nd 存在
          if (nd == null || nd.classList.length === 0) {
            // console.log(nd)
            continue;
          }

          let levelId = getLevelId(pbName);
          let id = getPbNameId(pbName);
          // console.log(pbName, level)

          let darkn2c = {
            'text-lc-green-60': '简单',
            'text-lc-yellow-60': '中等',
            'text-lc-red-60': '困难'
          };
          let lightn2c = {
            'text-lc-green-60': '简单',
            'text-lc-yellow-60': '中等',
            'text-lc-red-60': '困难'
          };

          // render rating
          let hit = renderRating(nd, t2rate?.[id]?.Rating, lightn2c, darkn2c);

          // render level
          renderLevel(nd, levelData[levelId]?.Level?.toString(), pbhtml.classList, hit, 130);
          pb.setAttribute("study", "true");
        }
      }
      if (totArr.firstChild) studyf = totArr.firstChild?.textContent;
      console.log('has refreshed...');
    }

    let pbsidef;
    let pbsidee;
    function getpbside(css_selector) {
      let totArr = null;
      // 如果传入的是已经找到的node元素, 就不再搜索
      if (css_selector instanceof Element) {
        totArr = css_selector;
      } else {
        totArr = document.querySelector(css_selector);
      }
      if (totArr == null) return;
      if (totArr.firstChild == null) return;
      let first = totArr.firstChild?.childNodes[0]?.textContent;
      let last = totArr.lastChild?.childNodes[0]?.textContent;
      if (first && pbsidef && pbsidef == first && last && pbsidee && pbsidee == last) {
        if (pbsideCnt == normalCnt) clearId('pbside');

        // TODO: 没想到什么好的办法来确切的监听源站前端对题目列表的更新，只能大概等一个延时
        if (pbsideCnt === 1) {
          // 在此处检查高亮状态是否改变，并修正
          fixSiderbarProblemHighlight(totArr, ':scope > div > div[id] > div > :nth-child(2)');
        }

        pbsideCnt += 1;
        return;
      }
      let childs = totArr.childNodes;
      for (const arr of childs) {
        // 特殊判定， 如果大于30则是每日一题列表
        let pbidx = 1;
        if (arr.childNodes.length >= 30) pbidx = 0;
        for (; pbidx < arr.childNodes.length; pbidx++) {
          let pb = arr.childNodes[pbidx];
          let pbName = pb.childNodes[0].childNodes[1].childNodes[0].textContent;
          let nd = pb.childNodes[0].childNodes[1].childNodes[1];
          let pbhtml = pb?.childNodes[0]?.childNodes[1]?.childNodes[0]?.childNodes[0];

          // 保证 nd 存在
          if (nd == null || nd.classList.length === 0) {
            // console.log(nd)
            continue;
          }

          // console.log(pbName)
          let data = pbName.split('.');
          let id = data[0];

          let darkn2c = {
            'text-lc-green-60': '简单',
            'text-lc-yellow-60': '中等',
            'text-lc-red-60': '困难'
          };
          let lightn2c = {
            'text-lc-green-60': '简单',
            'text-lc-yellow-60': '中等',
            'text-lc-red-60': '困难'
          };

          // render rating
          let hit = renderRating(nd, t2rate?.[id]?.Rating, lightn2c, darkn2c);

          // render level
          renderLevel(nd, levelData[id]?.Level?.toString(), pbhtml.classList, hit);
        }
      }
      if (totArr.firstChild?.childNodes[0]) pbsidef = totArr.firstChild.childNodes[0].textContent;
      if (totArr.lastChild?.childNodes[0]) pbsidee = totArr.lastChild.childNodes[0].textContent;
      // console.log(pbsidef, pbsidee)
      console.log('已经刷新侧边栏envType分数...');
    }

    let pbsideCnt = 0;
    function getpbsideData() {
      // 左侧栏分数显示
      let searchParams = location.search;
      levelData = JSON.parse(GM_getValue('levelData', '{}').toString());
      // ?envType=study-plan-v2&envId=leetcode-75
      // 类似学习计划的展开栏
      if (
        searchParams.includes('envType') &&
        !searchParams.includes('daily-question') &&
        !searchParams.includes('problem-list')
      ) {
        let overflow = document.querySelector('.overflow-auto.p-5');
        if (overflow == null) return;
        let studyplan = overflow.childNodes[0].childNodes[1];
        if (!studyplan) studyf = null;
        if (GM_getValue('switchstudy') && studyplan) {
          getpbside(studyplan);
        }
      } else {
        // 普通展开栏
        let overflow = document.querySelector('.overflow-auto.p-4');
        if (overflow == null) return;
        let pbarr = overflow?.childNodes[0]?.childNodes[1];
        if (pbarr == null) return;
        if (pbarr.firstChild == null) return;
        if (pbarr.lastChild == null) return;
        if (pbsidef == pbarr.firstChild?.textContent && pbsidee == pbarr.lastChild?.textContent) {
          if (pbsideCnt == normalCnt) clearId('pbside');

          // TODO: 没想到什么好的办法来确切的监听源站前端对题目列表的更新，只能大概等一个延时
          // 根据列表的大小不同，更新耗时可能不同，故直接对快慢两种情况运行两次修正
          if (pbsideCnt === 4 || pbsideCnt === 1) {
            // 在此处检查高亮状态是否改变，并修正
            fixSiderbarProblemHighlight(pbarr, ':scope > .group > :first-child > :nth-child(2)');
          }

          pbsideCnt += 1;
          return;
        }
        if (pbarr != null) {
          for (const onepb of pbarr.childNodes) {
            let tp = onepb.childNodes[0]?.childNodes[1];
            if (!tp) {
              // console.log(tp)
              continue;
            }
            let pbName = tp.childNodes[0]?.textContent;
            if (pbName == null) {
              continue;
              // pbName = tp.childNodes[0]?.textContent
              // console.log(pbName)
            }
            let nd = tp.childNodes[1];
            let pbhtml = tp.childNodes[0]?.childNodes[0];

            // 保证 nd 存在
            if (nd == null || nd.classList.length === 0) {
              // console.log(nd)
              continue;
            }
            // 如果为算术，说明当前已被替换过
            if (nd.textContent.includes('算术')) continue;

            // console.log(pbName)
            let data = pbName.split('.');
            let id = data[0];

            let darkn2c = {
              'text-sd-easy': '简单',
              'text-sd-medium': '中等',
              'text-sd-hard': '困难'
            };
            let lightn2c = {
              'text-sd-easy': '简单',
              'text-sd-medium': '中等',
              'text-sd-hard': '困难'
            };

            // render rating
            let hit = renderRating(nd, t2rate?.[id]?.Rating, lightn2c, darkn2c);

            // render level
            renderLevel(nd, levelData[id]?.Level?.toString(), pbhtml.classList, hit);
          }
          pbsidef = pbarr.firstChild.textContent;
          pbsidee = pbarr.lastChild.textContent;
          // console.log(pbsidef, pbsidee)
          console.log('已经刷新侧边栏题库分数...');
        }
      }
    }

    function createSearchBtn() {
      if (!GM_getValue('switchpbsearch')) return;
      if (document.querySelector('#id-dropdown') == null) {
        // 做个搜索框
        const div = document.createElement('div');
        div.setAttribute('class', 'layui-inline');
        // 适配黑色主题
        div.classList.add('leetcodeRating-search');
        div.innerHTML += `<input name="" placeholder="请输入题号或关键字" class="lcr layui-input" id="id-dropdown">`;
        const logo = document.querySelector('nav > div > ul');
        if (logo == null) return;
        logo.insertAdjacentElement('afterend', div);
        // else navbar.appendChild(div);
        layui.use(function () {
          let dropdown = layui.dropdown;
          let $ = layui.$;
          let inst = dropdown.render({
            elem: '#id-dropdown',
            data: [],
            click: function (obj) {
              this.elem.val(obj.title);
              this.elem.attr('data-id', obj.id);
            }
          });
          let elemInput = $(inst.config.elem);
          let lastQueryTime = '';
          let timer;
          elemInput.on('input propertychange', function (event) {
            clearTimeout(timer);
            timer = setTimeout(function () {
              let currentTime = Date.now();
              if (currentTime - lastQueryTime >= 800) {
                let elem = $(inst.config.elem);
                let value = elem.val().trim();
                elem.removeAttr('data-id');
                let dataNew = findData(value);
                dropdown.reloadData(inst.config.id, {
                  data: dataNew
                });
                lastQueryTime = currentTime;
              }
            }, 800);
          });

          $(inst.config.elem).on('blur', function () {
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
                      `;
            let list = {
              query: queryT,
              operationName: 'problemsetQuestions',
              variables: { in: { query: search, limit: 10, offset: 0 } }
            };
            let resLst = [];
            $.ajax({
              type: 'POST',
              url: lcnojgo,
              data: JSON.stringify(list),
              success: function (res) {
                let data = res.data.problemsetQuestions.questions;
                for (let idx = 0; idx < data.length; idx++) {
                  let resp = data[idx];
                  let item = {};
                  item.id = idx;
                  item.title = resp.frontendId + '.' + resp.titleCn;
                  item.href = 'https://leetcode.cn/problems/' + resp.titleSlug;
                  item.target = '_self';
                  resLst.push(item);
                }
              },
              async: false,
              xhrFields: { withCredentials: true },
              contentType: 'application/json;charset=UTF-8'
            });
            return resLst;
          }
        });
      }
    }

    async function layuiload() {
      // 使用layui的渲染
      layui.use(function () {
        let element = layui.element;
        let util = layui.util;
        let pbstatus = JSON.parse(GM_getValue('pbstatus', '{}').toString());
        // 普通事件
        util.on('lay-on', {
          // loading
          loading: async function (othis) {
            const DISABLED = 'layui-btn-disabled';
            if (othis.hasClass(DISABLED)) return;
            othis.addClass(DISABLED);
            const cnt = Math.ceil(getpbCnt() / 100);
            const headers = {
              'Content-Type': 'application/json'
            };
            let loaded = 0;
            const promises = [];
            for (let i = 0; i < cnt; i++) {
              promises.push(
                ajaxReq(
                  'POST',
                  lcgraphql,
                  headers,
                  allPbPostData(i * 100, 100),
                  async res => {
                    const questions = res.data.problemsetQuestionListV2.questions;
                    for (const pb of questions) {
                      pbstatus[pb.titleSlug] = {
                        titleSlug: pb.titleSlug,
                        id: pb.questionFrontendId,
                        status: pb.status,
                        title: pb.title,
                        titleCn: pb.translatedTitle,
                        difficulty: pb.difficulty,
                        paidOnly: pb.paidOnly
                      };
                    }
                    loaded += 1;

                    const showval = Math.trunc((loaded / cnt) * 100);
                    element.progress('demo-filter-progress', `${showval}%`);
                  },
                  true
                )
              );
            }

            Promise.all(promises).then(async () => {
              pbstatus[pbstatusVersion] = {};
              GM_setValue('pbstatus', JSON.stringify(pbstatus));
              layer.msg('同步所有题目状态完成!');
              await sleep(1000);
              layer.closeAll();
              layer.msg('重新加载页面中!');
              await sleep(1000);
              location.reload();
            });
          }
        });
      });
    }

    async function layuiload1() {
      // 使用layui的渲染
      layui.use(function () {
        let element = layui.element;
        let util = layui.util;
        let pbstatus = JSON.parse(GM_getValue('pbstatus', '{}').toString());
        // 普通事件
        util.on('lay-on', {
          // loading
          loading1: async function (othis) {
            const DISABLED = 'layui-btn-disabled';
            if (othis.hasClass(DISABLED)) return;
            othis.addClass(DISABLED);
            // 获取所有的<a>标签
            let links = document.querySelectorAll('a');
            // console.log(links)
            // 过滤出符合条件的<a>标签
            let matchingLinks = Array.from(links).filter(link => {
              return (
                link.href.match(pbUrl) &&
                !link.href.match(pbSolutionUrl) &&
                !link.href.match(pbSubmissionsUrl) &&
                !(
                  link.href.includes('daily-question') ||
                  link.getAttribute('class')?.includes('rounded') ||
                  link.getAttribute('data-state') ||
                  link.getAttribute('class')?.includes('no-underline')
                )
              );
            });
            // console.log(matchingLinks)
            const cnt = Math.ceil(matchingLinks.length / 100);
            let loaded = 0;
            let initIdx = 0;
            console.log(matchingLinks[0].href);
            for (let i = 0; i < cnt; i++) {
              await sleep(200);
              for (let idx = 0; idx < 100; idx++) {
                if (initIdx == matchingLinks.length) break;
                let url = matchingLinks[initIdx].href;
                let titleSlug = getSlug(url);
                if (!titleSlug) {
                  initIdx += 1;
                  break;
                }
                if (pbstatus[titleSlug] && !pbstatus[titleSlug]['status'].includes('TO_DO')) {
                  pbstatus[titleSlug]['status'] = 'TO_DO';
                }
                // console.log(titleSlug)
                initIdx += 1;
              }
              loaded += 1;
              const showval = Math.trunc((loaded / cnt) * 100);
              element.progress('demo-filter-progress1', `${showval}%`);
            }
            pbstatus[pbstatusVersion] = {};
            GM_setValue('pbstatus', JSON.stringify(pbstatus));
            layer.msg('重置题目状态完成!');
            await sleep(1000);
            layer.closeAll();
            layer.msg('重新加载页面中!');
            await sleep(1000);
            location.reload();
          }
        });
      });
    }

    let t1; // pb
    let pbCnt = 0;
    let pbCnt2 = 0;
    function getpb() {
      let switchrealoj = GM_getValue('switchrealoj');
      // 搜索功能
      if (GM_getValue('switchpbsearch')) createSearchBtn();
      // 题目页面
      let curUrl = location.href;
      // 只有描述页才进行加载
      let isDescript =
        !curUrl.match(regDiss) && !curUrl.match(regSovle) && !curUrl.match(regPbSubmission);
      // 如果持续10次都不在描述页面, 则关闭pb定时
      if (!isDescript) {
        // 非des清除定时
        if (pbCnt == shortCnt) clearId('pb');
        pbCnt += 1;
        return;
      }
      // 流动布局逻辑
      if (isDynamic) {
        // pb其他页面时刷新多次后也直接关闭
        let t = document.querySelector('.text-title-large');
        if (t == null) {
          t1 = 'unknown';
          pbCnt = 0;
          if (pbCnt2 == shortCnt) clearId('pb');
          pbCnt2 += 1;
          return;
        }

        // console.log(t1, t.textContent)
        if (t1 != null && t1 == t.textContent) {
          // des清除定时
          if (pbCnt == shortCnt) clearId('pb');
          pbCnt += 1;
          return;
        }
        let data = t.textContent.split('.');
        let id = data[0].trim();
        let colorA = ['.text-difficulty-hard', '.text-difficulty-easy', '.text-difficulty-medium'];
        let colorSpan;
        for (const color of colorA) {
          colorSpan = document.querySelector(color);
          if (colorSpan) break;
        }
        if (!colorSpan) {
          if (switchrealoj) return;
          console.log('color ele not found');
          return;
        }
        // 统计难度分数并且修改
        let nd = colorSpan.getAttribute('class');
        let nd2ch = {
          'text-difficulty-easy': '简单',
          'text-difficulty-medium': '中等',
          'text-difficulty-hard': '困难'
        };
        if (switchrealoj || (t2rate[id] != null && GM_getValue('switchpbscore'))) {
          if (switchrealoj) colorSpan.remove();
          else if (t2rate[id] != null) colorSpan.innerHTML = t2rate[id]['Rating'];
        } else {
          for (let item in nd2ch) {
            if (nd.toString().includes(item)) {
              colorSpan.innerHTML = nd2ch[item];
              break;
            }
          }
        }
        // 逻辑，准备做周赛链接,如果已经不存在组件就执行操作
        let url = chContestUrl;
        let zhUrl = zhContestUrl;
        let tips = colorSpan?.parentNode;
        if (tips == null) return;
        let tipsPa = tips?.parentNode;
        // tips 一栏的父亲节点第一子元素的位置, 插入后变成竞赛信息位置
        let tipsChildone = tipsPa.childNodes[1];
        // 题目内容, 插入后变成原tips栏目
        // let pbDescription = tipsPa.childNodes[2];
        if (tipsChildone?.getAttribute('plugin') == null) {
          let divTips = document.createElement('div');
          divTips.setAttribute('class', 'flex gap-1');
          divTips.setAttribute('plugin', 'leetcodeRating');
          let abody = document.createElement('a');
          abody.setAttribute('data-small-spacing', 'true');
          abody.setAttribute('class', 'css-nabodd-Button e167268t1 hover:text-blue-s');
          let abody2 = document.createElement('a');
          abody2.setAttribute('data-small-spacing', 'true');
          abody2.setAttribute('class', 'css-nabodd-Button e167268t1 hover:text-blue-s');

          let abody3 = document.createElement('a');
          abody3.setAttribute('data-small-spacing', 'true');
          abody3.setAttribute('class', 'css-nabodd-Button e167268t1 hover:text-blue-s');

          let abody4 = document.createElement('p');
          abody4.setAttribute('data-small-spacing', 'true');
          abody4.setAttribute('class', 'css-nabodd-Button e167268t1 hover:text-blue-s');

          let span = document.createElement('span');
          let span2 = document.createElement('span');
          let span3 = document.createElement('span');
          let span4 = document.createElement('span');
          // 判断同步按钮
          if (GM_getValue('switchpbstatusBtn')) {
            // console.log(levelData[id])
            span4.innerHTML = `<i style="font-size:12px" class="layui-icon layui-icon-refresh"></i>&nbsp;同步题目状态`;
            span4.onclick = open_layer_sync;
            span4.setAttribute('style', 'cursor:pointer;');
            // 使用layui的渲染
            layuiload();
            abody4.removeAttribute('hidden');
          } else {
            span4.innerText = '未知按钮';
            abody4.setAttribute('hidden', 'true');
          }
          abody4.setAttribute('style', 'padding-left: 10px;');

          levelData = JSON.parse(GM_getValue('levelData', '{}').toString());
          if (levelData[id] != null) {
            // console.log(levelData[id])
            let des = '算术评级: ' + levelData[id]['Level'].toString();
            span3.innerText = des;
            span3.onclick = function (e) {
              e.preventDefault();
              layer.open({
                type: 1, // Page 层类型
                area: ['700px', '450px'],
                title: '算术评级说明',
                shade: 0.6, // 遮罩透明度
                maxmin: true, // 允许全屏最小化
                anim: 5, // 0-6的动画形式，-1不开启
                content: `<p class="containerlingtea" style="padding:10px;color:#000;">${levelContent}</p>`
              });
            };
            abody3.removeAttribute('hidden');
          } else {
            span3.innerText = '未知评级';
            abody3.setAttribute('hidden', 'true');
          }
          abody3.setAttribute('href', '/xxx');
          abody3.setAttribute('style', 'padding-right: 10px;');
          abody3.setAttribute('target', '_blank');

          if (t2rate[id] != null) {
            let contestUrl;
            let num = getcontestNumber(t2rate[id]['ContestSlug']);
            if (num < 83) {
              contestUrl = zhUrl;
            } else {
              contestUrl = url;
            }
            span.innerText = t2rate[id]['ContestID_zh'];
            span2.innerText = t2rate[id]['ProblemIndex'];
            abody.setAttribute('href', contestUrl + t2rate[id]['ContestSlug']);
            abody.setAttribute('target', '_blank');
            abody.removeAttribute('hidden');
            abody2.setAttribute(
              'href',
              contestUrl + t2rate[id]['ContestSlug'] + '/problems/' + t2rate[id]['TitleSlug']
            );
            abody2.setAttribute('target', '_blank');
            if (switchrealoj) abody2.setAttribute('hidden', true);
            else abody2.removeAttribute('hidden');
          } else {
            span.innerText = '对应周赛未知';
            abody.setAttribute('href', '/xxx');
            abody.setAttribute('target', '_self');
            abody.setAttribute('hidden', 'true');
            span2.innerText = '未知';
            abody2.setAttribute('href', '/xxx');
            abody2.setAttribute('target', '_self');
            abody2.setAttribute('hidden', 'true');
          }
          abody.setAttribute('style', 'padding-right: 10px;');
          // abody2.setAttribute("style", "padding-top: 1.5px;")
          abody.appendChild(span);
          abody2.appendChild(span2);
          abody3.appendChild(span3);
          abody4.appendChild(span4);
          divTips.appendChild(abody3);
          divTips.appendChild(abody);
          divTips.appendChild(abody2);
          divTips.appendChild(abody4);
          tipsPa.insertBefore(divTips, tips);
        } else if (
          tipsChildone.childNodes != null &&
          tipsChildone.childNodes.length >= 2 &&
          (tipsChildone.childNodes[2].textContent.includes('Q') ||
            tipsChildone.childNodes[2].textContent.includes('未知'))
        ) {
          let pa = tipsChildone;
          let le = pa.childNodes.length;

          // 判断同步按钮
          if (GM_getValue('switchpbstatusBtn')) {
            // 使用layui的渲染, 前面已经添加渲染按钮，所以这里不用重新添加
            pa.childNodes[le - 1].removeAttribute('hidden');
          } else {
            pa.childNodes[le - 1].childNodes[0].innerText = '未知按钮';
            pa.childNodes[le - 1].setAttribute('hidden', 'true');
          }

          // 存在就直接替换
          let levelData = JSON.parse(GM_getValue('levelData', '{}').toString());
          if (levelData[id] != null) {
            let des = '算术评级: ' + levelData[id]['Level'].toString();
            pa.childNodes[le - 4].childNodes[0].innerText = des;
            pa.childNodes[le - 4].childNodes[0].onclick = function (e) {
              e.preventDefault();
              layer.open({
                type: 1, // Page 层类型
                area: ['700px', '450px'],
                title: '算术评级说明',
                shade: 0.6, // 遮罩透明度
                maxmin: true, // 允许全屏最小化
                anim: 5, // 0-6的动画形式，-1不开启
                content: `<p class="containerlingtea" style="padding:10px;color:#000;">${levelContent}</p>`
              });
            };
            pa.childNodes[le - 4].removeAttribute('hidden');
          } else {
            pa.childNodes[le - 4].childNodes[0].innerText = '未知评级';
            pa.childNodes[le - 4].setAttribute('hidden', 'true');
            pa.childNodes[le - 4].setAttribute('href', '/xxx');
          }
          // ContestID_zh  ContestSlug
          if (t2rate[id] != null) {
            let contestUrl;
            let num = getcontestNumber(t2rate[id]['ContestSlug']);
            if (num < 83) {
              contestUrl = zhUrl;
            } else {
              contestUrl = url;
            }
            pa.childNodes[le - 3].childNodes[0].innerText = t2rate[id]['ContestID_zh'];
            pa.childNodes[le - 3].setAttribute('href', contestUrl + t2rate[id]['ContestSlug']);
            pa.childNodes[le - 3].setAttribute('target', '_blank');
            pa.childNodes[le - 3].removeAttribute('hidden');

            pa.childNodes[le - 2].childNodes[0].innerText = t2rate[id]['ProblemIndex'];
            pa.childNodes[le - 2].setAttribute(
              'href',
              contestUrl + t2rate[id]['ContestSlug'] + '/problems/' + t2rate[id]['TitleSlug']
            );
            pa.childNodes[le - 2].setAttribute('target', '_blank');
            if (switchrealoj) pa.childNodes[le - 2].setAttribute('hidden', 'true');
            else pa.childNodes[le - 2].removeAttribute('hidden');
          } else {
            pa.childNodes[le - 3].childNodes[0].innerText = '对应周赛未知';
            // 不填写的话默认为当前url
            pa.childNodes[le - 3].setAttribute('href', '/xxx');
            pa.childNodes[le - 3].setAttribute('target', '_self');
            pa.childNodes[le - 3].setAttribute('hidden', 'true');

            pa.childNodes[le - 2].childNodes[0].innerText = '未知';
            pa.childNodes[le - 2].setAttribute('href', '/xxx');
            pa.childNodes[le - 2].setAttribute('target', '_self');
            pa.childNodes[le - 2].setAttribute('hidden', 'true');
          }
        }
        t1 = t.textContent;
      }
    }

    function clearId(name) {
      // 'all', 'tag', 'pb', 'company', 'pblist', 'search', 'study'
      let tmp = GM_getValue(name, -1);
      clearInterval(tmp);
      console.log('clear ' + name + ' ' + id + ' success');
    }

    let shortCnt = 3;
    let normalCnt = 5;
    function initCnt() {
      // 卡顿问题页面修复
      // 搜索页面为自下拉，所以需要无限刷新，无法更改，这一点不会造成卡顿，所以剔除计划
      // 题库页 ✅
      lcCnt = 0;
      pbSetCnt = 0;

      // 题目页
      pbCnt = 0; // ✅
      pbCnt2 = 0; // ✅

      // 题单页  ✅
      pbsideCnt = 0;
      pbListpbCnt = 0;
      pbListCnt = 0; // ✅

      studyCnt = 0; // ✅
    }

    // 初始化一些lc切换网页但是没有reload，需要执行的方法
    function initfunction() {
      // 添加题目页面复制按钮
      console.log('当前页面url: ' + location.href);
      if (GM_getValue('switchcopyright') && location.href.match(pbUrl)) {
        console.log('当前处于题目页，已开始添加复制按钮....');
        copyNoRight();
      }
      // 创建题目状态icon，题目页和讨论区刷新
      waitOprpbStatus();
      if (GM_getValue('switchpbstatus') && location.href.match(pbUrl)) {
        console.log('当前处于题目页，已开启题目提交监听....');
        pbsubmitListen();
      }
    }

    function clearAndStart(url, timeout, isAddEvent) {
      initCnt();
      initfunction();
      let start = '';
      let targetIdx = -1;
      let pageLst = ['all', 'pb', 'pblist', 'search', 'study'];
      let urlLst = [allUrl, pbUrl, pblistUrl, searchUrl, studyUrl];
      let funcLst = [getData, getpb, getPblistData, getSearch, getStudyData];
      for (let index = 0; index < urlLst.length; index++) {
        const element = urlLst[index];
        if (url.match(element)) {
          targetIdx = index;
        } else if (!url.match(element)) {
          // 清理其他的
          let tmp = GM_getValue(pageLst[index], -1);
          clearInterval(tmp);
        }
      }
      if (targetIdx != -1) start = pageLst[targetIdx];
      if (start != '') {
        // 清理重复运行
        let preId = GM_getValue(start);
        if (preId != null) {
          clearInterval(preId);
        }
        let css_selector = 'div.relative.flex.w-full.flex-col > .flex.w-full.flex-col.gap-4';
        if (start == 'study') {
          id = setInterval(getStudyData, timeout, css_selector);
        } else if (start == 'pb') {
          id = setInterval(getpb, timeout);
          if (GM_getValue('switchpbside')) {
            let pbsideId = setInterval(getpbsideData, timeout);
            GM_setValue('pbside', pbsideId);
          }
        } else {
          id = setInterval(funcLst[targetIdx], timeout);
        }
        GM_setValue(start, id);
      }
      if (isAddEvent) {
        // 只需要定位urlchange变更
        window.addEventListener('urlchange', () => {
          console.log('urlchange/event/happened');
          let newUrl = location.href;
          clearAndStart(newUrl, 1000, false);
        });
      }
    }

    // 获取界面所需数据, 需要在菜单页面刷新前进行更新
    function getNeedData() {
      // 更新分数数据
      async function getScore() {
        let now = getCurrentDate(1);
        preDate = GM_getValue('preDate', '');
        if (t2rate[t2rateVersion] == null || preDate == '' || preDate != now) {
          // 每天重置为空
          GM_setValue('pbSubmissionInfo', '{}');
          let res = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'get',
              url: rakingUrl + '?timeStamp=' + new Date().getTime(),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              onload: function (res) {
                resolve(res);
              },
              onerror: function (err) {
                console.log('error');
                console.log(err);
              }
            });
          });
          if (res.status === 200) {
            // 保留唯一标识
            t2rate = {};
            pbName2Id = {};
            pbNamee2Id = {};
            let dataStr = res.response;
            let json = JSON.parse(dataStr);
            for (const element of json) {
              t2rate[element.ID] = element;
              t2rate[element.ID]['Rating'] = Number.parseInt(
                Number.parseFloat(element['Rating']) + 0.5
              );
              pbName2Id[element.TitleZH] = element.ID;
              pbNamee2Id[element.Title] = element.ID;
            }
            t2rate[t2rateVersion] = {};
            console.log('everyday getdata once...');
            preDate = now;
            GM_setValue('preDate', preDate);
            GM_setValue('t2ratedb', JSON.stringify(t2rate));
            GM_setValue('pbName2Id', JSON.stringify(pbName2Id));
            GM_setValue('pbNamee2Id', JSON.stringify(pbNamee2Id));
          }
        }
      }
      getScore();

      // 更新level数据
      async function getPromiseLevel() {
        let week = new Date().getDay();
        if (levelData[levelVersion] == null || week == 1) {
          let res = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: 'get',
              url: levelUrl + '?timeStamp=' + new Date().getTime(),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              onload: function (res) {
                resolve(res);
              },
              onerror: function (err) {
                console.log('error');
                console.log(err);
              }
            });
          });
          if (res.status === 200) {
            levelData = {};
            levelTc2Id = {};
            levelTe2Id = {};
            let dataStr = res.response;
            let json = JSON.parse(dataStr);
            for (const element of json) {
              if (typeof element.TitleCn == 'string') {
                let titlec = element.TitleCn;
                let title = element.Title;
                levelData[element.ID] = element;
                levelTc2Id[titlec] = element.ID;
                levelTe2Id[title] = element.ID;
              }
            }
            levelData[levelVersion] = {};
            console.log('every Monday get level once...');
            GM_setValue('levelData', JSON.stringify(levelData));
            GM_setValue('levelTc2Id', JSON.stringify(levelTc2Id));
            GM_setValue('levelTe2Id', JSON.stringify(levelTe2Id));
          }
        }
      }
      getPromiseLevel();

      // 版本更新机制
      let now = getCurrentDate(1);
      preDate1 = GM_getValue('preDate1', '');
      let checkVersionLayer = GM_getValue('switchupdate')
        ? preDate1 == '' || preDate1 != now
        : true;
      console.log('checkVersionLayer: ', checkVersionLayer);
      GM_xmlhttpRequest({
        method: 'get',
        url: versionUrl + '?timeStamp=' + new Date().getTime(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function (res) {
          if (res.status === 200) {
            console.log('check version success...');
            const dataStr = res.response;
            const json = JSON.parse(dataStr);
            const remoteVersion = json['version'];
            const upcontent = json['content'];
            // 更新纸片人地址
            papermanpic = json['papermanpic'];
            // 通过更新 CSS 变量来更新纸片人
            document.documentElement.style.setProperty('--mumu-img', `url(${papermanpic})`);
            // console.log(papermanpic);
            if (remoteVersion != version) {
              if (checkVersionLayer) {
                console.log('弹窗更新栏一次..');
                layer.open({
                  area: ['500px', '300px'],
                  content:
                    '<pre class="versioncontent" style="color:#000">更新通知: <br/>leetcodeRating有新的版本' +
                    remoteVersion +
                    '啦,请前往更新~ <br/>' +
                    '更新内容: <br/>' +
                    upcontent +
                    '</pre>',
                  yes: function (index, layer0) {
                    let c = window.open(sciptUrl + '?timeStamp=' + new Date().getTime());
                    // c.close()
                    layer.close(index);
                    preDate1 = now;
                    GM_setValue('preDate1', preDate1);
                    // console.log('update preDate1 success');
                  }
                });
              } else {
                console.log('有新的版本，但是已经弹窗过且开启了最多只更新一次功能，等待明天弹窗..');
              }
            } else {
              console.log('leetcodeRating难度分插件当前已经是最新版本~');
            }
          }
        },
        onerror: function (err) {
          console.log('error');
          console.log(err);
        }
      });
    }
    // 获取必须获取的数据
    getNeedData();

    // 如果pbstatus数据开关已打开且需要更新
    if (GM_getValue('switchpbstatus')) {
      (function () {
        let pbstatus = JSON.parse(GM_getValue('pbstatus', '{}').toString());
        if (pbstatus[pbstatusVersion]) {
          console.log('已经同步过初始题目状态数据...');
          return;
        }
        let syncLayer = layer.confirm(
          '<div class="myfont">检测本地没有题目数据状态，即将开始初始化进行所有题目状态，是否开始同步? <br/> tips:(该检测和开启讨论区展示题目状态功能有关)</div>',
          { icon: 3 },
          function () {
            layer.close(syncLayer);
            open_layer_sync();
            layuiload();
          },
          function () {
            // do nothong
          }
        );
      })();
    }

    // 定时启动函数程序
    clearAndStart(location.href, 1000, true);
    GM_addStyle(`
          .versioncontent {
              white-space: pre-wrap;
              word-wrap: break-word;
              display: block;
          }
      `);

    // TODO 分割计划
    // spig js 纸片人相关
    if (GM_getValue('switchperson')) {
      const isindex = true;
      const visitor = '主人';
      let msgs = [];

      // 求等级用的数据
      let userTag = null;
      let level = 0;
      let score = 0;
      const queryProcess =
        '\n    query userQuestionProgress($userSlug: String!) {\n  userProfileUserQuestionProgress(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      difficulty\n      count\n    }\n    numFailedQuestions {\n      difficulty\n      count\n    }\n    numUntouchedQuestions {\n      difficulty\n      count\n    }\n  }\n}\n    ';
      const queryUser =
        '\n    query globalData {\n  userStatus {\n    isSignedIn\n    isPremium\n    username\n    realName\n    avatar\n    userSlug\n    isAdmin\n    checkedInToday\n    useTranslation\n    premiumExpiredAt\n    isTranslator\n    isSuperuser\n    isPhoneVerified\n    isVerified\n  }\n  jobsMyCompany {\n    nameSlug\n  }\n  commonNojPermissionTypes\n}\n    ';
      GM_addStyle(`
          :root {
              --mumu-img: url(${papermanpic});
          }
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
              background:var(--mumu-img) no-repeat;
          }

          #level {
              text-align:center;
              z-index:9999;
              color :#191919;
          }
      `);

      const spig = `<div id="spig" class="spig" hidden>
                              <div id="message">正在加载中……</div>
                              <div style="height=80px"/>
                              <div id="mumu" class="mumu"></div>
                              <div id="level">level loading...</div>
                          </div>`;
      const hitokoto = `<span class="hitokoto" id="hitokoto" style="display:none">Loading...</span>`;
      $('body').append(spig, hitokoto);

      // 消息函数
      let showMessage = (a, b) => {
        if (b == null) b = 10000;
        $('#mumu').css({ opacity: '0.5 !important' });
        $('#message').hide().stop();
        $('#message').html(a);
        $('#message').fadeIn();
        $('#message').fadeTo('1', 1);
        $('#message').fadeOut(b);
        $('#mumu').css({ opacity: '1 !important' });
      };

      // 右键菜单
      jQuery(document).ready(function ($) {
        $('#spig').mousedown(function (e) {
          if (e.which == 3) {
            showMessage(`秘密通道:<br/> <a href="${problemUrl}" title="题库">题库</a>`, 10000);
          }
        });
        $('#spig').bind('contextmenu', function (e) {
          return false;
        });
      });

      function getscore(userTag) {
        let list = { query: queryProcess, variables: { userSlug: userTag } };
        $.ajax({
          type: 'POST',
          url: lcgraphql,
          data: JSON.stringify(list),
          success: function (res) {
            let levelData = res.data.userProfileUserQuestionProgress.numAcceptedQuestions;
            levelData.forEach(e => {
              if (e.difficulty == 'EASY') score += e.count * 10;
              else if (e.difficulty == 'MEDIUM') score += e.count * 20;
              else if (e.difficulty == 'HARD') score += e.count * 100;
            });
            level = score / 1000;
            $('#level').text('level: ' + Math.trunc(level).toString());
            console.log('目前纸片人的等级是: ' + Math.trunc(level).toString());
          },
          async: false,
          xhrFields: { withCredentials: true },
          contentType: 'application/json;charset=UTF-8'
        });
      }

      $.ajax({
        type: 'POST',
        url: lcgraphql,
        data: JSON.stringify({ query: queryUser, variables: {} }),
        success: function (res) {
          userTag = res.data.userStatus.userSlug;
          // console.log(userTag)
        },
        async: false,
        xhrFields: { withCredentials: true },
        contentType: 'application/json;charset=UTF-8'
      });

      if (userTag != null) {
        getscore(userTag);
      } else {
        // console.log(userTag)
        $('#level').text('请登录后再尝试获取level');
      }
      // 监听分数提交
      let addListener2 = () => {
        let checkUrl = 'https://leetcode.cn/submissions/detail/[0-9]*/check/.*';
        XMLHttpRequest.prototype.send = function (str) {
          const _onreadystatechange = this.onreadystatechange;
          this.onreadystatechange = (...args) => {
            if (this.readyState == this.DONE && this.responseURL.match(checkUrl)) {
              let resp = JSON.parse(this.response);
              // console.log(resp)
              if (resp && resp.status_msg && resp.status_msg.includes('Accepted')) {
                showMessage(
                  '恭喜主人成功提交， 当前分数为: ' +
                    score +
                    ', 当前等级为: ' +
                    Math.trunc(level).toString()
                );
                console.log(
                  '恭喜主人成功提交， 当前分数为: ' +
                    score +
                    ', 当前等级为: ' +
                    Math.trunc(level).toString()
                );
              } else if (resp && resp.status_msg && !resp.status_msg.includes('Accepted')) {
                showMessage(
                  '很遗憾，主人提交失败，不过也不要气馁呀，加油! <br/> 当前分数为: ' +
                    score +
                    ', 当前等级为: ' +
                    Math.trunc(level).toString()
                );
                console.log(
                  '很遗憾，主人提交失败，不过也不要气馁呀，加油! 当前分数为: ' +
                    score +
                    ', 当前等级为: ' +
                    Math.trunc(level).toString()
                );
              }
            }
            if (_onreadystatechange) {
              _onreadystatechange.apply(this, args);
            }
          };
          return dummySend.call(this, str);
        };
      };
      addListener2();

      // 鼠标在消息上时
      jQuery(document).ready(function ($) {
        $('#message').hover(function () {
          $('#message').fadeTo('100', 1);
        });
      });

      // 鼠标在上方时
      jQuery(document).ready(function ($) {
        $('.mumu').mouseover(function () {
          $('.mumu').fadeTo('300', 0.3);
          msgs = [
            '我隐身了，你看不到我',
            '我会隐身哦！嘿嘿！',
            '别动手动脚的，把手拿开！',
            '把手拿开我才出来！'
          ];
          let i = Math.floor(Math.random() * msgs.length);
          showMessage(msgs[i]);
        });
        $('.mumu').mouseout(function () {
          $('.mumu').fadeTo('300', 1);
        });
      });

      function msgPageWelcome(url, isAddEvent) {
        let urlLst = [allUrl, pbUrl, pblistUrl, searchUrl];
        let msgShow = [
          '欢迎来到题库页, 美好的一天从做每日一题开始~',
          '欢迎来到做题页面，让我看看是谁光看不做？🐰',
          '欢迎来到题单页面~',
          '欢迎来到搜索页，在这里你能搜到一切你想做的题！'
        ];
        for (let index = 0; index < urlLst.length; index++) {
          const element = urlLst[index];
          if (url.match(element)) {
            // console.log(msgShow[index])
            showMessage(msgShow[index]);
          }
        }
        if (isAddEvent) {
          window.addEventListener('urlchange', () => {
            let newUrl = location.href;
            msgPageWelcome(newUrl, false);
          });
        }
      }

      // 开始
      jQuery(document).ready(function ($) {
        if (isindex) {
          // 如果是主页
          let now = new Date().getHours();
          if (now > 0 && now <= 6) {
            showMessage(visitor + ' 你是夜猫子呀？还不睡觉，明天起的来么你？', 6000);
          } else if (now > 6 && now <= 11) {
            showMessage(
              visitor + ' 早上好，早起的鸟儿有虫吃噢！早起的虫儿被鸟吃，你是鸟儿还是虫儿？嘻嘻！',
              6000
            );
          } else if (now > 11 && now <= 14) {
            showMessage(visitor + ' 中午了，吃饭了么？不要饿着了，饿死了谁来挺我呀！', 6000);
          } else if (now > 14 && now <= 18) {
            showMessage(visitor + ' 中午的时光真难熬！还好有你在！', 6000);
          } else {
            showMessage(visitor + ' 快来逗我玩吧！', 6000);
          }
          msgPageWelcome(location.href, true);
        } else {
          showMessage('力扣欢迎你～', 6000);
        }
        let top = $('#spig').offset().top + 150;
        let left = document.body.offsetWidth - 160;
        if (location.href.match(pbUrl)) {
          top = $('#spig').offset().top + 200;
        }
        $('#spig').attr('hidden', false);
        $('#spig').css({ top: top, left: left });
      });

      // 随滚动条移动
      jQuery(document).ready(function ($) {
        let f = $('.spig').offset().top;
        $(window).scroll(function () {
          $('.spig').animate(
            {
              top: $(window).scrollTop() + f + 150
            },
            {
              queue: false,
              duration: 1000
            }
          );
        });
      });

      // 鼠标点击时
      jQuery(document).ready(function ($) {
        let stat_click = 0;
        let i = 0;
        $('.mumu').click(function () {
          if (!ismove) {
            stat_click++;
            if (stat_click > 4) {
              msgs = [
                '你有完没完呀？',
                '你已经摸我' + stat_click + '次了',
                '非礼呀！救命！OH，My ladygaga'
              ];
              i = Math.floor(Math.random() * msgs.length);
              showMessage(msgs[i]);
            } else {
              msgs = [
                '筋斗云！~我飞！',
                '我跑呀跑呀跑！~~',
                '别摸我，有什么好摸的！',
                '惹不起你，我还躲不起你么？',
                '不要摸我了，我会告诉你老婆来打你的！',
                '干嘛动我呀！小心我咬你！'
              ];
              i = Math.floor(Math.random() * msgs.length);
              showMessage(msgs[i]);
            }
            let s = [
              0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7,
              -0.75
            ];
            let i1 = Math.floor(Math.random() * s.length);
            let i2 = Math.floor(Math.random() * s.length);
            $('.spig').animate(
              {
                left: (document.body.offsetWidth / 2) * (1 + s[i1]),
                top: (document.body.offsetHeight / 2) * (1 + s[i2])
              },
              {
                duration: 500,
                complete: showMessage(msgs[i])
              }
            );
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
        $('#spig').mousedown(function (e) {
          _move = true;
          _x = e.pageX - parseInt($('#spig').css('left'));
          _y = e.pageY - parseInt($('#spig').css('top'));
        });
        $(document)
          .mousemove(function (e) {
            if (_move) {
              let x = e.pageX - _x;
              let y = e.pageY - _y;
              let wx = $(window).width() - $('#spig').width();
              let dy = $(document).height() - $('#spig').height();
              if (x >= 0 && x <= wx && y > 0 && y <= dy) {
                $('#spig').css({
                  top: y,
                  left: x
                }); //控件新位置
                ismove = true;
              }
            }
          })
          .mouseup(function () {
            _move = false;
          });
      });

      // 纸片人一言api
      // $("#spig").attr("hidden", false)
      let hitokotohtml = function () {
        let msgShow = [$('#hitokoto').text()];
        showMessage(msgShow[0]);
        setTimeout(hitokotohtml, 15000);
      };
      setTimeout(hitokotohtml, 6000);

      function getkoto() {
        $.get('https://v1.hitokoto.cn/?c=j&encode=json')
          .then(res => {
            echokoto(res);
          })
          .catch(xhr => xhr);
        setTimeout(getkoto, 8000);
      }
      function echokoto(result) {
        console.log(result);
        let hc = result;
        document.getElementById('hitokoto').textContent = hc.hitokoto;
        console.log(hc.hitokoto);
      }
      setTimeout(getkoto, 8000);
    }
  }
  userScript();
})();
