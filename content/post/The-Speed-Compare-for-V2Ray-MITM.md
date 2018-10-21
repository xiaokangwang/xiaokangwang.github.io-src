+++
Description = ""
Tags = ["Development", "V2Ray","MITM","Speed"]
Categories = ["Development", "V2Ray"]
menu = "main"
title = "V2Ray MITM 功能的性能分析"
date = 2018-10-21T20:00:00+08:00
draft = false

+++
前段时间收到了Victoria Raymond的要求，对V2Ray MITM功能的速度情况进行了在自家网络下的测试。这些测试说明了这个功能在特定网络条件下的实际速度，并加入了对于其提速原理的解释。 如果还不了解V2Ray的MITM，请查看我协助Kiri完成的[V2Ray MITM配置说明](https://kirikira.moe/post/30/)。

## 测试内容 ##

首先是测试内容。针对于这个功能的实现原理，本文作者分别进行了对于连接建立速度和HTTP2网页展示速度的测试。

连接建立速度是指自浏览器开始尝试建立到某个站点首个连接到首个请求结果开始返回的速度。 这个速度主要影响网站首个页面的加载时间。因此，这个时间越长，你就会在输入网站地址之后回车后，或者点开调转至另外一个网站的链接时，面对一个白色的屏幕等待更长的时间。

而HTTP2网站展示速度测试则反映了对于启用了HTTP2的网站的页面加载速度。  HTTP2是一个比较新的网页内容传输协议，可以想象其会随着时间变得更加流行。其的一大改进就是提升了传输碎片化内容时的速度。由于V2Ray MITM不支持有效兼容HTTP2协议，因此无法利用这一新协议的特性，影响了内容传输的速度。

至于内容传输速度，由于V2Ray MITM仅减少了TLS加密环节，其对大文件传输速度没有影响，故没有测试。

## 测试方法 ##

为了有效测试V2Ray MITM对于性能的提升和影响， 本次测试选用了网络性能很一般的远端服务器以便得出最显著的效果。在测试期间的ping数据和测试结果一通呈现。 服务器配置方法与Kiri的教程中的方法相同。

### 连接建立速度测试 ###

首先通过 HEAD https://kkdev.org/cdn-cgi/trace 和 HEAD https://kkdev.org:8443/cdn-cgi/trace 请求来获取其和Cloudflare服务器建立连接并进行HEAD请求的速度。 能够使用这种方法进行测试是因为V2Ray配置文件中的设置会且仅会对443端口的流量进行MITM攻击，而8443是Cloudflare接受的HTTPS端口,可以被正常访问而不会被MITM。通过轮流对这两个地址进行访问，保证了在测试时MITM组和对照组网络环境基本相同。Cloudflare的连接速度很快，可以基本上忽略和其在传输数据时的速度，因此在其上下载短内容的速度和连接建立速度相同。

### HTTP2网站展示速度测试 ###

通过计算在不同代理设置下使用最新版火狐浏览器访问 https://http2.golang.org/gophertiles 的时间来计算加载支持HTTP2的内容时使用的时间。 这个时间通过浏览器 performance.getEntriesByType("navigation")[0].domComplete 的返回值确定。 由于技术限制，无法轮番进行不同配置文件的测试，但是通过在同一天内的较短时间内测试保证测试结果基本反映了在相同网络环境下的网络性能。

## 测试结果 ##

### 连接建立速度测试结果 ###

在测试过程中反映网络质量的ping的结果如下：

```
2802 packets transmitted, 2423 received, 13% packet loss, time 2809639ms
rtt min/avg/max/mdev = 343.576/352.594/521.293/17.872 ms
```

The Probability Distribution of Time for First Byte for V2Ray Original 
Configure and V2Ray MITM Configure

<img src="/files/V2Ray/MITM-Speed/conn.svg" alt="Chart" onerror="this.src='/files/V2Ray/MITM-Speed/conn.svg'; this.onerror=null;"  />

自结果中可以看出，V2Ray MITM可以有效的减少连接建立时间，将大约3个RTT（ping延迟）（最佳情况）的TLS连接建立和HTTP请求返回时间缩减为和不加密的HTTP相同的1个RTT（最佳情况）。 而在最佳情况之外均有出现需要更多时间的情况发生，而V2Ray Original相比于V2Ray MITM而言则更容易产生非最佳情况，这主要是由于TLS协议握手过程中的丢包对于连接建立时间的影响导致的，由于未被MITM的协议会产生更多的数据包往返，更容易因为丢包减缓速度。


### HTTP2网站展示速度测试结果 ###

在测试过程中反映网络质量的ping的结果如下：

```
5550 packets transmitted, 4913 received, 11% packet loss, time 5564244ms
rtt min/avg/max/mdev = 329.957/350.497/457.037/16.342 ms
```

The Probability Distribution of Time for DOM Complete for V2Ray Original 
Configure and V2Ray MITM Configure

<img src="/files/V2Ray/MITM-Speed/page.svg" alt="Chart" onerror="this.src='/files/V2Ray/MITM-Speed/page.svg'; this.onerror=null;" />

可以看到，在启用了http2的网站上，V2Ray MITM的加载速度比V2Ray Original要慢。这主要是由于http2对于网站的加载速度的影响要高于连接建立速度的影响。同时，由于这项测试在浏览器上进行，浏览器会保持和最近访问过的网站的连接，因此连接建立对浏览器网页加载速度的影响较小，图中内容显示连接建立速度对网页加载速度的影响小于http2对于网页加载速度的影响。

## 讨论 ##

在之前的测试中，我们发现根据不同的网络内容， V2Ray MITM 对实际使用速度的影响可能有益的，也可能是负面的。因此，在使用的过程中，应该仔细分析自己的使用环境和情况，并选择最适合自己的方案。






