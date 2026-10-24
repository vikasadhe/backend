const db = require('../config/db');
const mapNotice = (row) => ({...row, _id: row.id, isHot: !!row.is_hot});

exports.getNoticesByCategory = async (req,res) => {
    try {
        const [rows]=await db.execute('SELECT * FROM notices WHERE category=? ORDER BY date DESC',[req.params.category]);
        res.status(200).json({success:true,count:rows.length,data:rows.map(mapNotice)});
    } catch(error){res.status(500).json({success:false,message:error.message});}
};

exports.createNotice = async (req,res) => {
    try {
        const {title,category,isHot,link,date}=req.body;
        if(!title||!category)return res.status(400).json({success:false,message:'Title and category are required'});
        const hot=isHot==='true'||isHot===true?1:0;
        const [r]=await db.execute(
            'INSERT INTO notices (title, date, category, link, is_hot) VALUES (?,?,?,?,?)',
            [title,date||new Date(),category,link||null,hot]
        );
        const [rows]=await db.execute('SELECT * FROM notices WHERE id=?',[r.insertId]);
        res.status(201).json({success:true,data:mapNotice(rows[0])});
    } catch(error){res.status(500).json({success:false,message:error.message});}
};

exports.deleteNotice = async (req,res) => {
    try {
        const [result]=await db.execute('DELETE FROM notices WHERE id=?',[req.params.id]);
        if(!result.affectedRows)return res.status(404).json({success:false,message:'Notice not found'});
        res.status(200).json({success:true,message:'Notice removed successfully'});
    } catch(error){res.status(500).json({success:false,message:error.message});}
};
