function countCoworkers() {
  const counts = {
    published: 0,
    working: 0,
    progress: 0,
    total: 0,
    publishedList: [],
    workingList: [],
    progressList: [],
    totalList: []
  };

  // Helper function to get unique coauthor names in a paper
  function getCoauthorNamesSetInPaper(text) {
    // If "joint with" or "with" appears, it indicates there are coauthors
    const jointPattern = /joint with|with/i;
    if (!jointPattern.test(text)) return new Set(); // Return an empty set

    // Use regex to get text within <a> tags (matches even if href is missing)
    const authors = [];
    const regex = /<a\b[^>]*>([^<]+)<\/a>/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
      authors.push(match[1].trim());
    }
    
    // Handle non-linked names (split by "joint with", "with", "and", ",")
    const nonLinkedNames = text
      .split(/joint with|with|and|,/)
      .slice(1) // Remove the part without names
      .map(name => name.trim())
      .filter(name => {
        if (!name) return false;
        const invalidChars = ['<', '>', '[', ']'];
        const invalidStarts = ['.', ')'];
        if (invalidStarts.includes(name[0])) return false;
        for (let char of invalidChars) {
          if (name.includes(char)) return false;
        }
        return true;
      });
    
    return new Set(authors.concat(nonLinkedNames));
  }

  // Find different sections in the HTML content
  const content = document.body.innerHTML;
  
  const publishedSet = new Set();
  const workingSet = new Set();
  const progressSet = new Set();
  
  // Publications section
  const publishedSection = content.match(/<p[^>]*>.*?Publications.*?<\/p>(.*?)(?=Work in Progress|$)/is);
  if (publishedSection && publishedSection[1]) {
    const papers = publishedSection[1].split(/<li>/).slice(1);
    papers.forEach(paper => {
      const namesSet = getCoauthorNamesSetInPaper(paper);
      namesSet.forEach(name => publishedSet.add(name));
    });
    counts.published = publishedSet.size;
    counts.publishedList = Array.from(publishedSet);
  }

  // Working Papers section
  const workingSection = content.match(/Working Papers[^:]*:(.*?)(?=Work in Progress|$)/is);
  if (workingSection && workingSection[1]) {
    const papers = workingSection[1].split(/<li>/).slice(1);
    papers.forEach(paper => {
      const namesSet = getCoauthorNamesSetInPaper(paper);
      namesSet.forEach(name => workingSet.add(name));
    });
    // Remove authors already in publishedSet from workingSet
    publishedSet.forEach(name => workingSet.delete(name));
    counts.working = workingSet.size;
    counts.workingList = Array.from(workingSet);
  }

  // Work in Progress section
  const progressSection = content.match(/Work in Progress.*?<ol>(.*?)<\/ol>/is);
  if (progressSection && progressSection[1]) {
    const papers = progressSection[1].split(/<li>/).slice(1);
    papers.forEach(paper => {
      const namesSet = getCoauthorNamesSetInPaper(paper);
      namesSet.forEach(name => progressSet.add(name));
    });
    // Remove authors already in publishedSet from progressSet
    publishedSet.forEach(name => progressSet.delete(name));
    counts.progress = progressSet.size;
    counts.progressList = Array.from(progressSet);
  }

  // Union of publishedSet, workingSet, progressSet to get all unique coauthors
  const totalSet = new Set([...publishedSet, ...workingSet, ...progressSet]);
  counts.total = totalSet.size;
  counts.totalList = Array.from(totalSet);
  
  return counts;
}

// Allow popup.js to call this function
window.countCoworkers = countCoworkers;
