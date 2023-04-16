var timeline = timeline || {};
timeline.sataDataIndex = 0;
timeline.isSatePlay = 0;
timeline.sss = 0;

timeline.initPalay = function (fn, sataData) {
  $('.jindu li').html('');
  $('.jindu li').attr('class', '');
  for (var i = 0; i < 10; i++) {
    $('#' + i).addClass('pros');
  }
  $('#10').addClass('psel');
  $('#10').html("<img src='" + ctxStatic + "/ultra/img/gis/psel.png'/>");
  $('#playBtn').unbind();
  $('#playBtn').click(function () {
    if ($(this).hasClass('play')) {
      if ($('#radar').hasClass('sel')) {
        timeline.startPage(1000);
      } else {
        timeline.startPage(800);
      }

      if (timeline.sataDataIndex == 1) {
        $('.jindu li').attr('class', '');
        $('.jindu li').html('');
        $('#0').addClass('psel');
        $('#0').html("<img src='" + ctxStatic + "/ultra/img/gis/psel.png'/>");
      }
      $(this).removeClass('play');
      $(this).addClass('paush');
    } else {
      timeline.pause();
      $(this).removeClass('paush');
      $(this).addClass('play');
    }
  });
  $('.nex').unbind();
  $('.nex').click(function () {
    $('.jindu li').html('');
    $('.pros').removeClass('pros');
    $('.psel').removeClass('psel');
    timeline.sataDataIndex--;
    if (timeline.sataDataIndex <= 0) {
      timeline.sataDataIndex = sataData.length;
    }
    for (var i = 0; i <= sataData.length - timeline.sataDataIndex; i++) {
      if (i < sataData.length - timeline.sataDataIndex) {
        $('#' + i).removeClass('psel');
        $('#' + i).addClass('pros');
      } else {
        $('#' + i).removeClass('psel');
        $('#' + i).addClass('pros');
        $('#' + (i + 1)).addClass('psel');
        $('#' + (i + 1)).html(
          "<img src='" + ctxStatic + "/ultra/img/gis/psel.png'/>",
        );
      }
    }
    fn();
  });
  $('.pre').unbind();
  $('.pre').click(function () {
    $('.jindu li').html('');
    $('.pros').removeClass('pros');
    $('.psel').removeClass('psel');
    timeline.sataDataIndex++;
    if (timeline.sataDataIndex > sataData.length) {
      timeline.sataDataIndex = 1;
    }
    for (var i = 0; i <= sataData.length - timeline.sataDataIndex + 1; i++) {
      if (i < sataData.length - timeline.sataDataIndex + 1) {
        $('#' + i).removeClass('psel');
        $('#' + i).addClass('pros');
      } else {
        $('#' + i).addClass('psel');
        $('#' + i).html(
          "<img src='" + ctxStatic + "/ultra/img/gis/psel.png'/>",
        );
      }
    }
    fn();
  });
};

timeline.startPage = function (checkValue) {
  window.clearInterval(timeline.sss);
  timeline.sss = window.setInterval(timeline.player, checkValue);
};

timeline.player = function () {
  timeline.isSatePlay = 0;
  if (radarSata.sataData && radarSata.sataData.length > 0) {
    var index = radarSata.sataData.length;
    //第几个展开
    var id = timeline.sataDataIndex;
    $('.jindu li').html('');
    $('.pros').removeClass('pros');
    $('.psel').removeClass('psel');
    if (timeline.sataDataIndex <= 1) {
      timeline.sataDataIndex = index;
    } else {
      timeline.sataDataIndex = id - 1;
    }
    for (var i = 0; i <= index - timeline.sataDataIndex + 1; i++) {
      if (i < index - timeline.sataDataIndex + 1) {
        $('#' + i).removeClass('psel');
        $('#' + i).addClass('pros');
      } else {
        $('#' + i).addClass('psel');
        $('#' + i).html(
          "<img src='" + ctxStatic + "/ultra/img/gis/psel.png'/>",
        );
      }
    }
    radarSata.changeByTime();
  }
};

timeline.pause = function () {
  timeline.isSatePlay = 1;
  window.clearInterval(timeline.sss);
};

window.timeline = timeline;
export default timeline;
