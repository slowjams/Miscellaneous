import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import { useSelector, useDispatch } from 'react-redux'


function App() {
  return (
    <div className="App">
      <CounterComponent/>
    </div>
  );
}

export default App;


export const CounterComponent = () => {
  const productlist = useSelector((state) => state.products);
  const temp = [...productlist];
  //const dispatch = useDispatch();

  console.log(productlist);
  return <div><h3>total {temp.length}</h3>
    <ProductTable products={temp} /></div>
}

//---------------------------------------------------------------------------
export const ProductTable = () => {
  
  const productlist = useSelector((state) => state.products)

  const dispatch = useDispatch();

  return <table className="table table-sm table-striped table-bordered">
     <thead>
      <tr>
        <th colSpan="5"
          className="bg-primary text-white text-center h4 p-2">
          Products
        </th>
      </tr>
      <tr>
        <th>ID</th><th>Name</th><th>Category</th>
        <th className="text-right">Price</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {
        productlist.map(p =>
          <ProductTableRow product={p}
            key={p.id}
            //editCallback={this.props.editCallback}
            //deleteCallback={this.props.deleteCallback} 
            />)
      }
    </tbody>
    <button className="btn btn-sm btn-danger m-1" onClick={() => dispatch({ type: "Add", dataType: "products", payload: { id: 4, name: "Bad", category: "CD", price: 990.05 } })}>
      Add
    </button>
  </table>
}


export class ProductTableRow extends Component {

  render() {
    let p = this.props.product;
    return <tr>
      <td>{p.id}</td>
      <td>{p.name}</td>
      <td>{p.category}</td>
      <td className="text-right">${Number(p.price).toFixed(2)}</td>
      <td>
        <button className="btn btn-sm btn-warning m-1"
          onClick={() => this.props.editCallback(p)}>
          Edit
        </button>
        <button className="btn btn-sm btn-danger m-1"
          onClick={() => this.props.deleteCallback(p)}>
          Delete
        </button>
      </td>
    </tr>
  }
}