import { getToken } from "apis/userAPI";
import React from "react";
import { useNavigate } from "react-router";

function Home() {
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!getToken()) navigate("/login");
    }, [navigate]);

    return <div>Home</div>;
}

export default Home;
