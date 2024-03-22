export default function Table({className, children}) {
    return(
        <div className="component-table-parent">
            <table className={'component-table ' + className}>
                {children}
            </table>
        </div>
    )
}