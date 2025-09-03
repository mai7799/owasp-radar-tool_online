// js/main.js

// 導入 (import) 所有功能模組的 init 函式
import { init as initCategoryScores } from './modules/tab-category-scores.js';
import { init as initVulnerabilityMap } from './modules/tab-vulnerability-map.js';
import { init as initCompareScans } from './modules/tab-compare-scans.js';
import { init as initSeverityRadar } from './modules/tab-severity-radar.js';

// 當 DOM 載入完成後執行
document.addEventListener('DOMContentLoaded', () => {
    
    // 頁籤切換邏輯
    const tabContainer = document.querySelector('.tab');
    const tabContents = document.querySelectorAll('.tabcontent');
    const tabLinks = document.querySelectorAll('.tablinks');

    tabContainer.addEventListener('click', (event) => {
        const clickedTab = event.target.closest('button.tablinks');
        if (!clickedTab) return;

        const tabName = clickedTab.dataset.tab;

        // 隱藏所有內容，移除 active class
        tabContents.forEach(content => content.style.display = 'none');
        tabLinks.forEach(link => link.classList.remove('active'));

        // 顯示目標內容，添加 active class
        document.getElementById(tabName).style.display = 'block';
        clickedTab.classList.add('active');
        
        // 特別處理 ECharts 的重繪問題
        if (tabName === 'vulnerabilityMap') {
            // 假設 echartsRadarInstance 是在 tab-vulnerability-map.js 中建立並掛載到 window 上的
            // 更好的做法是讓該模組導出一個 resize 函式
            setTimeout(() => {
                if (window.echartsRadarInstance) {
                    window.echartsRadarInstance.resize();
                }
            }, 50);
        }
    });

    // 初始化所有模組
    initCategoryScores();
    initVulnerabilityMap();
    initCompareScans();
    initSeverityRadar();
});