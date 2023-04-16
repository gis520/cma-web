/**
 * 应急、预警、灾情js
 */
import { common } from './common.js';
import { maphelper } from './maphelper';
var emgcy = emgcy || {};
emgcy.arrWarning = [];
emgcy.warningMarker = [];
emgcy.disasterMarker = [];
/**
 * 查询某个站是否有预警
 */
emgcy.getWarningCountyData = function (provinceCode, codeType, Cnty) {
  var myDate = new Date();
  var edate = myDate.format('yyyy-MM-dd HH') + ':59:59';
  myDate.setHours(myDate.getHours() - 24);
  var sdate = myDate.format('yyyy-MM-dd HH') + ':00:00';
  var specialType = common.zoomToSpecialType(maphelper.map.getZoom());
  var url = ctx + '/disasterWarning/getWarningDataByCnty';
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      startTime: sdate,
      endTime: edate,
      codeType: codeType,
      provinceCode: provinceCode,
      SpecialType: '2',
    },
    success: function (result) {
      emgcy.arrWarning = [];
      if (Cnty != '' && Cnty != undefined) {
        if (result.length > 0) {
          $.each(result, function (i, n) {
            var name = n.name;
            if (name.indexOf(Cnty) > -1) {
              var dateTime = n.time;
              var date = new Date(dateTime);
              var time = result[i].time;
              var date = new Date(time);
              var dateStr = date.format('yyyyMMddHH');
              n.time = dateStr + '0000';
              emgcy.arrWarning.push(n);
            }
          });
        }
      }
    },
  });
};

/**
 * 预警数据
 */
emgcy.getWarningDataCount = function (hour, provinceCode) {
  var myDate = new Date();
  var requestTime =
    myDate.getFullYear() +
    '年' +
    (myDate.getMonth() + 1) +
    '月' +
    myDate.getDate() +
    '日' +
    myDate.getHours() +
    '时' +
    myDate.getMinutes() +
    '分';
  var edate = myDate.format('yyyy-MM-dd HH') + ':59:59';
  var time = myDate.format('yyyy-MM-dd HH') + '时';
  myDate.setHours(myDate.getHours() + hour);
  var sdate = myDate.format('yyyy-MM-dd HH') + ':00:00';
  var specialType = common.zoomToSpecialType(maphelper.map.getZoom());
  var url = ctx + '/disasterWarning/getWarningDataByCnty';
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    async: true,
    data: {
      startTime: sdate,
      endTime: edate,
      codeType: '',
      provinceCode: '',
      SpecialType: '0%2C1',
    },
    success: function (result) {
      var length = result.length;
      if (length > 0) {
        //按预警类型统计预警个数
        var count = {};
        for (var i = 0; i < common.existWarningType.length; i++) {
          count[common.existWarningType[i]] = [];
          var cnt1 = 0;
          var cnt2 = 0;
          var cnt3 = 0;
          var cnt4 = 0;
          for (var j = 0; j < length; j++) {
            if (result[j].signaltypecode == common.existWarningType[i]) {
              if (result[j].signallevelcode == 'RED') {
                cnt1++;
              } else if (result[j].signallevelcode == 'ORANGE') {
                cnt2++;
              } else if (result[j].signallevelcode == 'YELLOW') {
                cnt3++;
              } else if (result[j].signallevelcode == 'BLUE') {
                cnt4++;
              }
            }
          }
          count[common.existWarningType[i]].push(cnt1);
          count[common.existWarningType[i]].push(cnt2);
          count[common.existWarningType[i]].push(cnt3);
          count[common.existWarningType[i]].push(cnt4);
        }
        //拼接预警图例
        var strHtml =
          "<div class='lgd_top'><span class='lgd_name'>预警信号(" +
          Math.abs(hour) +
          "H)</span><span class='lgd_time'  >" +
          requestTime +
          "</span></div><div class='lgd_bottom'>";
        for (var i = 0; i < common.existWarningType.length; i++) {
          var arrType = count[common.existWarningType[i]];
          for (var j = 0; j < arrType.length; j++) {
            if (arrType[j] != 0) {
              if (j == 0) {
                var color = 'RED';
              } else if (j == 1) {
                var color = 'ORANGE';
              } else if (j == 2) {
                var color = 'YELLOW';
              } else {
                var color = 'BLUE';
              }
              var a = common.existWarningType[i] + '_' + color;
              strHtml +=
                "<div class='warnIcon'><img width='36' height='28' src='" +
                ctxStatic +
                '/ultra/img/gis/disasterWarning/' +
                common.existWarningType[i] +
                '_' +
                color +
                ".png?v=1'  id='" +
                common.existWarningType[i] +
                '_' +
                color +
                "' /><span class='count'>" +
                arrType[j] +
                '</span></div>';
            }
          }
        }
        strHtml += '</div>';
        $('.lgd_warning').empty();
        $('.lgd_warning').show();
        $('.lgd_warning').append(strHtml);

        $('.lgd_warning img').bind('mouseovoer', function () {
          $(this).css('cursor', 'pointer');
        });
        $('.lgd_warning img').bind('mouseout', function () {
          $(this).css('cursor', 'pointer');
        });
        $('.lgd_warning img').bind('click', function () {
          var id = $(this).attr('id');
          var index = id.indexOf('_');
          var str1 = id.substr(0, index);
          var str2 = id.substr(index + 1, id.length);
          if (!$(this).hasClass('gray')) {
            $(this).addClass('gray');
            var array = common.warningTypeDisabled[str1];
            if (array == undefined) {
              array = [str2];
              common.warningTypeDisabled[str1] = array;
            } else {
              array.push(str2);
              common.warningTypeDisabled[str1] = array;
            }
          } else {
            $(this).removeClass('gray');
            var a = common.warningTypeDisabled[str1];
            for (var i = 0; i < a.length; i++) {
              if (a[i] == str2) {
                a[i] = null;
              }
            }
            common.warningTypeDisabled[str1] = a;
          }

          common.clearMarkers(emgcy.warningMarker);
          hour = globalParam.warningHour;
          emgcy.getWarningData2(hour);
        });
      } else {
        //没有预警4
        $('.lgd_warning').hide();
        alert('当前无预警！');
      }
    },
  });
};

