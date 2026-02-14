/* ========================================
   EXORCISM COMPLETE GUIDE - JAVASCRIPT FINAL
   ======================================== */

// ========================================
// INICIALIZAÇÃO E SETUP
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupExpandableContent();
    setupPrayerFiltering();
    setupFAQ();
    setupScrollToTop();
    setupObserverAnimations();
    setupFeatureCards();
    setupPrayerCards();
    setupKeyboardNavigation();
    setupSmoothScroll();
    loadHomeSection();
    logStartupMessage();
}

// ========================================
// NAVEGAÇÃO PRINCIPAL
// ========================================

const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

function setupNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigation(this);
        });
    });
}

function handleNavigation(button) {
    // Remove active class from all buttons
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const sectionId = button.getAttribute('data-section');
    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll to top with smooth behavior
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Log navigation
        console.log(`Navegou para: ${sectionId}`);
    }
}

function openSection(sectionId) {
    const button = document.querySelector(`[data-section="${sectionId}"]`);
    if (button) {
        handleNavigation(button);
    }
}

// ========================================
// CONTEÚDO EXPANSÍVEL (PROTEÇÃO)
// ========================================

function setupExpandableContent() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleExpandableContent(this);
        });
    });
}

function toggleExpandableContent(button) {
    const expandableContent = button.nextElementSibling;
    
    if (expandableContent && expandableContent.classList.contains('expandable-content')) {
        const isHidden = expandableContent.style.display === 'none';
        
        if (isHidden) {
            expandableContent.style.display = 'block';
            expandableContent.style.animation = 'slideDown 0.3s ease';
            button.textContent = 'Esconder';
            button.style.background = 'linear-gradient(135deg, #a01530, #d63447)';
        } else {
            expandableContent.style.display = 'none';
            button.textContent = 'Saber Mais';
            button.style.background = 'linear-gradient(135deg, #c41e3a, #ff4757)';
        }
        
        console.log('Conteúdo expansível alternado');
    }
}

// ========================================
// FILTRO DE ORAÇÕES
// ========================================

function setupPrayerFiltering() {
    const prayerTabs = document.querySelectorAll('.prayer-tab-btn');
    
    prayerTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('onclick');
            const categoryName = category.match(/'([^']*)'/)[1];
            filterPrayers(categoryName, this);
        });
    });
}

function filterPrayers(category, clickedButton) {
    const prayers = document.querySelectorAll('.prayer-card');
    const tabs = document.querySelectorAll('.prayer-tab-btn');
    
    // Update active tab
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (clickedButton) {
        clickedButton.classList.add('active');
    } else {
        // Find and update the clicked button
        const button = Array.from(tabs).find(tab => {
            const onclick = tab.getAttribute('onclick');
            return onclick && onclick.includes(category);
        });
        if (button) button.classList.add('active');
    }
    
    // Filter prayers with animation
    let visibleCount = 0;
    
    prayers.forEach((prayer, index) => {
        const prayerCategory = prayer.getAttribute('data-category');
        
        if (category === 'todas' || prayerCategory === category) {
            prayer.style.display = 'block';
            prayer.style.animation = 'fadeIn 0.5s ease';
            prayer.style.animationDelay = `${index * 0.05}s`;
            visibleCount++;
        } else {
            prayer.style.display = 'none';
        }
    });
    
    console.log(`Filtro de orações: ${category} - ${visibleCount} orações visíveis`);
}

// ========================================
// COPIAR ORAÇÃO
// ========================================

function copyPrayer(button) {
    const prayerCard = button.closest('.prayer-card');
    const prayerText = prayerCard.querySelector('.prayer-text p');
    
    if (!prayerText) {
        alert('Erro ao copiar a oração');
        return;
    }
    
    const text = prayerText.textContent;
    
    // Usar Clipboard API se disponível
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(button);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            fallbackCopyText(text, button);
        });
    } else {
        // Fallback para navegadores antigos
        fallbackCopyText(text, button);
    }
}

function fallbackCopyText(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(button);
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Não foi possível copiar o texto');
    }
    
    document.body.removeChild(textarea);
}

function showCopyFeedback(button) {
    const originalText = button.textContent;
    const originalBackground = button.style.background;
    
    button.textContent = '✅ Copiado!';
    button.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = originalBackground;
    }, 2500);
    
    console.log('Oração copiada para clipboard');
}

// ========================================
// SEÇÃO FAQ
// ========================================

function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFaq(this);
        });
    });
}

function toggleFaq(questionElement) {
    const faqItem = questionElement.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = questionElement.querySelector('.faq-icon');
    
    // Get all FAQ items
    const allItems = document.querySelectorAll('.faq-item');
    
    // Close other FAQ items
    allItems.forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-icon');
            
            if (otherAnswer) otherAnswer.style.display = 'none';
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current item
    faqItem.classList.toggle('active');
    
    if (answer) {
        if (answer.style.display === 'none' || answer.style.display === '') {
            answer.style.display = 'block';
            answer.style.animation = 'slideDown 0.3s ease';
        } else {
            answer.style.display = 'none';
        }
    }
    
    console.log('FAQ alternado');
}

