import { owaspCategories_ChartJS, updateChartJsChartTitle, downloadChart } from './chart-common.js';

let compareScanChart = null;

function loadCompareScanData() {
    const initialFile = document.getElementById('initialScan').files[0];
    const followupFile = document.getElementById('followupScan').files[0];
    if (!initialFile || !followupFile) {
        alert('請同時選擇初測與複測的 CSV 檔案。');
        return;
    }
    const datasets = [
        { label: '初測', data: Array(10).fill(0), backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgb(54, 162, 235)', borderWidth: 2 },
        { label: '複測', data: Array(10).fill(0), backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgb(255, 99, 132)', borderWidth: 2 }
    ];
    let filesParsed = 0;
    const processFile = (file, datasetIndex) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                results.data.forEach(row => {
                    const categoryIndex = owaspCategories_ChartJS.findIndex(cat => cat.startsWith(row.category));
                    if (categoryIndex !== -1) {
                        datasets[datasetIndex].data[categoryIndex] = parseFloat(row.score) || 0;
                    }
                });
                filesParsed++;
                if (filesParsed === 2) {
                    compareScanChart.data.datasets = datasets;
                    compareScanChart.update();
                }
            }
        });
    };
    processFile(initialFile, 0);
    processFile(followupFile, 1);
}

function downloadCSVTemplate() {
    let csvContent = 'category,score\n';
    owaspCategories_ChartJS.forEach(cat => {
        csvContent += `${cat.split(':')[0]},0\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'owasp_template.csv');
}

function initCompareScanChart() {
    const ctx = document.getElementById('compareScanChart').getContext('2d');
    compareScanChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: owaspCategories_ChartJS,
            datasets: [
                { label: '初測', data: Array(10).fill(0), backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgb(54, 162, 235)', borderWidth: 2 },
                { label: '複測', data: Array(10).fill(0), backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgb(255, 99, 132)', borderWidth: 2 }
            ]
        },
        options: {
            // 請從您的原始 index.html.txt 檔案中，將 initCompareScanChart 函式中的 options 物件複製到此處
        }
    });
}

export function init() {
    initCompareScanChart();
    // 綁定事件
    document.getElementById('loadCompareScanDataBtn').addEventListener('click', loadCompareScanData);
    document.getElementById('downloadCompareScanChartBtn').addEventListener('click', () => downloadChart('compareScanChart'));
    document.getElementById('downloadCSVTemplateBtn').addEventListener('click', downloadCSVTemplate);
    document.getElementById('updateCompareScanTitleBtn').addEventListener('click', () => updateChartJsChartTitle(compareScanChart, 'compareScansChartTitle'));
}