emgcy.getWarningData = function (hour, provinceCode) {
  var myDate = new Date();
  var requestTime =
    myDate.getFullYear() +
    '年' +
    (myDate.getMonth() + 1) +
    '月' +
    myDate.getDate() +
    '日' +
    myDate.getHours() +
    '时' +
    myDate.getMinutes() +
    '分';
  var edate = myDate.format('yyyy-MM-dd HH') + ':59:59';
  var time = myDate.format('yyyy-MM-dd HH') + '时';
  myDate.setHours(myDate.getHours() + hour);
  var sdate = myDate.format('yyyy-MM-dd HH') + ':00:00';
  var specialType = common.zoomToSpecialType(maphelper.map.getZoom());
  var url = ctx + '/disasterWarning/getWarningDataByCnty';
  if (
    provinceCode == null ||
    provinceCode == undefined ||
    provinceCode == '1000'
  ) {
    provinceCode = '';
  }
  if (specialType == '') {
    provinceCode = '';
  }
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    async: true,
    data: {
      startTime: sdate,
      endTime: edate,
      codeType: '',
      provinceCode: provinceCode,
      SpecialType: specialType,
    },
    success: function (result) {
      var length = result.length;
      if (length > 0) {
        //地图上描预警图标
        for (var i = 0; i < length; i++) {
          if (result[i].lon != '' && result[i].lat != '') {
            common.addWarnMarker(result[i], emgcy.warningMarker);
          }
        }
      } else {
        //没有预警
        //$(".lgd_warning").hide();
      }
    },
  });
  //发送SpecialType为"0%2C1"的请求，统计预警信号个数并拼接图例，保证其不随地图的放大或缩小变化。
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    async: true,
    data: {
      startTime: sdate,
      endTime: edate,
      codeType: '',
      provinceCode: '',
      SpecialType: '0%2C1',
    },
    success: function (result) {
      var length = result.length;
      if (length > 0) {
        //按预警类型统计预警个数
        var count = {};
        for (var i = 0; i < common.existWarningType.length; i++) {
          count[common.existWarningType[i]] = [];
          var cnt1 = 0,
            cnt2 = 0;
          (cnt3 = 0), (cnt4 = 0);
          for (var j = 0; j < length; j++) {
            if (result[j].signaltypecode == common.existWarningType[i]) {
              if (result[j].signallevelcode == 'RED') {
                cnt1++;
              } else if (result[j].signallevelcode == 'ORANGE') {
                cnt2++;
              } else if (result[j].signallevelcode == 'YELLOW') {
                cnt3++;
              } else if (result[j].signallevelcode == 'BLUE') {
                cnt4++;
              }
            }
          }
          count[common.existWarningType[i]].push(cnt1);
          count[common.existWarningType[i]].push(cnt2);
          count[common.existWarningType[i]].push(cnt3);
          count[common.existWarningType[i]].push(cnt4);
        }
        //拼接预警图例
        var strHtml =
          "<div class='lgd_top'><span class='lgd_name'>预警信号(" +
          Math.abs(hour) +
          "H)</span><span class='lgd_time'  >" +
          requestTime +
          "</span></div><div class='lgd_bottom'>";
        for (var i = 0; i < common.existWarningType.length; i++) {
          var arrType = count[common.existWarningType[i]];
          for (var j = 0; j < arrType.length; j++) {
            if (arrType[j] != 0) {
              if (j == 0) {
                var color = 'RED';
              } else if (j == 1) {
                var color = 'ORANGE';
              } else if (j == 2) {
                var color = 'YELLOW';
              } else {
                var color = 'BLUE';
              }
              var a = common.existWarningType[i] + '_' + color;
              strHtml +=
                "<div class='warnIcon'><img width='36' height='28' src='" +
                ctxStatic +
                '/ultra/img/gis/disasterWarning/' +
                common.existWarningType[i] +
                '_' +
                color +
                ".png?v=1'  id='" +
                common.existWarningType[i] +
                '_' +
                color +
                "' /><span class='count'>" +
                arrType[j] +
                '</span></div>';
            }
          }
        }
        strHtml += '</div>';
        $('.lgd_warning').empty();
        $('.lgd_warning').show();
        $('.lgd_warning').append(strHtml);

        $('.lgd_warning img').bind('mouseovoer', function () {
          $(this).css('cursor', 'pointer');
        });
        $('.lgd_warning img').bind('mouseout', function () {
          $(this).css('cursor', 'pointer');
        });
        $('.lgd_warning img').bind('click', function () {
          var id = $(this).attr('id');
          var index = id.indexOf('_');
          var str1 = id.substr(0, index);
          var str2 = id.substr(index + 1, id.length);
          if (!$(this).hasClass('gray')) {
            $(this).addClass('gray');
            var array = common.warningTypeDisabled[str1];
            if (array == undefined) {
              array = [str2];
              common.warningTypeDisabled[str1] = array;
            } else {
              array.push(str2);
              common.warningTypeDisabled[str1] = array;
            }
          } else {
            $(this).removeClass('gray');
            var a = common.warningTypeDisabled[str1];
            for (var i = 0; i < a.length; i++) {
              if (a[i] == str2) {
                a[i] = null;
              }
            }
            common.warningTypeDisabled[str1] = a;
          }

          common.clearMarkers(emgcy.warningMarker);
          hour = globalParam.warningHour;
          emgcy.getWarningData2(hour);
        });
      } else {
        //没有预警4
        $('.lgd_warning').hide();
        alert('当前无预警！');
      }
    },
  });
};

