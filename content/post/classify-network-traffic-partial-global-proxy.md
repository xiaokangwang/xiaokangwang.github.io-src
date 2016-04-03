+++
title  = "#Classify and discriminate network traffic to enable partial global proxy in Linux using cgroup,iptables,redsocks"
date = "2016-04-02"
+++

Some of my friends ask me to play minecraft with them. “Great!”, I said as minecraft can be running natively in Linux, which is a prerequisite for me  to join.  No Longer before I downloaded it, I encounter a problem, it doesn’t honor system’s proxy setting and will not run unless it can contact its server and Internet on my computer is provided by a socks5 proxy.

While a VPN can do the work without much exploration, I decided to seek a way to solve this problem in a more elegant way. Since the minecraft multi-user Server is running in Asia, while all my servers are in Europe,  VPN will force all traffic to make their journey from China to Europe and then Singapore. Since the minecraft server we setup can listen on ipv6, and therefore can be connected directly. This will make a lot of unnecessary delay to game.  
Also, I have a lot of software that is capable of working with socks5 and have been configure to do so. I don’t wants to force these software to be forced to use proxy as they can handle the network more efficiently. And additional configure cost can be prevented.

The solution should satisfy these requirements:

* Enable me to play minecraft
* Do not interface with my established system and other softwares
* Minimal burden to system

There is a few way to do this:

* Running software in an isolated environment where network configure can be done separately
* Interrupt system call and make a special implementation of network
* (Modifying the game is not considered)

With some research, I found these solutions:
* Running proxychains to hook sockets call
* Running a VM to support an different network stack
* Classify and route traffic on system differently

Since minecraft is written in Java and JVM is just too complex, I don’t know if hook sockets call can actually do the magic. VM have a significant performance penalty, making it impossible to run a 3D game. So I have no choice but to classify traffic.

I could set the route rule by monitor the game and set rule by IP or other characteris, but it is to complicated and a waste of time. While running in different user might help, non-root user can encounter problem when display content on another user’s desktop and certainly I am not going to run a game in written in Java as root. And, there seems to have no other option.

However, as the best OS for Power Users and Developers, Linux have never abridged its user’s imagination.  Linux come with a lot of builtin function that can help user in the most direct and fundamental way.

Cgroup a Linux kernel function that can assign group to process and limit or control them separately. It powered lxc, docker and a lot other softwares and help them to build their isolation.

This time cgroup come to resort for me.

To classify network by cgroup, you will need the latest release of [iptables](http://www.netfilter.org/projects/iptables/downloads.html)

To create a cgroup run:
```
# cgcreate -a $(whoami) -g net_cls:$cgroupname
```

Where $cgroupname is your intended name for your cgroup that will use that proxy separately.

The ‘net_cls’ before colon sign means we wants to classify its traffic.

And run a shell inside it:
```
# cgexec  -g net_cls:$cgroupname bash
```
 And now, the traffic from the the cgroup we just created can be marked(is not mark in iptables!) a class. But we haven't defined what mark we should append to it. So we run:

```
# cd /sys/fs/cgroup/net_cls/$cgroupname;
# echo 0x00110011 > net_cls.classid;
```
And now the traffic is marked.

To forward traffic to a local transparent proxy run:
```
# iptables -t nat -N REDSOCKS #(create a new chain)
# iptables -t nat -A REDSOCKS -d 127.0.0.0/8 -j RETURN #(local traffic will not go through proxy)
# iptables -t nat -A REDSOCKS -p tcp -j REDIRECT --to-ports 11111 #(forward anything else to local transparent proxy)
# iptables -t nat -A OUTPUT -p tcp -m cgroup --cgroup 0x00110011 -j REDSOCKS #(if a traffic come from cgroup and marked with 0x00110011 it will be put into the chain was just created)
```
And finally, run [redsocks](https://github.com/darkk/redsocks) to convert transparent proxy to socks5
```
./redsocks -c conf.conf
```
With configure:
```
base {
	log_debug =off;
	log_info = on;
	log = stderr;
	daemon = off;
	redirector = iptables;
}

redsocks {
	local_ip = 127.0.0.1;
	local_port = 11111;
	ip = 1.2.3.4; /*Your proxy address*/
	port =12345; /*Your proxy port*/
	type = socks5;
}

```

There is also [another method](http://www.evolware.org/?p=293) to do this.

This article is made possible by:
https://wiki.archlinux.org/index.php/cgroups
http://www.evolware.org/?p=369
https://github.com/darkk/redsocks/blob/master/README
https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Resource_Management_Guide/sec-net_cls.html
http://serverfault.com/questions/560179/route-traffic-from-a-cgroup-via-a-specific-network-interface
http://man7.org/linux/man-pages/man8/tc-cgroup.8.html
