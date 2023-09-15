import {render} from "@testing-library/react";
import Checkbox from "./Checkbox";

test('Checked Checkbox should display img with mark class', async () => {
    const {container}  = render(<Checkbox left checked>test checkbox</Checkbox>)

    // ASSERT
    expect(container.getElementsByClassName('checkbox-dot').length).toBe(1)
    // expect(container.getElementsByTagName('img').length).toBe(1)
    expect(container.querySelectorAll('.left').length).toBe(1)
    expect(container.querySelectorAll('.mark').length).toBe(1)

})