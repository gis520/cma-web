import { maphelper, typhoonmaker } from './maphelper';

var TyphoonHelper = TyphoonHelper || {};
var playtyphooontimer;
var drawindex = 0;
TyphoonHelper.ElementListMap = {};
TyphoonHelper.TyphoonListMap = {};
var c;
TyphoonHelper.hoverPoint = new Array();
var typhoonNameIconMap = {};
var typhoonTimeIconMap = {};

/**
 * 移除台风路径的点
 * @param dataList
 * @param typhoonno
 * @constructor
 */
TyphoonHelper.RemoveLocation = function (dataList, typhoonno) {
  //移除台风路径的点
  var jsonList = TyphoonHelper.TyphoonListMap[typhoonno];
  if (jsonList) {
    if (typhoonmaker.length > 0 && typhoonmaker[0].marker) {
      typhoonmaker[0].marker.remove();
      delete typhoonmaker[0].marker;
    }
    if (TyphoonHelper.hoverPoint.length > 0) {
      for (var i = 0; i < TyphoonHelper.hoverPoint.length; i++) {
        maphelper.map.removeLayer(TyphoonHelper.hoverPoint[i]);
      }
    }
    for (var i = 0; i < jsonList.length; i++) {
      if (jsonList[i].marker) {
        if (
          jsonList[i].marker.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].marker.remove();
          delete jsonList[i].marker;
        }
      }
      if (jsonList[i].line) {
        if (jsonList[i].line.id.indexOf(typhoonno) >= 0 || typhoonno == '-1') {
          jsonList[i].line.remove();
          delete jsonList[i].line;
        }
      }
      if (jsonList[i].CurrentCircleImage) {
        if (
          jsonList[i].CurrentCircleImage.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].CurrentCircleImage.remove();
          delete jsonList[i].CurrentCircleImage;
        }
      }
      if (jsonList[i].WindCircle7) {
        if (
          jsonList[i].WindCircle7.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].WindCircle7.remove();
          delete jsonList[i].WindCircle7;
        }
      }
      if (jsonList[i].WindCircle10) {
        if (
          jsonList[i].WindCircle10.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].WindCircle10.remove();
          delete jsonList[i].WindCircle10;
        }
      }
      if (jsonList[i].WindCircle12) {
        if (
          jsonList[i].WindCircle12.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].WindCircle12.remove();
          delete jsonList[i].WindCircle12;
        }
      }
    }
    delete TyphoonHelper.TyphoonListMap[typhoonno];
  }
};

var keyLock = false;
/**
 * 画台风圈
 * @param json
 * @param typhoonno
 * @constructor
 */
TyphoonHelper.DrawWindCircle = function (json, typhoonno) {
  if (keyLock) {
    return;
  }
  keyLock = true;
  var jsonList = TyphoonHelper.TyphoonListMap[typhoonno];

  //这里是为了移除台风圈
  if (jsonList) {
    for (var i = 0; i < jsonList.length; i++) {
      if (jsonList[i].WindCircle7) {
        if (
          jsonList[i].WindCircle7.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].WindCircle7.remove();
          delete jsonList[i].WindCircle7;
        }
      }
      if (jsonList[i].WindCircle10) {
        if (
          jsonList[i].WindCircle10.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].WindCircle10.remove();
          delete jsonList[i].WindCircle10;
        }
      }
      if (jsonList[i].WindCircle12) {
        if (
          jsonList[i].WindCircle12.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].WindCircle12.remove();
          delete jsonList[i].WindCircle12;
        }
      }
    }
    var c1 = jsonList;

    TyphoonHelper.WindCircle7(json); //画出7级风圈
    TyphoonHelper.WindCircle10(json); //画出10级风圈
    TyphoonHelper.WindCircle12(json); //画出12级风圈
    keyLock = false;
  }
};

/**
 * 移除风圈
 * @param json
 * @param typhoonno
 */
TyphoonHelper.removeWindCircle = function (json, typhoonno) {
  var jsonList = TyphoonHelper.TyphoonListMap[typhoonno];
  if (jsonList) {
    for (var i = 0; i < jsonList.length; i++) {
      if (jsonList[i].WindCircle7) {
        if (
          jsonList[i].WindCircle7.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].WindCircle7.remove();
          delete jsonList[i].WindCircle7;
        }
      }
      if (jsonList[i].WindCircle10) {
        if (
          jsonList[i].WindCircle10.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].WindCircle10.remove();
          delete jsonList[i].WindCircle10;
        }
      }
      if (jsonList[i].WindCircle12) {
        if (
          jsonList[i].WindCircle12.id.indexOf(typhoonno) >= 0 ||
          typhoonno == '-1'
        ) {
          jsonList[i].WindCircle12.remove();
          delete jsonList[i].WindCircle12;
        }
      }
    }
  }
};
TyphoonHelper.removeTyphoon = function (typhoonno) {
  //移除图上内容，并把页面上其他内容清空
  TyphoonHelper.RemoveLocation('', typhoonno); //移除台风路径
  TyphoonHelper.RemoveForecast('-1', typhoonno);
};

/**
 * 画台风路径
 * @param dataList
 * @param typhoonno
 * @param zoom
 * @param flag
 * @constructor
 */
TyphoonHelper.DrawLocation = function (
  dataList,
  typhoonno,
  zoom,
  flag,
  itemMessage,
) {
  TyphoonHelper.TyphoonListMap[typhoonno] = dataList; //把当前台风路径放到Map中，以方便后续方法的存取
  if (flag === 1) {
  } else {
    maphelper.moveTo(
      dataList[dataList.length - 1].LON,
      dataList[dataList.length - 1].LAT,
      zoom,
    ); //将焦点移动至此并放大至5
  }
  var drawindex = 0;
  // playtyphooontimer && clearInterval(playtyphooontimer);
  typhoonStatus = 0;
  playtyphooontimer = window.setInterval(function () {
    if (drawindex > dataList.length - 1) {
      window.clearInterval(playtyphooontimer);
      return;
    }
    TyphoonHelper.DrawTimer(dataList, typhoonno, drawindex, itemMessage);
    drawindex++;
  }, 50);
};

/**
 * 画台风圈，画路径， 画中心点， 同时画上预报信息
 * @param dataList  台风路径信息
 * @param typhoonno  台风
 * @param drawindex
 * @param itemMessage
 * @constructor
 */
