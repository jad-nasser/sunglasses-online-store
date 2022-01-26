//importing modules
import { render, screen, fireEvent } from "@testing-library/react";
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

//creating a mock server
const server = setupServer(
  rest.patch("/item/create_item", (req, res, ctx) => {
    return res(ctx.status(200));
  })
);
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
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
    expect(screen.getByText("Enter Item Name")).toBeVisible();
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
      rest.patch("/item/create_item", (req, res, ctx) => {
        return res(ctx.status(500, "Server error"));
      })
    );
    //rendering the component
    render(
      <BrowserRouter>
        <AddItem />
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
    await fireEvent.change(screen.getByTestId("images-uploader"), {
      target: { files: [imageFile] },
    });
    //clicking the "Add New Item" button
    fireEvent.click(screen.getByRole("button", { name: "Add New Item" }));
    //assertions
    expect(screen.getByText("Error: Server error")).toBeVisible();
  });
  //-----------------------------------------------------------------------

  test("Testing the component when everything are done correctly", async () => {
    //rendering the component
    render(
      <BrowserRouter>
        <AddItem />
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
    await fireEvent.change(screen.getByTestId("images-uploader"), {
      target: { files: [imageFile] },
    });
    //clicking the "Add New Item" button
    fireEvent.click(screen.getByRole("button", { name: "Add New Item" }));
    //assertions
    expect(screen.getByText("Item successfully added")).toBeVisible();
  });
  //------------------------------------------------------------------------
});
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
