+++
Description = ""
Tags = ["Software", "Hardware"]
Categories = ["Vison", "#"]
menu = "main"
title = "#Why we must change the way we express our code"
date = 2018-9-5T17:57:46+08:00

+++
The CPUs are similar to each other, so similar that a compiler like LLVM can support multiply CPU architecture by translating a internal representation of action directly to native instructions without understanding what the program is actually doing. And they share a similar issue: making compromise for compatibility and a deeper cause: binary code distribution & representation.

The most powerful advantage of a CPU architecture is its software ecosystem. No matter how powerful a device is, without a variety of available software ready for end user, the system is unsuitable unless it meet a power user. As for developers, it is hard to develop on a platform with less ideal library and environment support and is, therefore, often choose to adopt their idea to popular platforms. This self-enforcing circle create chicken and egg problem for many new CPU manufacturer, 

Users expect the softwares run on their previous device also run on the one they have just bought, and their old device can run the software designed few years later. The compatibility has given many giant CPU manufacturer a handy monopoly, but also constraint them from making breaking change. Each addition to the instruction set mean a commitment to also support this function in the future, which means a bigger and bigger instruction set, and encumbered speed. As for software developers, this addition to instruction set is also tricky, as their library of choice might not support it, and the software developers have to develop fallback code so that even it is running on a older or low end device the code will still run.

Both these issue have one root cause in common, the software is often distributed in binary form, which make installation quick, and decreased initial download sizes. However, binary code cannot be easily change once generated and if source isn’t available to end user, only vendor can update it. This force software to die along with vendor, or when the vendor decides to abandon it. And even if the software is an open source one, it still require active man power to maintain it, and there will be significant invest for any power user tring to customize it. 

This article is a follow up article for the problems that abridge today’s computing device’s power. At the end of this series of article, I will propose a way of representing our idea in a form that computer can understand, addressing all problem I have address and showing a way to switch to optimal path that we have not given the chance to choose when computer was first introduced. 

