import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts a new life and advances after a choice", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "人生模拟器" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /新的人生/ }));
    await user.clear(screen.getByLabelText("名字"));
    await user.type(screen.getByLabelText("名字"), "测试者");
    await user.clear(screen.getByLabelText("随机种子"));
    await user.type(screen.getByLabelText("随机种子"), "ui-seed");
    await user.click(screen.getByRole("button", { name: /开始/ }));

    expect(screen.getByText("命盘初定")).toBeInTheDocument();
    expect(screen.getByText(/0 岁/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /被许多双手稳稳接住/ }));

    expect(screen.getByText(/4 岁/)).toBeInTheDocument();
    expect(screen.getByText("命盘初定")).toBeInTheDocument();
    expect(screen.getByText("命运线")).toBeInTheDocument();
  });
});
