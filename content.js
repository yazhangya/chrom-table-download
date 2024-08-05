// content.js
(function() {
    'use strict';

    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }


    // Function to create and download the Excel file
    function downloadTableAsExcel(table,index) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(table, {raw: true});
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }

        const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table_'+index+'_'+getCurrentDateTime()+".xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to create the download button
    function createDownloadButton(table, index) {
        const button = document.createElement('button');
        button.textContent = `[${index}]Download`;
        button.style.position = 'absolute';
        button.style.zIndex = 1000;
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px';

        button.addEventListener('click', () => downloadTableAsExcel(table,index));

        document.body.appendChild(button);

        // Position the button based on table width and viewport width
        const rect = table.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const buttonWidth = button.offsetWidth;

        let left, top;

        if (rect.width < viewportWidth) {
            // Table width is less than viewport width, position button above table in the center
            left = rect.left + (rect.width - buttonWidth) / 2 + window.scrollX;
            top = rect.top - button.offsetHeight - 5 + window.scrollY;
        } else {
            // Table width is greater than or equal to viewport width, position button in the center of the viewport
            left = (viewportWidth - buttonWidth) / 2 + window.scrollX;
            top = rect.top - button.offsetHeight - 5 + window.scrollY;
        }

        button.style.left = `${left}px`;
        button.style.top = `${top}px`;
    }

    // Function to detect tables and add the download button
    function detectTables() {
        const tables = document.querySelectorAll('table');
        console.log(`Found ${tables.length} tables`);
        tables.forEach((table, index) => {
            createDownloadButton(table, index + 1);
        });
    }

    // Use MutationObserver to detect when the DOM is fully loaded and rendered
    const observer = new MutationObserver((mutations, obs) => {
        detectTables();
        obs.disconnect(); // Stop observing after tables are found
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // Also run the detection function when the page is fully loaded
    window.addEventListener('load', detectTables);
})();