import staPoint from "../station-point";
import { maphelper } from "../maphelper";

let velocityLayer;
export function windyshow(funitemmenuid, dateTime, province, typeCode) {
  // http://localhost:8181/webGis/img/receiveJson?timeScope=20181113160000&dataCode=NAFP_CLDAS2.0_RT_CHN_WIN_JSON
  // multiExhibition/autoStationNewTime?funItemMenuId=115990104&position=JSON&isDefault=1&timeDifference=0
  // /dataGis/multiExhibition/autoStationNewTime?funItemMenuId=115990104&position=JSON_CHN&isDefault=1&timeDifference=0
  // /dataGis/gis/getJson?funItemMenuId=115990104&dateTime=20181114170000&position=JSON_CHN

  var url =
    ctx +
    "/gis/getJson?funItemMenuId=115990104&dateTime=" +
    dateTime +
    "&position=JSON_CHN";
  removewind();
  formateWind(url);
}

// load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)
export function getColorFunction(legends) {
  var list = legends.list;
  var scale = [];
  var color = [];
  var data = [];

  list.forEach(function(item, index) {
    if (index == 0) {
      scale.push(0);
      var color1 = item.color;
      color1 = color1.colorRgb();
      data.push([0, color1]);
    }
    var name = +item.name;
    scale.push(+name);
    var color1 = item.color;
    color1 = color1.colorRgb();
    data.push([+name, color1]);
  });

  var color2 = segmentedColorScale(data);

  return function(value) {
    return color2(value, 180);
  };
}

String.prototype.colorRgb = function() {
  var sColor = this.toLowerCase();
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for (var i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    // sColorChange.push(255);
    return sColorChange;
  }
  return sColor;
};

export function segmentedColorScale(segments) {
  var points = [],
    interpolators = [],
    ranges = [];
  for (var i = 0; i < segments.length - 1; i++) {
    points.push(segments[i + 1][0]);
    interpolators.push(colorInterpolator(segments[i][1], segments[i + 1][1]));
    ranges.push([segments[i][0], segments[i + 1][0]]);
  }

  function colorInterpolator(start, end) {
    var r = start[0],
      g = start[1],
      b = start[2];
    var Δr = end[0] - r,
      Δg = end[1] - g,
      Δb = end[2] - b;
    return function(i, a) {
      return [
        Math.floor(r + i * Δr),
        Math.floor(g + i * Δg),
        Math.floor(b + i * Δb),
        a
      ];
    };
  }

  function clamp(x, low, high) {
    return Math.max(low, Math.min(x, high));
  }

  function proportion(x, low, high) {
    return (clamp(x, low, high) - low) / (high - low);
  }

  return function(point, alpha) {
    var i;
    for (i = 0; i < points.length - 1; i++) {
      if (point <= points[i]) {
        break;
      }
    }
    var range = ranges[i];
    return interpolators[i](proportion(point, range[0], range[1]), alpha);
  };
}

export function formateWind(url) {
  $.ajax({
    //	        url : "http://image.data.cma.cn/test20180906/json2.json",
    url: url,
    // 		    url:ctxStatic+'/ultra/js/gis2/wind-global.json',
    type: "get",
    dataType: "json",
    // dataType: 'jsonp',
    // jsonp:'callback',
    // jsonpCallback:"mytest",
    success: function(data) {
      // data = (new Function(){})

      if (data && data.DS && data.DS.content) {
        data = new Function("return " + data.DS.content)();
      } else {
        return;
      }

      $.ajax({
        url:
          ctx +
          "/multiExhibition/getLegend?funItemMenuId=115990104&position=Gis",
        type: "get",
        dataType: "json",
        success: function(result) {
          var getColor = function(value) {
            return "";
          };
          // data = jQuery.parseJSON(data);
          velocityLayer = L.velocityLayer({
            displayValues: true,
            colorScalar: getColor,
            displayOptions: {
              velocityType: "Wind",
              displayPosition: "bottomleft",
              displayEmptyString: "No wind data"
            },
            data: data,
            // maxVelocity: 16, //粒子的最大速度
            velocityScale: 0.02, //风速的尺度  || 粒子尾巴长度
            particleAge: 40, //一个粒子在再生前绘制的最大帧数
            lineWidth: 1, //线条宽度
            particleMultiplier: 1 / 800, //粒子密度
            frameRate: 18, //每秒所需帧数
            colorScale: [
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff",
              "#fff"
            ]
          });
          maphelper.map.addLayer(velocityLayer);
        }
      });
    }
  });
}

export function removewind() {
  if (velocityLayer != null && typeof velocityLayer != "undefined") {
    maphelper.map.removeLayer(velocityLayer);
  }
  if (staPoint.img) {
    staPoint.img.changeUrl(ctx + "/ultra/img/gis/me_noProduct.png", 0);
  }
}
