//importing modules
import { render, screen } from "@testing-library/react";
import UserItems from "./UserItems";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
//-------------------------------------------------------------------------------

//creating mock items
let items = [];
let images = [];
images[0] = "blablabla";
items[0] = {
  name: "item1",
  price: 200,
  images,
};
items[1] = {
  name: "item1",
  price: 230,
  images,
};
items[2] = {
  name: "item2",
  price: 230,
  images,
};
items[3] = {
  name: "item3",
  price: 230,
  images,
};
//-------------------------------------------------------------------

//setting up the mock server
const server = setupServer(
  rest.get("/item/get_items", (req, res, ctx) => {
    return res(ctx.json(items));
  })
);
//----------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//------------------------------------------------------------------

describe("Testing UserItems component", () => {
  test('it should render 3 UserItem component named as follows: "item1, item2, item3" ', () => {
    //rendering the component
    render(
      <BrowserRouter>
        <UserItems requestBody={{}} />
      </BrowserRouter>
    );
    //assertions
    expect(screen.getAllByText(/item/).length).toBe(3);
    expect(screen.getByText("item1")).toBeVisible();
    expect(screen.getByText("item2")).toBeVisible();
    expect(screen.getByText("item3")).toBeVisible();
  });
});
