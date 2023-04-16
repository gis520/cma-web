/*
 * jquery extend
 *
 * author hitec_wenty
 */

jQuery.fn.extend({
  check: function () {
    return this.each(function () {
      if (parseFloat($.fn.jquery) < 1.7) this.checked = 'checked';
      else this.checked = true;
    });
  },
  uncheck: function () {
    return this.each(function () {
      if (parseFloat($.fn.jquery) < 1.7) this.checked = 'checked';
      else this.checked = false;
    });
  },
  able: function () {
    return this.each(function () {
      jQuery(this).attr({ disabled: false });
    });
  },
  disable: function () {
    return this.each(function () {
      jQuery(this).attr({ disabled: true });
    });
  },
  loading: function (msg) {
    var html =
      '<div class="loading-div"><span style=""><img src="' +
      $basePath +
      '/images/loading/045.gif">' +
      msg +
      '<br></span></div>';
    return this.each(function () {
      jQuery(this).children().hide();
      jQuery(this).append(html);
      jQuery(this)
        .find('.loading-div')
        .css({
          height: jQuery(this).height(),
          'line-height': jQuery(this).height() / 2 + 'px',
          'text-align': 'center',
        });
    });
  },
  easyuiLoading: function (msg, action) {
    jQuery(this).easyuiLoadingEnd().css('position', 'relative');
    var html =
      '<div class="easyui-loading-div" style="display: block;z-index:99999" title="点击取消">' +
      '<div class="datagrid-mask" style="display: block;"></div>' +
      '<div nowrap class="datagrid-mask-msg" style="display:inline;font-size:12px;cursor:pointer;left:0px;">' +
      '<span class="datagrid-mask-text" style="color:red">0 s</span>' +
      msg +
      '</div></div>';
    return this.each(function () {
      var ele = jQuery(this);
      ele.append(html);
      ele.data('time', 0);
      ele.data('action', action);
      var timer = setInterval(function () {
        var time = parseInt(ele.data('time'));
        time++;
        ele.data('time', time);
        ele.find('.datagrid-mask-text').text(time + 's');
      }, 1000);
      ele.data('timer', timer);
      ele.find('.datagrid-mask').css({
        height: ele.height(),
        width: ele.width(),
      });
      var msgdiv = ele.find('.datagrid-mask-msg');
      var left = (ele.width() - msgdiv.width()) / 2;
      left = left > 10 ? left - 10 : left;
      msgdiv
        .css({
          top: (ele.height() - msgdiv.width()) / 2,
          left: left,
        })
        .click(function () {
          ele.easyuiLoadingEnd();
        });
    });
  },
  easyuiLoadingEnd: function (msg) {
    return this.each(function () {
      clearInterval(jQuery(this).data('timer'));
      var action = jQuery(this).data('action');
      if (action != null && action) {
        action.abort();
      }
      jQuery(this).find('.easyui-loading-div').remove();
    });
  },
  unloading: function () {
    return this.each(function () {
      jQuery(this).children().show();
      jQuery(this).find('.loading-div').remove();
    });
  },
  template: function (params) {
    return this.each(function () {
      var html = jQuery(this).html();
      var render = template.compile(html);
      html = render(params);
      jQuery(this).html(html);
    });
  },
  params: function (formData) {
    if (formData == undefined) {
      var arr = jQuery(this).serializeArray();
      var params = {};
      $(arr).each(function (n, v) {
        params[v.name] = v.value;
      });
      return params;
    } else {
      var $form = jQuery(this);
      var $eles = $form.find('[name]');
      $.each($eles, function (i, ele) {
        try {
          //					$(ele).val(v);
          var $ele = $(ele);
          var name = $ele.attr('name');
          var names = name.split('.');
          var v = formData[names[0]];
          if (v == null || v == 'null' || v == undefined) {
            return true;
          }
          if (names.length > 1) {
            for (var i = 1; i < names.length; i++) {
              v = v[names[i]];
            }
          }
          if ($ele.attr('formatter') != undefined) {
            v = eval($ele.attr('formatter') + "('" + v + "')");
          }
          if ($ele.is(':radio')) {
            $ele.filter("[value='" + v + "']").check();
          } else if ($ele.is(':checkbox')) {
            $ele.val(v);
          } else {
            $ele.val(v);
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
  },
});
jQuery.extend({
  //
  init: function (fn) {
    var fns = $(window).data('jQuery.fns');
    if (fns == null) {
      fns = [];
      $(window).load(function () {
        $($(window).data('jQuery.fns')).each(function (i, fn) {
          if (typeof fn == 'function') fn();
        });
      });
    }
    fns.push(fn);
    $(window).data('jQuery.fns', fns);
  },

  //XML
  getXML: function (_url, callback, errorcall) {
    return $.ajax({
      type: 'GET',
      url: _url,
      dataType: 'xml',
      success: function (xml) {
        var _xml;
        if (jQuery.browser.msie && typeof xml == 'string') {
          _xml = new ActiveXObject('Microsoft.XMLDOM');
          _xml.async = false;
          _xml.loadXML(xml);
        } else {
          _xml = xml;
        }

        var $xml = $(_xml);

        callback($xml);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $.holdReady(false);
        if (errorcall && $.isFunction(errorcall))
          errorcall(XMLHttpRequest, textStatus, errorThrown);
      },
    });
  },

  //下载
  loadFile: function (action, params, target) {
    var $iframe = $('#jquery_download_hide_frame');
    if ($iframe.size() == 0) {
      $iframe = $('<iframe>', {
        id: 'jquery_download_hide_frame',
        name: 'jquery_download_hide_frame',
      })
        .hide()
        .appendTo($('body'));
    }
    var $form = $('<form>', {
      method: 'post',
      style: 'display:none;',
      target: target ? target : 'jquery_download_hide_frame',
      action: action,
    });
    if (typeof params == 'undefined') params = {};
    $.each(params, function (key, val) {
      $('<input>')
        .attr({
          type: 'text',
          name: key,
        })
        .val(val)
        .appendTo($form);
    });
    $form.appendTo($('body')).submit().remove();
    //		$iframe.remove();
  },

  //
  //prefn
  wait: function (prefn, fn, val) {
    new waitLoading(
      function () {
        if (prefn.call() != true) return false;

        if (fn && $.isFunction(fn)) fn.call();
        return true;
      },
      val ? val : 1,
    );
  },
  getUrlParam: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  jsonToString: function (obj) {
    var THIS = this;
    switch (typeof obj) {
      case 'string':
        return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
      case 'array':
        return '[' + obj.map(THIS.jsonToString).join(',') + ']';
      case 'object':
        if (obj instanceof Array) {
          var strArr = [];
          var len = obj.length;
          for (var i = 0; i < len; i++) {
            strArr.push(THIS.jsonToString(obj[i]));
          }
          return '[' + strArr.join(',') + ']';
        } else if (obj == null) {
          return 'null';
        } else {
          var string = [];
          for (var property in obj)
            string.push(
              THIS.jsonToString(property) +
                ':' +
                THIS.jsonToString(obj[property]),
            );
          return '{' + string.join(',') + '}';
        }
      case 'number':
        return obj;
      case false:
        return obj;
    }
  },
  //remote ajax
  /**
   * rurl : 远程url,
   * method: 远程调用方法 POST or GET
   * params: 远程调用参数(json)
   * callback: 回调函数(结果)
   */
  remoteAjax: function (rurl, method, params, callback, errorcall) {
    return $.ajax({
      type: 'POST',
      url: 'remoteAjax.json',
      data: { url: rurl, method: method, params: $.jsonToString(params) },
      dataType: 'json',
      success: function (json) {
        try {
          json = jQuery.parseJSON(json);
        } catch (e) {}
        callback(json);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $.holdReady(false);
        if (errorcall && $.isFunction(errorcall))
          errorcall(XMLHttpRequest, textStatus, errorThrown);
      },
    });
  },
  parseDate: function (dateStr, dateFormat) {
    var date = new Date();
    var o = {
      'y+': function (year) {
        date.setFullYear(year);
      },
      'M+': function (month) {
        date.setMonth(month - 1);
      }, //month
      'd+': function (day) {
        date.setDate(day);
      }, //day
      'H+': function (hours) {
        date.setHours(hours);
      }, //hour
      'm+': function (minutes) {
        date.setMinutes(minutes);
      }, //minute
      's+': function (seconds) {
        date.setSeconds(seconds);
      }, //second
      //			"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
      S: function (milliseconds) {
        date.setMilliseconds(milliseconds);
      }, //millisecond
    };
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(dateFormat)) {
        var s1 = RegExp.$1;
        var len = s1.length;
        var ind = dateFormat.indexOf(s1, 0);
        if (dateStr != undefined) {
          var num = dateStr.substr(ind, len);
          num = parseInt(num, 10);
          if (num != NaN) {
            o[k](num);
          } else {
            console.log('解析[' + s1 + ']错误!');
          }
        }
      }
    }
    return date;
  },
  html5: function () {
    return typeof Worker != 'undefined';
  },
});

//for $.wait
var waitLoading = function () {
  this.constructor(arguments);
};
waitLoading.prototype = {
  _timer: null,
  call: null,
  interval: null,
  _clearTimer: function () {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  },
  constructor: function (args) {
    this.call = args[0];
    this.interval = args[1];
    this.wait();
  },
  wait: function () {
    //setTimeout
    this._clearTimer();
    var $this = this;
    if (this.call && $.isFunction(this.call) && this.call() != true) {
      this._timer = setTimeout(function () {
        $this.wait();
      }, this.interval);
    }
  },
};

//img naturalWidth,naturalHeight
//Example usage:
//var
//nWidth = $('img#example').naturalWidth(),
//nHeight = $('img#example').naturalHeight();
(function ($) {
  var props = ['Width', 'Height'],
    prop;

  while ((prop = props.pop())) {
    (function (natural, prop) {
      $.fn[natural] =
        natural in new Image()
          ? function () {
              return this[0][natural];
            }
          : function () {
              var node = this[0],
                img,
                value;

              if (node.tagName.toLowerCase() === 'img') {
                img = new Image();
                (img.src = node.src), (value = img[prop]);
              }
              return value;
            };
    })('natural' + prop, prop.toLowerCase());
  }
})(jQuery);
jQuery.cookie = function (name, value, options) {
  if (typeof value != 'undefined') {
    options = options || {};
    if (value === null) {
      value = '';
      options = $.extend({}, options);
      options.expires = -1;
    }
    var expires = '';
    if (
      options.expires &&
      (typeof options.expires == 'number' || options.expires.toUTCString)
    ) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString();
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [
      name,
      '=',
      encodeURIComponent(value),
      expires,
      path,
      domain,
      secure,
    ].join('');
  } else {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) == name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};

String.prototype.startWith = function (str) {
  var reg = new RegExp('^' + str);
  return reg.test(this);
};
String.prototype.endWith = function (str) {
  var reg = new RegExp(str + '$');
  return reg.test(this);
};
String.prototype.contains = function (str) {
  return this.indexOf(str) > -1;
};
String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};
Date.prototype.format = function (format) {
  var o = {
    'M+': this.getMonth() + 1, //month
    'd+': this.getDate(), //day
    'H+': this.getHours(), //hour
    'm+': this.getMinutes(), //minute
    's+': this.getSeconds(), //second
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds(), //millisecond
  };
  if (format.indexOf('T')) {
    format = format.replace('T', ' ');
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }
  return format;
};
