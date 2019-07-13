import { maphelper } from './maphelper';
import staPoint from "./station-point";

export let common = common || {};
common.initMap = function() {
	maphelper.init('map', {
		x : 104,
		y : 36.5
	}, 3);
};

common.canvasPositionReset=function(){
    var lonlat = maphelper.map.containerPointToLatLng(L.point(0, 0));// 左上角
    var topLeft = maphelper.map.latLngToLayerPoint([lonlat.lat,lonlat.lng]);
    L.DomUtil.setPosition(canvas.lcanvas, topLeft);
},


common.getLegend = function (funItemMenuId, position,typeCode) {
	$(".figurebar").empty();
	$.ajax({
		url : ctx + "/multipleExhibition1/getLegend",
		type : "post",
		dataType : "json",
		async : true,
		data : {
			funItemMenuId : funItemMenuId,
			position : position,
			typeCode:typeCode
		},
		success : function(result) {
			//将全局变量lengend赋值
			var list = result.list;
			common.unit = result.unit;
			common.legend = list;
			var strHtml = "<div class='me_lengedName'>" + result.name + "("+ common.unit + ")" + "</div>";
			if (list.length < 18) {
				var width = 30 + "px";
				var lineHeight = 21 + "px";
			} else {
				var width = 12 + "px";
				var lineHeight = 11 + "px";
			}
			strHtml += "<div style='float:left;'>";
			strHtml += "<div style='overflow:hidden;'>"
			for (var i = 0; i < list.length; i++) {
				strHtml += "<div style='width:" + width
						+ ";height:15px;background-color:" + list[i].color
						+ ";float:left;'></div>";
			}
			strHtml += "</div>";
			strHtml += "<div style='overflow:hidden;'>";
			if (list.length < 18) {
				for (var i = 0; i < list.length; i++) {
					var name = list[i].name;
					strHtml += "<div style='width:" + width
							+ ";float:left;font-size:12px;text-align:right;'>"
							+ name + "</div>"
				}
			} else {
				for (var i = 0; i < list.length; i = i + 2) {
					var name = list[i].name;
					strHtml += "<div style='width:"
							+ 2
							* parseInt(width)
							+ "px;float:left;font-size:12px;text-align:right;'>"
							+ name + "</div>"
				}
			}
			strHtml += "</div></div>";
			$(".figurebar").append(strHtml);
			$(".figurebar").css("left",($("body").width()-$(".figurebar").width())/2+"px");
		}
	});
}

/**
 * 得到图标的url
 * @param legend
 * @param value
 * @returns {String}
 */
common.getIconByValue = function (legend, value) {
	value =Number(value);
	var iconUrl = "";
	for (var i = 0; i < legend.length; i++) {
		var rule = legend[i].rule;
		var arrRule = rule.split(",");
		var start = arrRule[0];
		var end = arrRule[1];
		if (start == "") {
			if (value < Number(end)) {
				iconUrl = legend[i].iconUrl;
				break;
			}
		}
		if (end == "") {
			if (value >= Number(start)) {
				iconUrl = legend[i].iconUrl;
				break;
			}
		}
		
		if (start != "" && end != "") {
			start = Number(start);
			end =Number(end);
			if (value >= start && value < end) {
				iconUrl = legend[i].iconUrl;
				break;
			}
		}
	}
	return iconUrl;
}

/**
 * 得到图例颜色
 * @param legend
 * @param value
 * @returns {String}
 */
common.getColorByValue = function (legend, value){
	var color = "";
	if(legend!=undefined){
		for (var i = 0; i < legend.length; i++) {
			var rule = legend[i].rule;
			var arrRule = rule.split(",");
			var start = arrRule[0];
			var end = arrRule[1];
			if (start != "" && end != "") {
				if (value >= parseInt(start) && value < parseInt(end)) {
					color = legend[i].color;
					break;
				}
			}else if (start == "" && end != ""){
				if (value < parseInt(end)) {
					color = legend[i].color;
					break;
				}
			}else if (start != "" && end == "") {
				if (value >= parseInt(start)) {
					color = legend[i].color;
					break;
				}
			}
			
		}
	}	
	return color;
}

