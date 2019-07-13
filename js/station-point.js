/**
 * 自动站点工具类封装
 */

import atdts from './atdt'
import {maphelper} from './maphelper';
import {EchartsLayer} from './echartslayer'

let staPoint = staPoint || {};
let sktimeline = sktimeline || {};
staPoint.rangeallList = [];
let resultall = {},resultyb,resultsk,resultsp,tenRange,hover,isshow,ybshow; //实况、预报、历史同期相关全局变量
let globalChart;
/**
 * 预先添加实况图片
 */
staPoint.initSKImg = function () {
    staPoint.img = maphelper.addImage("./images/me_noProduct.png", 72.4, 15.5, 136.5, 54.5, 0);
}

/**
 * 初始化站点的echart
 */
staPoint.initStaEchart = function () {

    staPoint.overlay = new EchartsLayer({
        animation: false,
        coordinateSystem: 'leaflet',
        backgroundColor: 'transparent',
    }).addTo(maphelper.map)
    staPoint.myChart = staPoint.overlay._ec
}

/**
 * 清除echart站点
 */
staPoint.clearEchartPoint = function () {
    staPoint.option = null;
    let option1 = staPoint.getFinalOptions()
    staPoint.overlay.setOption(option1,true);
    staPoint.overlay.off('click',staPoint.pointClick)
    maphelper.map.off('zoomend',staPoint.zoomEnd)
}

/**
 * 以（lon,lat）为圆心，画出km的范围
 * @param km
 * @param lat
 * @param lon
 */
staPoint.drawArea = function (km, lat, lon) {
    let style1 = {
        strokeWidth: 2,
        color: '#c8e768',//颜色
        fillColor: '#ddecae',
        fillOpacity: 0.3//透明度
    };
    let style2 = {
        strokeWidth: 2,
        color: '#bfb101',//颜色
        fillColor: '#bfb101',
    };
    let latlng = L.latLng(lat, lon);
    staPoint.bcircle = L.circle(latlng, km, style1).addTo(maphelper.map);
    staPoint.scircle = L.circle(latlng, 60, style2).addTo(maphelper.map);
    staPoint.mapDiv = maphelper.addDiv(lon + 0.8, lat, "<div style='color:#ff0000;'>80km</div>");
    staPoint.crclnglat = {lon: lon, lat: lat};
}

/**
 * 清除画出的范围
 */
staPoint.clearArea = function () {
    maphelper.map.removeLayer(staPoint.bcircle);
    maphelper.map.removeLayer(staPoint.scircle);
    staPoint.mapDiv.remove();
    staPoint.bcircle = null;
    staPoint.scircle = null;
    staPoint.mapDiv = null;
    staPoint.crclnglat = null;
}

/**
 * 清楚边界
 */
staPoint.clearBorder = function () {
    maphelper.map.removeLayer(maphelper.border);
    maphelper.border = null;
    emgcy.provinceCode = null;
}

/**
 * 获取自动站要素最新时次 并初始化最新时次
 */
staPoint.getLastTime = function (funItemMenuId, position, isDefault, timeDifference) {
	$.ajax({
		url : ctx + "/multiExhibition/autoStationNewTime",
		type : "post",
		dataType : "json",
		async : false,
		data : {
			funItemMenuId : funItemMenuId,
			position : position,
			isDefault : isDefault,
			timeDifference : timeDifference
		},
		success : function(result) {
			if (result != undefined && result !== "") {
				staPoint.timeStr=result.timeStr;
				staPoint.datetime = result.datetime;
				staPoint.productCode = result.productCode;
				let time = staPoint.datetime;
				if(time == undefined || time === ""){
					let date = new Date();
					time = date.format("yyyy-MM-dd HH") + "时";
				}else{
					time = time.substring(0,4)+ "-" + time.substring(4,6)+ "-" + time.substring(6,8)+ " " + time.substring(8,10) + "时";
				}
				/*$("#time").text("当前数据最新时间："+time);*/
				$("#time").text("最新时间："+time);
			}else{

			}
		}
	});
}

/**
 * 实况色版图
 * @param timeScope
 * @param dataCode
 */
staPoint.getImgProduct = function(timeScope,dataCode) {
	$.ajax({
		url : ctx + "/img/receivepost",
		type : "get",
		dataType : "json",
		async : false,
		data : {
			dateTime : timeScope,
			dataCode : dataCode
		},
		success : function(data) {
			$(".sbanBtn").addClass("sbanChecked");
			if(data.length>=10){
				sktimeline.imgList  = data;
			}
			if(data.length>0){
				if(staPoint.img){
//				staPoint.img.changeUrl("http://10.1.64.154/pic/"+ data[data.length-1].url,0.8);
					staPoint.img.changeUrl(data[data.length-1].url,0.8);
				}else{
//				staPoint.img = maphelper.addImage("http://10.1.64.154/pic/"+ data[data.length-1].url,72.4, 15.5, 136.5, 54.5, 0.8);
					staPoint.img = maphelper.addImage(data[data.length-1].url,72.4, 15.5, 136.5, 54.5, 0.8);
				}
			}else{
				alert("没有获取到当前时间的色斑图");
			}
		}
	});
}

staPoint.getImgProduct2 = function(timeScope,dataCode) {
	$.ajax({
		url : ctx + "/img/receivepost2",
		type : "get",
		dataType : "json",
		async : false,
		data : {
			timeScope : timeScope,
			dataCode : dataCode
		},
		success : function(data) {
			if(data.length>=10){
				sktimeline.imgList  = data;
			}
			if(staPoint.img){
				staPoint.img.changeUrl("http://10.1.64.154/pic/"+ data[data.length-1].url,0.8);
			}else{
				staPoint.img = maphelper.addImage("http://10.1.64.154/pic/"+ data[data.length-1].url,72.4, 15.5, 136.5, 54.5, 0.8);
			}
		}
	});
}

/**
 * 得到实况站点
 */
staPoint.getPoint = function(funitemmenuid,times,provinceCode,provinceFlag){
	let typeCode = 'NWST';
    $.ajax({
		url : ctx + "/exhibitionData/getMarker",
		type : "get",
		dataType : "json",
		async : true,
		data : {
			dateTime:times,
			funitemmenuid : funitemmenuid,
			provinceFlag : provinceFlag,
			province : provinceCode,
			typeCode:typeCode
		},
		success : function(result) {
			staPoint.eleAttr = result.eleValue;
			if(provinceCode === "1000"){
				staPoint.drawPoint(result,funitemmenuid,globalParam.spiltList);
			}else{
				//过滤，去掉区域站
				let list = result.list;
				let list1 = [];
				let eleValue =  result.eleValue;
				for(let i = 0;i<list.length;i++){
					let arrele = eleValue.split(",");
					if(list[i][arrele[5]] !== "14"){
						list1.push(list[i]);
					}
				}
				result.list = list1;
				staPoint.drawPoint(result,funitemmenuid,globalParam.spiltList); //画echarts站点
			}
		}
	});
}
staPoint.getPoint2 = function(funitemmenuid,times,provinceCode,provinceFlag){
	let typeCode = 'NWST';
    $.ajax({
		url : ctx + "/exhibitionData/getMarker",
		type : "get",
		dataType : "json",
		async : true,
		data : {
			dateTime:times,
			funitemmenuid : funitemmenuid,
			provinceFlag : provinceFlag,
			province : provinceCode,
			typeCode:typeCode
		},
		success : function(result) {
			staPoint.eleAttr = result.eleValue;
			if(provinceCode=="1000"){
			
				staPoint.rangeallList = staPoint.rangeallList.concat(result.list);
			}
			staPoint.eleAttr = result.eleValue;
			if(provinceCode === "1000"){
				staPoint.drawPoint(result,funitemmenuid,globalParam.spiltList);
			}else{
				//过滤，去掉区域站
				let list = result.list;
				staPoint.rangeallList = staPoint.rangeallList.concat(result.list);
			
				staPoint.drawPoint(result,funitemmenuid,globalParam.spiltList); //画echarts站点
			}
		}
	});
}
/*
 * 获取青藏高原站点
 */

staPoint.getPointByCode = function(funitemmenuid,times,provinceCode,provinceFlag){
	let typeCode = 'NWST';
    $.ajax({
		url : ctx + "/exhibitionData/getMarkerByCode",
		type : "get",
		dataType : "json",
		async : true,
		data : {
			dateTime:times,
			funitemmenuid : funitemmenuid,
			provinceFlag : provinceFlag,
			province : provinceCode,
			typeCode:typeCode
		},
		success : function(result) {
			staPoint.eleAttr = result.eleValue;
			if(provinceCode=="1000"){
				staPoint.rangeallList = staPoint.rangeallList.concat(result.list);
			}
			staPoint.eleAttr = result.eleValue;
			if(provinceCode === "1000"){
				staPoint.drawPoint(result,funitemmenuid,globalParam.spiltList);
			}else{
				//过滤，去掉区域站
				let list = result.list;
				//staPoint.rangeallList = result.list;
				staPoint.rangeallList = staPoint.rangeallList.concat(result.list);
			
				staPoint.drawPoint(result,funitemmenuid,globalParam.spiltList); //画echarts站点
			}
		}
	});
}
/**
 * 	list json数据
 *  flag 1 为预警点击 0为周边80公里站
 */
