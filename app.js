/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-6-8 18:42:21
 * @description: 气象数据综合展示平台，https://xiaozhuanlan.com/webgis
 */

import { maphelper, BoxOverlay } from './js/leaflet.elaboration-fcst';
import { common } from './js/common.js';

$(function () {
  $('#map').css('height', window.innerHeight + 'px');
  // 初始化地图
  common.initMap();

  // 图层工具事件处理
  $('#mapSwitch,#mapSwitchTooltip').hover((e) => {
    $('#mapSwitchTooltip').show()
  }, () => {
    $('#mapSwitchTooltip').hide()
  });

  // 图层切换
  $("#mapSwitchTooltip span.text").click(e => {
    let target = e.target;
    let mapType = target.getAttribute('data-type');
    maphelper.switchMap(mapType);
    $('.img_' + mapType).attr("src", "./images/" + mapType + "_blue.png");
    $('span[data-type = "' + mapType + '"]').css("color", "#5c93ff");
    if (mapType === 'topographic') {
      $('.img_political').attr("src", "./images/political.png");
      $('.img_satellite').attr("src", "./images/satellite.png");
      $('span[data-type = "political"]').css("color", "#666666");
      $('span[data-type = "satellite"]').css("color", "#666666");
    } else if (mapType === 'satellite') {
      $('.img_political').attr("src", "./images/political.png");
      $('.img_topographic').attr("src", "./images/topographic.png");
      $('span[data-type = "political"]').css("color", "#666666");
      $('span[data-type = "topographic"]').css("color", "#666666");
    } else if (mapType === 'political') {
      $('.img_satellite').attr("src", "./images/satellite.png");
      $('.img_topographic').attr("src", "./images/topographic.png");
      $('span[data-type = "topographic"]').css("color", "#666666");
      $('span[data-type = "satellite"]').css("color", "#666666");
    }
  })
});

