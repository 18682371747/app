(function() {

  var gP,
    gM,
    gObject,
    topBarType,
    gRuntime,
    gOs,
    gPackage;

  window.app = {

	request_url :'http://www.cxepb.gov.cn/aboutBuy',
    /**
     * 初始化
     */
    init: function(BarType, packageName) {
      /**
       * true 深色  | false 浅色
       */
      if(BarType) {
        topBarType = 'UIStatusBarStyleDefault';
      } else {
        topBarType = 'UIStatusBarStyleBlackOpaque';
      }
      var topBar = fire.tagName('header')['0'];
      gM = mui;
      gM.plusReady(function() {
        gP = plus;
        gOs = plus.os;
        gRuntime = plus.runtime;

        if(packageName) {
          localStorage.setItem('packageName', packageName);
          gPackage = packageName;
        } else {
          gPackage = localStorage.getItem('packageName');
          if(gPackage == null) {
            gPackage = fire.getRuntime('appid');
          }
        }
        if(topBar) {
          var topBarColor = getComputedStyle(topBar, false)['backgroundColor'];
          if(gM.os.ios) {
            gP.navigator.setStatusBarStyle(topBarType);
            gP.navigator.setStatusBarBackground(topBarColor);
          }
        }
        var logTime = localStorage.getItem('logTime');

        var CurrentTime = fire.getCurrentTime();
        CurrentTime.length = 3;
        CurrentStrTime = CurrentTime.join('');
        if(CurrentStrTime != logTime) {
          localStorage.setItem('logTime', CurrentStrTime);
          localStorage.removeItem('isFirstStart');
        }
        var isFirstStart = localStorage.getItem('isFirstStart');
        if(isFirstStart != gPackage) {
          isFirstStartData = 1;
          localStorage.setItem('isFirstStart', gPackage);
          fire.getCurrentPosition({
            succFn: function(data) {
              var city = JSON.parse(data).result.addressComponent.city;
              //				        fire.synchronousStatistics(isFirstStartData,0,city);
            }
          });
          //				fire.update('system');
        } else {
          isFirstStartData = 0;
          //				fire.synchronousStatistics(isFirstStartData,0,'');
        }
        var onlineTime = 0;
        var timeLog = localStorage.getItem(timeLog);
        if(timeLog == null) {
          setStartTime();
        }
        document.addEventListener("resume", function() {
          setStartTime();
        }, false);
        document.addEventListener("pause", function() {
          var startTime = localStorage.getItem(timeLog);
          var endTime = fire.getCurrentTime()['7'];
          onlineTime = endTime - startTime;
          isFirstStartData = 2;
          //				fire.synchronousStatistics(isFirstStartData,onlineTime);
        }, false);

        function setStartTime() {
          var startTime = fire.getCurrentTime()['7'];
          localStorage.setItem(timeLog, startTime);
        }
      });
    },
    synchronousStatistics: function(isFirstStartData, onlineTime, city) {
      if(!city) {
        city = '';
      }
      var system = gP.os.name;
      var version = gP.os.version;
      var language = gP.os.language;
      var vendor = gP.os.vendor;
      var types = {};
      types[gP.networkinfo.CONNECTION_UNKNOW] = "未知";
      types[gP.networkinfo.CONNECTION_NONE] = "未连接网络";
      types[gP.networkinfo.CONNECTION_ETHERNET] = "有线网络";
      types[gP.networkinfo.CONNECTION_WIFI] = "WiFi网络";
      types[gP.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
      types[gP.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
      types[gP.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
      var network = types[gP.networkinfo.getCurrentType()];
      var model = gP.device.model;
      var imei = gP.device.imei;
      var uuid = gP.device.uuid;
      var imsi = '';
      for(i = 0; i < gP.device.imsi.length; i++) {
        imsi += gP.device.imsi[i];
      }
      var resolution = gP.screen.resolutionWidth * gP.screen.scale + " x " + gP.screen.resolutionHeight * gP.screen.scale;
      var self = gP.webview.currentWebview().getURL();
      if(self) {
        var currentInterface = self.substring(self.lastIndexOf('/') + 1);
      }
      var app_version = gP.runtime.version;
      var client_id = gP.push.getClientInfo().clientid;
      var token_id = gP.push.getClientInfo().token;
      fire.get({
        url: 'http://api.castapp.cn/count_service',
        data: {
          app_version_data: app_version,
          currentInterface_data: currentInterface,
          system_data: system,
          system_version_data: version,
          language_data: language,
          company_data: vendor,
          network_data: network,
          model_data: model,
          imei_data: imei,
          uuid_data: uuid,
          imsi_data: imsi,
          resolution_data: resolution,
          is_first_start_data: isFirstStartData,
          online_time_data: onlineTime,
          city_data: city,
          client_data: client_id,
          token_data: token_id,
        }
      });
    },
    update: function(state) {
      fire.get({
        url: 'http://api.castapp.cn/update_service',
        data: {
          platform_data: fire.getOs('name'),
          version_data: fire.getRuntime('version'),
        },
        succFn: function(data) {
          if(data == 0) {
            if(state != 'system') {
              fire.prompt('没有发现新版本');
              return;
            }
          } else {
            fire.confirm({
              title: '更新提示',
              content: '发现新版本，是否更新？',
              callback: function(rvalue) {
                if(rvalue) {
                  fire.openUrl(JSON.parse(data));
                }
              }
            })
          }
        }
      })
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
     * 获得屏幕的高度
     * @param {Object} element
     */
    getScreenInfo: function(element) {
      if(element == 'width') {
        return document.documentElement.clientWidth || document.body.clientWidth;
      } else {
        return document.documentElement.clientHeight || document.body.clientHeigth;
      }
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
     * 单击事件
     * @param {Object} element 元素
     * @param {Object} succfn  成功的回调
     */
    click: function(elementData, succfn) {
      elementData.addEventListener('tap', function() {
        succfn(this);
      });
    },
    /**
     * 打开新页面
     * @param {Object} jsonData
     */
    newInterface: function(jsonData) {
      if(jsonData.styles == undefined) {
        var styles = {};
        styles.top = '0px';
        styles.bottom = '0px';
        styles.width = '100%';
        styles.height = '100%';
        jsonData.styles = styles;
      } else {
        if(jsonData.styles.top == undefined) {
          jsonData.styles.top = "0px";
        }
        if(jsonData.styles.bottom == undefined) {
          jsonData.styles.bottom = "0px";
        } else {
          jsonData.styles.height = fire.getScreenInfo('height') - parseInt(jsonData.styles.bottom) + 'px';
        }
        if(jsonData.styles.width == undefined) {
          jsonData.styles.width = "100%";
        }
        if(jsonData.styles.height == undefined) {
          jsonData.styles.height = "100%";
        }
      }
      if(jsonData.show == undefined) {
        jsonData.show = true;
      }
      if(jsonData.showType == undefined) {
        jsonData.showType = 'zoom-fade-out';
      }
      if(jsonData.showTime == undefined) {
        jsonData.showTime = 350;
      }
      if(jsonData.waiting == undefined) {
        jsonData.waiting = false;
      }
      gM.openWindow({
        url: jsonData.url,
        id: jsonData.id,
        styles: {
          top: jsonData.styles.top,
          bottom: jsonData.styles.bottom,
          width: jsonData.styles.width,
          height: jsonData.styles.height,
        },
        show: {
          autoShow: jsonData.show,
          aniShow: jsonData.showType,
          duration: jsonData.showTime
        },
        waiting: {
          autoShow: jsonData.waiting,
        }
      });
    },
    /**	
     * 关闭当前界面
     */
    closeCurrentInterface: function() {
      gM.back();
    },
    /**
     * 底部导航
     * @param {Object} arrayData Url数组
     */
    tabBar: function(arrayData) {
      var subpage_style = {
        top: '0px',
        bottom: '50px',
        scrollIndicator: "none",
      };
      gM.plusReady(function() {
        fire.getCurrentInterface(function(self) {
          for(var i = 0; i < arrayData.length; i++) {
            var subpage = arrayData[i];
            var suff = subpage.indexOf('.');
            var objectName = subpage.substring(0, suff);
            var sub = plus.webview.create(arrayData[i], objectName, subpage_style);
            if(i > 0) {
              sub.hide();
            }
            self.append(sub);
          }
        });
      });
      var activeTab = arrayData[0];
      gM('.mui-bar-tab').on('tap', 'a', function(e) {
        var targetTab = this.getAttribute('href');
        if(targetTab == activeTab) {
          return;
        }
        var suff = targetTab.indexOf('.');
        targetTab = targetTab.substring(0, suff);
        plus.webview.show(targetTab);
        plus.webview.hide(activeTab);
        activeTab = targetTab + '.html';
      });
      document.addEventListener('gohome', function() {
        var defaultTab = document.getElementById("defaultTab");
        mui.trigger(defaultTab, 'tap');
        var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
        if(defaultTab !== current) {
          current.classList.remove('mui-active');
          defaultTab.classList.add('mui-active');
        }
      });
    },
    /**
     * 初始化底部导航 / goHome
     * @param {Object} isRoot 
     * @param {Object} interfaceId
     */
    tabBarInit: function(isRoot, interfaceId) {
      if(isRoot == true) {
        var objectId = 'root';
      } else {
        var objectId = interfaceId;
      }
      fire.sendNotice(objectId, 'gohome', {});
    },
    /**
     * 上拉刷新和下拉加载
     * @param {Object} element 容器的ID
     * @param {Object} downFn  下拉刷新的回调
     * @param {Object} upFn    上拉加载的回调
     */
    refreshLoad: function(element, downFn, upFn) {
      gM.init({
        pullRefresh: {
          container: '#' + element,
          down: {
            contentdown: "下拉可以刷新",
            contentover: "释放立即刷新",
            contentrefresh: "正在刷新...",
            callback: down
          },
          up: {
            contentrefresh: '正在加载...',
            callback: up
          }
        }
      });

      function down() {
        downFn(function() {
          mui('#' + element).pullRefresh().endPulldownToRefresh();
        });
      }

      function up() {
        var _this = this;
        /**
         * true 为没有数据
         * false 为有更多数据
         */
        upFn(function(state) {
          _this.endPullupToRefresh(state);
        });
      }
    },
    /**
     * Ajax - get 请求
     * @param {Object} url 请求Url
     * @param {Object} data   参数-Json格式
     * @param {Object} succFn	  回调
     * 测试地址: http://test.dongyixueyuan.com/index.php/link_app/get?state=index
     */
    get: function(jsonData) {
      fire.ajax({
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
      fire.ajax({
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
      json = json || {};
      if(!json.url) {
        fire.prompt('请求url不存在');
        return;
      }
      json.type = json.type || 'get';
      json.time = json.time || 10;
      json.data = json.data || {};
      if(window.XMLHttpRequest) {
        var oAjax = new XMLHttpRequest();
      } else {
        var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
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
        fire.prompt('网络超时');
        oAjax.onreadystatechange = null;
      }, json.time * 1000);

      function json2url(json) {
        json.t = Math.random();
        json.package_name_data = gPackage;
        var arr = [];
        for(var name in json) {
          arr.push(name + '=' + json[name]);
        }
        return arr.join('&');
      }
    },
    /**
     * 获得起始页对象或者首页
     * @param {Object} 
     */
    getStartInterface: function(callback) {
      gM.plusReady(function() {
        callback && callback(gP.webview.getLaunchWebview());
      });
    },
    /**
     * 获得当前页对象 
     * @param {Object} 
     */
    getCurrentInterface: function(callback) {
      gM.plusReady(function() {
        callback && callback(gP.webview.currentWebview());
      });
    },
    /**
     * 获得目标页对象
     * @param {Object} 
     */
    getTargetInterface: function(targetInterface, callback) {
      gM.plusReady(function() {
        callback && callback(gP.webview.getWebviewById(targetInterface));
      });
    },
    /**
     * 发送通知
     * @param {Object} targetId     通知对象 & 可单个id也可批量通知idArr = ['a','b'] , *注意: root 为根(起始页)
     * @param {Object} fnName		频道号或者通知号
     * @param {Object} jsonData		参数
     */
    sendNotice: function(targetId, fnName, jsonData) {
      if(targetId.constructor == Array) {
        for(var i = 0; i < targetId.length; i++) {
          if(targetId[i] == 'root') {
            fire.getStartInterface(function(targetObject) {
              gM.fire(targetObject, fnName, jsonData);
            });
          } else {
            fire.getTargetInterface(targetId[i], function(targetObject) {
              gM.fire(targetObject, fnName, jsonData);
            });
          }
        }
      } else {

        if(targetId == 'root') {
          fire.getStartInterface(function(targetObject) {
            gM.fire(targetObject, fnName, jsonData);
          });
        } else {
          fire.getTargetInterface(targetId, function(targetObject) {
            gM.fire(targetObject, fnName, jsonData);
          });
        }
      }
    },
    /**
     * 接收通知
     * @param {Object} fnName 函数名称
     * @param {Object} fn	  回调
     */
    receiveNotice: function(fnName, fn) {
      document.addEventListener(fnName, function(event) {
        fn(event);
      });
    },
    /**
     * 预加载
     * @param {Object} arrayData
     * @param {Object} fn
     */
    preLoad: function(arrayData, fn) {
      var array = [];
      gM.plusReady(function() {
        for(var a = 0; a < arrayData.length; a++) {
          var productView = gM.preload({
            url: arrayData[a].url,
            id: arrayData[a].id,
          });
          array.push(productView);
        }
        fn && fn(array)
      });
    },
    /**
     * 弹出框
     * @param {Object} jsonData
     */
    alert: function(jsonData) {
      gM.alert(jsonData.content, jsonData.title, function() {
        jsonData.callback && jsonData.callback();
      });
    },
    /**
     * 确认提示框
     * @param {Object} jsonData
     */
    confirm: function(jsonData) {
      var btnArray = ['是', '否'];
      gM.confirm(jsonData.content, jsonData.title, btnArray, function(e) {
        if(e.index == 0) {
          jsonData.callback && jsonData.callback(true);
        } else {
          jsonData.callback && jsonData.callback(false);
        }
      });
    },
    /**
     * 输入提示框
     * @param {Object} jsonData
     */
    inputPrompt: function(jsonData) {
      var btnArray = ['确定', '取消'];
      gM.prompt(jsonData.content, '', jsonData.title, btnArray, function(e) {
        if(e.index == 0) {
          jsonData.callback && jsonData.callback(e.value);
        } else {
          jsonData.callback && jsonData.callback(false);
        }
      });
    },
    /**
     * 日期选择框
     * @param {Object} jsonData
     */
    dateSelect: function(jsonData) {
      var dDate = new Date();
      dDate.setFullYear(jsonData.defaultTime.split('-')['0'], jsonData.defaultTime.split('-')['1'] - 1, jsonData.defaultTime.split('-')['2']);
      var minDate = new Date();
      minDate.setFullYear(jsonData.minTime.split('-')['0'], jsonData.minTime.split('-')['1'] - 1, jsonData.minTime.split('-')['2']);
      var maxDate = new Date();
      maxDate.setFullYear(jsonData.maxTime.split('-')['0'], jsonData.maxTime.split('-')['1'] - 1, jsonData.maxTime.split('-')['2']);
      gM.plusReady(function() {
        plus.nativeUI.pickDate(function(e) {
          var d = e.date;
          if(d.getDate() < 10) {
            var day = '0' + d.getDate();
          } else {
            var day = d.getDate();
          }
          jsonData.callback && jsonData.callback(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + day);
        }, function(e) {
          jsonData.callback && jsonData.callback(false);
        }, {
          title: "请选择日期",
          date: dDate,
          minDate: minDate,
          maxDate: maxDate
        });
      });
    },
    /**
     * 时间选择框
     * @param {Object} jsonData
     */
    timeSelect: function(jsonData) {
      var dTime = new Date();
      dTime.setHours(jsonData.defaultTime.split(':')['0'], jsonData.defaultTime.split(':')['1']);
      gM.plusReady(function() {
        plus.nativeUI.pickTime(function(e) {
          var d = e.date;
          if(d.getHours() < 10) {
            var h = '0' + d.getHours();
          } else {
            var h = d.getHours();
          }
          if(d.getMinutes() < 10) {
            var m = '0' + d.getMinutes();
          } else {
            var m = d.getMinutes();
          }
          jsonData.callback && jsonData.callback(h + ":" + m);
        }, function(e) {
          jsonData.callback && jsonData.callback(false);
        }, {
          title: "请选择时间",
          is24Hour: true,
          time: dTime
        });
      });
    },
    /**
     * 自动消失提示框
     * @param {Object} m 提示信息
     */
    prompt: function(m) {
      mui.toast(m);
    },
    /**
     * 原生actionSheet 
     * @param {Object} arrayData
     * @param {Object} jsonData & isUpload | uploadUrl
     */
    actionSheet: function(arrayData, jsonData) {
      if(arrayData[0].title == undefined) {
        var transferArr = [];
        for(var a = 0; a < arrayData.length; a++) {
          var json = {
            'title': arrayData[a]
          };
          transferArr.push(json);
        }
        arrayData = transferArr;
      }
      gM.plusReady(function() {
        plus.nativeUI.actionSheet({
            title: "请选择",
            cancel: "取消",
            buttons: arrayData
          },
          function(e) {
            var index = e.index;
            if(index == 0) {
              return;
            }
            index--;
            if(arrayData[index].title == '照相机') {
              fire.camera({
                succFn: function(path, name) {
                  if(jsonData && jsonData.isUpload) {
                    fire.uploadFiles(jsonData.uploadUrl, path, function(imgPath) {
                      jsonData.succFn(imgPath);
                    }, function(error) {
                      jsonData.errFn && jsonData.errFn(error);
                    });
                  } else {
                    jsonData.succFn(path, name)
                  }
                }
              });
            } else if(arrayData[index].title == '相册') {
              fire.album({
                succFn: function(path) {
                  if(jsonData && jsonData.isUpload) {
                    fire.uploadFiles(jsonData.uploadUrl, path, function(imgPath) {
                      jsonData.succFn(imgPath);
                    }, function(error) {
                      jsonData.errFn && jsonData.errFn(error);
                    });
                  } else {
                    jsonData.succFn(path);
                  }
                }
              });
            } else {
              jsonData.succFn(index);
            }
          });
      });
    },
    /**
     * 手势
     * @param {Object} element 
     * @param {Object} event
     * @param {Object} fn
     */
    gesture: function(element, event, fn) {
      gM.init({
        gestureConfig: {
          tap: true,
          doubletap: true,
          longtap: true,
          swipe: true,
          drag: true,
          hold: true,
          release: true
        }
      });
      element.addEventListener(event, function() {
        fn();
      });
    },
    /**
     * 遮罩
     * @param {Object} callback
     */
    showMask: function(callback) {
      var mask = gM.createMask(callback);
      mask.show();
    },
    /**
     * 图片轮播
     * @param {Object} callback
     * @param {Object} isAutoScroll
     * @param {Object} scrollTime
     */
    pictureScroll: function(jsonData) {
      var gallery = gM('.mui-slider');
      if(jsonData.isAutoScroll) {
        gallery.slider({
          interval: jsonData.scrollTime * 1000
        });
      }
      document.querySelector('.mui-slider').addEventListener('slide', function(event) {
        jsonData.callback && jsonData.callback(event.detail.slideNumber + 1);
      });
    },
    /**
     * 创建子页面
     * @param {Object} jsonData
     */
    createChildInterface: function(jsonData) {
      var styles = {};
      if(jsonData.styles == undefined) {
        styles.top = '0px';
        styles.bottom = '0px';
        styles.width = '100%';
        styles.height = '100%';
        jsonData.styles = styles;
      } else {
        if(jsonData.styles.top == undefined) {
          jsonData.styles.top = "0px";
        }
        if(jsonData.styles.bottom == undefined) {
          jsonData.styles.bottom = "0px";
        } else {
          jsonData.styles.height = fire.getScreenInfo('height') - parseInt(jsonData.styles.bottom) - parseInt(jsonData.styles.top) + 'px';
        }
        if(jsonData.styles.width == undefined) {
          jsonData.styles.width = "100%";
        }
        if(jsonData.styles.height == undefined) {
          jsonData.styles.height = "100%";
        }
      }
      gM.init({
        subpages: [{
          url: jsonData.url,
          id: jsonData.id,
          styles: {
            top: jsonData.styles.top,
            bottom: jsonData.styles.bottom,
            width: jsonData.styles.width,
            height: jsonData.styles.height,
          },
        }]
      });
    },
    /**
     * 显示等待框
     * @param {Object} watingPrompt
     */
    showWaiting: function(watingPrompt) {
      gM.plusReady(function() {
        plus.nativeUI.showWaiting(watingPrompt);
      })
    },
    /**
     * 关闭等待框
     */
    closeWaiting: function() {
      gM.plusReady(function() {
        plus.nativeUI.closeWaiting();
      })
    },
    /**	
     * 照相机 
     * @param {Object} succFn
     * @param {Object} errFn
     */
    camera: function(jsonData) {
      gM.plusReady(function() {
        var cmr = plus.camera.getCamera();
        cmr.captureImage(function(p) {
          plus.io.resolveLocalFileSystemURL(p, function(entry) {
            var img_name = entry.name;
            var img_path = entry.toLocalURL();
            jsonData.succFn && jsonData.succFn(img_path, img_name);
          }, function(e) {
            jsonData.errFn && jsonData.errFn(e.message);
          });
        }, function(e) {
          jsonData.errFn && jsonData.errFn(e.message);
        }, {
          filename: '_doc/camera/',
          index: 1
        });
      });
    },
    /**
     * 相册
     * @param {Object} succFn
     * @param {Object} errFn
     */
    album: function(jsonData) {
      gM.plusReady(function() {
        plus.gallery.pick(function(path) {
          jsonData.succFn && jsonData.succFn(path);
        }, function(e) {
          jsonData.errFn && jsonData.errFn(e.message);
        }, {
          filter: "image"
        });
      });
    },
    /**
     * 蜂鸣
     */
    beep: function() {
      gM.plusReady(function() {
        switch(plus.os.name) {
          case "iOS":
            if(plus.device.model.indexOf("iPhone") >= 0) {
              plus.device.beep();
            } else {
              fire.prompt('此设备不支持蜂鸣');
            }
            break;
          default:
            plus.device.beep();
            break;
        }
      });
    },
    /**	
     * 手机震动
     */
    vibrate: function() {
      gM.plusReady(function() {
        switch(plus.os.name) {
          case "iOS":
            if(plus.device.model.indexOf("iPhone") >= 0) {
              plus.device.vibrate();
            } else {
              fire.prompt('此设备不支持震动');
            }
            break;
          default:
            plus.device.vibrate();
            break;
        }
      });
    },
    /**
     * 设备信息
     * @param {Object} callback
     */
    getDeviceInfo: function(callback) {
      gM.plusReady(function() {
        var json = {};
        json.model = gP.device.model;
        json.vendor = gP.device.vendor;
        json.imei = gP.device.imei;
        json.uuid = gP.device.uuid;
        var str = '';
        for(i = 0; i < gP.device.imsi.length; i++) {
          str += gP.device.imsi[i];
        }
        json.imsi = str;
        json.resolution = gP.screen.resolutionWidth * gP.screen.scale + " x " + gP.screen.resolutionHeight * gP.screen.scale;
        json.pixel = gP.screen.dpiX + " x " + gP.screen.dpiY;
        callback(json);
      });
    },
    /**
     * 手机信息 
     * @param {Object} callback
     */
    getMachineInfo: function(callback) {
      gM.plusReady(function() {
        var json = {};
        json.name = gP.os.name;
        json.version = gP.os.version;
        json.language = gP.os.language;
        json.vendor = gP.os.vendor;
        var types = {};
        types[gP.networkinfo.CONNECTION_UNKNOW] = "未知";
        types[gP.networkinfo.CONNECTION_NONE] = "未连接网络";
        types[gP.networkinfo.CONNECTION_ETHERNET] = "有线网络";
        types[gP.networkinfo.CONNECTION_WIFI] = "WiFi网络";
        types[gP.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
        types[gP.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
        types[gP.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
        json.network = types[gP.networkinfo.getCurrentType()];
        callback(json);
      });
    },
    /**
     * 发送短信
     * @param {Object} sendPhone
     * @param {Object} sendContent
     */
    sendSms: function(sendPhone, sendContent) {
      var msg = gP.messaging.createMessage(plus.messaging.TYPE_SMS);
      msg.to = sendPhone;
      msg.body = sendContent;
      gP.messaging.sendMessage(msg);
    },
    /**
     * 拨打电话
     * @param {Object} phone
     */
    callPhone: function(targetPhone) {
      gP.device.dial(targetPhone, false);
    },
    /**	
     * 邮件
     * @param {Object} targetEmail
     */
    sendEmail: function(targetEmail) {
      location.href = "mailto:" + targetEmail;
    },
    /**
     * 图片上传
     * @param {Object} uploadUrl 上传地址
     * @param {Object} filePath  文件路径
     * @param {Object} succFn 	   成功回调
     * @param {Object} errFn     失败回调
     */
    uploadFiles: function(uploadUrl, filePath, succFn, errFn) {
      var files = [];
      var n = filePath.substr(filePath.lastIndexOf('/') + 1);
      files.push({
        name: "uploadkey",
        path: filePath
      });
      if(files.length <= 0) {
        this.prompt("没有添加上传文件");
        return;
      }
      fire.showWaiting('上传中...');
      var task = gP.uploader.createUpload(uploadUrl, {
          method: "POST"
        },
        function(t, status) {

          if(status == 200) {
            var responseText = t.responseText;
            var json = eval('(' + responseText + ')');
            var files = json.files;
            var img_url = files.uploadkey.url;
            succFn(img_url);
            fire.closeWaiting();
          } else {
            errFn && errFn(status);
            fire.closeWaiting();
          }
        });
      task.addData("client", "");
      task.addData("uid", Math.floor(Math.random() * 100000000 + 10000000).toString());
      for(var i = 0; i < files.length; i++) {
        var f = files[i];
        task.addFile(f.path, {
          key: f.name
        });
      }
      task.start();
    },
    /**
     * 地理位置 - 获得当前位置
     * @param {Object} succFn 成功回调
     * @param {Object} errFn  失败回调
     */
    getCurrentPosition: function(jsonData) {
      gM.plusReady(function() {
        gP.geolocation.getCurrentPosition(function(position) {
          var timeflag = position.timestamp;
          var codns = position.coords;
          var lat = codns.latitude;
          var longt = codns.longitude;
          var alt = codns.altitude;
          var accu = codns.accuracy;
          var altAcc = codns.altitudeAccuracy;
          var head = codns.heading;
          var sped = codns.speed;
          var baidu_map = "http://api.map.baidu.com/geocoder/v2/?output=json&ak=BFd9490df8a776482552006c538d6b27&location=" + lat + ',' + longt;
          fire.ajax({
            url: baidu_map,
            data: {},
            succFn: function(data) {
              jsonData.succFn && jsonData.succFn(data);
            }
          });
        }, function(e) {
          jsonData.errFn && jsonData.errFn(e.message);
        });
      })
    },
    /**
     * 浏览器打开网页
     * @param {Object} targetUrl
     */
    openUrl: function(targetUrl) {
      fire.getRuntime().openURL(targetUrl);
    },
    /**
     * 设置完手动关闭启动页 manifest.json -> 启动图片 -> 选择手动关闭启动界面
     * 关闭启动页
     */
    closeStartPage: function() {
      gM.plusReady(function() {
        plus.navigator.closeSplashscreen();
      });
    },
    /**
     * 设置首次启动引导轮播页面
     * @param {Object} jsonData 
     * url 预加载URL
     * id  预加载ID
     */
    setStartpage: function(jsonData) {
      gM.init({
        swipeBack: true,
        scrollIndicator: "none"
      });
      var vH = fire.getScreenInfo('height');
      var slider = document.getElementById('slider');
      slider.style.height = vH + 'px';
      var img = slider.getElementsByTagName('img');
      for(var a = 0; a < img.length; a++) {
        img[a].style.height = vH + 'px';
      }

      //判断是否为第一次登录
      var appWelcome = localStorage.getItem('appWelcome');
      if(appWelcome) {
        gM.plusReady(function() {
          var terger_path = plus.webview.create(jsonData.url, jsonData.id, '');
          terger_path.show();
          setTimeout(function() {
            fire.closeStartPage();
          }, 500);

        });
      } else {
        //预加载
        gM.plusReady(function() {
          fire.closeStartPage();
          fire.preLoad([{
            url: jsonData.url,
            id: jsonData.id
          }], function(data) {
            var productView = data['0'];
            if(productView) {
              clickEvent(productView);
            }
          });
        });

        function clickEvent(productView) {
          var dy_enter = fire.id('dy_enter');
          dy_enter.onclick = function() {
            localStorage.setItem('appWelcome', true);
            productView.show("pop-in", 300);
          }
        }
      }
      fire.dblclickExit();
    },
    /**
     * 双击返回键退出
     */
    dblclickExit: function() {
      var first = null;
      gM.back = function() {
        if(!first) {
          first = new Date().getTime();
          fire.prompt('再按一次退出应用');
          setTimeout(function() {
            fire.dblclickExit();
          }, 1000);
        } else {
          if(new Date().getTime() - first < 1000) {
            gP.runtime.quit();
          }
        }
      }
    },
    /**
     * 隐藏界面滚动条
     */
    hiddenScroll: function() {
      gM.plusReady(function() {
        var self = plus.webview.currentWebview();
        self.setStyle({
          scrollIndicator: 'none'
        });
      });
    },
    /**
     * 禁止界面弹动
     */
    stopBounce: function() {
      var self = gP.webview.currentWebview();
      self.setStyle({
        setBounce: 'none'
      });
    },
    /**
     * 获得验证码
     * length 为验证码长度
     */
    getIdCode: function(length) {
      if(length == undefined) {
        length = 4;
      }
      var pow = Math.pow(10, length);
      var code = Math.floor(Math.random() * pow + pow / 10).toString();
      return code.substr(0, length);
    },
    ////////////////////////////////////////*功能模块*///////////////////////////////////////////////////////
   
    /**
     * 发送验证码
     * 
     */
    sendIdCode: function(jsonData) {
      fire.showWaiting();
      setTimeout(function() {
        fire.closeWaiting();
      }, 10000);

      if(jsonData.package_name == undefined) {
        jsonData.package_name = fire.getRuntime('appid');
      }
      fire.get({
        url: 'http://api.castapp.cn/sms_service/index.php',
        data: {
          code: jsonData.code,
          target_phone: jsonData.target_phone,
          appid: jsonData.appid,
          appkey: jsonData.appkey,
          sms_templates: jsonData.sms_templates,
          package_name: jsonData.package_name,
        },
        succFn: function(data) {
          fire.closeWaiting();
          if(data == -2) {
            fire.prompt('应用配置信息不正确');
            return;
          } else if(data == -1) {
            fire.prompt('账户余额不足');
            return;
          } else if(data == -3) {
            fire.prompt('发送失败');
            return;
          } else if(data == 500) {
            fire.prompt('服务器端错误');
            return;
          } else if(data == 1) {
            jsonData.callback && jsonData.callback(true);
          }
          if(data != 1) {
            jsonData.callback && jsonData.callback(false);
          }
        }
      });
    },
    /**
     * 获得通讯录
     * type     为获取类型 phone 为本机通讯录 其他 为本机sim通讯录
     * callbacl 回调函数
     */
    getAddressBook: function(type, callback) {
      gM.plusReady(function() {
        var listLength = 0;
        if(type == 'phone') {
          var getType = 'plus.contacts.ADDRESSBOOK_PHONE';
        } else {
          var getType = 'plus.contacts.ADDRESSBOOK_SIM';
        }
        gP.contacts.getAddressBook(getType, function(addressbook) {
          addressbook.find(null, function(contacts) {
            fire.showWaiting();
            if(contacts.length < 1) {
              fire.prompt('没有发现通讯录内容');
              fire.closeWaiting();
            } else {
              listLength = contacts.length;
              listFilter(contacts);
            }
          }, function(e) {}, {
            multi: true
          });
        });

        function listFilter(arr) {
          var backArr = [];
          for(var i = 0; i < arr.length; i++) {
            if(gM.os.ios) {
              var data = arr[i];
              var json = JSON.stringify(data);
              var datas = eval('(' + json + ')');
              var ios_name = datas['name'];
              if(ios_name['familyName'] != null) {
                if(ios_name['givenName'] != null) {
                  var name = ios_name['familyName'] + ios_name['givenName'];
                } else {
                  var name = ios_name['familyName'];
                }
              } else {

                if(ios_name['givenName'] != null) {
                  var name = ios_name['givenName'];
                } else {
                  var name = '#';
                }
              }
              var ios_phone = datas['phoneNumbers'];
              var phone = '';
              var telephone = '';
              for(var a in ios_phone) {
                var data = ios_phone[a];
                if(data['type'] == 'home') {
                  telephone = ios_phone[a].value;
                }
                if(data['type'] == 'mobile') {
                  phone = ios_phone[a].value;
                }
                if(phone == '') {
                  if(data['type'] == 'other') {
                    phone = ios_phone[a].value;
                  }
                }
              }
              //email
              var ios_emails = datas['emails'];
              var email = '';
              for(var b in ios_emails) {
                email = ios_emails[b].value;
              }

              var company = '';

            } else {
              if(arr[i].displayName) {
                var name = arr[i].displayName;
              }
              if(arr[i].phoneNumbers[0]) {
                var phone = arr[i].phoneNumbers[0].value;
              }
            }

            if(/^[\u4e00-\u9fa5]+$/.test(name)) { //是中文
              var first = fire.getFirstLetter(name);
            } else {
              //判断是否为特殊字符
              if(name) {
                var s = name.substring(0, 1);
                if(/^[A-Za-z]+$/.test(s)) { //判断是否为英文名称
                  var first = s.toUpperCase();
                } else { // 判断是否为特殊字符
                  if(!/^[0-9]+$/.test(s)) { //判断如果不是数字				
                    var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
                    if(!containSpecial.test(s)) {
                      name = escape(name);
                    }
                  }
                  var first = '#';
                }
              } else {
                var first = '#';
              }
            }

            if(phone.length != '11') {

              var s = phone.substring(0, 5);
              if(s == '17951' || s == '12593') {
                phone = phone.substring(5, 16);
              }

            }
            phone = phone.replace('+86', "");
            phone = phone.replace('/ /g', "");
            phone = phone.replace(/-/g, "");

            var str = '{"name":"' + name + '","phone":"' + phone + '","firstLetter":"' + first.toUpperCase() + '"}';
            backArr.push(str);
            fire.closeWaiting();
          }
          callback(backArr, listLength);
        }
      });
    },
    /**
     * 获得Runtime信息
     */
    getRuntime: function(path) {
      if(path) {
        return gRuntime[path];
      } else {
        return gRuntime;
      }
    },
    /**
     * 获得Os
     * 
     */
    getOs: function(path) {
      if(path) {
        return gOs[path];
      } else {
        return gOs;
      }
    },
    /**
     * 获得中文字拼音首字母
     */
    getFirstLetter: function(data) {
      var val = data.substr(0, 1);
      var name = arraySearch(val);
      if(name) {
        var first = name.substr(0, 1);
      } else {
        var first = '#';
      }
      return first.toUpperCase();

      function arraySearch(l1) {
        for(var name in PinYin) {
          if(PinYin[name].indexOf(l1) != -1) {
            return name;
            break;
          }
        }
        return false;
      }
    },
    /**
     * 多级组合选择 支持1,2,3级组合
     * selectNumber 选择数
     * data         数据
     * callback     回调
     * 
     */
    combinationSelect: function(selectNumber, data, callback) {
      if(!selectNumber) {
        selectNumber = 1
      };
      var selector = new gM.PopPicker({
        layer: selectNumber
      });
      if(!selectNumber || selectNumber == 1) {
        var transferArr = [];
        for(var a = 0; a < data.length; a++) {
          var datajson = {
            text: data[a]
          };
          transferArr.push(datajson);
        };
        data = transferArr;
      }
      selector.setData(data);
      selector.show(function(items) {
        var backArr = [];
        if(selectNumber == 1) {
          backArr = [items[0].text];
        } else if(selectNumber == 2) {
          backArr = [items[0].text, items[1].text];
        } else if(selectNumber == 3) {
          backArr = [(items[0] || {}).text, (items[1] || {}).text, (items[2] || {}).text];
        }
        callback && callback(backArr);
      });
    },

    /**
     * 判断当前节点是否存在class样式
     */

    hasClass: function(elements, cName) {
      return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
    },
    /**
     * 当前节点添加class样式
     * @param {Object} elements
     * @param {Object} cName
     */
    addClass: function(elements, cName) {
      if(!fire.hasClass(elements, cName)) {
        elements.className += " " + cName;
      };
    },
    /**
     * 删除样式
     * @param {Object} elements
     * @param {Object} cName
     */
    removeClass: function(elements, cName) {
      if(fire.hasClass(elements, cName)) {
        elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
      };
    },
    /**
     * 获取当前格式化时间
     * @param {Object} str
     */
    getMyDate: function(str) {
      var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + fire.getzf(oMonth) + '-' + fire.getzf(oDay) + ' '; //最后拼接时间    //时分秒   + fire.getzf(oHour) + ':' + fire.getzf(oMin) + ':' + fire.getzf(oSen)
      return oTime;
    },
    //补0操作
    getzf: function(num) {
      if(parseInt(num) < 10) {
        num = '0' + num;
      }
      return num;
    }

  }

})();