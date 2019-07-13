export let BoxOverlay = L.Class.extend({
	includes: L.Mixin.Events,
	initialize: function (bounds) {
		// save position of the layer or any options from the constructor
		this._bounds = L.latLngBounds(bounds);
		this._ibox = L.DomUtil.create('div', 'leaflet-ibox-layer');
	},

	onAdd: function (map) {
		this._map = map;
		if (this._map.options.zoomAnimation && L.Browser.any3d) {
			L.DomUtil.addClass(this._ibox, 'leaflet-zoom-animated');
		} else {
			L.DomUtil.addClass(this._ibox, 'leaflet-zoom-hide');
		}
		// create a DOM element and put it into one of the map panes
		// this._el = L.DomUtil.create('div', 'my-custom-layer
		// leaflet-zoom-animated');
		map.getPanes().overlayPane.appendChild(this._ibox);

		// add a viewreset event listener for updating layer's position, do the
		// latter
		map.on('viewreset', this._reset, this);

		if (map.options.zoomAnimation && L.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

		this._reset();
	},

	onRemove: function (map) {
		// remove layer's DOM elements and listeners
		map.getPanes().overlayPane.removeChild(this._ibox);
		map.off('viewreset', this._reset, this);
	},
	_animateZoom: function (e) {
		var map = this._map, box = this._ibox, scale = map.getZoomScale(e.zoom), nw = this._bounds.getNorthWest(), se = this._bounds.getSouthEast(),

			topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center), size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft), origin = topLeft._add(size._multiplyBy((1 / 2)
				* (1 - 1 / scale)));

		box.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
	},
	_reset: function () {
		var box = this._ibox, topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()), size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

		L.DomUtil.setPosition(box, topLeft);

		box.style.width = size.x + 'px';
		box.style.height = size.y + 'px';
	}
});


/**
 * 地图js
 */
export let maphelper = maphelper || {
	isMapInited: false,
	map: null,
	$elebox: null,
	$mapbox: null
};

maphelper.locationPanZoomBar = function () {
	$(maphelper.control.div).offset({
		"left": $(maphelper.map.getViewport()).width() + $(maphelper.map.getViewport()).offset().left - 50,
		"top": $(maphelper.map.getViewport()).offset().top + 50
	}).height(5 * 10 + 15);
	$(maphelper.control.zoombarDiv).height(5 * 10 + 5);
	$(maphelper.control.buttons[5]).offset({
		'top': $(maphelper.control.buttons[5]).offset().top - 32
	});
	maphelper.setTitle(false);
}
/**
 * 设置地图标题
 * 
 * @param text
 */
maphelper.setTitle = function (text) {
	if (text) {
		$('.mapText h4').text(text);
	}
	return;
	$('.mapText').offset({
		"left": ($(maphelper.map.getViewport()).width() - $('.mapText').width()) / 2 + $(maphelper.map.getViewport()).offset().left

	});
}

maphelper.init = function (mapid, px, zoom, fn, cfn) {
	/**
	   * 天地图地图类型说明 ______________________________ 图层名称 | 说明 vec_c | 矢量 img_c |
	   * 影像 ter_c | 地形 cva_c | 注记 eva_c | 英文注记 cia_c | 路网 eia_c | 英文路网
	   * ————————————————————————
	   */
	var url = "http://t1.tianditu.com/DataServer";
	//	var url="http://10.1.64.154/DataServer";
	var vec_w = new L.TileLayer.WMTS(url, {
		tileSize: 256,
		layer: 'vec_w',
	});
	var img_w = new L.TileLayer.WMTS(url, {
		tileSize: 256,
		layer: 'img_w'
	});
	var cva_w = new L.TileLayer.WMTS(url, {
		tileSize: 256,
		layer: 'cva_w'
	});
	var ter_c = new L.TileLayer.WMTS(url, {
		tileSize: 256,
		layer: 'ter_w'
	});
	var lmap = L.map(mapid, {
		crs: L.CRS.EPSG900913,
		// crs:L.CRS.EPSG4326,
		center: { lon: px.x, lat: px.y },
		zoom: zoom,
		minZoom: 4,
		maxZoom: 10,
		attributionControl: false
		/*
		 * zoom: zoom, minZoom : 4, maxZoom : 10,
		 */
	});
	maphelper.commonmap = vec_w;			//行政
	maphelper.administrativemap = img_w;  //卫星
	maphelper.termap = ter_c;  //地形
	maphelper.reliefmap = cva_w;          //标注
	lmap.addLayer(vec_w);
	lmap.addLayer(cva_w);
	maphelper.map = lmap;
}

