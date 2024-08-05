// popup.js

document.getElementById('detectTables').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js', "libs/xlsx.full.min.js"]
        });
    });
});