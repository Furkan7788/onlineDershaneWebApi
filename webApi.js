const { Client }  = require('pg');
const express = require('express');
const app = express();
app.use(express.json());

const client = new Client({
    user: 'postgres',
    host: '35.204.222.86',
    database: 'postgres',
    password: '1903',
    port: 5432,
  });
  //REST API------------------------------------------------------
  app.get("/dokuman/getAllDocuments", async  (req, res) => {
    let result = {}
    try{
    const vale = await readAllDocuments();
    res.send(vale);//stringe donusturuldu angular da direkt json olarak alabilirsin. 
    result.success = true;
    }    
    catch(e){
        result.success = false;
        res.header("content-type", "application/json")
        res.send(JSON.stringify(result))//stringe donusturuldu angular da direkt json olarak alabilirsin. 
    }
   
})

app.get("/dokuman/getDokumanById",async (req,res) => {
    let result = {}
    try{
    const reqJson = req.body;    
    const vale = await readDocumentsById(reqJson.id);
    res.send(vale);
    result.success = true;
    }    
    catch(e){
        result.success = false;
        res.header("content-type", "application/json")
        res.send(JSON.stringify(result))//stringe donusturuldu angular da direkt json olarak alabilirsin. 
    }
   
})

app.post("/dokuman/addDokuman", async (req,res) => {
    let result = {}
    const reqJson = req.body;
    try {
    await createDocument(reqJson.dokuman_tipi,reqJson.dokuman_url,reqJson.yukleyen_id,reqJson.ders_adi,reqJson.sinav_adi,reqJson.icerik_tipi,reqJson.puan);
    result.success = true;
    }
    catch(e){
        result.success =false;
        
    }
    finally{
        res.header("content-type", "application/json")
        res.send(JSON.stringify(result))//stringe donusturuldu angular da direkt json olarak alabilirsin. 

    }
    
})

app.post("/dokuman/updateDokuman",  async (req,res) => {
    let result = {}
    const reqJson = req.body;
    try {
    await updateDocumentById(reqJson.dokuman_tipi ,reqJson.dokuman_url ,reqJson.yukleyen_id ,reqJson.ders_adi ,reqJson.sinav_adi ,reqJson.icerik_tipi ,reqJson.puan ,reqJson.id);
    
    result.success = true;
    }
    catch(e){
        result.success =false;
        
    }
    finally{
    res.header("content-type", "application/json")
    res.send(JSON.stringify(result))//stringe donusturuldu angular da direkt json olarak alabilirsin. 
    }
})

app.post("/dokuman/dokumanFiltreleme",  async (req,res) => {
    let result = {}
    const reqJson = req.body;
    try {
    const vale = await dokumanFiltreleme(reqJson.sql);
    res.send(vale);
    result.success = true;
    }
    catch(e){
        result.success =false;
        
    }
    finally{
    res.header("content-type", "application/json")
    res.send(JSON.stringify(result))//stringe donusturuldu angular da direkt json olarak alabilirsin. 
    }
})


app.delete("/dokuman/deleteDokuman", async (req,res) => {

    let result = {}
    const reqJson = req.body;
    try {
    
    await deleteDocument(reqJson.id);
    result.success = true;
    }
    catch(e){
        result.success =false;
       
    }
    finally{
        res.header("content-type", "application/json")
        res.send(JSON.stringify(result))//stringe donusturuldu angular da direkt json olarak alabilirsin. 
        }
   

})



  //Connection-----------------------------
  app.listen(8080, () => console.log("server is running"));
  start();
  async function start(){
      await connect();
  }

  async function connect(){
      try{
          await client.connect();
      }
      catch(e){
          console.error(`faild to connected ${e}`);
      }
  }
  //Controller.js------------------------------
  async function dokumanFiltreleme(sql){

    try{
        const result = await client.query(sql);
        return result.rows;

    }
    catch(e){
        return [];
    }


  }

  async function readAllDocuments(){
    try{
        const result = await client.query("select * from dokumanlar");
        return result.rows;

    }
    catch(e){
        return [];
    }
}
async function readDocumentsById(dokumanId){
    try{
        const result = await client.query("select * from dokumanlar where id = ($1)",[dokumanId]);
        return result.rows;
    }
    catch(e){
        return [];
    }
}
async function createDocument(dokuman_tipi , dokuman_url,yukleyen_id,ders_adi,sinav_adi,icerik_tipi,puan){
    try{
        await client.query("insert into dokumanlar values ($1,$2,$3,$4,$5,$6,$7)",[dokuman_tipi,dokuman_url,yukleyen_id,ders_adi,sinav_adi,icerik_tipi,puan]); 
        return true;
    }
    catch(e){
        return false;
    }
}
async function updateDocumentById(dokuman_tipi , dokuman_url ,yukleyen_id ,ders_adi ,sinav_adi ,icerik_tipi ,puan ,id){
    try{
        await client.query("UPDATE dokumanlar SET dokuman_tipi=$1,dokuman_url=$2, yukleyen_id=$3,ders_adi =$4,sinav_adi=$5,icerik_tipi=$6,puan =$7 where id=$8",[dokuman_tipi,dokuman_url,yukleyen_id,ders_adi,sinav_adi,icerik_tipi,puan,id]); 
        return true;
    }
    catch(e){
        return false;
    }

}    
async function deleteDocument(id){
        try{
            await client.query("delete from dokumanlar where id = $1",[id]);
            return true;
        }
        catch(e){
            return false;
        }
    }
