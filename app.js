/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-6-8 18:42:21
 * @description: 气象数据综合展示平台，https://xiaozhuanlan.com/webgis
 */

import { maphelper, BoxOverlay } from './js/maphelper';
import { common } from './js/common.js';
import staPoint from './js/station-point';
import { getColorMap, getLegend } from './js/colormap';
import { windyshow } from './js/windflow/windutil';
import radarSata from './js/rada.js';
import timeline from './js/timeline.js';
import emgcy from './js/emgcy';
import typhoon, { playtyphooontimer } from './js/typhoon';

window.emgcy = emgcy;

let sktimeline = {};

$(function () {
  $('#map').css('height', window.innerHeight + 'px');
  // 初始化地图
  common.initMap();
  staPoint.getLastTime(globalParam.staid, 'Img', 1, 0);
  staPoint.initSKImg();
  radarSata.initRadarSata();
  staPoint.drawArea(80, 104, 36.5); //画一个范围占位
  staPoint.initStaEchart();
  // 图层工具事件处理
  $('#mapSwitch,#mapSwitchTooltip').hover(
    (e) => {
      $('#mapSwitchTooltip').show();
    },
    () => {
      $('#mapSwitchTooltip').hide();
    },
  );

  // 图层切换
  $('#mapSwitchTooltip span.text').click((e) => {
    let target = e.target;
    let mapType = target.getAttribute('data-type');
    maphelper.switchMap(mapType);
    $('.img_' + mapType).attr('src', './images/' + mapType + '_blue.png');
    $('span[data-type = "' + mapType + '"]').css('color', '#5c93ff');
    if (mapType === 'topographic') {
      $('.img_political').attr('src', './images/political.png');
      $('.img_satellite').attr('src', './images/satellite.png');
      $('span[data-type = "political"]').css('color', '#666666');
      $('span[data-type = "satellite"]').css('color', '#666666');
    } else if (mapType === 'satellite') {
      $('.img_political').attr('src', './images/political.png');
      $('.img_topographic').attr('src', './images/topographic.png');
      $('span[data-type = "political"]').css('color', '#666666');
      $('span[data-type = "topographic"]').css('color', '#666666');
    } else if (mapType === 'political') {
      $('.img_satellite').attr('src', './images/satellite.png');
      $('.img_topographic').attr('src', './images/topographic.png');
      $('span[data-type = "topographic"]').css('color', '#666666');
      $('span[data-type = "satellite"]').css('color', '#666666');
    }
  });

  // 默认12小时预警
  $('.wtimesList #12h').click();
});

//预警3h、6h、12h、24h切换事件
$('.wtimesList li').on('click', function () {
  if (!$(this).hasClass('wsel')) {
    globalParam.warningChecked = true;
    $('.wtimesList li').removeClass('wsel');
    $(this).addClass('wsel');
    $('.wtimesList').addClass('off');
    $('#warning').addClass('sel');
    $('.lgd_warning').show();
    $('#warning').attr(
      'style',
      "background-image: url('" +
        ctxStatic +
        "/ultra/img/gis/yjs.png'); color: rgb(0, 49, 255);",
    );
    common.clearMarkers(emgcy.warningMarker);
    var hour = -parseInt($(this).attr('id'));
    globalParam.warningHour = hour;
    //$(".lgd_warning").show();
    emgcy.getWarningDataCount(hour, globalParam.provinceFocusId);
    emgcy.getWarningData2(hour, globalParam.provinceFocusId);
    if (globalParam.tuliFlag) {
      if ($('.tuli').hasClass('lgd_hide')) {
        $('.legend').show();
        $('.tuli').removeClass('lgd_hide');
        $('.tuli').addClass('lgd_show');
      } else {
        $('.legend').show();
      }
    }
  } else {
    globalParam.warningChecked = false;
    $(this).removeClass('wsel');
    var wlseArray = $('.wsel');
    if (wlseArray.length == 0) {
      $('#warning').removeClass('sel');
      $('#warning').attr('style', '');
      $('.wtimesList').addClass('off');
    }
    common.clearMarkers(emgcy.warningMarker);
    $('.lgd_warning').hide();
    if (globalParam.tuliFlag) {
      //如果没有要素被选中  图例隐藏
      var lis = $('.legend li');
      var lgdflag = false;
      for (var i = 0; i < lis.length; i++) {
        if (lis.eq(i).css('display') !== 'none') {
          lgdflag = true;
        }
      }
      if (!lgdflag) {
        $('.legend').hide();
        /*$(".tuli").removeClass("lgd_show");
                  $(".tuli").addClass("lgd_hide");*/
      }
    }
  }
});

