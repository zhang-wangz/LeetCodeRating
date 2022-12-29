<p align=center>
<img src="https://cdn.jsdelivr.net/gh/zhang-wangz/LeetCodeRating/images/logo.png"/>
  <br>
  <a title="Hits" target="_blank" href="https://github.com/zhang-wangz/LeetCodeRating"><img src="https://hits.b3log.org/zhang-wangz/LeetCodeRating.svg"></a>
  <img src="https://img.shields.io/github/stars/zhang-wangz/LeetCodeRating?style=flat-square"/>
  <img src="https://img.shields.io/github/contributors/zhang-wangz/LeetCodeRating?style=flat-square"/>
  <img src="https://img.shields.io/github/commit-activity/y/zhang-wangz/LeetCodeRating?style=flat-square"/>
  <img src="https://img.shields.io/github/last-commit/zhang-wangz/LeetCodeRating?style=flat-square"/>
  <br>
  <img src="https://img.shields.io/github/issues/zhang-wangz/LeetCodeRating?style=flat-square"/>
  <img src="https://img.shields.io/github/issues-pr/zhang-wangz/LeetCodeRating?style=flat-square"/>
  <img src="https://img.shields.io/github/watchers/zhang-wangz/LeetCodeRating?style=flat-square"/>
  <img src="https://img.shields.io/github/issues-closed/zhang-wangz/LeetCodeRating?style=flat-square"/>
  <br>
  LeetCodeRating，一款显示题目对应周赛难度分的浏览器插件。
  <br>
  支持中文和英文双站点，安装英文版本切换请切换github tag为english [点我直接切换](https://github.com/zhang-wangz/LeetCodeRating/tree/english)
</p>

### :iphone: 兼容性&安装

安装英文版本切换请切换github tag为english [点我直接切换](https://github.com/zhang-wangz/LeetCodeRating/tree/english)
LeetCodeRating｜一款显示题目对应周赛难度分的浏览器插件。  
在使用脚本之前，你需要为浏览器安装脚本管理器插件。  
经过测试，我们确定兼容以下浏览器和插件用于安装此脚本。

#### :globe_with_meridians: 浏览器支持（任选其一即可）

* Chrome 或 基于 Chromium 内核的浏览器 (Edge、360浏览器、CentBrowser等) <sup>*推荐</sup>
* Firefox <sup>*功能兼容，但并非最佳性能</sup>

#### :see_no_evil: 浏览器需要安装的脚本管理器插件

* Tampermonkey (新油猴) <sup>*<a href="https://www.tampermonkey.net/">插件安装链接</a></sup>

#### :page_facing_up: 安装脚本 (求star ヾ(≧▽≦*)o)

* 从 GreasyFork 安装
  通过 GreasyFork 安装脚本: **[点我](https://greasyfork.org/zh-CN/scripts/450890-leetcoderating-%E6%98%BE%E7%A4%BA%E5%8A%9B%E6%89%A3%E5%91%A8%E8%B5%9B%E9%9A%BE%E5%BA%A6%E5%88%86)**

#### :test_tube: 支持的操作系统

* Windows、MacOS、Linux 等支持 Chrome 或 Firefox 浏览器的所有操作系统 <sup>*移动平台如 iOS、Android 除外</sup>


#### 🐒 插件说明

- 有**周赛分数据的地方**才会**显示分数**，**没有**则**显示原有的难度**

- 界面没有改变的话只是因为**对应的数据没有收录**导致的

- 当前所有的数据都出自项目: https://zerotrac.github.io/leetcode_problem_rating/    <br/>
  项目设计初衷来自灵佬的视频: https://www.bilibili.com/video/BV1rS4y1s721/ | 训练技巧，上分技巧 部分

  - **ps: 只描述了重要更新内容～**

    💡1.1.3 更新:目前支持**tag页面和题库页面**显示难度分

    💡1.1.4 更新:支持**题目界面problems**显示难度分

    💡1.1.7 更新: 经反馈每次都重新获取数据过于影响性能，现已修改为**一天获取一次**
  
    💡1.2.0 更新: 修改具体问题页面UI，和题库页面保持一致，有难度分直接替换原本的难度标识
  
    💡1.2.1 更新: 增加对应周赛链接
    
    💡1.2.9 更新: 增加具体问题页面侧边栏题目中也显示难度分
    
    💡1.3.3 更新: 增加具体问题页面竞赛题属于Q几(周赛链接旁边)
    
    💡1.3.4 更新: 题库页面增加灵茶の试炼按钮

#### 💡 脚本效果 (求star ヾ(≧▽≦*)o)

![image-20220907114848833](https://cdn.jsdelivr.net/gh/zhang-wangz/LeetCodeRating/images/1.png)

![image-20220907114911865](https://cdn.jsdelivr.net/gh/zhang-wangz/LeetCodeRating/images/2.png)

![image-20220911231824291](https://cdn.jsdelivr.net/gh/zhang-wangz/LeetCodeRating/images/image-20220911231824291.png)

![image-20220912001243159](https://cdn.jsdelivr.net/gh/zhang-wangz/LeetCodeRating/images/image-20220912001243159.png)

![image-20221008121311231](https://raw.staticdn.net/zhang-wangz/LeetCodeRating/main/images/4.png)

<br/>

### :rocket: 贡献
非常欢迎你的加入！[提一个 Issue](https://github.com/zhang-wangz/LeetCodeRating/issues/new?assignees=athony.w&labels=help+wanted&template=ISSUE_TEMPLATE.md&title=) 或者提交一个 Pull Request。<br/>
要求如下： <br/>

1. 修改版本号信息:
- 如果第三位<10，将第三位+1，如果第三位=10，将第二位+1，第三位=0
- 例：1.1.9 => 1.2.0; 1.1.3 => 1.1.4;
```
// @version      1.1.9
```
2. 将更新描述在最上方加上一行，修改版本号（要求同上），并修改更新描述：
```
// @note    2022-09-07 1.1.9 (更新描述)
```
LeetCodeRating遵循 [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) 行为规范。

### :heart: [捐助](https://www.showdoc.com.cn/2069209189620830)特别鸣谢
| 捐助者 | 渠道 | 时间                 | 作者寄语           |
|-----| -- | -------------------- | ------------------ |
| **君 | 支付宝 | 2022-09-08 | 谢谢大佬支持～             |

### 🍬最后
**如果有帮助到你，请给repo点个star，让更多的人看到 ~ ("▔□▔)/**
