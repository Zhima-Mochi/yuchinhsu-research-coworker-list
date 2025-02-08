document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('countButton').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: countCoworkers
    }, (results) => {
      if (results && results[0]) {
        const counts = results[0].result;
        document.getElementById('totalCount').textContent = counts.total;
        document.getElementById('publishedCount').textContent = counts.published;
        document.getElementById('workingCount').textContent = counts.working;
        document.getElementById('progressCount').textContent = counts.progress;
      }
    });
  });
}); 