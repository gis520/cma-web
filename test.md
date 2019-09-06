
# 实况气温图层展示

本篇是 [《从0到1开发一个 气象数据综合展示平台》](https://xiaozhuanlan.com/topic/2860791453) 的第2篇代码实现文章，未看过该篇文章的同学，请了解这个Demo系统系列章节说明。

本章主要内容是在上一节的基础上继续开发，实现实况气温图层展示。

## Demo 代码实现介绍

此次功能添加的代码文件较多，代码具体的功能实现建议看源码理解。


### 新增素材图标

![filechange.png](http://ww1.sinaimg.cn/large/940e68eegy1g6psbdpgqdj21ms1l0qb0.jpg)

![图标.png](http://ww1.sinaimg.cn/large/940e68eegy1g6psejpui3j20om0liq9p.jpg)

如上图，新增了17个图标，主要用来作为右上角工具条的图标样式展示，每种功能图标有两种样式演示，分别是选中和非选中。


### 右上角工具条实现

(1) 通过CSS/HTML 实现工具条的展示，在 `index.html` 新增如下的 HTML 代码：

```html
  <!-- 右上角工具菜单 -->
      <div class="conditionBox">
        <ul>
          <li class="yujing active" id="warning">预警<b></b></li>
          <li class="yubao" id="fcst">预报<b></b></li>
          <li class="shikuang" id="sk">实况<b></b></li>
          <li class="taifeng" id="typhoon">台风<b></b></li>
          <li class="leida" id="radar">雷达<b></b></li>
          <li class="weixing" id="sata">卫星<b></b></li>
          <li class="atdt" id="atdt">三维闪电</li>
        </ul>
        <div class="clear"></div>
      </div>
      <!-- 实况-子菜单 -->
      <div class="wrap_list wrap_mlist" id="skmenu">
        <div class="menuList off">
          <ul>
            <li id="115990101" unit="℃">气温</li>
            <li id="115990102" unit="hpa">气压</li>
            <li id="115990103" unit="%">相对湿度</li>
            <li id="115990104" unit="m/s">风</li>
            <li id="1150101020" unit="mm">降水</li>
          </ul>
        </div>
      </div>
```

(2) `main.css` 文件下新增样式代码如下（也可以新建文件单独引入）

```css

.conditionBox {
  position: absolute;
  z-index: 600;
  right: 20px;
  top: 20px;
  z-index: 1000;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 2px 2px 2px #aaa;
}
.conditionBox > ul {
  list-style: none;
  margin: 0px;
  padding: 0px;
  margin: 0 0 0 15px;
}
.conditionBox b {
  border-left: 1px solid #dedede;
  border-right: 1px solid #fff;
  margin-left: 15px;
}
.conditionBox > ul > li {
  float: left;
  padding-left: 25px;
  width: 60px;
  height: 48px;
  line-height: 50px;
  background-position: 5px 17px;
  background-repeat: no-repeat;
  cursor: pointer;
  font-size: 14px;
  font-family: "微软雅黑";
  color: #686c7e;
}

.yujing {
  background-image: url("../images/yj.png");
}
.yujing.active {
  background-image: url("../images/yjs.png");
  color: rgb(0, 49, 255);
}

.zaiqing {
  background-image: url("../images/zq.png");
}
.zaiqing.active {
  background-image: url("../images/zqs.png");
  color: rgb(0, 49, 255);
}

.shikuang {
  background-image: url("../images/sk.png");
  position: relative;
}
.shikuang.active {
  background-image: url("../images/sks.png");
  position: relative;
  color: rgb(0, 49, 255);
}

.yubao {
  background-image: url("../images/yb.png");
  position: relative;
}
.yubao.active {
  background-image: url("../images/ybs.png");
  position: relative;
  color: rgb(0, 49, 255);
}

.taifeng {
  background-image: url("../images/tf.png");
}
.taifeng.active {
  background-image: url("../images/tfs.png");
  color: rgb(0, 49, 255);
}

.atdt {
  padding-right: 10px;
  background-image: url("../images/sd.png");
  -webkit-background-size: auto 17px;
  background-size: auto 17px;
}

.conditionBox > ul > li.fenxi {
  background-image: url("../images/rh.png");
  width: 80px;
}

.leida {
  background-image: url("../images/ld.png");
}

.leida.active {
  background-image: url("../images/lds.png");
  color: rgb(0, 49, 255);
}

.weixing {
  background-image: url("../images/wx.png");
}
.weixing.active {
  background-image: url("../images/wxs.png");
  color: rgb(0, 49, 255);
}

.clear {
  clear: both;
}

.wrap_list {
  position: absolute;
  z-index: 600;
  z-index: 1000;
  top: 66px;
}

.wrap_mlist {
  right: 375px;
  display: none;
}

.wrap_flist {
  right: 469px;
}

.wrap_wlist {
  right: 555px;
}

.wrap_glist {
  right: 216px;
}

.menuList {
  margin-top: 5px;
  background-color: #fff;
  width: 85px;
  border-radius: 6px;
  box-shadow: 2px 2px 2px #aaa;
  overflow: hidden;
  padding-bottom: 6px;
}

.menuList li {
  width: 60px;
  background-image: url(../images/listIcon.png);
  padding-left: 20px;
  background-position: 6px 12px;
  font-size: 14px;
  height: 26px;
  line-height: 26px;
  cursor: pointer;
  background-repeat: no-repeat;
}

.menuList li.active {
  background-image: url(../images/listIcons.png);
  color: rgb(0, 49, 255);
}

```

(3) `app.js` 下加入控制子菜单展示的效果代码


```js
// 右上角工具
  // 图层工具事件处理
  $("#sk,#skmenu").hover(
    e => {
      $("#skmenu").show();
    },
    () => {
      $("#skmenu").hide();
    }
  );
  ```

最后的工具栏效果：

![tool.png](http://ww1.sinaimg.cn/large/940e68eegy1g6pspxtnm7j213i0f0myi.jpg)

工具栏点击，图标颜色变化见下边代码实现，混在一起了。开发学习的同学可以思考怎么提取出来。


### 实况气温图层展示

这里新增了多个代码文件，下边分别介绍文件的具体功能：

- `js/atdt.js` 闪电相关图层处理
- `js/colormap.js`
- `js/common.js`
- `js/echartslayer.js`
- `js/maphelper.js`
- `js/station-point.js`
- `libs/echarts.js`
- `libs/leaflet-velocity.js` 封装了风场图层的处理




## 跨域问题和解决方案

```
Access to XMLHttpRequest at 'http://data.cma.cn/dataGis/multiExhibition/autoStationNewTime' from origin 'http://localhost:8080' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```
![](http://ww1.sinaimg.cn/large/940e68eegy1g6ps5xpkabj22oq05eq4t.jpg)

跨域的解决方案很多，此demo我们是调用别人的系统，后端，服务器等不受我们控制，所以我们只能做的东西就是我们的开发环境而已了，webpack 能通过 `devServer` 的配置来设置代理，能模拟去请求解决跨域问题，详细见官网文档说明：[devserverproxy](https://webpack.js.org/configuration/dev-server/#devserverproxy).

demo 中的 `webpack.config.js` 代理配置修改如下:

```js
    // development server options
    devServer: {
      // Send API requests on localhost to API server get around CORS.
      proxy: {
        '/dataGis': {
          target: 'http://data.cma.cn/dataGis',
          pathRewrite: {'^/dataGis' : ''}
        }
      },
      contentBase: path.join(__dirname, "dist")
    }
```

配置好后，我们请求地址就可以写为 `http://localhost:8080` （本地启动服务的地址），原来的请求地址和代理后的对比 ：

原来的：
 ```bash
 http://data.cma.cn/dataGis/multiExhibition/autoStationNewTime
 ```

代理后的：

 ```bash
 http://localhost:8080/dataGis/multiExhibition/autoStationNewTime
 ```

 ![](http://ww1.sinaimg.cn/large/940e68eegy1g6ps5xs9ynj21lu10m47m.jpg)

