import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "./Checkbox";

test('loads and displays greeting', async () => {
    // ARRANGE
    render(<Checkbox left >test checkbox</Checkbox>)

    // ACT
    await userEvent.click(screen.getByText('test checkbox'))
    await screen.findByRole('heading')

    // ASSERT
    expect(screen.getByRole('heading')).toHaveTextContent('hello there')
    expect(screen.getByRole('button')).toBeDisabled()
})