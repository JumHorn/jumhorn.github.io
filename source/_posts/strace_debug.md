---
title: 跟踪系统调用进行调试
date: 2023-10-05 19:47:42
tags: 技术
---

# strace

	跟踪调试，查看进程系统调用

## 查看系统打开文件例子
```shell
# pidof find the pid of running process
# 跟踪文件
sudo strace -e trace=file -p `pidof fcgiwrap`
# 跟踪系统调用
sudo strace -e stat -p `pidof sshd`
```
