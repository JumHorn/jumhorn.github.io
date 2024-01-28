---
title: nginx在stream模式下如何将客户端真实IP传递给服务端
date: 2023-01-28 16:13:15
tags: 技术
---

# nginx使用stream分流

	nginx用443端口同时支持ssh和http服务器访问，只能使用一个端口，这时候就要用到stream分流
	实际原理是nginx在tcp建立连接后会发送一条tcp信息包含客户端ip和port，所以后端服务要适配接收该tcp信息，
	主动接收该报文信息，当后端服务不需要该信息时，也要主动接收，否则nginx发送的报文给后端服务器，导致后端服务器接收到未知报文处理不当时会报错

## nginx stream配置
```conf
# SNI 分流
stream {
  map $ssl_preread_server_name $upstream {
    jumhorn.com   127.0.0.1:80; # for http
    default          127.0.0.1:22; # for ssh
  }

  server {
    listen      443;
    proxy_pass  $upstream;
    proxy_protocol on;# send ip info to http server
    ssl_preread on;
  }
}

# http server
server {
    listen 127.0.0.1:80 ssl proxy_protocol;
    server_name jumhorn.com;

	proxy_set_header X-Real-IP $proxy_protocol_addr;
	proxy_set_header X-Real-PORT $proxy_protocol_port;
    location / {
        proxy_pass http_server;
    }
}
```

## 问题分析

	这时候http服务可以收到客户端的真实IP和PORT，但是ssh服务不需要该信息。
	接下来需要用巧妙的方法，中间设置一个代理，主动接收该信息，然后将其余信息继续发送给ssh服务器
```conf
# SNI 分流
stream {
  map $ssl_preread_server_name $upstream {
    jumhorn.com   127.0.0.1:80; # for http
    default          127.0.0.1:222; # for ssh
  }

  server {
    listen      443;
    proxy_pass  $upstream;
    proxy_protocol on;# send ip info to http server
    ssl_preread on;
  }

  # server use to remove proxy protocol for ssh server
  server {
    listen 127.0.0.1:222 proxy_protocol;
    proxy_pass 127.0.0.1:22;
  }
}

# http server
server {
    listen 127.0.0.1:80 ssl proxy_protocol;
    server_name jumhorn.com;

	proxy_set_header X-Real-IP $proxy_protocol_addr;
	proxy_set_header X-Real-PORT $proxy_protocol_port;
    location / {
        proxy_pass http_server;
    }
}
```