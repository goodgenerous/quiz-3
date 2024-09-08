export default async function handler(req, res) {
    const { id } = req.query;
    const API_URL = process.env.NEXT_PUBLIC_URL_API;
    try {
        const response = await (await fetch(`${API_URL}/notes/${id}`)).json();
        res.status(200).json({...response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: null, message: "Failed fetching data" });
    }
}