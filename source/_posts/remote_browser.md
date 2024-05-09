---
title: 云浏览器
date: 2024-03-27 22:48:37
tags: 技术
---

# Cloud Browser

	看到很多网站云浏览器,想思考一下该技术的实现方案。
	云浏览器可以共享，多人使用同一个账号特别方便

> https://hyperbeam.com

## 方案1

	直接使用原网站API，该方法属于逆向行为。在ChatGPT刚出来的时候，很多逆向了openai的前端，找到API和token，然后直接调用API，跳过cloudflare检测。

	该方案简单，就是原网站可以随时变更API，逆向代价太大。

## 方案2

	远程屏幕共享

	属于粗暴的解决方法了，导致带宽增大。服务器压力增大

## 方案3

	基于浏览器自动化测试开源项目，将headless chrome部署到服务器上

	headless无界面和headful在运行上还是有一些差别的

## 方案4

	基于chrome devtools protocal,将chrome调试的API转为http服务

	该方案我只是猜想，还没有完全理解，chrome调试也可以客户端和服务端同时查看和修改同一个网页。
	具体chrome devtools protocal通信哪些内容还有待继续深入

## 方案5

	基于vscode server,在vscode server启动simple browser即可

	该方案不成立，code server的browser就是本地浏览器，使用的cookie都是本地的，和服务端没有关系