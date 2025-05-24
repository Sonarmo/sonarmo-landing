export default function handler(req, res) {
    try {
        const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        const parsed = JSON.parse(key);
        res.status(200).json({ status: "✅ OK", project_id: parsed.project_id });
    } catch (e) {
        res.status(500).json({ error: "❌ Parsing failed", message: e.message });
    }
}
