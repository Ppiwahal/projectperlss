let viewport = document.getElementById('viewport');
function resize() {
  let w = Math.max(
    document.documentElement["clientWidth"],
    document.body["scrollWidth"],
    document.documentElement["scrollWidth"],
    document.body["offsetWidth"],
    document.documentElement["offsetWidth"]
  );
  let scale = 2400 / w;
  console.log('scale:' + scale);
  viewport.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no, width=2400')
}

window.addEventListener("resize", resize);
resize();
  