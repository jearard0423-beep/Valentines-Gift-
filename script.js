(() => {
  const gift = document.getElementById('gift');
  const content = document.getElementById('content');
  const birdFormation = document.getElementById('birdFormation');
  const trailLayer = document.getElementById('trailLayer');
  const yesBtn = document.getElementById('yesBtn');
  const gifContainer = document.getElementById('gifContainer');

  // Toggle open/close with a short debounce to avoid accidental double-toggles
  let giftAnimating = false;
  // Toggle open/close
  gift.addEventListener('click', () => {
    if (giftAnimating) return;
    giftAnimating = true;
    // Keep toggling locked for the duration of the lid animation
    setTimeout(() => { giftAnimating = false; }, 900);

    gift.classList.toggle('open');
    if (gift.classList.contains('open')) showContent();
    else hideContent();
  });

  // Yes button handler to show bear GIF and play music
  if(yesBtn && gifContainer){
    yesBtn.addEventListener('click', (e)=>{
      try{
        e.stopPropagation();
        gifContainer.classList.remove('hidden');
        gifContainer.classList.add('visible');
        // Burst petals animation
        burstPetals();
        // Play music when Yes is clicked (after user gesture)
        // Ensure audio src is present and attempt direct playback on this user gesture.
        try {
          if(audio && (!audio.src || audio.src === window.location.href || audio.src.endsWith('/'))){
            audio.src = 'wavetoearth.mp3';
          }
          if(audio) {
            // configure audio for playback
            audio.currentTime = 0;
            audio.muted = false;
            audio.volume = 0.8;
            audio.loop = true;
            // Attempt to play immediately as this is a user gesture (best chance to satisfy autoplay policies)
            const p = audio.play();
            if(p && p.catch) p.catch(err => {
              console.warn('Direct play failed, will try a short delayed play:', err);
              setTimeout(tryPlayAudioOnce, 160);
            });
          }
        } catch (errAudio) {
          console.warn('Audio setup/playback failed:', errAudio);
          setTimeout(tryPlayAudioOnce, 160);
        }
        // reload Tenor embed if needed (guard deeply)
        try{
          if(window.twttr && window.twttr.widgets) window.twttr.widgets.load();
          if(window.Tenor && window.Tenor.lib && typeof window.Tenor.lib.render === 'function') window.Tenor.lib.render(gifContainer);
        }catch(e){ console.warn('Embed render failed:', e); }
      }catch(handlerError){
        console.error('Error in yesBtn handler:', handlerError);
        showAudioError('An unexpected error occurred. See console for details.');
      }
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
    setTimeout(()=> {
      content.classList.add('visible');
      // Animate letter container slide in
      const letterContainer = document.querySelector('.letter-container');
      if(letterContainer) letterContainer.classList.add('slide-in');
      // Animate bird formation slide in
      const birdFormation = document.querySelector('.bird-formation');
      if(birdFormation) birdFormation.classList.add('slide-in-right');
    }, 420);
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
    // Images are in root directory
    img.src = name;
    img.alt = 'Trail particle';
    img.onerror = () => { 
      if(!img.src.includes('/')) img.src = `/${name}`;
    };
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
  
  // Track if user has interacted with page
  let userInteracted = false;
  document.addEventListener('click', () => { userInteracted = true; }, {once: true});
  document.addEventListener('touchstart', () => { userInteracted = true; }, {once: true});
  
  // Music will be controlled via the Yes button; inline play button removed.

  // Attempt to load audio with proper error handling
  (function resolveAudioSrc(){
    if(!audio) return;
    
    // Set audio src directly to the exact filename
    audio.src = 'wavetoearth.mp3';
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.muted = true;  // Start muted for autoplay policies
    console.log(`🎵 Audio source set to: ${audio.src}`);
    
    // Start loading immediately
    audio.load();
    
    // Listen for successful load
    audio.addEventListener('canplay', () => {
      console.log(`✅ Audio can play (duration: ${audio.duration.toFixed(2)}s)`);
    });
    
    audio.addEventListener('canplaythrough', () => {
      console.log(`✅ Audio fully buffered`);
    });
    
    // Handle loading errors
    audio.addEventListener('error', (err) => {
      console.error(`❌ Audio failed to load:`, err.target.error?.message || 'Unknown error');
    });
  })();

  function tryPlayAudioOnce(){
    if(!audio) return;
    console.log('🎵 Attempting to play audio after user interaction...');
    
    // Reset audio state
    audio.currentTime = 0;
    audio.volume = 0.8;
    audio.muted = false;  // Unmute when user interacts
    audio.loop = true;
    
    // Ensure audio is playing
    if(audio.paused) {
      // Attempt playback
      const playPromise = audio.play();
      
      if(playPromise === undefined){
        console.log('⚠️ Browser does not support play() promise');
        if(musicBtn){
          musicBtn.textContent = '⏸ Music';
          musicBtn.setAttribute('aria-pressed', 'true');
        }
        return;
      }
      
      playPromise
        .then(() => {
          console.log('✅ Audio playing successfully!');
          clearAudioError();
          if(musicBtn){
            musicBtn.textContent = '⏸ Music';
            musicBtn.setAttribute('aria-pressed', 'true');
          }
        })
        .catch((error) => {
          console.error('❌ Play failed:', error.name, '-', error.message);
          console.log('📊 Audio state:', {
            paused: audio.paused,
            muted: audio.muted,
            volume: audio.volume,
            src: audio.src,
            readyState: audio.readyState,
            networkState: audio.networkState
          });
          showAudioError(`Audio failed to play: ${error.message || error.name}`);
        });
    }
  }

  // Show a small audio status message next to the letter and highlight the Yes button
  function showAudioError(msg){
    try{
      let status = document.getElementById('audioStatus');
      const container = document.querySelector('.letter-container .letter-content') || document.querySelector('.letter-container');
      if(!status){
        status = document.createElement('div');
        status.id = 'audioStatus';
        status.className = 'audio-status';
        if(container) container.appendChild(status);
        else if(content) content.appendChild(status);
      }
      status.textContent = msg;
      if(yesBtn) yesBtn.classList.add('error');
    }catch(e){ console.warn('Could not show audio status:', e); }
  }

  function clearAudioError(){
    try{
      const status = document.getElementById('audioStatus');
      if(status) status.remove();
      if(yesBtn) yesBtn.classList.remove('error');
    }catch(e){ /* ignore */ }
  }

  // populate the bird formation with image items
  function populateBirds(){
    if(!birdFormation) return;
    imageNames.forEach((name, idx)=>{
      const item = document.createElement('div');
      item.className = 'bird-item';
      const img = document.createElement('img');
      // Images are in root directory, not in images/ folder
      img.src = name;
      img.alt = `Picture ${idx + 1}`;
      img.onerror = () => { 
        console.error(`Failed to load image: ${img.src}`);
        // Try with explicit path if needed
        if(!img.src.includes('/')) img.src = `/${name}`;
      };
      img.addEventListener('load', () => {
        console.log(`✅ Image loaded: ${name}`);
      });
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

  // Petal burst animation on Yes click - flower grenade effect
  function burstPetals(){
    const petalCount = 64;
    const gifContainer = document.getElementById('gifContainer');
    const rect = gifContainer ? gifContainer.getBoundingClientRect() : {left: window.innerWidth/2, top: window.innerHeight/2, width: 0, height: 0};
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    
    for(let i = 0; i < petalCount; i++){
      const petal = document.createElement('div');
      petal.className = 'petal';
      const angle = (i / petalCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = 150 + Math.random() * 450;
      const velocity = 0.8 + Math.random() * 0.8;
      const tx = Math.cos(angle) * distance * velocity;
      const ty = Math.sin(angle) * distance * velocity;
      
      petal.style.background = randomColor();
      petal.style.left = centerX + 'px';
      petal.style.top = centerY + 'px';
      petal.style.setProperty('--tx', tx + 'px');
      petal.style.setProperty('--ty', ty + 'px');
      document.body.appendChild(petal);
      
      const duration = 1800 + Math.random() * 800; // Slower: 1800-2600ms
      const delay = Math.random() * 100;
      petal.animate([
        {opacity: 1, transform: 'translate(0, 0) scale(1) rotate(0deg)'},
        {opacity: 0, transform: `translate(${tx}px, ${ty}px) scale(0.1) rotate(720deg)`}
      ], {
        duration: duration,
        delay: delay,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'forwards'
      });
      
      setTimeout(() => petal.remove(), duration + delay);
    }
  }

  // Accessibility: press Enter/Space to toggle gift
  gift.addEventListener('keydown', (ev)=>{
    if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); gift.click(); }
  });

})();
