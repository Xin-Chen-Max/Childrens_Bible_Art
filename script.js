const elementData = {
    tape: {
        term: "Tape",
        judgment: "The tape patching the cardboard boat represents the temporary fix that masquerades as repair. It holds the fragments together just long enough to create the illusion of a vessel, but this is not construction—it is containment. The tape reveals that 'rebirth' is merely the old order held together by adhesive, ready to dissolve when the water seeps through the holes it cannot truly seal.",
        quote: "\"I saw holes punched in one box, two box, three box, four.\" ",
        sound: "Audio/duct-tape-46809.mp3"
    },
    mask: {
        term: "Window",
        judgment: "The window sealed with tapes symbolizes the fragile boundaries of private space. It reveals that 'safety' is just a temporary state maintained by trash, highlighting the disparity between those who can retreat and those left to patch the leaks.",
        quote: "\"Within hours the bags Val had taped over the hole were sagging and gaping.\" ",
        sound: "Audio/crisp-plastic-bag-texture-424997.mp3"
    },
    guy: {
        term: "The Child",
        judgment: "The child on the roof is forced to adopt an adult vantage point yet sees a limited world. This restricted perspective highlights the helplessness of children pushed into adult roles—they inherit not a new world, but the heavy burden of the old order.",
        quote: "\"They'd put a kid on the roof in a lightning storm.\" ",
        sound: "Audio/breathing-432885.mp3"
    },
    boat: {
        term: "Cardboard Boat",
        judgment: "The vessel evokes Noah's Ark, yet here there is no divine covenant, no rainbow. The so-called 'Ark' is merely floating debris; the 'rebirth' is just the old order repackaged onto a young body.",
        quote: "\"I saw holes punched in one box, two box, three box, four.\" ",
        sound: "Audio/creak-and-crack-252628.mp3"
    },
    shadow: {
        term: "Shadow",
        judgment: "The shadow cast by the figure represents the systemic cycle. It implies that the threat hasn't vanished with the flood; instead, the failures of the past are attached to the children's feet, traveling with them into the future like a ghost.",
        quote: "\"What people wanted to be, but never could, traveled along beside them. Company.\" ",
        sound: "Audio/creak-and-crack-252628.mp3"
    }
};

const scene = document.getElementById('scene');
const infoCard = document.getElementById('info-card');
const closeBtn = document.getElementById('close-btn');
const cardTerm = document.getElementById('card-term');
const cardJudgment = document.getElementById('card-judgment');
const cardQuote = document.getElementById('card-quote');
const stageDots = document.querySelectorAll('.stage-dot');
const items = document.querySelectorAll('.item');
const floodAudio = document.getElementById('flood-audio');

let currentStage = 1;

function updateStage(stage) {
    if (stage === currentStage) return;
    
    currentStage = stage;
    
    scene.classList.remove('stage-1', 'stage-2', 'stage-3');
    scene.classList.add(`stage-${stage}`);
    
    stageDots.forEach((dot, index) => {
        if (index + 1 === stage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    if (floodAudio) {
        let targetVolume;
        if (stage === 1) {
            targetVolume = 0.2;
        } else if (stage === 2) {
            targetVolume = 0.5;
        } else {
            targetVolume = 0.8;
        }
        
        const fadeDuration = 1000;
        const startVolume = floodAudio.volume;
        const volumeDiff = targetVolume - startVolume;
        const startTime = Date.now();
        
        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / fadeDuration, 1);
            floodAudio.volume = startVolume + (volumeDiff * progress);
            
            if (progress >= 1) {
                clearInterval(fadeInterval);
            }
        }, 16);
    }
}

function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (scrollPercent < 30) {
        updateStage(1);
    } else if (scrollPercent < 70) {
        updateStage(2);
    } else {
        updateStage(3);
    }
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

stageDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        const stage = index + 1;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        let targetScroll;
        if (stage === 1) {
            targetScroll = 0;
        } else if (stage === 2) {
            targetScroll = docHeight * 0.5;
        } else {
            targetScroll = docHeight;
        }
        
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    });
});