TyphoonHelper.DrawTimer = function (
  dataList,
  typhoonno,
  drawindex,
  itemMessage,
) {
  //通过该方法调用画台风路径、画风级圈、画圆点以及预报信息的方法
  if (drawindex == 0) {
    TyphoonHelper.marker(dataList[drawindex], 10, 10); //只有一个点的时候没有台风圈

    //第一个点，画上台风的名字
    var tempJson = dataList[0];
    var typhoonNumber = tempJson.TYPHOONNO + '';

    var m = maphelper.addDiv(
      tempJson.LON,
      tempJson.LAT,
      "<p style='width:70px;font-weight:bold;font-size:16px;color:red;margin-left: 30px;margin-top: 10px;'>" +
        itemMessage['chnName'] +
        '</p>',
      'red',
      null,
      null,
    );

    typhoonNameIconMap[typhoonNumber.toUpperCase()] = m;
  } else {
    TyphoonHelper.DrawWindCircle(dataList[drawindex], typhoonno); //画风级圈 每次画的时候都会把前面的移除
    TyphoonHelper.line(dataList[drawindex - 1], dataList[drawindex]); //画路径线
    TyphoonHelper.marker(dataList[drawindex], 10, 10); //画中心点
  }

  // 最后一个的时候
  if (drawindex >= dataList.length - 1) {
    TyphoonHelper.CurrentCircleImage(dataList[dataList.length - 1], typhoonno); //这里添加了一个转圈的图标，并添加了对应的介绍； 当然覆盖了里面的内容
    jsonb = dataList[dataList.length - 1];
    // 把预报的路径给去掉
    //预警信息，一大堆，通过判断时间来确定哪条归哪条时间所有

    // 把预报的路径给去掉

    // for (key in publisherlist) {
    //     if (publisherlist[key] == 1) {
    //         TyphoonHelper.DrawForecasts(typhoonno + "_" + key, dataList[dataList.length - 1], typhoonno)//画出预报信息
    //     } else {
    //         TyphoonHelper.RemoveForecast(typhoonno, key)
    //     }
    // }
    emitter.emitEvent('startForcast' + typhoonno); //最后一个触发事件，然后才能通过async来控制预报路径的显示

    // 在最后的路径上加上时间
    var tempJson2 = dataList[dataList.length - 1];
    var time2 = $.parseDate(tempJson2.YYYYMMDDHHMM + '', 'yyyyMMddHHmm');
    time2.setHours(time2.getHours() + 8);
    var month1 = time2.getMonth() + 1;
    var day1 = time2.getDate();
    var hours = time2.getHours();

    //var latlng={lon: tempJson.LON, lat: tempJson.LAT};
    //maphelper.addDiv(tempJson.LON,tempJson.LAT,tempJson.TYPHOONNAME);
    var n = maphelper.addDiv(
      tempJson2.LON,
      tempJson2.LAT,
      '<div >最新位置:' + month1 + '月' + day1 + '日' + hours + '时' + '</div>',
      'forDate',
      null,
      null,
      10000000000,
    );
    typhoonTimeIconMap[tempJson2.TYPHOONNO] = n;
  }
};
TyphoonHelper.DrawByIndex = function (index, typhoonno) {
  var dataList = TyphoonHelper.TyphoonListMap[typhoonno];
  if (!dataList) return;
  //	var dataList = TyphoonHelper.jsonList;
  if (dataList.length == 0 || dataList.length - 1 < index) return;
  if (index == 0) {
    TyphoonHelper.RemoveLocation(dataList, typhoonno); //移除台风路径的方法
    TyphoonHelper.RemoveForecast('-1', '-1'); //移除台风预报的方法（-1移除全部）
    TyphoonHelper.marker(dataList[index], 10, 10); //移除标记
  } else {
    TyphoonHelper.DrawWindCircle(dataList[index], typhoonno); //画出7级10级12级风圈
    TyphoonHelper.line(dataList[index - 1], dataList[index]); //画出对应的线
    TyphoonHelper.marker(dataList[index], 10, 10);
  }

  if (index >= dataList.length - 1) {
    TyphoonHelper.CurrentCircleImage(dataList[dataList.length - 1]); //如果点击最后一个事件，则画出台风中心点

    setTimeout(function () {
      for (key in publisherlist) {
        if (publisherlist[key] == 1) {
          //				TyphoonHelper.DrawForecasts(typhoonno+"_"+key, typhoondate, '-1')
          TyphoonHelper.DrawForecasts(
            typhoonno + '_' + key,
            dataList[dataList.length - 1],
            typhoonno,
          );
        } else {
          TyphoonHelper.RemoveForecast('-1', key);
        }
      }
    }, 500);
  }
};
TyphoonHelper.DrawsByIndex = function (index, typhoonno) {
  for (var i = 0; i <= index; i++) {
    TyphoonHelper.DrawByIndex(i, typhoonno);
  }
};
TyphoonHelper.CurrentCircleImage = function (json, typhoonno) {
  var img, lng, lat;
  lng = json.LON;
  lat = json.LAT;
  var typhonnname = json.TYPHOONNAME;
  var date = $.parseDate(json.YYYYMMDDHHMM, 'yyyyMMddHHmm');
  date.setHours(date.getHours() + 8);
  var datestr = date.format('MM月dd日HH时');
  var lonlat = json.LON + '°/' + json.LAT + '°';
  var press = json.PRESS == '999999' ? '-' : json.PRESS;
  var windvelocity = json.WINDVELOCITY == '999999' ? '-' : json.WINDVELOCITY;
  var level = TyphoonHelper.TyphoonLevelName(json.WINDVELOCITY);
  var movevelocity =
    json.FUTUREVELOCITY == '999999' ? '-' : json.FUTUREVELOCITY;
  var movedirector =
    json.FUTUREANGLE == '999999'
      ? '-'
      : TyphoonHelper.GetDirectFromAngle(json.FUTUREANGLE);
  var wind7circle1 = json.WINDCIRCLE7R1 == '999999' ? '-' : json.WINDCIRCLE7R1;
  var wind7circle2 = json.WINDCIRCLE7R2 == '999999' ? '-' : json.WINDCIRCLE7R2;
  var wind7circle3 = json.WINDCIRCLE7R3 == '999999' ? '-' : json.WINDCIRCLE7R3;
  var wind7circle4 = json.WINDCIRCLE7R4 == '999999' ? '-' : json.WINDCIRCLE7R4;
  var wind10circle1 =
    json.WINDCIRCLE10R1 == '999999' ? '-' : json.WINDCIRCLE10R1;
  var wind10circle2 =
    json.WINDCIRCLE10R2 == '999999' ? '-' : json.WINDCIRCLE10R2;
  var wind10circle3 =
    json.WINDCIRCLE10R3 == '999999' ? '-' : json.WINDCIRCLE10R3;
  var wind10circle4 =
    json.WINDCIRCLE10R4 == '999999' ? '-' : json.WINDCIRCLE10R4;
  var wind12circle1 =
    json.WINDCIRCLE12R1 == '999999' ? '-' : json.WINDCIRCLE12R1;
  var wind12circle2 =
    json.WINDCIRCLE12R2 == '999999' ? '-' : json.WINDCIRCLE12R2;
  var wind12circle3 =
    json.WINDCIRCLE12R3 == '999999' ? '-' : json.WINDCIRCLE12R3;
  var wind12circle4 =
    json.WINDCIRCLE12R4 == '999999' ? '-' : json.WINDCIRCLE12R4;

  // function(x, y, iconUrl, cfn, hfn);
  // console.log("b")
  c = 0;
  var m = TyphoonHelper.addClickableMaker(
    lng,
    lat,
    {
      //		url: $basePath + '/images/levels/typhoon/typhooncenter.gif',
      url: ctxStatic + '/ultras/img/typhoon/typhooncenter.gif?verson=1.0',
      w: 25,
      h: 25,
    },
    function () {},
    function () {
      // 这里return什么地方都接收不到啊
      // console.log("a")
      var values = createTyPop(json);

      /*新添加，点击第一个点删除或画预报数据*/
      TyphoonHelper.DrawWindCircle(json, json.TYPHOONNO);
      for (key in publisherlist) {
        if (publisherlist[key] == 1) {
          //				TyphoonHelper.DrawForecasts(json.TYPHOONNO+"_"+key, json.YYYYMMDDHHMM.substr(0, 10), '-1')//调用画预报路线的方法
          TyphoonHelper.DrawForecasts(
            json.TYPHOONNO + '_' + key,
            json,
            json.TYPHOONNO,
          );
        } else {
          //				TyphoonHelper.RemoveForecast('-1', key)
          TyphoonHelper.RemoveForecast(typhoonno, key);
        }
      }
      typhoondate = json.YYYYMMDDHHMM.substr(0, 10);
      /*新添加*/
      // console.log(values)
      return values;
    },
  );
  m.id = 'location_CurrentCircleImage_' + json.TYPHOONNO;
  json.CurrentCircleImage = m;
};
TyphoonHelper.WindCircle7 = function (json) {
  var lng = json.LON;
  var lat = json.LAT;
  var points = new Array();
  var radius = new Array();
  radius[0] = json.WINDCIRCLE7R1 == '999999' ? 0 : json.WINDCIRCLE7R1 * 1000;
  radius[1] = json.WINDCIRCLE7R2 == '999999' ? 0 : json.WINDCIRCLE7R2 * 1000;
  radius[2] = json.WINDCIRCLE7R3 == '999999' ? 0 : json.WINDCIRCLE7R3 * 1000;
  radius[3] = json.WINDCIRCLE7R4 == '999999' ? 0 : json.WINDCIRCLE7R4 * 1000;

  if (
    radius[0] == radius[1] &&
    radius[1] == radius[2] &&
    radius[2] == radius[3]
  ) {
    ploy = TyphoonHelper.addCircle(
      new L.LatLng(lat, lng),
      radius[0],
      '#EE6363',
      1,
      '#FFFAF0',
      function () {
        return;
      },
      function () {
        return;
      },
    );
  } else {
    points = TyphoonHelper.WindCirclePoints(radius, lng, lat);
    ploy = TyphoonHelper.addPloy(
      points,
      '#EE7600',
      1,
      '#EEC591',
      function () {
        return;
      },
      function () {
        return;
      },
    );
  }
  ploy.id = 'location_windcircle7_' + json.TYPHOONNO;
  json.WindCircle7 = ploy;
};
TyphoonHelper.WindCircle10 = function (json) {
  var lng = json.LON;
  var lat = json.LAT;
  var points = new Array();
  var radius = new Array();
  radius[0] = json.WINDCIRCLE10R1 == '999999' ? 0 : json.WINDCIRCLE10R1 * 1000;
  radius[1] = json.WINDCIRCLE10R2 == '999999' ? 0 : json.WINDCIRCLE10R2 * 1000;
  radius[2] = json.WINDCIRCLE10R3 == '999999' ? 0 : json.WINDCIRCLE10R3 * 1000;
  radius[3] = json.WINDCIRCLE10R4 == '999999' ? 0 : json.WINDCIRCLE10R4 * 1000;

  if (
    radius[0] == radius[1] &&
    radius[1] == radius[2] &&
    radius[2] == radius[3]
  ) {
    ploy = TyphoonHelper.addCircle(
      new L.LatLng(lat, lng),
      radius[0],
      '#EE00EE',
      1,
      '#EE7AE9',
      function () {
        return;
      },
      function () {
        return;
      },
    );
  } else {
    points = TyphoonHelper.WindCirclePoints(radius, lng, lat);
    ploy = TyphoonHelper.addPloy(
      points,
      '#FF0000',
      1,
      '#D4D4D4',
      function () {
        return;
      },
      function () {
        return;
      },
    );
  }
  ploy.id = 'location_windcircle10_' + json.TYPHOONNO;
  json.WindCircle10 = ploy;
};
TyphoonHelper.WindCircle12 = function (json) {
  var lng = json.LON;
  var lat = json.LAT;
  var points = new Array();
  var radius = new Array();
  radius[0] = json.WINDCIRCLE12R1 == '999999' ? 0 : json.WINDCIRCLE12R1 * 1000;
  radius[1] = json.WINDCIRCLE12R2 == '999999' ? 0 : json.WINDCIRCLE12R2 * 1000;
  radius[2] = json.WINDCIRCLE12R3 == '999999' ? 0 : json.WINDCIRCLE12R3 * 1000;
  radius[3] = json.WINDCIRCLE12R4 == '999999' ? 0 : json.WINDCIRCLE12R4 * 1000;

  if (
    radius[0] == radius[1] &&
    radius[1] == radius[2] &&
    radius[2] == radius[3]
  ) {
    ploy = TyphoonHelper.addCircle(
      new L.LatLng(lat, lng),
      radius[0],
      '#FF0000',
      1,
      '#D4D4D4',
      function () {
        return;
      },
      function () {
        return;
      },
    );
  } else {
    points = TyphoonHelper.WindCirclePoints(radius, lng, lat);
    ploy = TyphoonHelper.addPloy(
      points,
      '#FF0000',
      1,
      '#D4D4D4',
      function () {
        return;
      },
      function () {
        return;
      },
    );
  }
  ploy.id = 'location_windcircle12_' + json.TYPHOONNO;
  json.WindCircle12 = ploy;
};

