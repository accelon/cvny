//cbeta 更新時
//用 emeditor 抽出所有的  <p xml:id="(pT22[^"]+)" , 存成 pxmlid.txt
//結尾的-表示往上找最近的父節點
//
//"T22p0572a18#若":"pj1j【方便罪】",//?22p572a#18,//方便罪 婬戒 


import {nodefs,writeChanged,fetchFile,bsearch,toBase26,readTextContent } from 'ptk/nodebundle.cjs'; //ptk/pali
import {chunkprefix_1428} from './chunkprefix-1428.js'
import {chunkprefix_1425} from './chunkprefix-1425.js'
import {chunkprefix_1421} from './chunkprefix-1421.js'

const chunkprefix=Object.assign({},chunkprefix_1421,chunkprefix_1428,chunkprefix_1425);

await nodefs; 
await fetchFile('https://github.com/adbdao/vinaya4/raw/master/v4search.xml');

const content=readTextContent('v4search.xml')
const pxmlid=readTextContent('pxmlid.txt').trim().split(/\r?\n/);
let prevtaisho='',prevprefix='',prefixcount=0,
toctext='';//子標題
export const tocitems={
    ' 四分律':'',
    ' 五分律':'',
    ' 四波羅夷':'-',
    ' 三十捨墮法':'-',
    ' 十三僧伽婆尸沙':'-',
    ' 二十犍度':'-',
    ' 九十波逸提':'-',
    ' 四波羅提提舍尼法':'-',
    ' 百眾學法':'-',
    ' 三十尼薩耆波逸提':'-',
    ' 一百七十八單提法':'-',
}

const conv=()=>{
    let fulltaisho='';
    const out=[];
    const links=content.replace(/<聯 i="taisho\?([a-z\d#]+)"><有>([^>]+?)<\/有><\/聯>/g,(m,lnk,text)=>{
        if (!text)return;
        text=text.trim();

        //accelon2017 大正藏碼無前綴0
        const [m0,vol,pg,col,ln]=lnk.match(/(\d\d)p(\d+)([abc])#(\d+)/);

        let taisho='T'+vol.padStart(2,'0')+'p'+pg.padStart(4,'0')+col+ln.padStart(2,'0')
        const at=bsearch(pxmlid,taisho,true); 

        if (pxmlid[at].startsWith(taisho)) {
            fulltaisho=pxmlid[at];
        } else {
            fulltaisho=taisho;//無字元，只定位到lb 開頭，要補釘文
        }


        if (!~text.indexOf(' ') && !~text.indexOf('-')) {
            toctext=text; //標題
            if (text.endsWith('戒')||text.endsWith('犍度'))text+='-'; //有上層，但adbdao 沒寫

        } else { //小標題，上一層改為 - 表達
            for (let key in tocitems) {
                text=text.replace(key,tocitems[key]);
            }
            text=text.replace(' '+toctext,'-');   
        }

        if (prevtaisho==taisho) {
            text=text.replace(/\-+$/,'-');
            out[out.length-1][2]= text+out[out.length-1][2];
            return;
        }  

        // console.log(taisho,text)
        prevtaisho=taisho;
        const prefix=chunkprefix[taisho];
        if (prefix) {
            prevprefix=prefix;  
            prefixcount=0;        
        }

        const tag=prevprefix.match(/\d$/)?
        (prevprefix+(prefixcount?toBase26(prefixcount-1):''))
        :prevprefix+(prefixcount?prefixcount:'')
        
        if (taisho=='T22p0698a07') {
            console.log(at,fulltaisho,tag,text)
        }

        out.push([fulltaisho,tag,text])
        prefixcount++;
    })
    return out;
}

const out=conv();
writeChanged('v4search.tsv',out.map(it=>it.join('\t')).join('\n'),true)