staPoint.prcsData = function(result,flag,funitemmenuid,lon,lat){
	let list = result.list;
	let length = list.length;
	for(let i = 0 ;i < length ; i++){
		list[i].funid = funitemmenuid;
	}
	let totalRecord = list.length;
	let totalPageNum = Math.ceil(totalRecord / publicPageSize);
	if (totalPageNum != 0) {
		for (let i = 0; i < totalPageNum; i++) {
			let tempArrPageRecord = syntheical.groupRecord(publicPageSize * i,publicPageSize * (i + 1), list);
			pageRecord[i + ""] = tempArrPageRecord;
		}
		if(flag === 0){
			$("#bigName").text("("+Number(lon).toFixed(2)+","+Number(lat).toFixed(2)+")80km内站点列表");
		}else if(flag === 1){
			$("#bigName").text("预警区域站点列表");
		}
		staPoint.getRecord(0,funitemmenuid);
		// 分页组件
		$("#pagination").pagination(totalRecord, {
			prev_text : "上一页",
			next_text : "下一页",
			items_per_page : publicPageSize,
			current_page : 0,
			num_display_entries : 2,
			num_edge_entries : 1,
			link_to : "javascript:void(0)",
			callback : staPoint.getRecord
		});
	}
}
staPoint.prcsData2 = function(result,flag,funitemmenuid,lon,lat){
	let list = result.list;
	let length = list.length;
	let totalRecord;
	if(length<100){
		for(let i = 0 ;i < length ; i++){
			list[i].funid = funitemmenuid;
			totalRecord = length;
		}
	}else{
		for(let i = 0 ;i < 100 ; i++){
			list[i].funid = funitemmenuid;
		}
		totalRecord =100;
	}
	
	let totalPageNum = Math.ceil(totalRecord / publicPageSize);
	if (totalPageNum != 0) {
		for (let i = 0; i < totalPageNum; i++) {
			let tempArrPageRecord = syntheical.groupRecord(publicPageSize * i,publicPageSize * (i + 1), list);
			pageRecord[i + ""] = tempArrPageRecord;
		}
		if(flag === 0){
			$("#bigName").text("("+Number(lon).toFixed(2)+","+Number(lat).toFixed(2)+")周边80公里站点列表");
		}else if(flag === 1){
			let provinceName = "";
			if(globalParam.provinceFocus){
				for(let i = 0; i<provinceList.length;i++){
					if(provinceList[i].provincecode===globalParam.provinceFocusId){
						provinceName = provinceList[i].shortname;
					}
				}
			}else{
				provinceName = "全国"
			}
			let title_a ="";
			if(funitemmenuid==="115990101"){
				title_a = provinceName+"最高气温排名";
			}else if(funitemmenuid==="115990102"){
				title_a = provinceName+"最高气压排名";
			}else if(funitemmenuid==="115990103"){
				title_a = provinceName+"最高相对湿度排名";
			}else if(funitemmenuid==="115990104" || funitemmenuid==="115990108" || funitemmenuid==="115990109" || funitemmenuid==="115990110" || funitemmenuid==="115990111"){
				title_a = provinceName+"最高风力排名";
			}else if(funitemmenuid==="1150101020" || funitemmenuid==="1150101021"||funitemmenuid==="1150101022"||funitemmenuid==="1150101023"||funitemmenuid==="1150101024"){
				title_a = provinceName+"最高降水排名";
			}else if(funitemmenuid==="115990106"){
				title_a = provinceName+"最高能见度排名";
			}
			title_a +="Top100";
			if(globalParam.provinceFocus){
				title_a +="(含区域站)";
			}

			let  str="<div class='searchBox'><div class='me_search'><input type='text' class='staNo' placeholder='请输入台站号或台站名'/><span class='searchBtn'></span></div></div>";
			$("#bigName").text(title_a);
		}
		staPoint.getRecord(0,funitemmenuid);
		// 分页组件
		$("#pagination").pagination(totalRecord, {
			prev_text : "上一页",
			next_text : "下一页",
			items_per_page : publicPageSize,
			current_page : 0,
			num_display_entries : 2,
			num_edge_entries : 1,
			link_to : "javascript:void(0)",
			callback : staPoint.getRecord
		});
	}
}

/**
 * 拼接表格
 */