//实况气温、气压、湿度、风、降水切换处理逻辑
$('.menuList li').on('click', function () {
  if (!$(this).hasClass('lsel')) {
    globalParam.skChecked = true;
    //begin
    sktimeline.selType = 'sk';
    sktimeline.dataMap = {};

    sktimeline.times = staPoint.datetime;
    //end

    globalParam.skId = $(this).attr('id');
    $('.menuList li').removeClass('active');
    $(this).addClass('active');

    staPoint.clearEchartPoint();
    $('.menu2').hide();
    if ($('#fcst').hasClass('sel')) {
      $('#fcst').removeClass('sel');
      $('#fcst').attr('style', '');
      $('.fcstList li').removeClass('active');
      $('.lgd_fcst').hide();
    }

    globalParam.staid = $(this).attr('id');
    function clickShow() {
      $('.typhoonBox').show(); //排名显示
      $('.zhezhao').hide(); //遮罩隐藏
      $('.stationBox').hide();
      $('.loadding1').show();
      $('.loadding2').show();
      $('#me_lineGraph').empty();
      $('#me_timeCompare').empty();
      staPoint.currPoint = null;
      $('.typhoonBox').show();
    }

    if (globalParam.staid == '115990101') {
      //气温
      //$(".skright").css("display","block");
      $('.typhoonBox').show();
      $('.zhezhao').hide(); //遮罩隐藏
      clickShow();
    } else if (globalParam.staid == '115990103') {
      //相对湿度
      //				$(".typhoonBox").show();
      //				$(".zhezhao").hide();//遮罩隐藏
      clickShow();
    } else if (globalParam.staid == '1150101020') {
      //降水

      clickShow();
    } else if (globalParam.staid == '115990102') {
      //气压

      clickShow();
      // document.getElementById("rainFalls").style.display = "none";
      // document.getElementById("windBig").style.display = "none";
    } else if (globalParam.staid == '115990104') {
      //风
      clickShow();
    }

    globalParam.staid = $(this).attr('id');
    if (globalParam.staid === '115990104') {
      getLegend(globalParam.staid, 'Gis', 2);
      staPoint.getLastTime(globalParam.staid, 'JSON_CHN', 1, 0);
      windyshow(globalParam.staid, staPoint.datetime);
    } else {
      staPoint.getLastTime(globalParam.staid, 'Img', 1, 0);
      getColorMap(staPoint.productCode, staPoint.datetime);
      getLegend(globalParam.staid, 'Gis', 2);
      $('.lgd_sk').show();

      if (globalParam.clickFlag) {
        if (globalParam.clickFlag) {
          //有80km范围

          staPoint.clearEchartPoint();
          staPoint.getAreaSta(
            globalParam.skId,
            globalParam.lngOf80km,
            globalParam.latOf80km,
            staPoint.datetime,
            true,
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
            station.lev,
          );
        }
      } else {
        if ($('.staBtn').hasClass('staChecked')) {
          if (staPoint.bcircle != null) {
            staPoint.clearArea();
          }
          $('.skright').hide();
          if (globalParam.provinceFocus) {
            staPoint.getPoint2(
              globalParam.staid,
              staPoint.datetime,
              globalParam.provinceFocusId,
              '1',
            );
          } else {
            staPoint.getPoint2(globalParam.staid, staPoint.datetime, '1000');
          }
        }
      }
    }

    globalParam.elename = $(this).text();
    globalParam.unit = $(this).attr('unit');
    $('.me_eleName').text(globalParam.elename + '(' + globalParam.unit + ')');
    $('.menuList').addClass('off');
    $('.staPointDiv').show();
    $('.staPointDiv').prev().show();
    $('.sebanDiv').show();
    $('.sebanDiv').prev().show();
    $('#sk').addClass('sel');
    $('.stationBox').hide();
    $('#sk').addClass('active');

    if (globalParam.tuliFlag) {
      $('.legend').show();
      if ($('.tuli').hasClass('lgd_hide')) {
        $('.legend').show();
        $('.tuli').removeClass('lgd_hide');
        $('.tuli').addClass('lgd_show');
      } else {
        $('.legend').show();
      }
    }
  } else {
    globalParam.skChecked = false;
    //移除图片
    staPoint.img.changeUrl('./images/me_noProduct.png', 0);
    //移除站点
    staPoint.clearEchartPoint();
    // removewind();
    $('.stationBox').hide();
    var lseArray = $('.lsel');
    if (lseArray.length == 0) {
      $('#sk').removeClass('sel');
      $('#sk').removeClass('active');
      $('.menuList').addClass('off');
    }
    //重新初始化要素
    globalParam.staid = '115990101';
    globalParam.elename = '气温';
    globalParam.unit = '℃';
  }
});

$('#fcst,#atdt').click(function () {
  alert('未实现！');
});