TyphoonHelper.marker2 = function (json, w, h) {
  //画标记w:10;h:10
  var lng = json.LON;

  var lat = json.LAT;

  var img = TyphoonHelper.TyphoonLevelImage(json.WINDVELOCITY);

  var m = TyphoonHelper.addClickableMaker(
    lng,
    lat,
    {
      //为marker添加点击事件
      url: ctxStatic + '/ultras/img/typhoon/' + img + '.png',
      w: w,
      h: h,
    },
    function () {},
    function () {
      var values = createTyPop(json);

      //画台风圈
      // TyphoonHelper.DrawWindCircle(json, json.TYPHOONNO);

      // 把预报的路径给去掉
      // 		for (key in publisherlist) {
      // 			if (publisherlist[key] == 1) {
      // //				TyphoonHelper.DrawForecasts(json.TYPHOONNO+"_"+key, json.YYYYMMDDHHMM.substr(0, 10), '-1')//调用画预报路线的方法
      // 				TyphoonHelper.DrawForecasts(json.TYPHOONNO+"_"+key, json, json.TYPHOONNO)
      // 			} else {
      // //				TyphoonHelper.RemoveForecast('-1', key)
      // 				//此处由于更改了预报机构，现在只显示中国预报，故而此处注释掉，不需要此步骤，否则会由于出错不进行下一步
      // 				//TyphoonHelper.RemoveForecast(typhoonno, key);
      // 			}
      // 		}
      typhoondate = json.YYYYMMDDHHMM.substr(0, 10);
      return values;
    },
  );
  m.id = 'location_marker_' + json.TYPHOONNO;
  json.marker = m;
};

TyphoonHelper.marker = function (json, w, h) {
  //画标记w:10;h:10
  var lng = json.LON;

  var lat = json.LAT;

  var img = TyphoonHelper.TyphoonLevelImage(json.WINDVELOCITY);

  var m = TyphoonHelper.addClickableMaker(
    lng,
    lat,
    {
      //为marker添加点击事件
      url: ctxStatic + '/ultras/img/typhoon/' + img + '.png',
      w: w,
      h: h,
    },
    function () {},
    function () {
      var values = createTyPop(json);

      //画台风圈
      TyphoonHelper.DrawWindCircle(json, json.TYPHOONNO);

      // 把预报的路径给去掉
      // 		for (key in publisherlist) {
      // 			if (publisherlist[key] == 1) {
      // //				TyphoonHelper.DrawForecasts(json.TYPHOONNO+"_"+key, json.YYYYMMDDHHMM.substr(0, 10), '-1')//调用画预报路线的方法
      // 				TyphoonHelper.DrawForecasts(json.TYPHOONNO+"_"+key, json, json.TYPHOONNO)
      // 			} else {
      // //				TyphoonHelper.RemoveForecast('-1', key)
      // 				//此处由于更改了预报机构，现在只显示中国预报，故而此处注释掉，不需要此步骤，否则会由于出错不进行下一步
      // 				//TyphoonHelper.RemoveForecast(typhoonno, key);
      // 			}
      // 		}
      typhoondate = json.YYYYMMDDHHMM.substr(0, 10);
      return values;
    },
  );
  m.id = 'location_marker_' + json.TYPHOONNO;
  json.marker = m;
};

/**
 * 拼接台风的某个点的信息
 */

