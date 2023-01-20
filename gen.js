import {glob,meta_cbeta,nodefs,writeChanged,parseXMLAttribute,peelXML,readTextContent, readTextLines } from 'ptk/nodebundle.cjs'; //ptk/pali
import {  existsSync } from 'fs';
import Path from 'path'
await nodefs; //export fs to global
const files=readTextLines('t1428.lst').filter(it=>!!it); //1428四分律，輸入文件名
const rootdir='T/';
const ctx={ele:{},nested:[],fn:''}
// import {t1428} from './chunkid-1428.js'

const chunktsv=readTextLines('./v4search.tsv').map(it=>it.split('\t'));

export const offheader={ 
    T22p0001a01:"^ak#msk【五分律】^bk#msk【五分律】 " , //Mahiśāsaka
    T22p0227a01:"^ak#msg【摩訶僧祇律】^bk#msg【摩訶僧祇律】",  //Mahāsaṁghika 
    T22p0567a01:"^ak#dg【四分律】^bk#dg【四分律】",  //dharmagupta
    T23p0001a01:"^ak#db【十誦律】^bk#db【十誦律】",  //sarvāstivāda 
    T23p0627a01:"^ak#msv【根本有部】^bk#msv【根本有部】",//Mūlasarvāstivāda 
}
for (let key in offheader) {
    chunktsv.push([key,offheader[key]])
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