// ========================================
// BOTÃO VOLTAR AO TOPO
// ========================================

function setupScrollToTop() {
    // Create scroll to top button if it doesn't exist
    let scrollButton = document.getElementById('scrollToTop');
    
    if (!scrollButton) {
        scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑ Topo';
        scrollButton.id = 'scrollToTop';
        document.body.appendChild(scrollButton);
    }
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollButton.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToTop();
    });
    
    // Hover effects
    scrollButton.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #a01530, #d63447)';
        this.style.transform = 'scale(1.15)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, #c41e3a, #ff4757)';
        this.style.transform = 'scale(1)';
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    console.log('Voltando ao topo');
}

// ========================================
// ANIMAÇÕES AO SCROLL (INTERSECTION OBSERVER)
// ========================================

function setupObserverAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll(
        '.content-box, .ritual-card, .prayer-card, .timeline-item, .protection-card, .faq-item, .stat'
    );
    
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// CARDS DE FEATURE
// ========================================

function setupFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        // Click to open section
        card.addEventListener('click', function() {
            const sections = ['definicao', 'rituais', 'oracoes', 'protecao', 'historia', 'faq'];
            
            if (index < sections.length) {
                const button = document.querySelector(`[data-section="${sections[index]}"]`);
                if (button) {
                    handleNavigation(button);
                }
            }
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-12px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
}

// ========================================
// CARDS DE ORAÇÃO
// ========================================

function setupPrayerCards() {
    const prayerCards = document.querySelectorAll('.prayer-card');
    
    prayerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02) translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
}

// ========================================
// NAVEGAÇÃO POR TECLADO
// ========================================

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        const sectionArray = Array.from(sections);
        const currentIndex = sectionArray.findIndex(section => section.classList.contains('active'));
        
        // Arrow right - next section
        if ((event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') && currentIndex < sectionArray.length - 1) {
            event.preventDefault();
            navButtons[currentIndex + 1].click();
        }
        // Arrow left - previous section
        else if ((event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') && currentIndex > 0) {
            event.preventDefault();
            navButtons[currentIndex - 1].click();
        }
        // Home key
        else if (event.key === 'Home') {
            event.preventDefault();
            navButtons[0].click();
        }
        // End key
        else if (event.key === 'End') {
            event.preventDefault();
            navButtons[navButtons.length - 1].click();
        }
    });
    
    console.log('Navegação por teclado ativada (setas, A, D, Home, End)');
}

// ========================================
// SCROLL SUAVE
// ========================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ========================================
// CARREGAMENTO INICIAL
// ========================================

function loadHomeSection() {
    const homeButton = document.querySelector('[data-section="home"]');
    
    if (homeButton) {
        handleNavigation(homeButton);
    }
}

// ========================================
// UTILIDADES E HELPERS
// ========================================

/**
 * Formata um texto removendo espaços em branco extras
 */
function trimText(text) {
    return text.trim().replace(/\s+/g, ' ');
}

/**
 * Detecta se o dispositivo é móvel
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Obtém a hora atual formatada
 */
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('pt-BR');
}

/**
 * Verifica suporte ao Clipboard API
 */
function hasClipboardSupport() {
    return navigator.clipboard && navigator.clipboard.writeText;
}

/**
 * Log customizado com timestamp
 */
function customLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const icon = {
        'info': 'ℹ️',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌'
    }[type] || 'ℹ️';
    
    console.log(`${icon} [${timestamp}] ${message}`);
}

// ========================================
// MONITORAMENTO E ANALYTICS
// ========================================

/**
 * Rastreia cliques de navegação
 */
function trackNavigation(sectionId) {
    const navigationData = {
        section: sectionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // Armazenar no sessionStorage para análise
    let navigationHistory = JSON.parse(sessionStorage.getItem('navigationHistory') || '[]');
    navigationHistory.push(navigationData);
    sessionStorage.setItem('navigationHistory', JSON.stringify(navigationHistory));
}

/**
 * Rastreia tempo na página
 */
function trackTimeOnPage() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const timeOnPage = (Date.now() - startTime) / 1000;
        customLog(`Tempo na página: ${timeOnPage.toFixed(2)} segundos`, 'info');
    });
}

// ========================================
// EVENTOS DE VISIBILIDADE
// ========================================

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        customLog('Página minimizada', 'warning');
    } else {
        customLog('Página ativa novamente', 'success');
    }
});

// ========================================
// DETECÇÃO DE CONEXÃO
// ========================================

window.addEventListener('online', function() {
    customLog('Conexão restaurada', 'success');
    showNotification('✅ Conexão restaurada');
});

