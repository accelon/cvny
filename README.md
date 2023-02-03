# cvny
將大正藏律部轉為 accelon22 格式

## 步驟 
除了第一步之外，其餘皆在目前工作目錄，即cvny下執行。
1) 安裝 [Accelon22](https://github.com/accelon/accelon22)。
    clone 之後執行 install-dev 安裝開發環境，如果要修改介面，執行 node dev ，
    會開一個背景服務器偵測 svelte 檔案的改動。
    在任意目錄，確保執行 ptk 成果。
2) 下載最新的 bookcase ，解開 T 和 X 。(大正藏、卍續藏。)
    如果有安裝 CBReader ，建議連結方式：
    mklink/j T \CBReader\Bookcase\CBETA\XML\T

3) 執行 node conv-adbdao-v4search ，得到 v4search.tsv (會自動下載 v4search.xml )
4) 產生 off/*.off

    node gen t1421.lst 
    node gen t1428.lst 
    node gen t1425.lst 

5) 執行 ptk js 得到 cvny/*.js，資料改動必須重新執行。

6) 連結資料庫到accelon2 (注意不可以打 / ，要打 \ )，只須執行一次。
    mklink/j  ..\accelon22\dist\cvny ..\..\cvny\cvny 

7) 確保 accelon22/dist/config.js 指定載入 cvny，執行 accelon22\dist\index.html 。

## 說明
* ck 標記依照 SuttaCentral 縮略。
* 各種律有相當的 ck 可以互連。
* 四分律第20犍度，細分為 kd20~kd40

## 注意

* pxmlid.txt 記錄所有 CBETA 22,23 冊的 \<p> 的xml:id 屬性，
  從 bookcase_v074_20221027.zip 產生

## v4search

由於 v4search 的精度只到行，產生off標記時，如果該行有\<p>則直接使用，
否則看上一行是否以「。」結尾，若否，則取第一個「。」之後的文字為起點（即★所在）。

    T22p0572a03	pj1i  
    T22n1428_p0572a03：男子亦如是。★若比丘為怨家將至人婦女

    T22p0572a18	pj1j
    T22n1428_p0572a18：入如毛頭，波羅夷。★方便而不入，偷蘭遮。若

    故 要補上釘文才會正確。
    T22p0572a18#若	pj1j


## 轉換原理
詳見 [CBETA TEI 轉換](https://github.com/accelon/ptk/blob/main/cbetatei.md)



## 相關資源
[大正藏圖版 四分律序](https://dia.dila.edu.tw/uv3/index.html?id=Tv22p0567)
[CBETA XML經文](https://www.cbeta.org/download/cbreader.htm) 


