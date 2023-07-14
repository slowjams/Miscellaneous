import { createStore, combineReducers } from "redux";

// export const initialData = {
//    [PRODUCTS]: [
//       { id: 1, name: "Trail Shoes", category: "Running", price: 100 },
//       { id: 2, name: "Thermal Hat", category: "Running", price: 12 },
//       { id: 3, name: "Heated Gloves", category: "Running", price: 82.50 }],
//    [SUPPLIERS]: [
//       { id: 1, name: "Zoom Shoes", city: "London", products: [1] },
//       { id: 2, name: "Cosy Gear", city: "New York", products: [2, 3] }],
// }

export const initialData = {
   products: [
      { id: 1, name: "Trail Shoes", category: "Running", price: 100 },
      { id: 2, name: "Thermal Hat", category: "Running", price: 12 },
      { id: 3, name: "Heated Gloves", category: "Running", price: 82.50 }],
   suppliers: [
      { id: 1, name: "Zoom Shoes", city: "London", products: [1] },
      { id: 2, name: "Cosy Gear", city: "New York", products: [2, 3] }]
}

let reducer = function (storeData, action) {
   switch (action.type) {
      case "Add":
         return {
            ...storeData,
            [action.dataType]: storeData[action.dataType].concat([action.payload])
         }

      default:
         return storeData || initialData;
   }
}

export default createStore(reducer);