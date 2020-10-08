import React, { Component } from "react";
export default class AddPro extends Component {
  render() {
    const { state, handleDelete, AddProduct, changeTab, handleStockChange } = this.props;
    const { selected_data, tax_data } = state;
    return (
      <div className="reg_add_product">
        <div className="grn-box">
          {selected_data.map((data, index) => {
            return (
              <div className="grn-detail-box" key={index}>
                <div className="top-wrap">
                  <div className="form-group">
                    <label>TAX/GST</label>
                    <select
                      className="form-control"
                      value={data.tax_id}
                      onChange={e =>
                        handleStockChange(e, "tax_id", data.id)
                      }
                    >
                      {tax_data.map((option, key) => (
                        <option value={option.id} key={key}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>HSN CODE</label>
                    <div className="input-group">
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        placeholder="Enter HSN Code"
                        name={data.hsn}
                        value={data.hsn}
                        onChange={e =>
                          handleStockChange(e, "hsn", data.id)
                        }
                      />
                    </div>
                  </div>

                </div>
                {data.variant.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className='pro_delete_wrap'>
                      <span>{data.name + "," +
                        " " +
                        item.variant_id}</span>
                      <span>
                        <i
                          className="fa fa-trash"
                          aria-hidden="true"
                          onClick={e => handleDelete(e, data.id, item.variant_id)}
                        />
                      </span>
                      </div>
                      
                      <div className="row">
                        <div className="col-12">
                          <div className="table-responsive  mt-2">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Stock</th>
                                  <th>COST (Inc. GST)</th>
                                  <th>SELLING PRICE (Inc. GST)</th>
                                  <th>MRP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <input
                                      type="text"
                                      autoComplete="off"
                                      className="form-control"
                                      name={
                                        item.stock
                                      }
                                      value={
                                        item.stock
                                      }
                                      onChange={e =>
                                        handleStockChange(
                                          e,
                                          "stock",
                                          data.id, item.variant_id
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      autoComplete="off"
                                      className="form-control"
                                      name={
                                        item.cost_price
                                      }
                                      value={
                                        item.cost_price
                                      }
                                      onChange={e =>
                                        handleStockChange(
                                          e,
                                          "cost_price",
                                          data.id, item.variant_id
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      autoComplete="off"
                                      className="form-control"
                                      name={
                                        item.selling_price
                                      }
                                      value={
                                        item.selling_price
                                      }
                                      onChange={e =>
                                        handleStockChange(
                                          e,
                                          "selling_price",
                                          data.id, item.variant_id
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      autoComplete="off"
                                      className="form-control"
                                      name={
                                        item.mrp
                                      }
                                      value={
                                        item.mrp
                                      }
                                      onChange={e =>
                                        handleStockChange(e, "mrp", data.id, item.variant_id)
                                      }
                                    />
                                  </td>

                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        {selected_data !== "" && (
          <button
            type="button"
            className="btn login_btn "
            onClick={e => AddProduct(e)}
          >
            Next
          </button>
        )}
        <button
          type="button"
          className="btn login_btn "
          onClick={() => changeTab('back_pro')}
        >
          Back
          </button>
      </div>
    );
  }
}
