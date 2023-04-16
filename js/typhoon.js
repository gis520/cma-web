/**
 *关于台风的js
 */
import TyphoonHelper from './typhoonhelper';
var typhoon = typhoon || {};
var typhoonNameMap = typhoonNameMap || {}; //存放台风中英名称的对象
var typhoonDateMap = typhoonDateMap || {}; //存放当前预报位置时间
var typhoonListpageMap = typhoonListpageMap || {}; //存放多个台风路径分页信息
var typhoonListMap = typhoonListMap || {}; // 不分页直接存储台风信息
var typhoonDetailTime = typhoonDetailTime || {};
var clickedTyphoonName = clickedTyphoonName || {};
var typhoonmaker = new Array();
var jsonListMap = {};
var typhoonStatus = 0;
var jsonbabj0datalist = new Array();
var jsonbabj0datalistMap = {};
var publisherlist = {
  BABJ: 1,
  PGTW: 0,
  RCTP: 0,
  RJTD: 0,
  VHHH: 0,
  RPMM: 0,
};

var emitter = new EventEmitter();
var tableName;
var initDrawIndex = 0;
var typhoonCountMap = { typhoonCount: 0 };

/**
 * 获得台风中英文对照信息
 */
typhoon.initTyphoonNameMap = function () {
  $.ajax({
    url: ctx + '/typhoon/getTyphoonInfo',
    type: 'get',
    dataType: 'json',
    ansy: false,
    success: function (result) {
      var list = result.list;
      if (list != undefined) {
        $.each(list, function (i, n) {
          typhoonNameMap[n.enName.toUpperCase()] = n.chnName;
        });
      }
    },
  });
};
/**
 * 该项目前准备用async库来进行流程控制
 *
 */

typhoon.initTyphoon = function () {
  TyphoonHelper.GerateAramLine();
  typhoon.initTyphoonNameMap();
  async.auto(
    {
      // "initLine": TyphoonHelper.GerateAramLine,
      // "initTyphoonNameMap": typhoon.initTyphoonNameMap,
      initTyphoonList: typhoon.getCurrentTyphoonList,
      showAllTyphoons: [
        'initTyphoonList',
        function (results, done) {
          // console.log(results)

          results['initTyphoonList'].forEach(function (item, index) {
            typhoonNameMap[item.enname.toUpperCase()] = item.name; //这东西不唯一，还不准
            typhoonNameMap[item.tfid + ''] = item.name;
            typhoon.initTyphoonPath(item);
          });
        },
      ],
    },
    function (error, results) {
      results = { func1: xxx, func2: xxx, func3: xxx };
    },
  );
};

/**
 * 获取所有台风列表，然后 typhoonNameMap中存储中英文名对照表
 * @param done
 */
typhoon.initTyphoonNameMap1 = function (done) {
  /**
   * 返回中英文名称列表的
   *   [{chnName:"达维",enName:"Damrey",isUsed:"0"},...]
   */
  $.ajax({
    url: ctx + '/typhoon/getTyphoonInfo',
    type: 'get',
    dataType: 'json',
    ansy: false,
    success: function (result) {
      var list = result.list;
      if (list != undefined) {
        $.each(list, function (i, n) {
          typhoonNameMap[n.enName.toUpperCase()] = n.chnName;
        });
      }
      return done(null, result);
    },
  });
};

/**
 * 获取当前的台风列表
 * @param done
 */
typhoon.getCurrentTyphoonList = function (done) {
  //{"list":[{"endtime":"2018/08/14 12:06:00","LAT":179.3000,"starttime":"2018/08/14 02:00:00","isactive":0,"tfid":1817,"LON":25.8000,"name":"赫克托","warnlevel":1,"enname":"HECTOR"},...]}
  $.ajax({
    url: ctx + '/typhoon/getTyphoonListCimiss',
    type: 'get',
    dataType: 'json',
    async: false,
    success: function (result) {
      if (result) {
        var initlist = result.list;
        if (initlist != undefined && initlist.length > 0) {
          // 以上是dom部分
          typhoon.activeTyphoonButton(initlist.length);
          done(null, initlist);
          //添加台风 添加点 添加表格
          // typhoon.getLastTyphoon();
        } else {
          typhoon.initTyphoonButton();
        }
      }
    },
  });
};

/**
 * 激活和关闭按钮
 */
