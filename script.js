/* ========================================
   EXORCISM COMPLETE GUIDE - JAVASCRIPT FINAL
   ======================================== */

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupFeatureCards();
    setupPrayerTabs();
    setupCopyButtons();
    setupExpandButtons();
    setupFAQ();
    setupScrollToTop();
    logStartupMessage();
}

// ========================================
// NAVEGAÇÃO
// ========================================

const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

function setupNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToSection(this.getAttribute('data-section'));
        });
    });
}

function navigateToSection(sectionId) {
    // Remove active de todos os botões
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Encontra o botão correto
    const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Remove active de todas as seções
    sections.forEach(section => section.classList.remove('active'));
    
    // Ativa a seção correta
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// FEATURE CARDS
// ========================================

function setupFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                navigateToSection(sectionId);
            }
        });
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ========================================
// PRAYER TABS E FILTRO
// ========================================

function setupPrayerTabs() {
    const prayerTabBtns = document.querySelectorAll('.prayer-tab-btn');
    
    prayerTabBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            filterPrayersByCategory(this.getAttribute('data-filter'));
            
            // Atualizar tab ativo
            prayerTabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterPrayersByCategory(category) {
    const prayerCards = document.querySelectorAll('.prayer-card');
    
    prayerCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'todas' || cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// ========================================
// COPIAR ORAÇÃO
// ========================================

function setupCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            copyPrayerText(this);
        });
    });
}

function copyPrayerText(button) {
    const prayerCard = button.closest('.prayer-card');
    const prayerText = prayerCard.querySelector('.prayer-text p');
    
    if (!prayerText) {
        alert('Erro ao copiar');
        return;
    }
    
    const text = prayerText.textContent;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showCopySuccess(button))
            .catch(() => fallbackCopy(text, button));
    } else {
        fallbackCopy(text, button);
    }
}

function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        alert('Não foi possível copiar');
    }
    
    document.body.removeChild(textarea);
}

function showCopySuccess(button) {
    const originalText = button.textContent;
    const originalBg = button.style.background;
    
    button.textContent = '✅ Copiado!';
    button.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = originalBg || '';
    }, 2000);
}

// ========================================
// EXPANDABLE CONTENT
// ========================================

function setupExpandButtons() {
    const expandBtns = document.querySelectorAll('.expand-btn');
    
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleExpandContent(this);
        });
    });
}

function toggleExpandContent(button) {
    const content = button.nextElementSibling;
    
    if (!content || !content.classList.contains('expandable-content')) {
        return;
    }
    
    const isHidden = content.style.display === 'none' || content.style.display === '';
    
    if (isHidden) {
        content.style.display = 'block';
        button.textContent = 'Esconder';
        button.setAttribute('aria-expanded', 'true');
    } else {
        content.style.display = 'none';
        button.textContent = 'Saber Mais';
        button.setAttribute('aria-expanded', 'false');
    }
}

// ========================================
// FAQ
// ========================================

function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFAQItem(this);
        });
        
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function toggleFAQItem(questionElement) {
    const faqItem = questionElement.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const allItems = document.querySelectorAll('.faq-item');
    
    // Fechar outros items
    allItems.forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.display = 'none';
        }
    });
    
    // Toggle current
    faqItem.classList.toggle('active');
    
    if (answer) {
        if (answer.style.display === 'none' || answer.style.display === '') {
            answer.style.display = 'block';
            questionElement.setAttribute('aria-expanded', 'true');
        } else {
            answer.style.display = 'none';
            questionElement.setAttribute('aria-expanded', 'false');
        }
    }
}

// ========================================
// SCROLL TO TOP
// ========================================

function setupScrollToTop() {
    let scrollBtn = document.getElementById('scrollToTop');
    
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scrollToTop';
        scrollBtn.innerHTML = '↑ Topo';
        document.body.appendChild(scrollBtn);
    }
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Click handler
    scrollBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// STARTUP MESSAGE
// ========================================

function logStartupMessage() {
    console.clear();
    console.log('%c════════════════════════════════════════════', 'color: #c41e3a; font-weight: bold;');
    console.log('%c🙏 Bem-vindo ao Guia Completo de Exorcismo', 'color: #e0e0e0; font-size: 14px;');
    console.log('%c✝️ Use os botões para navegar entre as seções', 'color: #e0e0e0; font-size: 14px;');
    console.log('%c📖 Clique nos cards para explorar mais conteúdo', 'color: #e0e0e0; font-size: 14px;');
    console.log('%c✅ Todos os scripts carregados com sucesso!', 'color: #2ecc71; font-size: 14px;');
    console.log('%c════════════════════════════════════════════', 'color: #c41e3a; font-weight: bold;');
}