emgcy.getWarningData2 = function (hour, provinceCode) {
  var myDate = new Date();
  var requestTime =
    myDate.getFullYear() +
    '年' +
    (myDate.getMonth() + 1) +
    '月' +
    myDate.getDate() +
    '日' +
    myDate.getHours() +
    '时' +
    myDate.getMinutes() +
    '分';
  var edate = myDate.format('yyyy-MM-dd HH') + ':59:59';
  var time = myDate.format('yyyy-MM-dd HH') + '时';
  myDate.setHours(myDate.getHours() + hour);
  var sdate = myDate.format('yyyy-MM-dd HH') + ':00:00';
  var specialType = common.zoomToSpecialType(maphelper.map.getZoom());
  var url = ctx + '/disasterWarning/getWarningDataByCnty';
  if (
    provinceCode == null ||
    provinceCode == undefined ||
    provinceCode == '1000'
  ) {
    provinceCode = '';
  }
  if (specialType == '0%2C1') {
    provinceCode = '';
  }
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    async: true,
    data: {
      startTime: sdate,
      endTime: edate,
      codeType: '',
      provinceCode: '',
      SpecialType: specialType,
    },
    success: function (result) {
      var length = result.length;
      if (length > 0) {
        //地图上描预警图标
        for (var i = 0; i < length; i++) {
          if (result[i].lon != '' && result[i].lat != '') {
            if (globalParam.provinceFocus) {
              var provincecode2 = result[i].procincecode + '0000';
              if (provincecode2 == globalParam.provinceFocusId) {
                var a = result[i].signaltypecode;
                var b = result[i].signallevelcode;
                var flag = false;
                if (common.warningTypeDisabled != {}) {
                  for (var m in common.warningTypeDisabled) {
                    if (m == a) {
                      var c = common.warningTypeDisabled[m];
                      if (c != undefined) {
                        for (var n in c) {
                          var d = c[n];
                          if (d != undefined && d == b) {
                            flag = true;
                          }
                        }
                      }
                    }
                  }
                }
                if (!flag) {
                  common.addWarnMarker(result[i], emgcy.warningMarker);
                }
              }
            } else {
              var a = result[i].signaltypecode;
              var b = result[i].signallevelcode;
              var flag = false;
              if (common.warningTypeDisabled != {}) {
                for (var m in common.warningTypeDisabled) {
                  if (m == a) {
                    var c = common.warningTypeDisabled[m];
                    if (c != undefined) {
                      for (var n in c) {
                        var d = c[n];
                        if (d != undefined && d == b) {
                          flag = true;
                        }
                      }
                    }
                  }
                }
              }
              if (!flag) {
                common.addWarnMarker(result[i], emgcy.warningMarker);
              }
            }
          }
        }
      } else {
      }
    },
  });
};
emgcy.getWarningData3 = function (hour, provinceCode, sepcialType) {
  var myDate = new Date();
  var requestTime =
    myDate.getFullYear() +
    '年' +
    (myDate.getMonth() + 1) +
    '月' +
    myDate.getDate() +
    '日' +
    myDate.getHours() +
    '时' +
    myDate.getMinutes() +
    '分';
  var edate = myDate.format('yyyy-MM-dd HH') + ':59:59';
  var time = myDate.format('yyyy-MM-dd HH') + '时';
  myDate.setHours(myDate.getHours() + hour);
  var sdate = myDate.format('yyyy-MM-dd HH') + ':00:00';

  var allTypes = ['0', '0%2C1', '0%2C1%2C2'];

  if (sepcialType === undefined) {
    var cspecialType = allTypes[0];
  } else {
    var cspecialType = sepcialType;
  }

  var url = ctx + '/disasterWarning/getWarningDataByCnty';
  if (
    provinceCode == null ||
    provinceCode == undefined ||
    provinceCode == '1000'
  ) {
    provinceCode = '';
  }
  if (cspecialType === '0%2C1') {
    provinceCode = '';
  }
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    async: true,
    data: {
      startTime: sdate,
      endTime: edate,
      codeType: '',
      provinceCode: '',
      SpecialType: cspecialType,
    },
    success: function (result) {
      var length = result.length;
      if (length > 0) {
        //标记出需要偏移的点
        var areaIdAr = {};
        for (var i = 0; i < length; i++) {
          areaIdAr[result[i].areaId] =
            (areaIdAr[result[i].areaId] == undefined
              ? 0
              : areaIdAr[result[i].areaId]) + 1;
        }
        var areaIdArRu = {};
        for (var i = 0; i < length; i++) {
          areaIdArRu[result[i].areaId] =
            (areaIdArRu[result[i].areaId] == undefined
              ? 1
              : areaIdArRu[result[i].areaId]) + 1;
          if (areaIdArRu[result[i].areaId] == 1) {
            //不需要偏移
            result[i].isDev = 0;
            result[i].tranIndex = 1;
          } else {
            //需要偏移
            result[i].isDev = 1;
            result[i].tranIndex = areaIdArRu[result[i].areaId];
          }
        }
        //地图上描预警图标
        for (var i = 0; i < length; i++) {
          if (result[i].lon != '' && result[i].lat != '') {
            if (globalParam.provinceFocus) {
              var provincecode2 = result[i].procincecode + '0000';
              if (provincecode2 == globalParam.provinceFocusId) {
                var a = result[i].signaltypecode;
                var b = result[i].signallevelcode;
                var flag = false;
                if (common.warningTypeDisabled != {}) {
                  for (var m in common.warningTypeDisabled) {
                    if (m == a) {
                      var c = common.warningTypeDisabled[m];
                      if (c != undefined) {
                        for (var n in c) {
                          var d = c[n];
                          if (d != undefined && d == b) {
                            flag = true;
                          }
                        }
                      }
                    }
                  }
                }
                if (!flag) {
                  common.addWarnMarker(result[i], emgcy.warningMarker);
                }
              }
            } else {
              var a = result[i].signaltypecode;
              var b = result[i].signallevelcode;
              var flag = false;
              if (common.warningTypeDisabled != {}) {
                for (var m in common.warningTypeDisabled) {
                  if (m == a) {
                    var c = common.warningTypeDisabled[m];
                    if (c != undefined) {
                      for (var n in c) {
                        var d = c[n];
                        if (d != undefined && d == b) {
                          flag = true;
                        }
                      }
                    }
                  }
                }
              }
              if (!flag) {
                common.addWarnMarker(result[i], emgcy.warningMarker);
              }
            }
          }
        }
      } else {
        var index = allTypes.indexOf(cspecialType);
        if (index < 2) {
          emgcy.getWarningData3(hour, provinceCode, allTypes[index + 1]);
        }
      }
    },
  });
};

