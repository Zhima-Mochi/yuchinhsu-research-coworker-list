/**
 * Counts the number of unique coauthors in different sections of a webpage.
 * @param {string} content - The content of the webpage.
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
function countCoworkersFromContent(content) {
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
    const bracketPattern = /\(([^)]+)\)/;
    const bracketMatch = text.match(bracketPattern);
    if (bracketMatch) {
      text = bracketMatch[1];
    }

    // If "joint with" or "with" appears, it indicates there are coauthors
    const jointPattern = /joint with|with/i;
    if (!jointPattern.test(text)) return new Set();

    // Split using "joint with", "with", "and", or "," as delimiters.
    const parts = text.split(/joint with|with|and|,/i);
    // The first part is usually the title, so start from the second part.
    const candidateNames = parts.slice(1);
    // Remove extra whitespace and bracketed text (e.g., [link] or [pdf]), 
    // and only keep names that consist of letters, spaces, and hyphens.
    const names = candidateNames
      .map(name => name.replace(/\[[^\]]*\]/g, '').trim())
      .filter(name => name && /^[a-zA-Z\s\.-]+$/.test(name));
    return new Set(names);
  }

  // Helper: Parse the text into sections based on double newlines and categorize the content.
  function parseSections(text) {
    const sections = {
      Publications: [],
      "Working Papers": [],
      "Work in Progress": []
    };
    // Split the text by blocks separated by one or more blank lines.
    const blocks = text.split(/\n\s*\n/);
    let currentSection = null;
    for (let block of blocks) {
      block = block.trim();
      if (block === "Publications" || block === "Working Papers" || block === "Work in Progress") {
        currentSection = block;
        continue;
      }
      if (currentSection) {
        sections[currentSection].push(block);
      }
    }
    return sections;
  }

  const sections = parseSections(content);

  // Create sets to store coauthors for each section.
  const publishedSet = new Set();
  const workingSet = new Set();
  const progressSet = new Set();

  // Process the Publications section.
  if (sections["Publications"]) {
    sections["Publications"].forEach(paper => {
      getCoauthorNamesSetInPaper(paper).forEach(name => publishedSet.add(name));
    });
  }

  // Process the Working Papers section.
  if (sections["Working Papers"]) {
    sections["Working Papers"].forEach(paper => {
      getCoauthorNamesSetInPaper(paper).forEach(name => workingSet.add(name));
    });
  }

  // Process the Work in Progress section.
  if (sections["Work in Progress"]) {
    sections["Work in Progress"].forEach(paper => {
      getCoauthorNamesSetInPaper(paper).forEach(name => progressSet.add(name));
    });
  }

  // Publications section result.
  counts.published = publishedSet.size;
  counts.publishedList = Array.from(publishedSet);

  // For Working Papers, only include names that are not in the Publications section.
  workingSet.forEach(name => {
    if (!publishedSet.has(name)) counts.workingList.push(name);
  });
  counts.working = counts.workingList.length;

  // For Work in Progress, only include names that are not in either Publications or Working Papers.
  progressSet.forEach(name => {
    if (!publishedSet.has(name)) counts.progressList.push(name);
  });
  counts.progress = counts.progressList.length;

  // Combine all sets to form the total union.
  const totalSet = new Set([...publishedSet, ...workingSet, ...progressSet]);
  counts.totalList = Array.from(totalSet);
  counts.total = counts.totalList.length;

  return counts;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { countCoworkersFromContent };
}
