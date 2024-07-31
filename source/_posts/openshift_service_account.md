---
title: openshift创建不过期的token
date: 2024-05-09 18:35:51
tags: 技术
---

# openshift

	openshift用了有一段时间了，但是token每次都是只有24小时有效时间，导致我每天都要重新生成token。
	今天看到openshift service account的token有效期很长，就尝试创建。
	主要是如何创建token，使用方法和项目的token是一致的

## oc命令行
1. 创建service account
```shell
# serviceaccount "robot" created
oc create sa robot
# view details of the service account created
oc describe sa robot
```

2. 授权service account
```shell
# grant permissions to service account
oc policy add-role-to-user view system:serviceaccount:<project-name>:<service account name>
oc policy add-role-to-user edit system:serviceaccount:<project-name>:<service account name>
```

3. 查看service account的token
```shell
oc describe sa robot

# output
# Name:        robot
# Namespace:   cookbook
# Labels:      <none>
# Annotations: <none>
#
# Image pull secrets: robot-dockercfg-vl9qn
#
# Mountable secrets:  robot-token-mhf9x
#                     robot-dockercfg-vl9qn
#
# Tokens:             robot-token-4nkdw
#                     robot-token-mhf9x
```

4. 查看access token
```shell
oc describe secret robot-token-mhf9x
# output
# Name:        robot-token-mhf9x
# Namespace:   cookbook
# Labels:      <none>
# Annotations: kubernetes.io/service-account.name=robot
#
# Type:        kubernetes.io/service-account-token
#
# Data
# ====
# ca.crt:         1070 bytes
# namespace:      8 bytes
# service-ca.crt: 2186 bytes
# token:          eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```
	最后的token便是用于http请求时的access token


# other command
```shell
# show all service accounts in this project
oc get sa
# revoke service account token
oc delete secret robot-token-mhf9x
# create service account token
oc create token your-service-account
```