typhoon.activeTyphoonButton = function (length) {
  // 只是通过列表选项内容来确定按钮是否会被选中
  var imgUrl = $('#typhoon').css('background-image');
  var index = imgUrl.lastIndexOf('.');
  var imgPath =
    imgUrl.substring(0, index) +
    's' +
    imgUrl.substring(index, imgUrl.length - 1);
  $('#typhoon').addClass('sel');
  $('#typhoon').css('background-image', imgPath);
  $('#typhoon').css('color', '#0031ff');
  $('.lgd_tf').show();
  $('.boxTitle').css('display', 'block');

  $('#ptDefailInfo').hide();
  $('.stat.typhoondefail').css('height', '336px');
  $('#count').html(length);
};

typhoon.initTyphoonButton = function () {
  // var imgUrl = $('#typhoon').css('background-image');
  // var index = imgUrl.lastIndexOf('.');
  // var imgPath =
  //   imgUrl.substring(0, index) +
  //   's' +
  //   imgUrl.substring(index, imgUrl.length - 1);
  $('#typhoon').addClass('sel');
  // $('#typhoon').css('background-image', imgPath);
  // $('#typhoon').css('color', '#0031ff');
  $('.typhoonBox .tList').html(
    "<li><div style='width:100%;padding: 40px 0px;;background-color:#fff;text-align:center;'><img src='" +
      ctxStatic +
      "/ultra/img/gis/typhoon/noTf.png'></div></li>",
  );
  typhoonStatus = 1;
  $('.mapTextt h4').text('当前无台风');
  $('#ft-Defail tbody').empty();
  $('.noTf').show();
};

// typhoon.initTyphoonPath(list);
/**
 *
 * @param item       {"endtime":"2018/08/14 12:06:00","LAT":179.3000,"starttime":"2018/08/14 02:00:00","isactive":0,"tfid":1817,"LON":25.8000,"name":"赫克托","warnlevel":1,"enname":"HECTOR"}
 */
