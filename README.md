# This Repo

    用HEXO将我用markdown写的文档变成博客

## 下载主题
```shell
git clone https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

## 部署服务
```shell
hexo clean && hexo g
hexo server # hexo server -p 54001 --ip 127.0.0.1(自定义端口和IP)
```

# 部署到github

> https://hexo.io/docs/github-pages.html

    目前该方法将github page部署在gh-pages分之上，该方法不是很好，
    因为部署的文件不需要做版本管理，该方法有待优化