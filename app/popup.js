chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (!currentTab || !currentTab.url.includes("https://yuchinhsu.yolasite.com/")) {
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
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

