---
title: 架构总纲
date: 2024-01-23 14:42:46
tags: 架构
published: false
---

# 代码

## 算法
1. 神奇的篇章，全是技巧
2. 正则表达式

## 编程语言
1. 学习C++就要理解编译器，理解编译器就要反编译
2. template在C++编译器也实现了图灵完备性
3. 异常处理代码

## 编译
1. 编译系统实战问题解决
2. 解析与编译
3. JIT(Just-in-Time)/AOT(Ahead-of-Time)

## 调试
1. gdb内存泄漏查找
2. 打印程序调用堆栈(pstack,/proc/<pid>/stack,gdb> bt)
3. 查看进程下哪个线程占用高(top)


## 版本控制
1. 如何打补丁
2. 开发流程分析
3. cherry pick

## 设计模式
1. 举例常见设计模式，多线程单列模式的锁
2. 工厂模式和抽象工厂模式
3. 责任链模式

# 系统

## 锁
1. 无锁队列
2. 死锁

## 高并发
1. 并发编程,协程

## 分布式
1. 分布式锁
2. 分布式锁情况分析，分布式性能标准
3. 服务注册与发现

## 内存
1. 定位内存泄漏
2. pmap查看进程内存布局(/proc/<pid>/mem)
3. hook系统调用并打印相关内存

## 磁盘IO
1. 零拷贝

## 网络
1. tcp状态积
2. dpdk以及协议栈实现

## 优化
1. 优化接口调用时间(从多个方面思考回答)
2. 读多写少场景异步实现(线程池，MQ)

# 数据库

* {% post_link mysql_isolation "mysql isolation" %}
* {% post_link mysql_transaction_lock "mysql transaction lock" %}
* {% post_link mysql_log "mysql log" %}

# 运维
1. docker，qemu等虚拟化技术
2. Kubernetes部署和扩展
