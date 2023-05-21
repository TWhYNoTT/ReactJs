const URL = process.env.REACT_APP_API_URL;

const request = async (method, endpoint, data = null, token = null) => {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (token) {
        options.headers["x-auth-token"] = token;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${URL}/${endpoint}`, options);
        const responseData = await response.json();
        if (!response.ok) {
            return ({ isOK: false, responseData });
        }
        return ({ isOK: true, responseData });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default request;