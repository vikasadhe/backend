const db = require('../config/db');
const mapContact = (row) => ({...row, _id: row.id});

exports.getContacts = async (req,res) => {
    try {
        const [rows]=await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.status(200).json({success:true,count:rows.length,data:rows.map(mapContact)});
    } catch(error){res.status(500).json({success:false,message:error.message});}
};

exports.submitContact = async (req,res) => {
    try {
        const {name,contact,message}=req.body;
        if(!name||!contact||!message)return res.status(400).json({success:false,message:'All fields are required'});
        const [r]=await db.execute(
            'INSERT INTO contacts (name, contact, message) VALUES (?,?,?)',
            [name,contact,message]
        );
        const [rows]=await db.execute('SELECT * FROM contacts WHERE id=?',[r.insertId]);
        res.status(201).json({success:true,data:mapContact(rows[0])});
    } catch(error){res.status(500).json({success:false,message:error.message});}
};

exports.deleteContact = async (req,res) => {
    try {
        const [result]=await db.execute('DELETE FROM contacts WHERE id=?',[req.params.id]);
        if(!result.affectedRows)return res.status(404).json({success:false,message:'Contact not found'});
        res.status(200).json({success:true,message:'Contact message removed successfully'});
    } catch(error){res.status(500).json({success:false,message:error.message});}
};