/**
 * mapType 地图类型：political，satellite，topographic
 */
maphelper.switchMap = function (mapType) {
	if (maphelper.map == null || maphelper.commonmap == null || maphelper.administrativemap == null)
		return;
	switch (mapType) {
		case 'satellite':
			maphelper.map.removeLayer(maphelper.commonmap);
			maphelper.map.removeLayer(maphelper.termap);
			maphelper.map.removeLayer(maphelper.reliefmap);
			maphelper.map.addLayer(maphelper.administrativemap);
			maphelper.map.addLayer(maphelper.reliefmap);
			break;
		case 'political':
			maphelper.map.removeLayer(maphelper.administrativemap);
			maphelper.map.removeLayer(maphelper.termap);
			maphelper.map.removeLayer(maphelper.reliefmap);
			maphelper.map.addLayer(maphelper.commonmap);
			maphelper.map.addLayer(maphelper.reliefmap);
			break;
		case 'topographic':
			maphelper.map.removeLayer(maphelper.administrativemap);
			maphelper.map.removeLayer(maphelper.commonmap);
			maphelper.map.removeLayer(maphelper.reliefmap);
			maphelper.map.addLayer(maphelper.termap);
			maphelper.map.addLayer(maphelper.reliefmap);
			break;
		/*
		 * case 3: maphelper.map.removeLayer(maphelper.reliefmap);
		 * maphelper.map.removeLayer(maphelper.commonmap);
		 * maphelper.map.addLayer(maphelper.administrativemap); break;
		 */
		default:
			break;
	}
};

// 地图添加图标图层
maphelper.addMarkerLayer = function (datacode, layerName) {
	var layer = L.Marker(latlng).addTo(map);
	layer.addTo(map);
	layer.remove();
}
maphelper.moveTo = function (x, y, zoom) {
	maphelper.map.setView(L.latLng(y, x), zoom);
}
maphelper.addMarker = function (x, y, iconUrl) {
	var licon = L.Icon.Default;
	var w = 25;
	var h = 27;
	var configs = {}
	if ($.type(iconUrl) == 'string') {
		configs = {
			iconUrl: iconUrl,
			iconSize: [w, h],
			iconAnchor: [w / 2, h]
		};
	} else if ($.isPlainObject(iconUrl)) {
		w = iconUrl.w;
		h = iconUrl.h;
		configs = {
			iconUrl: iconUrl.url,
			iconSize: [w, h],
			iconAnchor: [w / 2, h]
		};
	}
	licon = L.icon(configs);
	var m = L.marker([y, x], {
		icon: licon
	}).addTo(maphelper.map);
	return {
		remove: function () {
			maphelper.map.removeLayer(m);
		}
	};

}
/*
 * maphelper.changeMap = function(){ L. };
 */