staPoint.getRecord = function(pageNo,funitemmenuid) {
	$(".skright").show();
	$(".me_warningTabBody").empty();
	let tbody = "";
	let tempArr = pageRecord[pageNo + ""];
	let arrEleval =staPoint.eleAttr.split(",");
	if (tempArr != undefined) {
		for (let i = 0; i < tempArr.length; i++) {
			if (tempArr[i] == undefined || tempArr[i] == null) {
				tbody += "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
			} else {
				tbody += "<tr class='me_warningInfoTr' "
						+ "Station_levl='"+tempArr[i][arrEleval[5]] + "'"
						+ " staId='"
						+ tempArr[i][arrEleval[1]] + "' staName='"
						+ tempArr[i][arrEleval[0]] + "' lon='"
						+ tempArr[i][arrEleval[3]] + "' lat='"
						+ tempArr[i][arrEleval[2]] + "' province='"
						+ tempArr[i][arrEleval[4]]+"' funid ='"
						+ tempArr[i]["funid"]+"'>";
				let serNo = publicPageSize * pageNo + (i + 1);
				let area_=tempArr[i][arrEleval[4]];
				let areaTi=area_;
				if(area_.length>3){
					area_=area_.substring(0,3)+"...";
				}
				let station_=tempArr[i][arrEleval[0]];
				let staNo_=tempArr[i][arrEleval[1]];
				let stationTi=station_;
				//站名显示问题。英文字母与中文汉字(中文名字最长显示五个)
				let strLength = staPoint.getLength(station_);
				if(strLength>10){
					station_=station_.substring(0,5)+"...";
				}
				let value;
				if(globalParam.skId!=null&&globalParam.skId!=undefined&&globalParam.skId!={}){
					if(globalParam.skId==="115990104" || globalParam.skId==="115990108"|| globalParam.skId==="115990109"|| globalParam.skId==="115990110"|| globalParam.skId==="115990111"){
						value = tempArr[i][arrEleval[7]];
					}else{
						value = tempArr[i][arrEleval[6]];
					}
				}else{
					value = tempArr[i][arrEleval[6]];
				}
				tbody += "<td>" + serNo + "</td><td title='"+areaTi+"'>"
						+ area_ + "</td><td title='"+stationTi+"'>"
						+ station_ +"("+staNo_+")"+ "</td><td>"
						+ value + "</td>";
				tbody += "</tr>";
			}
		}
		$(".me_warningTabBody").append(tbody);
		$(".me_warningTabBody tr").on("click",function(){
			let stationId=$(this).attr("staid");
			let stationName=$(this).attr("staname");
			let lat=$(this).attr("lat");
			let lon=$(this).attr("lon");
			let stationLev=$(this).attr("station_levl");
			let funid = $(this).attr("funid");
			//此处为了能提示站点位置
			staPoint.addLocationMark(lat,lon);
			//将点移动到地图中心，并缩放地图。
			//common.zoom = maphelper.map.getZoom();
			common.zoom = maphelper.map.getZoom();
			if(common.zoom<=7){
				maphelper.moveTo(lon, lat, 7);

			}else{

				maphelper.moveTo(lon, lat, common.zoom);
			}
			staPoint.getStationDetail(funid,stationId,stationName,lon, lat,stationLev);
		});
	}
}
staPoint.getLength = function(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    let realLength = 0, len = str.length, charCode = -1;
    for (let i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};
staPoint.addLocationMark= function(lat,lon){
	let iconUrl = {
			w:25,
			h:25,
			url:ctxStatic+"/ultra/img/gis/location.gif",
			zIndexOffset:new Date().format("yyyyMMddHHmmss")
	};
	staPoint.removeLocationMark = maphelper.addClickableMarker2(common.translateNum2(lon), common.translateNum2(lat), iconUrl, null, null)
};


staPoint.getAreaSta = function (funitemmenuid,lon,lat,times,drawFlag) {
	$(".clickLoading").show();
	$.ajax({
		url : ctx + "/gis/getStaInfoByLonlat",
		type : "post",
		dataType : "json",
		async : false,
		data : {
			funitemmenuid : funitemmenuid,
			lon : lon,
			lat : lat,
			dateTime : times
		},
		success : function(result) {
			if(result.list.length == "0"){
				//alert("80公里内没有站点");
				$(".skright").hide();
			}else{
				$(".me_eleName").text(globalParam.elename + "("+globalParam.unit+")");
				//maphelper.moveTo(lon,lat,8);
				//画出80km范围
				/*if(staPoint.bcircle == null){
					staPoint.drawArea(80000,lat,lon);
				}*/
				//过滤区域站，以及超过80公里的点
				let list = result.list;
				let lnglat1 = L.latLng(lat, lon);
				staPoint.eleAttr =  result.eleValue;
				let arrEle = staPoint.eleAttr.split(",");
				let list2 = [];
				for(let i = 0; i < list.length ; i++){
					let lnglat2 = L.latLng(list[i][arrEle[2]], list[i][arrEle[3]]);
					let distance = lnglat1.distanceTo(lnglat2);
					/*if(list[i] != "14" && distance <= 80000){
						list2.push(list[i]);
					}*/
					//风力小于2m/s的不予显示站点及表格数据。
					if(funitemmenuid=="115990104" || funitemmenuid=="115990108"|| funitemmenuid=="115990109"|| funitemmenuid=="115990110"|| funitemmenuid=="115990111"){
						if(list[i].WIN_S_Max<2){
							continue;
						}
					}
					if(globalParam.provinceFocus){
						if(distance <= 80000){
							list2.push(list[i]);
						}
					}else{
						if(distance <= 80000){
							if(list[i].Station_levl!="14"){
								list2.push(list[i]);
							}
						}
					}
				}
				result.list = list2;
				if(drawFlag){
					staPoint.drawPoint(result,funitemmenuid,globalParam.spiltList); //画echarts站点
				}
				staPoint.prcsData2(result,0,funitemmenuid,lon,lat);				//表格数据
			}
			$(".clickLoading").hide();
		}
	});
}

/**
 * echart画站点
 */
staPoint.drawPoint = function (result, funitemmenuid, splitList) {
    if (funitemmenuid == 115990104 || funitemmenuid == 115990108 || funitemmenuid == 115990109 || funitemmenuid == 115990110 || funitemmenuid == 115990111) {
        //如果是风，则进行画风向杆图标
        staPoint.drawWindPoint(result, funitemmenuid, splitList);
        return;
    }
    let list = result.list;
    let length = list.length;
    let eleAttr = result.eleValue;
    let unit = result.unit;
    let arrEle = eleAttr.split(",");
    if (length > 0) {
        let data = [];
        let echartsData = []
        let geoCoordMap = {};
        for (let i = 0; i < length; i++) {
            let obj1 = {};
            obj1.name = list[i][arrEle[0]];
            obj1.value = list[i][arrEle[6]];
            obj1.stationId = list[i][arrEle[1]];
            obj1.stationName = list[i][arrEle[0]];
            obj1.lat = list[i][arrEle[2]];
            obj1.lon = list[i][arrEle[3]];
            obj1.stationLev = list[i][arrEle[5]];
            obj1.funitemmenuid = funitemmenuid;
            obj1.unit = unit;
            data.push(obj1);
            let obj2 = [];
            obj2.push(list[i][arrEle[3]]);
            obj2.push(list[i][arrEle[2]]);
            geoCoordMap[obj1.name] = obj2;
            echartsData.push([list[i][arrEle[3]],list[i][arrEle[2]], obj1.value,obj1])
        }
    }
    if (maphelper.map.getZoom() >= 12) {
        let isShow = true;
    } else {
        let isShow = false;
    }
    let pieces = [];
    let colors = [];
    splitList.forEach(function(item){
        let temp = {}
        if(item.start!==undefined){
            temp.gt = item.start;
        }
        if(item.end!==undefined){
            temp.lte = item.end;
        }
        pieces.push(temp)
        colors.unshift(item.color)
    })



    let visualMap = {
        type: 'piecewise',
        show: false,
        dimension: '2',
        top: 10,
        pieces:pieces,
        color: colors,
        orient: "horizontal"
    }

    let option = {
        animation: false,
        coordinateSystem: 'leaflet',
        backgroundColor: 'transparent',
        visualMap: visualMap,

        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: '#fff',
                    fontSize: "14px"
                },
                emphasis: {
                    borderColor: '#b1e4ff'
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                let station = params.data[3];
                return station.name+":"+station.value+station.unit
            }
        },
        series: [{
            name: "sk",
            type: 'scatter',
            symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
            symbol: 'circle',
            coordinateSystem: 'leaflet',
            label: {
                show: isShow,
                formatter:function(params){
                    let station = params.data[3];
                    return station.value+station.unit
                },

                position: 'right',

                textStyle: {
                    color: '#000',
                    fontSize: 12,
                    fontWeight:'bold'
                },
                emphasis: {
                    symbolSize: 8
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#555',
                    borderWidth: 1,            // 标注边线线宽，单位px，默认为1
                },
                emphasis: {
                    borderColor: '#333',
                    borderWidth: 5,
                    label: {
                        show: false
                    }
                }
            },
            data: echartsData
        }]
    }
    staPoint.option = option;

    let option1 = staPoint.getFinalOptions()

    staPoint.overlay.setOption(option1,true);



    staPoint.myChart.off('click',staPoint.pointClick );
    staPoint.myChart.off('click',staPoint.windClick );
    maphelper.map.off("zoomend",staPoint.zoomEnd)
    maphelper.map.on("zoomend",staPoint.zoomEnd)
    globalChart = staPoint.myChart;
    staPoint.myChart.on('click',staPoint.pointClick);
}

staPoint.getFinalOptions = function(){
    let option1 ={
        animation: false,
        coordinateSystem: 'leaflet',
        backgroundColor: 'transparent'
    };
    if(staPoint.option){
        $.extend(true,option1,staPoint.option)
        if(atdts.option){
            option1.series.push(atdts.option.series[0])
        }

    }else{
        if(atdts.option){
            $.extend(true,option1,atdts.option)
        }
    }
    return option1;
}
staPoint.zoomEnd = function(){
    try{
        let zoom = maphelper.map.getZoom();
        let options = staPoint.overlay.getEcharts().getOption();
        let series = options.series;
        if(zoom>=12){
             series.forEach(function(item){
                 if(item.name=='sk'){
                     item.label.show = true
                 }
             })
        }else{
            series.forEach(function(item){
                if(item.name=="sk"){
                    item.label.show = false
                }
            })
        }
        if(task==null){
            task=setTimeout(function(){staPoint.overlay.setOption(options);task=null;},150);
        }else{
            clearTimeout(task);
            task=setTimeout(function(){staPoint.overlay.setOption(options);task=null;},150);
        }
    }catch (e) {
         console.log(e)
    }

}


staPoint.pointClick = function(params){
    if(params.seriesName=="sk"){
        let  data = params.data[3];
        let stationId = data.stationId;
        let stationName = data.stationName;
        let lat = data.lat;
        let lon = data.lon;
        let stationLev = data.stationLev;
        let funid = data.funitemmenuid;
        staPoint.getStationDetail(funid, stationId, stationName, lon, lat, stationLev);
    }

}

staPoint.windClick = function(params){
    if(params.seriesName="sk"){
        let  data = params.data.originData;
        let stationId = data.stationId;
        let stationName = data.stationName;
        let lat = data.lat;
        let lon = data.lon;
        let stationLev = data.stationLev;
        let funid = data.funitemmenuid;
        staPoint.getStationDetail(funid, stationId, stationName, lon, lat, stationLev);
    }
}




/**
 * echart画站点，按国家站/区域站区分站点颜色
 */
