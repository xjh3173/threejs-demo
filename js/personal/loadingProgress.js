/*!
 * Loading Progress.
 * 
 * Copyright (c) 2018-2019 xjh.
 * Version: 1.0
 * Company: http://www.chinadci.com
 */

function fakeProgress(v, el, callback) {
  if(v > 100){
      el.innerText = "100%";
      var box = document.getElementsByClassName('c-loading')[0];
      var classVal = box.getAttribute('class');
      classVal = classVal.concat(" hide");
      box.setAttribute("class", classVal );
      callback.call(this);
  }else{
      var ie5 = (document.all  &&  document.getElementsByTagName);
      if (ie5 || document.readyState == "complete"){
          el.innerText = v + "%";
      }
      v += _random(2, 3) * 2;
      window.setTimeout("fakeProgress(" + (v) + ", document.all['" + el.id + "'], " + callback + ")", 20);
  }
}

function _random(Min, Max){
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}