typhoon.initTyphoonPath = function (item) {
  var locationparams = {
    code: item.tfid,
    name: item.enname,
    startTime: item.starttime,
    endTime: item.endtime,
    chnName: item.name,
  };

  typhoon.getTyphoonLocationInfo(locationparams, {
    'pager.page': 1,
    'pager.rows': 100,
  });
  var typhoonno = item.tfid;
  async.parallel(
    {
      //两个都执行了才会执行绘制forcast的动画
      second: function (done) {
        emitter.addListener('startForcast' + typhoonno, function () {
          done(null);
          emitter.removeEvent('startForcast' + typhoonno);
        });
      },
      // 获取预报路径
      start: function (done) {
        typhoon.getTyphoonForecastInfo(locationparams, done);
      },
    },
    function (error, result) {
      var typhoono = item.tfid;
      for (key in publisherlist) {
        if (publisherlist[key] == 1) {
          TyphoonHelper.DrawForecasts(typhoonno + '_' + key, typhoonno); //画出预报信息
        } else {
          TyphoonHelper.RemoveForecast(typhoonno, key);
        }
      }
    },
  );

  // 表格相关的部分控制
  var enname = item.enname.toUpperCase();
  var cname = item.name;
  var idName = 'list' + item.tfid;
  var ulHtml =
    '<li id=' + idName + '><span class="sTitle">' + cname + '</span>';

  if (initDrawIndex == 0) {
    ulHtml +=
      '<a class="oc">展开</a><img class="ocImg" src="' +
      ctxStatic +
      '/ultra/img/gis/typhoon/jiahao.png" style="clear:both;float:right;margin-right:6px;margin-top:-22px;cursor: pointer;" /><div style="clear:both;"></div><div class="typhoonInfo off" id="' +
      item.tfid +
      '">';
  } else {
    ulHtml +=
      '<a class="oc">展开</a><img class="ocImg" src="' +
      ctxStatic +
      '/ultra/img/gis/typhoon/jiahao.png" style="clear:both;float:right;margin-right:6px;margin-top:-22px;cursor: pointer;" /><div style="clear:both;"></div><div class="typhoonInfo off" id="' +
      item.tfid +
      '">';
  }
  //10 25 15 18 15
  ulHtml +=
    '<table><thead><th ></th><th >时间</th>' +
    '<th >风速</th><th >移向</th><th >等级</th></thead><tbody>';
  ulHtml += '</table></div></li>';
  $('.tList').append(ulHtml);
  $('#' + idName + ' .oc').unbind();
  $('#' + idName + ' .oc').click(function () {
    var parent = $(this).parent();
    var child = parent.children('.typhoonInfo');
    if (child.hasClass('off')) {
      var array = child;
      $(array).each(function (i, n) {
        if (!$(this).hasClass('off')) {
          $(this).addClass('off');
          $(this).parent().children('.oc').html('展开');
        }
      });
      child.removeClass('off');
      var id = child.attr('id');
      var pageArray = $('#' + id + ' span');
      var pageNo = 0;
      $(pageArray).each(function () {
        if (
          $(this).hasClass('current') &&
          !$(this).hasClass('prev') &&
          !$(this).hasClass('next')
        ) {
          pageNo = $(this).text();
        }
      });
      // typhoon.getRecord(parseInt(pageNo) - 1);
      typhoon.getRecords(idName);
      $(this).html('收起');
      $(this)
        .next()
        .attr('src', ctxStatic + '/ultra/img/gis/typhoon/jianhao.png');
    } else {
      var parent = $(this).parent();
      var child = parent.children('.typhoonInfo');
      child.addClass('off');
      $(this).html('展开');
      $(this)
        .next()
        .attr('src', ctxStatic + '/ultra/img/gis/typhoon/jiahao.png');
    }
  });
  $('#' + idName + ' .ocImg').unbind();
  $('#' + idName + ' .ocImg').click(function () {
    var parent = $(this).parent();
    var parentId = parent.attr('id').slice(4);
    var child = parent.children('.typhoonInfo');
    if (child.hasClass('off')) {
      var array = child;
      $(array).each(function (i, n) {
        if (!$(this).prev().hasClass('off')) {
          $(this).prev().addClass('off');
          $(this).prev().parent().children('.oc').html('展开');
        }
      });
      child.removeClass('off');
      var id = child.attr('id');
      var pageArray = $('#' + id + ' span');
      var pageNo = 0;
      $(pageArray).each(function () {
        if (
          $(this).prev().hasClass('current') &&
          !$(this).prev().hasClass('prev') &&
          !$(this).prev().hasClass('next')
        ) {
          pageNo = $(this).prev().text();
        }
      });
      // typhoon.getRecord(parseInt(pageNo) - 1);
      typhoon.getRecords(idName);
      $(this).prev().html('收起');
      $(this).attr('src', ctxStatic + '/ultra/img/gis/typhoon/jianhao.png');
    } else {
      var parent = $('#' + idName + ' .oc').parent();
      var child = parent.children('.typhoonInfo');
      child.addClass('off');
      $(this).prev().html('展开');
      $(this).attr('src', ctxStatic + '/ultra/img/gis/typhoon/jiahao.png');
    }
  });
};

//10 25 15 18 15
/**
 * @param params  某一条台风信息
 * @param pagerParams  没用到
 */
