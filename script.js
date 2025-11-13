/*
  script.js - 各章題庫與檢查邏輯（前端單檔）
  此檔會在每個頁面載入時檢查 DOM，並在對應容器渲染題目。
*/

document.addEventListener('DOMContentLoaded', () => {
  // inject floating quiz button + modal on all pages
  injectFloatingQuizButton();

  if (document.getElementById('quiz-root')) {
    renderQuiz();
    document.getElementById('checkQuiz').addEventListener('click', checkQuiz);
  }
  if (document.getElementById('grammar-root')) {
    renderGrammar();
    document.getElementById('checkGrammar').addEventListener('click', checkGrammar);
  }

  if (document.getElementById('vocab-form')) {
    renderVocab();
    document.getElementById('checkVocab').addEventListener('click', checkVocab);
  }

  if (document.getElementById('reading-root')) {
    renderReading();
    document.getElementById('checkReading').addEventListener('click', checkReading);
  }
});

/* -------------------- 第一章：文法（單選 x10） -------------------- */
const grammarQuestions = [
  {q: "Q1. The manager asked everyone to arrive ______ 8:30 for the morning meeting.",
   opts: {A:'in',B:'at',C:'on',D:'by'}, ans: 'B'},
  {q: "Q2. Our company plans to ______ its new product line next month.",
   opts: {A:'launch',B:'inform',C:'discuss',D:'prevent'}, ans: 'A'},
  {q: "Q3. The meeting has been postponed ______ further notice.",
   opts: {A:'unless',B:'until',C:'since',D:'despite'}, ans: 'B'},
  {q: "Q4. Please make sure that all documents are ______ before you submit them.",
   opts: {A:'reviewing',B:'review',C:'reviewed',D:'reviews'}, ans: 'C'},
  {q: "Q5. Due to the heavy rain, the outdoor concert was ______ canceled.",
   opts: {A:'recently',B:'originally',C:'eventually',D:'temporarily'}, ans: 'C'},
  {q: "Q6. The new intern was praised for her ability to handle tasks ______.",
   opts: {A:'efficiently',B:'efficiency',C:'efficient',D:"efficiency’s"}, ans: 'A'},
  {q: "Q7. Customers who purchase more than $50 will receive a free ______.",
   opts: {A:'sample',B:'service',C:'advice',D:'permission'}, ans: 'A'},
  {q: "Q8. The hotel offers complimentary breakfast for all ______ guests.",
   opts: {A:'register',B:'registers',C:'registration',D:'registered'}, ans: 'D'},
  {q: "Q9. Because of the new policy, employees must submit their reports ______ the deadline.",
   opts: {A:'above',B:'beyond',C:'before',D:'over'}, ans: 'C'},
  {q: "Q10. Mr. Chen was promoted to sales manager ______ his outstanding performance.",
   opts: {A:'because',B:'due to',C:'although',D:'even though'}, ans: 'B'}
];

/* -------------------- 新增：Quiz（Moodle 與線上學習平台基礎） -------------------- */
const quizQuestions = [
  {q: 'What is Moodle mainly used for?', opts: {A:'Watching movies', B:'Online learning and course management', C:'Playing games', D:'Social networking'}, ans: 'B'},
  {q: 'Which of the following is NOT a feature of Moodle?', opts: {A:'Discussion forums', B:'Quizzes', C:'Video streaming platform', D:'Assignments'}, ans: 'C'},
  {q: 'Teachers can use Moodle to:', opts: {A:'Manage grades', B:'Sell products', C:'Make 3D animations', D:'Play music'}, ans: 'A'},
  {q: 'Moodle courses are organized using:', opts: {A:'Timelines only', B:'Workshops only', C:'Sections and activities', D:'Spreadsheets'}, ans: 'C'},
  {q: 'Which role typically has the most control over a Moodle course?', opts: {A:'Student', B:'Guest', C:'Teacher', D:'Observer'}, ans: 'C'},
  {q: 'Which activity allows teachers to give quizzes in Moodle?', opts: {A:'Forum', B:'Quiz', C:'Book', D:'Glossary'}, ans: 'B'},
  {q: 'Moodle is an example of which type of software?', opts: {A:'Operating system', B:'Learning Management System', C:'Database engine', D:'Graphic editor'}, ans: 'B'},
  {q: 'Which of the following helps students collaborate in Moodle?', opts: {A:'Discussion forums', B:'Anti-virus', C:'Video codecs', D:'Printer settings'}, ans: 'A'},
  {q: 'A teacher wants to collect assignments from students. Which Moodle tool should they use?', opts: {A:'Assignment', B:'Chat', C:'Calendar', D:'Profile'}, ans: 'A'},
  {q: 'Which of these can be used to track student progress in Moodle?', opts: {A:'Gradebook', B:'Wallpaper', C:'File explorer', D:'Image editor'}, ans: 'A'}
];

