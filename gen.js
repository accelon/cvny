import {glob,meta_cbeta,nodefs,writeChanged,parseXMLAttribute,peelXML,readTextContent, readTextLines } from 'ptk/nodebundle.cjs'; //ptk/pali
import {  existsSync } from 'fs';
import Path from 'path'
await nodefs; //export fs to global
const files=readTextLines('t1428.lst').filter(it=>!!it); //1428四分律，輸入文件名
const rootdir='T/';
const ctx={ele:{},nested:[],fn:''}
import {t1428} from './chunkid-1428.js'
// import {insertTag_cbeta,offGen_cbeta,extractCharMapping_cbeta} from './pintag.js'

const conv=(fn)=>{
    ctx.fn=fn;
    process.stdout.write('\r'+fn+'   ');
    let content=readTextContent(fn)
        .replace(/\r?\n/g,''); //所有的行接起來，最後再分段
    content=meta_cbeta.nullify(content) //化空
    const [txt,tags,tree]=peelXML(content,ctx);//剝籤

    const charmaps=meta_cbeta.buildCharMap(tree);
   
    const newtags=meta_cbeta.insertTag(txt,tags,[t1428] , charmaps); 
    // 檢查產生的 tags
    // writeChanged(Path.basename(fn)+'.tsv',tags.map(it=>it.join('\t')).join('\n'),true)

    writeChanged(Path.basename(fn)+'1.tsv', newtags.map(it=>it.join('\t')).join('\n'),true)
    const newcontent = meta_cbeta.offGen(txt,newtags,charmaps);

    writeChanged(Path.basename(fn)+'.off',newcontent,true);
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