/**
 * 画小方块
 */
common.drawPoint=function(myctx,lon,lat,value){
	var point = maphelper.map.latLngToContainerPoint(new L.LatLng(lat,lon));
	myctx.beginPath();
	myctx.lineWidth=4.5;
	myctx.moveTo(point.x,point.y);
	myctx.lineTo(point.x,point.y+4.5);
	myctx.strokeStyle=common.getColorByValue(common.legend,value);
	myctx.stroke();
}
common.drawPoint2=function(myctx,lon,lat,value){
	var point = maphelper.map.latLngToContainerPoint(new L.LatLng(lat,lon));
	myctx.beginPath();
	myctx.lineWidth=4.5;
	myctx.moveTo(point.x,point.y);
	myctx.lineTo(point.x,point.y+4.5);
	myctx.strokeStyle=common.getColorByValue(common.legend,value*100);
	myctx.stroke();
}

/**
 * 画圆角矩形
 */
common.drawSquare=function(myctx,lon,lat,value){
	var point = maphelper.map.latLngToContainerPoint(new L.LatLng(lat,lon));
	var startx= point.x;
	var starty= point.y;
	var squWidth=28;
	var squHeight=12;
	myctx.beginPath();
	myctx.moveTo(startx,starty);
	myctx.quadraticCurveTo(startx-5,starty+squHeight/2,startx,starty+squHeight);
	myctx.lineTo(startx+squWidth,starty+squHeight);
	myctx.moveTo(startx+squWidth,starty+squHeight);
	myctx.quadraticCurveTo(startx+squWidth+5,starty+squHeight/2,startx+squWidth,starty);
	myctx.lineTo(startx,starty);
	myctx.fillStyle=common.getColorByValue(common.legend,value);;
	myctx.fill();
	myctx.font="bold 10px Microsoft Yahei";
	myctx.fillStyle="#333";
	if((value+"").length==5 || (value+"").length==6){
		var txtstartx=startx;
	}else if((value+"").length==4){
		var txtstartx=startx+2;
	}else if((value+"").length==3){
		var txtstartx=startx+5;
	}else if((value+"").length==2){
		var txtstartx=startx+6;
	}else{
		var txtstartx=startx+10;
	}
	myctx.fillText(value+"",txtstartx,starty+squHeight-2);
}
common.drawSquare2=function(myctx,lon,lat,value){
	var point = maphelper.map.latLngToContainerPoint(new L.LatLng(lat,lon));
	var startx= point.x;
	var starty= point.y;
	var squWidth=28;
	var squHeight=12;
	myctx.beginPath();
	myctx.moveTo(startx,starty);
	myctx.quadraticCurveTo(startx-5,starty+squHeight/2,startx,starty+squHeight);
	myctx.lineTo(startx+squWidth,starty+squHeight);
	myctx.moveTo(startx+squWidth,starty+squHeight);
	myctx.quadraticCurveTo(startx+squWidth+5,starty+squHeight/2,startx+squWidth,starty);
	myctx.lineTo(startx,starty);
	myctx.fillStyle=common.getColorByValue(common.legend,value*100);;
	myctx.fill();
	myctx.font="bold 10px Microsoft Yahei";
	myctx.fillStyle="#333";
	if((value+"").length==5 || (value+"").length==6){
		var txtstartx=startx;
	}else if((value+"").length==4){
		var txtstartx=startx+2;
	}else if((value+"").length==3){
		var txtstartx=startx+5;
	}else if((value+"").length==2){
		var txtstartx=startx+6;
	}else{
		var txtstartx=startx+10;
	}
	myctx.fillText(value+"",txtstartx,starty+squHeight-2);
}

