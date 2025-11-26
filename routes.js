import express from 'express';
import sql from 'mssql';

const router = express.Router();

const dbConnectionString = process.env.DB_CONNECTION_STRING;

// -- ROUTES (Endpoints) --

// POST: /api/performances/purchase
// (Receives customer purchase)
// (http://localhost:3000/api/performances/purchase)

router.post('/purchase', async (req, res) => {
    const purchase = req.body;

    //
    // Validate required fields
    //
    if (!purchase.performanceId || !purchase.tickets || !purchase.customerName || !purchase.email || !purchase.cardNumber) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        await sql.connect(dbConnectionString);

        // Mask credit card - store only last 4
        const last4 = purchase.cardNumber.slice(-4);

        //
        // Insert into database
        //
        const result = await sql.query`
            INSERT INTO Purchases
            (PerformanceId, Tickets, CustomerName, Email, CardLast4, PurchaseDate)
            VALUES 
            (${purchase.performanceId}, ${purchase.tickets}, ${purchase.customerName}, ${purchase.email}, ${last4}, GETDATE())
        `;

        res.json({ message: "Purchase saved successfully." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// /api/performances
// (Collection of all upcoming events)
// (http://localhost:3000/api/performances)
router.get('/', async (req, res) => {
    try {
        await sql.connect(dbConnectionString);

        const result = await sql.query`
            SELECT PerformanceId, Name, PerformanceDate
            FROM Performance
            ORDER BY PerformanceDate ASC
        `;

        res.json(result.recordset);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// GET: /api/performances/id/:id
// (Return individual event by ID)
// (http://localhost:3000/api/performances/id/...)
router.get('/id/:id', async (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).send("Invalid performance ID.");
    }

    try {
        await sql.connect(dbConnectionString);

        const result = await sql.query`
            SELECT PerformanceId, Name, PerformanceDate
            FROM Performance
            WHERE PerformanceId = ${id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Performance not found." });
        }

        res.json(result.recordset[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
