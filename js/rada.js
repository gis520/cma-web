/**
 * 卫星雷达js
 */

import { maphelper } from './maphelper';

let radarSata = radarSata || {};
radarSata.sataData = null;
radarSata.sata = null;
radarSata.radar = null;

radarSata.initRadarSata = function () {
  radarSata.sateimgLayer = maphelper.addImage(
    ctxStatic + '/ultras/img/me_noProduct.png',
    50,
    0,
    145,
    60,
    1,
  ); //卫星图片
};

/**
 * 得到卫星图片
 */
radarSata.getSataImgTop10 = function () {
  $.ajax({
    url: ctx + '/gis/getSata',
    data: { dataCode: 'SATE_GEO_RAW_ACC_F2G_F2E_MCT_PNG' },
    type: 'get',
    dataType: 'json',
    success: function (result) {
      radarSata.sataData = result.DS;
      if (radarSata.sataData != undefined && radarSata.sataData.length > 0) {
        radarSata.sataData.forEach(function (item) {
          preloadImage(item.url);
        });
        $('.playDiv').show();
        var length = radarSata.sataData.length;
        timeline.sataDataIndex = length;
        $('.timeName').html(
          radarSata.sataData[timeline.sataDataIndex - 1].dateTime,
        );
        if (radarSata.sateimgLayer) {
          radarSata.sateimgLayer.changeUrl(
            radarSata.sataData[timeline.sataDataIndex - 1].url,
            1,
          );
        } else {
          radarSata.sateimgLayer = maphelper.addImage(
            radarSata.sataData[timeline.sataDataIndex - 1].url,
            50,
            0,
            145,
            60,
            1,
          );
        }
        timeline.initPalay(radarSata.changeByTime, radarSata.sataData);
      } else {
        $('.playDiv').hide();
        alert('暂无卫星图片');
      }
    },
  });
};
function preloadImage(url) {
  var image = new Image();
  image.onload = function () {
    console.log('preload');
  };
  image.src = url;
}
/**
 * 获取雷达色斑图
 */
radarSata.getRadarImg = function () {
  $.ajax({
    url: ctx + '/gis/getRada',
    type: 'get',
    data: { dataCode: 'RADA_L3_MST_REF_GRID_MCT_PNG' },
    dataType: 'json',
    success: function (result) {
      radarSata.sataData = result.DS;
      if (radarSata.sataData != undefined && radarSata.sataData.length > 0) {
        $('.playDiv').show();
        var length = radarSata.sataData.length;
        timeline.sataDataIndex = length;
        $('.timeName').html(
          radarSata.sataData[timeline.sataDataIndex - 1].dateTime,
        );
        if (radarSata.radarimgLayer) {
          radarSata.radarimgLayer.changeUrl(
            radarSata.sataData[timeline.sataDataIndex - 1].url,
            0.8,
          );
        } else {
          radarSata.radarimgLayer = maphelper.addImage(
            radarSata.sataData[timeline.sataDataIndex - 1].url,
            73,
            13.5,
            135.5,
            53.5,
            0,
          );
        }
        timeline.initPalay(radarSata.changeByTime, radarSata.sataData);
      }
    },
  });
};

/**
 * 获取雷达list
 */

radarSata.getRadarList = function () {
  var url = ctx + '/gis/getRada';
  $.ajax({
    url: url,
    type: 'get',
    data: { dataCode: 'RADA_L3_MST_REF_GRID_GEOJSON' },
    dataType: 'json',
    cache: false,
    success: function (result) {
      radarSata.sataData = result.DS;
      if (radarSata.sataData != undefined) {
        $('.playDiv').show();
        var length = radarSata.sataData.length;
        timeline.sataDataIndex = length;
        $('.timeName').html(
          radarSata.sataData[timeline.sataDataIndex - 1].dateTime,
        );
        $('.timeName2').html(
          radarSata.sataData[timeline.sataDataIndex - 1].dateTime,
        );
        grid.showRadar(radarSata.sataData[timeline.sataDataIndex - 1].url);
        timeline.initPalay(radarSata.changeByTime, radarSata.sataData);
      }
    },
  });
};

radarSata.changeByTime = function () {
  //	var oldLayer = radarLayer;
  if ($('#radar').hasClass('sel')) {
    grid.showRadar(radarSata.sataData[timeline.sataDataIndex - 1].url);
  } else {
    radarSata.sateimgLayer.changeUrl(
      radarSata.sataData[timeline.sataDataIndex - 1].url,
      0.8,
    );
  }
  if (radarSata.radar) {
    $('.lgd_radar > .lgd_top').html(
      "<span class='lgd_name'>雷达(基本反射率)</span><span class='lgd_time' >" +
        radarSata.sataData[timeline.sataDataIndex - 1].dateTime +
        '</span>',
    );
  } else if (radarSata.sata) {
    $('.lgd_sata > .lgd_top').html(
      "<span class='lgd_name'>卫星</span><span class='lgd_time' >" +
        radarSata.sataData[timeline.sataDataIndex - 1].dateTime +
        '</span>',
    );
  }

  /*$(".timeName").html((radarSata.sataData)[timeline.sataDataIndex-1].dateTime);	*/
  $('.timeName2').html(radarSata.sataData[timeline.sataDataIndex - 1].dateTime);
};
window.radarSata = radarSata;
export default radarSata;
