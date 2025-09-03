// js/modules/tab-compare-scans.js

import { OWASP_CATEGORIES_CHARTJS, updateChartJsChartTitle, downloadChart } from './chart-common.js';

let compareChart = null;
const colors = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'];

function initCompareChart() {
    const ctx = document.getElementById('compareChart').getContext('2d');
    compareChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: OWASP_CATEGORIES_CHARTJS,
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { r: { min: 0, beginAtZero: true } },
            plugins: {
                title: { display: true, text: '不同測試結果比較雷達圖' },
                legend: { position: 'top' },
            }
        }
    });
}

function addScanResult() {
    const scanName = prompt("請輸入這次測試的名稱 (例如: '第一次掃描', '修復後掃描'):");
    if (!scanName) return;

    if (compareChart.data.datasets.length >= 4) {
        alert("最多只能比較四組資料。");
        return;
    }

    const newDataset = {
        label: scanName,
        data: Array(10).fill(0),
        backgroundColor: colors[compareChart.data.datasets.length],
        borderColor: colors[compareChart.data.datasets.length].replace('0.6', '1'),
        borderWidth: 1
    };
    compareChart.data.datasets.push(newDataset);
    
    renderCompareTable();
    compareChart.update();
}

function renderCompareTable() {
    const tableBody = document.getElementById('compareTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // 清空

    OWASP_CATEGORIES_CHARTJS.forEach((category, index) => {
        const row = tableBody.insertRow();
        const cellCategory = row.insertCell();
        cellCategory.textContent = category;

        compareChart.data.datasets.forEach((dataset, dsIndex) => {
            const cellInput = row.insertCell();
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.value = dataset.data[index];
            input.dataset.dsIndex = dsIndex;
            input.dataset.catIndex = index;
            input.addEventListener('input', updateCompareChartFromTable);
            cellInput.appendChild(input);
        });
    });

    const tableHead = document.getElementById('compareTable').getElementsByTagName('thead')[0].rows[0];
    // 清空除了第一個以外的 th
    while (tableHead.cells.length > 1) {
        tableHead.deleteCell(1);
    }
    compareChart.data.datasets.forEach(dataset => {
        const th = document.createElement('th');
        th.textContent = dataset.label;
        tableHead.appendChild(th);
    });
}

function updateCompareChartFromTable(event) {
    const { dsIndex, catIndex } = event.target.dataset;
    const value = parseFloat(event.target.value) || 0;
    compareChart.data.datasets[dsIndex].data[catIndex] = value;
    
    // 自動調整圖表的最大值
    const allData = compareChart.data.datasets.flatMap(ds => ds.data);
    const maxVal = Math.max(...allData, 10);
    compareChart.options.scales.r.max = Math.ceil(maxVal / 5) * 5;

    compareChart.update();
}

function clearCompareData() {
    if (confirm("確定要清除所有比較資料嗎？")) {
        compareChart.data.datasets = [];
        compareChart.update();
        renderCompareTable();
    }
}

export function init() {
    initCompareChart();
    document.getElementById('addScanBtn').addEventListener('click', addScanResult);
    document.getElementById('clearCompareBtn').addEventListener('click', clearCompareData);
    document.getElementById('updateCompareTitleBtn').addEventListener('click', () => {
        updateChartJsChartTitle(compareChart, 'compareChartTitle');
    });
    document.getElementById('downloadCompareChartBtn').addEventListener('click', () => {
        downloadChart('compareChart');
    });
}