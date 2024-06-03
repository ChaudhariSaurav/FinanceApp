// eslint-disable-next-line react/prop-types
function Layout({ children }) {
    return (
        <>
            <div>
                {/* <div className="sidebar"><Sidebar /></div> */}
                <div>{children}</div>
                {/* <footer>this is footer</footer> */}
            </div>
        </>
    );
}
export default Layout;