/**
 * 灾情数据
 */
emgcy.getDisasterData = function () {
  var myDate = new Date();
  var edate = myDate.format('yyyy-MM-dd HH') + ':59:59';
  var time = myDate.format('yyyy-MM-dd HH') + '时';
  myDate.setHours(myDate.getDay() - 1);
  var sdate = myDate.format('yyyy-MM-dd HH') + ':00:00';
  var specialType = common.zoomToSpecialType(maphelper.map.getZoom());
  var url = ctx + '/disasterWarning/getDisasterData';
  var provinceCode;
  if (
    globalParam.provinceFocusId == null ||
    globalParam.provinceFocusId == undefined ||
    globalParam.provinceFocusId == '1000'
  ) {
    provinceCode = '';
  } else {
    provinceCode = globalParam.provinceFocusId;
  }
  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    async: false,
    data: {
      startTime: sdate,
      endTime: edate,
      codeType: '',
      provinceCode: provinceCode,
    },
    success: function (result) {
      var length = result.length;
      if (length > 0) {
        for (var i = 0; i < length; i++) {
          if (result[i].lon != '' && result[i].lat != '') {
            common.addDisasterMarker(result[i], emgcy.disasterMarker);
          }
        }
        //按灾情类型统计预警个数
        var count = [];
        for (var i = 0; i < common.existDisasterType.length; i++) {
          var cnt = 0;
          for (var j = 0; j < length; j++) {
            if (result[j].MAINTYPE == common.existDisasterType[i]) {
              cnt++;
            }
          }
          count.push(cnt);
        }
        //拼接灾情图例
        var strHtml =
          "<div class='lgd_top'><span class='lgd_name'>灾情信号</span></div><div class='lgd_bottom'>";
        for (var i = 0; i < count.length; i++) {
          if (count[i] != 0) {
            strHtml +=
              "<div class='warnIcon'><img width='36' height='28' src='" +
              ctxStatic +
              '/ultra/img/gis/disasterWarning/' +
              common.existDisasterType[i] +
              ".png?v=1'/><span class='count'>" +
              count[i] +
              '</span></div>';
          }
        }
        strHtml += '</div>';
        $('.lgd_disaster').empty();
        $('.lgd_disaster').append(strHtml);
        $('.lgd_disaster').show();
      } else {
        //没有灾害
        $('.lgd_disaster').hide();
        if (provinceCode != '') {
          alert('当前省份无灾情！');
        } else {
          alert('当前无灾情！');
        }
      }
    },
  });
};

/*emgcy.getProviceEmergency=function(){
	$.ajax({
		url:ctx+'/emergencyNotice/emergencyInfo',
		type:'get',
		dataType:'json',
		success:function(result){
			var pList=result.pList;
			if(pList.length>0){
				for (var i = 0; i < pList.length; i++) {
					common.emergency(pList[i]);
				}
			}
		}
	});
}*/

emgcy.showWarningDetail = function () {
  $('.masker').show();
  $('.masker .stationDetail').hide();
  $('.masker .warningDetail').show();
  $('.warningDetail .closebtn').show();
  $('.masker .warning-iframe').attr(
    'src',
    ctx + '/gis/warningDetail?time=' + Date.now(),
  );
  $('.warningDetail .closebtn').unbind();
  $('.warningDetail .closebtn').click(function () {
    $('.stationDetail').hide();
    $('.masker').hide();
    $('.stationDetail').hide();
    $('.masker .warningDetail').hide();
    staPoint.currPoint = null;
  });
};

window.emgcy = emgcy;
export default emgcy;
