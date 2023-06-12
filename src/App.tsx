import useRouteElements from './routes/useRouteElements';

function App() {
    const routeElements = useRouteElements();
    return (
        <div>
            {routeElements}
            {/* <ToastContainer /> */}
        </div>
    );
}

export default App;
