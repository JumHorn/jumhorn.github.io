---
title: Ubuntu上使用postfix搭建邮件服务器
date: 2022-02-15 00:00:00
tags: 技术
---

# postfix mail server on ubuntu

	考虑到之前用{% post_link create_mail_server "sendmail" %}创建的server太旧了，很怕失去维护
	所以打算用新的技术栈，为jumhorn.eu.org域名创建邮件服务器


## 安装
```shell
sudo apt install mailutils
sudo apt install postfix
```

## 配置
```shell
sudo dpkg-reconfigure postfix
```

```shell
#使得配置生效
systemctl reload postfix
```

## 转发

	使用~/.forward文件，设置单个用户
```shell
cd # back to home dir
echo "admin@jumhorn.com" > .forward
chmod 644 .forward   # change permission else it won't work
```

	以上方法并不保存邮件，转发并保存邮件的方法
	最简单的方法是在.forward文件上加上自己,如下.forward文件
```file
jumhorn@gmail.com
admin@jumhorn.com
```

## 问题
* 配置文件

	配置文件在/etc/postfix/main.cf

	注意填写mydestination只要域名(jumhorn.com)，不要填写成邮箱地址(admin@jumhorn.com)
* 日志文件

	邮件的日志在/var/log/mail.log

* 25端口限制

	aws对25端口有限制，要发送邮件申请解除限制，其他云服务商可能有不同的策略