import {pinPos} from 'ptk/nodebundle.cjs'
export const pinTag_cbeta=(txt,tags,chunkid)=>{
    let vol='' , //冊號 ,帶 T
    ckoff=0,ckid='', //往前 看最近的 chunk 字元位址及id
    nextckoff=0;  //新的位置，避免負值
    const out=[];
    for (let i=0;i<tags.length;i++) {
        // 標記序號, 字元位址 , 名稱 , 屬性
        const [ntag, offset, name, _attrs]=tags[i];
        if (name==='pb') {
            const attrs=JSON.parse(_attrs);
            vol=attrs['xml:id'].slice(0,3);
        } else if (name==='p' && _attrs) {
            const attrs=JSON.parse(_attrs);
            const id=attrs['xml:id'];
            const _ckid=chunkid.p[id];
            if (_ckid) {
                ckid=_ckid;
                nextckoff=offset;
            }
        } else if (name==='lb') {
            const attrs=JSON.parse(_attrs);
            const id=attrs.n;
            let _ckid=chunkid.lb[vol+'p'+id];
            if (_ckid&&_ckid[0]!=='^') { //off 標記，不是 ck 
                if (_ckid && Array.isArray(_ckid)) { //帶釘文
                    const pintext=_ckid[1];
                    ckid=_ckid[0];
                    const at=txt.indexOf(pintext, offset);
                    if (~at) {
                        nextckoff=at;
                    } else {
                        console.error('查無此釘文',pintext);
                    }
                } else if (typeof _ckid=='string') { //文字型，在開頭
                    ckid=_ckid;
                    nextckoff=offset;
                }
            }
        }
        
        if (offset>nextckoff) ckoff=nextckoff; //為避免負值

        //重算 offset
        let pin=pinPos( txt.slice(ckoff) , offset-ckoff, {cjk:true});
        if (!pin && ntag>0) pinPos( txt.slice(ckoff) , offset-ckoff, {backward:true,cjk:true});


        out.push([ntag, ckid, pin, name, _attrs]);

    }
    return out;
}
export const createChunkId_cbeta=(arr)=>{
    const lb={}, p={};
    if (!Array.isArray(arr)) arr=[arr];
    for (let i=0;i<arr.length;i++) {
        const idarr=arr[i];
        for (let key in idarr) {
            if (key.startsWith('lb_')) {
                let id=idarr[key];
                const at=key.indexOf('_',3);
                if (~at) {
                    lb[key.slice(3,at)]=[id,key.slice(at+1)]
                } else {
                    lb[key.slice(3)]=id;
                }
            } else {
                p[key]=idarr[key];
            }
        }
    }
    return {lb,p};
}