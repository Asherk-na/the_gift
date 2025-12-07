function launchConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return; // safe-guard: some pages don't include confetti container
    const colors = ['#d6336c', '#ffd700', '#fff0f6', '#d4af37'];

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti');

        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 5 + 's';
        piece.style.width = piece.style.height = (Math.random() * 6 + 4) + 'px';

        container.appendChild(piece);
    }
}

launchConfetti();

// --- Simple modal system for in-page messages (replaces alerts for notes) ---
function createModal() {
    let overlay = document.getElementById('modal-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = `
        <div class="modal">
            <button class="modal-close" aria-label="Close">×</button>
            <h3 class="modal-title"></h3>
            <div class="modal-body"></div>
        </div>
    `;

    document.body.appendChild(overlay);

    // close handlers
    overlay.querySelector('.modal-close').addEventListener('click', hideModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) hideModal();
    });

    return overlay;
}

function showModal(title, message) {
    const overlay = createModal();
    overlay.style.display = 'flex';
    overlay.querySelector('.modal-title').textContent = title;
    // allow HTML line breaks if the message contains them
    const body = overlay.querySelector('.modal-body');
    body.innerText = message;
}

function hideModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.style.display = 'none';
}

// --- Photo gallery data and renderer ---
const galleryImages = [
    { src: 'Images/couple_large.jpg', caption: '"The love is real. The magic is real. The happily ever after is real." — Unknown' },
    { src: 'Images/husband.jpg', caption: '"A great marriage is not something that just happens; it is something that is created, over and over, with every choice to stay together." – Unknown' },
    { src: 'Images/wife.jpg', caption: '"The best thing to hold onto in life is each other." — Audrey Hepburn' },
    { src: 'Images/family.jpg', caption: '"The best thing to hold onto in life is each other." – Audrey Hepburn' },
    { src: 'Images/couple1.jpg', caption: '"True love stories never have endings." — Richard Bach' },
    { src: 'Images/couple2.jpg', caption: '"A successful marriage requires falling in love many times, always with the same person." — Mignon McLaughlin' },
    { src: 'Images/couple3.jpg', caption: '"The best love is the kind that awakens the soul and inspires us to become the best version of ourselves." — Nicholas Sparks' },
    { src: 'Images/couple4.jpg', caption: '"Marriage is not just spiritual union, it is also remembering and rescuing." — C.S. Lewis' },
    { src: 'Images/couple5.jpg', caption: '"Love recognizes no barriers. It leaps hurdles and defies walls." — Pearl S. Buck' },
    { src: 'Images/mother_children.jpg', caption: '"A mother is she who can take the place of all others but whose place no one else can take."' },
    { src: 'Images/father_children.jpg', caption: '"The best thing to hold onto in life is each other." — Audrey Hepburn' },
];

function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.innerHTML = '';

    galleryImages.forEach((img, i) => {
        const figure = document.createElement('figure');
        figure.className = 'gallery-item';

        const image = document.createElement('img');
        image.src = img.src;
        image.alt = img.caption || `Photo ${i + 1}`;
        image.loading = 'lazy';
        image.dataset.index = i;
        image.addEventListener('click', () => openGallery(i));

        const cap = document.createElement('figcaption');
        cap.textContent = img.caption;

        figure.appendChild(image);
        figure.appendChild(cap);
        grid.appendChild(figure);
        // staggered appear animation for a nicer entrance
        setTimeout(() => {
            try { figure.classList.add('appear'); } catch (e) {}
        }, i * 90);
    });
}

// Create gallery overlay (lightbox)
function createGalleryOverlay() {
    let overlay = document.getElementById('gallery-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'gallery-overlay';
    overlay.innerHTML = `
        <div class="gallery-lightbox">
            <button class="gallery-close" aria-label="Close">×</button>
            <button class="gallery-prev" aria-label="Previous">‹</button>
            <div class="gallery-inner">
                <img class="gallery-current" src="" alt="">
                <div class="gallery-caption"></div>
                <div class="gallery-index" aria-hidden="true"></div>
            </div>
            <button class="gallery-next" aria-label="Next">›</button>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.gallery-close').addEventListener('click', closeGallery);
    overlay.querySelector('.gallery-prev').addEventListener('click', showPrevGallery);
    overlay.querySelector('.gallery-next').addEventListener('click', showNextGallery);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeGallery(); });

    // keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (!document.getElementById('gallery-overlay') || document.getElementById('gallery-overlay').style.display !== 'flex') return;
        if (e.key === 'ArrowLeft') showPrevGallery();
        if (e.key === 'ArrowRight') showNextGallery();
        if (e.key === 'Escape') closeGallery();
    });

    return overlay;
}

