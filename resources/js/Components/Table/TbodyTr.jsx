export default function TbodyTr({ children, onClick }) {
    return (
        <tr className="component-tbody-tr" key={children.id} onClick={onClick}>
            {children}
        </tr>
    )
}