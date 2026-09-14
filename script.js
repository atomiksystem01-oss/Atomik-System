// countdown: resets at midnight local time
(function(){
  var els=document.querySelectorAll('[data-count]');
  function pad(n){return n<10?'0'+n:''+n}
  function tick(){
    var now=new Date(), end=new Date(now); end.setHours(24,0,0,0);
    var t=Math.max(0,Math.floor((end-now)/1000));
    var h=pad(Math.floor(t/3600)), m=pad(Math.floor(t%3600/60)), sec=pad(t%60);
    els.forEach(function(e){
      e.querySelector('[data-h]').innerHTML=h+'<i>HRS</i>';
      e.querySelector('[data-m]').innerHTML=m+'<i>MIN</i>';
      e.querySelector('[data-s]').innerHTML=sec+'<i>SEC</i>';
    });
  }
  tick(); setInterval(tick,1000);
})();

// load the YouTube player only when the poster is clicked
document.getElementById('vplay').addEventListener('click', function(){
  var f = document.createElement('iframe');
  f.src = 'https://www.youtube.com/embed/FYCDk-VasxQ?autoplay=1&rel=0&modestbranding=1&playsinline=1';
  f.title = 'Inside the bundle: full folder walkthrough';
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  f.allowFullscreen = true;
  f.setAttribute('frameborder','0');
  document.getElementById('vwrap').appendChild(f);
  this.remove();
});

// sticky buy bar after hero price box scrolls past
var bar = document.getElementById('buybar'), anchor = document.getElementById('buy');
function sync(){
  var past = anchor.getBoundingClientRect().bottom < 0;
  bar.classList.toggle('show', past);
}
window.addEventListener('scroll', sync, {passive:true});
window.addEventListener('resize', sync);
sync();

// relay clicks on the styled CTAs to the hidden Razorpay payment button
var RZP_FALLBACK_URL = 'https://razorpay.com/payment-button/pl_TbvFVlayJX8p6w/view/';
document.querySelectorAll('.rzp-trigger').forEach(function(btn){
  btn.addEventListener('click', function(e){
    e.preventDefault();

    var rzpBtn = document.querySelector('#rzpHidden a');
    if (rzpBtn) { rzpBtn.click(); return; }

    // Razorpay's script hasn't rendered its button yet (slow load, or blocked by
    // an ad/privacy blocker). Open a blank tab now, synchronously, inside this
    // click — browsers block window.open() called later from a setTimeout, so
    // we reserve the tab immediately and fill it in once we know the outcome.
    var fallbackTab = window.open('', '_blank');
    var tries = 0;
    (function tryClick(){
      rzpBtn = document.querySelector('#rzpHidden a');
      if (rzpBtn) {
        if (fallbackTab) fallbackTab.close();
        rzpBtn.click();
        return;
      }
      tries++;
      if (tries < 20) { setTimeout(tryClick, 150); return; }
      // Script never loaded at all — send them to Razorpay's hosted page instead
      if (fallbackTab) fallbackTab.location = RZP_FALLBACK_URL;
      else window.open(RZP_FALLBACK_URL, '_blank', 'noopener');
    })();
  });
});