function createTyPop(json) {
  var lng = json.LON;
  if (+lng > 0) {
    lng = lng + 'E';
  } else {
    lng = Math.abs(+lng) + 'W';
  }
  var lat = json.LAT;
  if (+lat > 0) {
    lat = lat + 'N';
  } else {
    lat = Math.abs(+lat) + 'S';
  }

  var img = TyphoonHelper.TyphoonLevelImage(json.WINDVELOCITY);
  var typhonnname = json.TYPHOONNAME;
  var typhoonNu = json.TYPHOONNO;
  var date = $.parseDate(json.YYYYMMDDHHMM, 'yyyyMMddHHmm');

  date.setHours(date.getHours() + 8);
  var datestr = date.format('MM月dd日HH时');
  var lonlat = json.LON + '°/' + json.LAT + '°';
  var press = json.PRESS == '999999' ? '-' : window.parseInt(json.PRESS);
  var windvelocity =
    json.WINDVELOCITY == '999999' ? '-' : window.parseInt(json.WINDVELOCITY);
  var level = TyphoonHelper.TyphoonLevelName(json.WINDVELOCITY);
  var movevelocity =
    json.FUTUREVELOCITY == '999999'
      ? '-'
      : window.parseInt(json.FUTUREVELOCITY);
  var movedirector =
    json.FUTUREANGLE == '999999'
      ? '-'
      : TyphoonHelper.GetDirectFromAngle(json.FUTUREANGLE);
  var wind7circle1 =
    json.WINDCIRCLE7R1 == '999999' ? '-' : window.parseInt(json.WINDCIRCLE7R1);
  var wind7circle2 =
    json.WINDCIRCLE7R2 == '999999' ? '-' : window.parseInt(json.WINDCIRCLE7R2);
  var wind7circle3 =
    json.WINDCIRCLE7R3 == '999999' ? '-' : window.parseInt(json.WINDCIRCLE7R3);
  var wind7circle4 =
    json.WINDCIRCLE7R4 == '999999' ? '-' : window.parseInt(json.WINDCIRCLE7R4);
  var wind10circle1 =
    json.WINDCIRCLE10R1 == '999999'
      ? '-'
      : window.parseInt(json.WINDCIRCLE10R1);
  var wind10circle2 =
    json.WINDCIRCLE10R2 == '999999'
      ? '-'
      : window.parseInt(json.WINDCIRCLE10R2);
  var wind10circle3 =
    json.WINDCIRCLE10R3 == '999999'
      ? '-'
      : window.parseInt(json.WINDCIRCLE10R3);
  var wind10circle4 =
    json.WINDCIRCLE10R4 == '999999'
      ? '-'
      : window.parseInt(json.WINDCIRCLE10R4);
  var wind12circle1 =
    json.WINDCIRCLE12R1 == '999999'
      ? '-'
      : window.parseInt(json.WINDCIRCLE12R1);
  var wind12circle2 =
    json.WINDCIRCLE12R2 == '999999'
      ? '-'
      : window.parseInt(json.WINDCIRCLE12R2);
  var wind12circle3 =
    json.WINDCIRCLE12R3 == '999999'
      ? '-'
      : window.parseInt(json.WINDCIRCLE12R3);
  var wind12circle4 =
    json.WINDCIRCLE12R4 == '999999'
      ? '-'
      : window.parseInt(json.WINDCIRCLE12R4);
  var value = '';

  var typhName = typhoonNameMap[typhoonNu + ''];
  if (typhName == undefined || typhName == null) {
    typhName = '热带低压';
  } //  typhoonNameMap[typhonnname]
  value += '<div class="typh-pop">';
  value += '<div class="typh-title">' + json.TYPHOONNO + typhName + '</div>';
  value += '<div class="typh-contents">';
  value +=
    '<div ><span class="typh-key">过去时间:&nbsp;</span><span class="typh-value">' +
    json.DATESTR +
    '</span></div>';
  value +=
    '<div ><span class="typh-key">等&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级:&nbsp;</span><span class="typh-value">' +
    level +
    '</span></div>';
  value +=
    '<div ><span class="typh-key">中心位置:&nbsp;</span><span class="typh-value">' +
    lng +
    '/' +
    lat +
    '</span></div>';
  value +=
    '<div ><span class="typh-key">最大风速:&nbsp;</span><span class="typh-value">' +
    windvelocity +
    '米/秒</span></div>';
  value +=
    '<div ><span class="typh-key">中心气压:&nbsp;</span><span class="typh-value">' +
    press +
    '百帕</span></div>';
  value +=
    '<div ><span class="typh-key">移动方向:&nbsp;</span><span class="typh-value">' +
    movedirector +
    '</span></div>';
  value +=
    '<div ><span class="typh-key">移动速度:&nbsp;</span><span class="typh-value">' +
    movevelocity +
    '公里/小时</span></div>';
  value +=
    '<div class="typh-tr"><span class="th1">风圈半径</span><span class="ne">东北</span><span class="ne">东南</span><span class="ne">西南</span><span class="ne">西北</span></div>';

  if (wind7circle1 != '-') {
    value +=
      '<div ><span class="th1">七级</span><span class="ne">' +
      wind7circle1 +
      '</span><span class="ne">' +
      wind7circle2 +
      '</span><span class="ne">' +
      wind7circle3 +
      '</span><span class="ne">' +
      wind7circle4 +
      '</span><span >(千米)</span></div>';
  }
  if (wind10circle1 != '-') {
    value +=
      '<div ><span class="th1">十级</span><span class="ne">' +
      wind10circle1 +
      '</span><span class="ne">' +
      wind10circle2 +
      '</span><span class="ne">' +
      wind10circle3 +
      '</span><span class="ne">' +
      wind10circle4 +
      '</span><span >(千米)</span></div>';
  }
  if (wind12circle1 != '-') {
    value +=
      '<div ><span class="th1">十二级</span><span class="ne">' +
      wind12circle1 +
      '</span><span class="ne">' +
      wind12circle2 +
      '</span><span class="ne">' +
      wind12circle3 +
      '</span><span class="ne">' +
      wind12circle4 +
      '</span><span >(千米)</span></div>';
  }

  value += '</div>';
  value += '</div>';
  return value;
}

