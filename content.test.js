const { countCoworkers } = require("./content");

describe("countCoworkers", () => {
  beforeEach(() => {
    document.body.innerHTML = ""; // Reset document before each test
  });

  it("should return zero when there is no content", () => {
    expect(countCoworkers()).toEqual({
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
    document.body.innerHTML = `
      <p>Publications</p>
      <ul>
        <li>Paper 1, joint with <a href="#">Alice</a> and <a href="#">Bob</a></li>
        <li>Paper 2, joint with <a href="#">Charlie</a></li>
      </ul>
    `;

    expect(countCoworkers()).toEqual({
      published: 3,
      working: 0,
      progress: 0,
      total: 3,
      publishedList: ["Alice", "Bob", "Charlie"],
      workingList: [],
      progressList: [],
      totalList: ["Alice", "Bob", "Charlie"],
    });
  });

  it("should count unique coauthors in the Working Papers section", () => {
    document.body.innerHTML = `
      <p>Publications</p>
      <ul>
        <li>Paper 1, joint with <a href="#">Alice</a> and <a href="#">Bob</a></li>
      </ul>
      <p>Working Papers:</p>
      <ul>
        <li>Paper 3, joint with <a href="#">David</a> and <a href="#">Eve</a></li>
      </ul>
    `;

    expect(countCoworkers()).toEqual({
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
    document.body.innerHTML = `
      <p>Publications</p>
      <ul>
        <li>Paper 1, joint with <a href="#">Alice</a></li>
      </ul>
      <p>Working Papers:</p>
      <ul>
        <li>Paper 2, joint with <a href="#">Bob</a></li>
      </ul>
      <p>Work in Progress</p>
      <ol>
        <li>Paper 3, joint with <a href="#">Charlie</a></li>
      </ol>
    `;

    expect(countCoworkers()).toEqual({
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
    document.body.innerHTML = `
      <p>Publications</p>
      <ul>
        <li>Paper 1, joint with <a href="#">Alice</a> and <a href="#">Bob</a></li>
      </ul>
      <p>Working Papers:</p>
      <ul>
        <li>Paper 2, joint with <a href="#">Bob</a> and <a href="#">Charlie</a></li>
      </ul>
      <p>Work in Progress</p>
      <ol>
        <li>Paper 3, joint with <a href="#">Charlie</a> and <a href="#">David</a></li>
      </ol>
    `;

    expect(countCoworkers()).toEqual({
      published: 2,
      working: 1, // Only Charlie is new
      progress: 1, // Only David is new
      total: 4,
      publishedList: ["Alice", "Bob"],
      workingList: ["Charlie"],
      progressList: ["David"],
      totalList: ["Alice", "Bob", "Charlie", "David"],
    });
  });
});
