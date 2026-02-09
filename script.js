(() => {
  const gift = document.getElementById('gift');
  const content = document.getElementById('content');
  const birdFormation = document.getElementById('birdFormation');
  const trailLayer = document.getElementById('trailLayer');
  const yesBtn = document.getElementById('yesBtn');
  const gifContainer = document.getElementById('gifContainer');

  // Toggle open/close
  gift.addEventListener('click', () => {
    gift.classList.toggle('open');
    if (gift.classList.contains('open')) showContent();
    else hideContent();
  });

  // Yes button handler to show bear GIF and play music
  if(yesBtn && gifContainer){
    yesBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      gifContainer.classList.remove('hidden');
      gifContainer.classList.add('visible');
      // Play music when Yes is clicked
      tryPlayAudioOnce();
      // reload Tenor embed if needed
      if(window.twttr && window.twttr.widgets) window.twttr.widgets.load();
      if(window.Tenor) window.Tenor.lib.render(gifContainer);
    });
    // close GIF on outside click
    document.addEventListener('click', (e)=>{
      if(!gifContainer.contains(e.target) && !yesBtn.contains(e.target)){
        gifContainer.classList.remove('visible');
        setTimeout(()=> gifContainer.classList.add('hidden'), 400);
      }
    });
  }

  let birdsCreated = false;
  const imageNames = ['PIC1.jpg','PIC2.jpg','PIC3.jpg','PIC4.jpg','PIC5.jpg'];

  function showContent(){
    content.classList.remove('hidden');
    // small delay to let box lid open
    setTimeout(()=> content.classList.add('visible'), 420);
    // create birds if needed and animate them into formation
    if(!birdsCreated){ populateBirds(); birdsCreated = true; }
    animateBirds();
    // burst confetti for celebration
    burstConfetti();
  }

  function hideContent(){
    content.classList.remove('visible');
    // fade out birds
    const birds = birdFormation.querySelectorAll('.bird-item');
    birds.forEach(b => b.classList.remove('show'));
    setTimeout(()=> content.classList.add('hidden'), 360);
  }

  // Cursor image wave trail (use PIC filenames)
  const imageSources = imageNames.map(n => `images/${n}`);

  let trailParticles = [];

  window.addEventListener('mousemove', (e) => {
    spawnParticle(e.clientX, e.clientY);
  });

  function spawnParticle(x,y){
    const el = document.createElement('div');
    el.className = 'trail-item';
    const img = document.createElement('img');
    // cycle through images so user sees all pictures more predictably
    spawnParticle.counter = (spawnParticle.counter || 0) % imageNames.length;
    const name = imageNames[spawnParticle.counter++];
    // prefer images/ but fallback to root if missing
    img.src = `images/${name}`;
    img.onerror = () => { if(!img.src.startsWith('./')) img.src = `./${name}` };
    el.appendChild(img);
    trailLayer.appendChild(el);

    const lifetime = 1200 + Math.random()*600;
    const birth = performance.now();
    const speed = 0.45 + Math.random()*0.9;
    const amp = 12 + Math.random()*22;
    const freq = 0.004 + Math.random()*0.01;
    const dir = (Math.random()>0.5?1:-1);

    const p = {el,x,y,birth,lifetime,speed,amp,freq,dir};
    el.style.left = (x - 24) + 'px';
    el.style.top = (y - 24) + 'px';
    trailParticles.push(p);
  }

  function animate(now){
    for(let i = trailParticles.length-1;i>=0;i--){
      const p = trailParticles[i];
      const t = now - p.birth;
      if (t > p.lifetime){ p.el.remove(); trailParticles.splice(i,1); continue; }
      const life = t / p.lifetime;
      const dy = - p.speed * t * 0.06;
      const dx = Math.sin(t * p.freq) * p.amp * p.dir * (1 - life);
      const scale = 1 - life*0.35;
      const opacity = 1 - life;
      p.el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      p.el.style.opacity = opacity;
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
  // Background music handling
  const audio = document.getElementById('bgAudio');
  const musicBtn = document.getElementById('musicBtn');
  if(musicBtn && audio){
    musicBtn.addEventListener('click', ()=>{
      if(audio.paused){
        audio.currentTime = 0;
        audio.play().catch(err => console.error('Music play error:', err));
        musicBtn.textContent = '⏸ Music';
        musicBtn.setAttribute('aria-pressed','true');
      } else {
        audio.pause();
        musicBtn.textContent = '▶ Music';
        musicBtn.setAttribute('aria-pressed','false');
      }
    });
  }

  // Attempt to locate MP3 file among common candidate names (handles spaces/parentheses)
  (function resolveAudioSrc(){
    if(!audio) return;
    
    // Try multiple candidate paths in order of likelihood
    const candidates = [
      'wave to earth - love. (Official Lyric Video).mp3',
      'love-wave-to-earth.mp3',
      'Love.mp3',
      'audio/wave to earth - love. (Official Lyric Video).mp3',
      'audio/love-wave-to-earth.mp3',
    ];
    
    let currentIndex = 0;
    
    const tryNextUrl = () => {
      if(currentIndex >= candidates.length){
        console.warn('⚠️ No audio file found. Please add MP3 to root directory.');
        return;
      }
      const url = candidates[currentIndex];
      audio.src = url;
      console.log(`🎵 Trying audio: ${url}`);
      currentIndex++;
    };
    
    tryNextUrl();
    
    // Listen for canplay event (successful load)
    audio.addEventListener('canplay', () => {
      console.log(`✅ Audio loaded successfully: ${audio.src}`);
    }, {once: false});
    
    // Listen for errors and try next candidate
    audio.addEventListener('error', () => {
      console.log(`❌ Failed to load: ${audio.src}, trying next...`);
      tryNextUrl();
    });
  })();

  function tryPlayAudioOnce(){
    if(!audio) return;
    audio.loop = false;
    audio.currentTime = 0; // Reset to start
    const playPromise = audio.play();
    if(playPromise !== undefined){
      playPromise.then(()=>{
        console.log('🎶 Music playing!');
        if(musicBtn){ 
          musicBtn.textContent = '⏸ Music'; 
          musicBtn.setAttribute('aria-pressed','true'); 
        }
      }).catch((error)=>{
        console.error('❌ Playback failed:', error);
      });
    }
  }

  // populate the bird formation with image items
  function populateBirds(){
    if(!birdFormation) return;
    imageNames.forEach((name, idx)=>{
      const item = document.createElement('div');
      item.className = 'bird-item';
      const img = document.createElement('img');
      // try images/ then fallback to root
      img.src = `images/${name}`;
      img.onerror = () => { if(img.src.indexOf(name)===-1) img.src = name; else if(!img.src.startsWith('./')) img.src = `./${name}` };
      item.appendChild(img);
      birdFormation.appendChild(item);
    });
  }

  // Animate birds into view with pop animation
  function animateBirds(){
    if(!birdFormation) return;
    const birds = Array.from(birdFormation.querySelectorAll('.bird-item'));
    birds.forEach((b)=>{
      // CSS animation delay handles the stagger timing
      b.classList.add('show');
    });
  }

  // Confetti burst implementation
  const confettiLayer = document.getElementById('confettiLayer');
  function burstConfetti(){
    if(!confettiLayer) return;
    const count = 36;
    const rect = gift.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/6;
    for(let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'confetti';
      el.style.background = randomColor();
      el.style.left = `${centerX}px`;
      el.style.top = `${centerY}px`;
      confettiLayer.appendChild(el);
      animateConfetti(el);
    }
    setTimeout(()=>{
      confettiLayer.querySelectorAll('.confetti').forEach(c=>c.remove());
    }, 3600);
  }

  function animateConfetti(el){
    const dx = (Math.random()-0.5) * 720;
    const dy = - (200 + Math.random()*420);
    const rot = (Math.random()*720) * (Math.random()>0.5?1:-1);
    const dur = 1400 + Math.random()*900;
    el.animate([
      {transform:`translate(0px,0px) rotate(0deg)`, opacity:1},
      {transform:`translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity:0.15}
    ], {duration: dur, easing: 'cubic-bezier(.2,.7,.2,1)', fill:'forwards'});
  }

  function randomColor(){
    const palette = ['#ff5d8f','#ffd166','#9be7ff','#ffb3c6','#c78bff','#ff8a5b'];
    return palette[Math.floor(Math.random()*palette.length)];
  }

  // Accessibility: press Enter/Space to toggle gift
  gift.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); gift.click(); }
  });

})();
