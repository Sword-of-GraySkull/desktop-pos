import React, { Component } from "react";
export default class ProductList extends Component {
  render() {
    const { state, handleChange, changeTab, changeVariant } = this.props;
    const { checked_data, product_type_data, product_data, varient_data, selected_data, selected_type } = state;
    return (
      <div className="reg_product_list">
        <div className='product_list_wrap'>
          <ul className='pro_type_tab'>
            <li onClick={e => handleChange(e, "selected_type_all")}>All</li>
            {product_type_data.map((data, index) => {
              return (
                <li key={data.id} onClick={e => handleChange(e, "selected_type", data)} className={selected_type === data.id ? 'activeType' : ''}>{data.name}</li>
              )
            })}
          </ul>
          <div className='pro_list_data_wrap'>
            {product_data.length === 0
              ?
              <h3 style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute'}}>No Product Found</h3>
              :
              product_data.map((data, index) => {
                return (
                  <label
                    className="grn-parts"
                    htmlFor={data.id}
                    key={data.id}
                  ><div className="product_img">
                      {data.image_url ? (
                        <img
                          src={data.image_url}
                          alt="product"
                        />
                      ) : (
                          <img
                            src="images/product.svg"
                            alt="product"
                          />
                        )}
                    </div>


                    <div className="grn-num">
                      <span>
                        {data.variant.map(
                          (variant_data, variant_key) => {
                            return (
                              varient_data[
                              data.id
                              ] === variant_data.variant_id &&
                              data.name +
                              "," +
                              " " +
                              variant_data.variant_id)
                          })}
                      </span>
                      <ul className="p_varients">
                        {data.variant.map(
                          (variant_data, variant_key) => {
                            return (
                              data.variant.length !== 1 && (
                                <li key={variant_key}>
                                  <label>
                                    <input
                                      type="radio"
                                      name="varient_data"
                                      value={
                                        varient_data[
                                        data.id
                                        ]
                                      }
                                      onChange={e =>
                                        changeVariant(
                                          e,
                                          data.id,
                                          variant_data
                                        )
                                      }
                                    />
                                    <span
                                      className={
                                        varient_data[
                                          data.id
                                        ] ===
                                          variant_data.variant_id
                                          ? "checked"
                                          : "********"
                                      }
                                    >
                                      {variant_data.variant_id}
                                    </span>
                                  </label>
                                </li>
                              ))
                          })}
                      </ul>
                      <div>
                        {data.variant.map(
                          (variant_data, variant_key) => {
                            return (
                              varient_data[
                              data.id
                              ] === variant_data.variant_id &&
                              <div key={variant_key}>
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={data.id}
                                    checked={checked_data[data.id][variant_data.variant_id]}
                                    value={checked_data[data.id][variant_data.variant_id]}
                                    onChange={e =>
                                      handleChange(
                                        e,
                                        'checked_product',
                                        data.id,
                                        variant_data.variant_id
                                      )
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={data.id}
                                  ></label>
                                </div>

                                {varient_data[
                                  data.id
                                ] === variant_data.variant_id &&
                                  <span>
                                    M.R.P:
                    {variant_data.mrp}
                                  </span>}
                              </div>
                            )
                          })}
                      </div>
                    </div>


                  </label>
                )
              })}
          </div>
          {selected_data.length === 0 ? (
            <button
              type="button"
              className="btn login_btn "
            >
              Add Selected
            </button>) :(
            <button
            type="button"
            className="btn login_btn "
            onClick={() => changeTab('open_product')}
          >
            Add Selected
          </button>
          )}
        </div>
      </div>
    );
  }
}
