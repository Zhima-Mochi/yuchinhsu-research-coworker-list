const { countCoworkersFromContent } = require("./content");

describe("countCoworkersFromContent", () => {
  it("should return zero when there is no content", () => {
    expect(countCoworkersFromContent("")).toEqual({
      published: 0,
      working: 0,
      progress: 0,
      total: 0,
      publishedList: [],
      workingList: [],
      progressList: [],
      totalList: [],
    });
  });

  it("should count unique coauthors in the Publications section", () => {
    const content = `Publications

Paper 1 (high), (joint with Alice G. Lucky and Bob Shark)

Paper 2, (joint with Charlie)`;
    
    expect(countCoworkersFromContent(content)).toEqual({
      published: 3,
      working: 0,
      progress: 0,
      total: 3,
      publishedList: ["Alice G. Lucky", "Bob Shark", "Charlie"],
      workingList: [],
      progressList: [],
      totalList: ["Alice G. Lucky", "Bob Shark", "Charlie"],
    });
  });

  it("should count unique coauthors in the Working Papers section", () => {
    const content = `Publications

Paper 1, (joint with Alice and Bob)

Working Papers

Paper 3, (joint with David and Eve)`;
    
    expect(countCoworkersFromContent(content)).toEqual({
      published: 2,
      working: 2,
      progress: 0,
      total: 4,
      publishedList: ["Alice", "Bob"],
      workingList: ["David", "Eve"],
      progressList: [],
      totalList: ["Alice", "Bob", "David", "Eve"],
    });
  });

  it("should count unique coauthors in the Work in Progress section", () => {
    const content = `Publications

Paper 1, (joint with Alice)

Working Papers

Paper 2, (joint with Bob)

Work in Progress

Paper 3, (joint with Charlie)`;
    
    expect(countCoworkersFromContent(content)).toEqual({
      published: 1,
      working: 1,
      progress: 1,
      total: 3,
      publishedList: ["Alice"],
      workingList: ["Bob"],
      progressList: ["Charlie"],
      totalList: ["Alice", "Bob", "Charlie"],
    });
  });

  it("should not count duplicate coauthors across sections", () => {
    const content = `Publications

Paper 1, (joint with Alice and Bob)

Working Papers

Paper 2, (joint with Bob and Charlie)

Work in Progress

Paper 3, (joint with Charlie and David)`;
    
    expect(countCoworkersFromContent(content)).toEqual({
      published: 2,
      working: 1,
      progress: 2, 
      total: 4,
      publishedList: ["Alice", "Bob"],
      workingList: ["Charlie"],
      progressList: ["Charlie", "David"],
      totalList: ["Alice", "Bob", "Charlie", "David"],
    });
  });
});
