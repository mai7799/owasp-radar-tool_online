import { dpr, owaspCategories_ChartJS, updateChartJsChartTitle, downloadChart } from './chart-common.js';

let severityRadarChart = null;

function parseSeverityFile() {
    const fileInput = document.getElementById('severityWordFile');
    if (!fileInput.files.length) { alert('請先選擇檔案'); return; }
    const file = fileInput.files[0];
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'docx') {
        const reader = new FileReader();
        reader.onload = function (event) {
            mammoth.convertToHtml({ arrayBuffer: event.target.result })
                .then(function (result) {
                    const tempDiv = document.createElement('div'); tempDiv.innerHTML = result.value;
                    const tables = tempDiv.querySelectorAll('table');
                    if (tables.length === 0) { alert('Word 檔案中找不到表格'); return; }
                    const counts = { critical: Array(10).fill(0), high: Array(10).fill(0), medium: Array(10).fill(0), low: Array(10).fill(0) };
                    const rows = tables[3].querySelectorAll('tr');
                    rows.forEach((row, rowIndex) => {
                        if (rowIndex === 0) return;
                        const cells = row.querySelectorAll('td'); let owaspText = '', severityText = '';
                        if (cells.length >= 7) { severityText = cells[3].innerText.trim().toLowerCase(); owaspText = cells[6].innerText.trim(); riskCount = parseInt(cells[4].innerText.trim(), 10) || 0; }
                        else if (cells.length === 6) { severityText = cells[2].innerText.trim().toLowerCase(); owaspText = cells[5].innerText.trim(); riskCount = parseInt(cells[3].innerText.trim(), 10) || 0; }
                        else { return; }
                        const match = owaspText.match(/A\d{2}/);
                        if (match) {
                            const categoryId = match[0]; const idx = categoryIds_ChartJS.indexOf(categoryId);
                            if (idx !== -1) {
                                if (severityText.includes('critical') || severityText.includes('嚴重')) counts.critical[idx] += riskCount;
                                else if (severityText.includes('high') || severityText.includes('高')) counts.high[idx] += riskCount;
                                else if (severityText.includes('medium') || severityText.includes('中')) counts.medium[idx] += riskCount;
                                else if (severityText.includes('low') || severityText.includes('低')) counts.low[idx] += riskCount;
                            }
                        }
                    });
                    updateSeverityRadarChartData(counts);
                }).catch(function (error) { alert('解析 Word 失敗: ' + error.message); });
        };
        reader.readAsArrayBuffer(file);
    } else if (ext === 'csv') {
        Papa.parse(file, {
            header: true, dynamicTyping: true, skipEmptyLines: true,
            complete: function (results) {
                const counts = { critical: Array(10).fill(0), high: Array(10).fill(0), medium: Array(10).fill(0), low: Array(10).fill(0) };
                results.data.forEach(row => {
                    const owaspCol = row['OWASP Category'] || row['category'] || row['OWASP類別'] || row['Category'];
                    const severityCol = row['Severity'] || row['severity'] || row['風險等級'] || row['危害程度'] || row['Risk Level'];
                    if (owaspCol && severityCol) {
                        const categoryId = String(owaspCol).trim().match(/A\d{2}/);
                        const severityText = String(severityCol).trim().toLowerCase();
                        if (categoryId) {
                            const idx = categoryIds_ChartJS.indexOf(categoryId[0]);
                            if (idx !== -1) {
                                if (severityText.includes('critical') || severityText.includes('嚴重')) counts.critical[idx]++;
                                else if (severityText.includes('high') || severityText.includes('高')) counts.high[idx]++;
                                else if (severityText.includes('medium') || severityText.includes('中')) counts.medium[idx]++;
                                else if (severityText.includes('low') || severityText.includes('低')) counts.low[idx]++;
                            }
                        }
                    }
                });
                updateSeverityChartFromData(counts);
            },
            error: function (error) { alert('解析 CSV 失敗: ' + error.message); }
        });
    } else { alert('僅支援 .docx 或 .csv 檔案'); }
}


function updateSeverityChartFromData(counts) {
    if (!severityRadarChart) return;
    const allCountsFlat = [].concat(...Object.values(counts));
    const maxCount = Math.max(...allCountsFlat, 0);
    const maxScale = Math.max(5, Math.ceil(maxCount / 5) * 5);

    severityRadarChart.options.scales.r.max = maxScale;
    severityRadarChart.options.scales.r.ticks.stepSize = Math.max(1, Math.ceil(maxScale / 5));
    severityRadarChart.data.datasets[0].data = counts.critical;
    severityRadarChart.data.datasets[1].data = counts.high;
    severityRadarChart.data.datasets[2].data = counts.medium;
    severityRadarChart.data.datasets[3].data = counts.low;
    severityRadarChart.update();
}

function initSeverityRadarChart() {
    const ctx = document.getElementById('severityRadarChart').getContext('2d');
    severityRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: owaspCategories_ChartJS,
            datasets: [
                { label: 'Critical', data: Array(10).fill(0), backgroundColor: 'rgba(255, 0, 0, 0.2)', borderColor: 'rgba(255, 0, 0, 1)' },
                { label: 'High', data: Array(10).fill(0), backgroundColor: 'rgba(255, 107, 51, 0.2)', borderColor: 'rgba(255, 107, 51, 1)' },
                { label: 'Medium', data: Array(10).fill(0), backgroundColor: 'rgba(255, 204, 0, 0.2)', borderColor: 'rgba(255, 204, 0, 1)' },
                { label: 'Low', data: Array(10).fill(0), backgroundColor: 'rgba(102, 204, 102, 0.2)', borderColor: 'rgba(102, 204, 102, 1)' }
            ]
        },
        options: {
            layout: { padding: { top: 10, bottom: 10 } },
            scales: { r: { min: 0, max: 5, beginAtZero: true, ticks: { stepSize: 1, font: { size: 14 * dpr } }, pointLabels: { font: { size: 14 * dpr, family: 'Arial' } } } },
            plugins: { title: { display: true, text: document.getElementById('severityRadarChartTitle').value || '弱點嚴重度分布雷達圖', font: { size: 20 * dpr, family: 'Arial' }, padding: { top: 0, bottom: 10 } }, legend: { position: 'top', align: 'center', labels: { boxWidth: 15, padding: 10, font: { size: 12 * dpr, family: 'Arial' } } } },
            devicePixelRatio: dpr, maintainAspectRatio: false
        }
    });
}

export function init() {
    initSeverityRadarChart();

    // 綁定事件
    const fileInput = document.getElementById('severityWordFile');
    document.getElementById('parseSeverityFileBtn').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', parseSeverityFile);
    
    document.getElementById('downloadSeverityRadarChartBtn').addEventListener('click', () => downloadChart('severityRadarChart'));
    document.getElementById('updateSeverityRadarTitleBtn').addEventListener('click', () => updateChartJsChartTitle(severityRadarChart, 'severityRadarChartTitle'));
}