import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createTestRunState } from "../../test/factories";
import { FatePanel } from "./FatePanel";

describe("FatePanel", () => {
  it("hides internal career track tags from the visible fate line", () => {
    const run = createTestRunState({
      tags: ["career_track_legal", "wealth_lawyer_path"],
    });

    render(<FatePanel run={run} />);

    expect(screen.getByText("法律职业")).toBeInTheDocument();
    expect(screen.queryByText("career track legal")).not.toBeInTheDocument();
  });
});
