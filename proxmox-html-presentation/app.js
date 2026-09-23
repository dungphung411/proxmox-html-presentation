const deck=document.querySelector('#deck');
const architectureSlide=deck.querySelector('.architecture-slide');
const challengeSlide=deck.querySelector('.challenge-slide');
if(architectureSlide&&challengeSlide)deck.insertBefore(challengeSlide,architectureSlide);
const slides=[...deck.querySelectorAll('.slide')];
const stage=document.querySelector('#presentationStage');
const DESIGN_WIDTH=1920,DESIGN_HEIGHT=1080;
function fitStage(){
  const scale=Math.min(window.innerWidth/DESIGN_WIDTH,window.innerHeight/DESIGN_HEIGHT);
  stage.style.setProperty('--deck-scale',scale);
}
fitStage();
window.addEventListener('resize',fitStage,{passive:true});
const durations=slides.map(s=>Number(s.dataset.duration||7));
const total=durations.reduce((a,b)=>a+b,0);
let idx=0,playing=true,timer=null,started=Date.now(),elapsedBefore=0;
const counter=document.querySelector('#counter'),clock=document.querySelector('#clock'),bar=document.querySelector('#progressBar'),playBtn=document.querySelector('#play');
const mmss=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function show(i){idx=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===idx));counter.textContent=`${String(idx+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;elapsedBefore=durations.slice(0,idx).reduce((a,b)=>a+b,0);started=Date.now();schedule();}
function schedule(){clearTimeout(timer);if(!playing)return;timer=setTimeout(()=>{ if(idx===slides.length-1){playing=false;playBtn.textContent='▶';return;} show(idx+1); },durations[idx]*1000);}
function tick(){const within=playing?(Date.now()-started)/1000:0;const elapsed=Math.min(total,elapsedBefore+within);clock.textContent=`${mmss(elapsed)} / ${mmss(total)}`;bar.style.width=`${elapsed/total*100}%`;requestAnimationFrame(tick)}
function toggle(){playing=!playing;playBtn.textContent=playing?'Ⅱ':'▶';started=Date.now();schedule()}
document.querySelector('#next').onclick=()=>show(idx+1);document.querySelector('#prev').onclick=()=>show(idx-1);playBtn.onclick=toggle;document.querySelector('#fs').onclick=()=>document.documentElement.requestFullscreen?.();
document.addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(idx+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(idx-1)}if(e.key.toLowerCase()==='f')document.documentElement.requestFullscreen?.();if(e.key.toLowerCase()==='p')toggle();});
show(0);requestAnimationFrame(tick);
