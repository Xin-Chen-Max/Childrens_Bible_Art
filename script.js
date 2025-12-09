/* ===================================
   A Children's Bible - Repair Not Rebirth
   Interactive Illustration Script
   =================================== */

// ===================================
// 数据：五个元素的术语、判断、引文
// ===================================

const elementData = {
    tape: {
        term: "Cardboard Boat",
        judgment: "The vessel evokes Noah's Ark, yet here there is no divine covenant, no rainbow. The so-called 'Ark' is merely floating debris; the 'rebirth' is just the old order repackaged onto a young body.",
        quote: "\"Two hundred garbage bags,\" she said. \"And plenty of duct tape.\" "
    },
    mask: {
        term: "Window",
        judgment: "The window sealed with garbage bags symbolizes the fragile boundaries of private space. It reveals that 'safety' is just a temporary state maintained by trash, highlighting the disparity between those who can retreat and those left to patch the leaks.",
        quote: "\"Within hours the bags Val had taped over the hole were sagging and gaping.\" "
    },
    guy: {
        term: "The Child",
        judgment: "The child on the roof is forced to adopt an adult vantage point yet sees a limited world. This restricted perspective highlights the helplessness of children pushed into adult roles—they inherit not a new world, but the heavy burden of the old order.",
        quote: "\"They'd put a kid on the roof in a lightning storm.\" "
    },
    boat: {
        term: "Cardboard Boat",
        judgment: "The vessel evokes Noah's Ark, yet here there is no divine covenant, no rainbow. The so-called 'Ark' is merely floating debris; the 'rebirth' is just the old order repackaged onto a young body.",
        quote: "\"I saw holes punched in one box, two box, three box, four.\" "
    },
    shadow: {
        term: "Shadow",
        judgment: "The shadow cast by the figure represents the systemic cycle. It implies that the threat hasn't vanished with the flood; instead, the failures of the past are attached to the children's feet, traveling with them into the future like a ghost.",
        quote: "\"What people wanted to be, but never could, traveled along beside them. Company.\" "
    }
};

// ===================================
// DOM 元素获取
// ===================================

const scene = document.getElementById('scene');
const infoCard = document.getElementById('info-card');
const closeBtn = document.getElementById('close-btn');
const cardTerm = document.getElementById('card-term');
const cardJudgment = document.getElementById('card-judgment');
const cardQuote = document.getElementById('card-quote');
const stageDots = document.querySelectorAll('.stage-dot');
const items = document.querySelectorAll('.item');

// 当前阶段
let currentStage = 1;

// ===================================
// 滚动监听 - 阶段切换
// ===================================

function updateStage(stage) {
    if (stage === currentStage) return;
    
    currentStage = stage;
    
    // 移除所有阶段类，添加当前阶段类
    scene.classList.remove('stage-1', 'stage-2', 'stage-3');
    scene.classList.add(`stage-${stage}`);
    
    // 更新阶段指示器
    stageDots.forEach((dot, index) => {
        if (index + 1 === stage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // 根据滚动百分比切换阶段
    if (scrollPercent < 30) {
        updateStage(1);
    } else if (scrollPercent < 70) {
        updateStage(2);
    } else {
        updateStage(3);
    }
}

// 添加滚动监听（使用节流优化性能）
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

// ===================================
// 阶段指示器点击 - 快速跳转
// ===================================

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

// ===================================
// 弹窗功能
// ===================================

// 创建背景遮罩
const overlayBg = document.createElement('div');
overlayBg.className = 'overlay-bg';
document.body.appendChild(overlayBg);

function showInfoCard(target) {
    const data = elementData[target];
    if (!data) return;
    
    cardTerm.textContent = data.term;
    cardJudgment.textContent = data.judgment;
    cardQuote.textContent = `"${data.quote}"`;
    
    // 显示弹窗和遮罩
    infoCard.classList.remove('hidden');
    infoCard.classList.add('visible');
    overlayBg.classList.add('visible');
}

function hideInfoCard() {
    infoCard.classList.remove('visible');
    overlayBg.classList.remove('visible');
}

// 为每个可点击元素添加事件
items.forEach(item => {
    item.addEventListener('click', (e) => {
        // 如果点击的是 face-loading，不触发弹窗
        if (e.target.classList.contains('face-loading')) {
            return;
        }
        e.stopPropagation();
        const target = item.dataset.target;
        showInfoCard(target);
    });
});

// 关闭弹窗
closeBtn.addEventListener('click', hideInfoCard);
overlayBg.addEventListener('click', hideInfoCard);

// ESC 键关闭弹窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideInfoCard();
    }
});

// ===================================
// 初始化
// ===================================

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 确保初始状态为 stage-1
    updateStage(1);
    
    // 添加滚动提示
    const scrollHint = document.createElement('div');
    scrollHint.className = 'scroll-hint';
    scrollHint.innerHTML = '↓ Scroll to explore ↓';
    document.body.appendChild(scrollHint);
    
    // 滚动后隐藏提示
    let hintHidden = false;
    window.addEventListener('scroll', () => {
        if (!hintHidden && window.scrollY > 100) {
            scrollHint.style.opacity = '0';
            setTimeout(() => scrollHint.remove(), 500);
            hintHidden = true;
        }
    });
});

// 初始滚动检测
handleScroll();