staPoint.drawPoint2 = function (result, funitemmenuid, splitList) {
    if (funitemmenuid == 115990104 || funitemmenuid == 115990108 || funitemmenuid == 115990109 || funitemmenuid == 115990110 || funitemmenuid == 115990111) {
        //如果是风，则进行画风向杆图标
        staPoint.drawWindPoint(result, funitemmenuid, splitList);
        return;
    }
    
    let list = result.list;
    let nationPointList = [];//国家站
    let regPointList = [];//区域站
    let eleValue =  result.eleValue;
    let arrele = eleValue.split(",");
    for(let i=0; i<list.length; i++){
    	if(list[i][arrele[5]] !== "14"){//国家站
    		nationPointList.push(list[i]);
    	}else{//区域站
    		regPointList.push(list[i]);
    	}
    }
    
    //国家站和区域站
    if($(".observegistype .nationPoint").hasClass("active") && $(".observegistype .regPoint").hasClass("active")){
    	list = [].concat(list);
    }
    //国家站
    else if($(".observegistype .nationPoint").hasClass("active") && !$(".observegistype .regPoint").hasClass("active")){
    	list = [].concat(nationPointList);
    }
    //区域站
    else if(!$(".observegistype .nationPoint").hasClass("active") && $(".observegistype .regPoint").hasClass("active")){
    	list = [].concat(regPointList);
    }
    //无站点选择
    else if(!$(".observegistype .nationPoint").hasClass("active") && !$(".observegistype .regPoint").hasClass("active")){
    	list = [];
    }
    
    
    //let list = result.list;
    let length = list.length;
    let eleAttr = result.eleValue;
    let unit = result.unit;
    let arrEle = eleAttr.split(",");
    if (length > 0) {
        let data = [];
        let echartsData = []
        let geoCoordMap = {};
        for (let i = 0; i < length; i++) {
            let obj1 = {};
            obj1.name = list[i][arrEle[0]];
            obj1.value = list[i][arrEle[6]];
            obj1.stationId = list[i][arrEle[1]];
            obj1.stationName = list[i][arrEle[0]];
            obj1.lat = list[i][arrEle[2]];
            obj1.lon = list[i][arrEle[3]];
            obj1.stationLev = list[i][arrEle[5]];
            obj1.funitemmenuid = funitemmenuid;
            obj1.unit = unit;
            data.push(obj1);
            let obj2 = [];
            obj2.push(list[i][arrEle[3]]);
            obj2.push(list[i][arrEle[2]]);
            geoCoordMap[obj1.name] = obj2;
            echartsData.push([list[i][arrEle[3]],list[i][arrEle[2]], obj1.value,obj1])
        }
    }
    if (maphelper.map.getZoom() >= 12) {
        let isShow = true;
    } else {
        let isShow = false;
    }

    let pieces = [];
    let colors = [];
    splitList.forEach(function(item){
        let temp = {}
        if(item.start!==undefined){
            temp.gt = item.start;
        }
        if(item.end!==undefined){
            temp.lte = item.end;
        }
        pieces.push(temp)
        colors.unshift(item.color)
    })



    let visualMap = {
        type: 'piecewise',
        show: false,
        dimension: '2',
        top: 10,
        pieces:pieces,
        color: colors,
        orient: "horizontal"
    }

    let option = {
        animation: false,
        coordinateSystem: 'leaflet',
        backgroundColor: 'transparent',
        visualMap:visualMap,

        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: '#fff',
                    fontSize: "14px"
                },
                emphasis: {
                    borderColor: '#b1e4ff'
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                let station = params.data[3];
                return station.name+":"+station.value+station.unit
            }
        },
        series: [{
            name: 'sk',
            type: 'scatter',
            symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
            symbol: 'circle',
            coordinateSystem: 'leaflet',
            label: {
                show: isShow,
                formatter:function(params){
                    let station = params.data[3];
                    return station.value+station.unit
                },

                position: 'right',

                textStyle: {
                    color: '#000',
                    fontSize: 12,
                    fontWeight:'bold'
                },
                emphasis: {
                    symbolSize: 8
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#555',
                    borderWidth: 1,            // 标注边线线宽，单位px，默认为1

                },
                emphasis: {
                    borderColor: '#333',
                    borderWidth: 5
                }
            },
            data: echartsData
        }]
    }
    staPoint.option = option;
    let option1 = staPoint.getFinalOptions();
    staPoint.overlay.setOption(option1,true);
    staPoint.myChart.off('click',staPoint.pointClick );
    staPoint.myChart.off('click',staPoint.windClick );
    globalChart = staPoint.myChart;
    staPoint.myChart.on('click',staPoint.pointClick);
    maphelper.map.off("zoomend",staPoint.zoomEnd)
    maphelper.map.on("zoomend",staPoint.zoomEnd)
}

staPoint.getStationDetail=function(funitemmenuid,stationId,stationName,lon, lat,stationLev){
	staPoint.currPoint = {
		funid:funitemmenuid,
		staId:stationId,
		staName:stationName,
		lon:lon,
		lat:lat,
		lev:stationLev
	};
	if($(".stationBox").css("display")=='none'){
		$(".stationBox").show();
		/*$(".zhezhao").show();*/
	}else{
		//如果之前有点击的站点，则进行下列步骤。如果该站点是通过列表点击的，则还需要移除locationMark
		$(".loadding1").show();
		$(".loadding2").show();
		$("#me_lineGraph").empty();
		$("#me_timeCompare").empty();
		staPoint.currPoint =null;
		if(staPoint.removeLocationMark!=null&&staPoint.removeLocationMark!=undefined){
			staPoint.removeLocationMark.remove();
		}
	}
	/*$(".zhezhao").unbind();
	$(".zhezhao").click(function(){
		if(staPoint.removeLocationMark!=null&&staPoint.removeLocationMark!=undefined){
			staPoint.removeLocationMark.remove();
		}
		$(".stationBox").hide();
		$(".loadding1").show();
		$(".loadding2").show();
		$("#me_lineGraph").empty();
		$("#me_timeCompare").empty();
		staPoint.currPoint =null;
		$(".typhoonBox").show();
		$(".zhezhao").hide();
	});*/

	$(".typhoonBox").hide();
	$(".detailClose").unbind();
	$(".detailClose").click(function(){
		if(staPoint.removeLocationMark!=null&&staPoint.removeLocationMark!=undefined){
			staPoint.removeLocationMark.remove();
		}
		$(".stationBox").hide();
		$(".loadding1").show();
		$(".loadding2").show();
		$("#me_lineGraph").empty();
		$("#me_timeCompare").empty();
		staPoint.currPoint =null;
		$(".typhoonBox").show();
		$(".zhezhao").hide();
	});
	$(".detail ul").empty();
	let stationHtml="";
	if (stationName != undefined && stationName != "") {
		stationHtml += stationName;
	} else {
		stationHtml += "--";
	}
	if (stationId != undefined && stationId != "") {
		stationHtml += "(站号:" + stationId + ")";
	} else {
		stationHtml += "（站号:--）";
	}
	$(".stationBox .bigName").html(stationHtml);
	let stationLevel="";
	if(stationLev=='11'||stationLev=='12'||stationLev=='13'){
		stationLevel="NWST";
	}else{
		stationLevel="RWST";
	}
	staPoint.getStaDetailInfo(funitemmenuid,stationId,staPoint.datetime,stationLevel);
	staPoint.clickDetail(funitemmenuid, stationId, stationName, lon, lat,stationLevel);
	/*if(funitemmenuid ==="115990101" || funitemmenuid ==="1150101020" || funitemmenuid ==="1150101021" || funitemmenuid ==="1150101022" || funitemmenuid ==="1150101023" || funitemmenuid ==="1150101024"||funitemmenuid ==="115990102"||funitemmenuid ==="115990103"||funitemmenuid ==="115990104"||funitemmenuid ==="115990108" || funitemmenuid==115990109 || funitemmenuid==115990110 || funitemmenuid==115990111){
		//气温和降水有历史同期    气压 相对湿度 风
		staPoint.getSamePeriodtem(funitemmenuid,stationId,stationLevel);
	}else{
		$(".loadding2").hide();
		$("#me_timeCompare").hide();
	}*/
};

