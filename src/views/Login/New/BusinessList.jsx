import React, { Component } from "react";
import { API_URL } from "../../../config";
export default class BusinessList extends Component {
  render() {
    const { state, handleChange, changeTab } = this.props;
    const { search_keyword, selected_business, search_business_list } = state;
    return (
      <div className="form_data">
        <input
          className="business_list_search_input"
          type="text"
          placeholder="Search..."
          name="search_keyword"
          value={search_keyword}
          onChange={e => handleChange(e, "search_keyword")}
        />
        <div className='business_list_wrap'>
          {search_business_list.map((data, index) => {
            return (
              <div className="custom-control custom-radio" key={data.id}>
                <input
                  type="radio"
                  className="custom-control-input"
                  value={data.id}
                  id={data.id}
                  checked={parseInt(selected_business) === data.id}
                  onChange={e => handleChange(e, "selected_business", data.name)}
                />

                <label className="custom-control-label" htmlFor={data.id}>
                  {data.image !== null ?
                    <img src={data.image} alt='' />
                    :
                    <img
                      src="images/product.svg"
                      alt="product"
                    />}
                  {data.name}
                </label>

              </div>
            );
          })}
        </div>
        {selected_business !== "" && (
          <button
            type="button"
            className="btn login_btn "
            onClick={() => changeTab('set_name')}
          >
            Next
          </button>
        )}
      </div>
    );
  }
}
