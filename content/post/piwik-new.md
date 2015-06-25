+++
Categories = []
Description = ""
Tags = []
date = "2015-06-25T17:41:32+08:00"
menu = "main"
title = "#已经部署Piwik"

+++

前几天吐槽托管，现在我已经将我的piwik统计移出原来的托管商。

这里我要推荐一下OpenShift这个托管平台，免费，且功能齐全，无讨厌限制。

（尽管并没有其他的托管那么易用）但是，功能全面，限制少，还给shell。

顺便提一下，我遇到一个问题就是似乎.tar.gz的文件不能as is的下载。

原文件开头：

```
0000000 8b1f 0008 ba1b 558b 0300 3dec 7369 38db
0000010 fd96 bf59 d302 aae9 52b6 7516 caf8 aab8
0000020 cb67 9c49 53c4 e276 9d8d 6cce a7a5 884c
0000030 2484 29b4 4392 b690 5b35 bfbb df7d 9001
```

以tar.gz为后缀

```
0000000 8b1f 0008 0000 0000 0300 4900 b680 1f7f
0000010 088b 1b00 8bba 0055 ec03 693d db73 9638
0000020 59fd 02bf e9d3 b6aa 1652 f875 b8ca 67aa
0000030 49cb c49c 7653 8de2 ce9d a56c 4ca7 8488
```

解决方法：

问题在于以tar.gz为后缀时会少gzip解压一次

不确定是不是和浏览器还有关系

解决方法：

gzip -c -d wrong.tar.gz > correct.tar.gz
