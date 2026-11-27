(() => {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d', { alpha: true });
  let stars = [], width = 0, height = 0, raf = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(180, Math.floor(width * height / 8500));
    stars = Array.from({length: count}, () => ({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.25+.25,a:Math.random()*.65+.2,p:Math.random()*Math.PI*2,s:Math.random()*.006+.002}));
  }
  function draw(t=0) {
    ctx.clearRect(0,0,width,height);
    for(const s of stars){const twinkle = reduced ? 1 : .72 + Math.sin(t*s.s+s.p)*.28;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle='rgba(166,210,255,'+(s.a*twinkle)+')';ctx.fill();if(s.r>1.1){ctx.fillStyle='rgba(65,160,255,'+(s.a*twinkle*.16)+')';ctx.fillRect(s.x-3,s.y-.4,6,.8);}}
    if(!reduced) raf = requestAnimationFrame(draw);
  }
  resize(); draw(); window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();draw();},{passive:true});

  const fill = document.getElementById('scrollMeterFill');
  const updateScroll = () => { const max = document.documentElement.scrollHeight - innerHeight; fill.style.height = (max > 0 ? scrollY/max*100 : 0) + '%'; };
  addEventListener('scroll',updateScroll,{passive:true}); updateScroll();

  const menuButton = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  function closeMenu(){menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Ouvrir le menu');}
  menuButton.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

  // Sound is opt-in. The toggle produces a short, quiet synthesized UI tone only after a user gesture.
  const soundButton = document.getElementById('soundToggle');
  let audioContext = null, soundOn = false;
  soundButton.addEventListener('click',()=>{
    soundOn=!soundOn;
    soundButton.setAttribute('aria-pressed',String(soundOn));
    soundButton.querySelector('span:last-child').textContent=soundOn?'SON ON':'SON OFF';
    if(soundOn){try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(660,audioContext.currentTime);osc.frequency.exponentialRampToValueAtTime(440,audioContext.currentTime+.12);gain.gain.setValueAtTime(.025,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.16);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.17);}catch(e){soundOn=false;soundButton.setAttribute('aria-pressed','false');soundButton.querySelector('span:last-child').textContent='SON OFF';}}
  });

  // Subtle pointer parallax on the hero illustration; disabled for touch and reduced motion.
  if(!reduced && matchMedia('(pointer:fine)').matches){
    const scene=document.querySelector('.orbit-scene');
    addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);scene.style.transform='translate3d('+x*10+'px,'+y*8+'px,0)';},{passive:true});
  }
})();