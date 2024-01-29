---
title: git命令的代理配置
date: 2024-01-29 19:00:00
tags: 技术
---

# git命令的代理配置

	git命令访问github资源用了两种不同的协议http和ssh，两种协议对应的配置方式不相同

## http代理配置

	对于只读仓库，只下载来说，用http方式配置即可，一般代理都能实现

###  1. 从系统方向解决

	设置系统的全局代理，然后执行git命令即可
```shell
export all_proxy="http://ip:port"
# or [use socks5]
export all_proxy="socks5://ip:port"
```

### 2. 从git仓库配置方向解决
```shell
git config --global http.proxy "http://ip:port"
# or [use socks5]
git config --global http.proxy "socks5://ip:port"
```

	上述两种方法配置好后，git pull要注意协议必须时http，上述配置才有用
```shell
git pull https://github.com/xxx/xxx.git
```

## ssh代理配置

###  1. 从系统方向解决

	设置系统的全局代理，然后执行git命令即可
```shell
# vim ~/.ssh/config # edit this file
Host github.com
HostName github.com
User git
# for bsd nc
ProxyCommand nc -x 127.0.0.1:7890 %h %p
# or for mac nc
ProxyCommand /usr/bin/nc -X 5 -x 127.0.0.1:7890 %h %p
```

### 2. 从git仓库配置方向解决
```shell
export GIT_SSH_COMMAND='ssh -o ProxyCommand="nc -x 127.0.0.1:7890 %h %p"'
# OR [git global setting]
git config --global core.sshCommand 'ssh -o ProxyCommand="nc -x 127.0.0.1:7890 %h %p"'
```

	上述两种方法配置好后，clone,pull,push命令都可以正常使用
```shell
git pull https://github.com/xxx/xxx.git
```

## FAQ
1. nc invalid option

	nc版本各不相同，使用方法差距也有些大，使用前需要查一下,保持对应参数执行意思一致