typhoon.getTyphoonLocationInfo = function (params, pagerParams) {
  var typhoonCount = parseInt(typhoon.typhoonCount);
  $.ajax({
    url: ctx + '/typhoon/getLocationTyphoonInfo',
    type: 'POST',
    data: params,
    dataType: 'JSON',
    success: function (result) {
      var ttList = result.ttList;
      $('.lishi-main').hide();
      $('.lishi-main1').show();
      $('.lishi-top1').css('height', '52px');
      $('.lishi-top2').show();
      // console.log($('.lishi').html())
      var clientH = document.documentElement.clientHeight;
      var lishiH = $('.lishi').height() + 16;
      $('.lishi').css('top', clientH - lishiH + 'px');
      typhoonPageRecord = {};
      typhoonCount = parseInt(typhoonCountMap['typhoonCount']) + 1;
      typhoonCountMap['typhoonCount'] = typhoonCount;
      var json = result.list;

      typhoon.hideDefailItems(); //控制详情列表的显示隐藏

      if ($('.typhoonright .stat.typhoondefail').hasClass('off')) {
        $('.typhoonright .stat.typhoondefail').removeClass('off');
        $('.typhoonright .stat.typhoondefail').addClass('on');
        tableName = 'typhoondefail';
      }

      //这一坨东西根本不存在啊
      if (typhoonCount > 0) {
        $('.ft-Defail').hide();
      } else {
      }
      var tabHtml = '';
      var tableHtml = '';
      var pageHtml = '';
      $('.tab').removeClass('tabSelected');
      $('.tab .close').hide();
      tabHtml +=
        '<div class="tab tabSelected" id="tab_' +
        params.code +
        '"><span id=\'' +
        params.code +
        "'>" +
        params.chnName +
        '<br/>20' +
        params.code +
        '</span></div>';
      $('.typhoondefail .ranking_head').append(tabHtml);
      typhoon.initTab();

      $('.typhoondefail .dg-Defail').hide();
      tableHtml +=
        '<table id="dg-Defail_' +
        params.code +
        '"  class="dg-Defail" style="text-align: center; width: 100%;">' +
        '<thead><tr style="background: #d2d2d2;"><th width="5%"></th><th width="28%">时间</th><th width="20%">经度</th>' +
        '<th width="15%">纬度</th><th width="12%">风速</th><th width="20%">气压</th></tr></thead><tbody class="tablebody"></tbody></table>';
      $('.typhoondefail .Areatb').append(tableHtml);

      // $(".tyPagination").hide();
      // pageHtml += "<div id=\"tyPagination_" + params.code + "\" class=\"tyPagination\"></div>";
      // $(".typhoondefail .paginationBox").append(pageHtml);

      //台风增加简短文字描述。描述台风的最新信息。
      var newTyphoonInfo = '';
      for (var i = 0; i < json.length; i++) {
        var date = $.parseDate(json[i].YYYYMMDDHHMM, 'yyyyMMddHHmm');
        date.setHours(date.getHours());
        json[i].DATESTR = date.format('MM月dd日HH时');
        if (json[i].WINDVELOCITY == '999999') {
          json[i].WINDVELOCITY = '缺测';
        }
        if (json[i].PRESS == '999999') {
          json[i].PRESS = '缺测';
        }
        if (i == json.length - 1) {
          newTyphoonInfo = typhoon.getSummary(json[i], params);

          var oc1 = $('#' + params.code + '')
            .prev()
            .prev();
          oc1.after(
            "<span class='shortInfo' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
              newTyphoonInfo +
              '</span>',
          );
        }
      }
      typhoonListMap[params.code] = json;
      if (json.length > 0) {
        typhoonStatus = 0;
      } else {
        typhoonStatus = 1;
      }

      //画出台风路径图
      TyphoonHelper.DrawLocation(json, params.code, 5, 1, params);

      //以下为创建台风路径表格相关代码
      clickedTyphoonName[params.code] =
        params.chnName + '(' + params.name + ')';
      tytitle =
        '20' +
        params.code.toString().substr(0, 2) +
        '年' +
        params.code.toString().substr(2, 2) +
        '号 ' +
        params.chnName +
        '(' +
        params.name +
        ')';
    },
  });
};

/**
 * 生成台风的简要信息，因为要做循环，所以用闭包保存正确的数据
 * @param json
 */
typhoon.getSummary = function (json, params) {
  var lat = 0;
  var lng = 0;
  if (+json.LAT > 0) {
    lat = +json.LAT + 'N';
  } else if (+json.LAT < 0) {
    lat = Math.abs(+json.Lat) + 'S';
  }
  if (+json.LON > 0) {
    lng = +json.LON + 'E';
  } else if (+json.LON < 0) {
    lng = Math.abs(+json.LON) + 'W';
  }

  var newTyphoonInfo =
    json.DATESTR +
    '，台风' +
    params.chnName +
    '中心位置：' +
    lng +
    '/' +
    lat +
    ',最大风速：' +
    json.WINDVELOCITY +
    '米/秒，中心气压：' +
    json.PRESS +
    '百帕';
  return newTyphoonInfo;
};
/**
 * 获取预测信息，看不懂
 * @param params
 * @param pagerParams  没用到
 */
