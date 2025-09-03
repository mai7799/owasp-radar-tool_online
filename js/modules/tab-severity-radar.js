// js/modules/tab-severity-radar.js

import { OWASP_CATEGORIES_CHARTJS, updateChartJsChartTitle, downloadChart } from './chart-common.js';

let severityRadarChart = null;

function initSeverityRadarChart() {
    const ctx = document.getElementById('severityRadarChart').getContext('2d');
    severityRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: OWASP_CATEGORIES_CHARTJS,
            datasets: [
                { label: 'Critical', data: Array(10).fill(0), backgroundColor: 'rgba(255, 0, 0, 0.2)', borderColor: 'rgba(255, 0, 0, 1)', borderWidth: 1 },
                { label: 'High', data: Array(10).fill(0), backgroundColor: 'rgba(255, 107, 51, 0.2)', borderColor: 'rgba(255, 107, 51, 1)', borderWidth: 1 },
                { label: 'Medium', data: Array(10).fill(0), backgroundColor: 'rgba(255, 204, 0, 0.2)', borderColor: 'rgba(255, 204, 0, 1)', borderWidth: 1 },
                { label: 'Low', data: Array(10).fill(0), backgroundColor: 'rgba(102, 204, 102, 0.2)', borderColor: 'rgba(102, 204, 102, 1)', borderWidth: 1 },
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { r: { min: 0, max: 10, beginAtZero: true, ticks: { stepSize: 2 } } },
            plugins: { title: { display: true, text: 'OWASP 弱點嚴重度分布圖' } }
        }
    });
}

function updateSeverityChart() {
    const counts = { critical: [], high: [], medium: [], low: [] };
    const severities = ['critical', 'high', 'medium', 'low'];
    
    severities.forEach(severity => {
        OWASP_CATEGORIES_CHARTJS.forEach((_, index) => {
            const catId = `A${(index + 1).toString().padStart(2, '0')}`;
            const inputId = `${catId}-${severity}`;
            counts[severity].push(parseInt(document.getElementById(inputId).value) || 0);
        });
    });

    const allCountsFlat = [].concat(...Object.values(counts));
    const maxCount = Math.max(...allCountsFlat, 5); // 至少為5
    const maxScale = Math.ceil(maxCount / 5) * 5;
    
    if (severityRadarChart) {
        severityRadarChart.options.scales.r.max = maxScale;
        severityRadarChart.options.scales.r.ticks.stepSize = Math.max(1, Math.ceil(maxScale / 5));
        severityRadarChart.data.datasets[0].data = counts.critical;
        severityRadarChart.data.datasets[1].data = counts.high;
        severityRadarChart.data.datasets[2].data = counts.medium;
        severityRadarChart.data.datasets[3].data = counts.low;
        severityRadarChart.update();
    }
}

function createSeverityInputs() {
    const container = document.getElementById('severityInputsContainer');
    container.innerHTML = '';
    OWASP_CATEGORIES_CHARTJS.forEach((category, index) => {
        const catId = `A${(index + 1).toString().padStart(2, '0')}`;
        const div = document.createElement('div');
        div.className = 'form-group-grid';
        div.innerHTML = `<label>${category}</label>`;
        ['critical', 'high', 'medium', 'low'].forEach(severity => {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `${catId}-${severity}`;
            input.min = 0;
            input.value = 0;
            input.placeholder = severity.charAt(0).toUpperCase() + severity.slice(1);
            input.addEventListener('input', updateSeverityChart);
            div.appendChild(input);
        });
        container.appendChild(div);
    });
}

function clearSeverityInputs() {
     if (confirm("確定要重置所有嚴重度數量嗎？")) {
        const inputs = document.querySelectorAll('#severityInputsContainer input[type="number"]');
        inputs.forEach(input => input.value = 0);
        updateSeverityChart();
    }
}

export function init() {
    initSeverityRadarChart();
    createSeverityInputs();
    updateSeverityChart(); // Initial draw

    document.getElementById('updateSeverityTitleBtn').addEventListener('click', () => {
        updateChartJsChartTitle(severityRadarChart, 'severityChartTitle');
    });
    document.getElementById('clearSeverityBtn').addEventListener('click', clearSeverityInputs);
    document.getElementById('downloadSeverityChartBtn').addEventListener('click', () => {
        downloadChart('severityRadarChart');
    });
}