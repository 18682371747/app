var em = null,
  map_ = null,
  pcenter = null;
// H5 plus事件处理
function plusReady() {
  // 确保DOM解析完成
  if(!em || !window.plus || map_) {
    return
  };
  map_ = new plus.maps.Map("map");
  pcenter = new plus.maps.Point(113.110113, 29.364214);
  map_.centerAndZoom(pcenter, 12);
  
  createMarker();
}
if(window.plus) {
  plusReady();
} else {
  document.addEventListener("plusready", plusReady, false);
}
// DOMContentloaded事件处理
document.addEventListener("DOMContentLoaded", function() {
  em = document.getElementById("map");
  plusReady();
}, false);

function createMarker() {
  //高德地图坐标为(116.3406445236,39.9630878208), 百度地图坐标为(116.347292,39.968716
  var marker = new plus.maps.Marker(new plus.maps.Point(113.110113, 29.364214));
  marker.setIcon("../images/icon_dingwei.png");
  marker.setLabel("龙腾华府");
  var bubble = new plus.maps.Bubble("岳阳大道西，金鹗隧道旁");
  marker.setBubble(bubble);
  map_.addOverlay(marker);
  
  var marker1 = new plus.maps.Marker(new plus.maps.Point(113.134339,29.367459));
  marker1.setIcon("../images/icon_dingwei.png");
  marker1.setLabel("天伦城");
  var bubble1 = new plus.maps.Bubble("金三角购物公园");
  marker1.setBubble(bubble1);
  map_.addOverlay(marker1);
}