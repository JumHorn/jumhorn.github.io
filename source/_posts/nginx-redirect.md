---
title: nginx_redirect
date: 2023-05-23 22:38:23
tags: 技术
---

# nginx跳转带来的问题

    记录一次实战配置中nginx自动跳转带来的问题，以及该问题的发现与分析

## nginx配置如下

    nginx作为流量分发，对于443端口同时支持ssh和https服务
    web服务是配置的/vscode访问后端服务

1. stream配置
```conf
# SNI 分流
stream {
	map $ssl_preread_server_name $name {
		ssh.jumhorn.com     127.0.0.1:22;
		default         127.0.0.1:8880;
	}

	server {
		listen      443;
		proxy_pass  $name;
		ssl_preread on; 
	}
}
```

2. http模块内部server配置
```conf
server {
    listen       127.0.0.1:8880 ssl;
    server_name  jumhorn.com www.jumhorn.com;

    location /vscode/ {
        proxy_pass  http://127.0.0.1:8080/;

        proxy_redirect http://127.0.0.1:8080/ https://$host/vscode/;

        proxy_http_version 1.1;
        proxy_read_timeout 300;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Real-PORT $remote_port;
    }
}
```

## 问题分析

    使用该配置当访问https://jumhorn.com/vscode时，
    服务器会自动跳转到https://jumhorn.com:8880/vscode,
    因为这个错误的8880端口，导致服务不可访问

## 查找错误

    打开浏览器F12调试时发现浏览器依次访问
    https://jumhorn.com/vscode然后302跳转(注意response中Location字段)
    https://jumhorn.com:8880/vscode
    这个跳转是如何来的？

## 原因分析

    这里分析了老半天才发现
    由于配置中没有 location /vscode，所以当访问https://jumhorn.com/vscode时，
    nginx自动跳转加上了内部配置的端口号,
    即便添修改成如下配置自动跳转到/vscode/，nginx依然会加上内部端口号，导致访问出错
    所以只能将全部域名添加上改成 return 302 http://$host/vscode/;

    之前问题分析都十分正确，解决方法不算优雅，但是解决了问题，当时虽然有困扰，但是不敢耽误时间。
    过了大半年后，这个问题有了更为优雅的解决方法，只需要加上
    port_in_redirect off;即可
    调试的时候也要非常小心，因为浏览器有缓存，会导致加上之后没有实际效果，所以要清空缓存再试

```conf
server {
    listen       127.0.0.1:8880 ssl;
    server_name  jumhorn.com www.jumhorn.com;
    port_in_redirect off;

    location /vscode/ {
        proxy_pass  http://127.0.0.1:8080/;

        proxy_redirect http://127.0.0.1:8080/ https://$host/vscode/;

        proxy_http_version 1.1;
        proxy_read_timeout 300;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Real-PORT $remote_port;
    }
}
```

## 完整配置
```config
http{
    server {
        listen       127.0.0.1:8880 ssl;
        server_name  jumhorn.com www.jumhorn.com;

        location /vscode {
            return 302 https://$host/vscode/;
        }

        location /vscode/ {
            proxy_pass  http://127.0.0.1:8080/;

            proxy_redirect http://127.0.0.1:8080/ https://$host/vscode/;

            proxy_http_version 1.1;
            proxy_read_timeout 300;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Real-PORT $remote_port;
        }
    }
}

stream {
	map $ssl_preread_server_name $name {
		ssh.jumhorn.com     127.0.0.1:22;
		default         127.0.0.1:8880;
	}

	server {
		listen      443;
		proxy_pass  $name;
		ssl_preread on; 
	}
}
```

# FAQ

1. port_in_redirect off;添加之后没有效果

    调试的时候也要非常小心，因为浏览器有缓存，会导致加上之后没有实际效果，所以要清空缓存再试