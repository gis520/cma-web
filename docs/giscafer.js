/******/ (function (modules) {
  // webpackBootstrap
  /******/ // install a JSONP callback for chunk loading
  /******/ var parentJsonpFunction = window['webpackJsonp'];
  /******/ window['webpackJsonp'] = function webpackJsonpCallback(
    chunkIds,
    moreModules,
    executeModules,
  ) {
    /******/ // add "moreModules" to the modules object,
    /******/ // then flag all "chunkIds" as loaded and fire callback
    /******/ var moduleId,
      chunkId,
      i = 0,
      resolves = [],
      result;
    /******/ for (; i < chunkIds.length; i++) {
      /******/ chunkId = chunkIds[i];
      /******/ if (installedChunks[chunkId]) {
        /******/ resolves.push(installedChunks[chunkId][0]);
        /******/
      }
      /******/ installedChunks[chunkId] = 0;
      /******/
    }
    /******/ for (moduleId in moreModules) {
      /******/ if (
        Object.prototype.hasOwnProperty.call(moreModules, moduleId)
      ) {
        /******/ modules[moduleId] = moreModules[moduleId];
        /******/
      }
      /******/
    }
    /******/ if (parentJsonpFunction)
      parentJsonpFunction(chunkIds, moreModules, executeModules);
    /******/ while (resolves.length) {
      /******/ resolves.shift()();
      /******/
    }
    /******/ if (executeModules) {
      /******/ for (i = 0; i < executeModules.length; i++) {
        /******/ result = __webpack_require__(
          (__webpack_require__.s = executeModules[i]),
        );
        /******/
      }
      /******/
    }
    /******/ return result;
    /******/
  };
  /******/
  /******/ // The module cache
  /******/ var installedModules = {};
  /******/
  /******/ // objects to store loaded and loading chunks
  /******/ var installedChunks = {
    /******/ 1: 0,
    /******/
  };
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__,
    );
    /******/
    /******/ // Flag the module as loaded
    /******/ module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/ __webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/ __webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/ __webpack_require__.d = function (exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        /******/ configurable: false,
        /******/ enumerable: true,
        /******/ get: getter,
        /******/
      });
      /******/
    }
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/ __webpack_require__.n = function (module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default'];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, 'a', getter);
    /******/ return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/ __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/ __webpack_require__.p = '';
  /******/
  /******/ // on error function for async loading
  /******/ __webpack_require__.oe = function (err) {
    console.error(err);
    throw err;
  };
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function (module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      var BoxOverlay = (exports.BoxOverlay = L.Class.extend({
        includes: L.Mixin.Events,
        initialize: function initialize(bounds) {
          // save position of the layer or any options from the constructor
          this._bounds = L.latLngBounds(bounds);
          this._ibox = L.DomUtil.create('div', 'leaflet-ibox-layer');
        },

        onAdd: function onAdd(map) {
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

        onRemove: function onRemove(map) {
          // remove layer's DOM elements and listeners
          map.getPanes().overlayPane.removeChild(this._ibox);
          map.off('viewreset', this._reset, this);
        },
        _animateZoom: function _animateZoom(e) {
          var map = this._map,
            box = this._ibox,
            scale = map.getZoomScale(e.zoom),
            nw = this._bounds.getNorthWest(),
            se = this._bounds.getSouthEast(),
            topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
            size = map
              ._latLngToNewLayerPoint(se, e.zoom, e.center)
              ._subtract(topLeft),
            origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));

          box.style[L.DomUtil.TRANSFORM] =
            L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
        },
        _reset: function _reset() {
          var box = this._ibox,
            topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            size = this._map
              .latLngToLayerPoint(this._bounds.getSouthEast())
              ._subtract(topLeft);

          L.DomUtil.setPosition(box, topLeft);

          box.style.width = size.x + 'px';
          box.style.height = size.y + 'px';
        },
      }));

      /**
       * 地图js
       */
      var maphelper = (exports.maphelper = maphelper || {
        isMapInited: false,
        map: null,
        $elebox: null,
        $mapbox: null,
      });

      maphelper.locationPanZoomBar = function () {
        $(maphelper.control.div)
          .offset({
            left:
              $(maphelper.map.getViewport()).width() +
              $(maphelper.map.getViewport()).offset().left -
              50,
            top: $(maphelper.map.getViewport()).offset().top + 50,
          })
          .height(5 * 10 + 15);
        $(maphelper.control.zoombarDiv).height(5 * 10 + 5);
        $(maphelper.control.buttons[5]).offset({
          top: $(maphelper.control.buttons[5]).offset().top - 32,
        });
        maphelper.setTitle(false);
      };
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
          left:
            ($(maphelper.map.getViewport()).width() - $('.mapText').width()) /
              2 +
            $(maphelper.map.getViewport()).offset().left,
        });
      };

      maphelper.init = function (mapid, px, zoom, fn, cfn) {
        /**
         * 天地图地图类型说明 ______________________________ 图层名称 | 说明 vec_c | 矢量 img_c |
         * 影像 ter_c | 地形 cva_c | 注记 eva_c | 英文注记 cia_c | 路网 eia_c | 英文路网
         * ————————————————————————
         */
        var url = 'http://t1.tianditu.com/DataServer';
        //	var url="http://10.1.64.154/DataServer";
        var vec_w = new L.TileLayer.WMTS(url, {
          tileSize: 256,
          layer: 'vec_w',
        });
        var img_w = new L.TileLayer.WMTS(url, {
          tileSize: 256,
          layer: 'img_w',
        });
        var cva_w = new L.TileLayer.WMTS(url, {
          tileSize: 256,
          layer: 'cva_w',
        });
        var ter_c = new L.TileLayer.WMTS(url, {
          tileSize: 256,
          layer: 'ter_w',
        });
        var lmap = L.map(mapid, {
          crs: L.CRS.EPSG900913,
          // crs:L.CRS.EPSG4326,
          center: { lon: px.x, lat: px.y },
          zoom: zoom,
          minZoom: 4,
          maxZoom: 10,
          attributionControl: false,
          /*
           * zoom: zoom, minZoom : 4, maxZoom : 10,
           */
        });
        maphelper.commonmap = vec_w; //行政
        maphelper.administrativemap = img_w; //卫星
        maphelper.termap = ter_c; //地形
        maphelper.reliefmap = cva_w; //标注
        lmap.addLayer(vec_w);
        lmap.addLayer(cva_w);
        maphelper.map = lmap;
      };

      /**
       * mapType 地图类型：political，satellite，topographic
       */
      maphelper.switchMap = function (mapType) {
        if (
          maphelper.map == null ||
          maphelper.commonmap == null ||
          maphelper.administrativemap == null
        )
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
      };
      maphelper.moveTo = function (x, y, zoom) {
        maphelper.map.setView(L.latLng(y, x), zoom);
      };
      maphelper.addMarker = function (x, y, iconUrl) {
        var licon = L.Icon.Default;
        var w = 25;
        var h = 27;
        var configs = {};
        if ($.type(iconUrl) == 'string') {
          configs = {
            iconUrl: iconUrl,
            iconSize: [w, h],
            iconAnchor: [w / 2, h],
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
        var m = L.marker([y, x], {
          icon: licon,
        }).addTo(maphelper.map);
        return {
          remove: function remove() {
            maphelper.map.removeLayer(m);
          },
        };
      };
      /*
       * maphelper.changeMap = function(){ L. };
       */

      maphelper.addClickableMarker = function (x, y, iconUrl, cfn, hfn) {
        var licon = L.Icon.Default;
        var w = 25;
        var h = 27;
        var configs = {};
        if ($.type(iconUrl) == 'string') {
          configs = {
            iconUrl: iconUrl,
            iconSize: [w, h],
            iconAnchor: [w / 2, h],
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
        var a = parseInt(iconUrl.zIndexOffset.substring(2, 12));
        var m = L.marker([y, x], {
          icon: licon,
          zIndexOffset: a,
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
              e.target
                .bindPopup(html, {
                  closeButton: false,
                  offset: L.point(0, -h / 2),
                })
                .openPopup();
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
          });
        }
        return {
          remove: function remove() {
            maphelper.map.removeLayer(m);
          },
        };
      };
      maphelper.addClickableMarker2 = function (x, y, iconUrl, cfn, hfn) {
        var licon = L.Icon.Default;
        var w = 25;
        var h = 27;
        var configs = {};
        if ($.type(iconUrl) == 'string') {
          configs = {
            iconUrl: iconUrl,
            iconSize: [w, h],
            iconAnchor: [w / 2, h],
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
        var a = parseInt(iconUrl.zIndexOffset.substring(2, 12));
        var m = L.marker([y, x], {
          icon: licon,
          zIndexOffset: a,
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
              e.target
                .bindPopup(html, {
                  closeButton: false,
                  offset: L.point(0, -h / 2),
                })
                .openPopup();
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
          });
        }
        return {
          remove: function remove() {
            maphelper.map.removeLayer(m);
          },
        };
      };
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
            if (j > i) i = j;
          }
        }
        return i;
      };
      /**
       * 添加图片 imageUrl 图片url minX 最小x,即图片左上角经度 minY 最小y,即图片右下角纬度 maxX 最大x,即图片右下角经度
       * maxY 最大y,即图片左上角纬度
       */
      maphelper.addImage = function (imageUrl, minX, minY, maxX, maxY, f) {
        var imageBounds = [
          [minY, minX],
          [maxY, maxX],
        ];
        var imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
          opacity: f,
        }).addTo(maphelper.map);
        return {
          visable: function visable(flag) {
            imageOverlay._image.hidden = flag;
          },
          changeUrl: function changeUrl(url, f) {
            // timeline.pause();
            imageOverlay.setOpacity(f);
            imageOverlay.setUrl(url);
          },
          remove: function remove() {
            maphelper.map
              .getPanes()
              .overlayPane.removeChild(imageOverlay._image);
          },
          overlayer: imageOverlay,
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
          load: function load() {
            var $img = $(this);
            $img
              .css({
                height: ((maxY - minY) * 100.0) / (t - b) + '%',
                width: ((maxX - minX) * 100.0) / (r - l) + '%',
                left: ((minX - l) * 100.0) / (r - l) + '%',
                top: ((maxY - t) * 100.0) / (b - t) + '%',
                filter: 'alpha(opacity=' + f * 100 + ')' /* IE */,
                '-moz-opacity': f /* Moz + FF */,
                opacity: f,
              })
              .show();
          },
        })
          .hide()
          .css('position', 'absolute')
          .appendTo(maphelper.$elebox);
      };
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
          className: classes,
        };
        var licon = L.divIcon(configs);
        var m = L.marker([y, x], {
          icon: licon,
          zIndexOffset: zindex,
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
              e.target
                .bindPopup(tips, {
                  offset: L.point(0, -h / 2),
                })
                .openPopup();
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
              e.target
                .bindPopup(html, {
                  offset: L.point(0, -h / 2),
                })
                .openPopup();
            }
          });
        }
        return {
          remove: function remove() {
            maphelper.map.removeLayer(m);
          },
        };
      };

      maphelper.addDivOfZIndex = function (
        x,
        y,
        html,
        classes,
        zIndex,
        cfn,
        hfn,
      ) {
        var w = 18;
        var h = 18;
        var configs = {
          html: html,
          iconSize: [w, h],
          iconAnchor: [w / 2, h],
          className: classes,
        };
        var licon = L.divIcon(configs);
        var m = L.marker([y, x], {
          icon: licon,
          zIndexOffset: zIndex,
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
              e.target
                .bindPopup(tips, {
                  offset: L.point(0, -h / 2),
                })
                .openPopup();
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
              e.target
                .bindPopup(html, {
                  offset: L.point(0, -h / 2),
                })
                .openPopup();
            }
          });
        }
        return {
          remove: function remove() {
            maphelper.map.removeLayer(m);
          },
        };
      };

      maphelper.addCityBorder = function (provinceCode) {
        if (provinceCode) {
          provinceCode = provinceCode + '';
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
                  fillOpacity: 0.3,
                  //onEachFeature: onEachFeature
                },
              }).addTo(maphelper.map);
            }
          });
        }
      };
      maphelper.addCityBorder2 = function (code, fillColor) {
        code = code + '';
        if (code.substring(2, 6) === '0000') {
          var borderType = 'weather:shengjie';
        } else {
          var borderType = 'weather:shijie';
        }
        var border = L.tileLayer.wms(
          'http://10.1.64.154/geoserver/weather/wms',
          {
            layers: borderType,
            format: 'image/png',
            TILED: true,
            transparent: true,
            crs: L.CRS.EPSG900913,
            width: 100,
            height: 100,
            sld_body: maphelper.getLayerSld(
              borderType,
              'CODE',
              code,
              '#000',
              fillColor,
            ),
          },
        );
        maphelper.border = border;
        maphelper.map.addLayer(border);
      };

      /**
       *
       * @param layername			图层名称,如：weather:shengjie
       * @param propertyName      过滤属性名称,如:code,name等等
       * @param propertyValue		过滤属性值,如:130000，北京市等等
       * @param strokeColor		边界颜色
       * @param fillColor			填充颜色
       * @returns {String}
       */
      maphelper.getLayerSld = function (
        layername,
        propertyName,
        propertyValue,
        strokeColor,
        fillColor,
      ) {
        var sld =
          '<?xml version="1.0" encoding="UTF-8"?>' +
          '<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">' +
          '<sld:UserLayer>' +
          '<sld:LayerFeatureConstraints>' +
          '<sld:FeatureTypeConstraint/>' +
          '</sld:LayerFeatureConstraints>' +
          '<sld:Name>' +
          layername +
          '</sld:Name>' +
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
          '<ogc:PropertyName>' +
          propertyName +
          '</ogc:PropertyName>' +
          '<ogc:Literal>' +
          propertyValue +
          '</ogc:Literal>' +
          '</ogc:PropertyIsEqualTo>' +
          '</ogc:Or>' +
          '</ogc:Filter>' +
          '<sld:PolygonSymbolizer>' +
          '<sld:Fill>' +
          '<sld:CssParameter name="fill">' +
          fillColor +
          '</sld:CssParameter>' +
          '<sld:CssParameter name="fill-opacity">0.3</sld:CssParameter>' +
          '</sld:Fill>' +
          '<sld:Stroke>' +
          '<sld:CssParameter name="stroke">' +
          strokeColor +
          '</sld:CssParameter>' +
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
      };

      maphelper.addCityBorder = function (code, fillColor) {
        code = code + '';
        if (code.substring(2, 6) === '0000') {
          var borderType = 'weather:shengjie';
        } else {
          var borderType = 'weather:shijie';
        }
        var border = L.tileLayer.wms(
          'http://10.1.64.154/geoserver/weather/wms',
          {
            layers: borderType,
            format: 'image/png',
            TILED: true,
            transparent: true,
            crs: L.CRS.EPSG900913,
            sld_body: maphelper.getLayerSld(
              borderType,
              'CODE',
              code,
              '#000',
              fillColor,
            ),
          },
        );
        maphelper.border = border;
        maphelper.map.addLayer(border);
      };

      /***/
    },
    /* 1 */
    /***/ function (module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _atdt = __webpack_require__(3);

      var _atdt2 = _interopRequireDefault(_atdt);

      var _maphelper = __webpack_require__(0);

      var _echartslayer = __webpack_require__(4);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var staPoint = staPoint || {};
      /**
       * 自动站点工具类封装
       */

      var sktimeline = sktimeline || {};
      staPoint.rangeallList = [];
      var resultall = {},
        resultyb = void 0,
        resultsk = void 0,
        resultsp = void 0,
        tenRange = void 0,
        hover = void 0,
        isshow = void 0,
        ybshow = void 0; //实况、预报、历史同期相关全局变量
      var globalChart = void 0;
      /**
       * 预先添加实况图片
       */
      staPoint.initSKImg = function () {
        staPoint.img = _maphelper.maphelper.addImage(
          './images/me_noProduct.png',
          72.4,
          15.5,
          136.5,
          54.5,
          0,
        );
      };

      /**
       * 初始化站点的echart
       */
      staPoint.initStaEchart = function () {
        staPoint.overlay = new _echartslayer.EchartsLayer({
          animation: false,
          coordinateSystem: 'leaflet',
          backgroundColor: 'transparent',
        }).addTo(_maphelper.maphelper.map);
        staPoint.myChart = staPoint.overlay._ec;
      };

      /**
       * 清除echart站点
       */
      staPoint.clearEchartPoint = function () {
        staPoint.option = null;
        var option1 = staPoint.getFinalOptions();
        staPoint.overlay.setOption(option1, true);
        staPoint.overlay.off('click', staPoint.pointClick);
        _maphelper.maphelper.map.off('zoomend', staPoint.zoomEnd);
      };

      /**
       * 以（lon,lat）为圆心，画出km的范围
       * @param km
       * @param lat
       * @param lon
       */
      staPoint.drawArea = function (km, lat, lon) {
        var style1 = {
          strokeWidth: 2,
          color: '#c8e768', //颜色
          fillColor: '#ddecae',
          fillOpacity: 0.3, //透明度
        };
        var style2 = {
          strokeWidth: 2,
          color: '#bfb101', //颜色
          fillColor: '#bfb101',
        };
        var latlng = L.latLng(lat, lon);
        staPoint.bcircle = L.circle(latlng, km, style1).addTo(
          _maphelper.maphelper.map,
        );
        staPoint.scircle = L.circle(latlng, 60, style2).addTo(
          _maphelper.maphelper.map,
        );
        staPoint.mapDiv = _maphelper.maphelper.addDiv(
          lon + 0.8,
          lat,
          "<div style='color:#ff0000;'>80km</div>",
        );
        staPoint.crclnglat = { lon: lon, lat: lat };
      };

      /**
       * 清除画出的范围
       */
      staPoint.clearArea = function () {
        _maphelper.maphelper.map.removeLayer(staPoint.bcircle);
        _maphelper.maphelper.map.removeLayer(staPoint.scircle);
        staPoint.mapDiv.remove();
        staPoint.bcircle = null;
        staPoint.scircle = null;
        staPoint.mapDiv = null;
        staPoint.crclnglat = null;
      };

      /**
       * 清楚边界
       */
      staPoint.clearBorder = function () {
        _maphelper.maphelper.map.removeLayer(_maphelper.maphelper.border);
        _maphelper.maphelper.border = null;
        emgcy.provinceCode = null;
      };

      /**
       * 获取自动站要素最新时次 并初始化最新时次
       */
      staPoint.getLastTime = function (
        funItemMenuId,
        position,
        isDefault,
        timeDifference,
      ) {
        $.ajax({
          url: ctx + '/multiExhibition/autoStationNewTime',
          type: 'post',
          dataType: 'json',
          async: false,
          data: {
            funItemMenuId: funItemMenuId,
            position: position,
            isDefault: isDefault,
            timeDifference: timeDifference,
          },
          success: function success(result) {
            if (result != undefined && result !== '') {
              staPoint.timeStr = result.timeStr;
              staPoint.datetime = result.datetime;
              staPoint.productCode = result.productCode;
              var time = staPoint.datetime;
              if (time == undefined || time === '') {
                var date = new Date();
                time = date.format('yyyy-MM-dd HH') + '时';
              } else {
                time =
                  time.substring(0, 4) +
                  '-' +
                  time.substring(4, 6) +
                  '-' +
                  time.substring(6, 8) +
                  ' ' +
                  time.substring(8, 10) +
                  '时';
              }
              /*$("#time").text("当前数据最新时间："+time);*/
              $('#time').text('最新时间：' + time);
            } else {
            }
          },
        });
      };

      /**
       * 实况色版图
       * @param timeScope
       * @param dataCode
       */
      staPoint.getImgProduct = function (timeScope, dataCode) {
        $.ajax({
          url: ctx + '/img/receivepost',
          type: 'get',
          dataType: 'json',
          async: false,
          data: {
            dateTime: timeScope,
            dataCode: dataCode,
          },
          success: function success(data) {
            $('.sbanBtn').addClass('sbanChecked');
            if (data.length >= 10) {
              sktimeline.imgList = data;
            }
            if (data.length > 0) {
              if (staPoint.img) {
                //				staPoint.img.changeUrl("http://10.1.64.154/pic/"+ data[data.length-1].url,0.8);
                staPoint.img.changeUrl(data[data.length - 1].url, 0.8);
              } else {
                //				staPoint.img = maphelper.addImage("http://10.1.64.154/pic/"+ data[data.length-1].url,72.4, 15.5, 136.5, 54.5, 0.8);
                staPoint.img = _maphelper.maphelper.addImage(
                  data[data.length - 1].url,
                  72.4,
                  15.5,
                  136.5,
                  54.5,
                  0.8,
                );
              }
            } else {
              alert('没有获取到当前时间的色斑图');
            }
          },
        });
      };

      staPoint.getImgProduct2 = function (timeScope, dataCode) {
        $.ajax({
          url: ctx + '/img/receivepost2',
          type: 'get',
          dataType: 'json',
          async: false,
          data: {
            timeScope: timeScope,
            dataCode: dataCode,
          },
          success: function success(data) {
            if (data.length >= 10) {
              sktimeline.imgList = data;
            }
            if (staPoint.img) {
              staPoint.img.changeUrl(
                'http://10.1.64.154/pic/' + data[data.length - 1].url,
                0.8,
              );
            } else {
              staPoint.img = _maphelper.maphelper.addImage(
                'http://10.1.64.154/pic/' + data[data.length - 1].url,
                72.4,
                15.5,
                136.5,
                54.5,
                0.8,
              );
            }
          },
        });
      };

      /**
       * 得到实况站点
       */
      staPoint.getPoint = function (
        funitemmenuid,
        times,
        provinceCode,
        provinceFlag,
      ) {
        var typeCode = 'NWST';
        $.ajax({
          url: ctx + '/exhibitionData/getMarker',
          type: 'get',
          dataType: 'json',
          async: true,
          data: {
            dateTime: times,
            funitemmenuid: funitemmenuid,
            provinceFlag: provinceFlag,
            province: provinceCode,
            typeCode: typeCode,
          },
          success: function success(result) {
            staPoint.eleAttr = result.eleValue;
            if (provinceCode === '1000') {
              staPoint.drawPoint(result, funitemmenuid, globalParam.spiltList);
            } else {
              //过滤，去掉区域站
              var list = result.list;
              var list1 = [];
              var eleValue = result.eleValue;
              for (var i = 0; i < list.length; i++) {
                var arrele = eleValue.split(',');
                if (list[i][arrele[5]] !== '14') {
                  list1.push(list[i]);
                }
              }
              result.list = list1;
              staPoint.drawPoint(result, funitemmenuid, globalParam.spiltList); //画echarts站点
            }
          },
        });
      };
      staPoint.getPoint2 = function (
        funitemmenuid,
        times,
        provinceCode,
        provinceFlag,
      ) {
        var typeCode = 'NWST';
        $.ajax({
          url: ctx + '/exhibitionData/getMarker',
          type: 'get',
          dataType: 'json',
          async: true,
          data: {
            dateTime: times,
            funitemmenuid: funitemmenuid,
            provinceFlag: provinceFlag,
            province: provinceCode,
            typeCode: typeCode,
          },
          success: function success(result) {
            staPoint.eleAttr = result.eleValue;
            if (provinceCode == '1000') {
              staPoint.rangeallList = staPoint.rangeallList.concat(result.list);
            }
            staPoint.eleAttr = result.eleValue;
            if (provinceCode === '1000') {
              staPoint.drawPoint(result, funitemmenuid, globalParam.spiltList);
            } else {
              //过滤，去掉区域站
              var list = result.list;
              staPoint.rangeallList = staPoint.rangeallList.concat(result.list);

              staPoint.drawPoint(result, funitemmenuid, globalParam.spiltList); //画echarts站点
            }
          },
        });
      };
      /*
       * 获取青藏高原站点
       */

      staPoint.getPointByCode = function (
        funitemmenuid,
        times,
        provinceCode,
        provinceFlag,
      ) {
        var typeCode = 'NWST';
        $.ajax({
          url: ctx + '/exhibitionData/getMarkerByCode',
          type: 'get',
          dataType: 'json',
          async: true,
          data: {
            dateTime: times,
            funitemmenuid: funitemmenuid,
            provinceFlag: provinceFlag,
            province: provinceCode,
            typeCode: typeCode,
          },
          success: function success(result) {
            staPoint.eleAttr = result.eleValue;
            if (provinceCode == '1000') {
              staPoint.rangeallList = staPoint.rangeallList.concat(result.list);
            }
            staPoint.eleAttr = result.eleValue;
            if (provinceCode === '1000') {
              staPoint.drawPoint(result, funitemmenuid, globalParam.spiltList);
            } else {
              //过滤，去掉区域站
              var list = result.list;
              //staPoint.rangeallList = result.list;
              staPoint.rangeallList = staPoint.rangeallList.concat(result.list);

              staPoint.drawPoint(result, funitemmenuid, globalParam.spiltList); //画echarts站点
            }
          },
        });
      };
      /**
       * 	list json数据
       *  flag 1 为预警点击 0为周边80公里站
       */
      staPoint.prcsData = function (result, flag, funitemmenuid, lon, lat) {
        var list = result.list;
        var length = list.length;
        for (var i = 0; i < length; i++) {
          list[i].funid = funitemmenuid;
        }
        var totalRecord = list.length;
        var totalPageNum = Math.ceil(totalRecord / publicPageSize);
        if (totalPageNum != 0) {
          for (var _i = 0; _i < totalPageNum; _i++) {
            var tempArrPageRecord = syntheical.groupRecord(
              publicPageSize * _i,
              publicPageSize * (_i + 1),
              list,
            );
            pageRecord[_i + ''] = tempArrPageRecord;
          }
          if (flag === 0) {
            $('#bigName').text(
              '(' +
                Number(lon).toFixed(2) +
                ',' +
                Number(lat).toFixed(2) +
                ')80km内站点列表',
            );
          } else if (flag === 1) {
            $('#bigName').text('预警区域站点列表');
          }
          staPoint.getRecord(0, funitemmenuid);
          // 分页组件
          $('#pagination').pagination(totalRecord, {
            prev_text: '上一页',
            next_text: '下一页',
            items_per_page: publicPageSize,
            current_page: 0,
            num_display_entries: 2,
            num_edge_entries: 1,
            link_to: 'javascript:void(0)',
            callback: staPoint.getRecord,
          });
        }
      };
      staPoint.prcsData2 = function (result, flag, funitemmenuid, lon, lat) {
        var list = result.list;
        var length = list.length;
        var totalRecord = void 0;
        if (length < 100) {
          for (var i = 0; i < length; i++) {
            list[i].funid = funitemmenuid;
            totalRecord = length;
          }
        } else {
          for (var _i2 = 0; _i2 < 100; _i2++) {
            list[_i2].funid = funitemmenuid;
          }
          totalRecord = 100;
        }

        var totalPageNum = Math.ceil(totalRecord / publicPageSize);
        if (totalPageNum != 0) {
          for (var _i3 = 0; _i3 < totalPageNum; _i3++) {
            var tempArrPageRecord = syntheical.groupRecord(
              publicPageSize * _i3,
              publicPageSize * (_i3 + 1),
              list,
            );
            pageRecord[_i3 + ''] = tempArrPageRecord;
          }
          if (flag === 0) {
            $('#bigName').text(
              '(' +
                Number(lon).toFixed(2) +
                ',' +
                Number(lat).toFixed(2) +
                ')周边80公里站点列表',
            );
          } else if (flag === 1) {
            var provinceName = '';
            if (globalParam.provinceFocus) {
              for (var _i4 = 0; _i4 < provinceList.length; _i4++) {
                if (
                  provinceList[_i4].provincecode === globalParam.provinceFocusId
                ) {
                  provinceName = provinceList[_i4].shortname;
                }
              }
            } else {
              provinceName = '全国';
            }
            var title_a = '';
            if (funitemmenuid === '115990101') {
              title_a = provinceName + '最高气温排名';
            } else if (funitemmenuid === '115990102') {
              title_a = provinceName + '最高气压排名';
            } else if (funitemmenuid === '115990103') {
              title_a = provinceName + '最高相对湿度排名';
            } else if (
              funitemmenuid === '115990104' ||
              funitemmenuid === '115990108' ||
              funitemmenuid === '115990109' ||
              funitemmenuid === '115990110' ||
              funitemmenuid === '115990111'
            ) {
              title_a = provinceName + '最高风力排名';
            } else if (
              funitemmenuid === '1150101020' ||
              funitemmenuid === '1150101021' ||
              funitemmenuid === '1150101022' ||
              funitemmenuid === '1150101023' ||
              funitemmenuid === '1150101024'
            ) {
              title_a = provinceName + '最高降水排名';
            } else if (funitemmenuid === '115990106') {
              title_a = provinceName + '最高能见度排名';
            }
            title_a += 'Top100';
            if (globalParam.provinceFocus) {
              title_a += '(含区域站)';
            }

            var str =
              "<div class='searchBox'><div class='me_search'><input type='text' class='staNo' placeholder='请输入台站号或台站名'/><span class='searchBtn'></span></div></div>";
            $('#bigName').text(title_a);
          }
          staPoint.getRecord(0, funitemmenuid);
          // 分页组件
          $('#pagination').pagination(totalRecord, {
            prev_text: '上一页',
            next_text: '下一页',
            items_per_page: publicPageSize,
            current_page: 0,
            num_display_entries: 2,
            num_edge_entries: 1,
            link_to: 'javascript:void(0)',
            callback: staPoint.getRecord,
          });
        }
      };

      /**
       * 拼接表格
       */
      staPoint.getRecord = function (pageNo, funitemmenuid) {
        $('.skright').show();
        $('.me_warningTabBody').empty();
        var tbody = '';
        var tempArr = pageRecord[pageNo + ''];
        var arrEleval = staPoint.eleAttr.split(',');
        if (tempArr != undefined) {
          for (var i = 0; i < tempArr.length; i++) {
            if (tempArr[i] == undefined || tempArr[i] == null) {
              tbody +=
                '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
            } else {
              tbody +=
                "<tr class='me_warningInfoTr' " +
                "Station_levl='" +
                tempArr[i][arrEleval[5]] +
                "'" +
                " staId='" +
                tempArr[i][arrEleval[1]] +
                "' staName='" +
                tempArr[i][arrEleval[0]] +
                "' lon='" +
                tempArr[i][arrEleval[3]] +
                "' lat='" +
                tempArr[i][arrEleval[2]] +
                "' province='" +
                tempArr[i][arrEleval[4]] +
                "' funid ='" +
                tempArr[i]['funid'] +
                "'>";
              var serNo = publicPageSize * pageNo + (i + 1);
              var area_ = tempArr[i][arrEleval[4]];
              var areaTi = area_;
              if (area_.length > 3) {
                area_ = area_.substring(0, 3) + '...';
              }
              var station_ = tempArr[i][arrEleval[0]];
              var staNo_ = tempArr[i][arrEleval[1]];
              var stationTi = station_;
              //站名显示问题。英文字母与中文汉字(中文名字最长显示五个)
              var strLength = staPoint.getLength(station_);
              if (strLength > 10) {
                station_ = station_.substring(0, 5) + '...';
              }
              var value = void 0;
              if (
                globalParam.skId != null &&
                globalParam.skId != undefined &&
                globalParam.skId != {}
              ) {
                if (
                  globalParam.skId === '115990104' ||
                  globalParam.skId === '115990108' ||
                  globalParam.skId === '115990109' ||
                  globalParam.skId === '115990110' ||
                  globalParam.skId === '115990111'
                ) {
                  value = tempArr[i][arrEleval[7]];
                } else {
                  value = tempArr[i][arrEleval[6]];
                }
              } else {
                value = tempArr[i][arrEleval[6]];
              }
              tbody +=
                '<td>' +
                serNo +
                "</td><td title='" +
                areaTi +
                "'>" +
                area_ +
                "</td><td title='" +
                stationTi +
                "'>" +
                station_ +
                '(' +
                staNo_ +
                ')' +
                '</td><td>' +
                value +
                '</td>';
              tbody += '</tr>';
            }
          }
          $('.me_warningTabBody').append(tbody);
          $('.me_warningTabBody tr').on('click', function () {
            var stationId = $(this).attr('staid');
            var stationName = $(this).attr('staname');
            var lat = $(this).attr('lat');
            var lon = $(this).attr('lon');
            var stationLev = $(this).attr('station_levl');
            var funid = $(this).attr('funid');
            //此处为了能提示站点位置
            staPoint.addLocationMark(lat, lon);
            //将点移动到地图中心，并缩放地图。
            //common.zoom = maphelper.map.getZoom();
            common.zoom = _maphelper.maphelper.map.getZoom();
            if (common.zoom <= 7) {
              _maphelper.maphelper.moveTo(lon, lat, 7);
            } else {
              _maphelper.maphelper.moveTo(lon, lat, common.zoom);
            }
            staPoint.getStationDetail(
              funid,
              stationId,
              stationName,
              lon,
              lat,
              stationLev,
            );
          });
        }
      };
      staPoint.getLength = function (str) {
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0,
          len = str.length,
          charCode = -1;
        for (var i = 0; i < len; i++) {
          charCode = str.charCodeAt(i);
          if (charCode >= 0 && charCode <= 128) realLength += 1;
          else realLength += 2;
        }
        return realLength;
      };
      staPoint.addLocationMark = function (lat, lon) {
        var iconUrl = {
          w: 25,
          h: 25,
          url: ctxStatic + '/ultra/img/gis/location.gif',
          zIndexOffset: new Date().format('yyyyMMddHHmmss'),
        };
        staPoint.removeLocationMark = _maphelper.maphelper.addClickableMarker2(
          common.translateNum2(lon),
          common.translateNum2(lat),
          iconUrl,
          null,
          null,
        );
      };

      staPoint.getAreaSta = function (
        funitemmenuid,
        lon,
        lat,
        times,
        drawFlag,
      ) {
        $('.clickLoading').show();
        $.ajax({
          url: ctx + '/gis/getStaInfoByLonlat',
          type: 'post',
          dataType: 'json',
          async: false,
          data: {
            funitemmenuid: funitemmenuid,
            lon: lon,
            lat: lat,
            dateTime: times,
          },
          success: function success(result) {
            if (result.list.length == '0') {
              //alert("80公里内没有站点");
              $('.skright').hide();
            } else {
              $('.me_eleName').text(
                globalParam.elename + '(' + globalParam.unit + ')',
              );
              //maphelper.moveTo(lon,lat,8);
              //画出80km范围
              /*if(staPoint.bcircle == null){
    	staPoint.drawArea(80000,lat,lon);
    }*/
              //过滤区域站，以及超过80公里的点
              var list = result.list;
              var lnglat1 = L.latLng(lat, lon);
              staPoint.eleAttr = result.eleValue;
              var arrEle = staPoint.eleAttr.split(',');
              var list2 = [];
              for (var i = 0; i < list.length; i++) {
                var lnglat2 = L.latLng(list[i][arrEle[2]], list[i][arrEle[3]]);
                var distance = lnglat1.distanceTo(lnglat2);
                /*if(list[i] != "14" && distance <= 80000){
     	list2.push(list[i]);
     }*/
                //风力小于2m/s的不予显示站点及表格数据。
                if (
                  funitemmenuid == '115990104' ||
                  funitemmenuid == '115990108' ||
                  funitemmenuid == '115990109' ||
                  funitemmenuid == '115990110' ||
                  funitemmenuid == '115990111'
                ) {
                  if (list[i].WIN_S_Max < 2) {
                    continue;
                  }
                }
                if (globalParam.provinceFocus) {
                  if (distance <= 80000) {
                    list2.push(list[i]);
                  }
                } else {
                  if (distance <= 80000) {
                    if (list[i].Station_levl != '14') {
                      list2.push(list[i]);
                    }
                  }
                }
              }
              result.list = list2;
              if (drawFlag) {
                staPoint.drawPoint(
                  result,
                  funitemmenuid,
                  globalParam.spiltList,
                ); //画echarts站点
              }
              staPoint.prcsData2(result, 0, funitemmenuid, lon, lat); //表格数据
            }
            $('.clickLoading').hide();
          },
        });
      };

      /**
       * echart画站点
       */
      staPoint.drawPoint = function (result, funitemmenuid, splitList) {
        if (
          funitemmenuid == 115990104 ||
          funitemmenuid == 115990108 ||
          funitemmenuid == 115990109 ||
          funitemmenuid == 115990110 ||
          funitemmenuid == 115990111
        ) {
          //如果是风，则进行画风向杆图标
          staPoint.drawWindPoint(result, funitemmenuid, splitList);
          return;
        }
        var list = result.list;
        var length = list.length;
        var eleAttr = result.eleValue;
        var unit = result.unit;
        var arrEle = eleAttr.split(',');
        if (length > 0) {
          var data = [];
          var _echartsData = [];
          var geoCoordMap = {};
          for (var i = 0; i < length; i++) {
            var obj1 = {};
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
            var obj2 = [];
            obj2.push(list[i][arrEle[3]]);
            obj2.push(list[i][arrEle[2]]);
            geoCoordMap[obj1.name] = obj2;
            _echartsData.push([
              list[i][arrEle[3]],
              list[i][arrEle[2]],
              obj1.value,
              obj1,
            ]);
          }
        }
        if (_maphelper.maphelper.map.getZoom() >= 12) {
          var _isShow = true;
        } else {
          var _isShow2 = false;
        }
        var pieces = [];
        var colors = [];
        splitList.forEach(function (item) {
          var temp = {};
          if (item.start !== undefined) {
            temp.gt = item.start;
          }
          if (item.end !== undefined) {
            temp.lte = item.end;
          }
          pieces.push(temp);
          colors.unshift(item.color);
        });

        var visualMap = {
          type: 'piecewise',
          show: false,
          dimension: '2',
          top: 10,
          pieces: pieces,
          color: colors,
          orient: 'horizontal',
        };

        var option = {
          animation: false,
          coordinateSystem: 'leaflet',
          backgroundColor: 'transparent',
          visualMap: visualMap,

          toolbox: {
            iconStyle: {
              normal: {
                borderColor: '#fff',
                fontSize: '14px',
              },
              emphasis: {
                borderColor: '#b1e4ff',
              },
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: function formatter(params) {
              var station = params.data[3];
              return station.name + ':' + station.value + station.unit;
            },
          },
          series: [
            {
              name: 'sk',
              type: 'scatter',
              symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
              symbol: 'circle',
              coordinateSystem: 'leaflet',
              label: {
                show: isShow,
                formatter: function formatter(params) {
                  var station = params.data[3];
                  return station.value + station.unit;
                },

                position: 'right',

                textStyle: {
                  color: '#000',
                  fontSize: 12,
                  fontWeight: 'bold',
                },
                emphasis: {
                  symbolSize: 8,
                },
              },
              itemStyle: {
                normal: {
                  borderColor: '#555',
                  borderWidth: 1, // 标注边线线宽，单位px，默认为1
                },
                emphasis: {
                  borderColor: '#333',
                  borderWidth: 5,
                  label: {
                    show: false,
                  },
                },
              },
              data: echartsData,
            },
          ],
        };
        staPoint.option = option;

        var option1 = staPoint.getFinalOptions();

        staPoint.overlay.setOption(option1, true);

        staPoint.myChart.off('click', staPoint.pointClick);
        staPoint.myChart.off('click', staPoint.windClick);
        _maphelper.maphelper.map.off('zoomend', staPoint.zoomEnd);
        _maphelper.maphelper.map.on('zoomend', staPoint.zoomEnd);
        globalChart = staPoint.myChart;
        staPoint.myChart.on('click', staPoint.pointClick);
      };

      staPoint.getFinalOptions = function () {
        var option1 = {
          animation: false,
          coordinateSystem: 'leaflet',
          backgroundColor: 'transparent',
        };
        if (staPoint.option) {
          $.extend(true, option1, staPoint.option);
          if (_atdt2.default.option) {
            option1.series.push(_atdt2.default.option.series[0]);
          }
        } else {
          if (_atdt2.default.option) {
            $.extend(true, option1, _atdt2.default.option);
          }
        }
        return option1;
      };
      staPoint.zoomEnd = function () {
        try {
          var zoom = _maphelper.maphelper.map.getZoom();
          var options = staPoint.overlay.getEcharts().getOption();
          var series = options.series;
          if (zoom >= 12) {
            series.forEach(function (item) {
              if (item.name == 'sk') {
                item.label.show = true;
              }
            });
          } else {
            series.forEach(function (item) {
              if (item.name == 'sk') {
                item.label.show = false;
              }
            });
          }
          if (task == null) {
            task = setTimeout(function () {
              staPoint.overlay.setOption(options);
              task = null;
            }, 150);
          } else {
            clearTimeout(task);
            task = setTimeout(function () {
              staPoint.overlay.setOption(options);
              task = null;
            }, 150);
          }
        } catch (e) {
          console.log(e);
        }
      };

      staPoint.pointClick = function (params) {
        if (params.seriesName == 'sk') {
          var data = params.data[3];
          var stationId = data.stationId;
          var stationName = data.stationName;
          var lat = data.lat;
          var lon = data.lon;
          var stationLev = data.stationLev;
          var funid = data.funitemmenuid;
          staPoint.getStationDetail(
            funid,
            stationId,
            stationName,
            lon,
            lat,
            stationLev,
          );
        }
      };

      staPoint.windClick = function (params) {
        if ((params.seriesName = 'sk')) {
          var data = params.data.originData;
          var stationId = data.stationId;
          var stationName = data.stationName;
          var lat = data.lat;
          var lon = data.lon;
          var stationLev = data.stationLev;
          var funid = data.funitemmenuid;
          staPoint.getStationDetail(
            funid,
            stationId,
            stationName,
            lon,
            lat,
            stationLev,
          );
        }
      };

      /**
       * echart画站点，按国家站/区域站区分站点颜色
       */
      staPoint.drawPoint2 = function (result, funitemmenuid, splitList) {
        if (
          funitemmenuid == 115990104 ||
          funitemmenuid == 115990108 ||
          funitemmenuid == 115990109 ||
          funitemmenuid == 115990110 ||
          funitemmenuid == 115990111
        ) {
          //如果是风，则进行画风向杆图标
          staPoint.drawWindPoint(result, funitemmenuid, splitList);
          return;
        }

        var list = result.list;
        var nationPointList = []; //国家站
        var regPointList = []; //区域站
        var eleValue = result.eleValue;
        var arrele = eleValue.split(',');
        for (var i = 0; i < list.length; i++) {
          if (list[i][arrele[5]] !== '14') {
            //国家站
            nationPointList.push(list[i]);
          } else {
            //区域站
            regPointList.push(list[i]);
          }
        }

        //国家站和区域站
        if (
          $('.observegistype .nationPoint').hasClass('active') &&
          $('.observegistype .regPoint').hasClass('active')
        ) {
          list = [].concat(list);
        }
        //国家站
        else if (
          $('.observegistype .nationPoint').hasClass('active') &&
          !$('.observegistype .regPoint').hasClass('active')
        ) {
          list = [].concat(nationPointList);
        }
        //区域站
        else if (
          !$('.observegistype .nationPoint').hasClass('active') &&
          $('.observegistype .regPoint').hasClass('active')
        ) {
          list = [].concat(regPointList);
        }
        //无站点选择
        else if (
          !$('.observegistype .nationPoint').hasClass('active') &&
          !$('.observegistype .regPoint').hasClass('active')
        ) {
          list = [];
        }

        //let list = result.list;
        var length = list.length;
        var eleAttr = result.eleValue;
        var unit = result.unit;
        var arrEle = eleAttr.split(',');
        if (length > 0) {
          var data = [];
          var _echartsData2 = [];
          var geoCoordMap = {};
          for (var _i5 = 0; _i5 < length; _i5++) {
            var obj1 = {};
            obj1.name = list[_i5][arrEle[0]];
            obj1.value = list[_i5][arrEle[6]];
            obj1.stationId = list[_i5][arrEle[1]];
            obj1.stationName = list[_i5][arrEle[0]];
            obj1.lat = list[_i5][arrEle[2]];
            obj1.lon = list[_i5][arrEle[3]];
            obj1.stationLev = list[_i5][arrEle[5]];
            obj1.funitemmenuid = funitemmenuid;
            obj1.unit = unit;
            data.push(obj1);
            var obj2 = [];
            obj2.push(list[_i5][arrEle[3]]);
            obj2.push(list[_i5][arrEle[2]]);
            geoCoordMap[obj1.name] = obj2;
            _echartsData2.push([
              list[_i5][arrEle[3]],
              list[_i5][arrEle[2]],
              obj1.value,
              obj1,
            ]);
          }
        }
        if (_maphelper.maphelper.map.getZoom() >= 12) {
          var _isShow3 = true;
        } else {
          var _isShow4 = false;
        }

        var pieces = [];
        var colors = [];
        splitList.forEach(function (item) {
          var temp = {};
          if (item.start !== undefined) {
            temp.gt = item.start;
          }
          if (item.end !== undefined) {
            temp.lte = item.end;
          }
          pieces.push(temp);
          colors.unshift(item.color);
        });

        var visualMap = {
          type: 'piecewise',
          show: false,
          dimension: '2',
          top: 10,
          pieces: pieces,
          color: colors,
          orient: 'horizontal',
        };

        var option = {
          animation: false,
          coordinateSystem: 'leaflet',
          backgroundColor: 'transparent',
          visualMap: visualMap,

          toolbox: {
            iconStyle: {
              normal: {
                borderColor: '#fff',
                fontSize: '14px',
              },
              emphasis: {
                borderColor: '#b1e4ff',
              },
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: function formatter(params) {
              var station = params.data[3];
              return station.name + ':' + station.value + station.unit;
            },
          },
          series: [
            {
              name: 'sk',
              type: 'scatter',
              symbolSize: 5, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
              symbol: 'circle',
              coordinateSystem: 'leaflet',
              label: {
                show: isShow,
                formatter: function formatter(params) {
                  var station = params.data[3];
                  return station.value + station.unit;
                },

                position: 'right',

                textStyle: {
                  color: '#000',
                  fontSize: 12,
                  fontWeight: 'bold',
                },
                emphasis: {
                  symbolSize: 8,
                },
              },
              itemStyle: {
                normal: {
                  borderColor: '#555',
                  borderWidth: 1, // 标注边线线宽，单位px，默认为1
                },
                emphasis: {
                  borderColor: '#333',
                  borderWidth: 5,
                },
              },
              data: echartsData,
            },
          ],
        };
        staPoint.option = option;
        var option1 = staPoint.getFinalOptions();
        staPoint.overlay.setOption(option1, true);
        staPoint.myChart.off('click', staPoint.pointClick);
        staPoint.myChart.off('click', staPoint.windClick);
        globalChart = staPoint.myChart;
        staPoint.myChart.on('click', staPoint.pointClick);
        _maphelper.maphelper.map.off('zoomend', staPoint.zoomEnd);
        _maphelper.maphelper.map.on('zoomend', staPoint.zoomEnd);
      };

      staPoint.getStationDetail = function (
        funitemmenuid,
        stationId,
        stationName,
        lon,
        lat,
        stationLev,
      ) {
        staPoint.currPoint = {
          funid: funitemmenuid,
          staId: stationId,
          staName: stationName,
          lon: lon,
          lat: lat,
          lev: stationLev,
        };
        if ($('.stationBox').css('display') == 'none') {
          $('.stationBox').show();
          /*$(".zhezhao").show();*/
        } else {
          //如果之前有点击的站点，则进行下列步骤。如果该站点是通过列表点击的，则还需要移除locationMark
          $('.loadding1').show();
          $('.loadding2').show();
          $('#me_lineGraph').empty();
          $('#me_timeCompare').empty();
          staPoint.currPoint = null;
          if (
            staPoint.removeLocationMark != null &&
            staPoint.removeLocationMark != undefined
          ) {
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

        $('.typhoonBox').hide();
        $('.detailClose').unbind();
        $('.detailClose').click(function () {
          if (
            staPoint.removeLocationMark != null &&
            staPoint.removeLocationMark != undefined
          ) {
            staPoint.removeLocationMark.remove();
          }
          $('.stationBox').hide();
          $('.loadding1').show();
          $('.loadding2').show();
          $('#me_lineGraph').empty();
          $('#me_timeCompare').empty();
          staPoint.currPoint = null;
          $('.typhoonBox').show();
          $('.zhezhao').hide();
        });
        $('.detail ul').empty();
        var stationHtml = '';
        if (stationName != undefined && stationName != '') {
          stationHtml += stationName;
        } else {
          stationHtml += '--';
        }
        if (stationId != undefined && stationId != '') {
          stationHtml += '(站号:' + stationId + ')';
        } else {
          stationHtml += '（站号:--）';
        }
        $('.stationBox .bigName').html(stationHtml);
        var stationLevel = '';
        if (stationLev == '11' || stationLev == '12' || stationLev == '13') {
          stationLevel = 'NWST';
        } else {
          stationLevel = 'RWST';
        }
        staPoint.getStaDetailInfo(
          funitemmenuid,
          stationId,
          staPoint.datetime,
          stationLevel,
        );
        staPoint.clickDetail(
          funitemmenuid,
          stationId,
          stationName,
          lon,
          lat,
          stationLevel,
        );
        /*if(funitemmenuid ==="115990101" || funitemmenuid ==="1150101020" || funitemmenuid ==="1150101021" || funitemmenuid ==="1150101022" || funitemmenuid ==="1150101023" || funitemmenuid ==="1150101024"||funitemmenuid ==="115990102"||funitemmenuid ==="115990103"||funitemmenuid ==="115990104"||funitemmenuid ==="115990108" || funitemmenuid==115990109 || funitemmenuid==115990110 || funitemmenuid==115990111){
 	//气温和降水有历史同期    气压 相对湿度 风
 	staPoint.getSamePeriodtem(funitemmenuid,stationId,stationLevel);
 }else{
 	$(".loadding2").hide();
 	$("#me_timeCompare").hide();
 }*/
      };

      staPoint.getStationDetail = function (
        funitemmenuid,
        stationId,
        stationName,
        lon,
        lat,
        stationLev,
      ) {
        staPoint.currPoint = {
          funid: funitemmenuid,
          staId: stationId,
          staName: stationName,
          lon: lon,
          lat: lat,
          lev: stationLev,
        };
        if ($('.stationBox').css('display') == 'none') {
          $('.stationBox').show();
          /*$(".zhezhao").show();*/
        } else {
          //如果之前有点击的站点，则进行下列步骤。如果该站点是通过列表点击的，则还需要移除locationMark
          $('.loadding1').show();
          $('.loadding2').show();
          $('#me_lineGraph').empty();
          $('#me_timeCompare').empty();
          staPoint.currPoint = null;
          if (
            staPoint.removeLocationMark != null &&
            staPoint.removeLocationMark != undefined
          ) {
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

        $('.typhoonBox').hide();
        $('.detailClose').unbind();
        $('.detailClose').click(function () {
          if (
            staPoint.removeLocationMark != null &&
            staPoint.removeLocationMark != undefined
          ) {
            staPoint.removeLocationMark.remove();
          }
          $('.stationBox').hide();
          $('.loadding1').show();
          $('.loadding2').show();
          $('#me_lineGraph').empty();
          $('#me_timeCompare').empty();
          staPoint.currPoint = null;
          $('.typhoonBox').show();
          $('.zhezhao').hide();
        });
        $('.detail ul').empty();
        var stationHtml = '';
        if (stationName != undefined && stationName != '') {
          stationHtml += stationName;
        } else {
          stationHtml += '--';
        }
        if (stationId != undefined && stationId != '') {
          stationHtml += '(站号:' + stationId + ')';
        } else {
          stationHtml += '（站号:--）';
        }
        $('.stationBox .bigName').html(stationHtml);
        var stationLevel = '';
        if (stationLev == '11' || stationLev == '12' || stationLev == '13') {
          stationLevel = 'NWST';
        } else {
          stationLevel = 'RWST';
        }
        staPoint.getStaDetailInfo(
          funitemmenuid,
          stationId,
          staPoint.datetime,
          stationLevel,
        );
        staPoint.clickDetail(
          funitemmenuid,
          stationId,
          stationName,
          lon,
          lat,
          stationLevel,
        );
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
      staPoint.getStaDetailInfo = function (
        funitemmenuid,
        staId,
        times,
        stationLevel,
      ) {
        $.ajax({
          url: ctx + '/gis/getStaDetailInfo',
          type: 'get',
          dataType: 'json',
          async: false,
          data: {
            funitemmenuid: funitemmenuid,
            staId: staId,
            dateTime: times,
            typeCode: stationLevel,
          },
          success: function success(result) {
            if (result.returnCode === '0') {
              var list = result.list;
              var station = list[0];
              var province = station.Province;
              var city = station.City;
              var Cnty = station.Cnty;
              var lat = station.Lat;
              var lon = station.Lon;
              var temp = station.TEM;
              var prs = station.PRS;
              var rhu = station.RHU;
              var pre = station.PRE_1h;
              var vis = station.VIS;
              var wind = station.WIN_S_Inst_Max;
              var areaid = station.Admin_Code_CHN;
              if (globalParam.staid == '115990101') {
                //气温
                emgcy.getWarningCountyData(areaid, '11B09', Cnty);
              } else if (globalParam.staid == '115990103') {
                //能见度
                emgcy.getWarningCountyData(areaid, '11B17', Cnty);
              } else if (
                globalParam.staid == '1150101020' ||
                globalParam.staid == '1150101021' ||
                globalParam.staid == '1150101022' ||
                globalParam.staid == '1150101023' ||
                globalParam.staid == '1150101024'
              ) {
                //降水
                emgcy.getWarningCountyData(areaid, '11B03,11B20,', Cnty);
              } else if (
                globalParam.staid == '115990104' ||
                globalParam.staid == '115990108' ||
                globalParam.staid == '115990109' ||
                globalParam.staid == '115990110' ||
                globalParam.staid == '115990111'
              ) {
                //风
                emgcy.getWarningCountyData(areaid, '11B06', Cnty);
              }
              if (province != undefined && province != '') {
                $('#province').html(province);
              } else {
                $('#province').html('--');
              }
              if (city != undefined && city != '') {
                $('#city').html(city);
              } else {
                $('#city').html('--');
              }
              if (Cnty != undefined && Cnty != '') {
                $('#county').html(Cnty);
              } else {
                $('#county').html('--');
              }
              if (lat != undefined && lat != '') {
                $('#lat').html(lat);
              } else {
                $('#lat').html('');
              }
              if (lon != undefined && lon != '') {
                $('#lng').html(lon);
              } else {
                $('#lng').html('--');
              }
              if (temp != undefined && temp != '' && temp != '999999') {
                $('.detail ul').append('<li>平均气温:' + temp + '℃</li>');
              } else {
                $('.detail ul').append('<li>平均气温:--</li>');
              }
              if (prs != undefined && prs != '' && prs != '999999') {
                $('.detail ul').append('<li>本站气压:' + prs + 'Hpa</li>');
              } else {
                $('.detail ul').append('<li>本站气压:--</li>');
              }
              if (rhu != undefined && rhu != '' && rhu != '999999') {
                $('.detail ul').append('<li>相对湿度:' + rhu + '%</li>');
              } else {
                $('.detail ul').append('<li>相对湿度:--</li>');
              }
              if (pre != undefined && pre != '' && pre != '999999') {
                var selId = $('.lsel').attr('id');
                if (selId != undefined && selId == '1150101020') {
                  var Sid = $('#selectAll option:selected').attr('id');
                  if (Sid == '1150101021') {
                    $('.detail ul').append(
                      '<li>3小时累计降水:' + pre + 'mm</li>',
                    );
                  } else if (Sid == '1150101022') {
                    $('.detail ul').append(
                      '<li>6小时累计降水:' + pre + 'mm</li>',
                    );
                  } else if (Sid == '1150101024') {
                    $('.detail ul').append(
                      '<li>12小时累计降水:' + pre + 'mm</li>',
                    );
                  } else if (Sid == '1150101023') {
                    $('.detail ul').append(
                      '<li>24小时累计降水:' + pre + 'mm</li>',
                    );
                  } else {
                    $('.detail ul').append(
                      '<li>1小时累计降水:' + pre + 'mm</li>',
                    );
                  }
                } else {
                  $('.detail ul').append(
                    '<li>1小时累计降水:' + pre + 'mm</li>',
                  );
                }
              } else {
                $('.detail ul').append('<li>1小时累计降水:--</li>');
              }
              if (vis != undefined && vis != '' && vis != '999999') {
                $('.detail ul').append(
                  '<li>小时能见度:' + vis / 1000 + 'km</li>',
                );
              } else {
                $('.detail ul').append('<li>小时能见度:--</li>');
              }
              if (wind != undefined && wind != '' && wind != '999999') {
                var _selId = $('.lsel').attr('id');
                if (_selId != undefined && _selId == '115990104') {
                  var _Sid = $('#windselectAll option:selected').attr('id');
                  if (_Sid == '115990108') {
                    $('.detail ul').append(
                      '<li>2分钟平均风速:' + wind + 'm/s</li>',
                    );
                  } else if (_Sid == '115990109') {
                    $('.detail ul').append(
                      '<li>10分钟平均风速:' + wind + 'm/s</li>',
                    );
                  } else if (_Sid == '115990110') {
                    $('.detail ul').append(
                      '<li>瞬时风风速:' + wind + 'm/s</li>',
                    );
                  } else if (_Sid == '115990111') {
                    $('.detail ul').append(
                      '<li>极大风风速:' + wind + 'm/s</li>',
                    );
                  } else {
                    $('.detail ul').append(
                      '<li>小时最大风速:' + wind + 'm/s</li>',
                    );
                  }
                } else {
                  $('.detail ul').append(
                    '<li>小时最大风速:' + wind + 'm/s</li>',
                  );
                }
              } else {
                $('.detail ul').append('<li>小时极大风速:--</li>');
              }
            }
          },
        });
      };

      /**
       * 得到实况数据(自动站)
       */
      staPoint.getskStationInfo = function (
        funitemmenuid,
        staId,
        stationLevel,
      ) {
        $.ajax({
          url: ctx + '/exhibitionData/getSKStationInfo',
          type: 'post',
          dataType: 'json',
          async: false,
          data: {
            staId: staId,
            funitemmenuid: funitemmenuid,
            typeCode: stationLevel,
          },
          success: function success(result) {
            resultsk = result.list;
            hover = result.hover;
            isshow = result.value;
          },
        });
      };

      /**
       * 得到预报数据(自动站)
       */
      staPoint.getybStationInfo = function (
        funitemmenuid,
        staId,
        stationLevel,
      ) {
        $.ajax({
          url: ctx + '/exhibitionData/getStationInfo',
          type: 'post',
          dataType: 'json',
          async: false,
          data: {
            staId: staId,
            funitemmenuid: funitemmenuid,
            typeCode: stationLevel,
          },
          success: function success(result) {
            resultyb = result.list;
            if (hover == undefined || hover == '') {
              hover = result.hover;
            }
            ybshow = result.value;
          },
        });
      };

      /**
       * 得到站点的历史同期数据
       * @param funitemmenuid
       * @param station
       * @param stationLevel
       */
      staPoint.getSamePeriodtem = function (
        funitemmenuid,
        station,
        stationLevel,
      ) {
        $('.loadding').show();
        url = ctx + '/exhibitionData/getSamePeriodData';
        $.ajax({
          url: url,
          type: 'post',
          dataType: 'json',
          async: true,
          data: {
            staIds: station,
            time: staPoint.timeStr,
            type: funitemmenuid,
            typeCode: stationLevel,
          },
          success: function success(result) {
            resultsp = result.list;
            tenRange = result.dateTime;
            if (resultsp == null || resultsp.length == 0) {
              $('.loadding2').hide();
              $('#me_timeCompare').hide();
            } else {
              $('.loadding2').hide();
              $('#me_timeCompare').show();
              //staPoint.drawSamePeriodtem(0,tenRange);
              staPoint.drawSamePeriodtem2(0, tenRange);
            }
          },
        });
      };

      staPoint.drawSamePeriodtem = function (index, title) {
        Highcharts.setOptions({
          global: {
            useUTC: false,
          },
        });
        syntheical.chart = $('#me_timeCompare').highcharts(
          'StockChart',
          {
            chart: {
              type: 'column',
              height: 160,
              backgroundColor: '#f1f1f1',
            },
            title: {
              text: '历史同期' + title,
              style: {
                color: '#333333',
                fontSize: '12px',
              },
            },
            rangeSelector: {
              enabled: false,
              selected: 1,
              inputEnabled: false,
              buttons: [
                {
                  type: 'all',
                  text: '全部',
                },
                {
                  type: 'year',
                  count: 10,
                  text: '近10年',
                },
                {
                  type: 'year',
                  count: 20,
                  text: '近20年',
                },
                {
                  type: 'year',
                  count: 50,
                  text: '近50年',
                },
              ],
            },
            series: [
              {
                name: '预报',
                data: resultsp[index],
                color: '#7cb5ed',
                dashStyle: 'dash',
                tooltip: {
                  valueDecimals: 2,
                },
              },
            ],
            navigator: {
              enabled: false,
              xAxis: {
                dateTimeLabelFormats: {
                  minute: '%Y年%m月%d日<br/>%H:%M',
                  hour: '%Y年%m月%d日<br/>%H:%M',
                  day: '%Y年%m月%d日',
                  week: '%Y年%m月%d日',
                  month: '%Y年%m月',
                  year: '%Y年',
                },
              },
              series: {
                dashStyle: 'solid',
              },
              height: 20,
            },
            scrollbar: {
              enabled: false,
            },
            plotOptions: {
              column: {
                dataGrouping: {
                  units: [
                    ['day', [1]],
                    ['week', [1]],
                    ['month', [1, 3, 6]],
                    ['year', null],
                  ],
                },
              },
            },
            credits: {
              enabled: false,
            },
            exporting: {
              enabled: false,
            },
            xAxis: {
              type: 'datetime',
              dateTimeLabelFormats: {
                minute: '%m月%d日<br/>%H:%M',
                hour: '%m月%d日<br/>%H:%M',
                day: '%m月%d日',
                week: '%m月%d日',
                month: '%m月%d日',
                year: '%Y年',
              },
              minTickInterval: 4 * 3600 * 1000,
              ordinal: false,
            },
            yAxis: {
              title: {
                margin: 20,
                text: '(' + resultall['units' + index] + ')',
                align: 'middle',
                x: 18,
                rotation: 0,
              },
              labels: {
                x: 20,
              },
              plotLines: [
                {
                  value: 0,
                  width: 1,
                  color: '#808080',
                },
              ],
            },
            tooltip: {
              formatter: function formatter() {
                var s = void 0;
                s = '<b>' + Highcharts.dateFormat('%Y年：', this.x) + '</b>';
                s +=
                  '<br/>' +
                  resultall['name' + index] +
                  ': ' +
                  this.y.toFixed(1) +
                  ' ' +
                  resultall['units' + index];
                return s;
              },
            },
            legend: {
              enabled: true,
              align: 'center',
              symbolWidth: 40,
              layout: 'horizontal',
              floating: true,
              x: 280,
              y: -380,
            },
          },
          function (c) {
            chart = c;
          },
        );
      };
      staPoint.drawSamePeriodtem2 = function (index, title) {
        Highcharts.setOptions({
          global: {
            useUTC: false,
          },
        });
        syntheical.chart = $('#me_timeCompare').highcharts(
          'StockChart',
          {
            chart: {
              type: 'column',
              height: 160,
              backgroundColor: '#f1f1f1',
            },
            title: {
              text: '历史同期' + title,
              style: {
                color: '#333333',
                fontSize: '12px',
              },
            },
            rangeSelector: {
              enabled: false,
              selected: 1,
              inputEnabled: false,
              buttons: [
                {
                  type: 'all',
                  text: '全部',
                },
                {
                  type: 'year',
                  count: 10,
                  text: '近10年',
                },
                {
                  type: 'year',
                  count: 20,
                  text: '近20年',
                },
                {
                  type: 'year',
                  count: 50,
                  text: '近50年',
                },
              ],
            },
            series: [
              {
                name: '预报',
                data: resultsp,
                color: '#7cb5ed',
                dashStyle: 'dash',
                tooltip: {
                  valueDecimals: 2,
                },
              },
            ],
            navigator: {
              enabled: false,
              xAxis: {
                dateTimeLabelFormats: {
                  minute: '%Y年%m月%d日<br/>%H:%M',
                  hour: '%Y年%m月%d日<br/>%H:%M',
                  day: '%Y年%m月%d日',
                  week: '%Y年%m月%d日',
                  month: '%Y年%m月',
                  year: '%Y年',
                },
              },
              series: {
                dashStyle: 'solid',
              },
              height: 20,
            },
            scrollbar: {
              enabled: false,
            },
            plotOptions: {
              column: {
                dataGrouping: {
                  units: [
                    ['day', [1]],
                    ['week', [1]],
                    ['month', [1, 3, 6]],
                    ['year', null],
                  ],
                },
              },
            },
            credits: {
              enabled: false,
            },
            exporting: {
              enabled: false,
            },
            xAxis: {
              type: 'datetime',
              dateTimeLabelFormats: {
                minute: '%m月%d日<br/>%H:%M',
                hour: '%m月%d日<br/>%H:%M',
                day: '%m月%d日',
                week: '%m月%d日',
                month: '%m月%d日',
                year: '%Y年',
              },
              minTickInterval: 4 * 3600 * 1000,
              ordinal: false,
            },
            yAxis: {
              title: {
                margin: 20,
                text: '(' + resultall['units' + index] + ')',
                align: 'middle',
                x: 18,
                rotation: 0,
              },
              labels: {
                x: 20,
              },
              plotLines: [
                {
                  value: 0,
                  width: 1,
                  color: '#808080',
                },
              ],
            },
            tooltip: {
              formatter: function formatter() {
                var s = void 0;
                s = '<b>' + Highcharts.dateFormat('%Y年：', this.x) + '</b>';
                s +=
                  '<br/>' +
                  resultall['name' + index] +
                  ': ' +
                  this.y.toFixed(1) +
                  ' ' +
                  resultall['units' + index];
                return s;
              },
            },
            legend: {
              enabled: true,
              align: 'center',
              symbolWidth: 40,
              layout: 'horizontal',
              floating: true,
              x: 280,
              y: -380,
            },
          },
          function (c) {
            chart = c;
          },
        );
      };

      staPoint.clickDetail = function (
        funitemmenuid,
        station,
        subtitle,
        lon,
        lat,
        stationLevel,
      ) {
        //得到气温、降水..所有的有关信息
        isshow = undefined;
        ybshow = undefined;
        hover = undefined;
        staPoint.getskStationInfo(funitemmenuid, station, stationLevel);
        if (
          funitemmenuid === '115990101' ||
          funitemmenuid === '1150101020' ||
          funitemmenuid === '1150101021' ||
          funitemmenuid === '1150101022' ||
          funitemmenuid === '1150101023' ||
          funitemmenuid === '1150101024' ||
          funitemmenuid === '115990104' ||
          funitemmenuid === '115990108' ||
          funitemmenuid === '115990109' ||
          funitemmenuid === '115990110' ||
          funitemmenuid === '115990111'
        ) {
          staPoint.getybStationInfo(funitemmenuid, station, stationLevel);
        }
        $('#me_lineGraph').show();
        var hovers = hover.split(',');
        var array1 = new Array();
        var array2 = new Array();
        var array3 = new Array();
        var array4 = new Array();
        for (var i = 0; i < hovers.length; i++) {
          array1.push('name' + i);
          array2.push('type' + i);
          array3.push('data' + i);
          array4.push('units' + i);
        }
        namearray = new Array();
        for (var _i6 = 0; _i6 < hovers.length; _i6++) {
          namearray.push(hovers[_i6].split('##')[2]);
          resultall[array1[_i6]] = hovers[_i6].split('##')[2];
          resultall[array2[_i6]] = 'spline';
          if (resultsk != undefined && resultyb != undefined) {
            resultall[array3[_i6]] = common.mergeArray(
              resultsk[_i6],
              resultyb[_i6],
            );
          } else if (resultsk != undefined && resultyb == undefined) {
            resultall[array3[_i6]] = resultsk[_i6];
          } else if (resultsk == undefined && resultyb != undefined) {
            resultall[array3[_i6]] = resultyb[_i6];
          }
          resultall[array4[_i6]] = hovers[_i6].split('##')[3];
        }
        //拼接站点信息(站名、经度、纬度)
        $('.me_stationName').attr('title', subtitle);
        if (subtitle.length > 7) {
          subtitle = subtitle.substring(0, 7) + '...';
        }
        $('.me_stationName').html(
          subtitle + '(' + '经度:' + lon + '&nbsp;纬度:' + lat + ')',
        );
        var idname = $('.me_bgBlack').find('.me_level3Text').text();
        $('.loadding1').hide();
        staPoint.drawskChart(idname + '曲线图--' + namearray[0], subtitle, 0);
      };

      staPoint.drawskChart = function (title, subtitle, index) {
        isshow = '1';
        ybshow == '1';
        if (isshow == '1') {
          //有实况数据
          var _skCategories = new Array();
          var _skData = new Array();
          for (var i = 0; i < resultsk[index].length; i++) {
            var tempSKCtgr = resultsk[index][i][0];
            if (tempSKCtgr == undefined) {
              tempSKCtgr = '';
            }
            _skCategories.push(tempSKCtgr);
            var tempSKData = resultsk[index][i][1];
            if (tempSKData == undefined) {
              tempSKData = '';
            }
            _skData.push(tempSKData);
          }
          var _categories_ = _skCategories;
          var _totalData_ = _skData;
        }
        if (ybshow == '1') {
          //有预报 数据
          var _ybCategories = new Array();
          var _ybData = new Array();
          for (var _i7 = 0; _i7 < resultyb[index].length; _i7++) {
            var tempYBCtgr = resultyb[index][_i7][0];
            if (tempYBCtgr == undefined) {
              tempYBCtgr = '';
            }
            _ybCategories.push(tempYBCtgr);
            var tempYBData = resultyb[index][_i7][1];
            if (tempYBData == undefined) {
              tempYBData = '';
            }
            _ybData.push(tempYBData);
          }
          var _categories_2 = _ybCategories;
          var _totalData_2 = _ybData;
        }
        var categories_ = common.mergeArray(skCategories, ybCategories);
        if (emgcy.arrWarning != undefined && emgcy.arrWarning.length > 0) {
          var _loop = function _loop(_i8) {
            $.each(emgcy.arrWarning, function (j, n) {
              if (n.time == skCategories[_i8]) {
                var _url =
                  ctxStatic +
                  '/ultra/img/gis/disasterWarning/' +
                  n.signaltypecode +
                  '_' +
                  n.signallevelcode +
                  '.png';
                var data = skData[_i8];
                skData[_i8] = {
                  y: data,
                  marker: {
                    symbol: 'url(' + _url + ')',
                    width: 16,
                    height: 16,
                  },
                };
              }
            });
          };

          for (var _i8 = 0; _i8 < skCategories.length; _i8++) {
            _loop(_i8);
          }
        }
        var totalData_ = common.mergeArray(skData, ybData);
        var chart_ = Highcharts.chart('me_lineGraph', {
          chart: {
            inverted: false,
            marginLeft: 50,
            height: 160,
            backgroundColor: '#f1f1f1',
            //borderColor: "#5883b5",
            //borderWidth:1
          },
          title: {
            text: title + '【' + subtitle + '】',
            style: {
              color: '#333333',
              fontSize: '12px',
            },
          },
          xAxis: {
            categories: categories_,
            tickInterval: 5,
            // tickAmount:5,
            title: {
              text: '',
              x: 10,
              //y: -30
            },
            labels: {
              step: 2,
              formatter: function formatter() {
                var value = this.value;
                if (value.length > 10) {
                  value =
                    value.substring(6, 8) +
                    '日' +
                    value.substring(8, 10) +
                    '时';
                }
                return value;
              },
            },
          },
          yAxis: {
            tickWidth: 10,
            title: {
              align: 'middle',
              text:
                resultall['name' + index] +
                '(' +
                resultall['units' + index] +
                ')',
              //rotation: 0,
              x: 6,
              y: 0,
            },
            plotLines: [
              {
                value: 0,
                width: 0,
                color: '#808080',
              },
            ],
          },
          tooltip: {
            formatter: function formatter() {
              if (globalParam.staid == '115010201') {
                //高空
                return (
                  this.x +
                  'hpa<br/>' +
                  resultall['name' + index] +
                  ':<b>' +
                  this.y +
                  '</b>' +
                  resultall['units' + index]
                );
              } else {
                //自动站、辐射、精细化预报
                var strTime = this.x;
                var year = strTime.substring(0, 4);
                var month = strTime.substring(4, 6);
                var day = strTime.substring(6, 8);
                var hour = strTime.substring(8, 10);
                var html =
                  year +
                  '年' +
                  month +
                  '月' +
                  day +
                  '日' +
                  hour +
                  '时：' +
                  this.y +
                  resultall['units' + index];
                for (var _i9 = 0; _i9 < emgcy.arrWarning.length; _i9++) {
                  if (strTime == emgcy.arrWarning[_i9].time) {
                    html += '  ';
                    if (
                      emgcy.arrWarning[_i9].codename != undefined &&
                      emgcy.arrWarning[_i9].codename != null &&
                      emgcy.arrWarning[_i9].codename != ''
                    ) {
                      html += emgcy.arrWarning[_i9].codename;
                    }
                    if (
                      emgcy.arrWarning[_i9].signallevel != undefined &&
                      emgcy.arrWarning[_i9].signallevel != null &&
                      emgcy.arrWarning[_i9].signallevel != ''
                    ) {
                      html += emgcy.arrWarning[_i9].signallevel;
                    }
                    html += '预警';
                  }
                }
                return html;
              }
            },
          },
          plotOptions: {
            line: {
              marker: {
                radius: 0,
                lineWidth: 1,
              },
            },
            series: {
              events: {
                legendItemClick: function legendItemClick(event) {
                  return false;
                },
              },
            },
          },
          credits: {
            enabled: false,
          },
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemWidth: 50,
            y: 195,
            reversed: true,
            enabled: false,
          },
          exporting: {
            enabled: false,
          },
        });
        var series_1 = {
          name: '预报',
          data: totalData_,
          color: '#7cb5ed',
          dashStyle: 'dash',
          tooltip: {
            valueDecimals: 2,
          },
        };
        var series_2 = {
          name: '实况',
          data: skData,
          color: '#91ed76',
          tooltip: {
            valueDecimals: 2,
          },
        };
        var plotLines_ = {
          color: 'gray',
          dashStyle: 'longdashdot',
          value: 23,
          width: 1,
        };
        if (ybshow == '1') {
          chart_.addSeries(series_1);
          chart_.xAxis[0].addPlotLine(plotLines_);
        }
        chart_.addSeries(series_2);
      };

      staPoint.getShouldMinusVal = function (zoom) {
        var minusVal = 0;
        switch (zoom) {
          case 0:
            minusVal = 0.6;
            break;
          case 1:
            minusVal = 0.3;
            break;
          case 2:
            minusVal = 0.13;
            break;
          case 3:
            minusVal = 0.07;
            break;
          case 4:
            minusVal = 0.042;
            break;
          case 5:
            minusVal = 0.016;
            break;
          case 6:
            minusVal = 0.008;
            break;
          case 7:
            minusVal = 0.004;
            break;
          case 8:
            minusVal = 0.0005;
            break;
          default:
            minusVal = 0;
            break;
        }
        return minusVal;
      };

      staPoint.search = function () {
        var staNo = $('.staNo').val();
        var reg = /^[A-Za-z0-9]+$/g;
        var arrEleValue = staPoint.eleAttr.split(',');
        var data = null;
        if (reg.test(staNo)) {
          //站号
          for (var i = 0; i < staPoint.rangeallList.length; i++) {
            if (staPoint.rangeallList[i][arrEleValue[1]] == staNo) {
              data = staPoint.rangeallList[i];
            }
          }
        } else {
          //站名
          //globalParam.rangeallList
          for (var _i10 = 0; _i10 < staPoint.rangeallList.length; _i10++) {
            if (staPoint.rangeallList[_i10][arrEleValue[0]] == staNo) {
              data = staPoint.rangeallList[_i10];
            }
          }
        }
        if (data) {
          //staPoint.getStationDetail(funid,stationId,stationName,lon, lat,stationLev);
          common.zoom = _maphelper.maphelper.map.getZoom();
          if (common.zoom <= 7) {
            _maphelper.maphelper.moveTo(data.j, data.w, 7);
          } else {
            _maphelper.maphelper.moveTo(data.j, data.w, common.zoom);
          }
          staPoint.getStationDetail(
            globalParam.staid,
            data.h,
            data.m,
            data.j,
            data.w,
            data.l,
          );
          staPoint.addLocationMark(data.w, data.j);
        } else {
          alert('没有该站点');
        }
      };

      staPoint.drawWindPoint = function (result, funitemmenuid, splitList) {
        var list = result.list;
        var length = list.length;
        var eleAttr = result.eleValue;
        var unit = result.unit;
        var arrEle = eleAttr.split(',');
        if (length > 0) {
          var data = [];
          var datas = new Array();
          for (var k = 0; k < 8; k++) {
            for (var j = 0; j < 16; j++) {
              var ds = 'w' + '-' + k + '-' + j;
              datas[ds] = [];
            }
          }
          var geoCoordMap = {};
          var _echartsData3 = [];
          var key = void 0;
          for (var i = 0; i < length; i++) {
            var obj1 = {};
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
            var obj2 = [];
            obj2.push(list[i][arrEle[3]]);
            obj2.push(list[i][arrEle[2]]);
            geoCoordMap[obj1.name] = obj2;

            var d = key.split('-')[2];
            var s = key.split('-')[1] / 1 + 1;
            // echartsData.push([obj1.lon,obj1.lat,obj1]);
            if (_maphelper.maphelper.map.getZoom() >= 12) {
              var _isShow5 = true;
            } else {
              var _isShow6 = false;
            }
            _echartsData3.push({
              name: '',
              value: [+obj1.lon, +obj1.lat, +obj1.value],
              symbolSize: [16, 24],
              symbol: 'image://' + ctxStatic + '/ultras/img/fxg/w' + s + '.png',
              symbolRotate: staPoint.getWindSimpleDegree(d),
              itemStyle: {
                normal: {
                  borderColor: '#555',
                  borderWidth: 1, // 标注边线线宽，单位px，默认为1
                  label: {
                    position: 'right',
                    formatter: '{c}',
                    textStyle: {
                      color: '#000',
                      fontSize: 14,
                      fontWeight: 'bold',
                    },
                  },
                },
                emphasis: {
                  borderColor: '#333',
                  borderWidth: 5,
                  label: {
                    show: false,
                  },
                },
              },
              originData: obj1,
            });
          }

          var option = {
            animation: false,
            coordinateSystem: 'leaflet',
            backgroundColor: 'transparent',
            toolbox: {
              iconStyle: {
                normal: {
                  borderColor: '#fff',
                  fontSize: '14px',
                },
                emphasis: {
                  borderColor: '#b1e4ff',
                },
              },
            },
            tooltip: {
              trigger: 'item',
            },
            series: [
              {
                tooltip: {
                  trigger: 'item',
                  formatter: function formatter(params) {
                    var station = params.data.originData;
                    return (
                      station.name +
                      ' : ' +
                      station.value +
                      station.unit +
                      '<br/>风向:' +
                      station.direct
                    );
                    // return station.name+":"+station.value+station.unit
                  },
                },
                name: 'sk',
                type: 'scatter',
                symbolSize: 8, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
                coordinateSystem: 'leaflet',
                label: {
                  show: isShow,
                  formatter: function formatter(params) {
                    var station = params.data.originData;
                    return station.value + station.unit;
                  },

                  position: 'right',

                  textStyle: {
                    color: '#000',
                    fontSize: 12,
                    fontWeight: 'bold',
                  },
                  emphasis: {
                    symbolSize: 8,
                  },
                },

                data: _echartsData3,
              },
            ],
          };
          staPoint.option = option;
          var option1 = staPoint.getFinalOptions();
          staPoint.overlay.setOption(option1, true);
          staPoint.myChart.off('click', staPoint.windClick);
          staPoint.myChart.off('click', staPoint.pointClick);
          globalChart = staPoint.myChart;
          staPoint.myChart.on('click', staPoint.windClick);
          _maphelper.maphelper.map.off('zoomend', staPoint.zoomEnd);
          _maphelper.maphelper.map.on('zoomend', staPoint.zoomEnd);
        }
      };
      staPoint.getWindKey = function (value, degree) {
        var s = void 0,
          d = void 0;
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
          d = '1';
        } else if (33.75 < parseInt(degree) && parseInt(degree) < 56.25) {
          d = '2';
        } else if (56.25 < parseInt(degree) && parseInt(degree) < 78.75) {
          d = '3';
        } else if (78.75 <= parseInt(degree) && parseInt(degree) < 101.25) {
          d = '4';
        } else if (101.25 <= parseInt(degree) && parseInt(degree) < 123.75) {
          d = '5';
        } else if (123.75 < parseInt(degree) && parseInt(degree) < 146.25) {
          d = '6';
        } else if (146.25 < parseInt(degree) && parseInt(degree) < 168.75) {
          d = '7';
        } else if (168.75 <= parseInt(degree) && parseInt(degree) < 191.25) {
          d = '8';
        } else if (191.25 <= parseInt(degree) && parseInt(degree) < 213.75) {
          d = '9';
        } else if (213.75 < parseInt(degree) && parseInt(degree) < 236.25) {
          d = '10';
        } else if (236.25 < parseInt(degree) && parseInt(degree) < 258.75) {
          d = '11';
        } else if (258.75 <= parseInt(degree) && parseInt(degree) < 281.25) {
          d = '12';
        } else if (281.25 <= parseInt(degree) && parseInt(degree) < 303.75) {
          d = '13';
        } else if (303.75 < parseInt(degree) && parseInt(degree) < 326.25) {
          d = '14';
        } else if (326.25 < parseInt(degree) && parseInt(degree) < 348.75) {
          d = '15';
        } else {
          d = '0';
        }
        return 'w-' + s + '-' + d;
      };
      staPoint.getWindDirection = function (degree) {
        var d = '';
        if (11.25 <= parseInt(degree) && parseInt(degree) < 33.75) {
          d = '北偏东';
        } else if (33.75 < parseInt(degree) && parseInt(degree) < 56.25) {
          d = '东北';
        } else if (56.25 < parseInt(degree) && parseInt(degree) < 78.75) {
          d = '东偏北';
        } else if (78.75 <= parseInt(degree) && parseInt(degree) < 101.25) {
          d = '东';
        } else if (101.25 <= parseInt(degree) && parseInt(degree) < 123.75) {
          d = '东偏南';
        } else if (123.75 < parseInt(degree) && parseInt(degree) < 146.25) {
          d = '东南';
        } else if (146.25 < parseInt(degree) && parseInt(degree) < 168.75) {
          d = '南偏东';
        } else if (168.75 <= parseInt(degree) && parseInt(degree) < 191.25) {
          d = '南';
        } else if (191.25 <= parseInt(degree) && parseInt(degree) < 213.75) {
          d = '南偏西';
        } else if (213.75 < parseInt(degree) && parseInt(degree) < 236.25) {
          d = '西南';
        } else if (236.25 < parseInt(degree) && parseInt(degree) < 258.75) {
          d = '西偏南';
        } else if (258.75 <= parseInt(degree) && parseInt(degree) < 281.25) {
          d = '西';
        } else if (281.25 <= parseInt(degree) && parseInt(degree) < 303.75) {
          d = '西偏北';
        } else if (303.75 < parseInt(degree) && parseInt(degree) < 326.25) {
          d = '西北';
        } else if (326.25 < parseInt(degree) && parseInt(degree) < 348.75) {
          d = '北偏西';
        } else {
          d = '北';
        }
        return d;
      };
      staPoint.getWindSimpleDegree = function (degree) {
        var d = parseInt(degree);
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
      };
      /**
       * 初始化实况分析播放控件
       */
      staPoint.getTimesList = function (times, type, nums) {
        var list = sktimeline.imgList;
        var list1 = [];
        var len = list.length;
        if (len >= 10) {
          var i = len - 10;
          var j = 0;
          for (i; i < list.length; i++) {
            if (i < len) {
              list1[j] = list[i].D_DATETIME;
              sktimeline.imgs[j] = list[i].url;
              j++;
            }
          }
          sktimeline.dataArray = list1;
          sktimeline.initPalay(sktimeline.changeByTime, list1, 10, 1000);

          var strOfTime = sktimeline.dataArray[sktimeline.dataArray.length - 1];
          var strFormat =
            strOfTime.substring(0, 4) +
            '-' +
            strOfTime.substring(4, 6) +
            '-' +
            strOfTime.substring(6, 8) +
            ' ' +
            strOfTime.substring(8, 10) +
            '时';
          var strFormat2 =
            strOfTime.substring(0, 4) +
            '-' +
            strOfTime.substring(4, 6) +
            '-' +
            strOfTime.substring(6, 8) +
            ' ' +
            strOfTime.substring(8, 10) +
            ':' +
            strOfTime.substring(10, 12) +
            ':' +
            strOfTime.substring(12, 14);
          /*$(".lgd_sk .lgd_time").html(strFormat);*/
          //$(".timeName").html(result.timeStr);
          $('.timeName2').html(strFormat2);
        } else {
        }
      };

      exports.default = staPoint;

      /***/
    },
    /* 2 */
    /***/ function (module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.common = undefined;

      var _maphelper = __webpack_require__(0);

      var _stationPoint = __webpack_require__(1);

      var _stationPoint2 = _interopRequireDefault(_stationPoint);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var common = (exports.common = common || {});
      common.initMap = function () {
        _maphelper.maphelper.init(
          'map',
          {
            x: 104,
            y: 36.5,
          },
          3,
        );
      };

      (common.canvasPositionReset = function () {
        var lonlat = _maphelper.maphelper.map.containerPointToLatLng(
          L.point(0, 0),
        ); // 左上角
        var topLeft = _maphelper.maphelper.map.latLngToLayerPoint([
          lonlat.lat,
          lonlat.lng,
        ]);
        L.DomUtil.setPosition(canvas.lcanvas, topLeft);
      }),
        (common.getLegend = function (funItemMenuId, position, typeCode) {
          $('.figurebar').empty();
          $.ajax({
            url: ctx + '/multipleExhibition1/getLegend',
            type: 'post',
            dataType: 'json',
            async: true,
            data: {
              funItemMenuId: funItemMenuId,
              position: position,
              typeCode: typeCode,
            },
            success: function success(result) {
              //将全局变量lengend赋值
              var list = result.list;
              common.unit = result.unit;
              common.legend = list;
              var strHtml =
                "<div class='me_lengedName'>" +
                result.name +
                '(' +
                common.unit +
                ')' +
                '</div>';
              if (list.length < 18) {
                var width = 30 + 'px';
                var lineHeight = 21 + 'px';
              } else {
                var width = 12 + 'px';
                var lineHeight = 11 + 'px';
              }
              strHtml += "<div style='float:left;'>";
              strHtml += "<div style='overflow:hidden;'>";
              for (var i = 0; i < list.length; i++) {
                strHtml +=
                  "<div style='width:" +
                  width +
                  ';height:15px;background-color:' +
                  list[i].color +
                  ";float:left;'></div>";
              }
              strHtml += '</div>';
              strHtml += "<div style='overflow:hidden;'>";
              if (list.length < 18) {
                for (var i = 0; i < list.length; i++) {
                  var name = list[i].name;
                  strHtml +=
                    "<div style='width:" +
                    width +
                    ";float:left;font-size:12px;text-align:right;'>" +
                    name +
                    '</div>';
                }
              } else {
                for (var i = 0; i < list.length; i = i + 2) {
                  var name = list[i].name;
                  strHtml +=
                    "<div style='width:" +
                    2 * parseInt(width) +
                    "px;float:left;font-size:12px;text-align:right;'>" +
                    name +
                    '</div>';
                }
              }
              strHtml += '</div></div>';
              $('.figurebar').append(strHtml);
              $('.figurebar').css(
                'left',
                ($('body').width() - $('.figurebar').width()) / 2 + 'px',
              );
            },
          });
        });

      /**
       * 得到图标的url
       * @param legend
       * @param value
       * @returns {String}
       */
      common.getIconByValue = function (legend, value) {
        value = Number(value);
        var iconUrl = '';
        for (var i = 0; i < legend.length; i++) {
          var rule = legend[i].rule;
          var arrRule = rule.split(',');
          var start = arrRule[0];
          var end = arrRule[1];
          if (start == '') {
            if (value < Number(end)) {
              iconUrl = legend[i].iconUrl;
              break;
            }
          }
          if (end == '') {
            if (value >= Number(start)) {
              iconUrl = legend[i].iconUrl;
              break;
            }
          }

          if (start != '' && end != '') {
            start = Number(start);
            end = Number(end);
            if (value >= start && value < end) {
              iconUrl = legend[i].iconUrl;
              break;
            }
          }
        }
        return iconUrl;
      };

      /**
       * 得到图例颜色
       * @param legend
       * @param value
       * @returns {String}
       */
      common.getColorByValue = function (legend, value) {
        var color = '';
        if (legend != undefined) {
          for (var i = 0; i < legend.length; i++) {
            var rule = legend[i].rule;
            var arrRule = rule.split(',');
            var start = arrRule[0];
            var end = arrRule[1];
            if (start != '' && end != '') {
              if (value >= parseInt(start) && value < parseInt(end)) {
                color = legend[i].color;
                break;
              }
            } else if (start == '' && end != '') {
              if (value < parseInt(end)) {
                color = legend[i].color;
                break;
              }
            } else if (start != '' && end == '') {
              if (value >= parseInt(start)) {
                color = legend[i].color;
                break;
              }
            }
          }
        }
        return color;
      };

      /**
       * 画小方块
       */
      common.drawPoint = function (myctx, lon, lat, value) {
        var point = _maphelper.maphelper.map.latLngToContainerPoint(
          new L.LatLng(lat, lon),
        );
        myctx.beginPath();
        myctx.lineWidth = 4.5;
        myctx.moveTo(point.x, point.y);
        myctx.lineTo(point.x, point.y + 4.5);
        myctx.strokeStyle = common.getColorByValue(common.legend, value);
        myctx.stroke();
      };
      common.drawPoint2 = function (myctx, lon, lat, value) {
        var point = _maphelper.maphelper.map.latLngToContainerPoint(
          new L.LatLng(lat, lon),
        );
        myctx.beginPath();
        myctx.lineWidth = 4.5;
        myctx.moveTo(point.x, point.y);
        myctx.lineTo(point.x, point.y + 4.5);
        myctx.strokeStyle = common.getColorByValue(common.legend, value * 100);
        myctx.stroke();
      };

      /**
       * 画圆角矩形
       */
      common.drawSquare = function (myctx, lon, lat, value) {
        var point = _maphelper.maphelper.map.latLngToContainerPoint(
          new L.LatLng(lat, lon),
        );
        var startx = point.x;
        var starty = point.y;
        var squWidth = 28;
        var squHeight = 12;
        myctx.beginPath();
        myctx.moveTo(startx, starty);
        myctx.quadraticCurveTo(
          startx - 5,
          starty + squHeight / 2,
          startx,
          starty + squHeight,
        );
        myctx.lineTo(startx + squWidth, starty + squHeight);
        myctx.moveTo(startx + squWidth, starty + squHeight);
        myctx.quadraticCurveTo(
          startx + squWidth + 5,
          starty + squHeight / 2,
          startx + squWidth,
          starty,
        );
        myctx.lineTo(startx, starty);
        myctx.fillStyle = common.getColorByValue(common.legend, value);
        myctx.fill();
        myctx.font = 'bold 10px Microsoft Yahei';
        myctx.fillStyle = '#333';
        if ((value + '').length == 5 || (value + '').length == 6) {
          var txtstartx = startx;
        } else if ((value + '').length == 4) {
          var txtstartx = startx + 2;
        } else if ((value + '').length == 3) {
          var txtstartx = startx + 5;
        } else if ((value + '').length == 2) {
          var txtstartx = startx + 6;
        } else {
          var txtstartx = startx + 10;
        }
        myctx.fillText(value + '', txtstartx, starty + squHeight - 2);
      };
      common.drawSquare2 = function (myctx, lon, lat, value) {
        var point = _maphelper.maphelper.map.latLngToContainerPoint(
          new L.LatLng(lat, lon),
        );
        var startx = point.x;
        var starty = point.y;
        var squWidth = 28;
        var squHeight = 12;
        myctx.beginPath();
        myctx.moveTo(startx, starty);
        myctx.quadraticCurveTo(
          startx - 5,
          starty + squHeight / 2,
          startx,
          starty + squHeight,
        );
        myctx.lineTo(startx + squWidth, starty + squHeight);
        myctx.moveTo(startx + squWidth, starty + squHeight);
        myctx.quadraticCurveTo(
          startx + squWidth + 5,
          starty + squHeight / 2,
          startx + squWidth,
          starty,
        );
        myctx.lineTo(startx, starty);
        myctx.fillStyle = common.getColorByValue(common.legend, value * 100);
        myctx.fill();
        myctx.font = 'bold 10px Microsoft Yahei';
        myctx.fillStyle = '#333';
        if ((value + '').length == 5 || (value + '').length == 6) {
          var txtstartx = startx;
        } else if ((value + '').length == 4) {
          var txtstartx = startx + 2;
        } else if ((value + '').length == 3) {
          var txtstartx = startx + 5;
        } else if ((value + '').length == 2) {
          var txtstartx = startx + 6;
        } else {
          var txtstartx = startx + 10;
        }
        myctx.fillText(value + '', txtstartx, starty + squHeight - 2);
      };

      common.clearMarkers = function (arr) {
        if (arr != undefined && arr.length > 0) {
          var len = arr.length;
          for (var i = 0; i < len; i++) {
            arr[i].remove();
          }
          arr = [];
        }
      };

      //预警站点图标显示
      common.addWarnMarker = function (data, arrMarker) {
        var preTime = data.time;
        var time = preTime
          .replaceAll(' ', '')
          .replaceAll('-', '')
          .replaceAll(':', '');
        var w = 40;
        var h = 34;
        var signallevelcode = '';
        if (data.signallevelcode == 'UNKNOWN') {
          data.signallevelcode = 'BLUE';
        }
        var isExistWarningTypeFlag = false;
        for (var i = 0; i < common.existWarningType.length; i++) {
          if (data.signaltypecode == common.existWarningType[i]) {
            isExistWarningTypeFlag = true;
            break;
          }
        }
        if (isExistWarningTypeFlag == true) {
          var url =
            ctxStatic +
            '/ultra/img/gis/disasterWarning/' +
            data.signaltypecode +
            '_' +
            data.signallevelcode +
            '.png?v=1';
        } else {
          var url =
            ctxStatic +
            '/ultra/img/gis/disasterWarning/11B99' +
            '_' +
            data.signallevelcode +
            '.png?v=1';
        }
        var m = _maphelper.maphelper.addClickableMarker(
          common.translateNum(data.lon),
          common.translateNum(data.lat),
          {
            url: url,
            w: w,
            h: h,
            zIndexOffset: time,
          },
          function () {
            // 鼠标点击事件
            var provinceCode = data.areaId;
            _maphelper.maphelper.moveTo(data.lon, data.lat, 8);
            globalParam.warnZoomLevel = 8;
            globalParam.warnClick = true;
            /*if(maphelper.border != null){
  	staPoint.clearBorder();
  }*/
            if (_stationPoint2.default.bcircle != null) {
              _stationPoint2.default.clearArea();
            }
            if (data.signallevelcode === 'BLUE') {
              var fillColor = '#144da0';
            } else if (data.signallevelcode === 'YELLOW') {
              var fillColor = '#feed00';
            } else if (data.signallevelcode === 'ORANGE') {
              var fillColor = '#f17511';
            } else if (data.signallevelcode === 'RED') {
              var fillColor = '#ff0000';
            } else {
              var fillColor = '#144da0';
            }
            emgcy.provinceCode = provinceCode;
            //			maphelper.addCityBorder(provinceCode,fillColor);
            if (
              data.signaltypecode === '11B03' ||
              data.signaltypecode === '11B20' ||
              data.signaltypecode === '11B01'
            ) {
              // 暴雨、雷雨大风、台风 ===》降水
              var funitemmenuid = '1150101020';
              var elename = '降水';
              var unit = 'mm';
            } else if (data.signaltypecode === '11B06') {
              //大风 ===》风
              var funitemmenuid = '115990104';
              var elename = '风';
              var unit = 'm/s';
            } else if (data.signaltypecode === '11B09') {
              //高温 ===》气温
              var funitemmenuid = '115990101';
              var elename = '气温';
              var unit = '℃';
            } else if (data.signaltypecode === '11B17') {
              //大雾  ===》能见度
              var funitemmenuid = '115990106';
              var elename = '能见度';
              var unit = 'km';
            } else {
              //默认气温
              var funitemmenuid = '115990101';
              var elename = '气温';
              var unit = '℃';
            }
            $('.me_eleName').text(elename + '(' + unit + ')');
            /*if($(".staBtn").hasClass("staChecked")){
  	$(".staBtn").removeClass("staChecked");
  }*/
            if ($('#sk').hasClass('sel')) {
              syntheical.getLegend(funitemmenuid, 'Gis', 2);
              _stationPoint2.default.clearEchartPoint();
              if (
                globalParam.provinceFocusId != null &&
                globalParam.provinceFocusId != '' &&
                globalParam.provinceFocusId != '1000'
              ) {
                _stationPoint2.default.getPoint2(
                  funitemmenuid,
                  _stationPoint2.default.datetime,
                  provinceCode,
                  '1',
                );
              } else {
                _stationPoint2.default.getPoint(
                  funitemmenuid,
                  _stationPoint2.default.datetime,
                  provinceCode,
                  '1',
                );
              }
            }
          },
          function () {
            // 鼠标悬停事件
            var title =
              data.name +
              '发布' +
              data.codename +
              data.signallevel +
              '预警信号';
            var values =
              "<div class='warnInfoTip'><div class='warnInfoTipTi'>" +
              "<span class='warnTi'>" +
              title +
              '</span></div>' +
              "<div class='warnInfoTipCont'>" +
              data.issuecontent +
              '</div></div>';
            return values;
          },
        );
        arrMarker.push(m);
      };

      //灾情站点图标显示
      common.addDisasterMarker = function (data, arrMarker) {
        var timestr = data.CREATED;
        timestr = timestr
          .replaceAll('-', '')
          .replaceAll(':', '')
          .replaceAll(' ', '');
        var w = 40;
        var h = 34;
        var url =
          ctxStatic +
          '/ultra/img/gis/disasterWarning/' +
          data.MAINTYPE +
          '.png?v=1';
        var m = _maphelper.maphelper.addClickableMarker(
          common.translateNum(data.lon),
          common.translateNum(data.lat),
          {
            url: url,
            w: w,
            h: h,
            zIndexOffset: timestr,
          },
          function () {
            // 鼠标点击事件
          },
          function () {
            // 鼠标悬停事件
            var title = data.SENDERNAME + '发布' + data.type + '灾情';
            var values =
              "<div class='warnInfoTip'><div class='warnInfoTipTi'>" +
              "<span class='warnTi'>" +
              title +
              '</span></div>' +
              "<div class='warnInfoTipCont'>" +
              data.IMPACT +
              '</div></div>';
            return values;
          },
        );
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
      common.getDay = function (strDate, ctime, format) {
        strDate = strDate.replace(/-/g, '/');
        var date = new Date(strDate);
        if (format == 'day') {
          date.setDate(date.getDate() + ctime);
        } else if (format == 'hour') {
          date.setHours(date.getHours() + ctime);
        }
        return (
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate() +
          ' ' +
          date.getHours() +
          ':' +
          date.getMinutes() +
          ':00'
        );
      };

      common.zoomToSpecialType = function (zoom) {
        if (zoom <= 6) {
          return '0';
        } /* else if (zoom >= 7 && zoom <= 8) {
   return "0%2C1";
   } */ else {
          return '0%2C1';
          //return "0%2C1%2C2";
        }
      };

      /**
       * 根据zoom 判断调用精细化预报时 传递相应的参数
       * @param zoom
       * @returns {Number}
       */
      common.getRangeLevel = function (zoom) {
        if (zoom >= 0 && zoom < 6) {
          return 0;
        } else if (zoom >= 6 && zoom < 7) {
          return 1;
        } else if (zoom >= 7 && zoom < 8) {
          return 2;
        } else if (zoom >= 8 && zoom < 9) {
          return 3;
        } else if (zoom >= 9 && zoom < 10) {
          return 4;
        } else if (zoom >= 10 && zoom < 11) {
          return 5;
        } else if (zoom >= 11 && zoom < 12) {
          return 6;
        }
      };

      common.getCurrDate = function (format) {
        if (format == 'yyyy-MM-dd HH') {
          var myDate = new Date();
          var yyyy = myDate.getFullYear();
          var MM = myDate.getMonth() + 1;
          var dd = myDate.getDate();
          var HH = myDate.getHours();
          var mm = myDate.getMinutes();
          if (MM < 10) {
            MM = '0' + MM;
          }
          if (dd < 10) {
            dd = '0' + dd;
          }
          if (HH < 10) {
            HH = '0' + HH;
          }
          if (mm < 10) {
            mm = '0' + mm;
          }
          var time = yyyy + '-' + MM + '-' + dd + ' ' + HH + '时';
          return time;
        }
      };

      common.translateNum = function (num) {
        var r = parseInt((Math.random() - 0.5) * 200);
        return parseFloat(num) + r * 0.004;
      };
      common.translateNum2 = function (num) {
        var r = parseInt((Math.random() - 0.5) * 200);
        return parseFloat(num);
      };
      common.existWarningType = [
        '11B01',
        '11B03',
        '11B04',
        '11B05',
        '11B06',
        '11B07',
        '11B09',
        '11B11',
        '11B14',
        '11B15',
        '11B16',
        '11B17',
        '11B19',
        '11B20',
        '11B21',
        '11B22',
        '11B25',
        '11B99',
      ];
      common.warningTypeDisabled = {};
      common.existDisasterType = [
        'GALDR',
        'THDDR',
        'CWDR',
        'DGDR',
        'HLDR',
        'CDDR',
        'ICFDR',
        'OMDR',
        'TYODR',
        'FOGDR',
        'SNODR',
        'STSUDR',
        'ERDR',
        'SSDR',
        'DWDR',
        'MGDDR',
        'HWDR',
        'LCDDR',
        'AIPDR',
        'RSDR',
        'FIRDR',
      ];
      common.provinceLatLon = {
        110000: [116, 40],
        120000: [118, 39],
        130000: [115, 38],
        140000: [112, 37],
        150000: [111, 41],
        310000: [122, 31],
        320000: [118, 33],
        330000: [121, 29],
        340000: [116, 32],
        350000: [118, 26],
        370000: [118, 36],
        410000: [113, 34],
        420000: [112, 31],
        430000: [111, 27],
        360000: [115, 28],
        440000: [113, 22],
        450000: [108, 23],
        460000: [110, 19],
        610000: [109, 34],
        620000: [101, 37],
        630000: [96, 35],
        640000: [106, 37],
        650000: [84, 40],
        500000: [107, 29],
        510000: [103, 30],
        520000: [107, 27],
        530000: [101, 25],
        540000: [89, 31],
        210000: [122, 40],
        220000: [126, 43],
        230000: [128, 47],
      };
      common.emergency = function (data) {
        var zIndex;
        var curTime = new Date();
        var year = curTime.getFullYear();
        var dataTime = data.dataTime;
        var monthIndex = dataTime.indexOf('月');
        var dateIndex = dataTime.indexOf('日');
        var hourIndex = dataTime.indexOf('时');
        var minuteIndex = dataTime.indexOf('分');

        var month = dataTime.substring(0, monthIndex);
        if (month.length == 1) {
          month = '0' + month;
        }
        var date = dataTime.substring(monthIndex + 1, dateIndex);
        if (date.length == 1) {
          length = '0' + date;
        }
        var hour = dataTime.substring(dateIndex + 1, hourIndex);
        if (hour.length == 1) {
          hour = '0' + hour;
        }
        if (minuteIndex < 0) {
          zIndex = year + month + date + hour + minute;
        } else {
          var minute = dataTime.substring(hourIndex + 1, minuteIndex);
          if (minute.length == 1) {
            minute = '0' + minute;
          }
          zIndex = year + month + date + hour + minute;
        }
        //var w = 28;
        //var h = 28;
        var typeid = parseInt(data.levelCode);
        var lonlat = common.provinceLatLon[data.provinceCode];
        if (lonlat != undefined) {
          var lon = lonlat[0];
          var lat = lonlat[1];
          switch (typeid) {
            case 1:
              var emgyColor = 'red';
              break;
            case 2:
              var emgyColor = 'orange';
              break;
            case 3:
              var emgyColor = '#bfb101';
              break;
            case 4:
              var emgyColor = 'blue';
              break;
            default:
              var emgyColor = 'blue';
              break;
          }
          if (!data.type) {
            data.type = '';
          }
          _maphelper.maphelper.addDivOfZIndex(
            common.translateNum(lon),
            common.translateNum(lat),
            "<div style='width:100px;font:bold 15px Microsoft Yahei;color:" +
              emgyColor +
              "'>" +
              data.type +
              data.level +
              '</div>',
            null,
            parseInt(zIndex),
            null,
            function () {
              return data.emergencyInfo;
            },
          );
        }
      };

      common.mergeArray = function (mergeFrom, mergeTo) {
        mergeTo = mergeFrom.concat(mergeTo);
        return mergeTo;
      };

      /***/
    },
    /* 3 */
    /***/ function (module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      /**
       * 闪电定位
       * @type {{}}
       */
      var atdts = atdts || {};
      atdts.productList = [];
      atdts.getAtdt = function (time) {
        atdts.clearAtdtProduct();
        $('.dateTime').text('数据时间:' + time);
        var datas = {
          funItemMenuId: 1019020201,
          time: time,
        };

        $.ajax({
          type: 'get',
          url: ctx + '/institute/getMarker',
          data: datas,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          dataType: 'json',
          success: function success(result) {
            if (result.returnCode != 0) {
              alert('当前没有闪电定位信息');
              return;
            }
            atdts.showInEcharts(result);
          },
        });
      };

      /**
       * 处理闪电定位的数据
       * @param data
       */
      atdts.getLatString = function (lat) {
        return Math.abs(lat).toFixed(2) + '° ' + (lat >= 0 ? 'N' : 'S');
      };
      atdts.getLonString = function (lon) {
        return Math.abs(lon).toFixed(2) + '° ' + (lon >= 0 ? 'E' : 'W');
      };
      atdts.getDate = function getDate(date) {
        return date;
      };

      /**
       * echarts 添加闪电
       * @param data
       */

      atdts.showInEcharts = function (data) {
        var unit = {
          adtdmul: {
            Datetime: { cname: '资料时间', unit: '-' },
            Lat: { cname: '纬度', unit: '' },
            Lon: { cname: '经度', unit: '' },
            Lit_Current: { cname: '电流强度', unit: '' },
            MARS_3: { cname: '回击最大陡度', unit: '' },
            Pois_Err: { cname: '定位误差', unit: '' },
            Pois_Type: { cname: '定位方式', unit: '' },
            Year: { cname: '年', unit: '年' },
            Mon: { cname: '月', unit: '月' },
            Day: { cname: '日', unit: '日' },
            Hour: { cname: '时', unit: '时' },
            Min: { cname: '分', unit: '分钟' },
            Second: { cname: '秒', unit: '秒' },
            MSecond: { cname: '资料观测毫秒', unit: 'ms' },
            Layer_Num: { cname: '层次序号', unit: 'N' },
          },
        };
        globalParam.atdtData = data.DS;

        var cunit = unit['adtdmul'];
        var datas = [];
        var geoCoordMap = {};
        var echartsData = [];
        data.DS.forEach(function (item) {
          var imgName = void 0;
          var size = 12;
          var cname = '云闪';
          if (item.V_CG_IC == 'IC') {
            imgName = 'cloudAtdt';
            size = 10;
          } else if (item.V_CG_IC == 'CG') {
            if (item.Lit_Current >= 0) {
              imgName = 'posiviteAtdt';
              cname = '云地闪(正闪)';
            } else {
              imgName = 'negativeAtdt';
              cname = '云地闪(负闪)';
            }
            size = 12;
          }
          item.cname = cname;

          echartsData.push([item.Lon, item.Lat, item]);
        });

        function formatter(data) {
          item = data.data[2];
          var html = ' <div class="searchedPoint overlayer">'; //闪电定位没有站名站号
          html += "<div class='poptitle'>" + item.cname + '</div>';

          Object.keys(cunit).forEach(function (unititem) {
            if (
              !cunit[unititem] ||
              !cunit[unititem]['cname'] ||
              !item[unititem] ||
              !item[unititem] == 'null' ||
              item[unititem] == '"null"' ||
              item[unititem] == '999999' ||
              item[unititem] == '999998'
            ) {
              return;
            }
            html += '<div class="popbody">' + cunit[unititem]['cname'] + ':';
            if (item[unititem].toString().length > 10) {
              html += '<br>';
            }
            if (unititem == 'Datetime') {
              html += atdts.getDate(item[unititem]);
            } else if (unititem == 'Lon') {
              html += atdts.getLonString(item[unititem]);
            } else if (unititem == 'Lat') {
              html += atdts.getLatString(item[unititem]);
            } else {
              html += item[unititem];
            }
            //加单位
            if (cunit[unititem]['unit'] != '-' && !!cunit[unititem]['unit']) {
              html += '(' + cunit[unititem]['unit'] + ')';
            }
            html += '</div>';
          });
          if (item['Lit_Prov']) {
            html +=
              "<div class='popbody'>行政单位:<br/>" +
              item['Lit_Prov'] +
              item['Lit_City'] +
              item['Lit_Cnty'] +
              '</div>';
          }
          html += '</div>';
          return html;
        }

        var option = {
          animation: false,
          coordinateSystem: 'leaflet',
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
          },
          series: [
            {
              name: 'atdt',
              type: 'scatter',
              symbolSize: 8, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
              symbol: function symbol(val, param) {
                var item = val[2];
                // console.log(item)
                var imgName = void 0;
                if (item.V_CG_IC == 'IC') {
                  imgName = 'cloudAtdt';
                  size = 10;
                } else if (item.V_CG_IC == 'CG') {
                  if (item.Lit_Current >= 0) {
                    imgName = 'posiviteAtdt';
                  } else {
                    imgName = 'negativeAtdt';
                  }
                  size = 12;
                }
                var originurl = location.origin;
                var url =
                  originurl +
                  ctxStatic +
                  '/ultras/img/atdt/' +
                  imgName +
                  '.png';
                return 'image://' + url;
              },
              tooltip: {
                trigger: 'item',
                backgroundColor: 'transparent',
                formatter: formatter,
                position: 'top',
              },
              coordinateSystem: 'leaflet',
              label: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: false,
                  symbolSize: 8,
                },
              },
              itemStyle: {
                normal: {
                  borderColor: '#555',
                  borderWidth: 1, // 标注边线线宽，单位px，默认为1
                  label: {
                    show: false,
                  },
                },
                emphasis: {
                  borderColor: '#333',
                  borderWidth: 5,
                  label: {
                    show: false,
                  },
                },
              },
              data: echartsData,
            },
          ],
        };
        atdts.option = option;
        atdts.show = true;
        var option1 = staPoint.getFinalOptions();
        staPoint.overlay.setOption(option1, true);
        // loading.hide()
      };
      /**
       * 清空atdt
       */
      atdts.clearAtdtProduct = function () {
        atdts.option = null;
        var option1 = staPoint.getFinalOptions();
        staPoint.overlay.setOption(option1, true);

        // atdts.show = false;
      };

      exports.default = atdts;

      /***/
    },
    /* 4 */
    /***/ function (module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      /**
       * @class L.echartsLayer
       * @classdesc 百度 ECharts 图层类。
       * @category  Visualization ECharts
       * @extends {L.Layer}
       * @param {Object} echartsOptions - 图表参数。
       * @param {Object} options - 可选图层参数。
       * @param {boolean} [options.loadWhileAnimating=false] - 是否在移动时实时绘制。
       * @param {string} [options.attribution='? 2017 百度 ECharts'] - 版权信息。
       */
      var EchartsLayer = (exports.EchartsLayer = (
        L.version < '1.0' ? L.Class : L.Layer
      ).extend({
        includes: L.version < '1.0' ? L.Mixin.Events : [],
        _echartsContainer: null,
        _map: null,
        _ec: null,
        _echartsOptions: null,

        options: {
          loadWhileAnimating: false,
        },

        initialize: function initialize(echartsOptions, options) {
          L.Util.setOptions(this, options);
          this.setOption(echartsOptions);
        },
        /**
         * @function L.echartsLayer.prototype.setOption
         * @description 设置图表地图参数。
         * @param {Object} echartsOptions - 图表参数。
         * @param {string} lazyUpdate - 后台自动更新。
         * @param {boolean} [notMerge] - 是否合并参数。
         */
        setOption: function setOption(echartsOptions, notMerge, lazyUpdate) {
          var baseOption = echartsOptions.baseOption || echartsOptions;
          baseOption.LeafletMap = baseOption.LeafletMap || {
            roam: true,
          };
          baseOption.animation = baseOption.animation === true;
          this._echartsOptions = echartsOptions;
          this._ec && this._ec.setOption(echartsOptions, notMerge, lazyUpdate);
          if (this._map && this._map.fire) {
            this._map.fire('moveend');
          }
        },
        getEcharts: function getEcharts() {
          return this._ec;
        },
        _disableEchartsContainer: function _disableEchartsContainer() {
          this._echartsContainer.style.visibility = 'hidden';
        },
        _enableEchartsContainer: function _enableEchartsContainer() {
          this._echartsContainer.style.visibility = 'visible';
        },

        /**
         * @private
         * @function L.echartsLayer.prototype.onAdd
         * @description 添加地图。
         * @param {L.Map} map - 待添加的地图。
         */
        onAdd: function onAdd(map) {
          this._map = map;
          this._initEchartsContainer();
          this._ec = echarts.init(this._echartsContainer);
          echarts.leafletMap = map;
          var me = this;
          map.on('zoomstart', function () {
            me._disableEchartsContainer();
          });
          !me.options.loadWhileAnimating &&
            map.on('movestart', function () {
              me._disableEchartsContainer();
            });
          echarts.registerAction(
            {
              type: 'LeafletMapLayout',
              event: 'LeafletMapLayout',
              update: 'updateLayout',
            },
            function (payload, ecModel) {
              // eslint-disable-line no-unused-vars
            },
          );
          echarts.registerCoordinateSystem('leaflet', LeafletMapCoordSys);
          echarts.extendComponentModel({
            type: 'LeafletMap',
            getBMap: function getBMap() {
              return this.__LeafletMap;
            },
            defaultOption: {
              roam: false,
            },
          });
          echarts.extendComponentView({
            type: 'LeafletMap',
            render: function render(LeafletMapModel, ecModel, api) {
              var rendering = true;
              var leafletMap = echarts.leafletMap;
              var viewportRoot = api.getZr().painter.getViewportRoot();

              var animated =
                leafletMap.options.zoomAnimation && L.Browser.any3d;
              viewportRoot.className =
                ' leaflet-layer leaflet-zoom-' +
                (animated ? 'animated' : 'hide') +
                ' echarts-layer';

              var originProp = L.DomUtil.testProp([
                'transformOrigin',
                'WebkitTransformOrigin',
                'msTransformOrigin',
              ]);
              viewportRoot.style[originProp] = '50% 50%';

              var coordSys = LeafletMapModel.coordinateSystem;

              var ecLayers = api.getZr().painter.getLayers();

              var moveHandler = function moveHandler() {
                if (rendering) {
                  return;
                }
                var offset = me._map.containerPointToLayerPoint([0, 0]);
                var mapOffset = [offset.x || 0, offset.y || 0];
                viewportRoot.style.left = mapOffset[0] + 'px';
                viewportRoot.style.top = mapOffset[1] + 'px';

                if (!me.options.loadWhileAnimating) {
                  for (var item in ecLayers) {
                    if (!ecLayers.hasOwnProperty(item)) {
                      continue;
                    }
                    ecLayers[item] && clearContext(ecLayers[item].ctx);
                  }
                  me._enableEchartsContainer();
                }
                coordSys.setMapOffset(mapOffset);
                LeafletMapModel.__mapOffset = mapOffset;

                api.dispatchAction({
                  type: 'LeafletMapLayout',
                });
              };

              function clearContext(context) {
                context &&
                  context.clearRect &&
                  context.clearRect(
                    0,
                    0,
                    context.canvas.width,
                    context.canvas.height,
                  );
              }

              function zoomEndHandler() {
                if (rendering) {
                  return;
                }

                api.dispatchAction({
                  type: 'LeafletMapLayout',
                });
                me._enableEchartsContainer();
              }

              if (me._oldMoveHandler) {
                leafletMap.off(
                  me.options.loadWhileAnimating ? 'move' : 'moveend',
                  me._oldMoveHandler,
                );
              }
              if (me._oldZoomEndHandler) {
                leafletMap.off('zoomend', me._oldZoomEndHandler);
              }

              leafletMap.on(
                me.options.loadWhileAnimating ? 'move' : 'moveend',
                moveHandler,
              );
              leafletMap.on('zoomend', zoomEndHandler);
              me._oldMoveHandler = moveHandler;
              me._oldZoomEndHandler = zoomEndHandler;
              rendering = false;
            },
          });
          this._ec.setOption(this._echartsOptions);
        },

        onRemove: function onRemove() {
          // 销毁echarts实例
          this._ec.clear();
          this._ec.dispose();
          delete this._ec;
          L.DomUtil.remove(this._echartsContainer);
          if (this._oldZoomEndHandler) {
            this._map.off('zoomend', this._oldZoomEndHandler);
            this._oldZoomEndHandler = null;
          }
          if (this._oldMoveHandler) {
            this._map.off(
              this.options.loadWhileAnimating ? 'move' : 'moveend',
              this._oldMoveHandler,
            );
            this._oldMoveHandler = null;
          }
          if (this._resizeHandler) {
            this._map.off('resize', this._resizeHandler);
            this._resizeHandler = null;
          }
          delete this._map;
        },

        _initEchartsContainer: function _initEchartsContainer() {
          var size = this._map.getSize();

          var _div = document.createElement('div');
          _div.style.position = 'absolute';
          _div.style.height = size.y + 'px';
          _div.style.width = size.x + 'px';
          _div.style.zIndex = 400;
          this._echartsContainer = _div;

          this._map.getPanes().overlayPane.appendChild(this._echartsContainer);
          var me = this;

          function _resizeHandler(e) {
            var size = e.newSize;
            me._echartsContainer.style.width = size.x + 'px';
            me._echartsContainer.style.height = size.y + 'px';
            me._ec.resize();
          }

          this._map.on('resize', _resizeHandler);
          this._resizeHandler = _resizeHandler;
        },
      }));

      /**
       * @class L.LeafletMapCoordSys
       * @private
       * @classdesc 地图坐标系统类。
       * @param {L.Map} leafletMap - 地图。
       */
      function LeafletMapCoordSys(leafletMap) {
        this._LeafletMap = leafletMap;
        this.dimensions = ['lng', 'lat'];
        this._mapOffset = [0, 0];
      }

      LeafletMapCoordSys.prototype.dimensions = ['lng', 'lat'];

      LeafletMapCoordSys.prototype.setMapOffset = function (mapOffset) {
        this._mapOffset = mapOffset;
      };

      LeafletMapCoordSys.prototype.getBMap = function () {
        return this._LeafletMap;
      };

      LeafletMapCoordSys.prototype.prepareCustoms = function () {
        var zrUtil = echarts.util;

        var rect = this.getViewRect();
        return {
          coordSys: {
            // The name exposed to user is always 'cartesian2d' but not 'grid'.
            type: 'leaflet',
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          api: {
            coord: zrUtil.bind(this.dataToPoint, this),
            size: zrUtil.bind(dataToCoordSize, this),
          },
        };

        function dataToCoordSize(dataSize, dataItem) {
          dataItem = dataItem || [0, 0];
          return zrUtil.map(
            [0, 1],
            function (dimIdx) {
              var val = dataItem[dimIdx];
              var halfSize = dataSize[dimIdx] / 2;
              var p1 = [];
              var p2 = [];
              p1[dimIdx] = val - halfSize;
              p2[dimIdx] = val + halfSize;
              p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
              return Math.abs(
                this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx],
              );
            },
            this,
          );
        }
      };

      LeafletMapCoordSys.prototype.dataToPoint = function (data) {
        // 处理数据中的null值
        if (data[1] === null) {
          data[1] = L.CRS.EPSG3857.projection.MAX_LATITUDE;
        }
        // 平面坐标系不能这么处理
        // data[1] = this.fixLat(data[1]);

        var px = this._LeafletMap.latLngToLayerPoint([data[1], data[0]]);

        var mapOffset = this._mapOffset;
        return [px.x - mapOffset[0], px.y - mapOffset[1]];
      };

      LeafletMapCoordSys.prototype.fixLat = function (lat) {
        if (lat >= 90) {
          return 89.99999999999999;
        }
        if (lat <= -90) {
          return -89.99999999999999;
        }
        return lat;
      };

      LeafletMapCoordSys.prototype.pointToData = function (pt) {
        var mapOffset = this._mapOffset;
        var point = this._LeafletMap.layerPointToLatLng([
          pt[0] + mapOffset[0],
          pt[1] + mapOffset[1],
        ]);
        return [point.lng, point.lat];
      };

      LeafletMapCoordSys.prototype.getViewRect = function () {
        var size = this._LeafletMap.getSize();
        return new echarts.graphic.BoundingRect(0, 0, size.x, size.y);
      };

      LeafletMapCoordSys.prototype.getRoamTransform = function () {
        return echarts.matrix.create();
      };
      LeafletMapCoordSys.dimensions = LeafletMapCoordSys.prototype.dimensions;

      LeafletMapCoordSys.create = function (ecModel) {
        var coordSys;

        ecModel.eachComponent('LeafletMap', function (leafletMapModel) {
          if (!coordSys) {
            coordSys = new LeafletMapCoordSys(echarts.leafletMap);
          }
          leafletMapModel.coordinateSystem = coordSys;
          leafletMapModel.coordinateSystem.setMapOffset(
            leafletMapModel.__mapOffset || [0, 0],
          );
        });
        ecModel.eachSeries(function (seriesModel) {
          if (
            !seriesModel.get('coordinateSystem') ||
            seriesModel.get('coordinateSystem') === 'leaflet'
          ) {
            if (!coordSys) {
              coordSys = new LeafletMapCoordSys(echarts.leafletMap);
            }
            seriesModel.coordinateSystem = coordSys;
            seriesModel.animation = seriesModel.animation === true;
          }
        });
      };
      var echartsLayer = function echartsLayer(echartsOptions, options) {
        return new EchartsLayer(echartsOptions, options);
      };

      L.echartsLayer = echartsLayer;

      /***/
    },
    /* 5 */
    /***/ function (module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.getLegend = getLegend;
      exports.getColorMap = getColorMap;
      exports.appendLegend = appendLegend;
      exports.setDataRange = setDataRange;
      exports.setInterval = setInterval;

      var _stationPoint = __webpack_require__(1);

      var _stationPoint2 = _interopRequireDefault(_stationPoint);

      var _maphelper = __webpack_require__(0);

      var _common = __webpack_require__(2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      /**
       * flag=1 格点 flag=2站点 flag=3预报
       */
      function getLegend(funItemMenuId, position, flag) {
        $.ajax({
          url: ctx + '/multiExhibition/getLegend',
          type: 'get',
          dataType: 'json',
          async: false,
          data: {
            funItemMenuId: funItemMenuId,
            position: position,
          },
          success: function success(result) {
            if (result) {
              appendLegend(funItemMenuId, result, flag);
              if (flag === 1) {
                //土壤湿度
                _common.common.legend = result.list;
                setInterval(result.list);
              } else if (flag === 2) {
                //实况资料
                setDataRange(result);
              }
            }
          },
        });
      }

      /**
       * 获取渲染图
       * @param typeCode 类型
       * @param dateTime 时间字符串，如2019071311
       */
      /**
       * @date: 2019-07-13 12:41:11
       * @description:  渲染图
       */

      function getColorMap(typeCode, dateTime) {
        $.ajax({
          url: ctx + '/gis/getColorMap',
          type: 'get',
          dataType: 'json',
          async: false,
          data: {
            typeCode: typeCode,
            dateTime: dateTime,
          },
          success: function success(data) {
            if (data.returnCode === '0') {
              globalParam.fcstDateTime = data.DS.D_DATETIME;
              var obj = data.DS;
              if (_stationPoint2.default.img) {
                _stationPoint2.default.img.changeUrl(obj.url, 0.8);
              } else {
                _stationPoint2.default.img = _maphelper.maphelper.addImage(
                  obj.url,
                  72.4,
                  15.5,
                  136.5,
                  54.5,
                  0.8,
                );
              }
            }
          },
        });
      }
      /**
       * 添加图例
       * @param {*} funItemMenuId
       * @param {*} result
       * @param {*} flag
       */
      function appendLegend(funItemMenuId, result, flag) {
        var list = result.list;
        var len = list.length;
        var width = 242 / len + 'px';
        var strHtml =
          "<div class='lgd_top'><span class='lgd_name'>" +
          result.name +
          '(' +
          result.unit +
          ')' +
          '</span>';
        if (flag === 1) {
          //重新赋值
          strHtml =
            "<div class='lgd_top'><span class='lgd_name'>融合分析</span></div>";
          strHtml +=
            "<div class='smallTitle'><span style='margin-left: 10px;'>" +
            result.name +
            '(' +
            result.unit +
            ")</span><span class='lgd_time' id='lgd_fxtime'></span></div>";
        } else if (flag === 2) {
          //重新赋值
          strHtml =
            "<div class='lgd_top'><span class='lgd_name'>实况</span></div>";
          var time = _stationPoint2.default.datetime;
          if (time == undefined || time === '') {
            time = _common.common.getCurrDate('yyyy-MM-dd HH');
          } else {
            time =
              time.substring(0, 4) +
              '-' +
              time.substring(4, 6) +
              '-' +
              time.substring(6, 8) +
              ' ' +
              time.substring(8, 10) +
              '时';
          }
          strHtml +=
            "<div class='smallTitle'><span style='margin-left: 10px;'>" +
            result.name +
            '(' +
            result.unit +
            ")</span><span class='lgd_time' >" +
            time +
            '</span></div>';
        } else if (flag === 3) {
          //重新赋值
          strHtml =
            "<div class='lgd_top'><span class='lgd_name'>预报</span></div>";
          //let time = globalParam.fcsttime;
          var _time = globalParam.fcstDateTime;
          if (_time == undefined || _time == null) {
            _time = new Date();
          }
          var time2 = new Date(
            _time.substring(0, 4),
            _time.substring(4, 6) - 1,
            _time.substring(6, 8),
            _time.substring(8, 10),
          );
          time2.setDate(time2.getDate() + 1);
          var timestr = time2.format('yyyyMMddHH') + '0000';
          if (_time == undefined || _time === '') {
            _time = _common.common.getCurrDate('yyyy-MM-dd HH');
          } else {
            //time = time.substring(0,4)+ "-" + time.substring(4,6)+ "-" + time.substring(6,8)+ " " + time.substring(8,10) + "时";
            time3 =
              _time.substring(4, 6) +
              '月' +
              _time.substring(6, 8) +
              '日' +
              _time.substring(8, 10) +
              '时';
            time4 =
              timestr.substring(4, 6) +
              '月' +
              timestr.substring(6, 8) +
              '日' +
              timestr.substring(8, 10) +
              '时';
            //time2 = timestr.substring(0,4)+ "月" + timestr.substring(4,6)+ "" + timestr.substring(6,8)+ " " + timestr.substring(8,10) + "时";
          }
          //strHtml += "<span class='lgd_time'>"+time+"</span></div>";
          strHtml +=
            "<div class='smallTitle'><span style='margin-left: 10px;'>" +
            result.name +
            '(' +
            result.unit +
            ")</span><span class='lgd_time' >" +
            time3 +
            '—' +
            time4 +
            '</span></div>';
        }
        strHtml += "<div class='lgd_bottom'>";
        strHtml += "<div class='lgd_color'>";
        for (var i = 0; i < list.length; i++) {
          strHtml +=
            "<div style='width:" +
            width +
            ';height:12px;background-color:' +
            list[i].color +
            ";float:left;'></div>";
        }
        strHtml += '</div>';
        strHtml += "<div class='lgd_label'>";
        if (list.length < 16) {
          if (flag === 1 && funItemMenuId === '1151302041') {
            for (var _i = 0; _i < list.length; _i++) {
              var name = list[_i].name;
              strHtml +=
                "<div style='width:" +
                width +
                ";float:left;font-size:12px;text-align:right;'>" +
                (name / 100).toFixed(2) +
                '</div>';
            }
          } else {
            for (var _i2 = 0; _i2 < list.length; _i2++) {
              var _name = list[_i2].name;
              strHtml +=
                "<div style='width:" +
                width +
                ";float:left;font-size:12px;text-align:right;'>" +
                _name +
                '</div>';
            }
          }
        } else {
          if (flag === 1 && funItemMenuId === '1151302041') {
            for (var _i3 = 1; _i3 < list.length; _i3 = _i3 + 4) {
              var _name2 = list[_i3].name;
              strHtml +=
                "<div style='width:" +
                4 * parseInt(width) +
                "px;float:left;font-size:12px;text-align:right;'>" +
                (_name2 / 100).toFixed(2) +
                '</div>';
            }
          } else {
            for (var _i4 = 2; _i4 < list.length; _i4 = _i4 + 3) {
              var _name3 = list[_i4].name;
              strHtml +=
                "<div style='width:" +
                3 * parseInt(width) +
                "px;float:left;font-size:12px;text-align:right;'>" +
                _name3 +
                '</div>';
            }
          }
        }
        strHtml += '</div></div>';
        if (flag === 1) {
          $('.lgd_soli').empty();
          $('.lgd_soli').append(strHtml);
        } else if (flag === 2) {
          $('.lgd_sk').empty();
          $('.lgd_sk').append(strHtml);
        } else if (flag === 3) {
          $('.lgd_fcst').empty();
          $('.lgd_fcst').append(strHtml);
          $('.lgd_fcst').show();
        }
      }

      function setDataRange(result) {
        globalParam.spiltList = [];
        var list = result.list;
        var len = list.length;
        for (var i = 0; i < len; i++) {
          var obj = {};
          var rule = list[i].rule;
          var arrRule = rule.split(',');
          var start = arrRule[0];
          var end = arrRule[1];
          if (start == '') {
            obj.end = Number(end);
            obj.color = list[i].color;
          }
          if (end == '') {
            obj.start = Number(start);
            obj.color = list[i].color;
          }
          if (start != '' && end != '') {
            obj.start = Number(start);
            obj.end = Number(end);
            obj.color = list[i].color;
          }
          globalParam.spiltList.push(obj);
        }
      }

      function setInterval(list) {
        var length = list.length;
        if (length > 0) {
          var interval = [];
          var color = [];
          for (var i = 0; i < length; i++) {
            if (list[i].name !== '') {
              interval.push(Number(list[i].name));
              color.push(list[i].color);
            }
          }
          grid.interval = interval;
          grid.color = color;
        }
      }

      /***/
    },
    /* 6 */
    /***/ function (module, exports, __webpack_require__) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true,
      });
      exports.windyshow = windyshow;
      exports.getColorFunction = getColorFunction;
      exports.segmentedColorScale = segmentedColorScale;
      exports.formateWind = formateWind;
      exports.removewind = removewind;

      var _stationPoint = __webpack_require__(1);

      var _stationPoint2 = _interopRequireDefault(_stationPoint);

      var _maphelper = __webpack_require__(0);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var velocityLayer = void 0;
      function windyshow(funitemmenuid, dateTime, province, typeCode) {
        // http://localhost:8181/webGis/img/receiveJson?timeScope=20181113160000&dataCode=NAFP_CLDAS2.0_RT_CHN_WIN_JSON
        // multiExhibition/autoStationNewTime?funItemMenuId=115990104&position=JSON&isDefault=1&timeDifference=0
        // /dataGis/multiExhibition/autoStationNewTime?funItemMenuId=115990104&position=JSON_CHN&isDefault=1&timeDifference=0
        // /dataGis/gis/getJson?funItemMenuId=115990104&dateTime=20181114170000&position=JSON_CHN

        var url =
          ctx +
          '/gis/getJson?funItemMenuId=115990104&dateTime=' +
          dateTime +
          '&position=JSON_CHN';
        removewind();
        formateWind(url);
      }

      // load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)
      function getColorFunction(legends) {
        var list = legends.list;
        var scale = [];
        var color = [];
        var data = [];

        list.forEach(function (item, index) {
          if (index == 0) {
            scale.push(0);
            var color1 = item.color;
            color1 = color1.colorRgb();
            data.push([0, color1]);
          }
          var name = +item.name;
          scale.push(+name);
          var color1 = item.color;
          color1 = color1.colorRgb();
          data.push([+name, color1]);
        });

        var color2 = segmentedColorScale(data);

        return function (value) {
          return color2(value, 180);
        };
      }

      String.prototype.colorRgb = function () {
        var sColor = this.toLowerCase();
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
          if (sColor.length === 4) {
            var sColorNew = '#';
            for (var i = 1; i < 4; i += 1) {
              sColorNew += sColor
                .slice(i, i + 1)
                .concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
          }
          //处理六位的颜色值
          var sColorChange = [];
          for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
          }
          // sColorChange.push(255);
          return sColorChange;
        }
        return sColor;
      };

      function segmentedColorScale(segments) {
        var points = [],
          interpolators = [],
          ranges = [];
        for (var i = 0; i < segments.length - 1; i++) {
          points.push(segments[i + 1][0]);
          interpolators.push(
            colorInterpolator(segments[i][1], segments[i + 1][1]),
          );
          ranges.push([segments[i][0], segments[i + 1][0]]);
        }

        function colorInterpolator(start, end) {
          var r = start[0],
            g = start[1],
            b = start[2];
          var Δr = end[0] - r,
            Δg = end[1] - g,
            Δb = end[2] - b;
          return function (i, a) {
            return [
              Math.floor(r + i * Δr),
              Math.floor(g + i * Δg),
              Math.floor(b + i * Δb),
              a,
            ];
          };
        }

        function clamp(x, low, high) {
          return Math.max(low, Math.min(x, high));
        }

        function proportion(x, low, high) {
          return (clamp(x, low, high) - low) / (high - low);
        }

        return function (point, alpha) {
          var i;
          for (i = 0; i < points.length - 1; i++) {
            if (point <= points[i]) {
              break;
            }
          }
          var range = ranges[i];
          return interpolators[i](proportion(point, range[0], range[1]), alpha);
        };
      }

      function formateWind(url) {
        $.ajax({
          //	        url : "http://image.data.cma.cn/test20180906/json2.json",
          url: url,
          // 		    url:ctxStatic+'/ultra/js/gis2/wind-global.json',
          type: 'get',
          dataType: 'json',
          // dataType: 'jsonp',
          // jsonp:'callback',
          // jsonpCallback:"mytest",
          success: function success(data) {
            // data = (new Function(){})

            if (data && data.DS && data.DS.content) {
              data = new Function('return ' + data.DS.content)();
            } else {
              return;
            }

            $.ajax({
              url:
                ctx +
                '/multiExhibition/getLegend?funItemMenuId=115990104&position=Gis',
              type: 'get',
              dataType: 'json',
              success: function success(result) {
                var getColor = function getColor(value) {
                  return '';
                };
                // data = jQuery.parseJSON(data);
                velocityLayer = L.velocityLayer({
                  displayValues: true,
                  colorScalar: getColor,
                  displayOptions: {
                    velocityType: 'Wind',
                    displayPosition: 'bottomleft',
                    displayEmptyString: 'No wind data',
                  },
                  data: data,
                  // maxVelocity: 16, //粒子的最大速度
                  velocityScale: 0.02, //风速的尺度  || 粒子尾巴长度
                  particleAge: 40, //一个粒子在再生前绘制的最大帧数
                  lineWidth: 1, //线条宽度
                  particleMultiplier: 1 / 800, //粒子密度
                  frameRate: 18, //每秒所需帧数
                  colorScale: [
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                    '#fff',
                  ],
                });
                _maphelper.maphelper.map.addLayer(velocityLayer);
              },
            });
          },
        });
      }

      function removewind() {
        if (velocityLayer != null && typeof velocityLayer != 'undefined') {
          _maphelper.maphelper.map.removeLayer(velocityLayer);
        }
        if (_stationPoint2.default.img) {
          _stationPoint2.default.img.changeUrl(
            ctx + '/ultra/img/gis/me_noProduct.png',
            0,
          );
        }
      }

      /***/
    },
    /* 7 */
    /***/ function (module, exports, __webpack_require__) {
      'use strict';

      var _maphelper = __webpack_require__(0);

      var _common = __webpack_require__(2);

      var _stationPoint = __webpack_require__(1);

      var _stationPoint2 = _interopRequireDefault(_stationPoint);

      var _colormap = __webpack_require__(5);

      var _windutil = __webpack_require__(6);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var sktimeline = {};
      /**
       * @author: giscafer ,https://github.com/giscafer
       * @date: 2019-6-8 18:42:21
       * @description: 气象数据综合展示平台，https://xiaozhuanlan.com/webgis
       */

      $(function () {
        $('#map').css('height', window.innerHeight + 'px');
        // 初始化地图
        _common.common.initMap();
        _stationPoint2.default.getLastTime(globalParam.staid, 'Img', 1, 0);
        _stationPoint2.default.initSKImg();
        // radarSata.initRadarSata();
        _stationPoint2.default.drawArea(80, 104, 36.5); //画一个范围占位
        _stationPoint2.default.initStaEchart();
        // 图层工具事件处理
        $('#mapSwitch,#mapSwitchTooltip').hover(
          function (e) {
            $('#mapSwitchTooltip').show();
          },
          function () {
            $('#mapSwitchTooltip').hide();
          },
        );

        // 图层切换
        $('#mapSwitchTooltip span.text').click(function (e) {
          var target = e.target;
          var mapType = target.getAttribute('data-type');
          _maphelper.maphelper.switchMap(mapType);
          $('.img_' + mapType).attr('src', './images/' + mapType + '_blue.png');
          $('span[data-type = "' + mapType + '"]').css('color', '#5c93ff');
          if (mapType === 'topographic') {
            $('.img_political').attr('src', './images/political.png');
            $('.img_satellite').attr('src', './images/satellite.png');
            $('span[data-type = "political"]').css('color', '#666666');
            $('span[data-type = "satellite"]').css('color', '#666666');
          } else if (mapType === 'satellite') {
            $('.img_political').attr('src', './images/political.png');
            $('.img_topographic').attr('src', './images/topographic.png');
            $('span[data-type = "political"]').css('color', '#666666');
            $('span[data-type = "topographic"]').css('color', '#666666');
          } else if (mapType === 'political') {
            $('.img_satellite').attr('src', './images/satellite.png');
            $('.img_topographic').attr('src', './images/topographic.png');
            $('span[data-type = "topographic"]').css('color', '#666666');
            $('span[data-type = "satellite"]').css('color', '#666666');
          }
        });

        // 右上角工具
        // 图层工具事件处理
        $('#sk,#skmenu').hover(
          function (e) {
            $('#skmenu').show();
          },
          function () {
            $('#skmenu').hide();
          },
        );
      });

      //实况气温、气压、湿度、风、降水切换处理逻辑
      $('.menuList li').on('click', function () {
        if (!$(this).hasClass('lsel')) {
          var clickShow = function clickShow() {
            $('.typhoonBox').show(); //排名显示
            $('.zhezhao').hide(); //遮罩隐藏
            $('.stationBox').hide();
            $('.loadding1').show();
            $('.loadding2').show();
            $('#me_lineGraph').empty();
            $('#me_timeCompare').empty();
            _stationPoint2.default.currPoint = null;
            $('.typhoonBox').show();
          };

          globalParam.skChecked = true;
          //begin
          sktimeline.selType = 'sk';
          sktimeline.dataMap = {};

          sktimeline.times = _stationPoint2.default.datetime;
          //end

          globalParam.skId = $(this).attr('id');
          $('.menuList li').removeClass('active');
          $(this).addClass('active');

          _stationPoint2.default.clearEchartPoint();
          $('.menu2').hide();
          if ($('#fcst').hasClass('sel')) {
            $('#fcst').removeClass('sel');
            $('#fcst').attr('style', '');
            $('.fcstList li').removeClass('active');
            $('.lgd_fcst').hide();
          }

          globalParam.staid = $(this).attr('id');

          if (globalParam.staid == '115990101') {
            //气温
            //$(".skright").css("display","block");
            $('.typhoonBox').show();
            $('.zhezhao').hide(); //遮罩隐藏
            clickShow();
          } else if (globalParam.staid == '115990103') {
            //相对湿度
            //				$(".typhoonBox").show();
            //				$(".zhezhao").hide();//遮罩隐藏
            clickShow();
          } else if (globalParam.staid == '1150101020') {
            //降水

            clickShow();
          } else if (globalParam.staid == '115990102') {
            //气压

            clickShow();
            // document.getElementById("rainFalls").style.display = "none";
            // document.getElementById("windBig").style.display = "none";
          } else if (globalParam.staid == '115990104') {
            //风
            clickShow();
          }

          globalParam.staid = $(this).attr('id');
          if (globalParam.staid === '115990104') {
            (0, _colormap.getLegend)(globalParam.staid, 'Gis', 2);
            _stationPoint2.default.getLastTime(
              globalParam.staid,
              'JSON_CHN',
              1,
              0,
            );
            (0, _windutil.windyshow)(
              globalParam.staid,
              _stationPoint2.default.datetime,
            );
          } else {
            _stationPoint2.default.getLastTime(globalParam.staid, 'Img', 1, 0);
            (0, _colormap.getColorMap)(
              _stationPoint2.default.productCode,
              _stationPoint2.default.datetime,
            );
            (0, _colormap.getLegend)(globalParam.staid, 'Gis', 2);
            $('.lgd_sk').show();

            if (globalParam.clickFlag) {
              if (globalParam.clickFlag) {
                //有80km范围

                _stationPoint2.default.clearEchartPoint();
                _stationPoint2.default.getAreaSta(
                  globalParam.skId,
                  globalParam.lngOf80km,
                  globalParam.latOf80km,
                  _stationPoint2.default.datetime,
                  true,
                );
              }
              if (_stationPoint2.default.currPoint != null) {
                var station = _stationPoint2.default.currPoint;
                _stationPoint2.default.getStationDetail(
                  globalParam.staid,
                  station.staId,
                  station.staName,
                  station.lon,
                  station.lat,
                  station.lev,
                );
              }
            } else {
              if ($('.staBtn').hasClass('staChecked')) {
                if (_stationPoint2.default.bcircle != null) {
                  _stationPoint2.default.clearArea();
                }
                $('.skright').hide();
                if (globalParam.provinceFocus) {
                  _stationPoint2.default.getPoint2(
                    globalParam.staid,
                    _stationPoint2.default.datetime,
                    globalParam.provinceFocusId,
                    '1',
                  );
                } else {
                  _stationPoint2.default.getPoint2(
                    globalParam.staid,
                    _stationPoint2.default.datetime,
                    '1000',
                  );
                }
              }
            }
          }

          globalParam.elename = $(this).text();
          globalParam.unit = $(this).attr('unit');
          $('.me_eleName').text(
            globalParam.elename + '(' + globalParam.unit + ')',
          );
          $('.menuList').addClass('off');
          $('.staPointDiv').show();
          $('.staPointDiv').prev().show();
          $('.sebanDiv').show();
          $('.sebanDiv').prev().show();
          $('#sk').addClass('sel');
          $('.stationBox').hide();
          $('#sk').addClass('active');

          if (globalParam.tuliFlag) {
            $('.legend').show();
            if ($('.tuli').hasClass('lgd_hide')) {
              $('.legend').show();
              $('.tuli').removeClass('lgd_hide');
              $('.tuli').addClass('lgd_show');
            } else {
              $('.legend').show();
            }
          }
        } else {
          globalParam.skChecked = false;
          //移除图片
          _stationPoint2.default.img.changeUrl('./images/me_noProduct.png', 0);
          //移除站点
          _stationPoint2.default.clearEchartPoint();
          // removewind();
          $('.stationBox').hide();
          var lseArray = $('.lsel');
          if (lseArray.length == 0) {
            $('#sk').removeClass('sel');
            $('#sk').removeClass('active');
            $('.menuList').addClass('off');
          }
          //重新初始化要素
          globalParam.staid = '115990101';
          globalParam.elename = '气温';
          globalParam.unit = '℃';
        }
      });

      /***/
    },
    /******/
  ],
);