function renderQuiz(){
  const root = document.getElementById('quiz-root');
  if (root) renderQuizInto(root, 'quiz_');
}

function checkQuiz(){
  const root = document.getElementById('quiz-root');
  if (root) checkQuizGeneric('quiz_', root, 'quiz-result');
}

// Generic render function for quizzes into any container with a namePrefix for inputs
function renderQuizInto(rootElement, namePrefix){
  rootElement.innerHTML = '';
  quizQuestions.forEach((item, idx) => {
    const qBox = document.createElement('div'); qBox.className='question';
    const title = document.createElement('div'); title.className='q-title';
    title.textContent = `${idx+1}. ${item.q}`; qBox.appendChild(title);
    const opts = document.createElement('div'); opts.className='options';
    Object.keys(item.opts).forEach(key => {
      const label = document.createElement('label'); label.className='option-item';
      const radio = document.createElement('input'); radio.type='radio'; radio.name = `${namePrefix}${idx}`; radio.value = key; label.appendChild(radio);
      const span = document.createElement('span'); span.textContent = `${key}. ${item.opts[key]}`; label.appendChild(span);
      opts.appendChild(label);
    });
    qBox.appendChild(opts);
    rootElement.appendChild(qBox);
  });
}

// Generic check function for quiz rendered into a rootElement. namePrefix must match renderQuizInto
function checkQuizGeneric(namePrefix, rootElement, resultId){
  let score = 0;
  const qNodes = Array.from(rootElement.querySelectorAll('.question'));
  quizQuestions.forEach((item, idx) => {
    const sel = rootElement.querySelector(`input[name=${namePrefix}${idx}]:checked`);
    const qNode = qNodes[idx];
    if (!qNode) return;
    qNode.classList.remove('correct','wrong');
    const oldfb = qNode.querySelector('.feedback'); if (oldfb) oldfb.remove();
    if (sel && sel.value === item.ans){
      score++;
      qNode.classList.add('correct');
    } else {
      qNode.classList.add('wrong');
      let fb = document.createElement('div'); fb.className='feedback'; fb.textContent = `正確答案：${item.ans}. ${item.opts[item.ans]}`; qNode.appendChild(fb);
    }
  });
  const existing = document.getElementById(resultId); if (existing) existing.remove();
  const res = document.createElement('div'); res.id = resultId; res.className='result'; res.innerHTML = `<strong>得分：</strong> ${score} / ${quizQuestions.length}`;
  // if rootElement is inside a modal/container, append to nearest .container or body
  const container = rootElement.closest('.container') || document.querySelector('.container') || document.body;
  container.appendChild(res);
}

function renderGrammar(){
  const root = document.getElementById('grammar-root');
  root.innerHTML = '';
  grammarQuestions.forEach((item, idx) => {
    const qBox = document.createElement('div');
    qBox.className = 'question';

    const title = document.createElement('div');
    title.className = 'q-title';
    title.textContent = `${idx+1}. ${item.q}`;
    qBox.appendChild(title);

    const opts = document.createElement('div');
    opts.className = 'options';
    Object.keys(item.opts).forEach(key => {
      const label = document.createElement('label');
      label.className = 'option-item';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `g_${idx}`;
      radio.value = key;
      label.appendChild(radio);
      const span = document.createElement('span');
      span.textContent = `${key}. ${item.opts[key]}`;
      label.appendChild(span);
      opts.appendChild(label);
    });
    qBox.appendChild(opts);
    root.appendChild(qBox);
  });
}