window.addEventListener('offline', function() {
    customLog('Conexão perdida', 'error');
    showNotification('⚠️ Sem conexão com a internet');
});

/**
 * Mostra notificação na página
 */
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInFromRight 0.3s ease;
        font-family: 'Segoe UI', sans-serif;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========================================
// PERFORMANCE MONITORING
// ========================================

window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    customLog(`Tempo de carregamento: ${pageLoadTime}ms`, 'success');
    
    // Mostrar recursos carregados
    const resources = window.performance.getEntriesByType('resource');
    customLog(`Recursos carregados: ${resources.length}`, 'info');
});

// ========================================
// TRATAMENTO DE ERROS
// ========================================

window.addEventListener('error', function(event) {
    customLog(`Erro detectado: ${event.message}`, 'error');
    console.error('Erro completo:', event);
});

window.addEventListener('unhandledrejection', function(event) {
    customLog(`Promise rejeitada: ${event.reason}`, 'error');
    console.error('Rejeição não tratada:', event.reason);
});

// ========================================
// CONFIGURAÇÕES DE TEMA
// ========================================

/**
 * Detecta preferência de tema do sistema
 */
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        customLog('Tema escuro detectado', 'info');
        return 'dark';
    }
    return 'light';
}

/**
 * Alterna entre temas
 */
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    customLog(`Tema alterado para: ${newTheme}`, 'success');
}

// ========================================
// ARMAZENAMENTO LOCAL
// ========================================

/**
 * Salva preferências do usuário
 */
function saveUserPreferences() {
    const preferences = {
        theme: localStorage.getItem('theme') || 'dark',
        lastVisitedSection: sessionStorage.getItem('lastSection') || 'home',
        navigationHistory: JSON.parse(sessionStorage.getItem('navigationHistory') || '[]')
    };
    
    return preferences;
}

/**
 * Restaura preferências do usuário
 */
function restoreUserPreferences() {
    const theme = localStorage.getItem('theme');
    
    if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        customLog(`Tema restaurado: ${theme}`, 'info');
    }
}

// ========================================
// FUNÇÕES DE ACESSIBILIDADE
// ========================================

/**
 * Melhora acessibilidade
 */
function improveAccessibility() {
    // Adicionar atributos ARIA
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.setAttribute('role', 'main');
    }
    
    // Adicionar skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #c41e3a;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    customLog('Acessibilidade melhorada', 'success');
}

// ========================================
// INICIALIZAÇÃO NA RESTAURAÇÃO DE PREFERÊNCIAS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    restoreUserPreferences();
    improveAccessibility();
    trackTimeOnPage();
});

// ========================================
// MENSAGEM DE INICIALIZAÇÃO
// ========================================

function logStartupMessage() {
    const messages = [
        '🙏 Bem-vindo ao Guia Completo de Exorcismo',
        '✝️ Use as setas do teclado (← →) ou A/D para navegar',
        '📖 Clique nos cards para explorar mais conteúdo',
        '⌨️ Pressione Home para ir ao início ou End para ir ao final',
        `📱 Dispositivo: ${isMobileDevice() ? 'Móvel' : 'Desktop'}`,
        `🌐 Suporte Clipboard: ${hasClipboardSupport() ? 'Sim' : 'Não'}`,
        `🎨 Tema: ${detectSystemTheme()}`,
        '💾 Histórico de navegação salvo automaticamente'
    ];
    
    console.clear();
    console.log('%c════════════════════════════════════════════', 'color: #c41e3a; font-weight: bold;');
    messages.forEach(msg => {
        console.log('%c' + msg, 'color: #e0e0e0; font-size: 14px;');
    });
    console.log('%c════════════════════════════════════════════', 'color: #c41e3a; font-weight: bold;');
    console.log('%cSite desenvolvido com devoção e fé cristã', 'color: #ffc107; font-style: italic; font-size: 12px;');
}

// ========================================
// SERVICE WORKER (Offline Support)
// ========================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
        customLog('Service Worker registrado', 'success');
    }).catch(error => {
        customLog(`Erro ao registrar Service Worker: ${error}`, 'error');
    });
}

// ========================================
// EXPORTAR FUNÇÕES GLOBAIS
// ========================================

// Tornar funções disponíveis globalmente para botões onclick
window.openSection = openSection;
window.filterPrayers = filterPrayers;
window.copyPrayer = copyPrayer;
window.toggleFaq = toggleFaq;
window.toggleExpandableContent = toggleExpandableContent;
window.scrollToTop = scrollToTop;
window.toggleTheme = toggleTheme;
window.saveUserPreferences = saveUserPreferences;
window.restoreUserPreferences = restoreUserPreferences;

// ========================================
// FIM DO SCRIPT
// ========================================

console.log('🎉 Todos os scripts carregados com sucesso!');
