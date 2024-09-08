export default async function handler(req, res) {
    const { id } = req.query;
    const API_URL = process.env.NEXT_PUBLIC_URL_API;
    try {
        const response = await fetch(`${API_URL}/notes/delete/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        res.status(200).json({...data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed deleting data" });
    }
}