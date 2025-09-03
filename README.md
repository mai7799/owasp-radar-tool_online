# OWASP 安全評估雷達圖工具 (OWASP Security Assessment Radar Chart Tool)

[![GitHub Pages Deploy](https://img.shields.io/github/deployments/mai7799/owasp-radar-tool_online/production?label=Live%20Demo&logo=github)](https://mai7799.github.io/owasp-radar-tool_online/)

一個專為資訊安全從業人員、開發者與專案經理設計的網頁工具，旨在將 OWASP Top 10 安全風險評估結果視覺化，使其更直觀、易於理解與報告。

[**➡️ 前往線上工具 (Live Demo)**](https://mai7799.github.io/owasp-radar-tool_online/)

![工具主頁面截圖](https://github.com/user-attachments/assets/dd8fb696-94b9-463f-894a-d63664e95b68)

---

## ✨ 主要功能

本工具提供四種不同的視覺化圖表，以應對不同的報告與分析需求：

1.  **類別數量雷達圖 (Category Count Radar Chart)**
    * **用途**：快速統計在 OWASP Top 10 的各個類別中，分別發現了多少數量的弱點。
    * **輸入**：手動輸入每個類別的弱點數量，或從特定格式的 Word 報告中自動解析。
    * **輸出**：一張顯示各類別弱點數量的雷達圖，可下載為 PNG 圖片或 CSV 資料。
<img width="865" height="648" alt="image" src="https://github.com/user-attachments/assets/4a136146-7503-444d-890e-7d36d5a870e5" />

2.  **弱點分布雷達圖 (Vulnerability Distribution Polar Scatter Plot)**
    * **用途**：在極座標圖上精確展示每一個獨立弱點的 OWASP 分類及其對應的 CVE 風險分數。
    * **輸入**：手動逐一新增弱點名稱、選擇類別並輸入 CVE 分數 (1-10)。也可從特定格式的 Word 報告中自動解析名稱、分類與分數。
    * **輸出**：一張極座標散佈圖，點的位置代表弱點分類與風險，並可透過顏色區分風險等級。
<img width="865" height="613" alt="image" src="https://github.com/user-attachments/assets/809a7172-c572-400d-b2ed-c0a4e79a3e9d" />

3.  **測試比較雷達圖 (Scan Comparison Radar Chart)**
    * **用途**：比較兩次不同時間點（例如：初測與複測）的掃描結果，清晰呈現風險修復的進展。
    * **輸入**：上傳兩份包含 `category` 和 `score` 欄位的 CSV 檔案。
    * **輸出**：一張包含兩組數據的疊加雷達圖，可直觀比較差異。
<img width="865" height="648" alt="image" src="https://github.com/user-attachments/assets/f98bf1ac-b4e2-404c-bf69-d89cfa573a01" />

4.  **弱點嚴重度分布雷達圖 (Severity Distribution Radar Chart)**
    * **用途**：將不同嚴重等級（嚴重、高、中、低）的弱點數量分布在各個 OWASP 類別上，以評估整體風險態勢。
    * **輸入**：從特定格式的 Word 或 CSV 檔案中解析各類別下不同嚴重度的弱點數量。
    * **輸出**：一張多層次的雷達圖，每種顏色代表一種風險等級。
<img width="865" height="648" alt="image" src="https://github.com/user-attachments/assets/15872c37-1beb-42f7-abaf-acf2edab983d" />

---

## 🚀 如何使用

1.  **訪問線上工具**：[點擊此處](https://mai7799.github.io/owasp-radar-tool_online/)。
2.  **選擇頁籤**：點擊頂部的頁籤以切換到您需要的功能。
3.  **輸入資料**：
    * **手動輸入**：直接在左側的表單中填寫數字或新增弱點。
    * **檔案解析**：點擊對應的「解析Word」或「上傳CSV」按鈕，選擇您的報告檔案。
4.  **即時預覽**：右側的圖表會根據您的輸入即時更新。
5.  **下載成果**：點擊「下載雷達圖」或「下載CSV」按鈕，即可將圖表或資料儲存至本機。

---

## 🛠️ 技術棧

本專案完全基於前端技術，所有運算都在您的瀏覽器中完成，確保資料的私密性。

* **HTML5**
* **CSS3**
* **JavaScript (ES6 Modules)**
* **[Chart.js](https://www.chartjs.org/)** - 用於繪製雷達圖。
* **[Apache ECharts](https://echarts.apache.org/)** - 用於繪製功能更豐富的極座標散佈圖。
* **[Mammoth.js](https://github.com/mwilliamson/mammoth.js)** - 用於解析 `.docx` Word 檔案。
* **[PapaParse](https://www.papaparse.com/)** - 用於解析 CSV 檔案。
* **[FileSaver.js](https://github.com/eligrey/FileSaver.js/)** - 用於在客戶端儲存檔案。

---

## 💻 本地開發

如果您想在本地端運行或修改此專案：

1.  **Clone 專案**
    ```bash
    git clone [https://github.com/mai7799/owasp-radar-tool_online.git](https://github.com/mai7799/owasp-radar-tool_online.git)
    ```

2.  **進入專案目錄**
    ```bash
    cd owasp-radar-tool_online
    ```

3.  **啟動本地伺服器**
    由於本專案使用 JavaScript 模組 (`import`/`export`)，您需要透過一個本地伺服器來運行，不能直接用 `file://` 協定打開 `index.html`。
    
    * **推薦方式**：如果您使用 VS Code，可以安裝 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 擴充功能，然後在 `index.html` 上按右鍵選擇 "Open with Live Server"。
    * **Python 方式**：
        ```bash
        # Python 3
        python -m http.server
        # Python 2
        python -m SimpleHTTPServer
        ```
    
4.  在瀏覽器中打開 `http://localhost:[對應的埠號]` 即可。

---

## 📄 授權 (License)

本專案採用 [MIT License](LICENSE) 授權。
