import { describe, it, expect } from "vitest";
import { isOverdue } from "../components/Ticket";

const DAY = 24 * 60 * 60 * 1000;

describe("isOverdue", () => {
  it("is false when there is no due date", () => {
    expect(isOverdue({ dueDate: null }, { name: "To Do" })).toBe(false);
  });

  it("is true when the due date is in the past and the list isn't Done", () => {
    const card = { dueDate: Date.now() - DAY };
    expect(isOverdue(card, { name: "Doing" })).toBe(true);
  });

  it("is false when the due date is in the past but the list is Done", () => {
    const card = { dueDate: Date.now() - DAY };
    expect(isOverdue(card, { name: "Done" })).toBe(false);
  });

  it("is false when the due date is in the future", () => {
    const card = { dueDate: Date.now() + DAY };
    expect(isOverdue(card, { name: "To Do" })).toBe(false);
  });
});
