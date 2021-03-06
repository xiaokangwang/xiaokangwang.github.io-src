+++
Description = ""
Tags = ["Development", "V2Ray", "Explain"]
Categories = ["Development", "V2Ray"]
menu = "main"
title = "Domain Socket的用途和其对于V2Ray的意义"
date = 2018-07-25T3:16:20+08:00
draft = false

+++


<h2>TL;DR</h2>

Domain socket是一种进程间通信机制，本身并不能跨主机通信，并不能直接用于翻墙，它是一种辅助配置的工具。

<h2>长回答</h2>

Unix domain socket 是一种跨进程通信通信协议，主要用于Unix系操作系统下，同一个主机上应用程序之间的通信。在V2Ray中实现了类似于TCP的流式Domain socket协议.

<h2>主要用法和优点</h2>

<h3>用于代理和其他程序之间的本地环回连接</h3>

Domain Socket协议的主要作用是和其他程序交互，这包括nginx等成熟的应用程序，也包括其他用户自己的应用程序。由于Unix domain socket支持基于文件控制访问权限，基于domain socket的协议可以比较有效的控制访问，减少权限控制的难度，减少了网络协议中需要的认证。
这在多用户环境下十分重要，通过Domain socket可以比较有效和方便的减少在同一个主机下，服务被其他用户访问的情况，及由于不正确配置导致本地服务被代理用户访问的情况。
当然，在部分环境下，Domain socket不占用本地端口，不需要生成数据包的特点也会是使用其的优点。

<h3>用于解决不同网络命名空间之间通信的问题</h3>

Linux操作系统下进程可以分组件可以处于操作系统中不同的命名空间，使用不同的操作系统环境。由于Unix domain socket是进程间通信方式，和网络并不处于同一个命名空间，因此，可以在使用相同的进程间通信命名空间的同时，使用不同的网络环境。这可以用于将部分程序在不同的网络环境中运行，实现在Linux环境下的分应用代理。

<h2>Domain Socket对于V2Ray的意义</h2>

在Unix环境下，一个比较重要的设计哲学就是每个工具做一个事，并将这个事情做好。V2Ray并不完全遵循这个哲学，而这个哲学也不是完全适合于V2Ray。但是，引入Domain sock是将V2Ray和其他程序进行有效结合的重要方法，使V2Ray更容易和其他程序和项目进行整合。


