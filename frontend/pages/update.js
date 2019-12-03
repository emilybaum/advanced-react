import UpdateItem from "../components/UpdateItem";

// destructuring props to be more accessiable (without 'props.') in the component as query
const Sell = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

export default Sell;
