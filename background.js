// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log('Table to Excel Downloader extension installed');
});


chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});