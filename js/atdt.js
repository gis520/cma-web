/**
 * 闪电定位
 * @type {{}}
 */
let atdts = atdts || {};
atdts.productList = [];
atdts.getAtdt = function (time) {
    atdts.clearAtdtProduct();
    $('.dateTime').text('数据时间:'+time);
    let datas = {
        funItemMenuId: 1019020201,
        time:time,
    };

    $.ajax({
        type:"get",
        url: ctx + '/institute/getMarker',
        data: datas,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        dataType:'json',
        success : function(result) {


                if (result.returnCode != 0) {
                    alert("当前没有闪电定位信息");
                    return;
                }
                atdts.showInEcharts(result);


        }
    });
}

/**
 * 处理闪电定位的数据
 * @param data
 */
atdts.getLatString = function (lat){
    return Math.abs(lat).toFixed(2) + "° " + (lat >= 0 ? "N" : "S")
}
atdts.getLonString = function(lon){
    return  Math.abs(lon).toFixed(2) + "° " + (lon >= 0 ? "E" : "W");
}
atdts.getDate = function getDate(date) {
    return date;
}


/**
 * echarts 添加闪电
 * @param data
 */

atdts.showInEcharts= function(data){

    let unit = {
        adtdmul: {
            "Datetime": {"cname": "资料时间", "unit": "-"},
            "Lat": {"cname": "纬度", "unit": ""},
            "Lon": {"cname": "经度", "unit": ""},
            "Lit_Current": {"cname": '电流强度', "unit": ''},
            "MARS_3": {"cname": '回击最大陡度', "unit": ''},
            "Pois_Err": {"cname": '定位误差', "unit": ''},
            "Pois_Type": {"cname": '定位方式', "unit": ''},
            "Year": {"cname": "年", "unit": "年"},
            "Mon": {"cname": "月", "unit": "月"},
            "Day": {"cname": "日", "unit": "日"},
            "Hour": {"cname": "时", "unit": "时"},
            "Min": {"cname": "分", "unit": "分钟"},
            "Second": {"cname": "秒", "unit": "秒"},
            "MSecond": {"cname": "资料观测毫秒", "unit": "ms"},
            "Layer_Num": {"cname": "层次序号", "unit": "N"},
        }
    }
    globalParam.atdtData = data.DS;

    let cunit = unit["adtdmul"]
    let datas = [];
    let geoCoordMap = {}
    let  echartsData = []
    data.DS.forEach(function (item) {
        let imgName;
        let size = 12;
        let cname = '云闪'
        if (item.V_CG_IC == 'IC') {
            imgName = "cloudAtdt";
            size = 10
        } else if (item.V_CG_IC == 'CG') {
            if (item.Lit_Current >= 0) {
                imgName = "posiviteAtdt"
                cname = "云地闪(正闪)"
            } else {
                imgName = "negativeAtdt"
                cname = "云地闪(负闪)"

            }
            size = 12
        }
        item.cname = cname

        echartsData.push([item.Lon,item.Lat,item])

    })

    function  formatter(data){
        item = data.data[2]
        let html = ' <div class="searchedPoint overlayer">'; //闪电定位没有站名站号
        html+="<div class='poptitle'>"+item.cname+"</div>";

        Object.keys(cunit).forEach(function (unititem) {
            if (!cunit[unititem] || !cunit[unititem]['cname'] || !item[unititem] || !item[unititem] == "null" || item[unititem] == '"null"' || item[unititem] == '999999' || item[unititem] == '999998') {
                return;
            }
            html += '<div class="popbody">' + cunit[unititem]['cname'] + ':';
            if (item[unititem].toString().length > 10) {
                html += "<br>"
            }
            if (unititem == 'Datetime') {
                html += atdts.getDate(item[unititem])
            } else if(unititem == 'Lon'){
                html+=atdts.getLonString(item[unititem])
            }else if(unititem=="Lat"){
                html+=atdts.getLatString(item[unititem])
            }
            else {
                html += item[unititem]
            }
            //加单位
            if (cunit[unititem]['unit'] != '-' && !!cunit[unititem]['unit']) {
                html += "(" + cunit[unititem]['unit'] + ")";
            }
            html += '</div>';
        })
        if(item['Lit_Prov']){
            html += "<div class='popbody'>行政单位:<br/>" + item['Lit_Prov'] + item['Lit_City'] + item['Lit_Cnty'] + "</div>"
        }
        html += '</div>'
        return html
    }



    let option = {
        animation: false,
        coordinateSystem: 'leaflet',
        backgroundColor: 'transparent',
        tooltip:{
            trigger:'item'
        },
        series: [{
            name: 'atdt',
            type: 'scatter',
            symbolSize: 8, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
            symbol:function(val,param){
                let item = val[2]
                // console.log(item)
                let imgName;
                if (item.V_CG_IC == 'IC') {
                    imgName = "cloudAtdt";
                    size = 10
                } else if (item.V_CG_IC == 'CG') {
                    if (item.Lit_Current >= 0) {
                        imgName = "posiviteAtdt"

                    } else {
                        imgName = "negativeAtdt"

                    }
                    size = 12
                }
                let originurl = location.origin
                let url = originurl+ctxStatic+"/ultras/img/atdt/" + imgName + ".png";
                return "image://"+url
            },
            tooltip: {
                trigger: 'item',
                backgroundColor:"transparent",
                formatter:formatter,
                position:'top'
            },
            coordinateSystem: 'leaflet',
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false,
                    symbolSize: 8
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#555',
                    borderWidth: 1,            // 标注边线线宽，单位px，默认为1
                    label: {
                        show:false

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
            data: echartsData
        }]
    }
    atdts.option = option;
    atdts.show = true;
    let option1 = staPoint.getFinalOptions();
    staPoint.overlay.setOption(option1,true);
    // loading.hide()

}
/**
 * 清空atdt
 */
atdts.clearAtdtProduct = function () {
    atdts.option = null;
    let option1 = staPoint.getFinalOptions();
    staPoint.overlay.setOption(option1,true);

    // atdts.show = false;
}

export default atdts;