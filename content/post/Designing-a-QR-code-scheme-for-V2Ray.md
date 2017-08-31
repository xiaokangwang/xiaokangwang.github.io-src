+++
Description = ""
Tags = ["Development", "V2Ray","QR Code","Scheme"]
Categories = ["Development", "V2Ray"]
menu = "main"
title = "Designing A QR Code Scheme For V2Ray"
date = 2017-08-31T22:18:59+08:00
draft = false

+++

Scanning QR code to import configure file from computer have been a wanted feature for a long time, but only until very recently, such a possibility were aroused to implement such a functionality.

Before LibV2Ray write a universal, future proof, multipart enabled QR code. Multiply attempt by third-party developer was made to create a QR code representation for a configure file. All previous version of QR code solve all problems they face at that time very successfully, but still at the expense of some problem not significant in their eyes. LibV2Ray Team values your choice and don’t make choice for you unless necessary. To achieve our own goal, we first need to know the existing problems that have to be challenged with our new design.

##Existing Problems

But the first difficulty they could face is represent such a long configure file into a single QR code the payload of which usually face a constraint of about 1024 bytes. The larger code could exist but can become very hard to scan even with idealized tool and environment. Previous version of developers have no choice but reduce the setting carried by their QR code scheme. This could be justified if there are other way to configure the tool or the underlying engine can only be configured with that amount of settings. Take shadowrocket favor vmess scheme for example, it can carry 4 defined distinct field while V2Ray can accept at least 409 type of settings. It very clear that with such a range of selection cannot carry what V2Ray has to offer and greatly narrowed the user's choice. If a QR code can’t carry everything it's underlay engine can present, it isn’t a universal QR code for config files.

The second difficulty that a QR code scheme needs to deal with is time. If a QR code scheme have to be changed from to time in order to handle new features added to the engine, such a scheme can become difficult to catch up with especially after this QR code have been used in more than one projects that is developed independent of each other. Since all QR codes looks the same, it is better if they they same works. Takes V2RayNG as an example, to handle V2Ray Websocket transport, a new field have been added to the internal configure format but this change isn’t reflected in V2RayNG favor vmess scheme QR code. Even if such a field is added to QR code, it could take additional delay to make all clients that understands such a QR code scheme to adapt to this additional change. A design like this isn’t future proof and require constant work to keep it up to date with internal engine’s progress.

The third problem is the root issue for all problems above. If we encode all possibility into a single QR code, it can be too large to scan or cannot be generated at all. To prevent such a problem, QR code scheme have to either reduce the domain of settings or have to find a way to workaround single QR code limitation.

##One solution to all problems

With all previous attempts at mind, we have to develope a new way to store the informations in a config file. It have to be universal, and future proof. To achieve this goal, we have to remove the constraints setted by fitting a informations into a single QR code. This constraints is most relevant to QR codes that prints to paper and expect a general QR code scanner that connected to internet, which can be solved by pointing it an url where further information can be acquired. For QR codes expected to be shown at computer and scanned by a semi-offline device with special software installed, such a limit is no longer a hard one.

A Simple Split can be an easy move but since it can be hard for user to identify which code is scanned and which is not, it could come into a situation where user cannot find the code missed and have to scan all code to finish the transfer. This can be a very unpleasant experience and have to be avoided.

To make user experience less frustration during the transfer, we came to the idea of forward error correction, in which user can scan whatever next QR code is and expect progress, the painful situation is expected to solve.

With compressing and other miniaturize method, we can encode a much larger domain of config settings into our QR code scheme. And by larger, we means ALL. With all hard work to unleash the possibility, there is no longer any reason to narrow the selection.

##What we have, Right now

The definition of LibV2Ray QR code scheme can be found at https://github.com/xiaokangwang/V2RayConfigureFileUtil. Here is a sample explation:

Each decode LibV2Ray QR code come with a signature of “libv2ray:?” at the beginner of every QR code. If you are designer of a client with libv2ray built into your project, you should use a library assisted decoding for any QR code come with such a signature. Otherwise, an error should be displayed to inform user of situation.

Rest of chars in the QR code are base91 encoded binary with a protocol buffer with a structure of [LibV2RayQRCode](https://github.com/xiaokangwang/V2RayConfigureFileUtil/blob/master/encoding/QRCode.proto).
Within this structure, whether a segmentation is performed, how many pieces exists and how many pieces is sufficient to decode the config file is present. As well as segment wide checksum and configure file wide checksum.

Once sufficient pieces of payload is scanned and collected, we will reconstruct the configure file. The configure file is hold with an additional protocol buffer as [LibV2RayPackedConfig](https://github.com/xiaokangwang/V2RayConfigureFileUtil/blob/master/encoding/LibV2RayPackedConfig.proto) in which the formart of configure file is included as well as compression info.

If you are using a libv2ray assisted QR code decoding, a callback should have been made once all these step is finished and ask you to save the configure file you just scanned.

##What to expect

As of now, an experiential QR scan interface is included in V2RayGO and other clients is advised to follow.

Meanwhile, a dedicated QR code generater for LibV2RayQR code will needs to exist in order to finish the ecosystem of LibV2Ray QR code scheme. A command line interface of such a [tool](https://github.com/xiaokangwang/V2RayConfigureFileUtil) do exist but there should be no user willing to learn a command line tool for generating a QR code which is intended to simplify the work for them not add to it.

A website is planned to solve this problem, in which user can upload their existing config file and expect rest of work down by this automated tool.

One more thing, when the libv2ray config file format was first introduced, user are expected to write their own QR code and check it themselves. Too many power were given to QR code which can be bad if we don’t give user a chance to check the file. So, a new config file format is planned to restrict the power of such a configure file and keep as many choice as possible. Once such a format is available, it will be possible for our version of V2Ray to show up at app store as a limited configure will not have the capacity that apple bars.
