/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-6-8 18:42:21
 * @description: 气象数据综合展示平台，https://xiaozhuanlan.com/webgis
 */

// 自定义版权信息（简单的html字符串）
var mapAttr =
  'Map data &copy; <a href="https://xiaozhuanlan.com/webgis/">《小专栏：WebGIS入门实战》</a> contributors, ' +
  '<a href="http://giscafer.com/">giscafer</a>, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

// mapbox 地图服务URL
var mapboxUrl =
  'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

// 定义两个图层，影像图层和街道图层（这里是有了mapbox地图服务）
var satellite = L.tileLayer(mapboxUrl, {
  id: 'mapbox.satellite',
  attribution: mapAttr
});

var streets = L.tileLayer(mapboxUrl, {
  id: 'mapbox.streets',
  attribution: mapAttr
});
var map;

$(function () {
  $('#map').css('height', window.innerHeight + 'px');
  map = L.map('map', {
    center: [29.7, 119.3],
    zoom: 5,
    // 展示两个图层
    layers: [satellite, streets]
  });
})

// 通过layer control来实现图层切换UI
// https://leafletjs.com/examples/layers-control/
var baseLayers = {
  影像图: satellite,
  街道图: streets
};
L.control.layers(baseLayers).addTo(map);