const overlayBg = document.createElement('div');
overlayBg.className = 'overlay-bg';
document.body.appendChild(overlayBg);

function playElementSound(soundPath) {
    if (!soundPath) return;
    
    const sound = new Audio(soundPath);
    sound.volume = 0.4;
    sound.play().catch(error => {
        console.log('音效播放失败:', error);
    });
}

function showInfoCard(target) {
    const data = elementData[target];
    if (!data) return;
    
    cardTerm.textContent = data.term;
    cardJudgment.textContent = data.judgment;
    cardQuote.textContent = `"${data.quote}"`;
    
    if (data.sound) {
        playElementSound(data.sound);
    }
    
    infoCard.classList.remove('hidden');
    infoCard.classList.add('visible');
    overlayBg.classList.add('visible');
}

function hideInfoCard() {
    infoCard.classList.remove('visible');
    overlayBg.classList.remove('visible');
}

items.forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.classList.contains('face-loading')) {
            return;
        }
        e.stopPropagation();
        const target = item.dataset.target;
        showInfoCard(target);
    });
});

closeBtn.addEventListener('click', hideInfoCard);
overlayBg.addEventListener('click', hideInfoCard);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideInfoCard();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateStage(1);
    
    if (floodAudio) {
        floodAudio.volume = 0.3;
        
        floodAudio.addEventListener('error', (e) => {
            console.error('音频加载失败:', e);
            console.log('请确保 assets/flood-sound.mp3 文件存在');
        });
        
        floodAudio.addEventListener('canplay', () => {
            console.log('音频文件加载成功，准备播放');
        });
        
        floodAudio.play().catch(error => {
            console.log('音频自动播放被阻止，等待用户交互...', error.message);
        });
    } else {
        console.error('未找到音频元素 #flood-audio');
    }
    
    const scrollHint = document.createElement('div');
    scrollHint.className = 'scroll-hint';
    scrollHint.innerHTML = '↓ Scroll to explore ↓<br><span style="font-size: 11px; opacity: 0.7;">Sound intensifies as you scroll down</span>';
    document.body.appendChild(scrollHint);
    
    let hintHidden = false;
    window.addEventListener('scroll', () => {
        if (!hintHidden && window.scrollY > 100) {
            scrollHint.style.opacity = '0';
            setTimeout(() => scrollHint.remove(), 500);
            hintHidden = true;
        }
    });
    
    let audioStarted = false;
    const startAudioOnInteraction = () => {
        if (!audioStarted && floodAudio) {
            if (floodAudio.paused) {
                floodAudio.play().then(() => {
                    console.log('音频播放成功');
                    audioStarted = true;
                }).catch(error => {
                    console.error('音频播放失败:', error);
                    console.log('可能的原因：1) 音频文件不存在 2) 浏览器阻止播放 3) 文件格式不支持');
                });
            } else {
                audioStarted = true;
            }
        }
    };
    
    document.addEventListener('click', startAudioOnInteraction, { once: true });
    document.addEventListener('scroll', startAudioOnInteraction, { once: true });
    document.addEventListener('keydown', startAudioOnInteraction, { once: true });
    document.addEventListener('touchstart', startAudioOnInteraction, { once: true });
    
    const audioBtn = document.getElementById('audio-test-btn');
    if (audioBtn && floodAudio) {
        const updateButtonText = () => {
            if (floodAudio.paused) {
                audioBtn.innerHTML = '🔇 Audio';
            } else {
                audioBtn.innerHTML = '🔊 Audio';
            }
        };
        
        updateButtonText();
        
        audioBtn.addEventListener('click', () => {
            if (floodAudio.paused) {
                floodAudio.play().then(() => {
                    updateButtonText();
                }).catch(error => {
                    console.error('Audio play failed:', error);
                });
            } else {
                floodAudio.pause();
                updateButtonText();
            }
        });
        
        floodAudio.addEventListener('play', updateButtonText);
        floodAudio.addEventListener('pause', updateButtonText);
    }
});

handleScroll();