let currentGalleryIndex = 0;
let slideshowTimer = null;
const SLIDESHOW_INTERVAL = 4000; // ms

function startSlideshow() {
    stopSlideshow();
    slideshowTimer = setInterval(() => {
        showNextGallery();
    }, SLIDESHOW_INTERVAL);
}

function stopSlideshow() {
    if (slideshowTimer) {
        clearInterval(slideshowTimer);
        slideshowTimer = null;
    }
}

function openGallery(index) {
    currentGalleryIndex = index;
    const overlay = createGalleryOverlay();
    const imgEl = overlay.querySelector('.gallery-current');
    const capEl = overlay.querySelector('.gallery-caption');
    const idxEl = overlay.querySelector('.gallery-index');

    // use displayImage for fade/caption animation
    overlay.style.display = 'flex';
    // force reflow then add open class to trigger CSS transition
    window.requestAnimationFrame(() => overlay.classList.add('open'));
    displayImage(index);

    // start autoplay slideshow
    startSlideshow();
}

function closeGallery() {
    const overlay = document.getElementById('gallery-overlay');
    if (!overlay) return;
    // remove open class to start fade-out
    overlay.classList.remove('open');
    // stop slideshow
    stopSlideshow();
    // after transition, hide
    setTimeout(() => { if (overlay) overlay.style.display = 'none'; }, 260);
}

function showNextGallery() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    displayImage(currentGalleryIndex);
    // restart slideshow timer so user gets the full interval after manual navigation
    if (slideshowTimer) { stopSlideshow(); startSlideshow(); }
}

function showPrevGallery() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    displayImage(currentGalleryIndex);
    if (slideshowTimer) { stopSlideshow(); startSlideshow(); }
}

function displayImage(index) {
    currentGalleryIndex = index;
    const overlay = createGalleryOverlay();
    const imgEl = overlay.querySelector('.gallery-current');
    const capEl = overlay.querySelector('.gallery-caption');
    const idxEl = overlay.querySelector('.gallery-index');

    // prepare for fade: hide caption and fade image out
    if (capEl) capEl.classList.remove('visible');
    if (imgEl) imgEl.style.opacity = 0;

    // update index and caption immediately (caption will animate after load)
    if (idxEl) idxEl.textContent = `${index + 1} / ${galleryImages.length}`;
    if (capEl) capEl.textContent = galleryImages[index].caption || '';

    // load new image then fade it in
    const newSrc = galleryImages[index].src;
    // remove any previous onload handler
    imgEl.onload = null;
    imgEl.onload = function() {
        // fade in image
        imgEl.style.transition = 'opacity 320ms ease';
        imgEl.style.opacity = 1;
        // show caption with slight delay for nicer effect
        setTimeout(() => { if (capEl) capEl.classList.add('visible'); }, 120);
    };
    // set src (browser will fire load even if cached)
    imgEl.src = newSrc;
    imgEl.alt = galleryImages[index].caption || '';
}

// render on load
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});



const notes = [
    "Wishing you endless laughter and love.",
    "Three beautiful children, and a home full of joy.",
    "May your days be kind and your nights be warm.",
    "Every anniversary is a new beginning — congratulations!",
];

