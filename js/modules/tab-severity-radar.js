import { dpr, owaspCategories_ChartJS, updateChartJsChartTitle, downloadChart } from './chart-common.js';

let severityRadarChart = null;

function parseSeverityFile() {
    // 請從您的原始 index.html.txt 檔案中，將 parseSeverityFile 函式的完整內容複製到此處
    alert("請將 parseSeverityFile 函式的內容從原始碼貼上");
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