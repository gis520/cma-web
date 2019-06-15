/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-6-8 18:42:21
 * @description: 气象数据综合展示平台，https://xiaozhuanlan.com/webgis
 */

import { maphelper, BoxOverlay } from './js/leaflet.elaboration-fcst';
import { common } from './js/common.js';

// 自定义版权信息（简单的html字符串）
let mapAttr =
  'Map data &copy; <a href="https://xiaozhuanlan.com/webgis/">《小专栏：WebGIS入门实战》</a> contributors, ' +
  '<a href="http://giscafer.com/">giscafer</a>, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

// mapbox 地图服务URL
let mapboxUrl =
  'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

// 定义两个图层，影像图层和街道图层（这里是有了mapbox地图服务）
let satellite = L.tileLayer(mapboxUrl, {
  id: 'mapbox.satellite',
  attribution: mapAttr
});

let streets = L.tileLayer(mapboxUrl, {
  id: 'mapbox.streets',
  attribution: mapAttr
});
let map;


$(function () {
  $('#map').css('height', window.innerHeight + 'px');
  // 初始化地图
  common.initMap();
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
})

// 通过layer control来实现图层切换UI
// https://leafletjs.com/examples/layers-control/
/* let baseLayers = {
  影像图: satellite,
  街道图: streets
};
L.control.layers(baseLayers).addTo(map); */