const loveNotesArray = [
    { title: "To Desmond & Rosa", message: "You two light up every room — thank you for showing us how love looks in action." },
    { title: "Family First", message: "Your children are blessed to grow up with such warm and steady parents." },
    { title: "Keep Choosing", message: "A great marriage is created every day by choosing each other — keep choosing one another." },
    { title: "From Your Sibling", message: "Proud of you both — today I celebrate your love and family." },
    { title: "Little Things", message: "It's the small, kind choices you make for each other that build a lifetime together." },
    { title: "Cheers to You", message: "To many more years of laughter, health, and shared dreams." },
    { title: "Always", message: "May your home be filled with patience, joy, and endless hugs." },
    { title: "Love Note", message: "Thank you for letting me be part of your story — happy belated anniversary!" },
    { title: "A Wish", message: "May the coming years bring new memories and deeper love." },
    { title: "With Pride", message: "I am proud to be family; congratulations, Desmond & Rosa Ganuse." },
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function loadNotes() {
    const grid = document.getElementById('notes-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const notesTOShow = loveNotesArray.slice(0, 6);

    notesTOShow.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        
        noteDiv.classList.add('note');
        
        noteDiv.style.setProperty('--i', index);
        noteDiv.onclick = function() {
            // use modal instead of alert
            showModal(note.title, note.message);
        };

        noteDiv.innerHTML = `
            <div class="note-header">${note.title}</div>
            <p>Click to flip!<p>
            `;
            grid.appendChild(noteDiv);
    });
}

function shuffleNotes() {
    shuffleArray(loveNotesArray);
    loadNotes();
}

shuffleNotes();

// script.js

// Function 1: Virtual Gift Unwrap (attach only if element exists)
const _unwrapBtn = document.getElementById('unwrap-button');
if (_unwrapBtn) {
    _unwrapBtn.addEventListener('click', function() {
        const giftContent = document.getElementById('gift-content');
        if (!giftContent) return;

        // Toggle visibility
        if (giftContent.style.display === 'block') {
            giftContent.style.display = 'none';
            this.innerText = 'Click to Unwrap Your Letter!';
        } else {
            giftContent.style.display = 'block';
            this.innerText = 'Letter is Open (Click to Hide)';
            try { alert("A special letter from me has been unwrapped! "); } catch (e) {}
        }
    });
}

const providedQuestions = [
    { question: "What was the first thing you noticed about me?", options: ["My smile","My eyes","My sense of humor","My cooking"] },
    { question: "Where was our first date?", options: ["Restaurant","Park","Movie theater","Home"] },
    { question: "What do you love most about me?", options: ["My looks","My personality","My cooking","My sense of humor"] },
    { question: "What is your favorite hobby to do together?", options: ["Watching movies","Playing games","Traveling","Cooking"] },
    { question: "What is the best gift I've ever given you?", options: ["A surprise party","A thoughtful letter","A special piece of jewelry","A fun experience"] },
    { question: "What's your favorite way to spend a lazy day?", options: ["Watching TV","Reading a book","Taking a nap","Going for a walk"] },
    { question: "What's the most adventurous thing we've done together?", options: ["Traveling together","Trying a new restaurant","Taking a risk","Something else"] },
    { question: "What's your favorite memory of us?", options: ["Our first kiss","Our wedding day","A special vacation","A quiet night in"] },
    { question: "How would you describe our relationship?", options: ["Adventurous","Romantic","Fun-loving","Comfortable"] },
    { question: "What's your favorite thing about our communication?", options: ["We talk all day","We listen to each other","We understand each other","We make each other laugh"] },
    { question: "What's the best advice you've ever given me?", options: ["Be yourself","Follow your heart","Always be honest","Something else"] },
    { question: "What's something you're grateful for in our relationship?", options: ["Support","Laughter","Trust","Adventure"] },
    { question: "What's your favorite way to show love?", options: ["Words of affirmation","Quality time","Gifts","Acts of service"] },
    { question: "What's your favorite thing about my personality?", options: ["My kindness","My sense of humor","My creativity","My determination"] },
    { question: "What's something we have in common?", options: ["Hobbies","Interests","Values","Goals"] },
    { question: "What's the most important thing to you in our relationship?", options: ["Trust","Communication","Love","Respect"] },
    { question: "What's something you're proud of in our relationship?", options: ["Our accomplishments","Our growth","Our love","Our friendship"] },
    { question: "What's your favorite way to relax together?", options: ["Watching TV","Playing games","Reading","Taking a walk"] },
];