common.clearMarkers = function(arr){
	if(arr != undefined && arr.length > 0){
		var len = arr.length;
		for(var i=0;i < len;i++){
			arr[i].remove();
		}
		arr = [];
	}
}

//预警站点图标显示
common.addWarnMarker = function(data,arrMarker) {
	var preTime = data.time;
	var time = preTime.replaceAll(" ", "").replaceAll("-", "").replaceAll(":","");
	var w = 40;
	var h = 34;
	var signallevelcode = "";
	if (data.signallevelcode == "UNKNOWN") {
		data.signallevelcode = "BLUE";
	}
	var isExistWarningTypeFlag=false;
	for(var i=0;i<common.existWarningType.length;i++){
		if(data.signaltypecode==(common.existWarningType)[i]){
			isExistWarningTypeFlag=true;
			break;
		}
	}
	if(isExistWarningTypeFlag==true){
		var url=ctxStatic + '/ultra/img/gis/disasterWarning/'+ data.signaltypecode + "_" + data.signallevelcode+ ".png?v=1";
	}else{
		var url=ctxStatic + '/ultra/img/gis/disasterWarning/11B99'+ "_" + data.signallevelcode+ ".png?v=1";
	}
	var m = maphelper.addClickableMarker(common.translateNum(data.lon),
		common.translateNum(data.lat), {
			url : url,
			w : w,
			h : h,
			zIndexOffset:time
		}, function() {// 鼠标点击事件
			var provinceCode = data.areaId;
			maphelper.moveTo(data.lon,data.lat,8);
			globalParam.warnZoomLevel=8;
			globalParam.warnClick=true;
			/*if(maphelper.border != null){
				staPoint.clearBorder();
			}*/
			if(staPoint.bcircle  != null){
				staPoint.clearArea();
			}
			if(data.signallevelcode ==="BLUE"){
				var fillColor = "#144da0";
			}else if(data.signallevelcode ==="YELLOW"){
				var fillColor = "#feed00";
			}else if(data.signallevelcode ==="ORANGE"){
				var fillColor = "#f17511";
			}else if(data.signallevelcode ==="RED"){
				var fillColor = "#ff0000";
			}else{
				var fillColor = "#144da0";
			}
			emgcy.provinceCode = provinceCode;
//			maphelper.addCityBorder(provinceCode,fillColor);
			if(data.signaltypecode === "11B03" || data.signaltypecode === "11B20" || data.signaltypecode === "11B01"){
				// 暴雨、雷雨大风、台风 ===》降水
				var funitemmenuid = "1150101020";
				var elename = "降水";
				var unit = "mm";
			}else if(data.signaltypecode === "11B06"){
				//大风 ===》风
				var funitemmenuid = "115990104";
				var elename = "风";
				var unit = "m/s";
			}else if(data.signaltypecode === "11B09"){
				//高温 ===》气温
				var funitemmenuid = "115990101";
				var elename = "气温";
				var unit = "℃";
			}else if(data.signaltypecode === "11B17"){
				//大雾  ===》能见度
				var funitemmenuid = "115990106";
				var elename = "能见度";
				var unit = "km";
			}else{
				//默认气温
				var funitemmenuid = "115990101";
				var elename = "气温";
				var unit = "℃";
			}
			$(".me_eleName").text(elename + "("+unit+")");
			/*if($(".staBtn").hasClass("staChecked")){
				$(".staBtn").removeClass("staChecked");
			}*/
			if($("#sk").hasClass("sel")){
				syntheical.getLegend(funitemmenuid,"Gis",2);
				staPoint.clearEchartPoint();
				if(globalParam.provinceFocusId!=null&&globalParam.provinceFocusId!=""&&globalParam.provinceFocusId!="1000"){
					staPoint.getPoint2(funitemmenuid,staPoint.datetime,provinceCode,"1");
				}else{
					staPoint.getPoint(funitemmenuid,staPoint.datetime,provinceCode,"1");
				}
			}			
		}, function() {// 鼠标悬停事件
			var title=data.name+"发布"+data.codename+data.signallevel+"预警信号";
			var values="<div class='warnInfoTip'><div class='warnInfoTipTi'>"
					  +"<span class='warnTi'>"+title+"</span></div>"
				      +"<div class='warnInfoTipCont'>"+data.issuecontent+"</div></div>";
			return values;
		});
	arrMarker.push(m);
};

