# 保存网页 

## 安装

1. 运行 `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install`
2. 编辑`config/default.js`并另存为`config/local.js`

## 如何使用

运行 `node index.js` 启动http服务，推荐使用[pm2](https://www.npmjs.com/package/pm2)

## 接口文档

### GET `/save`

保存网页为html文件

参数

- url: 网页地址（必填）
- filename: 保存的文件名（选填）
- sign: 签名（必填）

响应

```js
{
    status: 0, // 0表示保存成功，其他值表示保存失败
    message: "",
    data: {
        filename: "xxx"
    }
}
```
