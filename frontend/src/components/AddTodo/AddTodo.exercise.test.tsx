import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodo from "./AddTodo.functional";

// EXERCISE: Fill in each test body using render, screen, and userEvent
// Docs: https://testing-library.com/docs/react-testing-library/api
// userEvent: https://testing-library.com/docs/user-event/intro

describe("AddTodo", () => {
  it("renders input and button", () => {
    // TODO: render <AddTodo onAdd={vi.fn()} />
    // TODO: assert the textbox placeholder "What needs to be done?" is in the document
    // TODO: assert the "Add" button is in the document
  });

  it("calls onAdd with trimmed text on submit", async () => {
    const user = userEvent.setup();
    // TODO: render AddTodo with a mock onAdd
    // TODO: type '  Buy milk  ' into the textbox
    // TODO: click the "Add" button
    // TODO: assert onAdd was called with 'Buy milk'
  });

  it("clears input after successful submit", async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={vi.fn()} />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    await user.type(input, "Task1");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(input).toBeInTheDocument();
    // TODO: render AddTodo
    // TODO: type something into the input, then submit
    // TODO: assert the input value is ''
  });

  it("shows error and does not call onAdd when input is empty", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(onAdd).not.toHaveBeenCalledOnce();
    expect(screen.getByText("Task cannot be empty.")).toBeInTheDocument();

    // TODO: render AddTodo with a mock onAdd
    // TODO: click "Add" without typing anything
    // TODO: assert onAdd was NOT called
    // TODO: assert the error message 'Task cannot be empty.' is visible
  });

  it("shows error when text exceeds 100 characters", async () => {
    const user = userEvent.setup();
    // TODO: render AddTodo with a mock onAdd
    // TODO: type 101 characters into the input
    // TODO: click "Add"
    // TODO: assert onAdd was NOT called
    // TODO: assert the error message 'Max 100 characters.' is visible
  });

  it("clears error when user starts typing", async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByText("Task cannot be empty.")).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText("What needs to be done?"), "a");
    expect(screen.queryByText("Task cannot be empty.")).not.toBeInTheDocument();
  });

  it("shows remaining character count", () => {
    // TODO: render AddTodo
    // TODO: assert '100 chars left' is visible
  });

  it("updates character count as user types", async () => {
    const user = userEvent.setup();
    // TODO: render AddTodo
    // TODO: type 'abc'
    // TODO: assert '97 chars left' is visible
  });
});
