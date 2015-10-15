+++
Categories = []
Description = ""
Tags = []
date = "2015-10-15T14:06:00+08:00"
menu = "main"
title = "$CSS，CSS选择器优先度和在其中的哲学道理"
draft = true
+++

浏览器在将页面渲染时，会自三个来源获得页面样式，他们是浏览器自己自带的样式，用户定义的样式，和网站作者提供的样式，这些CSS中必然会有一些互相冲突，相互矛盾的地方，这时，理解CSS和CSS选择器的优先级（特定程度）就变得十分重要。

在这篇文章中，我将通过耳熟能详的故事，向大家讲解CSS和CSS选择器的优先级，并通过简单易懂的哲学道理，帮助大家记住这些规则。

##人权=浏览器内建样式##

想必大家都对人权有或多或少的了解，可是大家都知道人权的具体内容是什么吗？

请访问[什么是人权](http://www.ohchr.org/ch/Issues/Pages/WhatareHumanRights.aspx) [世界人权宣言（中文）](http://www.ohchr.org/EN/UDHR/Pages/Language.aspx?LangID=chn)了解人权具体内容。(链接指向联合国官方网站，请放心访问)




本文章参考了[W3C标准](http://www.w3.org/TR/2011/REC-CSS2-20110607/cascade.html#cascade)，[http://monc.se/kitchen/38/cascading-order-and-inheritance-in-css](http://monc.se/kitchen/38/cascading-order-and-inheritance-in-css)