staPoint.getStationDetail=function(funitemmenuid,stationId,stationName,lon, lat,stationLev){
	staPoint.currPoint = {
		funid:funitemmenuid,
		staId:stationId,
		staName:stationName,
		lon:lon,
		lat:lat,
		lev:stationLev
	};
	if($(".stationBox").css("display")=='none'){
		$(".stationBox").show();
		/*$(".zhezhao").show();*/
	}else{
		//如果之前有点击的站点，则进行下列步骤。如果该站点是通过列表点击的，则还需要移除locationMark
		$(".loadding1").show();
		$(".loadding2").show();
		$("#me_lineGraph").empty();
		$("#me_timeCompare").empty();
		staPoint.currPoint =null;
		if(staPoint.removeLocationMark!=null&&staPoint.removeLocationMark!=undefined){
			staPoint.removeLocationMark.remove();
		}
	}
	/*$(".zhezhao").unbind();
	$(".zhezhao").click(function(){
		if(staPoint.removeLocationMark!=null&&staPoint.removeLocationMark!=undefined){
			staPoint.removeLocationMark.remove();
		}
		$(".stationBox").hide();
		$(".loadding1").show();
		$(".loadding2").show();
		$("#me_lineGraph").empty();
		$("#me_timeCompare").empty();
		staPoint.currPoint =null;
		$(".typhoonBox").show();
		$(".zhezhao").hide();
	});*/

	$(".typhoonBox").hide();
	$(".detailClose").unbind();
	$(".detailClose").click(function(){
		if(staPoint.removeLocationMark!=null&&staPoint.removeLocationMark!=undefined){
			staPoint.removeLocationMark.remove();
		}
		$(".stationBox").hide();
		$(".loadding1").show();
		$(".loadding2").show();
		$("#me_lineGraph").empty();
		$("#me_timeCompare").empty();
		staPoint.currPoint =null;
		$(".typhoonBox").show();
		$(".zhezhao").hide();
	});
	$(".detail ul").empty();
	let stationHtml="";
	if (stationName != undefined && stationName != "") {
		stationHtml += stationName;
	} else {
		stationHtml += "--";
	}
	if (stationId != undefined && stationId != "") {
		stationHtml += "(站号:" + stationId + ")";
	} else {
		stationHtml += "（站号:--）";
	}
	$(".stationBox .bigName").html(stationHtml);
	let stationLevel="";
	if(stationLev=='11'||stationLev=='12'||stationLev=='13'){
		stationLevel="NWST";
	}else{
		stationLevel="RWST";
	}
	staPoint.getStaDetailInfo(funitemmenuid,stationId,staPoint.datetime,stationLevel);
	staPoint.clickDetail(funitemmenuid, stationId, stationName, lon, lat,stationLevel);
	/*if(funitemmenuid ==="115990101" || funitemmenuid ==="1150101020" || funitemmenuid ==="1150101021" || funitemmenuid ==="1150101022" || funitemmenuid ==="1150101023" || funitemmenuid ==="1150101024"||funitemmenuid ==="115990102"||funitemmenuid ==="115990103"||funitemmenuid ==="115990104"||funitemmenuid ==="115990108" || funitemmenuid==115990109 || funitemmenuid==115990110 || funitemmenuid==115990111){
		//气温和降水有历史同期    气压 相对湿度 风
		staPoint.getSamePeriodtem(funitemmenuid,stationId,stationLevel);
	}else{
		$(".loadding2").hide();
		$("#me_timeCompare").hide();
	}*/
};

/**
 * 根据站号和时间得到改站点具体天气信息
 * @param staId
 * @param times
 */
staPoint.getStaDetailInfo = function(funitemmenuid,staId, times,stationLevel) {
	$.ajax({
		url : ctx + '/gis/getStaDetailInfo',
		type : "get",
		dataType : "json",
		async : false,
		data : {
			funitemmenuid :funitemmenuid ,
			staId : staId,
			dateTime : times,
			typeCode:stationLevel
		},
		success : function(result) {

			if(result.returnCode === "0"){
				let list=result.list;
				let station = list[0];
				let province = station.Province;
				let city = station.City;
				let Cnty = station.Cnty;
				let lat = station.Lat;
				let lon = station.Lon;
				let temp = station.TEM;
				let prs = station.PRS;
				let rhu = station.RHU;
				let pre = station.PRE_1h;
				let vis = station.VIS;
				let wind = station.WIN_S_Inst_Max;
				let areaid = station.Admin_Code_CHN;
				if(globalParam.staid=='115990101'){//气温
					emgcy.getWarningCountyData(areaid,'11B09',Cnty);
				}else if(globalParam.staid=='115990103'){//能见度
					emgcy.getWarningCountyData(areaid,'11B17',Cnty);
				}else if(globalParam.staid=='1150101020'||globalParam.staid=='1150101021'||globalParam.staid=='1150101022'||globalParam.staid=='1150101023'||globalParam.staid=='1150101024'){//降水
					emgcy.getWarningCountyData(areaid,'11B03,11B20,',Cnty);
				}else if(globalParam.staid=='115990104'||globalParam.staid=='115990108'||globalParam.staid=='115990109'||globalParam.staid=='115990110'||globalParam.staid=='115990111'){//风
					emgcy.getWarningCountyData(areaid,'11B06',Cnty);
				}
				if (province != undefined && province != "") {
					$("#province").html(province);
				} else {
					$("#province").html("--");
				}
				if (city != undefined && city != "") {
					$("#city").html(city);
				} else {
					$("#city").html("--");
				}
				if (Cnty != undefined && Cnty != "") {
					$("#county").html(Cnty);
				} else {
					$("#county").html("--");
				}
				if (lat != undefined && lat != "") {
					$("#lat").html(lat);
				} else {
					$("#lat").html("");
				}
				if (lon != undefined && lon != "") {
					$("#lng").html(lon);
				} else {
					$("#lng").html("--");
				}
				if (temp != undefined && temp != ""&& temp != "999999") {
					$(".detail ul").append("<li>平均气温:" + temp + "℃</li>");
				} else {
					$(".detail ul").append("<li>平均气温:--</li>");
				}
				if (prs != undefined && prs != ""&& prs != "999999") {
					$(".detail ul").append("<li>本站气压:" + prs + "Hpa</li>");
				} else {
					$(".detail ul").append("<li>本站气压:--</li>");
				}
				if (rhu != undefined && rhu != ""&& rhu != "999999") {
					$(".detail ul").append("<li>相对湿度:" + rhu + "%</li>");
				} else {
					$(".detail ul").append("<li>相对湿度:--</li>");
				}
				if (pre != undefined && pre != ""&& pre != "999999") {
					let selId=$(".lsel").attr("id");
					if(selId!=undefined&&selId=="1150101020"){
						let Sid=$("#selectAll option:selected").attr("id");
						if(Sid=="1150101021"){
							$(".detail ul").append("<li>3小时累计降水:" + pre + "mm</li>");
						}else if(Sid=="1150101022"){
							$(".detail ul").append("<li>6小时累计降水:" + pre + "mm</li>");
						}else if(Sid=="1150101024"){
							$(".detail ul").append("<li>12小时累计降水:" + pre + "mm</li>");
						}else if(Sid=="1150101023"){
							$(".detail ul").append("<li>24小时累计降水:" + pre + "mm</li>");
						}else{
							$(".detail ul").append("<li>1小时累计降水:" + pre + "mm</li>");
						}
					}else{
						$(".detail ul").append("<li>1小时累计降水:" + pre + "mm</li>");
					}
				} else {
					$(".detail ul").append("<li>1小时累计降水:--</li>");
				}
				if (vis != undefined && vis != "" && vis != "999999") {
					$(".detail ul")
						.append("<li>小时能见度:" + (vis / 1000) + "km</li>");
				} else {
					$(".detail ul").append("<li>小时能见度:--</li>");
				}
				if (wind != undefined && wind != ""&& wind != "999999") {
					let selId=$(".lsel").attr("id");
					if(selId!=undefined&&selId=="115990104"){
						let Sid=$("#windselectAll option:selected").attr("id");
						if(Sid=="115990108"){
							$(".detail ul").append("<li>2分钟平均风速:" + wind + "m/s</li>");
						}else if(Sid=="115990109"){
							$(".detail ul").append("<li>10分钟平均风速:" + wind + "m/s</li>");
						}else if(Sid=="115990110"){
							$(".detail ul").append("<li>瞬时风风速:" + wind + "m/s</li>");
						}else if(Sid=="115990111"){
							$(".detail ul").append("<li>极大风风速:" + wind + "m/s</li>");
						}else{
							$(".detail ul").append("<li>小时最大风速:" + wind + "m/s</li>");
						}
					}else{
						$(".detail ul").append("<li>小时最大风速:" + wind + "m/s</li>");
					}
				} else {
					$(".detail ul").append("<li>小时极大风速:--</li>");
				}
			}
		}
	});
}

/**
 * 得到实况数据(自动站)
 */
staPoint.getskStationInfo=function(funitemmenuid,staId,stationLevel){
	$.ajax({
		url : ctx+'/exhibitionData/getSKStationInfo',
		type : "post",
		dataType : "json",
		async : false,
		data : {
			staId:staId,
			funitemmenuid:funitemmenuid,
			typeCode:stationLevel
		},
		success:function(result){
			resultsk=result.list;
			hover=result.hover;
			isshow=result.value;
		}
	});
};

/**
 * 得到预报数据(自动站)
 */
staPoint.getybStationInfo=function(funitemmenuid,staId,stationLevel){
	$.ajax({
		url : ctx+'/exhibitionData/getStationInfo',
		type : "post",
		dataType : "json",
		async : false,
		data : {
			staId:staId,
			funitemmenuid:funitemmenuid,
			typeCode:stationLevel
		},
		success:function(result){
			resultyb=result.list;
			if(hover == undefined || hover == ""){
				hover=result.hover;
			}
			ybshow=result.value;
		}
	});
};


/**
 * 得到站点的历史同期数据
 * @param funitemmenuid
 * @param station
 * @param stationLevel
 */
