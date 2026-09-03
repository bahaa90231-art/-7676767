const root=document.documentElement;
const savedTheme=localStorage.getItem('novel-theme');
if(savedTheme==='dark') document.body.classList.add('dark');
const themeBtn=document.getElementById('themeBtn');
if(themeBtn) themeBtn.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('novel-theme',document.body.classList.contains('dark')?'dark':'light')});
let fontSize=parseInt(localStorage.getItem('novel-font')||'19');
function changeFont(step){fontSize=Math.min(24,Math.max(15,fontSize+step));localStorage.setItem('novel-font',fontSize);document.querySelectorAll('.chapter-body,.reader-intro').forEach(x=>x.style.fontSize=fontSize+'px')}
function updateProgress(){const h=document.documentElement.scrollHeight-window.innerHeight;const p=h>0?Math.round((window.scrollY/h)*100):0;const el=document.getElementById('progressText');if(el)el.textContent=p+'%'}
window.addEventListener('scroll',updateProgress);updateProgress();
document.querySelectorAll('#toc a').forEach(a=>{if(location.pathname.endsWith(a.getAttribute('href')))a.classList.add('active')});
