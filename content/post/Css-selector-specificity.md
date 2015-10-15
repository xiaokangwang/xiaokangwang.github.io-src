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

##普世人权宣言=浏览器内建样式##




本文章参考了[W3C标准](http://www.w3.org/TR/2011/REC-CSS2-20110607/cascade.html#cascade)，[http://monc.se/kitchen/38/cascading-order-and-inheritance-in-css](http://monc.se/kitchen/38/cascading-order-and-inheritance-in-css)