staPoint.getSamePeriodtem=function(funitemmenuid,station,stationLevel){
	$(".loadding").show();
	url = ctx + "/exhibitionData/getSamePeriodData";
	$.ajax({
		url : url,
		type : "post",
		dataType : "json",
		async : true,
		data : {
			staIds : station,
			time : staPoint.timeStr,
			type:funitemmenuid,
			typeCode:stationLevel
		},
		success : function(result) {
			resultsp=result.list;
			tenRange=result.dateTime;
			if(resultsp==null||resultsp.length==0){
				$(".loadding2").hide();
				$("#me_timeCompare").hide();
			}else{
				$(".loadding2").hide();
				$("#me_timeCompare").show();
				//staPoint.drawSamePeriodtem(0,tenRange);
				staPoint.drawSamePeriodtem2(0,tenRange);
			}
		}
	});
};

staPoint.drawSamePeriodtem=function(index,title){
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});
	syntheical.chart = $("#me_timeCompare").highcharts('StockChart',{
		chart : {
			type:'column',
			height: 160,
			backgroundColor: "#f1f1f1",
		},
		title : {
			text : '历史同期'+title,
			style:{
				"color": "#333333",
				"fontSize": "12px"
			}
		},
		rangeSelector:{
			enabled: false,
			selected : 1,
			inputEnabled: false,
			buttons:[{
				type: 'all',
				text: '全部'
			}, {
				type: 'year',
				count: 10,
				text: '近10年'
			},{
				type: 'year',
				count: 20,
				text: '近20年'
			},{
				type: 'year',
				count: 50,
				text: '近50年'
			}]
		},
		series : [{
			name : '预报',
			data : resultsp[index],
			color:'#7cb5ed',
			dashStyle:'dash',
			tooltip: {
				valueDecimals: 2
			}
		}],
		navigator:{
			enabled: false,
			xAxis: {
				dateTimeLabelFormats: {
					minute: '%Y年%m月%d日<br/>%H:%M' ,
					hour: '%Y年%m月%d日<br/>%H:%M',
					day: '%Y年%m月%d日',
					week: '%Y年%m月%d日',
					month: '%Y年%m月' ,
					year: '%Y年'
				}
			},
			series: {
				dashStyle:'solid'
			},
			height: 20
		},
		scrollbar: {
			enabled: false
		},
		plotOptions:{
			column: {
				dataGrouping: {
					units: [
						['day',	[1]],
						['week',[1]],
						['month',[1, 3, 6]],
						['year',null]
					]
				}
			}
		},
		credits:{
			enabled: false ,
		},
		exporting:{
			enabled: false
		},
		xAxis:{
			type: 'datetime',
			dateTimeLabelFormats: {
				minute: '%m月%d日<br/>%H:%M' ,
				hour: '%m月%d日<br/>%H:%M',
				day: '%m月%d日',
				week: '%m月%d日',
				month: '%m月%d日' ,
				year: '%Y年'
			},
			minTickInterval: 4*3600*1000 ,
			ordinal: false
		},
		yAxis: {
			title: {
				margin: 20,
				text: '('+resultall["units"+index]+')',
				align: "middle",
				x:18,
				rotation: 0,
			},
			labels:{
				x:20,
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function() {
				let s;
				s = '<b>'+ Highcharts.dateFormat('%Y年：', this.x) +'</b>';
				s+='<br/>'+resultall["name"+index]+": "+this.y.toFixed(1)+" "+resultall["units"+index];
				return s;
			}
		},
		legend: {
			enabled: true,
			align: 'center',
			symbolWidth:40,
			layout:'horizontal',
			floating:true,
			x:280,
			y:-380
		}
	}, function(c) {
		chart = c;
	});
};
staPoint.drawSamePeriodtem2=function(index,title){
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});
	syntheical.chart = $("#me_timeCompare").highcharts('StockChart',{
		chart : {
			type:'column',
			height: 160,
			backgroundColor: "#f1f1f1",
		},
		title : {
			text : '历史同期'+title,
			style:{
				"color": "#333333",
				"fontSize": "12px"
			}
		},
		rangeSelector:{
			enabled: false,
			selected : 1,
			inputEnabled: false,
			buttons:[{
				type: 'all',
				text: '全部'
			}, {
				type: 'year',
				count: 10,
				text: '近10年'
			},{
				type: 'year',
				count: 20,
				text: '近20年'
			},{
				type: 'year',
				count: 50,
				text: '近50年'
			}]
		},
		series : [{
			name : '预报',
			data : resultsp,
			color:'#7cb5ed',
			dashStyle:'dash',
			tooltip: {
				valueDecimals: 2
			}
		}],
		navigator:{
			enabled: false,
			xAxis: {
				dateTimeLabelFormats: {
					minute: '%Y年%m月%d日<br/>%H:%M' ,
					hour: '%Y年%m月%d日<br/>%H:%M',
					day: '%Y年%m月%d日',
					week: '%Y年%m月%d日',
					month: '%Y年%m月' ,
					year: '%Y年'
				}
			},
			series: {
				dashStyle:'solid'
			},
			height: 20
		},
		scrollbar: {
			enabled: false
		},
		plotOptions:{
			column: {
				dataGrouping: {
					units: [
						['day',	[1]],
						['week',[1]],
						['month',[1, 3, 6]],
						['year',null]
					]
				}
			}
		},
		credits:{
			enabled: false ,
		},
		exporting:{
			enabled: false
		},
		xAxis:{
			type: 'datetime',
			dateTimeLabelFormats: {
				minute: '%m月%d日<br/>%H:%M' ,
				hour: '%m月%d日<br/>%H:%M',
				day: '%m月%d日',
				week: '%m月%d日',
				month: '%m月%d日' ,
				year: '%Y年'
			},
			minTickInterval: 4*3600*1000 ,
			ordinal: false
		},
		yAxis: {
			title: {
				margin: 20,
				text: '('+resultall["units"+index]+')',
				align: "middle",
				x:18,
				rotation: 0,
			},
			labels:{
				x:20,
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function() {
				let s;
				s = '<b>'+ Highcharts.dateFormat('%Y年：', this.x) +'</b>';
				s+='<br/>'+resultall["name"+index]+": "+this.y.toFixed(1)+" "+resultall["units"+index];
				return s;
			}
		},
		legend: {
			enabled: true,
			align: 'center',
			symbolWidth:40,
			layout:'horizontal',
			floating:true,
			x:280,
			y:-380
		}
	}, function(c) {
		chart = c;
	});
};

staPoint.clickDetail=function(funitemmenuid,station,subtitle,lon,lat,stationLevel){
	//得到气温、降水..所有的有关信息
	isshow=undefined;
	ybshow=undefined;
	hover=undefined;
	staPoint.getskStationInfo(funitemmenuid,station,stationLevel);
	if(funitemmenuid === "115990101" || funitemmenuid === "1150101020"|| funitemmenuid === "1150101021"|| funitemmenuid === "1150101022"|| funitemmenuid === "1150101023"|| funitemmenuid === "1150101024" || funitemmenuid === "115990104" || funitemmenuid === "115990108"|| funitemmenuid === "115990109"|| funitemmenuid === "115990110"|| funitemmenuid === "115990111"){
		staPoint.getybStationInfo(funitemmenuid,station,stationLevel);
	}
	$("#me_lineGraph").show();
	let hovers=hover.split(",");
	let array1=new Array();
	let array2=new Array();
	let array3=new Array();
	let array4=new Array();
	for(let i=0;i<hovers.length;i++){
		array1.push("name"+i);
		array2.push("type"+i);
		array3.push("data"+i);
		array4.push("units"+i);
	}
	namearray=new Array();
	for(let i=0;i<hovers.length;i++){
		namearray.push(hovers[i].split("##")[2]);
		resultall[array1[i]]=hovers[i].split("##")[2];
		resultall[array2[i]]="spline";
		if(resultsk!=undefined && resultyb!=undefined){
			resultall[array3[i]]=common.mergeArray(resultsk[i],resultyb[i]);
		}else if(resultsk!=undefined && resultyb==undefined){
			resultall[array3[i]]=resultsk[i];
		}else if(resultsk==undefined && resultyb!=undefined){
			resultall[array3[i]]=resultyb[i];
		}
		resultall[array4[i]]=hovers[i].split("##")[3];
	}
	//拼接站点信息(站名、经度、纬度)
	$(".me_stationName").attr("title",subtitle);
	if(subtitle.length>7){
		subtitle=subtitle.substring(0,7)+"...";
	}
	$(".me_stationName").html(subtitle+"("+"经度:"+lon+"&nbsp;纬度:"+lat+")");
	let idname=$(".me_bgBlack").find(".me_level3Text").text();
	$(".loadding1").hide();
	staPoint.drawskChart(idname+"曲线图--"+namearray[0],subtitle,0);
};