// First 10 go to husband (personalized wording in the UI), next 10 go to wife
const quizForHim = providedQuestions.slice(0, 10);
const quizForHer = providedQuestions.slice(8, 18); // overlapping questions 9-10 to create variety

let currentQuiz = [];
let currentRole = null; // 'him' or 'her'

function renderQuizSet(role) {
    const form = document.getElementById('quiz-form') || document.getElementById('questions-container');
    const title = document.getElementById('quiz-title');
    if (!form || !title) return;

    currentQuiz = role === 'him' ? quizForHim : quizForHer;
    currentRole = role;
    title.textContent = role === 'him' ? 'Quiz: For Him (10 questions)' : 'Quiz: For Her (10 questions)';
    form.innerHTML = '';

    currentQuiz.forEach((q, idx) => {
        const block = document.createElement('div');
        block.className = 'question-block';
        let html = `<h4>${idx + 1}. ${q.question}</h4>`;
        q.options.forEach((opt, i) => {
            const id = `q-${role}-${idx}-${i}`;
            html += `<label for="${id}"><input type="radio" id="${id}" name="q${idx}" value="${opt}"> ${opt}</label>`;
        });
        block.innerHTML = html;
        form.appendChild(block);
    });
}

window.checkQuiz = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!currentQuiz || currentQuiz.length === 0) return alert('Please select a quiz (For Him / For Her) first.');

    const answers = [];
    currentQuiz.forEach((q, idx) => {
        const selected = document.querySelector(`input[name="q${idx}"]:checked`);
        answers.push({ question: q.question, answer: selected ? selected.value : null });
    });

    const answeredCount = answers.filter(a => a.answer !== null).length;
    const total = currentQuiz.length;
    const resultDiv = document.getElementById('quiz-result');

    // Build a friendly summary showing selected answers
    let html = `<div><strong>You answered ${answeredCount}/${total} questions.</strong></div>`;
    html += '<ol style="text-align:left; margin-top:10px;">';
    answers.forEach(a => {
        html += `<li><strong>${a.question}</strong><div style="color:#333; margin-top:4px;">${a.answer ? a.answer : '<em>No answer</em>'}</div></li>`;
    });
    html += '</ol>';

    html += '<div style="margin-top:12px; font-weight:600;">Thanks for playing — share this with Rosa/Desmond to compare answers!</div>';

    resultDiv.innerHTML = html;
    // Save this submission so it can be viewed later
    try {
        const submission = {
            role: currentRole || 'unknown',
            timestamp: Date.now(),
            answers: answers
        };
        saveSubmission(submission);
    } catch (err) {
        console.error('Failed to save submission', err);
    }
}

// Save a submission into localStorage under key 'ganuse_quiz_submissions'
function saveSubmission(submission) {
    const key = 'ganuse_quiz_submissions';
    let all = [];
    try {
        const raw = localStorage.getItem(key);
        all = raw ? JSON.parse(raw) : [];
    } catch (e) {
        all = [];
    }
    all.push(submission);
    try { localStorage.setItem(key, JSON.stringify(all)); } catch (e) { console.error('Failed to write submissions', e); }
}

function getSavedSubmissions() {
    const key = 'ganuse_quiz_submissions';
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
}

