import { dpr,owaspCategories_ChartJS, categoryIds_ChartJS, updateChartJsChartTitle, downloadChart } from './chart-common.js';

let categoryChart = null;

function updateCategoryChart() {
    const scores = categoryIds_ChartJS.map(id => parseFloat(document.getElementById(id).value) || 0);
    const maxScore = Math.max(...scores);
    const maxScale = Math.max(10, Math.ceil(maxScore / 5) * 5);

    if (categoryChart) {
        categoryChart.options.scales.r.max = maxScale;
        categoryChart.options.scales.r.ticks.stepSize = Math.max(1, Math.ceil(maxScale / 5));
        categoryChart.data.datasets[0].data = scores;
        categoryChart.update();
    }
}

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
    saveAs(blob, `owasp_scores_${new Date().toISOString().slice(0,10)}.csv`);
}

// **【新增】** 主解析函式，自動判斷檔案類型
function parseCategoryFile() {
    const fileInput = document.getElementById('categoryFile');
    if (!fileInput.files.length) { alert('請先選擇檔案'); return; }
    const file = fileInput.files[0];
    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'docx') {
        parseWordForCategories(file);
    } else if (extension === 'csv') {
        parseCSVForCategories(file);
    } else {
        alert('不支援的檔案格式，請選擇 .docx 或 .csv 檔案。');
    }
}

// **【新增】** CSV 解析邏輯
function parseCSVForCategories(file) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            try {
                const categoryCounts = {};
                categoryIds_ChartJS.forEach(id => { categoryCounts[id] = 0; });

                results.data.forEach(row => {
                    const category = row.category ? row.category.trim().toUpperCase() : '';
                    const score = parseFloat(row.score) || 0;
                    if (categoryCounts.hasOwnProperty(category)) {
                        categoryCounts[category] += score; // 如果有多筆相同類別，就累加
                    }
                });

                categoryIds_ChartJS.forEach(id => {
                    document.getElementById(id).value = categoryCounts[id];
                });
                updateCategoryChart();
                alert('CSV 檔案解析成功！');
            } catch (error) {
                alert('解析 CSV 失敗: ' + error.message);
                console.error(error);
            }
        },
        error: function(err) {
            alert('讀取 CSV 檔案時發生錯誤: ' + err.message);
        }
    });
}

// **【修改】** 將原本的 Word 解析邏輯封裝起來
function parseWordForCategories(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        mammoth.convertToHtml({ arrayBuffer: event.target.result })
            .then(function (result) {
                // ... (您原本 parseWordTable 的完整邏輯貼在這裡) ...
                const tempDiv = document.createElement('div'); tempDiv.innerHTML = result.value;
                const tables = tempDiv.querySelectorAll('table');
                if (tables.length < 4) { alert('Word 檔案中找不到預期格式的表格'); return; }
                const categoryCounts = {}; categoryIds_ChartJS.forEach(id => { categoryCounts[id] = 0; });
                const rows = tables[3].querySelectorAll('tr');

                rows.forEach((row, rowIndex) => {
                    if (rowIndex === 0) return;
                    const cells = row.querySelectorAll('td');
                    let owaspText = '', riskCount = 0;
                    if (cells.length === 7) {
                        owaspText = cells[6].innerText.trim();
                        riskCount = parseInt(cells[4].innerText.trim(), 10) || 0;
                    } else if (cells.length === 6) {
                        owaspText = cells[5].innerText.trim();
                        riskCount = parseInt(cells[3].innerText.trim(), 10) || 0;
                    } else { return; }
                    const match = owaspText.match(/A\d{2}/);
                    if (match) { const id = match[0]; if (categoryCounts.hasOwnProperty(id)) { categoryCounts[id] += riskCount; } }
                });
                categoryIds_ChartJS.forEach(id => { document.getElementById(id).value = categoryCounts[id]; });
                updateCategoryChart();
                alert('Word 檔案解析成功！');
            }).catch(function (error) { alert('解析 Word 失敗: ' + error.message); console.error(error); });
    };
    reader.readAsArrayBuffer(file);
}


function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: owaspCategories_ChartJS,
            datasets: [{
                label: '類型數量', data: Array(10).fill(0),
                backgroundColor: 'rgba(255, 107, 51, 0.2)',
                borderColor: 'rgb(255, 107, 51)', borderWidth: 2
            }]
        },
        options: {
            layout: { padding: { top: 10, bottom: 10 } },
            scales: { r: { min: 0, max: 10, beginAtZero: true, ticks: { stepSize: 2, font: { size: 14 * dpr } }, pointLabels: { font: { size: 14 * dpr, family: 'Arial' } } } },
            plugins: { title: { display: true, text: document.getElementById('categoryScoresChartTitle').value || 'OWASP Top 10 安全評估雷達圖', font: { size: 20 * dpr, family: 'Arial' } }, legend: { position: 'top', align: 'center', labels: { boxWidth: 15, padding: 10, font: { size: 12 * dpr, family: 'Arial' } } } },
            devicePixelRatio: dpr, maintainAspectRatio: false
        }
    });
    updateCategoryChart();
}

export function init() {
    initCategoryChart();
    
    // Bind events
    document.querySelectorAll('.category-scores-inputs input').forEach(input => {
        input.addEventListener('input', updateCategoryChart);
    });
    document.getElementById('updateCategoryTitleBtn').addEventListener('click', () => updateChartJsChartTitle(categoryChart, 'categoryScoresChartTitle'));
    document.getElementById('downloadCategoryChartBtn').addEventListener('click', () => downloadChart('categoryChart'));
    document.getElementById('downloadCategoryCSVBtn').addEventListener('click', downloadCategoryCSV);
    document.getElementById('resetCategoryFormBtn').addEventListener('click', resetCategoryForm);
    
    const wordFileInput = document.getElementById('wordFile');
    document.getElementById('parseSeverityFileBtn').addEventListener('click', () => wordFileInput.click());
    wordFileInput.addEventListener('change', parseWordTable);
}