staPoint.drawskChart=function(title,subtitle,index){
	isshow="1";
	ybshow=="1";
	if(isshow=="1"){
		//有实况数据
		let skCategories=new Array();
		let skData=new Array();
		for(let i=0;i<resultsk[index].length;i++){
			let tempSKCtgr=resultsk[index][i][0];
			if(tempSKCtgr==undefined){
				tempSKCtgr="";
			}
			skCategories.push(tempSKCtgr);
			let tempSKData=resultsk[index][i][1];
			if(tempSKData==undefined){
				tempSKData="";
			}
			skData.push(tempSKData);
		}
		let categories_=skCategories;
		let totalData_=skData;
	}
	if(ybshow=="1"){
		//有预报 数据
		let ybCategories=new Array();
		let ybData=new Array();
		for(let i=0;i<resultyb[index].length;i++){
			let tempYBCtgr=resultyb[index][i][0];
			if(tempYBCtgr==undefined){
				tempYBCtgr="";
			}
			ybCategories.push(tempYBCtgr);
			let tempYBData=resultyb[index][i][1];
			if(tempYBData==undefined){
				tempYBData="";
			}
			ybData.push(tempYBData);
		}
		let categories_=ybCategories;
		let totalData_=ybData;
	}
	let categories_=common.mergeArray(skCategories,ybCategories);
	if(emgcy.arrWarning!=undefined&&emgcy.arrWarning.length>0){
		for(let i=0;i<skCategories.length;i++){
			$.each(emgcy.arrWarning,function(j,n){
				if(n.time==skCategories[i]){
					let url=ctxStatic + '/ultra/img/disasterWarning/'+ n.signaltypecode + "_" + n.signallevelcode+ ".png";
					let data=skData[i];
					skData[i]={
						y:data,
						marker:{
							symbol:'url('+url+')',
							width:16,
							height:16
						}
					};
				}
			});
		}
	}
	let totalData_=common.mergeArray(skData,ybData);
	let chart_=Highcharts.chart('me_lineGraph',{
		chart:{
			inverted:false,
			marginLeft:50,
			height: 160,
			backgroundColor: "#f1f1f1",
			//borderColor: "#5883b5",
			//borderWidth:1
		},
		title: {
			text:title+"【"+subtitle+"】",
			style:{
				"color": "#333333",
				"fontSize": "12px"
			}
		},
		xAxis: {
			categories:categories_,
			tickInterval:5,
			// tickAmount:5,
			title:{
				text:"",
				x: 10,
				//y: -30
			},
			labels:{
				step:2,
				formatter:function() {
					let value=this.value;
					if(value.length>10){
						value=value.substring(6,8)+"日"+value.substring(8,10)+"时";
					}
					return value;
				}
			}
		},
		yAxis: {
			tickWidth: 10,
			title: {
				align:'middle',
				text: resultall['name'+index]+'('+resultall["units"+index]+')',
				//rotation: 0,
				x:6,
				y:0
			},
			plotLines: [{
				value: 0,
				width: 0,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter:function(){
				if(globalParam.staid=="115010201"){
					//高空
					return this.x+"hpa<br/>"+resultall['name'+index]+":<b>"+this.y+"</b>"+resultall["units"+index];
				}else{
					//自动站、辐射、精细化预报
					let strTime=this.x;
					let year=strTime.substring(0,4);
					let month=strTime.substring(4,6);
					let day=strTime.substring(6,8);
					let hour=strTime.substring(8,10);
					let html=year+"年"+month+"月"+day+"日"+hour+"时："+this.y+resultall["units"+index];
					for(let i=0;i<emgcy.arrWarning.length;i++){
						if(strTime==emgcy.arrWarning[i].time){
							html+="  ";
							if(emgcy.arrWarning[i].codename!=undefined&&emgcy.arrWarning[i].codename!=null&&emgcy.arrWarning[i].codename!=""){
								html+=emgcy.arrWarning[i].codename;
							}
							if(emgcy.arrWarning[i].signallevel!=undefined&&emgcy.arrWarning[i].signallevel!=null&&emgcy.arrWarning[i].signallevel!=""){
								html+=emgcy.arrWarning[i].signallevel;
							}
							html+="预警";
						}
					}
					return html;
				}
			}
		},
		plotOptions:{
			line:{
				marker:{
					radius:0,
					lineWidth:1
				}
			},
			series : {
				events : {
					legendItemClick: function(event) {
						return false;
					}
				}
			}
		},
		credits:{
			enabled:false
		},
		legend: {
			layout: 'horizontal',
			align: 'center',
			verticalAlign: 'middle',
			borderWidth: 0,
			itemWidth:50,
			y:195,
			reversed:true,
			enabled:false
		},
		exporting:{
			enabled: false
		}
	});
	let series_1={
		name: '预报',
		data: totalData_,
		color:'#7cb5ed',
		dashStyle:'dash',
		tooltip: {
			valueDecimals: 2
		}
	};
	let series_2={
		name: '实况',
		data: skData,
		color:'#91ed76',
		tooltip: {
			valueDecimals: 2
		}
	};
	let plotLines_={
		color:'gray',
		dashStyle:'longdashdot',
		value:23,
		width:1
	};
	if(ybshow=="1"){
		chart_.addSeries(series_1);
		chart_.xAxis[0].addPlotLine(plotLines_);
	}
	chart_.addSeries(series_2);
}

staPoint.getShouldMinusVal=function(zoom){
	let minusVal=0;
	switch(zoom){
		case 0:
			minusVal=0.6;
			break;
		case 1:
			minusVal=0.3;
			break;
		case 2:
			minusVal=0.13;
			break;
		case 3:
			minusVal=0.07;
			break;
		case 4:
			minusVal=0.042;
			break;
		case 5:
			minusVal=0.016;
			break;
		case 6:
			minusVal=0.008;
			break;
		case 7:
			minusVal=0.004;
			break;
		case 8:
			minusVal=0.0005;
			break;
		default:
			minusVal=0;
			break;
	}
	return minusVal;
}

staPoint.search = function(){
	let staNo=$(".staNo").val();
	let reg=/^[A-Za-z0-9]+$/g;
	let arrEleValue = staPoint.eleAttr.split(",");
	let data=null;
	if(reg.test(staNo)){
		//站号
		for(let i = 0; i < staPoint.rangeallList.length; i++){
			if(staPoint.rangeallList[i][arrEleValue[1]]==staNo){
				data=staPoint.rangeallList[i];
			}
		}
	}else{
		//站名
		//globalParam.rangeallList
		for(let i = 0; i < staPoint.rangeallList.length; i++){
			if(staPoint.rangeallList[i][arrEleValue[0]]==staNo){
				data=staPoint.rangeallList[i];
			}
		}
	}
	if(data){
		//staPoint.getStationDetail(funid,stationId,stationName,lon, lat,stationLev);
		common.zoom = maphelper.map.getZoom();
		if(common.zoom<=7){
			maphelper.moveTo(data.j, data.w, 7);

		}else{

			maphelper.moveTo(data.j, data.w, common.zoom);
		}
		staPoint.getStationDetail(globalParam.staid,data.h,data.m,data.j, data.w,data.l);
		staPoint.addLocationMark(data.w,data.j);


	}else{
		alert("没有该站点");
	}
}

staPoint.drawWindPoint = function(result,funitemmenuid,splitList){
    let list = result.list;
    let length = list.length;
    let eleAttr = result.eleValue;
    let unit = result.unit;
    let arrEle = eleAttr.split(",");
    if (length > 0) {
        let data = [];
        let datas = new Array();
        for (let k = 0; k < 8; k++) {
            for (let j = 0; j < 16; j++) {
                let ds = 'w' + '-' + k + '-' + j;
                datas[ds] = [];
            }
        }
        let geoCoordMap = {};
        let echartsData = []
        let key;
        for (let i = 0; i < length; i++) {
            let obj1 = {};
            obj1.name = list[i][arrEle[0]];
            obj1.stationId = list[i][arrEle[1]];
            obj1.stationName = list[i][arrEle[0]];
            obj1.lat = list[i][arrEle[2]];
            obj1.lon = list[i][arrEle[3]];
            obj1.stationLev = list[i][arrEle[5]];
            obj1.funitemmenuid = funitemmenuid;
            obj1.unit = unit;
            obj1.value = parseFloat(list[i][arrEle[7]]);
            obj1.directValue = parseFloat(list[i][arrEle[6]]);
            obj1.direct = staPoint.getWindDirection(list[i][arrEle[6]]);
            key = staPoint.getWindKey(obj1.value, obj1.directValue);
            datas[key].push(obj1);
            let obj2 = [];
            obj2.push(list[i][arrEle[3]]);
            obj2.push(list[i][arrEle[2]]);
            geoCoordMap[obj1.name] = obj2;


            let d = key.split("-")[2];
            let s = key.split("-")[1] / 1 + 1;
            // echartsData.push([obj1.lon,obj1.lat,obj1]);
            if (maphelper.map.getZoom() >= 12) {
                let isShow = true;
            } else {
                let isShow = false;
            }
            echartsData.push({
                name:"",
                value:[+obj1.lon,+obj1.lat,+obj1.value],
                symbolSize: [16, 24],
                symbol: 'image://' + ctxStatic + '/ultras/img/fxg/w' + s + '.png',
                symbolRotate: staPoint.getWindSimpleDegree(d),
                itemStyle: {
                    normal: {
                        borderColor: '#555',
                        borderWidth: 1,            // 标注边线线宽，单位px，默认为1
                        label: {

                            position: 'right',
                            formatter: "{c}",
                            textStyle: {
                                color: '#000',
                                fontSize: 14,
                                fontWeight: 'bold'
                            }

                        }
                    },
                    emphasis: {
                        borderColor: '#333',
                        borderWidth: 5,
                        label: {
                            show: false
                        }
                    }
                },
                originData:obj1
            })
        }



        let option = {
            animation: false,
            coordinateSystem: 'leaflet',
            backgroundColor: 'transparent',
            toolbox: {
                iconStyle: {
                    normal: {
                        borderColor: '#fff',
                        fontSize: "14px"
                    },
                    emphasis: {
                        borderColor: '#b1e4ff'
                    }
                }
            },
            tooltip:{
                trigger:'item'
            },
            series: [{
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        let station = params.data.originData;
                        return station.name + ' : ' + station.value + station.unit + '<br/>风向:' + station.direct;
                        // return station.name+":"+station.value+station.unit
                    }
                },
                name: 'sk',
                type: 'scatter',
                symbolSize: 8, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
                coordinateSystem: 'leaflet',
                label: {
                    show: isShow,
                    formatter:function(params){
                        let station = params.data.originData;
                        return station.value+station.unit
                    },

                    position: 'right',

                    textStyle: {
                        color: '#000',
                        fontSize: 12,
                        fontWeight:'bold'
                    },
                    emphasis: {
                        symbolSize: 8
                    }
                },

                data: echartsData
            }]
        }
        staPoint.option = option;
        let option1 = staPoint.getFinalOptions()
        staPoint.overlay.setOption(option1,true);
        staPoint.myChart.off('click',staPoint.windClick );
        staPoint.myChart.off('click',staPoint.pointClick );
        globalChart = staPoint.myChart;
        staPoint.myChart.on('click',staPoint.windClick);
        maphelper.map.off("zoomend",staPoint.zoomEnd)
        maphelper.map.on("zoomend",staPoint.zoomEnd)
    }
}
staPoint.getWindKey = function (value, degree) {
    let s, d;
    if (value < 2) {
        s = 0;
    } else if (value >= 2 && value < 3) {
        s = 1;
    } else if (value >= 3 && value < 5) {
        s = 2;
    } else if (value >= 5 && value < 7) {
        s = 3;
    } else if (value >= 7 && value < 13) {
        s = 4;
    } else if (value >= 13 && value < 19) {
        s = 5;
    } else if (value >= 19 && value < 21) {
        s = 6;
    } else {
        s = 7;
    }
    if (11.25 <= parseInt(degree) && parseInt(degree) < 33.75) {
        d = "1";
    } else if (33.75 < parseInt(degree) && parseInt(degree) < 56.25) {
        d = "2";
    } else if (56.25 < parseInt(degree) && parseInt(degree) < 78.75) {
        d = "3";
    } else if ((78.75 <= parseInt(degree) && parseInt(degree) < 101.25)) {
        d = "4";
    } else if (101.25 <= parseInt(degree) && parseInt(degree) < 123.75) {
        d = "5";
    } else if (123.75 < parseInt(degree) && parseInt(degree) < 146.25) {
        d = "6";
    } else if (146.25 < parseInt(degree) && parseInt(degree) < 168.75) {
        d = "7";
    } else if ((168.75 <= parseInt(degree) && parseInt(degree) < 191.25)) {
        d = "8";
    } else if (191.25 <= parseInt(degree) && parseInt(degree) < 213.75) {
        d = "9";
    } else if (213.75 < parseInt(degree) && parseInt(degree) < 236.25) {
        d = "10";
    } else if (236.25 < parseInt(degree) && parseInt(degree) < 258.75) {
        d = "11";
    } else if ((258.75 <= parseInt(degree) && parseInt(degree) < 281.25)) {
        d = "12";
    } else if (281.25 <= parseInt(degree) && parseInt(degree) < 303.75) {
        d = "13";
    } else if (303.75 < parseInt(degree) && parseInt(degree) < 326.25) {
        d = "14";
    } else if (326.25 < parseInt(degree) && parseInt(degree) < 348.75) {
        d = "15";
    } else {
        d = "0";
    }
    return "w-" + s + "-" + d;
}
staPoint.getWindDirection = function (degree) {
    let d = "";
    if (11.25 <= parseInt(degree) && parseInt(degree) < 33.75) {
        d = "北偏东";
    } else if (33.75 < parseInt(degree) && parseInt(degree) < 56.25) {
        d = "东北";
    } else if (56.25 < parseInt(degree) && parseInt(degree) < 78.75) {
        d = "东偏北";
    } else if ((78.75 <= parseInt(degree) && parseInt(degree) < 101.25)) {
        d = "东";
    } else if (101.25 <= parseInt(degree) && parseInt(degree) < 123.75) {
        d = "东偏南";
    } else if (123.75 < parseInt(degree) && parseInt(degree) < 146.25) {
        d = "东南";
    } else if (146.25 < parseInt(degree) && parseInt(degree) < 168.75) {
        d = "南偏东";
    } else if ((168.75 <= parseInt(degree) && parseInt(degree) < 191.25)) {
        d = "南";
    } else if (191.25 <= parseInt(degree) && parseInt(degree) < 213.75) {
        d = "南偏西";
    } else if (213.75 < parseInt(degree) && parseInt(degree) < 236.25) {
        d = "西南";
    } else if (236.25 < parseInt(degree) && parseInt(degree) < 258.75) {
        d = "西偏南";
    } else if ((258.75 <= parseInt(degree) && parseInt(degree) < 281.25)) {
        d = "西";
    } else if (281.25 <= parseInt(degree) && parseInt(degree) < 303.75) {
        d = "西偏北";
    } else if (303.75 < parseInt(degree) && parseInt(degree) < 326.25) {
        d = "西北";
    } else if (326.25 < parseInt(degree) && parseInt(degree) < 348.75) {
        d = "北偏西";
    } else {
        d = "北";
    }
    return d;
}
staPoint.getWindSimpleDegree = function (degree) {
    let d = parseInt(degree);
    switch (d) {
        case 0:
            return 0;
        case 1:
            return -22.5;
        case 2:
            return -45;
        case 3:
            return -67.5;
        case 4:
            return -90;
        case 5:
            return -112.5;
        case 6:
            return -135;
        case 7:
            return -157.5;
        case 8:
            return 180;
        case 9:
            return 157.7;
        case 10:
            return 135;
        case 11:
            return 112.5;
        case 12:
            return 90;
        case 13:
            return 67.5;
        case 14:
            return 45;
        case 15:
            return 22.5;
    }
}
/**
 * 初始化实况分析播放控件
 */
