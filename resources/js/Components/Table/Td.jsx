export default function Td({ children, className = '', dataId = '', colSpan = '' }) {
    return (
        <td className={"component-td" + className} data-id={dataId} colSpan={colSpan}>
            {children}
        </td>
    )
}