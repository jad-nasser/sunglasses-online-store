//importing modules
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddItem from "./AddItem";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//creating a mock image file
let imageFile = new File(["blabla"], "blabla.jpg", { type: "image/jpg" });
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------

//mocking scrollIntoView()
window.HTMLElement.prototype.scrollIntoView = () => {};
//---------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------

//creating a mock server
const server = setupServer(
  rest.post(
    process.env.REACT_APP_BASE_URL + "item/create_item",
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  )
);
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

describe("Testing AddItem component", () => {
  test('Testing the component when clicking the "Add New Item" button and all the input fields are empty', () => {
    //rendering the component
    render(
      <BrowserRouter>
        <AddItem />
      </BrowserRouter>
    );
    //clicking the "Add New Item" button
    fireEvent.click(screen.getByRole("button", { name: "Add New Item" }));
    //assertions
    expect(screen.getByText("Enter item name")).toBeVisible();
    expect(screen.getByText("Enter item brand")).toBeVisible();
    expect(screen.getByText("Enter item color")).toBeVisible();
    expect(screen.getByText("Enter item size")).toBeVisible();
    expect(screen.getByText("Enter item price")).toBeVisible();
    expect(screen.getByText("Enter item quantity")).toBeVisible();
    expect(screen.getByText("Select item images")).toBeVisible();
  });
  //-----------------------------------------------------------------------

  test("Testing the component when the server sends an error", async () => {
    //make the mock server sending an error
    server.use(
      rest.post(
        process.env.REACT_APP_BASE_URL + "item/create_item",
        (req, res, ctx) => {
          return res(ctx.status(500), ctx.json("Server error"));
        }
      )
    );
    //rendering the component
    render(
      <BrowserRouter>
        <AddItem test={true} />
      </BrowserRouter>
    );
    //filling all the inputs with needed info
    fireEvent.change(screen.getByPlaceholderText("Brand"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Size"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Color"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "200" },
    });
    fireEvent.change(screen.getByPlaceholderText("Quantity"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByTestId("images-uploader"), {
      target: { files: [imageFile], required: false },
    });
    //clicking the "Add New Item" button
    fireEvent.click(screen.getByRole("button", { name: "Add New Item" }));
    //waiting for the error text
    await waitFor(() => screen.getByText("Error: Server error"));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //-----------------------------------------------------------------------

  test("Testing the component when everything are done correctly", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <AddItem test={true} />
      </BrowserRouter>
    );
    //filling all the inputs with needed info
    fireEvent.change(screen.getByPlaceholderText("Brand"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Size"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Color"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "200" },
    });
    fireEvent.change(screen.getByPlaceholderText("Quantity"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByTestId("images-uploader"), {
      target: { files: [imageFile], required: false },
    });
    //clicking the "Add New Item" button
    fireEvent.click(screen.getByRole("button", { name: "Add New Item" }));
    //waiting for the success text
    await waitFor(() => screen.getByText("Item successfully added"));
    //assertions
    expect(screen.getByText("Item successfully added")).toBeVisible();
  });
  //------------------------------------------------------------------------
});
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