staPoint.getTimesList = function (times, type, nums) {
    let list = sktimeline.imgList;
    let list1 = [];
    let len = list.length;
    if (len >= 10) {
        let i = len - 10;
        let j = 0;
        for (i; i < list.length; i++) {
            if (i < len) {
                list1[j] = list[i].D_DATETIME;
                sktimeline.imgs[j] = list[i].url;
                j++;
            }
        }
        sktimeline.dataArray = list1;
        sktimeline.initPalay(sktimeline.changeByTime, list1, 10, 1000);


        let strOfTime = sktimeline.dataArray[sktimeline.dataArray.length - 1];
        let strFormat = strOfTime.substring(0, 4) + "-" + strOfTime.substring(4, 6) + "-" + strOfTime.substring(6, 8) + " " + strOfTime.substring(8, 10) + "时";
        let strFormat2 = strOfTime.substring(0, 4) + "-" + strOfTime.substring(4, 6) + "-" + strOfTime.substring(6, 8) + " " + strOfTime.substring(8, 10) + ":" + strOfTime.substring(10, 12) + ":" + strOfTime.substring(12, 14);
        /*$(".lgd_sk .lgd_time").html(strFormat);*/
        //$(".timeName").html(result.timeStr);
        $(".timeName2").html(strFormat2);
    } else {

    }
}


export default staPoint;