TyphoonHelper.line = function (prejson, json) {
  var color = TyphoonHelper.TyphoonLevelColor(prejson.WINDVELOCITY);
  var line = TyphoonHelper.addLine(
    prejson.LON,
    prejson.LAT,
    json.LON,
    json.LAT,
    2,
    null,
    color,
    function () {
      return;
    },
    function () {
      return;
    },
  );
  line.id = 'location_line_' + json.TYPHOONNO;
  json.line = line;
};
TyphoonHelper.MoveToLocationPoint = function (datestr, rowData) {
  var lat = rowData.LAT;
  var lng = rowData.LON;

  //点击台风列表的每一行，响应的弹出该点的popup。
  var json = rowData;

  var values = createTyPop(json);
  //values--------------
  var html = values;

  var latlng = L.latLng(lat, lng);
  var popup = L.popup()
    .setLatLng(latlng)
    .setContent(html)
    .openOn(maphelper.map);
  globalParam.typhoonPopup = popup;
  //此处略作修改，将点击的台风的那一行的数据传过来用作移动的终点。
  // maphelper.moveTo(rowData.LON, rowData.LAT, maphelper.map.getZoom())
};
TyphoonHelper.DrawForecasts = function (publisher, typhoonno) {
  // var babj0datajson = json;  //台风某个时间的数据
  // typhoonDateMap[typhoonno] = json;
  // var jsondatalist = new Array();

  var thisTyMaxTime = 0;
  var thisTyList = [];
  if (jsonListMap[publisher] != undefined) {
    for (var j = 0; j < jsonListMap[publisher].length; j++) {
      var jsondata = jsonListMap[publisher][j];
      // 先找出最大时间
      if (
        (jsondata.TYPHOONNO == typhoonno || typhoonno == '-1') &&
        jsondata.FORECASTTIMES != 0
      ) {
        if (+jsondata.YYYYMMDDHHMM.substr(0, 10) > thisTyMaxTime) {
          thisTyMaxTime = +jsondata.YYYYMMDDHHMM.substr(0, 10);
          thisTyList = [];
          thisTyList.push(jsondata);
        } else if (+jsondata.YYYYMMDDHHMM.substr(0, 10) === thisTyMaxTime) {
          thisTyList.push(jsondata);
        }
      }
    }
    for (var j = 0; j < jsonListMap[publisher].length; j++) {
      var jsondata = jsonListMap[publisher][j];
      // 找出预报的原点
      if (
        (jsondata.TYPHOONNO == typhoonno || typhoonno == '-1') &&
        jsondata.FORECASTTIMES == 0 &&
        +jsondata.YYYYMMDDHHMM.substr(0, 10) == thisTyMaxTime
      ) {
        thisTyList.push(jsondata);
      }
    }
  }

  thisTyList.sort(function (x, y) {
    return x.FORECASTTIMES > y.FORECASTTIMES ? 1 : -1;
  });

  TyphoonHelper.DrawForecast(thisTyList, typhoonno, publisher);
};
TyphoonHelper.RemoveForecast = function (typhoonno, publisher) {
  if (TyphoonHelper.ElementListMap) {
    for (key in TyphoonHelper.ElementListMap) {
      for (var i = 0; i < TyphoonHelper.ElementListMap[key].length; i++) {
        if (TyphoonHelper.ElementListMap[key][i] != undefined) {
          if (TyphoonHelper.ElementListMap[key][i].forecastmarker) {
            if (
              ((TyphoonHelper.ElementListMap[key][i].forecastmarker.id.indexOf(
                typhoonno,
              ) >= 0 ||
                typhoonno == '-1') &&
                TyphoonHelper.ElementListMap[key][i].forecastmarker.id.indexOf(
                  'forecast',
                ) >= 0 &&
                TyphoonHelper.ElementListMap[key][i].forecastmarker.id.indexOf(
                  publisher,
                ) >= 0) ||
              publisher == '-1'
            ) {
              //key==TOKAGE              _VHHH
              //forecast_marker_1625_TOKAGE              _VHHH
              //forecast_marker_1624_MA-ON               _RJTD
              TyphoonHelper.ElementListMap[key][i].forecastmarker.remove();
              delete TyphoonHelper.ElementListMap[key][i].forecastmarker;
            }
          }
          if (TyphoonHelper.ElementListMap[key][i].forecastline) {
            if (
              ((TyphoonHelper.ElementListMap[key][i].forecastline.id.indexOf(
                typhoonno,
              ) >= 0 ||
                typhoonno == '-1') &&
                TyphoonHelper.ElementListMap[key][i].forecastline.id.indexOf(
                  'forecast',
                ) >= 0 &&
                TyphoonHelper.ElementListMap[key][i].forecastline.id.indexOf(
                  publisher,
                ) >= 0) ||
              publisher == '-1'
            ) {
              //TOKAGE              _VHHH
              //forecast_line_1625_TOKAGE              _VHHH
              //forecast_line_1624_MA-ON               _RJTD
              TyphoonHelper.ElementListMap[key][i].forecastline.remove();
              delete TyphoonHelper.ElementListMap[key][i].forecastline;
            }
          }
        }
      }
    }
  }
};
TyphoonHelper.RemoveForecastByPublisher = function (typhoonno, publisher) {
  if (TyphoonHelper.ElementListMap) {
    for (key in TyphoonHelper.ElementListMap) {
      for (var i = 0; i < TyphoonHelper.ElementListMap[key].length; i++) {
        if (TyphoonHelper.ElementListMap[key][i] != undefined) {
          if (TyphoonHelper.ElementListMap[key][i].forecastmarker) {
            if (
              TyphoonHelper.ElementListMap[key][i].forecastmarker.id.indexOf(
                typhoonno,
              ) >= 0
            ) {
              //key==TOKAGE              _VHHH
              //forecast_marker_1625_TOKAGE              _VHHH
              //forecast_marker_1624_MA-ON               _RJTD
              TyphoonHelper.ElementListMap[key][i].forecastmarker.remove();
              delete TyphoonHelper.ElementListMap[key][i].forecastmarker;
            }
          }
          if (TyphoonHelper.ElementListMap[key][i].forecastline) {
            if (
              TyphoonHelper.ElementListMap[key][i].forecastline.id.indexOf(
                typhoonno,
              ) >= 0
            ) {
              //TOKAGE              _VHHH
              //forecast_line_1625_TOKAGE              _VHHH
              //forecast_line_1624_MA-ON               _RJTD
              TyphoonHelper.ElementListMap[key][i].forecastline.remove();
              delete TyphoonHelper.ElementListMap[key][i].forecastline;
            }
          }
        }
      }
    }
  }
};
TyphoonHelper.DrawForecast = function (dataList, typhoonno, publisher) {
  TyphoonHelper.RemoveForecast(typhoonno, publisher); //移除台风预报的点
  for (var i = 1; i < dataList.length; i++) {
    TyphoonHelper.forecastline(
      dataList[i - 1],
      dataList[i],
      publisher,
      typhoonno,
    );
  }
  for (var i = 1; i < dataList.length; i++) {
    TyphoonHelper.forecastmarker(dataList[i], publisher);
  }
  TyphoonHelper.ElementListMap[typhoonno + '_' + publisher] = dataList;
};
TyphoonHelper.forecastline = function (prejson, json, publisher, typhoonno) {
  //调用台风预报划线的方法
  if (json != undefined) {
    var publish = publisher.split('_');
    var color = TyphoonHelper.TyphoonPublisherColor(publish[1]);
    var line = TyphoonHelper.addLine(
      prejson.LON,
      prejson.LAT,
      json.LON,
      json.LAT,
      1,
      '5,5',
      color,
      function () {
        return;
      },
      function () {
        return;
      },
    );
    line.id = 'forecast_line_' + json.TYPHOONNO + '_' + publisher;
    json.forecastline = line;
  }
};
TyphoonHelper.forecastmarker = function (json, publisher) {
  if (json != undefined) {
    var typhonnname;
    var datestr;
    var lonlat;
    var press;
    var windvelocity;
    var level;
    var img, lng, lat;
    lng = json.LON;
    lat = json.LAT;
    var lngs = 0;
    var lats = 0;
    if (+lng > 0) {
      lngs = lng + 'E';
    } else if (+lng < 0) {
      lngs = Math.abs(+lng) + 'W';
    } else {
      lngs = 0;
    }
    if (+lat > 0) {
      lats = lat + 'N';
    } else if (+lat < 0) {
      lats = Math.abs(+lat) + 'S';
    } else {
      lats = 0;
    }
    img = TyphoonHelper.TyphoonLevelImage(json.WINDVELOCITY);
    typhonnname = json.TYPHOONNAME;
    var typhoonNu = json.TYPHOONNO;
    var date = $.parseDate(json.YYYYMMDDHHMM, 'yyyyMMddHHmm');
    date.setHours(date.getHours() + parseInt(json.FORECASTTIMES) + 8);
    //		date.setHours(date.getHours() + json.FORECASTTIMES);
    datestr = date.format('MM月dd日HH时');
    lonlat = lngs + '/' + lats;
    press = json.PRESS == '999999' ? '-' : json.PRESS;
    windvelocity = json.WINDVELOCITY == '999999' ? '-' : json.WINDVELOCITY;
    level =
      json.WINDVELOCITY == '999999'
        ? '-'
        : TyphoonHelper.TyphoonLevelName(json.WINDVELOCITY);
    var m = TyphoonHelper.addClickableMaker(
      lng,
      lat,
      {
        url: ctxStatic + '/ultras/img/typhoon/' + img + '.png',
        w: 10,
        h: 10,
      },
      function () {
        /*	var values = '台风名称: ' + typhonnname + '<br>时        间: ' + datestr + '<br>等        级: ' + level + '<br>预报机构: ' + TyphoonHelper.TyphoonPublisher(publisher) + '<br>中心位置: ' + lonlat + '<br>最大风速: ' + windvelocity
         + '<br>中心气压: ' + press;*/
        var typhName = typhoonNameMap[typhoonNu + ''];
        if (typhName == undefined || typhName == null) {
          typhName = '热带低压';
        }
        var values =
          '<div class=\'forcastPoint\'><div class="boxTitle">' +
          json.TYPHOONNO +
          typhName +
          '</div><div class="boxContent"><table>' +
          '<tr><td>预报时间:&nbsp;</td><td>' +
          datestr +
          '</td></tr><tr><td>等&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级:&nbsp;</td><td>' +
          level +
          '</td></tr><tr><td>预报机构:&nbsp;</td><td>' +
          TyphoonHelper.TyphoonPublisher(publisher) +
          '</td></tr><tr><td>中心位置:&nbsp;</td><td>' +
          lonlat +
          '</td></tr>' +
          '<tr><td>最大风速:&nbsp;</td><td>' +
          windvelocity +
          '米/秒</td></tr><tr id="lastTr"><td>中心气压:&nbsp;</td><td>' +
          press +
          '百帕</td></tr></table></div></div>';
        return values;
      },
      function () {
        var typhName = typhoonNameMap[typhoonNu + ''];
        if (typhName == undefined || typhName == null) {
          typhName = '热带低压';
        }
        var values =
          '<div class=\'forcastPoint\'><div class="boxTitle">' +
          json.TYPHOONNO +
          typhName +
          '</div><div class="boxContent"><table>' +
          '<tr><td>预报时间:&nbsp;</td><td>' +
          datestr +
          '</td></tr><tr><td>等&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级:&nbsp;</td><td>' +
          level +
          '</td></tr><tr><td>预报机构:&nbsp;</td><td>' +
          TyphoonHelper.TyphoonPublisher(publisher) +
          '</td></tr><tr><td>中心位置:&nbsp;</td><td>' +
          lonlat +
          '</td></tr>' +
          '<tr><td>最大风速:&nbsp;</td><td>' +
          windvelocity +
          '米/秒</td></tr><tr id="lastTr"><td>中心气压:&nbsp;</td><td>' +
          press +
          '百帕</td></tr></table></div></div>';
        return values;
      },
    );
    m.id = 'forecast_marker_' + json.TYPHOONNO + '_' + publisher;
    json.forecastmarker = m;
  }
};
TyphoonHelper.addLine = function (
  beginx,
  beginy,
  endx,
  endy,
  lineweight,
  dash,
  colorstr,
  cfn,
  hfn,
) {
  //根据起始经纬度画出路径线
  var configs = {};
  var prepoint = new L.LatLng(beginy, beginx);
  var currpoint = new L.LatLng(endy, endx);
  var pointList = [prepoint, currpoint];
  var line = new L.Polyline(pointList, {
    color: colorstr,
    weight: lineweight,
    dashArray: dash,
    smoothFactor: 1,
  }).addTo(maphelper.map);
  line.on('popupopen', function (e) {
    this.pinged = false;
  });
  if (hfn) {
  }
  if (cfn) {
  }
  return {
    remove: function () {
      maphelper.map.removeLayer(line);
    },
  };
};
TyphoonHelper.addPloy = function (
  latlngs,
  linecolor,
  lineweight,
  areacolor,
  cfn,
  hfn,
) {
  //添加图元
  var poly = new L.Polygon(latlngs, {
    color: linecolor,
    weight: lineweight,
    fillColor: areacolor,
    fillOpacity: 0.6,
    smoothFactor: 1,
  }).addTo(maphelper.map);
  poly.on('popupopen', function (e) {
    this.pinged = false;
  });
  if (hfn) {
  }
  if (cfn) {
  }
  return {
    remove: function () {
      // console.log("remove")
      maphelper.map.removeLayer(poly);
    },
  };
};
TyphoonHelper.addCircle = function (
  latlng,
  radius,
  linecolor,
  lineweight,
  areacolor,
  cfn,
  hfn,
) {
  var circle = new L.circle(latlng, radius, {
    color: linecolor,
    weight: lineweight,
    fillColor: areacolor,
    fillOpacity: 0.3,
  }).addTo(maphelper.map);
  circle.on('popupopen', function (e) {
    this.pinged = false;
  });
  if (hfn) {
  }
  if (cfn) {
  }
  return {
    remove: function () {
      maphelper.map.removeLayer(circle);
    },
  };
};
TyphoonHelper.addClickableMaker = function (x, y, iconUrl, cfn, hfn) {
  //圆圈点击事件x\y经纬度，iconUrl图片链接，cfn方法，hfn方法（返回悬浮时的文字）
  var licon = L.Icon.Default;
  var w = 16;
  var h = 16;
  var configs = {};
  var url = '';
  if ($.type(iconUrl) == 'string') {
    url = iconUrl;
    configs = {
      iconUrl: iconUrl,
      iconSize: [w, h],
      iconAnchor: [w / 2, h / 2],
    };
  } else if ($.isPlainObject(iconUrl)) {
    url = iconUrl.url;
    w = iconUrl.w;
    h = iconUrl.h;
    configs = {
      iconUrl: iconUrl.url,
      iconSize: [w, h],
      iconAnchor: [w / 2, h / 2],
    };
  }
  licon = L.icon(configs);
  if (c == 0) {
    // console.log("进入最后一个了")
  }
  var m = L.marker([y, x], {
    icon: licon,
    riseOffset: 6000,
  }).addTo(maphelper.map); //创建icon对象，并存放到maphelper.map中

  if (c == 0) {
    // console.log("添加了图标")
  }
  m.on('popupopen', function (e) {
    this.pinged = false;
  });
  if (c == 0) {
    // console.log("hfn")
    // console.log(hfn)
  }
  if (hfn) {
    m.on('mouseover', function (e) {
      if (this.pinged) {
        return;
      }
      var html = hfn();

      var p = e.target._popup;

      var licon2 = L.Icon.Default;
      configs = {
        iconUrl: url,
        iconSize: [w + 5, w + 5],
      };
      licon2 = L.icon(configs);
      if (url.indexOf('typhooncenter.gif') == -1) {
        var mm = L.marker([y, x], {
          icon: licon2,
        }).addTo(maphelper.map);
        TyphoonHelper.hoverPoint.push(mm);
        var bindFlag = false;
        mm.on('mouseover', function (e) {
          bindFlag = true;
          e.target
            .bindPopup(html, {
              offset: L.point(0, -h / 2),
              closeButton: false,
            })
            .openPopup();
        });
        mm.on('mouseout', function (e) {
          if (this.pinged) {
            return;
          }
          maphelper.map.removeLayer(mm);
          e.target.closePopup();
        });
      } else {
        e.target
          .bindPopup(html, {
            offset: L.point(0, -h / 2),
          })
          .openPopup();
        m.on('mouseout', function (e) {
          e.target.closePopup();
        });
      }
    });
  }

  if (cfn) {
    m.on('click', function (e) {
      this.pinged = true;
      var html = cfn();
      var p = e.target._popup;
      if (p) {
        p._close();
        p.setContent(html);
        if (!p._isOpen) {
          p.openOn(maphelper.map);
        }
      } else {
        e.target
          .bindPopup(html, {
            offset: L.point(0, -h / 2),
          })
          .openPopup();
      }
    });
  }
  return {
    remove: function () {
      maphelper.map.removeLayer(m);
    },
  };
};
TyphoonHelper.addClickableStationMaker = function (x, y, radial, cfn, hfn) {
  var licon = L.Icon.Default;
  var m = new L.circle([y, x], radial, {
    color: '#ffffff',
    weight: 2,
    fillColor: '#00ff00',
    fillOpacity: 0.8,
  }).addTo(maphelper.map);
  m.on('popupopen', function (e) {
    this.pinged = false;
  });
  if (hfn) {
    m.on('mouseover', function (e) {
      if (this.pinged) {
        return;
      }
      var html = hfn();
      var p = e.target._popup;
      if (p) {
        p.setContent(html);
        if (!p._isOpen) {
          p.openOn(maphelper.map);
        }
      } else {
        e.target
          .bindPopup(html, {
            offset: L.point(0, -h / 2),
          })
          .openPopup();
      }
    });
  }
  if (cfn) {
    m.on('click', function (e) {
      this.pinged = true;
      var html = cfn();
      var p = e.target._popup;
      if (p) {
        p._close();
        p.setContent(html);
        if (!p._isOpen) {
          p.openOn(maphelper.map);
        }
      } else {
        e.target
          .bindPopup(html, {
            offset: L.point(0, -h / 2),
          })
          .openPopup();
      }
    });
  }
  return {
    remove: function () {
      maphelper.map.removeLayer(m);
    },
  };
};

