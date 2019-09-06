/**
 * @date: 2019-07-13 12:41:11
 * @description:  渲染图
 */

import staPoint from "./station-point";
import { maphelper } from "./maphelper";
import { common } from "./common";
/**
 * flag=1 格点 flag=2站点 flag=3预报
 */
export function getLegend(funItemMenuId, position, flag) {
  $.ajax({
    url: ctx + "/multiExhibition/getLegend",
    type: "get",
    dataType: "json",
    async: false,
    data: {
      funItemMenuId: funItemMenuId,
      position: position
    },
    success: function(result) {
      if (result) {
        appendLegend(funItemMenuId, result, flag);
        if (flag === 1) {
          //土壤湿度
          common.legend = result.list;
          setInterval(result.list);
        } else if (flag === 2) {
          //实况资料
          setDataRange(result);
        }
      }
    }
  });
}

/**
 * 获取渲染图
 * @param typeCode 类型
 * @param dateTime 时间字符串，如2019071311
 */
export function getColorMap(typeCode, dateTime) {
  $.ajax({
    url: ctx + "/gis/getColorMap",
    type: "get",
    dataType: "json",
    async: false,
    data: {
      typeCode: typeCode,
      dateTime: dateTime
    },
    success: function(data) {
      if (data.returnCode === "0") {
        globalParam.fcstDateTime = data.DS.D_DATETIME;
        let obj = data.DS;
        if (staPoint.img) {
          staPoint.img.changeUrl(obj.url, 0.8);
        } else {
          staPoint.img = maphelper.addImage(
            obj.url,
            72.4,
            15.5,
            136.5,
            54.5,
            0.8
          );
        }
      }
    }
  });
}
/**
 * 添加图例
 * @param {*} funItemMenuId
 * @param {*} result
 * @param {*} flag
 */
