import axios from 'axios';

export const UPLOAD_API_URL = `${import.meta.env.VITE_UPLOAD_API_URL}`;
export const MEDIA_PATH = `${import.meta.env.VITE_MEDIA_PATH}`;

const uploadFile = async (file) => {
    try {
        const res = await axios.post(UPLOAD_API_URL, file, { headers: {'Content-Type': 'multipart/form-data'}})
        return res
    } catch (error) {
        console.error(error)
        return null
    }
}

export default uploadFile