var page = {
  id: 'daiban_list',
  count: 0,
  /**
   * 获取数据
   * @param {Object} param
   */
  getData: function(param) {
    util.get({
      url: util.restAddress + '?service=QUERY_UNDERWAY_TASK_LIST&userid=SYSTEM&password=1&imei=1&sim=18932482046&version=1.0',
      data: param,
      async: false,
      succFn: function(data) {
        console.log(data)
        data = JSON.parse(data);
        page.initHtml(data.data_array);

      }
    })
  },
  /**
   * 页面初始化
   */
  init: function() {

    mui.init({
      swipeBack: false,
      pullRefresh: {
        container: '#pullrefresh',
        down: {
          style: 'circle',
          offset: '50px',
          callback: page.pulldownRefresh //下拉刷新具体业务实现
        }
      }
    });
    page.getData({});

  },
  /**
   * 初始化HTML
   * @param {Object} data
   */
  initHtml: function(data) {

    var tmpl, info,
      ul = util.id('ul_daiban_list'),
      tmpl_Ary = '';

    for(var i = 0; i < data.length; i++) {
      info = data[i];
      tmpl = '<li class="mui-table-view-cell" data="'+info.BT+'"><a href="" class="mui-navigate-right"><div class="oa-contact-content"><div class="mui-clearfix"><p class="ul-li-title">' + info.BT + '</p></div><div class="mui-clearfix"><p class="p_inline_block p_left"><span class="iconfont icon-gengduo"></span>' + info.BZMC + '</p><p class="p_inline_block">' + info.BZQX + '</p></div></div></a></li>';
      tmpl_Ary += tmpl;
    }
    ul.innerHTML = tmpl_Ary;
    page.initEvent()
  },
  /**
   * 初始化点击事件
   */
  initEvent: function() {
    var me,
      cell = util.className('mui-table-view-cell'),
      search_btn = util.id('search_btn'),
      search_ipt = util.id('search_ipt');

    for(var a = 0; a < cell.length; a++) {
      me = cell[a];
      me.addEventListener('tap', function() {
        console.log(me)
      });
    }

    search_btn.addEventListener('tap', function() {

    	for(var i =0; i < cell.length; i++){
    		var me = cell[i];
    		var data = me.getAttribute('data');

    		if(data.indexOf(search_ipt.value) < 0 ){
    			util.addClass(me,'d_none');
    		}else{
    			util.removeClass(me,'d_none');
    		}
    	}
      
    })
  },
  pulldownRefresh: function() {
    setTimeout(function() {
      page.getData({})
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
      mui.toast('下拉刷新成功');
    }, 1000);
  }
}

page.init();