export function appendLegend(funItemMenuId, result, flag) {
  let list = result.list;
  let len = list.length;
  let width = 242 / len + "px";
  let strHtml =
    "<div class='lgd_top'><span class='lgd_name'>" +
    result.name +
    "(" +
    result.unit +
    ")" +
    "</span>";
  if (flag === 1) {
    //重新赋值
    strHtml =
      "<div class='lgd_top'><span class='lgd_name'>融合分析</span></div>";
    strHtml +=
      "<div class='smallTitle'><span style='margin-left: 10px;'>" +
      result.name +
      "(" +
      result.unit +
      ")</span><span class='lgd_time' id='lgd_fxtime'></span></div>";
  } else if (flag === 2) {
    //重新赋值
    strHtml = "<div class='lgd_top'><span class='lgd_name'>实况</span></div>";
    let time = staPoint.datetime;
    if (time == undefined || time === "") {
      time = common.getCurrDate("yyyy-MM-dd HH");
    } else {
      time =
        time.substring(0, 4) +
        "-" +
        time.substring(4, 6) +
        "-" +
        time.substring(6, 8) +
        " " +
        time.substring(8, 10) +
        "时";
    }
    strHtml +=
      "<div class='smallTitle'><span style='margin-left: 10px;'>" +
      result.name +
      "(" +
      result.unit +
      ")</span><span class='lgd_time' >" +
      time +
      "</span></div>";
  } else if (flag === 3) {
    //重新赋值
    strHtml = "<div class='lgd_top'><span class='lgd_name'>预报</span></div>";
    //let time = globalParam.fcsttime;
    let time = globalParam.fcstDateTime;
    if (time == undefined || time == null) {
      time = new Date();
    }
    let time2 = new Date(
      time.substring(0, 4),
      time.substring(4, 6) - 1,
      time.substring(6, 8),
      time.substring(8, 10)
    );
    time2.setDate(time2.getDate() + 1);
    let timestr = time2.format("yyyyMMddHH") + "0000";
    if (time == undefined || time === "") {
      time = common.getCurrDate("yyyy-MM-dd HH");
    } else {
      //time = time.substring(0,4)+ "-" + time.substring(4,6)+ "-" + time.substring(6,8)+ " " + time.substring(8,10) + "时";
      time3 =
        time.substring(4, 6) +
        "月" +
        time.substring(6, 8) +
        "日" +
        time.substring(8, 10) +
        "时";
      time4 =
        timestr.substring(4, 6) +
        "月" +
        timestr.substring(6, 8) +
        "日" +
        timestr.substring(8, 10) +
        "时";
      //time2 = timestr.substring(0,4)+ "月" + timestr.substring(4,6)+ "" + timestr.substring(6,8)+ " " + timestr.substring(8,10) + "时";
    }
    //strHtml += "<span class='lgd_time'>"+time+"</span></div>";
    strHtml +=
      "<div class='smallTitle'><span style='margin-left: 10px;'>" +
      result.name +
      "(" +
      result.unit +
      ")</span><span class='lgd_time' >" +
      time3 +
      "—" +
      time4 +
      "</span></div>";
  }
  strHtml += "<div class='lgd_bottom'>";
  strHtml += "<div class='lgd_color'>";
  for (let i = 0; i < list.length; i++) {
    strHtml +=
      "<div style='width:" +
      width +
      ";height:12px;background-color:" +
      list[i].color +
      ";float:left;'></div>";
  }
  strHtml += "</div>";
  strHtml += "<div class='lgd_label'>";
  if (list.length < 16) {
    if (flag === 1 && funItemMenuId === "1151302041") {
      for (let i = 0; i < list.length; i++) {
        let name = list[i].name;
        strHtml +=
          "<div style='width:" +
          width +
          ";float:left;font-size:12px;text-align:right;'>" +
          (name / 100).toFixed(2) +
          "</div>";
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        let name = list[i].name;
        strHtml +=
          "<div style='width:" +
          width +
          ";float:left;font-size:12px;text-align:right;'>" +
          name +
          "</div>";
      }
    }
  } else {
    if (flag === 1 && funItemMenuId === "1151302041") {
      for (let i = 1; i < list.length; i = i + 4) {
        let name = list[i].name;
        strHtml +=
          "<div style='width:" +
          4 * parseInt(width) +
          "px;float:left;font-size:12px;text-align:right;'>" +
          (name / 100).toFixed(2) +
          "</div>";
      }
    } else {
      for (let i = 2; i < list.length; i = i + 3) {
        let name = list[i].name;
        strHtml +=
          "<div style='width:" +
          3 * parseInt(width) +
          "px;float:left;font-size:12px;text-align:right;'>" +
          name +
          "</div>";
      }
    }
  }
  strHtml += "</div></div>";
  if (flag === 1) {
    $(".lgd_soli").empty();
    $(".lgd_soli").append(strHtml);
  } else if (flag === 2) {
    $(".lgd_sk").empty();
    $(".lgd_sk").append(strHtml);
  } else if (flag === 3) {
    $(".lgd_fcst").empty();
    $(".lgd_fcst").append(strHtml);
    $(".lgd_fcst").show();
  }
}

export function setDataRange(result) {
  globalParam.spiltList = [];
  let list = result.list;
  let len = list.length;
  for (let i = 0; i < len; i++) {
    let obj = {};
    let rule = list[i].rule;
    let arrRule = rule.split(",");
    let start = arrRule[0];
    let end = arrRule[1];
    if (start == "") {
      obj.end = Number(end);
      obj.color = list[i].color;
    }
    if (end == "") {
      obj.start = Number(start);
      obj.color = list[i].color;
    }
    if (start != "" && end != "") {
      obj.start = Number(start);
      obj.end = Number(end);
      obj.color = list[i].color;
    }
    globalParam.spiltList.push(obj);
  }
}

export function setInterval(list) {
  let length = list.length;
  if (length > 0) {
    let interval = [];
    let color = [];
    for (let i = 0; i < length; i++) {
      if (list[i].name !== "") {
        interval.push(Number(list[i].name));
        color.push(list[i].color);
      }
    }
    grid.interval = interval;
    grid.color = color;
  }
}