function checkGrammar(){
  let score = 0;
  grammarQuestions.forEach((item, idx) => {
    const sel = document.querySelector(`input[name=g_${idx}]:checked`);
    const qNode = document.getElementsByClassName('question')[idx];
    // 清除先前標記
    qNode.classList.remove('correct','wrong');
    // 顯示結果
    if (sel && sel.value === item.ans){
      score += 1;
      qNode.classList.add('correct');
    } else {
      qNode.classList.add('wrong');
      // 顯示正確答案小提示
      let fb = qNode.querySelector('.feedback');
      if (!fb){
        fb = document.createElement('div'); fb.className='feedback muted';
        qNode.appendChild(fb);
      }
      fb.textContent = `正確答案：${item.ans}. ${item.opts[item.ans]}`;
    }
  });

  // 顯示總分
  const existing = document.getElementById('grammar-result');
  if (existing) existing.remove();
  const res = document.createElement('div');
  res.id = 'grammar-result';
  res.className = 'result';
  res.innerHTML = `<strong>得分：</strong> ${score} / ${grammarQuestions.length}`;
  document.querySelector('.container').appendChild(res);
}

/* -------------------- 第二章：拼字（填寫 x10） -------------------- */
// Vocabulary for Chapter 2: E-learning Vocabulary (user-provided list)
const vocabQuestions = [
  {num:1, hint:'平台', answer:'platform'},
  {num:2, hint:'作業', answer:'assignment'},
  {num:3, hint:'測驗', answer:'quiz'},
  {num:4, hint:'帳號', answer:'account'},
  {num:5, hint:'上傳', answer:'upload'},
  {num:6, hint:'討論區', answer:'forum'},
  {num:7, hint:'教師', answer:'teacher'},
  {num:8, hint:'學生', answer:'student'},
  {num:9, hint:'課程', answer:'course'},
  {num:10, hint:'成績', answer:'grade'}
];
let currentVocabIndex = 0;
let vocabScore = 0;
let vocabChecked = false; // whether current word has been checked (to toggle Next)

function renderVocab(){
  const container = document.getElementById('vocab-form');
  container.innerHTML = '';

  // top info
  const info = document.createElement('div'); info.className = 'q-title';
  info.id = 'vocab-hint';
  container.appendChild(info);

  const wrapper = document.createElement('div'); wrapper.className = 'tiles-wrapper';

  const slotsContainer = document.createElement('div'); slotsContainer.className = 'slots-container'; slotsContainer.id = 'slots-container';
  wrapper.appendChild(slotsContainer);

  const tilesContainer = document.createElement('div'); tilesContainer.className = 'tiles-container'; tilesContainer.id = 'tiles-container';
  wrapper.appendChild(tilesContainer);

  container.appendChild(wrapper);

  const smallControls = document.createElement('div'); smallControls.className = 'small-controls';
  const resetBtn = document.createElement('button'); resetBtn.className = 'btn small'; resetBtn.type='button'; resetBtn.textContent = '重設';
  resetBtn.addEventListener('click', () => { setupVocabFor(currentVocabIndex); });
  smallControls.appendChild(resetBtn);

  const revealBtn = document.createElement('button'); revealBtn.className = 'btn small ghost'; revealBtn.type='button'; revealBtn.textContent = '揭示答案';
  revealBtn.addEventListener('click', () => { revealVocabAnswer(); });
  smallControls.appendChild(revealBtn);

  // Next button (hidden until user checks)
  const nextBtn = document.createElement('button'); nextBtn.className='btn small'; nextBtn.type='button'; nextBtn.id='vocabNextBtn'; nextBtn.textContent='Next'; nextBtn.style.display='none';
  nextBtn.addEventListener('click', () => { goToNextVocab(); });
  smallControls.appendChild(nextBtn);

  container.appendChild(smallControls);

  // navigation hint
  updateVocabUI();
  setupVocabFor(currentVocabIndex);
}

