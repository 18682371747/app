var page = {
  getData: function(param) {
    util.get({
      url: util.restAddress + '?service=SEARCH_CONTACT_LIST&userid=SYSTEM&password=1&imei=1&sim=18932482046&version=1.0',
      data: param,
      async: false,
      succFn: function(data) {
        data = JSON.parse(data);
        page.initHtml(data.data_array);

      }
    })
  },
  initHtml: function(data) {
		console.log(data.length)
    var tmpl, info,
      ul = util.id('tongxunlu'),
      tmpl_Ary = '';

    for(var i = 0; i < data.length; i++) {
      info = data[i];
      tmpl = '<li class="mui-table-view-cell"><div class="mui-slider-cell"><div class="oa-contact-cell mui-table"><div class="oa-contact-avatar mui-table-cell"><img src="../images/60x60.gif" /></div><div class="oa-contact-content mui-table-cell"><div class="mui-clearfix"><h4 class="oa-contact-name">' + info.YHMC + '</h4><span class="oa-contact-position mui-h6">' + info.ZZJC + '</span></div><p class="oa-contact-email mui-h6">' + info.YHSJ + '</p></div></div></div></li>';
      tmpl_Ary += tmpl;
    }
    ul.innerHTML = tmpl_Ary;
    page.initEvent()
  },
  initEvent: function() {
    var me,
    	cell = util.className('mui-table-view-cell');
    for(var a = 0; a < cell.length; a++) {
    	me = cell[a];
      me.addEventListener('tap', function() {
        console.log(me)
      });
    }
  }
}
page.getData({});