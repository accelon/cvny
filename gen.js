import {glob,meta_cbeta,nodefs,writeChanged,parseXMLAttribute,peelXML,readTextContent, readTextLines } from 'ptk/nodebundle.cjs'; //ptk/pali
import {  existsSync } from 'fs';
import Path from 'path'
await nodefs; //export fs to global
const files=readTextLines('t1428.lst').filter(it=>!!it); //1428四分律，輸入文件名
const rootdir='T/';
const ctx={ele:{},nested:[],fn:''}
import {t1428} from './chunkid-1428.js'
import {createChunkId_cbeta, pinTag_cbeta} from './pintag.js'

const conv=(fn)=>{
    ctx.fn=fn;
    process.stdout.write('\r'+fn+'   ');
    let content=readTextContent(fn)
        .replace(/\r?\n/g,''); //所有的行接起來，最後再分段
    content=meta_cbeta.nullify(content) //化空
    const [txt,tags]=peelXML(content,ctx);//剝籤
    const chunkid=createChunkId_cbeta([t1428]); // 之後的經只要加入陣列元素
    
    const newtags=pinTag_cbeta(txt,tags,chunkid ); 
    // 檢查產生的 tags
    writeChanged(Path.basename(fn)+'.tsv',tags.map(it=>it.join('\t')).join('\n'),true)
    writeChanged(Path.basename(fn)+'1.tsv', newtags.map(it=>it.join('\t')).join('\n'),true)

    return content;
}
const convAll=()=>{
    files.forEach( (fn,idx)=>{
        if (!fn || !existsSync(rootdir+fn)) return;
        const content=conv(rootdir+fn);
        if (idx==0) writeChanged(Path.basename(fn),content,'true')
    })
}
convAll();