function updateVocabUI(){
  const info = document.getElementById('vocab-hint');
  const item = vocabQuestions[currentVocabIndex];
  info.textContent = `${item.num}. ${item.hint} （拼字長度: ${item.answer.length}）`;
  // reset check button text
  const btn = document.getElementById('checkVocab'); if (btn) { btn.textContent = 'Check'; }
  vocabChecked = false;
}

function setupVocabFor(index){
  const item = vocabQuestions[index];
  const slotsContainer = document.getElementById('slots-container');
  const tilesContainer = document.getElementById('tiles-container');
  slotsContainer.innerHTML = '';
  tilesContainer.innerHTML = '';

  const letters = item.answer.split('');
  // scramble
  const scrambled = shuffleArray(letters.slice());

  // create slots
  letters.forEach((ltr, i) => {
    const slot = document.createElement('div'); slot.className = 'slot'; slot.dataset.index = i;
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', slotDropHandler);
    // allow clicking to remove tile
    slot.addEventListener('click', () => { if (slot.firstChild) moveTileToContainer(slot.firstChild); });
    slotsContainer.appendChild(slot);
  });

  // create tiles
  scrambled.forEach((ltr, i) => {
    const tile = document.createElement('div'); tile.className = 'tile'; tile.draggable = true;
    tile.id = `tile_${index}_${i}`; tile.dataset.letter = ltr; tile.textContent = ltr;
    tile.addEventListener('dragstart', tileDragStart);
    tile.addEventListener('click', () => { moveTileToFirstEmptySlot(tile); });
    tilesContainer.appendChild(tile);
  });

  // allow drop back to tiles container
  tilesContainer.addEventListener('dragover', e => e.preventDefault());
  tilesContainer.addEventListener('drop', e => {
    e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); const tile = document.getElementById(id); if (tile) tilesContainer.appendChild(tile);
  });

  // clear any previous result
  const existing = document.getElementById('vocab-result'); if (existing) existing.remove();
}

function tileDragStart(e){ e.dataTransfer.setData('text/plain', e.target.id); }

function slotDropHandler(e){
  e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); const tile = document.getElementById(id); if (!tile) return;
  const slot = e.currentTarget;
  // if slot has child, move it back
  if (slot.firstChild){ moveTileToContainer(slot.firstChild); }
  slot.appendChild(tile);
}

function moveTileToContainer(tile){ const tilesContainer = document.getElementById('tiles-container'); tilesContainer.appendChild(tile); }

function moveTileToFirstEmptySlot(tile){ const slots = Array.from(document.querySelectorAll('.slot')); const empty = slots.find(s => !s.firstChild); if (empty){ empty.appendChild(tile); } }

function revealVocabAnswer(){
  const item = vocabQuestions[currentVocabIndex];
  const slots = Array.from(document.querySelectorAll('.slot'));
  // clear slots and place correct letters
  slots.forEach((s, i) => {
    // remove existing tile if any
    if (s.firstChild) moveTileToContainer(s.firstChild);
  });
  // create temporary tiles for correct answer and append in order
  const tilesContainer = document.getElementById('tiles-container');
  // remove any existing correct-display tiles
  item.answer.split('').forEach((ltr, i) => {
    const temp = document.createElement('div'); temp.className='tile'; temp.textContent = ltr; temp.draggable = false;
    const slot = document.querySelector(`.slot[data-index='${i}']`);
    if (slot) slot.appendChild(temp);
  });
}

function checkVocab(){
  // evaluate current word when Check pressed; Next is handled by separate next button
  const item = vocabQuestions[currentVocabIndex];
  const slots = Array.from(document.querySelectorAll('.slot'));
  let user = slots.map(s => s.firstChild ? s.firstChild.dataset.letter || s.firstChild.textContent : '').join('');
  // mark slots
  slots.forEach(s => s.classList.remove('correct','wrong'));
  const existing = document.getElementById('vocab-result'); if (existing) existing.remove();
  if (user.toLowerCase() === item.answer.toLowerCase()){
    // correct
    slots.forEach(s => s.classList.add('correct'));
    vocabScore++;
    vocabChecked = true;
    // show partial result
    const res = document.createElement('div'); res.id='vocab-result'; res.className='result correct'; res.innerHTML = `<strong>本題正確！</strong> 目前得分：${vocabScore} / ${vocabQuestions.length}`;
    document.querySelector('.container').appendChild(res);
  } else {
    // wrong
    slots.forEach(s => s.classList.add('wrong'));
    vocabChecked = false;
    const res = document.createElement('div'); res.id='vocab-result'; res.className='result wrong'; res.innerHTML = `<strong>答案不正確。</strong> 本題正確拼字為：${item.answer}`;
    document.querySelector('.container').appendChild(res);
  }
  // show Next button so user can proceed
  const nextBtn = document.getElementById('vocabNextBtn'); if (nextBtn) nextBtn.style.display = 'inline-block';
}