maphelper.addClickableMarker = function (x, y, iconUrl, cfn, hfn) {
	var licon = L.Icon.Default;
	var w = 25;
	var h = 27;
	var configs = {}
	if ($.type(iconUrl) == 'string') {
		configs = {
			iconUrl: iconUrl,
			iconSize: [w, h],
			iconAnchor: [w / 2, h]
		};
	} else if ($.isPlainObject(iconUrl)) {
		w = iconUrl.w;
		h = iconUrl.h;
		configs = {
			iconUrl: iconUrl.url,
			iconSize: [w, h],
			iconAnchor: [w / 2, h],
		};
	}
	licon = L.icon(configs);
	//alert(parseInt(iconUrl.zIndexOffset));
	var a = parseInt(iconUrl.zIndexOffset.substring(2, 12))
	var m = L.marker([y, x], {
		icon: licon,
		zIndexOffset: a
	}).addTo(maphelper.map);
	// m.data = opts;
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
				e.target.bindPopup(html, {
					closeButton: false,
					offset: L.point(0, -h / 2),
				}).openPopup();
			}
		});
		m.on('mouseout', function (e) {
			var p = e.target._popup;
			p._close();
		});

	}
	if (cfn) {
		m.on('click', function (e) {
			this.pinged = true;
			// maphelper.map.removeLayer(m);
			var html = cfn();
			/*
			 * var p = e.target._popup; if (p) { p._close() p.setContent(html);
			 * if (!p._isOpen) { p.openOn(maphelper.map); } } else {
			 * e.target.bindPopup(html, { offset : L.point(0, -h / 2)
			 * }).openPopup(); }
			 */
		})
	}
	return {
		remove: function () {
			maphelper.map.removeLayer(m);
		}
	};

}
maphelper.addClickableMarker2 = function (x, y, iconUrl, cfn, hfn) {
	var licon = L.Icon.Default;
	var w = 25;
	var h = 27;
	var configs = {}
	if ($.type(iconUrl) == 'string') {
		configs = {
			iconUrl: iconUrl,
			iconSize: [w, h],
			iconAnchor: [w / 2, h]
		};
	} else if ($.isPlainObject(iconUrl)) {
		w = iconUrl.w;
		h = iconUrl.h;
		configs = {
			iconUrl: iconUrl.url,
			iconSize: [w, h],
			iconAnchor: [w / 2, h / 2],
		};
	}
	licon = L.icon(configs);
	//alert(parseInt(iconUrl.zIndexOffset));
	var a = parseInt(iconUrl.zIndexOffset.substring(2, 12))
	var m = L.marker([y, x], {
		icon: licon,
		zIndexOffset: a
	}).addTo(maphelper.map);
	// m.data = opts;
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
				e.target.bindPopup(html, {
					closeButton: false,
					offset: L.point(0, -h / 2),
				}).openPopup();
			}
		});
		m.on('mouseout', function (e) {
			var p = e.target._popup;
			p._close();
		});

	}
	if (cfn) {
		m.on('click', function (e) {
			this.pinged = true;
			// maphelper.map.removeLayer(m);
			var html = cfn();
			/*
			 * var p = e.target._popup; if (p) { p._close() p.setContent(html);
			 * if (!p._isOpen) { p.openOn(maphelper.map); } } else {
			 * e.target.bindPopup(html, { offset : L.point(0, -h / 2)
			 * }).openPopup(); }
			 */
		})
	}
	return {
		remove: function () {
			maphelper.map.removeLayer(m);
		}
	};

}
// 地图加载完之后执行方法
// maphelper.mapInitCallback=function(fn){
// if(typeof(fn)=='function')
// {
// $.wait(function(){
// // CloseLoading();
// return maphelper.isMapInited == true;
// },
// fn.call());
// }
// }
maphelper.getLayersMaxZIndex = function () {
	var i = 0;
	for (var key in maphelper.map.layers) {
		if (maphelper.map.layers[key].getZIndex) {
			var j = maphelper.map.layers[key].getZIndex();
			j = parseInt(j);
			if (j > i)
				i = j;
		}
	}
	return i;
}
/**
 * 添加图片 imageUrl 图片url minX 最小x,即图片左上角经度 minY 最小y,即图片右下角纬度 maxX 最大x,即图片右下角经度
 * maxY 最大y,即图片左上角纬度
 */