typhoon.getTyphoonForecastInfo = function (params, done) {
  $.ajax({
    url: ctx + '/typhoon/getForecastTyphoonInfo',
    type: 'get',
    data: params,
    dataType: 'json',
    success: function (result) {
      jsonListMap[params.code + '_BABJ'] = result.BABJ_DS;
      jsonListMap[params.code + '_PGTW'] = result.PGTW_DS;
      jsonListMap[params.code + '_RCTP'] = result.RCTP_DS;
      jsonListMap[params.code + '_RJTD'] = result.RJTD_DS;
      jsonListMap[params.code + '_VHHH'] = result.VHHH_DS;
      jsonListMap[params.code + '_RPMM'] = result.RPMM_DS;
      typhoondate = '197010100';
      jsonbabj0datalist.length = 0;
      for (var j = 0; j < jsonListMap[params.code + '_BABJ'].length; j++) {
        var jsondata = jsonListMap[params.code + '_BABJ'][j];
        if (jsondata.FORECASTTIMES == 0) {
          jsonbabj0datalist.push(jsondata);
          typhoondate =
            typhoondate < jsondata.YYYYMMDDHHMM.substr(0, 10)
              ? jsondata.YYYYMMDDHHMM.substr(0, 10)
              : typhoondate;
          continue;
        }
      }
      jsonbabj0datalistMap[params.code] = jsonbabj0datalist;

      done(null);
    },
  });
};

typhoon.hideDefailItems = function () {
  if (!$('.typhoonright .stat.typhoondefail').hasClass('off')) {
    $('.typhoonright .stat.typhoondefail').addClass('off');
  }
  if (!$('.typhoonright .stat.Rdefail').hasClass('off')) {
    $('.typhoonright .stat.Rdefail').addClass('off');
  }
  if (!$('.typhoonright .stat.Wdefail').hasClass('off')) {
    $('.typhoonright .stat.Wdefail').addClass('off');
  }
  if (!$('.typhoonright .stat.ALARMdefail').hasClass('off')) {
    $('.typhoonright .stat.ALARMdefail').addClass('off');
  }
  if (!$('.typhoonright .stat.seastationdefail').hasClass('off')) {
    $('.typhoonright .stat.seastationdefail').addClass('off');
  }
};

// 台风列表点击事件 。台风列表hover事件
typhoon.typhoonForcastClicks = function (index, typhoonNo) {
  var rowData = typhoonListMap[typhoonNo][index];

  var typhoondateStr = rowData.YYYYMMDDHHMM;
  if (typhoonmaker.length > 0 && typhoonmaker[0].marker) {
    typhoonmaker[0].marker.remove();
    delete typhoonmaker[0].marker;
  }
  typhoonmaker.length = 0;
  var temprowData = new Object();
  $.extend(true, temprowData, rowData);
  TyphoonHelper.marker2(temprowData, 15, 15);
  typhoonmaker.push(temprowData);
  // TyphoonHelper.DrawWindCircle(rowData, typhoonNo);
  // for (key in publisherlist) {
  //     if (publisherlist[key] == 1) {
  //         TyphoonHelper.DrawForecasts(rowData.TYPHOONNO + "_" + key, rowData, typhoonNo);
  //     } else {
  //         TyphoonHelper.RemoveForecast(typhoonNo, key);
  //     }
  // }
  typhoondate = typhoondateStr.substr(0, 10);
  if (typhoondate) {
    //此处参数多加一个rowData，为点击行的数据
    TyphoonHelper.MoveToLocationPoint(typhoondate, rowData);
  }
};

typhoon.initTab = function () {
  $('.tab').click(function () {
    var divId = $(this).attr('id');
    var typhoonNo = divId.split('_');
    if (!$(this).hasClass('tabSelected')) {
      $('.tab').removeClass('tabSelected');
      $('.tab .close').hide();
      $('.dg-Defail').hide();
      $('.tyPagination').hide();
      $('#tab_' + typhoonNo[1]).addClass('tabSelected');
      $('#tab_' + typhoonNo[1] + ' .close').show();
      $('#dg-Defail_' + typhoonNo[1]).show();
      $('#tyPagination_' + typhoonNo[1]).show();
      var namehtml =
        '20' +
        typhoonNo[1].substring(0, 2) +
        '年' +
        typhoonNo[1].substring(2, 4) +
        '号 ';
      var typhoonName = '';
      for (key in typhoonListpageMap) {
        if (key == typhoonNo[1]) {
          var temArr = typhoonListpageMap[key];
          var rowData = temArr[0][0];

          typhoonName = typhoonNameMap[rowData.TYPHOONNO];
          if (typhoonName == undefined) {
            typhoonName = '热带低压';
          }
          namehtml += typhoonName + '(' + rowData.TYPHOONNAME + ')';
          maphelper.moveTo(typhoonDateMap[key].LON, typhoonDateMap[key].LAT, 5);
        }
      }
      if ($('.lishi-main').css('display') == 'block') {
        $('.lishi-main').hide();
        $('.lishi-main1').show();
        $('.lishi-top1').css('height', '52px');
        $('.lishi-top2').show();
      }
      $('.typhoonName').text('20' + typhoonNo[1] + typhoonName);
    } else {
      if (typhoonCountMap['typhoonCount'] == 1) {
        //只剩一个
        if ($('.lishi-main').css('display') == 'block') {
          $('.lishi-main').hide();
          $('.lishi-main1').show();
          $('.lishi-top1').css('height', '52px');
          $('.lishi-top2').show();
        }
      }
    }
  });
};