/**
 *
 * @param radius  radius貌似是墨卡托的
 * @param lng   这俩为什么是一般的
 * @param lat
 * @returns {Array}
 * @constructor
 *
 *Radius长度为4的时候   东北  东南 西南 西北
 *Radius[0] 在第一象限
 *Radius[1] 在第四象限
 *Radius[2] 在第三象限
 *Radius[3] 在二象限

 *Radius长度为1的时候
 *画圆
 *
 * 然后墨卡托点转化为一般点
 */
TyphoonHelper.WindCirclePoints = function (radius, lng, lat) {
  var points = new Array();
  var latlng = TyphoonHelper.Location2Mercator(new L.LatLng(lat, lng));
  lng = latlng.lng;
  lat = latlng.lat;
  if (radius.length == 4) {
    for (var i = 0.0; i <= 90.0; i++) {
      // radius[0]
      var x = lng + Math.cos((Math.PI * i) / 180.0) * radius[0];
      var y = lat + Math.sin((Math.PI * i) / 180.0) * radius[0];
      var pa = new L.LatLng(y, x);
      points.push(pa);
    }
    for (var i = 90.0; i <= 180.0; i++) {
      var x = lng + Math.cos((Math.PI * i) / 180.0) * radius[3];
      var y = lat + Math.sin((Math.PI * i) / 180.0) * radius[3];
      var pa = new L.LatLng(y, x);
      points.push(pa);
    }
    for (var i = 180.0; i <= 270.0; i++) {
      var x = lng + Math.cos((Math.PI * i) / 180.0) * radius[2];
      var y = lat + Math.sin((Math.PI * i) / 180.0) * radius[2];
      var pa = new L.LatLng(y, x);
      points.push(pa);
    }
    for (var i = 270.0; i <= 360.0; i++) {
      var x = lng + Math.cos((Math.PI * i) / 180.0) * radius[1];
      var y = lat + Math.sin((Math.PI * i) / 180.0) * radius[1];
      var pa = new L.LatLng(y, x);
      points.push(pa);
    }
  }
  //points = TyphoonHelper.ContourToSmoonth(points);//找不到方法
  var ii = 0;
  for (var i = 0; i < points.length; i++) {
    points[i] = TyphoonHelper.Mercator2Location(
      new L.LatLng(points[i].lat, points[i].lng),
    );
  }
  return points;
};
TyphoonHelper.GerateAramLine = function () {
  //画出24小时与48小时警戒线
  /*TyphoonHelper.addLine(127.00, 34.00, 127.00, 22.00, 1, null, '#ffff00', null, null);
    TyphoonHelper.addLine(127.00, 22.00, 119.00, 18.00, 1, null, '#ffff00', null, null);
    TyphoonHelper.addLine(119.00, 18.00, 119.00, 11.00, 1, null, '#ffff00', null, null);
    TyphoonHelper.addLine(119.00, 11.00, 113.00, 4.50, 1, null, '#ffff00', null, null);
    TyphoonHelper.addLine(113.00, 4.50, 105.00, 0.00, 1, null, '#ffff00', null, null);
    TyphoonHelper.addLine(105.00, 0.00, 120.00, 0.00, 1, null, '#0000ff', null, null);
    TyphoonHelper.addLine(120.00, 0.00, 132.00, 15.00, 1, null, '#0000ff', null, null);
    TyphoonHelper.addLine(132.00, 15.00, 132.00, 34.00, 1, null, '#0000ff', null, null);*/
  TyphoonHelper.addLine(
    127.0,
    34.0,
    127.0,
    22.0,
    2,
    null,
    '#F81142',
    null,
    null,
  );
  TyphoonHelper.addLine(
    127.0,
    22.0,
    119.0,
    18.0,
    2,
    null,
    '#F81142',
    null,
    null,
  );
  TyphoonHelper.addLine(
    119.0,
    18.0,
    119.0,
    11.0,
    2,
    null,
    '#F81142',
    null,
    null,
  );
  TyphoonHelper.addLine(
    119.0,
    11.0,
    113.0,
    4.5,
    2,
    null,
    '#F81142',
    null,
    null,
  );
  TyphoonHelper.addLine(113.0, 4.5, 105.0, 0.0, 2, null, '#F81142', null, null);
  TyphoonHelper.addLine(105.0, 0.0, 120.0, 0.0, 2, null, '#F6ED36', null, null);
  TyphoonHelper.addLine(
    120.0,
    0.0,
    132.0,
    15.0,
    2,
    null,
    '#F6ED36',
    null,
    null,
  );
  TyphoonHelper.addLine(
    132.0,
    15.0,
    132.0,
    34.0,
    2,
    null,
    '#F6ED36',
    null,
    null,
  );
  TyphoonHelper.addClickableMaker(
    127.0,
    28.0,
    {
      url: ctxStatic + '/ultras/img/typhoon/hour24.png',
      w: 15,
      h: 100,
    },
    null,
    null,
  );
  TyphoonHelper.addClickableMaker(
    132.0,
    28.0,
    {
      url: ctxStatic + '/ultras/img/typhoon/hour48.png',
      w: 15,
      h: 100,
    },
    null,
    null,
  );
  var m = L.marker([25.8143, 123.6172], {
    icon: new L.divIcon({
      className: 'leaflet-divicon',
      html: '钓鱼岛',
      iconSize: [40, 20],
    }),
  }).addTo(maphelper.map); //创建icon对象，并存放到maphelper.map中
  m.on('popupopen', function (e) {
    this.pinged = false;
  });
};
TyphoonHelper.TyphoonLevelName = function (windvelocity) {
  //得到台风级别
  if (windvelocity == '999999') {
    return '缺测';
  } else if (windvelocity < 17.2) {
    return '热带低压';
  } else if (windvelocity >= 17.2 && windvelocity < 24.5) {
    return '热带风暴';
  } else if (windvelocity >= 24.5 && windvelocity < 32.7) {
    return '强热带风暴';
  } else if (windvelocity >= 32.7 && windvelocity < 41.5) {
    return '台风';
  } else if (windvelocity >= 41 && windvelocity < 51.1) {
    return '强台风';
  } else if (windvelocity >= 51.1) return '超强台风';
};
/*TyphoonHelper.TyphoonLevelColor = function(windvelocity) {//根据风速风向得到级别颜色
	if (windvelocity == '999999') {
		return '#FFFFFF'
	} else if (windvelocity < 17.2) {
		return "#00FFDF"
	} else if (windvelocity >= 17.2 && windvelocity < 24.5) {
		return '#FFF300'
	} else if (windvelocity >= 24.5 && windvelocity < 32.7) {
		return '#FF902C'
	} else if (windvelocity >= 32.7 && windvelocity < 41.5) {
		return '#FF0404'
	} else if (windvelocity >= 41 && windvelocity < 51.1) {
		return '#FF3AA3'
	} else if (windvelocity >= 51.1) return '#AE00D9'
};*/
TyphoonHelper.TyphoonLevelImage = function (windvelocity) {
  //获得台风级别对应的图片名称
  if (windvelocity == '999999') {
    return 'typhoonlevel1';
  } else if (windvelocity < 17.2) {
    return 'typhoonlevel1';
  } else if (windvelocity >= 17.2 && windvelocity < 24.5) {
    return 'typhoonlevel2';
  } else if (windvelocity >= 24.5 && windvelocity < 32.7) {
    return 'typhoonlevel3';
  } else if (windvelocity >= 32.7 && windvelocity < 41.5) {
    return 'typhoonlevel4';
  } else if (windvelocity >= 41 && windvelocity < 51.1) {
    return 'typhoonlevel5';
  } else if (windvelocity >= 51.1) return 'typhoonlevel6';
};
TyphoonHelper.TyphoonLevelColor = function (windvelocity) {
  //获得台风级别对应的颜色
  if (windvelocity == '999999') {
    return '#03c3ff';
  } else if (windvelocity < 17.2) {
    return '#03c3ff';
  } else if (windvelocity >= 17.2 && windvelocity < 24.5) {
    return '#b1af00';
  } else if (windvelocity >= 24.5 && windvelocity < 32.7) {
    return '#3cba3c';
  } else if (windvelocity >= 32.7 && windvelocity < 41.5) {
    return '#cc0000';
  } else if (windvelocity >= 41 && windvelocity < 51.1) {
    return '#fa00fa';
  } else if (windvelocity >= 51.1) return '#9e004a';
};

