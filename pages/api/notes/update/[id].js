export default async function handler(req, res) {
    const { id } = req.query;
    const API_URL = process.env.NEXT_PUBLIC_URL_API;
    try {
        const response = await fetch(`${API_URL}/notes/update/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(200).json({...data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed edit data" });
    }
}