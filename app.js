/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-6-8 18:42:21
 * @description: 气象数据综合展示平台，https://xiaozhuanlan.com/webgis
 */

import { maphelper, BoxOverlay } from "./js/maphelper";
import { common } from "./js/common.js";
import staPoint from "./js/station-point";
import { getColorMap, getLegend } from "./js/colormap";
import { windyshow } from "./js/windflow/windutil";

let sktimeline = {};

$(function() {
  $("#map").css("height", window.innerHeight + "px");
  // 初始化地图
  common.initMap();
  staPoint.getLastTime(globalParam.staid, "Img", 1, 0);
  staPoint.initSKImg();
  // radarSata.initRadarSata();
  staPoint.drawArea(80, 104, 36.5); //画一个范围占位
  staPoint.initStaEchart();
  // 图层工具事件处理
  $("#mapSwitch,#mapSwitchTooltip").hover(
    e => {
      $("#mapSwitchTooltip").show();
    },
    () => {
      $("#mapSwitchTooltip").hide();
    }
  );

  // 图层切换
  $("#mapSwitchTooltip span.text").click(e => {
    let target = e.target;
    let mapType = target.getAttribute("data-type");
    maphelper.switchMap(mapType);
    $(".img_" + mapType).attr("src", "./images/" + mapType + "_blue.png");
    $('span[data-type = "' + mapType + '"]').css("color", "#5c93ff");
    if (mapType === "topographic") {
      $(".img_political").attr("src", "./images/political.png");
      $(".img_satellite").attr("src", "./images/satellite.png");
      $('span[data-type = "political"]').css("color", "#666666");
      $('span[data-type = "satellite"]').css("color", "#666666");
    } else if (mapType === "satellite") {
      $(".img_political").attr("src", "./images/political.png");
      $(".img_topographic").attr("src", "./images/topographic.png");
      $('span[data-type = "political"]').css("color", "#666666");
      $('span[data-type = "topographic"]').css("color", "#666666");
    } else if (mapType === "political") {
      $(".img_satellite").attr("src", "./images/satellite.png");
      $(".img_topographic").attr("src", "./images/topographic.png");
      $('span[data-type = "topographic"]').css("color", "#666666");
      $('span[data-type = "satellite"]').css("color", "#666666");
    }
  });

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
});

//实况气温、气压、湿度、风、降水切换处理逻辑
$(".menuList li").on("click", function() {
  if (!$(this).hasClass("lsel")) {
    globalParam.skChecked = true;
    //begin
    sktimeline.selType = "sk";
    sktimeline.dataMap = {};

    sktimeline.times = staPoint.datetime;
    //end

    globalParam.skId = $(this).attr("id");
    $(".menuList li").removeClass("active");
    $(this).addClass("active");

    staPoint.clearEchartPoint();
    $(".menu2").hide();
    if ($("#fcst").hasClass("sel")) {
      $("#fcst").removeClass("sel");
      $("#fcst").attr("style", "");
      $(".fcstList li").removeClass("active");
      $(".lgd_fcst").hide();
    }

    globalParam.staid = $(this).attr("id");
    function clickShow() {
      $(".typhoonBox").show(); //排名显示
      $(".zhezhao").hide(); //遮罩隐藏
      $(".stationBox").hide();
      $(".loadding1").show();
      $(".loadding2").show();
      $("#me_lineGraph").empty();
      $("#me_timeCompare").empty();
      staPoint.currPoint = null;
      $(".typhoonBox").show();
    }

    if (globalParam.staid == "115990101") {
      //气温
      //$(".skright").css("display","block");
      $(".typhoonBox").show();
      $(".zhezhao").hide(); //遮罩隐藏
      clickShow();
    } else if (globalParam.staid == "115990103") {
      //相对湿度
      //				$(".typhoonBox").show();
      //				$(".zhezhao").hide();//遮罩隐藏
      clickShow();
    } else if (globalParam.staid == "1150101020") {
      //降水

      clickShow();
    } else if (globalParam.staid == "115990102") {
      //气压

      clickShow();
      // document.getElementById("rainFalls").style.display = "none";
      // document.getElementById("windBig").style.display = "none";
    } else if (globalParam.staid == "115990104") {
      //风
      clickShow();
    }

    globalParam.staid = $(this).attr("id");
    if (globalParam.staid === "115990104") {
      getLegend(globalParam.staid, "Gis", 2);
      staPoint.getLastTime(globalParam.staid, "JSON_CHN", 1, 0);
      windyshow(globalParam.staid, staPoint.datetime);
    } else {
      staPoint.getLastTime(globalParam.staid, "Img", 1, 0);
      getColorMap(staPoint.productCode, staPoint.datetime);
      getLegend(globalParam.staid, "Gis", 2);
      $(".lgd_sk").show();

      if (globalParam.clickFlag) {
        if (globalParam.clickFlag) {
          //有80km范围

          staPoint.clearEchartPoint();
          staPoint.getAreaSta(
            globalParam.skId,
            globalParam.lngOf80km,
            globalParam.latOf80km,
            staPoint.datetime,
            true
          );
        }
        if (staPoint.currPoint != null) {
          var station = staPoint.currPoint;
          staPoint.getStationDetail(
            globalParam.staid,
            station.staId,
            station.staName,
            station.lon,
            station.lat,
            station.lev
          );
        }
      } else {
        if ($(".staBtn").hasClass("staChecked")) {
          if (staPoint.bcircle != null) {
            staPoint.clearArea();
          }
          $(".skright").hide();
          if (globalParam.provinceFocus) {
            staPoint.getPoint2(
              globalParam.staid,
              staPoint.datetime,
              globalParam.provinceFocusId,
              "1"
            );
          } else {
            staPoint.getPoint2(globalParam.staid, staPoint.datetime, "1000");
          }
        }
      }
    }

    globalParam.elename = $(this).text();
    globalParam.unit = $(this).attr("unit");
    $(".me_eleName").text(globalParam.elename + "(" + globalParam.unit + ")");
    $(".menuList").addClass("off");
    $(".staPointDiv").show();
    $(".staPointDiv")
      .prev()
      .show();
    $(".sebanDiv").show();
    $(".sebanDiv")
      .prev()
      .show();
    $("#sk").addClass("sel");
    $(".stationBox").hide();
    $("#sk").addClass("active");

    if (globalParam.tuliFlag) {
      $(".legend").show();
      if ($(".tuli").hasClass("lgd_hide")) {
        $(".legend").show();
        $(".tuli").removeClass("lgd_hide");
        $(".tuli").addClass("lgd_show");
      } else {
        $(".legend").show();
      }
    }
  } else {
    globalParam.skChecked = false;
    //移除图片
    staPoint.img.changeUrl("./images/me_noProduct.png", 0);
    //移除站点
    staPoint.clearEchartPoint();
    // removewind();
    $(".stationBox").hide();
    var lseArray = $(".lsel");
    if (lseArray.length == 0) {
      $("#sk").removeClass("sel");
      $("#sk").removeClass("active");
      $(".menuList").addClass("off");
    }
    //重新初始化要素
    globalParam.staid = "115990101";
    globalParam.elename = "气温";
    globalParam.unit = "℃";
  }
});
