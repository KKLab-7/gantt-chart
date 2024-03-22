export default function Thead({ items }) {
    return (
        <thead className="component-thead">
            <tr>
                {items.map((item, index) => {
                    return (
                        <th deta-id={item} key={index} index={index} className="component-thead-th" scope="col">
                            {item}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}