const db = require('../config/db');

const mapHoliday = (row) => ({ ...row, _id: row.id });

exports.getAllHolidays = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM holidays ORDER BY created_at ASC');
        res.status(200).json({ success: true, count: rows.length, data: rows.map(mapHoliday) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createHoliday = async (req, res) => {
    try {
        const data = req.body;
        if (Array.isArray(data)) {
            if (!data.length) return res.status(400).json({ success:false, message:'No holiday data provided' });
            for (const item of data) {
                if (!item.name || !item.day || !item.date || !item.year)
                    return res.status(400).json({ success:false, message:'All fields are required for each holiday' });
            }
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();
                const created = [];
                for (const item of data) {
                    const [r] = await conn.execute(
                        'INSERT INTO holidays (name, day, date, year) VALUES (?, ?, ?, ?)',
                        [item.name, item.day, item.date, item.year]
                    );
                    const [rows] = await conn.execute('SELECT * FROM holidays WHERE id=?', [r.insertId]);
                    created.push(mapHoliday(rows[0]));
                }
                await conn.commit();
                return res.status(201).json({ success:true, data:created });
            } catch(e) { await conn.rollback(); throw e; } finally { conn.release(); }
        }
        const {name, day, date, year} = data;
        if (!name || !day || !date || !year)
            return res.status(400).json({success:false,message:'All fields are required'});
        const [r] = await db.execute(
            'INSERT INTO holidays (name, day, date, year) VALUES (?, ?, ?, ?)',
            [name, day, date, year]
        );
        const [rows] = await db.execute('SELECT * FROM holidays WHERE id=?',[r.insertId]);
        res.status(201).json({success:true,data:mapHoliday(rows[0])});
    } catch(error) { res.status(500).json({success:false,message:error.message}); }
};

exports.updateHoliday = async (req,res) => {
    try {
        const {name,day,date,year}=req.body;
        const [result]=await db.execute(
            'UPDATE holidays SET name=?, day=?, date=?, year=? WHERE id=?',
            [name,day,date,year,req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({success:false,message:'Holiday not found'});
        const [rows]=await db.execute('SELECT * FROM holidays WHERE id=?',[req.params.id]);
        res.status(200).json({success:true,data:mapHoliday(rows[0])});
    } catch(error){res.status(500).json({success:false,message:error.message});}
};

exports.deleteHoliday = async (req,res) => {
    try {
        const [result]=await db.execute('DELETE FROM holidays WHERE id=?',[req.params.id]);
        if (!result.affectedRows) return res.status(404).json({success:false,message:'Holiday not found'});
        res.status(200).json({success:true,message:'Holiday removed successfully'});
    } catch(error){res.status(500).json({success:false,message:error.message});}
};
