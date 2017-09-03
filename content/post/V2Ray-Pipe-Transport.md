+++
Description = ""
Tags = ["Development", "V2Ray", "RFC"]
Categories = ["Development", "V2Ray"]
menu = "main"
title = "V2Ray RFC: V2Ray Pipe Transport Proposal"
date = 2017-09-03T17:58:20+08:00
draft = false

+++

V2Ray is designed to be a flexible network tool for developers. However, in term of developer friendliness it have suffered a bad reputation as being hard to master both for user and third-party developers.

Here, I would like to propose a new stub transport that is intended to reduce the difficulty for developing a transport for V2Ray, and remove the necessity of commitment for development. Pipe transport use operating system’s fork and/or unix domain socket capability. Allowing developer to experiment with new technology of transport with the need of worrying about V2Ray’s internal API change or framework, making it easier to use V2Ray in combination of other tools. For some tool that cannot integrate with V2Ray’s build infrastructure and other quality control constraints, this will make it easier to distribute third-party developer’s work without reducing v2ray-core’s code base standard.

Pipe transport can works as both an inbound transport and an outbound transport.

For inbound transport, only unix domain socket mode is available. V2Ray will listen for an unix domain socket and service at this domain socket. It is possible to set an file mode when specifying this file. An fatal error will be raise if this file location is inaccessible to V2Ray.

For outbound transport, two mode will be available, fork mode and unix domain socket mode. It is always recommended to use unix domain socket mode whenever possible. While in fork mode, a command is executed and use standard input and standard output as a bidirectional pipe. No additional information for host being connected is provided but argument for exec can be specified. Failed to exec the file is an error for V2Ray. When the process quit, the connection is considered ended. For unix domain socket, a unix domain socket file is connected when an outbound transmit is needed. If the connect is failed, a error will be raised.

Because of the absent of support for unix domain socket in windows environment, pipe transport can only act as an outbound transport in windows environment.

Pipe transport can be used as an easy method for configure an transport for experimenting with new technology with V2Ray without risking breaking anything or be forced to match an merging window.

Pipe transport’s behavior is consistent with proxy command or standard domain socket practice. This will help this new transport to use as many existing tool in unix style as possible. (V2Ray pipe should able to work with ncat out of box.)
