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

        // 避免重複點擊
        if (clickedTab.classList.contains('active')) {
            return;
        }

        const tabName = clickedTab.dataset.tab;

        // 隱藏所有內容，移除 active class
        tabContents.forEach(content => content.style.display = 'none');
        tabLinks.forEach(link => link.classList.remove('active'));

        // 顯示目標內容，添加 active class
        document.getElementById(tabName).style.display = 'block';
        clickedTab.classList.add('active');
        
        // ECharts 在隱藏的 tab 中初始化會沒有寬高，切換時需要手動 resize
        if (tabName === 'vulnerabilityMap' && window.echartsRadarInstance) {
            setTimeout(() => {
                window.echartsRadarInstance.resize();
            }, 50);
        }
    });

    // 初始化所有模組
    initCategoryScores();
    initVulnerabilityMap();
    initCompareScans();
    initSeverityRadar();
});