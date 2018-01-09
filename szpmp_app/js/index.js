(function() {
  mui.init({
    swipeBack: true //启用右滑关闭功能
  });
  mui.plusReady(function() {
    var self = plus.webview.currentWebview(),
      leftPos = Math.ceil((window.innerWidth - 60) / 2); // 设置凸起大图标为水平居中

    /**	
     * drawNativeIcon 绘制带边框的半圆，
     * 实现原理：
     *   id为bg的tag 创建带边框的圆
     *   id为bg2的tag 创建白色矩形遮住圆下半部分，只显示凸起带边框部分
     * 	 id为iconBg的红色背景图
     *   id为icon的字体图标
     *   注意创建先后顺序，创建越晚的层级越高
     */
    var drawNativeIcon = util.drawNative('icon', {
      bottom: '5px',
      left: leftPos + 'px',
      width: '60px',
      height: '60px'
    }, [{
      tag: 'rect',
      id: 'bg',
      position: {
        top: '1px',
        left: '0px',
        width: '100%',
        height: '100%'
      },
      rectStyles: {
        color: '#fff',
        radius: '50%',
        borderColor: '#ccc',
        borderWidth: '1px'
      }
    }, {
      tag: 'rect',
      id: 'bg2',
      position: {
        bottom: '-0.5px',
        left: '0px',
        width: '100%',
        height: '45px'
      },
      rectStyles: {
        color: '#fff'
      }
    }, {
      tag: 'rect',
      id: 'iconBg',
      position: {
        top: '5px',
        left: '5px',
        width: '50px',
        height: '50px'
      },
      rectStyles: {
        color: '#d74b28',
        radius: '50%'
      }
    }, {
      tag: 'font',
      id: 'icon',
      text: '\ue600', //此为字体图标Unicode码'\e600'转换为'\ue600'
      position: {
        top: '0px',
        left: '5px',
        width: '50px',
        height: '100%'
      },
      textStyles: {
        fontSrc: '_www/fonts/iconfont.ttf',
        align: 'center',
        color: '#fff',
        size: '30px'
      }
    }]);
    // append 到父webview中
    self.append(drawNativeIcon);

    //自定义监听图标点击事件
    var active_color = '#fff';
    drawNativeIcon.addEventListener('click', function(e) {
      mui.alert('你点击了图标，你在此可以打开摄像头或者新窗口等自定义点击事件。', '悬浮球点击事件');
      // 重绘字体颜色
      if(active_color == '#fff') {
        drawNativeIcon.drawText('\ue600', {}, {
          fontSrc: '_www/fonts/iconfont.ttf',
          align: 'center',
          color: '#000',
          size: '30px'
        }, 'icon');
        active_color = '#000';
      } else {
        drawNativeIcon.drawText('\ue600', {}, {
          fontSrc: '_www/fonts/iconfont.ttf',
          align: 'center',
          color: '#fff',
          size: '30px'
        }, 'icon');
        active_color = '#fff';
      }

    });
    // 中间凸起图标绘制及监听点击完毕

    var goto_page = util.className('goto_page');
		//代办任务点击事件
    goto_page[0].addEventListener('click', function(e) {
				plus.webview.open('html/daiban_list.html', 'page_daiban_list', {}, 'slide-in-right', 200);
    })
    //项目工程审批点击事件
    goto_page[1].addEventListener('click', function(e) {

        util.prompt('点击')

    })
    //通知公告
    goto_page[2].addEventListener('click', function(e) {

        util.prompt('点击')

    })

    // 创建子webview窗口 并初始化
    var aniShow = {};
    util.initSubpage(aniShow);

    var nview = plus.nativeObj.View.getViewById('tabBar'),
      activePage = plus.webview.currentWebview(),
      targetPage,
      subpages = util.options.subpages,
      pageW = window.innerWidth,
      currIndex = 0;

    /**
     * 根据判断view控件点击位置判断切换的tab
     */
    nview.addEventListener('click', function(e) {
      var clientX = e.clientX;
      if(clientX > 0 && clientX <= parseInt(pageW * 0.25)) {
        currIndex = 0;
      } else if(clientX > parseInt(pageW * 0.25) && clientX <= parseInt(pageW * 0.45)) {
        currIndex = 1;
      } else if(clientX > parseInt(pageW * 0.45) && clientX <= parseInt(pageW * 0.8)) {
        currIndex = 2;
      } else {
        currIndex = 3;
      }
      // 匹配对应tab窗口	
      if(currIndex > 0) {
        targetPage = plus.webview.getWebviewById(subpages[currIndex]);
      } else {
        targetPage = plus.webview.currentWebview();
      }

      if(targetPage == activePage) {
        return;
      }

      if(currIndex === 2) {
        //打开新窗口
        plus.webview.open('html/new-webview.html', 'new', {}, 'slide-in-right', 200);
      } else {
        //底部选项卡切换
        util.toggleNview(currIndex);
        // 子页面切换
        util.changeSubpage(targetPage, activePage, aniShow);
        //更新当前活跃的页面
        activePage = targetPage;

      }
    });

    var modelPage = {
      /**
       * 初始化页面
       */
      initPage: function() {
        var me = modelPage,
          data = [{
            img: 'images/4.jpg'
          }, {
            img: 'images/1.jpg'
          }, {
            img: 'images/2.jpg'
          }, {
            img: 'images/3.jpg'
          }, {
            img: 'images/4.jpg'
          }]
        me.initGallery(data);
        me.initScroll();
      },
      /**
       * 初始化图片轮询组件
       * @param {Object} data
       */
      initGallery: function(data) {
        var slider_img_html = '',
          slider_img_list = util.id('slider_img_list'),
          tmpl, dataInfo;

        for(var i = 0; i < data.length; i++) {
          tmpl = '';
          dataInfo = data[i];
          if(i == 0) {
            slider_img_html += '<div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="' + dataInfo.img + '"></a></div>'
          }
          tmpl = '<div class="mui-slider-item"><a href="#"><img src="' + dataInfo.img + '"></a></div>';
          slider_img_html += tmpl;

          if(i == dataInfo.length - 1) {
            slider_img_html += '<div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="' + dataInfo.img + '"></a></div>'
          }

        }

        slider_img_list.innerHTML = slider_img_html;

        mui(".mui-slider").slider({
          interval: 3000
        });
      },
      /**
       * 初始化页面滚动条
       */
      initScroll: function() {
        mui('.mui-scroll-wrapper').scroll({
          deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
      }

    }
    //页面初始化
    modelPage.initPage();

  });
})();