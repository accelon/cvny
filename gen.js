import {ptk_version,glob,meta_cbeta,nodefs,writeChanged,parseXMLAttribute,peelXML,readTextContent, readTextLines } from 'ptk/nodebundle.cjs'; //ptk/pali
import {  existsSync } from 'fs';

if (!ptk_version || ptk_version<20230202) {
    throw "need ptk_version > 20230202"
}
await nodefs; //export fs to global
//t1428 四分
//t1421 五分
//t1425 摩訶僧祇律
const lst=process.argv[2]||'t1425.lst';
const files=readTextLines(lst).filter(it=>!!it); //1428四分律，輸入文件名
if (!files.length) {
	console.log("empty files, need CBETA T folder");
}
const rootdir='T/';
const ctx={ele:{},nested:[],fn:''}
// import {t1428} from './chunkid-1428.js'

//四分律及五分律 應手工校正，並更名為 chunk1421.tsv , chunk1428.tsv

//摩訶僧祇律, 手工編輯，結構同 v4search , 
//[ cb_lb , chunk_id , capton]v4search.concat(
const chunktsv=readTextLines(['./v4search.tsv','./chunk1425.tsv'],'tsv');
//一次過讀入多個tsv, 並合併成一個陣列

export const offheader={ 
    T22p0001a01:"^ak#msk【五分】^bk#msk【五分律】 " , //Mahiśāsaka
    T22p0227a01:"^ak#msg【僧祇】^bk#msg【摩訶僧祇律】",  //Mahāsaṁghika 
    T22p0567a01:"^ak#dg【四分經分別】^bk#dg【四分律】",  //dharmagupta
    T22p0779a01:"\n^ak#dgkd【四分犍度】",  //dharmagupta
    T23p0001a01:"^ak#db【十誦】^bk#db【十誦律】",  //sarvāstivāda 
    T23p0627a01:"^ak#msv【根有】^bk#msv【根本有部】",//Mūlasarvāstivāda 
}
for (let key in offheader) {
    chunktsv.push([key,offheader[key]]);
}
const conv=(fn)=>{
    ctx.fn=fn;
    process.stdout.write('\r'+fn+'   ');
    let content=readTextContent(fn)
        .replace(/\r?\n/g,''); //所有的行接起來，最後再分段
    content=meta_cbeta.nullify(content) //化空
    const [txt,tags,tree]=peelXML(content,ctx);//剝籤

    const charmaps=meta_cbeta.buildCharMap(tree); //CB缺字對照表
    const newtags=meta_cbeta.insertTag(txt,tags,chunktsv); 
    // 檢查產生的 tags
    // writeChanged(Path.basename(fn)+'.tsv',tags.map(it=>it.join('\t')).join('\n'),true)

    // writeChanged(Path.basename(fn)+'1.tsv', newtags.map(it=>it.join('\t')).join('\n'),true)
    const newcontent = meta_cbeta.offGen(txt,newtags,charmaps);

    // writeChanged(Path.basename(fn)+'.off',newcontent,true);
    return newcontent;
}
const convAll=()=>{
    let out=[], outfn='';
    files.forEach( (fn,idx)=>{
        if (fn.startsWith('#')) {
            if (outfn) writeChanged(outfn,out.join('\n'),true);
            out=[];
            outfn=fn.slice(1);
            return;
        }
        if (!fn || !existsSync(rootdir+fn)) return;
        const content=conv(rootdir+fn);
        out.push(content);
        // if (idx==0) writeChanged(Path.basename(fn),content,'true')
    })
    if (outfn) writeChanged('off/'+outfn,out.join('\n'),true);
}
convAll();