maphelper.addImage = function (imageUrl, minX, minY, maxX, maxY, f) {
	var imageBounds = [[minY, minX], [maxY, maxX]];
	var imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
		opacity: f
	}).addTo(maphelper.map);
	return {
		visable: function (flag) {
			imageOverlay._image.hidden = flag;
		},
		changeUrl: function (url, f) {
			// timeline.pause();
			imageOverlay.setOpacity(f);
			imageOverlay.setUrl(url);
		},
		remove: function () {
			maphelper.map.getPanes().overlayPane.removeChild(imageOverlay._image);
		},
		overlayer: imageOverlay
	}
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
	return $("<img>", {
		src: imageUrl,
		'class': clazz,
		alt: '图片:' + imageUrl,
		load: function () {
			var $img = $(this);
			$img.css({
				height: (maxY - minY) * 100.0 / (t - b) + "%",
				width: (maxX - minX) * 100.0 / (r - l) + "%",
				left: (minX - l) * 100.0 / (r - l) + "%",
				top: (maxY - t) * 100.0 / (b - t) + "%",
				filter: 'alpha(opacity=' + (f * 100) + ")", /* IE */
				'-moz-opacity': f, /* Moz + FF */
				opacity: f
			}).show();
		}
	}).hide().css('position', 'absolute').appendTo(maphelper.$elebox);
}
maphelper.addDiv = function (x, y, html, classes, cfn, hfn, zindex) {
	if (!zindex) {
		zindex = 100;
	}
	var w = 18;
	var h = 18;
	var configs = {
		html: html,
		iconSize: [w, h],
		iconAnchor: [w / 2, h],
		className: classes
	};
	var licon = L.divIcon(configs);
	var m = L.marker([y, x], {
		icon: licon,
		zIndexOffset: zindex

	}).addTo(maphelper.map);

	if (hfn) {
		m.on('mouseover', function (e) {
			if (this.pinged) {
				return;
			}
			var tips = hfn();
			var p = e.target._popup;
			if (p) {
				p.setContent(tips);
				if (!p._isOpen) {
					p.openOn(maphelper.map);
				}
			} else {
				e.target.bindPopup(tips, {
					offset: L.point(0, -h / 2)
				}).openPopup();
			}
		});
		m.on('mouseout', function (e) {
			var p = e.target._popup;
			p._close();
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
				e.target.bindPopup(html, {
					offset: L.point(0, -h / 2)
				}).openPopup();
			}
		});
	}
	return {
		remove: function () {
			maphelper.map.removeLayer(m);
		}
	};
}

maphelper.addDivOfZIndex = function (x, y, html, classes, zIndex, cfn, hfn) {
	var w = 18;
	var h = 18;
	var configs = {
		html: html,
		iconSize: [w, h],
		iconAnchor: [w / 2, h],
		className: classes
	};
	var licon = L.divIcon(configs);
	var m = L.marker([y, x], {
		icon: licon,
		zIndexOffset: zIndex
	}).addTo(maphelper.map);

	if (hfn) {
		m.on('mouseover', function (e) {
			if (this.pinged) {
				return;
			}
			var tips = hfn();
			var p = e.target._popup;
			if (p) {
				p.setContent(tips);
				if (!p._isOpen) {
					p.openOn(maphelper.map);
				}
			} else {
				e.target.bindPopup(tips, {
					offset: L.point(0, -h / 2)
				}).openPopup();
			}
		});
		m.on('mouseout', function (e) {
			var p = e.target._popup;
			p._close();
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
				e.target.bindPopup(html, {
					offset: L.point(0, -h / 2)
				}).openPopup();
			}
		});
	}
	return {
		remove: function () {
			maphelper.map.removeLayer(m);
		}
	};
}