//灾情站点图标显示
common.addDisasterMarker = function(data,arrMarker) {
	var timestr = data.CREATED;
	timestr = timestr.replaceAll("-","").replaceAll(":", "").replaceAll(" ", "");
	var w = 40;
	var h = 34;
	var url=ctxStatic + "/ultra/img/gis/disasterWarning/"+data.MAINTYPE+".png?v=1";
	var m = maphelper.addClickableMarker(common.translateNum(data.lon),
			common.translateNum(data.lat), {
				url : url,
				w : w,
				h : h,
				zIndexOffset : timestr
			}, function() {// 鼠标点击事件
				
			}, function() {// 鼠标悬停事件
				var title=data.SENDERNAME+"发布"+data.type+"灾情";
				var values="<div class='warnInfoTip'><div class='warnInfoTipTi'>"
						  +"<span class='warnTi'>"+title+"</span></div>"
					      +"<div class='warnInfoTipCont'>"+data.IMPACT+"</div></div>";
				return values;
			});
	arrMarker.push(m);
};

/**
 * 
 * @param strDate 时间字符串 格式yyyy-MM-dd
 * @param ctime   要加上或减去的天数、小时数
 * @param format  是天、小时或别的
 * 
 * @returns {String}
 */
common.getDay = function(strDate,ctime,format) {
	strDate = strDate.replace(/-/g, "/");
	var date = new Date(strDate);
	if(format == "day"){
		date.setDate(date.getDate() + ctime);
	}else if(format == "hour"){
		date.setHours(date.getHours() + ctime);
	}
	return date.getFullYear() + "-" + (date.getMonth() + 1) + "-"+ date.getDate() +" "+date.getHours() + ":" + date.getMinutes()+":00";
}

common.zoomToSpecialType=function(zoom){
	if (zoom <= 6) {
		return "0";
	}/* else if (zoom >= 7 && zoom <= 8) {
		return "0%2C1";
	} */else {
		return "0%2C1";
		//return "0%2C1%2C2";
	}
}

/**
 * 根据zoom 判断调用精细化预报时 传递相应的参数
 * @param zoom
 * @returns {Number}
 */
common.getRangeLevel = function(zoom) {
	if (zoom >= 0 && zoom <6) {
		return 0;
	} else if (zoom >=6 && zoom <7){
		return 1;
	} else if (zoom >=7 && zoom <8){
		return 2;
	} else if (zoom >=8 && zoom <9){
		return 3;
	} else if (zoom >=9 && zoom <10){
		return 4;
	} else if (zoom >=10 && zoom <11){
		return 5;
	} else if (zoom >=11 && zoom <12){
		return 6;
	}
}

common.getCurrDate = function(format){
	if(format == "yyyy-MM-dd HH"){
		var myDate = new Date();
		var yyyy = myDate.getFullYear();
		var MM = myDate.getMonth() + 1;
		var dd = myDate.getDate();
		var HH = myDate.getHours();
		var mm = myDate.getMinutes();
		if(MM < 10){
			MM = "0" + MM;
		}
		if(dd < 10){
			dd = "0" + dd;
		}
		if(HH < 10){
			HH = "0" + HH;
		}
		if(mm < 10){
			mm = "0" + mm;
		}
		var time = yyyy+ "-" + MM+ "-" + dd+ " " + HH+ "时";
		return time;
	}
}

