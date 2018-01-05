var util = {
	options: {
		ACTIVE_COLOR: "#007aff",
		NORMAL_COLOR: "#000",
		subpages: ["", "html/gongZuo.html", "", "html/tongXunLu.html"]//tabs列表
	},
	restAddress: 'http://192.168.0.112:8884/WJZDNEW/invoke',//服务器地址
	/**
	 *  简单封装了绘制原生view控件的方法
	 *  绘制内容支持font（文本，字体图标）,图片img , 矩形区域rect
	 */
	drawNative: function(id, styles, tags) {
		var view = new plus.nativeObj.View(id, styles, tags);
		return view;
	},
	/**
	 * 初始化首个tab窗口 和 创建子webview窗口 
	 */
	initSubpage: function(aniShow) {
		var subpage_style = {
				top: 0,
				bottom: 51
			},
			subpages = util.options.subpages,
			self = plus.webview.currentWebview(),
			temp = {};
			
		//兼容安卓上添加titleNView 和 设置沉浸式模式会遮盖子webview内容
		if(mui.os.android) {
			if(plus.navigator.isImmersedStatusbar()) {
				subpage_style.top += plus.navigator.getStatusbarHeight();
			}
			if(self.getTitleNView()) {
				subpage_style.top += 40;
			}
			
		}

		// 初始化第一个tab项为首次显示
		temp[self.id] = "true";
		mui.extend(aniShow, temp);
		// 初始化绘制首个tab按钮
		util.toggleNview(0);

		for(var i = 0, len = subpages.length; i < len; i++) {

			if(!plus.webview.getWebviewById(subpages[i])) {
				var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
				//初始化隐藏
				sub.hide();
				// append到当前父webview
				self.append(sub);
			}
		}
	},
	/**	
	 * 点击切换tab窗口 
	 */
	changeSubpage: function(targetPage, activePage, aniShow) {
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetPage]) {
			plus.webview.show(targetPage);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetPage] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetPage, "fade-in", 300);
		}
		//隐藏当前 除了第一个父窗口
		if(activePage !== plus.webview.getLaunchWebview()) {
			plus.webview.hide(activePage);
		}
	},
	/**
	 * 点击重绘底部tab （view控件）
	 */
	toggleNview: function(currIndex) {
		currIndex = currIndex * 2;
		// 重绘当前tag 包括icon和text，所以执行两个重绘操作
		util.updateSubNView(currIndex, util.options.ACTIVE_COLOR);
		util.updateSubNView(currIndex + 1, util.options.ACTIVE_COLOR);
		// 重绘兄弟tag 反之排除当前点击的icon和text
		for(var i = 0; i < 8; i++) {
			if(i !== currIndex && i !== currIndex + 1) {
				util.updateSubNView(i, util.options.NORMAL_COLOR);
			}
		}
	},
	/*
	 * 改变颜色
	 */
	changeColor: function(obj, color) {
		obj.color = color;
		return obj;
	},
	/*
	 * 利用 plus.nativeObj.View 提供的 drawText 方法更新 view 控件
	 */
	updateSubNView: function(currIndex, color) {
		var self = plus.webview.currentWebview(),
			nviewEvent = plus.nativeObj.View.getViewById("tabBar"), // 获取nview控件对象
			nviewObj = self.getStyle().subNViews[0], // 获取nview对象的属性
			currTag = nviewObj.tags[currIndex]; // 获取当前需重绘的tag

		nviewEvent.drawText(currTag.text, currTag.position, util.changeColor(currTag.textStyles, color), currTag.id);
	},
	/**
     * 通过ID获取元素
     * id_element 为id名
     * @param {Object} id_data
     */
    id: function(id_element) {
      return document.getElementById(id_element);
    },
    /**
     * 通过Class获取元素
     * classElement 为class名
     * @param {Object} parentElement 父级元素
     * @param {Object} classElement
     */
    className: function(parentElement, classElement) {
      if(classElement == undefined) {
        return document.getElementsByClassName(parentElement);
      }
      return parentElement.getElementsByClassName(classElement);
    },
    /**
     * 通过标签获取元素
     * tagElement 为元素名
     * @param {Object} parentElement 父级元素
     * @param {Object} tagElement
     */
    tagName: function(parentElement, tagElement) {
      if(tagElement == undefined) {
        return document.getElementsByTagName(parentElement);
      }

      return parentElement.getElementsByTagName(tagElement);
    },
    /**
     * 获得当前时间
     */
    getCurrentTime: function() {
      var oDate = new Date();
      var aDate = [];
      aDate.push(oDate.getFullYear());
      aDate.push(oDate.getMonth() + 1);
      aDate.push(oDate.getDate());
      aDate.push(oDate.getHours());
      aDate.push(oDate.getMinutes());
      aDate.push(oDate.getSeconds());
      aDate.push(oDate.getDay());
      aDate.push(oDate.getTime());
      return aDate;
    },
    /**
     * Ajax - get 请求
     * @param {Object} url 请求Url
     * @param {Object} data   参数-Json格式
     * @param {Object} succFn	  回调
     * 测试地址: http://test.dongyixueyuan.com/index.php/link_app/get?state=index
     */
    get: function(jsonData) {
      util.ajax({
        url: jsonData.url,
        data: jsonData.data,
        succFn: jsonData.succFn,
        type: 'get'
      });
    },
    /**
     * Ajax - post 请求
     * @param {Object} url 请求Url
     * @param {Object} data   参数-Json格式
     * @param {Object} succFn	  回调
     * 测试地址: http://test.dongyixueyuan.com/index.php/link_app/post?state=index
     */
    post: function(jsonData) {
      util.ajax({
        url: jsonData.url,
        data: jsonData.data,
        succFn: jsonData.succFn,
        type: 'post'
      });
    },
    /**
     * Ajax
     * @param {Object} json
     */
    ajax: function(json) {
      var timer = null;
      var oAjax = null;
      json = json || {};
      if(!json.url) {
        util.prompt('请求url不存在');
        return;
      }
      json.type = json.type || 'get';
      json.time = json.time || 10;
      json.data = json.data || {};
      if(window.XMLHttpRequest) {
        oAjax = new XMLHttpRequest();
      } else {
        oAjax = new ActiveXObject('Microsoft.XMLHTTP');
      }
      switch(json.type.toLowerCase()) {
        case 'get':
          oAjax.open('GET', json.url + '?' + json2url(json.data), true);
          console.log(json.url + '?' + json2url(json.data));
          oAjax.send();
          break;
        case 'post':
          oAjax.open('POST', json.url, true);
          oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          oAjax.send(json2url(json.data));
          break;
      }
      oAjax.onreadystatechange = function() {
        if(oAjax.readyState == 4) {
          if(oAjax.status >= 200 && oAjax.status < 300 || oAjax.status == 304) {
            clearTimeout(timer);
            json.succFn && json.succFn(oAjax.responseText);
          } else {
            clearTimeout(timer);
            json.errFn && json.errFn(oAjax.status);
          }
        }
      }
      timer = setTimeout(function() {
        util.prompt('网络超时');
        oAjax.onreadystatechange = null;
      }, json.time * 1000);

      function json2url(json) {
        json.t = Math.random();
        var arr = [];
        for(var name in json) {
          arr.push(name + '=' + json[name]);
        }
        return arr.join('&');
      }
    },
    /**
     * 自动消失提示框
     * @param {Object} m 提示信息
     */
    prompt: function(m) {
      mui.toast(m);
    },
};