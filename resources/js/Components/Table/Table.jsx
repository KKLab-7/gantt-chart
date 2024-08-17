export default function Table({className, children, styles = ''}) {
    return(
        <div className="component-table-parent">
            <table className={'component-table ' + className} style={{styles}}>
                {children}
            </table>
        </div>
    )
}