common.translateNum = function(num) {
	var r = parseInt((Math.random() - 0.5) * 200);
	return (parseFloat(num) + r * 0.004);
}
common.translateNum2 = function(num) {
	var r = parseInt((Math.random() - 0.5) * 200);
	return parseFloat(num);
}
common.existWarningType=["11B01","11B03","11B04","11B05","11B06","11B07","11B09",
                         "11B11","11B14","11B15","11B16", "11B17","11B19","11B20",
                         "11B21","11B22","11B25","11B99"];
common.warningTypeDisabled = {};
common.existDisasterType=["GALDR","THDDR","CWDR","DGDR","HLDR","CDDR","ICFDR",
                         "OMDR","TYODR","FOGDR","SNODR", "STSUDR","ERDR","SSDR",
                         "DWDR","MGDDR","HWDR","LCDDR","AIPDR","RSDR","FIRDR"];
common.provinceLatLon={
		'110000':[116,40],
		'120000':[118,39],
		'130000':[115,38],
		'140000':[112,37],
		'150000':[111,41],
		'310000':[122,31],
		'320000':[118,33],
		'330000':[121,29],
		'340000':[116,32],
		'350000':[118,26],
		'370000':[118,36],
		'410000':[113,34],
		'420000':[112,31],
		'430000':[111,27],
		'360000':[115,28],
		'440000':[113,22],
		'450000':[108,23],
		'460000':[110,19],
		'610000':[109,34],
		'620000':[101,37],
		'630000':[96,35],
		'640000':[106,37],
		'650000':[84,40],
		'500000':[107,29],
		'510000':[103,30],
		'520000':[107,27],
		'530000':[101,25],
		'540000':[89,31],
		'210000':[122,40],
		'220000':[126,43],
		'230000':[128,47]
}
common.emergency= function(data) {
	var zIndex;
	var curTime = new Date();
	var year = curTime.getFullYear();
	var dataTime = data.dataTime;
	var monthIndex = dataTime.indexOf("月");
	var dateIndex = dataTime.indexOf("日");
	var hourIndex = dataTime.indexOf("时");
	var minuteIndex = dataTime.indexOf("分");
	
	var month = dataTime.substring(0,monthIndex);
	if(month.length==1){
		month = "0"+month;
	}
	var date = dataTime.substring(monthIndex+1,dateIndex);
	if(date.length==1){
		length = "0" + date;
	}
	var hour = dataTime.substring(dateIndex+1,hourIndex);
	if(hour.length ==1){
		hour = "0" + hour;
	}
	if(minuteIndex<0){
		zIndex = year+month+date+hour+minute;
	}else{
		var minute = dataTime.substring(hourIndex+1,minuteIndex);
		if(minute.length ==1){
			minute = "0" +minute;
		}
		zIndex = year+month+date+hour+minute;
	}
	//var w = 28;
	//var h = 28;
	var typeid = parseInt(data.levelCode);
	var lonlat=common.provinceLatLon[data.provinceCode];
	if(lonlat!=undefined){
		var lon = lonlat[0];
		var lat = lonlat[1];
		switch(typeid){
			case 1:
				var emgyColor='red';
				break;
			case 2:
				var emgyColor='orange';
				break;
			case 3:
				var emgyColor='#bfb101';
				break;
			case 4:
				var emgyColor='blue';
				break;
			default:
				var emgyColor='blue';
			    break;
		}
		if(!data.type){
			data.type = "";
		}
		maphelper.addDivOfZIndex (common.translateNum(lon), common.translateNum(lat)
				, "<div style='width:100px;font:bold 15px Microsoft Yahei;color:"+emgyColor+"'>"+data.type+data.level+"</div>"
				,null
				,parseInt(zIndex)
				,null
				,function(){
					return data.emergencyInfo;
			}
			
		);
	}
};

common.mergeArray=function(mergeFrom,mergeTo){
	mergeTo = mergeFrom.concat(mergeTo); 
	return mergeTo;
}
