---
title: gitlab创建远程开发环境，将gitlab作为前端
date: 2023-04-30 13:51:28
tags: 技术
---

# GitLab Remote Development

    github,gitlab都支持webide,但是使用webide时无法使用shell命令,
    恰好由于gitlab支持远程开发，所以将vps算力提供给gitlab，是的webide可以编译，调试

## 工具

> https://docs.gitlab.com/ee/user/project/remote_development/

    gitlab直接使用docker部署

## 配置
1. 申请域名证书
2. 开启docker镜像
3. 获取token
```shell
docker exec my-environment cat TOKEN
```

## 使用
1. 打开任意webide
2. 连接 domain.com:3443

## FAQ

    目前没有给出源码，只给出了docker部署

1. exited (134)

    在centos上跑ubuntu docker，node报错ulimit,要更新版本，我使用的是aliyun的centos就没再折腾了