maphelper.addCityBorder = function (provinceCode) {
	if (provinceCode) {
		provinceCode = provinceCode + "";
		var id = provinceCode.substring(0, 2);
		$.each(citysData.features, function (i, n) {
			var data = n.properties;
			if (data.id === id) {
				maphelper.cityjson = L.geoJson(n, {
					style: {
						fillColor: '#f7c4c4',
						weight: 5,
						opacity: 0.5,
						color: '#FFFF00',
						dashArray: '3',
						fillOpacity: 0.3
					}
					//onEachFeature: onEachFeature  
				}).addTo(maphelper.map);
			}
		});
	}
}
maphelper.addCityBorder2 = function (code, fillColor) {
	code = code + "";
	if (code.substring(2, 6) === "0000") {
		var borderType = "weather:shengjie";
	} else {
		var borderType = "weather:shijie";
	}
	var border = L.tileLayer.wms("http://10.1.64.154/geoserver/weather/wms", {
		layers: borderType,
		format: 'image/png',
		TILED: true,
		transparent: true,
		crs: L.CRS.EPSG900913,
		width: 100,
		height: 100,
		sld_body: maphelper.getLayerSld(borderType, 'CODE', code, "#000", fillColor)
	});
	maphelper.border = border;
	maphelper.map.addLayer(border);
}


/**
 * 
 * @param layername			图层名称,如：weather:shengjie
 * @param propertyName      过滤属性名称,如:code,name等等
 * @param propertyValue		过滤属性值,如:130000，北京市等等
 * @param strokeColor		边界颜色
 * @param fillColor			填充颜色
 * @returns {String}
 */
maphelper.getLayerSld = function (layername, propertyName, propertyValue, strokeColor, fillColor) {
	var sld = '<?xml version="1.0" encoding="UTF-8"?>' +
		'<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">' +
		'<sld:UserLayer>' +
		'<sld:LayerFeatureConstraints>' +
		'<sld:FeatureTypeConstraint/>' +
		'</sld:LayerFeatureConstraints>' +
		'<sld:Name>' + layername + '</sld:Name>' +
		'<sld:UserStyle>' +
		'<sld:Title/>' +
		'<sld:FeatureTypeStyle>' +
		'<sld:Name>group 0</sld:Name>' +
		'<sld:FeatureTypeName>Feature</sld:FeatureTypeName>' +
		'<sld:SemanticTypeIdentifier>generic:geometry</sld:SemanticTypeIdentifier>' +
		'<sld:SemanticTypeIdentifier>simple</sld:SemanticTypeIdentifier>' +
		'<sld:Rule>' +
		'<sld:Name>New Rule</sld:Name>' +
		'<ogc:Filter>' +
		'<ogc:Or>' +
		'<ogc:PropertyIsEqualTo>' +
		'<ogc:PropertyName>' + propertyName + '</ogc:PropertyName>' +
		'<ogc:Literal>' + propertyValue + '</ogc:Literal>' +
		'</ogc:PropertyIsEqualTo>' +
		'</ogc:Or>' +
		'</ogc:Filter>' +
		'<sld:PolygonSymbolizer>' +
		'<sld:Fill>' +
		'<sld:CssParameter name="fill">' + fillColor + '</sld:CssParameter>' +
		'<sld:CssParameter name="fill-opacity">0.3</sld:CssParameter>' +
		'</sld:Fill>' +
		'<sld:Stroke>' +
		'<sld:CssParameter name="stroke">' + strokeColor + '</sld:CssParameter>' +
		'<sld:CssParameter name="stroke-width">1</sld:CssParameter>' +
		'<sld:CssParameter name="stroke-opacity">0.5</sld:CssParameter>' +
		'</sld:Stroke>' +
		'</sld:PolygonSymbolizer>' +
		'</sld:Rule>' +
		'</sld:FeatureTypeStyle>' +
		'</sld:UserStyle>' +
		'</sld:UserLayer>' +
		'</sld:StyledLayerDescriptor>';
	return sld;
}

maphelper.addCityBorder = function (code, fillColor) {
	code = code + "";
	if (code.substring(2, 6) === "0000") {
		var borderType = "weather:shengjie";
	} else {
		var borderType = "weather:shijie";
	}
	var border = L.tileLayer.wms("http://10.1.64.154/geoserver/weather/wms", {
		layers: borderType,
		format: 'image/png',
		TILED: true,
		transparent: true,
		crs: L.CRS.EPSG900913,
		sld_body: maphelper.getLayerSld(borderType, 'CODE', code, "#000", fillColor)
	});
	maphelper.border = border;
	maphelper.map.addLayer(border);
}


