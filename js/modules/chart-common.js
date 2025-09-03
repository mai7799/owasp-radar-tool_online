export const owaspCategories_ChartJS = [
    'A01: 權限控制失效', 'A02: 加密機制失效', 'A03: 注入式攻擊', 'A04: 不安全設計',
    'A05: 安全設定弱點', 'A06: 危險或過舊的元件', 'A07: 認證及驗證機制失效',
    'A08: 軟體及資料完整性失效', 'A09: 資安記錄及監控失效', 'A10: 伺服端請求偽造'
];
export const categoryIds_ChartJS = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10'];

// For Chart.js charts
export function updateChartJsChartTitle(chartInstance, titleInputId) {
    const newTitle = document.getElementById(titleInputId).value;
    if (chartInstance?.options?.plugins?.title) {
        chartInstance.options.plugins.title.text = newTitle;
        chartInstance.update();
    }
}

// For ECharts charts
export function updateEChartsChartTitle(echartsInstance, titleInputId) {
    const newTitle = document.getElementById(titleInputId).value;
    if (echartsInstance) {
        echartsInstance.setOption({ title: { text: newTitle } });
    }
}

// Universal download function
export function downloadChart(canvasId, isEchart = false, instance = null) {
    const link = document.createElement('a');
    const date = new Date();
    const dateStr = date.toISOString().replace(/[:.]/g, '-').substring(0, 19);
    link.download = `${canvasId}_${dateStr}.png`;

    if (isEchart && instance) {
        link.href = instance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' });
    } else {
        const canvas = document.getElementById(canvasId);
        link.href = canvas.toDataURL('image/png');
    }
    link.click();
}