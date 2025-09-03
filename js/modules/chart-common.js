// js/modules/chart-common.js

// 導出 (export) 共用常數
export const OWASP_CATEGORIES_CHARTJS = [
    'A01: 權限控制失效', 'A02: 加密機制失效', 'A03: 注入式攻擊', 'A04: 不安全設計',
    'A05: 安全設定弱點', 'A06: 危險或過舊的元件', 'A07: 認證及驗證機制失效',
    'A08: 軟體及資料完整性失效', 'A09: 資安記錄及監控失效', 'A10: 伺服端請求偽造'
];
export const CATEGORY_IDS = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10'];

// 導出 (export) 共用函式
export function updateChartJsChartTitle(chartInstance, titleInputId) {
    const titleInputElement = document.getElementById(titleInputId);
    if (!titleInputElement) return;
    const newTitle = titleInputElement.value;
    if (chartInstance?.options?.plugins?.title) {
        chartInstance.options.plugins.title.text = newTitle;
        chartInstance.update();
    }
}

export function updateEChartsChartTitle(echartsInstance, titleInputId) {
    const titleInputElement = document.getElementById(titleInputId);
    if (!titleInputElement) {
        alert(`錯誤：找不到標題輸入框 ID '${titleInputId}'`);
        console.error(`Error: Title input element with ID '${titleInputId}' not found.`);
        return;
    }
    const newTitle = titleInputElement.value;
    if (echartsInstance) {
        const currentTitleConfig = echartsInstance.getOption().title;
        if (currentTitleConfig && typeof currentTitleConfig === 'object' && !Array.isArray(currentTitleConfig)) { // ECharts title is an object
            echartsInstance.setOption({
                title: {
                    ...currentTitleConfig,
                    text: newTitle
                }
            });
        } else if (currentTitleConfig && Array.isArray(currentTitleConfig) && currentTitleConfig.length > 0) { // ECharts title can be an array
            echartsInstance.setOption({
                title: {
                    ...currentTitleConfig[0],
                    text: newTitle
                }
            });
        }
        else {
            echartsInstance.setOption({
                title: {
                    text: newTitle,
                    left: 'center',
                    top: 10
                }
            });
            console.warn("ECharts title configuration was not found as expected. Applied new title with default settings.");
        }
    } else {
        alert('錯誤：ECharts 圖表物件未正確傳遞或未初始化。');
        console.error('Error: ECharts instance is null or undefined.');
    }
}

export function downloadChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) { alert(`圖表 ID '${canvasId}' 未找到!`); return; }
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const date = new Date();
    const dateStr = date.toISOString().replace(/[:.]/g, '-').substring(0, 19);
    link.download = `${canvasId}_${dateStr}.png`;
    link.href = image;
    link.click();
    if (canvasId === 'categoryChart') {
        if (confirm('是否同時下載類別評分資料的CSV檔案？')) {
            downloadCategoryCSV();
        }
    }
}