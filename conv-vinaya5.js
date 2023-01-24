/* 取出 律藏會集 五種主題 的連結*/
import {fromObj,nodefs,writeChanged,fetchFile,toBase26,alphabetically, readTextContent } from 'ptk/nodebundle.cjs'; //ptk/pali
//律藏會集_5種主題.html rename to vinaya5.html
await nodefs; 

await fetchFile('https://github.com/adbdao/VinayaBooksAsJsHtml/raw/master/律藏會集_5種主題.html','vinaya5.html')

const bk_link={}, toc_link={}, headers=[];
const nottaishobooks={
    '南傳':true,
    '三千':true,
}
const out=[];
const tidy=content=>{
    //去除所有的頁碼
    //P14 破開 《鈔17,4》
    content=content.replace(/\n*<br>P\d+\n*/g,'')
    //修複被crlf 破開的 tag ，如
    //<b>《鈔25
    //,24a》</b>
    .replace(/<b>([^>]+[^>])\n/).replace("<b>$1")
    return content;
}
const lines=tidy(readTextContent('vinaya5.html')).split(/\r?\n/);
let doubtcount=0,totalcount=0;//無法識別
lines.forEach(line=>{
   
    const h=line.match(/<h([23456])>([^<]+)/);
    if (h){
        headers[parseInt(h[1])-2]=h[2];
    }
    line.replace(/<b>《([^<《]+)》<\/b>([^<]+)/g,(m,bkname,follow)=>{

        const mf=follow.match(/\(([上下\d][^\);<]+)\)?([^,<。\(\)，！.　]*)/);

        if (mf) { //帶文字的
            let link=mf[1], t=mf[2];
            if (!bk_link[bkname]) bk_link[bkname]=[];
            //bk_link[bkname].push(link.replace(/,/g,'.'));
            if ( !nottaishobooks[bkname]) {
                link=link.replace(/,/,'.').replace(/\d+冊\./,'')
                .replace(/^\d+\./,'')
                .replace(/上至?/g,'a').replace(/中至?/g,'b').replace(/下至?/g,'c')
            }
            // console.log(bkname,link)
            bk_link[bkname].push(link);
            out.push(headers.map(it=>it.slice(0,3)).join('/')+'||\t'+bkname+link+t)
            totalcount++;
        } else { //鈔
            if (bk_link[bkname]) { //已知的書，但格式不對
                // console.log(bkname,follow)
                doubtcount++;
            } else {
                // console.log(bkname,follow)
            }
        }


    });
    
})

const arr=fromObj(bk_link,true);
writeChanged('vinaya5.tsv',arr.map(it=>[it[0]+'\t'
+it[1].sort(alphabetically).join(',')]).join('\n'),true)

writeChanged('vinaya5.txt',out.join('\n'),true);
console.log('doubt count',doubtcount,'total count',totalcount)