// 雷达
$('#radar,#sata').on('click', function () {
  $('#satellite').click(); //底图切换为卫星图
  radarSata.sata = true;
  radarSata.radar = false;
  radarSata.sateimgLayer.changeUrl(
    ctxStatic + '/ultra/img/gis/me_noProduct.png',
    0,
  );
  // grid.removeRadar();
  $('#radar').removeClass('sel');
  $(this).toggleClass('active');
  $('#radar').attr('style', '');
  timeline.pause();
  $('#playBtn').removeClass('paush');
  $('#playBtn').addClass('play');
  //此处先执行上面三步操作，然后在使radarSata.sataDataIndex=0;
  radarSata.sataDataIndex = 0;
  radarSata.getSataImgTop10();
  $('.lgd_radar').hide();
  $('.lgd_sata').show();
  $('.timeName').show();
  $('.playBox').removeClass('off');

  $('#playBtn').addClass('play');
  //此处改为第一次点击卫星时卫星云图自动开始播放
  //此处改为第一次点击卫星时卫星云图自动开始播放
  if ($('#playBtn').hasClass('play')) {
    timeline.startPage(800);
    if (timeline.sataDataIndex == 1) {
      $('.jindu li').attr('class', '');
      $('.jindu li').html('');
      $('#0').addClass('psel');
      $('#0').html("<img src='" + ctxStatic + "/ultra/img/gis/psel.png'/>");
      $('.lgd_sata').empty();
    }
    $('#playBtn').removeClass('play');
    $('#playBtn').addClass('paush');
  } else {
    timeline.pause();
    $('#playBtn').removeClass('paush');
    $('#playBtn').addClass('play');
  }
});
// 台风
$('#typhoon').on('click', function () {
  $(this).toggleClass('active');

  if ($(this).hasClass('active')) {
    $('.lgd_tf').show();
    $('.tList').show();
    $('#typhoonTitle').show();
    typhoon.initTyphoon();
  } else {
    if (
      globalParam.intervalInt != undefined &&
      globalParam.intervalInt != null
    ) {
      window.clearInterval(globalParam.intervalInt);
    }
    if (playtyphooontimer != undefined && playtyphooontimer != null) {
      window.clearInterval(playtyphooontimer);
    }
    maphelper.map.closePopup(globalParam.typhoonPopup);
    $('.lgd_tf').hide();
    var divs = $('.typhoonInfo');
    $('.tList').empty();
    $('.tList').hide();
    $('#typhoonTitle').hide();
    if (divs.length > 0) {
      for (var i = 0; i < divs.length; i++) {
        var typhoonno = divs.eq(i).attr('id');
        TyphoonHelper.removeTyphoon(typhoonno);
        typhoonNameIconMap[typhoonno].remove();
        typhoonTimeIconMap[typhoonno].remove();
      }
    }
    $('.dg-Defail tbody').empty();
    $('.typhoondefail .ranking_head').empty();
    $('.typhoonright').hide();
  }
});
// 鼠标样式交互
// 图层工具事件处理
$('#sk,#skmenu').hover(
  (e) => {
    $('#skmenu').show();
  },
  () => {
    $('#skmenu').hide();
  },
);
$('#sk,#warning,#analyse,#fcst').on({
  mouseover: function () {
    var id = $(this).attr('id');
    if (id === 'sk') {
      $('.menuList').removeClass('off');
      $('.menuList').addClass('on');
    } else if (id === 'warning') {
      $('.wtimesList').removeClass('off');
      $('.wtimesList').addClass('on');
    } else if (id === 'analyse') {
      $('.gridList').removeClass('off');
      $('.gridList').addClass('on');
    } else if (id === 'fcst') {
      $('.fcstList').removeClass('off');
      $('.fcstList').addClass('on');
    }
  },
  mouseout: function () {
    var id = $(this).attr('id');
    if (id === 'sk') {
      $('.menuList').removeClass('on');
      $('.menuList').addClass('off');
    } else if (id === 'warning') {
      $('.wtimesList').removeClass('on');
      $('.wtimesList').addClass('off');
    } else if (id === 'analyse') {
      $('.gridList').removeClass('on');
      $('.gridList').addClass('off');
    } else if (id === 'fcst') {
      $('.fcstList').removeClass('on');
      $('.fcstList').addClass('off');
    }
  },
});

$('.wrap_list').on({
  mouseover: function () {
    $(this).find('div').removeClass('off');
    $(this).find('div').addClass('on');
  },
});
$('.menuList,.wtimesList,.gridList,.fcstList').on({
  mouseover: function () {
    $(this).removeClass('off');
    $(this).addClass('on');
  },
  mouseout: function () {
    $(this).removeClass('on');
    $(this).addClass('off');
  },
});

$('.menuList,.wtimesList,.gridList,.fcstList').on({
  mouseover: function () {
    $(this).removeClass('off');
    $(this).addClass('on');
  },
  mouseout: function () {
    $(this).removeClass('on');
    $(this).addClass('off');
  },
});
