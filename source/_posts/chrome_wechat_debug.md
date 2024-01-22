---
title: 用chrome调试微信内置网页浏览器
date: 2023-09-15 21:08:42
tags: 技术
---

# 用chrome调试微信网页

    今天想修改微信内置网页的一些参数，实现JavaScript注入，跳过一些限时的功能，就查找了一下如何调试微信内置页面

## 工具
1. chrome
2. 安卓手机(含微信)

## 安装
1. 微信端
* 安卓手机开启开发者模式，允许 USB debug

    实际操作成功后，usb连接电脑，会有usb图标

* 微信内置页面开启允许调试

```url
http://debugxweb.qq.com/?inspector=true
```
    打开页面显示下载微信即为成功

2. chrome端
* chrome浏览器打开
```url
chrome://inspect/#devices
```

## 调试

    电脑上出现微信正在访问的页面，点击inspect即可。
    此时可以在电脑上注入JavaScript代码，修改页面功能。

## FAQ

1. 无法显示网页，出现黑屏

    该方法要求一定要能访问google页面，需要科学上网