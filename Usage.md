
#### 🐒 插件说明

##### 3.0.0 大版本更新说明

更新内容包括整理遗留bug，去除已经无法使用的功能，拓展新功能
详细包含如下

- 去除题库页去除vip加锁题目功能，该功能在题库页最新已支持

    - 该功能可以通过新题库页如下筛选获取

  ![image-20250429182041760](./images/image-20250429182041760.png)

  ​	plus是vip题目，非plus是免费题目


- 去除题目页代码输入阻止联想功能，该功能已经无法实现
- 去除公司和tag分类所有功能，公司页面是无法进入，实现不了，tag页面已经和题单页合并
- 适配题库页新ui
- 遗留问题，适配题单页ui
- 算术评级拓展至题库页和题单页，还是原有开关进行控制
- 拓展题单页功能，使通过率和题库页一样一直显示，而不是悬浮才显示
- 纸片人整体修复



##### 2.3.1 新功能速递，来自灵佬建议~
用户更新到2.3.1之后，在任意界面打开会提示初始化所有题目状态，点击确认

![image-20240728090853004](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728090853004.png)

弹出同步弹窗后，点击同步按钮，等待同步结束后，点击右上角x号即同步结束

![image-20240728090958907](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728090958907.png)

同步结束后，可在任意讨论区查看题目链接后面的标识，白圈代表用户没做过该题，绿色勾表示已ac，红色代表尝试过但是最终没有ac。
2.3.9补丁包更新， 尝试过但是最终没有ac的情况下，图标改成了力扣官方使用的黄色双环进行代替，贴合设计。

![image-20240728091107894](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728091107894.png)

2024.7.29 新增加题解区显示完成情况，如下图：

![image-20240729092718834](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240729092718834.png)



另外，当有新的题目提交时，插件会自动更新用户做题状态，无需手动操作。缺点是如果用户关闭插件，那么讨论区的题目状态可能和用户的lc状态不会时时保持一致。

![image-20240728091317858](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728091317858.png)

为了避免以上的情况出现，插件另外提供了两个手动同步按钮在界面上，分别在题目页面和讨论区页面

![image-20240728091447599](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728091447599.png)

![image-20240728091459269](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728091459269.png)

两个按钮打开的是同一个弹窗，和初始化同步的过程一致

![image-20240728091527059](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728091527059.png)

以上两个功能依赖于油猴插件界面的两个开关，点击即可关闭功能，更新2.3.1之后默认为开启状态

![image-20240728091638492](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728091638492.png)

2.3.3补丁更新， 新增加一个按钮，默认关闭，点击开启之后，讨论区题目状态挪到最前面。

![image-20240728182436862](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728182436862.png)

![image-20240728182445984](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240728182445984.png)



如果测试功能有问题，欢迎提交issue或者加vx或者加企鹅群进行交流~ 以上。





- 有**周赛分数据的地方**才会**显示分数**，**没有**则**显示原有的难度**
- 界面没有改变的话只是因为**对应的数据没有收录**导致的
- 当前所有的数据都出自项目: https://zerotrac.github.io/leetcode_problem_rating/    <br/>
  项目设计初衷来自灵佬的视频: https://www.bilibili.com/video/BV1rS4y1s721/ | 训练技巧，上分技巧 部分

#### 💡 脚本功能菜单 (求star ヾ(≧▽≦*)o)

- 功能 是否使用cdn选项

  ​	之所以有这个选项，是因为有朋友反映他们连接不上github的地址，所以该功能会将插件中所用到的地址都映射到国内cdn进行数据访问，方便插件使用, (须注意，和github原生数据可能存在延迟数据差别，须等待cdn同步，所以最好不使用cdn)

- 功能 灵茶信息，题库页面显示

  ![image](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image.png)

- 功能 题库页周赛难度评分(不包括灵茶)

  ​	此功能只有存在周赛分数据的题目才会显示，如果看到一排都没有，那就是这些题目都没有题目分，往后移动就有了。（老是有新朋友询问，这里说明一下）

  ![image1](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image_1.png)

- 功能 题目页周赛难度评分

  控制题目页难度分显示。注意，难度分上面一排数据默认显示，无法关闭，点击算术评级按钮，可以查看对应算术评级对应的难度说明。

  ![image-20240413223413032](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240413223413032.png)

- 功能 题解复制去除版权信息

  2.1.10 新恢复功能，之前迭代中因为技术难度去除了，现在增加回来，题解区，点击复制按钮后，弹框显示成功，粘贴后去除版权尾巴。

  ![image-20240413223708289](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240413223708289.png)


- 功能 题目页侧边栏分数显示

  开启后将自动加载侧边栏分数

  ![image-20240413223938033](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240413223938033.png)

- 功能 题目页题目搜索框

  2.1.9 新增，添加搜索框，输入题号或者关键字，可搜索题目，点击对应题目框后，自动跳转选中题目

  已适配深色模式

  ![image-20240413224048569](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240413224048569.png)

- 功能 题目搜索页周赛难度评分

  搜索页面难度分渲染，对应url为https://leetcode.cn/search/


- 功能 题单页评分(已和tag页合并)

  对应url为https://leetcode.cn/problem-list/xxx/

  例如https://leetcode.cn/problem-list/4uhwcjE2/

  后面的xxx为力扣生成的题单id

  ![image2](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image_2.png)

- 功能 学习计划周赛难度评分

  对应url为https://leetcode.cn/studyplan/xxx/

  例如https://leetcode.cn/studyplan/top-interview-150/

  ![image-20240413224920329](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240413224920329.png)

- 功能 竞赛页面双栏布局

  对应url为https://leetcode.cn/contest/xxx/problems/xxx

  例如: https://leetcode.cn/contest/weekly-contest-390/problems/most-frequent-ids/

  自动变换双栏，最初来源 better contest page / author ExplodingKonjac

  简单理解，就是上下排列改为左右排列，方便做题

  ![image-20240413225124712](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240413225124712.png)

- 功能  算术评级

  该按钮控制上述左侧栏功能中的算术评级和学习计划中的算术评级字段显示，推荐开启

- 功能 模拟oj环境(去除通过率,难度,周赛Qidx等)

  开启后，会关闭一些信息显示

  ![image3](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image_3.png)

  ![image-20240413225531805](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240413225531805.png)

- 功能 自动切换白天黑夜模式(早8晚8切换制)

  开启后，早上8点-晚上8点之间进入lc，自动切换为浅色模式，晚上8点之后-早上8点之前进入自动切换深色模式

- 功能 纸片人

  开启后，会在界面上显示一个纸片人，纸片人下方在登录力扣之后会根据当前做题数显示对应等级(根据题目数量，难度进行计算)，在不同的界面纸片人会给予一些提示(自行探索), 纸片人会自动讲述情话～可替换形象

  ![image-20240413230836029](https://raw.gitmirror.com/zhang-wangz/LeetCodeRating/main/images/image-20240413230836029.png)

<br/>