function goToNextVocab(){
  currentVocabIndex++;
  const nextBtn = document.getElementById('vocabNextBtn');
  const checkBtn = document.getElementById('checkVocab');
  if (currentVocabIndex >= vocabQuestions.length){
    // show final score
    const existing = document.getElementById('vocab-result'); if (existing) existing.remove();
    const res = document.createElement('div'); res.id='vocab-result'; res.className='result'; res.innerHTML = `<strong>完成！總分：</strong> ${vocabScore} / ${vocabQuestions.length}`;
    document.querySelector('.container').appendChild(res);
    if (nextBtn) nextBtn.style.display = 'none';
    if (checkBtn) checkBtn.disabled = true;
  } else {
    // move to next
    updateVocabUI();
    setupVocabFor(currentVocabIndex);
    if (nextBtn) nextBtn.style.display = 'none';
    if (checkBtn) checkBtn.disabled = false;
  }
}

// Utility: shuffle array (Fisher-Yates)
function shuffleArray(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* -------------------- 第三章：閱讀理解（段落 + 每篇 3 題） -------------------- */
const readingPassages = [
  {
    passage: `Maria works at a small software company. Every morning she reviews the project schedule and meets with her team to set priorities. Last month, the company launched a new mobile app that has received positive feedback from users. Maria plans to continue improving the user interface based on customer suggestions.`,
    questions: [
      {q:'Why does Maria meet with her team each morning?', opts:{A:'To hire new staff',B:'To set priorities',C:'To count inventory',D:'To plan vacations'}, ans:'B'},
      {q:'What did the company launch last month?', opts:{A:'A marketing campaign',B:'A new office',C:'A mobile app',D:'A training course'}, ans:'C'},
      {q:'What will Maria do based on customer suggestions?', opts:{A:'Hire more staff',B:'Improve the interface',C:'Close the app',D:'Change the team'}, ans:'B'}
    ]
  },
  {
    passage: `The city library recently introduced extended hours to accommodate students who study late. The library also added more study spaces and upgraded its Wi-Fi network. As a result, visitor numbers have increased, especially in the evenings.`,
    questions: [
      {q:'Why did the library extend its hours?', opts:{A:'To renovate',B:'To accommodate students',C:'To reduce costs',D:'To hire staff'}, ans:'B'},
      {q:'What improvement was NOT mentioned?', opts:{A:'More study spaces',B:'Upgraded Wi-Fi',C:'New books',D:'Extended hours'}, ans:'C'},
      {q:'When did visitor numbers increase?', opts:{A:'Mornings',B:'Afternoons',C:'Evenings',D:'Weekends'}, ans:'C'}
    ]
  }
];

function renderReading(){
  const root = document.getElementById('reading-root'); root.innerHTML='';
  readingPassages.forEach((p, pidx) => {
    const box = document.createElement('div'); box.className='question';
    const para = document.createElement('p'); para.textContent = p.passage; box.appendChild(para);
    p.questions.forEach((qq, qidx) => {
      const qNum = pidx*3 + qidx + 1;
      const qBox = document.createElement('div'); qBox.className='options';
      const title = document.createElement('div'); title.className='q-title';
      title.textContent = `${qNum}. ${qq.q}`;
      box.appendChild(title);
      Object.keys(qq.opts).forEach(key => {
        const label = document.createElement('label'); label.className='option-item';
        const radio = document.createElement('input'); radio.type='radio';
        radio.name = `r_${pidx}_${qidx}`; radio.value = key; label.appendChild(radio);
        const span = document.createElement('span'); span.textContent = `${key}. ${qq.opts[key]}`; label.appendChild(span);
        box.appendChild(label);
      });
    });
    root.appendChild(box);
  });
}

function checkReading(){
  let total = 0, correct = 0;
  readingPassages.forEach((p, pidx) => {
    p.questions.forEach((qq, qidx) => {
      total++;
      const sel = document.querySelector(`input[name=r_${pidx}_${qidx}]:checked`);
      // 找對應的 visible question block to mark
      // We'll use order: for each passage we appended the question blocks sequentially
      const qBlockIndex = pidx; // top-level question index
      // Determine the specific label block by searching for the q-title matching text
      const titles = Array.from(document.getElementsByClassName('q-title'));
      const titleText = `${pidx*3 + qidx + 1}. ${qq.q}`;
      const titleEl = titles.find(t => t.textContent === titleText);
      const parent = titleEl ? titleEl.closest('.question') : null;
      if (parent){
        // remove previous marks
        parent.classList.remove('correct','wrong');
      }
      if (sel && sel.value === qq.ans){
        correct++;
        if (parent) parent.classList.add('correct');
      } else {
        if (parent) parent.classList.add('wrong');
        // display small feedback under parent
        if (parent){
          let fb = parent.querySelector('.feedback');
          if (!fb){ fb = document.createElement('div'); fb.className='feedback'; parent.appendChild(fb); }
          fb.textContent = `本題正確答案：${qq.ans}. ${qq.opts[qq.ans]}`;
        }
      }
    });
  });

  const existing = document.getElementById('reading-result'); if (existing) existing.remove();
  const res = document.createElement('div'); res.id = 'reading-result'; res.className='result';
  res.innerHTML = `<strong>得分：</strong> ${correct} / ${total}`;
  document.querySelector('.container').appendChild(res);
}

/**
 * Inject floating quiz button and modal to pages. Uses quizQuestions and render/check helpers.
 */
function injectFloatingQuizButton(){
  // avoid duplicate
  if (document.getElementById('floatingQuizBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'floatingQuizBtn'; btn.className = 'floating-quiz-btn';
  btn.title = 'Open Quiz'; btn.textContent = 'QUIZ';
  document.body.appendChild(btn);

  const overlay = document.createElement('div'); overlay.className = 'quiz-modal-overlay'; overlay.id = 'quizModalOverlay';
  const modal = document.createElement('div'); modal.className = 'quiz-modal'; modal.id = 'quizModal';
  const head = document.createElement('div'); head.className = 'modal-head';
  const h = document.createElement('h3'); h.textContent = 'Quick Quiz - Moodle Basics'; head.appendChild(h);
  const close = document.createElement('button'); close.className='btn ghost'; close.textContent='Close'; close.addEventListener('click', () => { overlay.style.display='none'; });
  head.appendChild(close);
  modal.appendChild(head);
  const body = document.createElement('div'); body.className='modal-body'; body.id = 'quiz-modal-body';
  // root to render quiz
  const modalRoot = document.createElement('div'); modalRoot.id = 'quiz-modal-root'; body.appendChild(modalRoot);
  // controls
  const controls = document.createElement('div'); controls.className='modal-controls';
  const checkBtn = document.createElement('button'); checkBtn.id='modalCheckQuiz'; checkBtn.className='btn'; checkBtn.textContent='Check Answers';
  const close2 = document.createElement('button'); close2.className='btn ghost'; close2.textContent='Close'; close2.addEventListener('click', () => { overlay.style.display='none'; });
  controls.appendChild(checkBtn); controls.appendChild(close2);
  body.appendChild(controls);
  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // open handler
  btn.addEventListener('click', () => {
    overlay.style.display = 'flex';
    // render quiz into modal root with distinct name prefix
    renderQuizInto(modalRoot, 'modal_quiz_');
    // remove prior result if any
    const old = document.getElementById('modal-quiz-result'); if (old) old.remove();
  });

  // check handler
  checkBtn.addEventListener('click', () => {
    const modalRootEl = document.getElementById('quiz-modal-root');
    checkQuizGeneric('modal_quiz_', modalRootEl, 'modal-quiz-result');
  });

  // click outside modal to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
}
