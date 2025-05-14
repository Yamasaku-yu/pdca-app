import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  setCategory,
  setPeriod,
  setKeyword,
  resetFilter,
} from "../../redux/filterSlice";

const FilterForm = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.filter);

  return (
    <div className="row">
      <div className="col-auto"><select
        className="form-select"
        value={filter.category}
        onChange={(e) => dispatch(setCategory(e.target.value))}
      >
        <option value="すべて">すべて</option>
        <option value="white">white</option>
        <option value="red">red</option>
        <option value="yellow">yellow</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
      </select></div>
      <div className="col-auto">
        <select className="form-select" value={filter.period} onChange={(e) => dispatch(setPeriod(e.target.value))}>
          <option value="すべて">すべて</option>
          <option value="今日">今日</option>
          <option value="今週">今週</option>
          <option value="今月">今月</option>
        </select></div>
      <div className="col-auto">
        <input className="form-control" type="text" value={filter.keyword} onChange={e => dispatch(setKeyword(e.target.value))} placeholder="キーワード検索" />
      </div>
      <div className="col-auto">
        <button className="btn btn-dark" onClick={() => dispatch(resetFilter())}>リセット</button>
      </div>
    </div>
  );
};

export default FilterForm;