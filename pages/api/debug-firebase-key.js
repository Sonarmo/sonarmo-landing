export default function handler(req, res) {
    try {
        const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!raw) throw new Error("Variable manquante");

        const parsed = JSON.parse(raw);
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");

        res.status(200).json({
            status: "✅ OK",
            project_id: parsed.project_id,
            private_key_start: parsed.private_key.substring(0, 30),
            private_key_end: parsed.private_key.slice(-30),
        });
    } catch (e) {
        res.status(500).json({ error: "❌ Parsing failed", message: e.message });
    }
}