/**
 * 移除地图上的台风点
 * @param typhoonno
 */
typhoon.removeData = function (typhoonno) {
  TyphoonHelper.removeTyphoon(typhoonno);
};

/**
 * 直接展示全部数据
 * @param json
 */
typhoon.getRecords = function (id) {
  var currentTyphoonNo = $('#' + id)
    .children('.typhoonInfo')
    .attr('id');

  // var typhoonPage = typhoonListMap[currentTyphoonNo];
  var tyList = typhoonListMap[currentTyphoonNo];
  if (
    $('#' + currentTyphoonNo + ' tbody')
      .html()
      .trim() != ''
  ) {
    return;
  }
  var tableHtml = '';
  if (!!tyList) {
    for (var i = tyList.length - 1; i >= 0; i--) {
      var movedirector =
        tyList[i].FUTUREANGLE == '999999'
          ? '-'
          : TyphoonHelper.GetDirectFromAngle(tyList[i].FUTUREANGLE);
      tableHtml +=
        '<tr data-index=' +
        i +
        '>' +
        '<td>' +
        (tyList.length - i) +
        '</td><td>' +
        tyList[i].DATESTR +
        '</td><td>' +
        tyList[i].WINDVELOCITY +
        'm/s</td><td>' +
        movedirector +
        '</td><td>' +
        TyphoonHelper.TyphoonLevelName(tyList[i].WINDVELOCITY);
      +'</td></tr>';
    }
    $('#' + currentTyphoonNo + ' tbody').html(tableHtml);

    // document.querySelector("#" + currentTyphoonNo + " tbody").addEventListener("mouseover",function(e){
    //     console.log(e.target);
    // }.false)

    // document.getElementById(currentTyphoonNo).addEventListener("mouseover",function(e){
    //     console.log(e.target);
    // },false)
    //
    var height = $('#' + currentTyphoonNo + ' tbody').height();
    $('#' + currentTyphoonNo + ' tbody').slimScroll({
      width: '100%', //可滚动区域宽度
      height: height, //可滚动区域高度
      size: '4px', //滚动条宽度，即组件宽度
      color: '#444', //滚动条颜色
      position: 'right', //组件位置：left/right
      distance: '0px', //组件与侧边之间的距离
      start: 'top', //默认滚动位置：top/bottom
      opacity: 0.4, //滚动条透明度
      alwaysVisible: true, //是否 始终显示组件
      disableFadeOut: false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
      railVisible: true, //是否 显示轨道
      railColor: '#333', //轨道颜色
      railOpacity: 0.2, //轨道透明度
      railDraggable: true, //是否 滚动条可拖动
      railClass: 'slimScrollRail', //轨道div类名
      barClass: 'slimScrollBar', //滚动条div类名
      wrapperClass: 'slimScrollDiv', //外包div类名
      allowPageScroll: true, //是否 使用滚轮到达顶端/底端时，滚动窗口
      wheelStep: 20, //滚轮滚动量
      touchScrollStep: 200, //滚动量当用户使用手势
      // borderRadius: '7px', //滚动条圆角
      // railBorderRadius: '7px' //轨道圆角
    });

    $('#' + currentTyphoonNo + ' tbody tr').hover(
      function () {
        var index = $(this).attr('data-index');
        // console.log(index);
        // console.log("hoverin")
        typhoon.typhoonForcastClicks(index, currentTyphoonNo);
        $(this).addClass('active');
      },
      function () {
        $(this).removeClass('active');
        globalParam.typhoonPopup._close();
        // maphelper.map.remove(globalParam.typhoonPopup)
        // globalParam.typhoonPopup
      },
    );
  }
};

window.typhoon = typhoon;

export { typhoonmaker };
export default typhoon;
