import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import UserItem from "../user-item/UserItem";

function UserItems(props) {
  const [items, setItems] = useState(null);
  const error = useRef(null);
  useEffect(() => {
    async function getItems() {
      //getting the items according to the request from the database
      try {
        let res = await axios.get(
          process.env.REACT_APP_BASE_URL + "item/get_items",
          { params: props.requestQuery }
        );
        //grouping the found items by its name so if for example two items with the same name will be
        //added in one group
        let foundItems = {};
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].quantity === 0) continue;
          if (!foundItems[res.data[i].name]) {
            foundItems[res.data[i].name] = [];
          }
          foundItems[res.data[i].name].push(res.data[i]);
        }
        //converting the object with groups of items to an array
        let itemsArray = [];
        for (let key in foundItems) {
          if (Object.prototype.hasOwnProperty.call(foundItems, key))
            itemsArray.push(foundItems[key]);
        }
        //setting the found items to the useState variable
        setItems(itemsArray);
      } catch (err) {
        error.current.textContent = "Error: " + err.response.data;
        error.current.classList.remove("d-none");
      }
    }
    getItems();
  }, [props.requestQuery]);
  return (
    <div>
      <div>
        {items &&
          items.length > 0 &&
          items.map((group, index) => (
            <UserItem key={index} items={group} loggedIn={props.loggedIn} />
          ))}
      </div>
      <div className="text-center">
        {(!items || items.length === 0) && (
          <h2 className="mt-4">No items found</h2>
        )}
      </div>
    </div>
  );
}

export default UserItems;
