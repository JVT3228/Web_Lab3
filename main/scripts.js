// site-wide scripts

// In-page search: find and highlight matches within site-main
(function(){
  function escapeRegExp(text){
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function clearHighlights(container){
    const marks = container.querySelectorAll('mark.search-highlight');
    marks.forEach(mark=>{
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function highlightMatches(container, text){
    clearHighlights(container);
    if (!text) return 0;
    const regex = new RegExp(escapeRegExp(text), 'gi');
    let count=0;
    function walk(node){
      if (node.nodeType===3){ // text
        const m = node.data.match(regex);
        if (m){
          const frag = document.createDocumentFragment();
          let lastIndex=0;
          node.data.replace(regex, function(match, idx){
            if (idx>lastIndex){
              frag.appendChild(document.createTextNode(node.data.slice(lastIndex, idx)));
            }
            const mark = document.createElement('mark');
            mark.className='search-highlight';
            mark.textContent = match;
            frag.appendChild(mark);
            lastIndex = idx+match.length;
            count++;
          });
          if (lastIndex<node.data.length){
            frag.appendChild(document.createTextNode(node.data.slice(lastIndex)));
          }
          node.parentNode.replaceChild(frag, node);
        }
      } else if (node.nodeType===1 && node.childNodes && !['SCRIPT','STYLE','NOSCRIPT','IFRAME'].includes(node.tagName)){
        node.childNodes.forEach(child=>walk(child));
      }
    }
    walk(container);
    return count;
  }

  function searchHandler(ev){
    ev.preventDefault();
    const form = ev.currentTarget;
    const input = form.querySelector('input[type="search"]');
    if (!input) return;
    const q = input.value.trim();
    const container = document.querySelector('.site-main') || document.body;
    clearHighlights(container);
    if (!q){
      return;
    }
    const found = highlightMatches(container, q);
    // scroll to first match
    const first = container.querySelector('mark.search-highlight');
    if (first){
      first.scrollIntoView({behavior:'smooth', block:'center'});
      // briefly flash
      first.style.background = 'var(--accent)';
      setTimeout(()=>first.style.background='', 1200);
    } else {
      // no results
      alert('Ничего не найдено на странице. Попробуйте другое слово.');
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('form.header-search').forEach(f=>f.addEventListener('submit', searchHandler));
    // Register form password confirmation
    const regForm = document.querySelector('form.contacts-form');
    if (regForm && regForm.querySelector('#confirmPassword')){
      regForm.addEventListener('submit', function(e){
        const pass = regForm.querySelector('#password');
        const confirm = regForm.querySelector('#confirmPassword');
        if (pass && confirm && pass.value !== confirm.value){
          e.preventDefault();
          alert('Пароли не совпадают.');
          confirm.focus();
          return false;
        }
      });
    }
  });
})();

// Инициализация бегущих строк (ticker) — делаем содержимое достаточно длинным
// чтобы бесшовно прокручиваться от края до края экрана, независимо от ширины.
(function(){
  function initTicker(track){
    if (!track) return;
    // сохранённый оригинальный набор элементов (до клонирования)
    if (!track.dataset.orig) track.dataset.orig = track.innerHTML;
    // восстановить из исходного
    track.innerHTML = track.dataset.orig;
    // повторять исходный блок, пока ширина не превысит ширину окна
    let safety = 0;
    while (track.scrollWidth < window.innerWidth && safety < 12){
      track.innerHTML += track.dataset.orig;
      safety++;
    }
    // повторим ещё раз весь трек чтобы получить 2 одинаковые половины
    track.innerHTML = track.innerHTML + track.innerHTML;
    // подстроить длительность анимации под ширину контента (примерное значение)
    const duration = Math.max(20, Math.floor(track.scrollWidth / 60));
    track.style.animationDuration = duration + 's';
  }

  function initAllTickers(){
    document.querySelectorAll('.carousel-ticker .ticker-track').forEach(track=>initTicker(track));
  }

  // инициализируем сразу и после ресайза (debounced)
  let resizeTimeout;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(()=>{
      // сбросим и пересоздадим
      document.querySelectorAll('.carousel-ticker .ticker-track').forEach(track=>{
        // восстановим оригинал и пересчитаем
        if (track.dataset.orig) track.innerHTML = track.dataset.orig;
      });
      initAllTickers();
    }, 120);
  });

  document.addEventListener('DOMContentLoaded', ()=>initAllTickers());
})();
