import { render, screen } from "@testing-library/react";

import Duration from "./Duration";
//arrange
//act
//assert
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
describe("Duration Component rendered", () => {
  test("Seconds < 60  renders 0:ss to screen", () => {
    //arrange
    const seconds = 59;
    //act
    render(<Duration seconds={seconds} className={null} />);
    //assert
    const timeElement = screen.getByText(/0:59/);
    expect(timeElement).toBeInTheDocument();
  });
  test("Seconds == 60  renders m:00 to screen", () => {
    //arrange
    const seconds = 60;
    //act
    render(<Duration seconds={seconds} className={null} />);
    //assert
    const timeElement = screen.getByText(/1:00/);
    expect(timeElement).toBeInTheDocument();
  });

  test("Seconds > 59 && Seconds < 3600 renders mm:ss to screen", () => {
    //arrange
    const seconds = 160;
    //act
    render(<Duration seconds={seconds} className={null} />);
    //assert
    const timeElement = screen.getByText(/2:40/);
    expect(timeElement).toBeInTheDocument();
  });

  test("Seconds > 3600 renders hh:0m:ss to screen", () => {
    //arrange
    const seconds = 3700;
    //act
    render(<Duration seconds={seconds} className={null} />);
    //assert
    const timeElement = screen.getByText(/1:01:40/);
    expect(timeElement).toBeInTheDocument();
  });
});
