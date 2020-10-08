import React, { Component } from "react";
import { API_URL } from "../../config";
export default class ThirdRegister extends Component {
  render() {
    const { state, handleChange, setName } = this.props;
    const { search_keyword, selected_business, search_business_list } = state;
    return (
      <div className="form_data">
        <input
          className="search_input"
          type="text"
          placeholder="Search..."
          name="search_keyword"
          value={search_keyword}
          onChange={e => handleChange(e, "search_keyword")}
        />
        {search_business_list.map((data, index) => {
          return (
            <div className="radio">
              <input
                type="radio"
                value={data.id}
                checked={parseInt(selected_business) === data.id}
                onClick={e => handleChange(e, "selected_business")}
              />
              <label className="custom-control-label" htmlFor="business">
                <img src={data.image} />
                {data.name}
              </label>
            </div>
          );
        })}
        {selected_business !== "" && (
          <button
            type="button"
            className="btn login_btn "
            onClick={e => setName(e)}
          >
            Next
          </button>
        )}
      </div>
    );
  }
}
