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

# 实战应用

	在部署nginx和phpmyadmin的时候出现报错FastCGI sent in stderr: Primary script unknown
	这个报错没有给出实质性的信息，但是又没有办法调试php-fpm
	这时查看系统调用就是神奇的方法

## 处理方法
1. 配置php-fpm

	让该进程只有一个worker，便于跟踪调查
```conf
# edit /etc/php-fpm.conf or /etc/php-fpm.d/www.conf
# add this line to specify only one worker
pm.max_children = 1
pm.start_servers = 1
pm.min_spare_servers = 1
pm.max_spare_servers = 1
```

2. 查看php-fpm进程ID
```shell
ps -aef | grep php
```
```bash
[root@iZuf6fy7vf35cte6gb1cmmZ ~]# ps -aef | grep php
root      2083     1  0 21:00 ?        00:00:00 php-fpm: master process (/etc/php-fpm.conf)
apache    2087  2083  0 21:00 ?        00:00:00 php-fpm: pool www
```

3. 跟踪php-fpm工作进程
```shell
strace -p  `pidof php-fpm worker(2087 in the last example)`
```
查看命令执行结果
```bash
[root@iZuf6fy7vf35cte6gb1cmmZ ~]# sudo strace -p 2087
strace: Process 2087 attached
accept(0, {sa_family=AF_INET, sin_port=htons(34364), sin_addr=inet_addr("127.0.0.1")}, [16]) = 3
times({tms_utime=0, tms_stime=0, tms_cutime=0, tms_cstime=0}) = 429556550
poll([{fd=3, events=POLLIN}], 1, 5000)  = 1 ([{fd=3, revents=POLLIN}])
read(3, "\1\1\0\1\0\10\0\0", 8)         = 8
read(3, "\0\1\0\0\0\0\0\0", 8)          = 8
read(3, "\1\4\0\1\5\27\1\0", 8)         = 8
read(3, "\17\37SCRIPT_FILENAME/usr/share/phpM"..., 1304) = 1304
read(3, "\1\4\0\1\0\0\0\0", 8)          = 8
lstat("/usr/share/phpMyadmin/index.php", 0x7ffd9a94f1f0) = -1 ENOENT (No such file or directory)
stat("/usr/share/phpMyadmin", 0x7ffd9a9516a0) = -1 ENOENT (No such file or directory)
stat("/usr/share", {st_mode=S_IFDIR|0755, st_size=4096, ...}) = 0
stat("/usr", {st_mode=S_IFDIR|0755, st_size=4096, ...}) = 0
stat("", 0x7ffd9a9516a0)                = -1 ENOENT (No such file or directory)
setitimer(ITIMER_PROF, {it_interval={0, 0}, it_value={60, 0}}, NULL) = 0
rt_sigaction(SIGPROF, {0x55d4dc25e470, [PROF], SA_RESTORER|SA_RESTART, 0x7f1e735593b0}, {SIG_DFL, [], 0}, 8) = 0
rt_sigprocmask(SIG_UNBLOCK, [PROF], NULL, 8) = 0
times({tms_utime=0, tms_stime=0, tms_cutime=0, tms_cstime=0}) = 429556551
setitimer(ITIMER_PROF, {it_interval={0, 0}, it_value={0, 0}}, NULL) = 0
write(3, "\1\7\0\1\0\27\1\0Primary script unknown\n\0"..., 152) = 152
shutdown(3, SHUT_WR)                    = 0
recvfrom(3, "\1\5\0\1\0\0\0\0", 8, 0, NULL, NULL) = 8
```

	从输出结果中可以看出no such file or directory,实际去查找该文件时，发现是nginx中我的文件名大小写错误

# 总结

	系统中错误排查时，要有此经验才能很好的排查问题
	相似命令pstack，gdb等