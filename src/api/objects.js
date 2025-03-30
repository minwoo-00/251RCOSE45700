import axios from "axios";

const API_URL = "https://localhost:8080/objects";
    
export const getObject = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createObject = async (object) => {
    const response = await axios.post(API_URL, object);
    return response.data;
};