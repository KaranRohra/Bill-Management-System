import React from "react";
import { useNavigate } from "react-router";
import { getToken } from "apis/userAPI";
import Header from 'components/Header';
import { ToastContainer } from "react-toastify";

function Home() {
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!getToken()) navigate("/login");
    }, [navigate]);

    return (
        <div>
            <ToastContainer />
            <Header />
        </div>
    );
}

export default Home;
