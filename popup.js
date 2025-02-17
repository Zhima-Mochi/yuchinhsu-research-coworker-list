document.getElementById("countButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => document.body.innerText
    }, (results) => {
      if (results && results[0] && results[0].result) {
        const content = results[0].result;
        const counts = countCoworkersFromContent(content);
        document.getElementById('totalCount').textContent = counts.total;
        document.getElementById('publishedCount').textContent = counts.published;
        document.getElementById('workingCount').textContent = counts.working;
        document.getElementById('progressCount').textContent = counts.progress;
      }
    });
  });
});
