/* ===================================
   A Children's Bible - Repair Not Rebirth
   Interactive Illustration Script
   =================================== */

// ===================================
// 数据：五个元素的术语、判断、引文
// ===================================

const elementData = {
    tape: {
        term: "Scene Staging",
        judgment: "胶带和塑料布封窗是临时修补，无法抵御洪水的结构性威胁。这种「舞台布景」式的防护揭示了修复的虚假性——它只是表面功夫，无法提供真正的庇护。",
        quote: "They taped plastic over the windows, garbage bags over the vents..."
    },
    mask: {
        term: "Space & Property Rights",
        judgment: "垃圾袋封住的窗户象征着空间的脆弱边界。富人可以撤离到安全地带，而穷人只能用临时材料保护自己的空间——这不是重生，而是贫富差距在灾难中的再次显现。",
        quote: "The parents had retreated to the great room with its cathedral ceiling..."
    },
    guy: {
        term: "Restricted Perspective",
        judgment: "屋顶上的孩子被迫采取成人的视角，却只能看到有限的世界。这种受限的视角强调了儿童被推入成人角色的无奈——他们继承的不是新世界，而是旧秩序的重担。",
        quote: "I climbed up to where I could see the water coming..."
    },
    boat: {
        term: "Archetype — Noah's Ark",
        judgment: "船只唤起诺亚方舟的原型，但这里没有神圣的契约，没有彩虹的承诺。所谓的「方舟」只是漂浮的残骸，「重生」只是旧秩序在年轻身体上的重新包装。",
        quote: "The boat was just a rowboat, really. Nothing that could save us all..."
    },
    shadow: {
        term: "Visual Grammar",
        judgment: "阴影代表着持续存在的威胁——它不会因为临时修补而消失。视觉语法中的阴影强调：如果不重塑基础设施和能源分配，临时补丁只会转移风险，而非消除根源。",
        quote: "The shadow of the storm hadn't lifted. It hung over us still..."
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