function exportLatestSubmission() {
    const saved = getSavedSubmissions();
    if (!saved || saved.length === 0) return alert('No saved submissions found. Submit the quiz first.');
    const latest = saved[saved.length - 1];
    const blob = new Blob([JSON.stringify(latest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date(latest.timestamp).toISOString().replace(/[:.]/g, '-');
    a.download = `ganuse-quiz-${latest.role}-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function renderSavedSubmissions(containerId = 'saved-results') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const saved = getSavedSubmissions();
    if (!saved || saved.length === 0) {
        container.innerHTML = '<div style="padding:10px;">No saved submissions yet.</div>';
        return;
    }

    let html = '<div style="padding:8px; background:#fff; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.04);">';
    saved.forEach((s, i) => {
        const d = new Date(s.timestamp);
        html += `<div style="border-bottom:1px solid #eee; padding:8px 0;"><strong>Submission ${i+1}</strong> — <small>${s.role}</small> — <small>${d.toLocaleString()}</small> <button data-idx="${i}" class="view-submission" style="margin-left:8px;">View</button></div>`;
    });
    html += '</div>';
    container.innerHTML = html;

    // attach view handlers
    container.querySelectorAll('.view-submission').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = Number(this.dataset.idx);
            const sub = saved[idx];
            if (!sub) return;
            let out = `<div><strong>Role:</strong> ${sub.role}</div><div><strong>Time:</strong> ${new Date(sub.timestamp).toLocaleString()}</div><ol style="text-align:left; margin-top:8px;">`;
            sub.answers.forEach(a => {
                out += `<li><strong>${a.question}</strong><div style="margin-top:4px;">${a.answer ? a.answer : '<em>No answer</em>'}</div></li>`;
            });
            out += '</ol>';
            showModal('Saved Submission', out);
        });
    });
}

function viewSavedSubmissions() { renderSavedSubmissions('saved-results'); }

// Wire quiz page buttons (if present)
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    loadNotes && loadNotes();

    // Ensure hero content is visible on pages with a hero section
    try {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) heroContent.classList.add('show');
    } catch (e) {}

    const btnH = document.getElementById('btn-him');
    const btnW = document.getElementById('btn-her');
    if (btnH) btnH.addEventListener('click', () => renderQuizSet('him'));
    if (btnW) btnW.addEventListener('click', () => renderQuizSet('her'));
    const exp = document.getElementById('export-results');
    const viewBtn = document.getElementById('view-saved');
    if (exp) exp.addEventListener('click', exportLatestSubmission);
    if (viewBtn) viewBtn.addEventListener('click', viewSavedSubmissions);
    // If quiz page loaded and there are saved submissions, show a small notice
    const savedNoticeContainer = document.getElementById('saved-results');
    if (savedNoticeContainer) renderSavedSubmissions('saved-results');
    // start wedding timer if present on the page
    if (typeof startWeddingTimer === 'function') startWeddingTimer();
});

// Wedding timer: counts days/hours/minutes/seconds since Dec 3, 2022 (local time)
function startWeddingTimer() {
    const el = document.getElementById('wedding-timer');
    if (!el) return;
    const weddingDate = new Date(2022, 11, 3, 0, 0, 0); // month is 0-based => 11 == December

    function update() {
        const now = new Date();
        let diff = now - weddingDate;
        if (diff < 0) diff = 0;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = el.querySelector('.countdays');
        const hoursEl = el.querySelector('.counthours');
        const minsEl = el.querySelector('.countmins');
        const secsEl = el.querySelector('.countsecs');
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

window.unlockSurprise = function() {
    const inputField = document.getElementById('secret-phrase');
    if (!inputField) return; // nothing to do
    const input = inputField.value.trim().toLowerCase();
    // Use the family's surname as an easy secret key for the surprise
    const secretKey = 'ganuse';

    const unlockBtn = document.getElementById('unlock-button');

    if (input === secretKey) {
        // disable inputs to prevent duplicate actions
        if (unlockBtn) {
            unlockBtn.disabled = true;
            unlockBtn.innerText = 'UNLOCKED!';
        }
        inputField.disabled = true;

        // Small UX: show a quick message then open the secret page
        try { alert('🎉 Access Granted! Opening your surprise...'); } catch (e) {}
        // Redirect to the secret page
        window.location.href = 'secret_message.html';
    } else {
        // Failure: give hint and clear input
        try {
            alert("❌ Incorrect phrase. Hint: Try your family name (all lowercase).");
        } catch (e) {}
        inputField.value = '';
    }
}
