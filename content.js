/**
 * Counts the number of unique coauthors in different sections of a webpage.
 *
 * @returns {Object} An object containing the counts and lists of unique coauthors in the following sections:
 * - published: Number of unique coauthors in the "Publications" section.
 * - working: Number of unique coauthors in the "Working Papers" section.
 * - progress: Number of unique coauthors in the "Work in Progress" section.
 * - total: Total number of unique coauthors across all sections.
 * - publishedList: List of unique coauthors in the "Publications" section.
 * - workingList: List of unique coauthors in the "Working Papers" section.
 * - progressList: List of unique coauthors in the "Work in Progress" section.
 * - totalList: List of unique coauthors across all sections.
 */
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
    if (!jointPattern.test(text)) return new Set();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    const authors = [];
    const anchorElements = tempDiv.querySelectorAll('a');
    anchorElements.forEach(anchor => {
      const t = anchor.textContent.trim();
      if (t) authors.push(t);
    });

    const nonLinkedNames = text
      .split(/joint with|with|and|,/)
      .slice(1)
      .map(name => name.replace(/<[^>]+>/g, '').trim())
      .filter(name => name && !/[^a-zA-Z\s-]/.test(name)); // Ensure only valid names

    return new Set([...authors, ...nonLinkedNames]);
  }

  function extractSectionContent(pattern) {
    const match = document.body.innerHTML.match(pattern);
    return match && match[1] ? match[1] : "";
  }

  const publishedSet = new Set();
  const workingSet = new Set();
  const progressSet = new Set();

  const publishedContent = extractSectionContent(/<p[^>]*>.*?Publications.*?<\/p>\s*<ul>(.*?)<\/ul>/is);
  publishedContent.split(/<li>/).slice(1).forEach(paper => {
    getCoauthorNamesSetInPaper(paper).forEach(name => publishedSet.add(name));
  });

  const workingContent = extractSectionContent(/<p[^>]*>.*?Working Papers.*?<\/p>\s*<ul>(.*?)<\/ul>/is);
  workingContent.split(/<li>/).slice(1).forEach(paper => {
    getCoauthorNamesSetInPaper(paper).forEach(name => workingSet.add(name));
  });

  const progressContent = extractSectionContent(/<p[^>]*>.*?Work in Progress.*?<\/p>\s*<ol>(.*?)<\/ol>/is);
  progressContent.split(/<li>/).slice(1).forEach(paper => {
    getCoauthorNamesSetInPaper(paper).forEach(name => progressSet.add(name));
  });

  counts.published = publishedSet.size;
  counts.publishedList = Array.from(publishedSet);

  workingSet.forEach(name => {
    if (!publishedSet.has(name)) counts.workingList.push(name);
  });
  counts.working = counts.workingList.length;

  progressSet.forEach(name => {
    if (!publishedSet.has(name) && !workingSet.has(name)) counts.progressList.push(name);
  });
  counts.progress = counts.progressList.length;

  counts.totalList = Array.from(new Set([...publishedSet, ...workingSet, ...progressSet]));
  counts.total = counts.totalList.length;

  return counts;
}


// Export the function for testing
if (typeof window !== 'undefined') {
  window.countCoworkers = countCoworkers;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { countCoworkers };
}
