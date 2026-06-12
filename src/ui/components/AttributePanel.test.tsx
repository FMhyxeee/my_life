import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultStats } from "../../test/factories";
import { AttributePanel } from "./AttributePanel";

describe("AttributePanel", () => {
  it("can hide exact numbers behind qualitative state labels during play", () => {
    render(
      <AttributePanel
        mode="qualitative"
        stats={{
          ...defaultStats,
          health: 72,
          wealth: 41,
          stress: 64,
        }}
      />,
    );

    expect(screen.getByText("健康")).toBeInTheDocument();
    expect(screen.getAllByText("尚可").length).toBeGreaterThan(0);
    expect(screen.getByText("拮据")).toBeInTheDocument();
    expect(screen.getByText("很重")).toBeInTheDocument();
    expect(screen.queryByText("72")).not.toBeInTheDocument();
    expect(screen.queryByText("41")).not.toBeInTheDocument();
    expect(screen.queryByText("64")).not.toBeInTheDocument();
  });
});
