export default async function handler(req, res) {
    const API_URL = process.env.NEXT_PUBLIC_URL_API;
    switch (req.method) {
        case "GET":
            try {
                const response = await (await fetch(`${API_URL}/notes`)).json();
                res.status(200).json({...response, message: "Success fetching data" });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed fetching data" });
            }
            break;
        case "POST":
            try {
                const response = await fetch(`${API_URL}/notes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(req.body),
                });
                const data = await response.json();
                res.status(200).json({...data });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "error add data" });
            }
            break;
    }
}