TyphoonHelper.TyphoonPublisherColor = function (publisher) {
  //根据台风信息发布机构确定预报的线条颜色
  if (publisher == '999999') {
    return '#FFFFFF';
  } else if (publisher == 'BABJ') {
    return '#FF0000';
  } else if (publisher == 'RJTD') {
    return '#548B54';
  } else if (publisher == 'PGTW') {
    return '#87CEEB';
  } else if (publisher == 'RCTP') {
    return '#AE00D9';
  } else if (publisher == 'VHHH') {
    return '#B8860B';
  } else if (publisher == 'RKSL') {
    return '#3A5FCD';
  } else if (publisher == 'RPMM') {
    return '#13a8b1';
  }
};
TyphoonHelper.TyphoonPublisher = function (publisher) {
  //根据发布机构得到中文名
  var publish = publisher.split('_');
  if (publish[1] == '999999') {
    return '未知';
  } else if (publish[1] == 'BABJ') {
    return '中国预报';
  } else if (publish[1] == 'RJTD') {
    return '日本预报';
  } else if (publish[1] == 'PGTW') {
    return '美国预报';
  } else if (publish[1] == 'RCTP') {
    return '中国台湾预报';
  } else if (publish[1] == 'VHHH') {
    return '中国香港预报';
  } else if (publish[1] == 'RKSL') {
    return '韩国预报';
  } else if (publish[1] == 'RPMM') {
    return '菲律宾预报';
  }
};
TyphoonHelper.GetDirectFromAngle = function (angle) {
  //获得风向的中文名
  if (angle >= 11.25 && angle < 33.75) return '东北偏北';
  else if (angle >= 33.75 && angle < 56.25) return '东北';
  else if (angle >= 56.25 && angle < 78.75) return '东北偏东';
  else if (angle >= 78.75 && angle < 101.25) return '偏东';
  else if (angle >= 101.25 && angle < 123.75) return '东南偏东';
  else if (angle >= 123.75 && angle < 146.25) return '东南';
  else if (angle >= 146.25 && angle < 168.75) return '东南偏南';
  else if (angle >= 168.75 && angle < 191.25) return '偏南';
  else if (angle >= 191.25 && angle < 213.75) return '西南偏南';
  else if (angle >= 213.75 && angle < 236.25) return '西南';
  else if (angle >= 236.25 && angle < 258.75) return '西南偏西';
  else if (angle >= 258.75 && angle < 281.25) return '偏西';
  else if (angle >= 281.25 && angle < 303.75) return '西北偏西';
  else if (angle >= 303.75 && angle < 326.25) return '西北';
  else if (angle >= 326.25 && angle < 348.75) return '西北偏北';
  else return '偏北';
  return s;
};
TyphoonHelper.Location2Mercator = function (Latlng) {
  var x = (Latlng.lng * 20037508.34) / 180.0;
  var y =
    Math.log(Math.tan(((90.0 + Latlng.lat) * Math.PI) / 360.0)) /
    (Math.PI / 180.0);
  y = (y * 20037508.34) / 180.0;
  var mercator = new L.LatLng(y, x);
  return mercator;
};
TyphoonHelper.Mercator2Location = function (mercator) {
  var x = (mercator.lng / 20037508.34) * 180.0;
  var y = (mercator.lat / 20037508.34) * 180.0;
  y =
    (180.0 / Math.PI) *
    (2.0 * Math.atan(Math.exp((y * Math.PI) / 180.0)) - Math.PI / 2.0);
  var Latlng = new L.LatLng(y, x);
  return Latlng;
};
/*TyphoonHelper.setLegend = function(legendID,data) {//动态生成图例
	//0.01 166,242,143;5 86,189,147;15 107,193,244;30 30,30,241;70 255,22,250;140 145,28,80
	alert(data);
	if (!data) return;

	function createTR(text, color) {
		return '<tr style="line-height:10px"> <td>' + text + '</td><td bgColor="' + color + '" style="width:10px;height:9px;"></td></tr>'
	};
	var $legend = $('#' + legendID);
	$legend.empty();
	var cBox = $('<table>', {
		border: "0",
		cellpadding: "0",
		cellspacing: "0"
	});
	var c2Box = $('<table>', {
		border: "0",
		cellpadding: "0",
		cellspacing: "0"
	});
	var arrs = data.split(";");
	var len = arrs.length;
	var half = ~~ (len / 2);
	var cross = len >= 12;
	if (cross) {
		for (var i = 0; i < half; i++) {
			var arr = arrs[i];
			var textColor = arr.split(" ");
			var text = textColor[0];
			var nums = [];
			var colorStr = textColor.length == 1 ? '255,255,255' : textColor[1];
			var cols = colorStr.split(",");
			for (var j = 0; j < cols.length; j++) {
				nums.push(parseInt(cols[j]).toString(16))
			};
			var tr = createTR(i % 2 == 0 ? '' : text, nums);
			cBox.append(tr)
		}
		for (var i = half; i < len; i++) {
			var arr = arrs[i];
			var textColor = arr.split(" ");
			var text = textColor[0];
			var colorStr = textColor.length == 1 ? '255,255,255' : textColor[1];
			var cols = colorStr.split(",");
			var nums = [];
			for (var j = 0; j < cols.length; j++) {
				nums.push(parseInt(cols[j]).toString(16))
			};
			var tr = createTR(i % 2 == 0 ? '' : text, nums);
			c2Box.append(tr)
		}
	} else {
		for (var i = 0; i < len; i++) {
			var arr = arrs[i];
			var textColor = arr.split(" ");
			var text = textColor[0];
			var colorStr = textColor.length == 1 ? '255,255,255' : textColor[1];
			var cols = colorStr.split(",");
			var nums = [];
			for (var j = 0; j < cols.length; j++) {
				nums.push(parseInt(cols[j]).toString(16))
			};
			var tr = createTR(text, nums);
			cBox.append(tr)
		}
	}
	$legend.append("<table><tr><td class='cBox'></td><td class='c2Box'></td></tr></table>");
	$legend.find('.cBox').append(cBox);
	$legend.find('.c2Box').append(c2Box)
};*/
//动态添加左侧图例
TyphoonHelper.setLegend = function (legendID, elementType, data) {
  if (!data) return;
  var titleName = '';
  var subType = '';
  var titleName = '';
  var legendHtml = '';
  if (elementType == 'SATE') {
    subType = $("#SATEtimes input[name='satetimes']:checked").attr('value');
  }
  var $legend = $('#' + legendID);
  $legend.empty();
  var arrs = data.split(';');
  for (var i = 0; i < arrs.length; i++) {
    var arr = arrs[i];
    var textColor = arr.split(' ');
    legendHtml +=
      '<div class="lendIcon"><div class="IconColor" style="background-color:rgb(' +
      textColor[1] +
      ');">' +
      '</div><div class="IconName">' +
      textColor[0] +
      '</div></div>';
  }
  if (arrs.length % 2 != 0) {
    legendHtml +=
      '<div class="lendIcon"><div class="IconColor"></div><div class="IconName"></div></div>';
  }
  if (elementType == 'R' || subType == 'pre') {
    titleName = '降雨量（mm）';
  }
  if (elementType == 'W') {
    titleName = '风向风速(m/s)';
  }
  $legend.append(
    '<div class="smallTitle"><span style="margin-left: 10px;">' +
      titleName +
      '</span></div><div class="smallLegendBox">' +
      legendHtml +
      '</div>',
  );
};
TyphoonHelper.addImage = function (imageUrl, minX, minY, maxX, maxY, f) {
  var imageBounds = [
    [minY, minX],
    [maxY, maxX],
  ];
  var imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
    opacity: f,
  }).addTo(maphelper.map);
  return {
    remove: function () {
      try {
        if (imageOverlay._image && maphelper.map) {
          maphelper.map.getPanes().overlayPane.removeChild(imageOverlay._image);
        }
      } catch (e) {}
    },
  };
  var clazz = 'image_';
  var l = maphelper.map.extent.left;
  var t = maphelper.map.extent.top;
  var r = maphelper.map.extent.right;
  var b = maphelper.map.extent.bottom;
  minX = minX ? minX : l;
  maxX = maxX ? maxX : r;
  minY = minY ? minY : b;
  maxY = maxY ? maxY : t;
  f = f ? f : 1;
  return $('<img>', {
    src: imageUrl,
    class: clazz,
    alt: '图片:' + imageUrl,
    load: function () {
      var $img = $(this);
      $img
        .css({
          height: ((maxY - minY) * 100.0) / (t - b) + '%',
          width: ((maxX - minX) * 100.0) / (r - l) + '%',
          left: ((minX - l) * 100.0) / (r - l) + '%',
          top: ((maxY - t) * 100.0) / (b - t) + '%',
          filter: 'alpha(opacity=' + f * 100 + ')',
          '-moz-opacity': f,
          opacity: f,
        })
        .show();
    },
  })
    .hide()
    .css('position', 'absolute')
    .appendTo(maphelper.$elebox);
};
TyphoonHelper.GetDistance = function (startLat, startLng, endLat, endLng) {
  var radStartLat = TyphoonHelper.Angle2Radian(startLat);
  var radEndLat = TyphoonHelper.Angle2Radian(endLat);
  var radStartLng = TyphoonHelper.Angle2Radian(startLng);
  var radEndLng = TyphoonHelper.Angle2Radian(endLng);
  var latDiff = radStartLat - radEndLat;
  var lngDiff = radStartLng - radEndLng;
  var result =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(latDiff / 2), 2) +
          Math.cos(radStartLat) *
            Math.cos(radEndLat) *
            Math.pow(Math.sin(lngDiff / 2), 2),
      ),
    );
  return Math.round(result * 6378.137 * 10000.0) / 10000.0;
};
TyphoonHelper.Angle2Radian = function (angle) {
  return (angle * Math.PI) / 180.0;
};
Array.prototype.timeunique = function () {
  this.sort(function (a, b) {
    return a.DT.localeCompare(b.DT);
  });
  var re = [this[0]];
  for (var i = 1; i < this.length; i++) {
    if (this[i].DT != re[re.length - 1].DT) {
      re.push(this[i]);
    }
  }
  return re;
};
Array.prototype.stationunique = function () {
  this.sort(function (a, b) {
    return a.DT.localeCompare(b.DT);
  });
  var re = [this[0]];
  for (var i = 1; i < this.length; i++) {
    if (this[i].DT != re[re.length - 1].DT) {
      re.push(this[i]);
    }
  }
  return re;
};

window.TyphoonHelper = TyphoonHelper;
export { playtyphooontimer };
export default TyphoonHelper;
