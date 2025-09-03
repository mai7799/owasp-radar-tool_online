// js/modules/tab-category-scores.js

// 從共用模組導入 (import) 需要的變數和函式
import { OWASP_CATEGORIES_CHARTJS, CATEGORY_IDS, updateChartJsChartTitle, downloadChart } from './chart-common.js';

// 此模組的私有變數，不會污染全域
let categoryChart = null;

// 主要的更新圖表函式
function updateCategoryChart() {
    const scores = CATEGORY_IDS.map(id => parseFloat(document.getElementById(id).value) || 0);
    const maxScore = Math.max(...scores, 10); // 至少為 10
    const maxScale = Math.max(10, Math.ceil(maxScore / 5) * 5);

    if (categoryChart) {
        categoryChart.options.scales.r.max = maxScale;
        categoryChart.options.scales.r.ticks.stepSize = Math.max(1, Math.ceil(maxScale / 5));
        categoryChart.data.datasets[0].data = scores;
        categoryChart.update();
    }
}

// 初始化圖表的函式
function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: OWASP_CATEGORIES_CHARTJS,
            datasets: [{
                label: '類型數量', data: Array(10).fill(0),
                backgroundColor: 'rgba(255, 107, 51, 0.2)',
                borderColor: 'rgb(255, 107, 51)',
                borderWidth: 2
            }]
        },
        options: {
            // ... (從原始碼複製 options 設定)
            scales: { r: { min: 0, max: 10, beginAtZero: true, ticks: { stepSize: 2 } } },
            plugins: { title: { display: true, text: document.getElementById('categoryScoresChartTitle').value } },
        }
    });
}

// 其他此頁籤的函式
function resetCategoryForm() {
    categoryIds_ChartJS.forEach(id => { document.getElementById(id).value = 0; });
    if (categoryChart) {
        categoryChart.options.scales.r.max = 10;
        categoryChart.options.scales.r.ticks.stepSize = 2;
    }
    updateCategoryChart();
}
function downloadCategoryCSV() {
    const scores = categoryIds_ChartJS.map(id => parseFloat(document.getElementById(id).value) || 0);
    let csvContent = 'category,score\n';
    categoryIds_ChartJS.forEach((category, index) => { csvContent += `${category},${scores[index]}\n`; });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const date = new Date(); const dateStr = date.toISOString().replace(/[:.]/g, '-').substring(0, 19);
    saveAs(blob, `owasp_scores_${dateStr}.csv`);
}
function parseWordTable() {
    const fileInput = document.getElementById('wordFile');
    if (!fileInput.files.length) { alert('請先選擇 Word 檔案'); return; }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        mammoth.convertToHtml({ arrayBuffer: event.target.result })
            .then(function (result) {
                const tempDiv = document.createElement('div'); tempDiv.innerHTML = result.value;
                const tables = tempDiv.querySelectorAll('table');
                if (tables.length === 0) { alert('找不到表格'); return; }
                const categoryCounts = {}; categoryIds_ChartJS.forEach(id => { categoryCounts[id] = 0; });
                const rows = tables[3].querySelectorAll('tr');

                rows.forEach((row, rowIndex) => {
                    if (rowIndex === 0) return; const cells = row.querySelectorAll('td');
                    let owaspText = '';
                    if (cells.length === 7) {
                        owaspText = cells[6].innerText.trim();
                        riskCount = parseInt(cells[4].innerText.trim(), 10) || 0;
                    }
                    else if (cells.length === 6) {
                        owaspText = cells[5].innerText.trim();
                        riskCount = parseInt(cells[3].innerText.trim(), 10) || 0;
                    }
                    else { return; }
                    const match = owaspText.match(/A\d{2}/);
                    if (match) { const id = match[0]; if (categoryCounts.hasOwnProperty(id)) { categoryCounts[id] += riskCount; } }
                });
                const maxCount = Math.max(...Object.values(categoryCounts), 0);
                const maxScale = Math.max(5, Math.ceil(maxCount / 5) * 5);
                if (categoryChart) {
                    categoryChart.options.scales.r.max = maxScale;
                    categoryChart.options.scales.r.ticks.stepSize = Math.max(1, Math.ceil(maxScale / 5));
                    categoryIds_ChartJS.forEach(id => { const input = document.getElementById(id); if (input) { input.value = categoryCounts[id]; } });
                    updateCategoryChart();
                }
            }).catch(function (error) { alert('解析失敗: ' + error.message); });
    };
    reader.readAsArrayBuffer(file);
}


// 導出一個 init 函式，作為此模組的入口
export function init() {
    // 1. 初始化圖表
    initCategoryChart();
    
    // 2. 綁定事件監聽器
    const inputs = document.querySelectorAll('.category-scores-inputs input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', updateCategoryChart);
    });

    document.getElementById('updateCategoryTitleBtn').addEventListener('click', () => {
        updateChartJsChartTitle(categoryChart, 'categoryScoresChartTitle');
    });
    
    document.getElementById('downloadCategoryChartBtn').addEventListener('click', () => downloadChart('categoryChart'));
    document.getElementById('downloadCategoryCSVBtn').addEventListener('click', downloadCategoryCSV);
    document.getElementById('resetCategoryFormBtn').addEventListener('click', resetCategoryForm);
    
    const wordFileInput = document.getElementById('wordFile');
    document.getElementById('parseWordBtn').addEventListener('click', () => wordFileInput.click());
    wordFileInput.addEventListener('change', parseWordTable);

    // 初始更新一次
    updateCategoryChart();
}