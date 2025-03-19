# 何に使う？

Denoで作成したHTTPローカルサーバーです。

# 特徴

## 複数のディレクトリを扱えます。
例えば、

| ディレクトリ名 | 格納しているディレクトリ・ファイル |
|---|---|
| mock | APIへのアクセスや解析タグに関する関数を、何もしないように変更したディレクトリ・ファイル |
| mod | 改修対象のディレクトリ・ファイル |
| base | 現本番のディレクトリ・ファイル |
```
www/
  │ 
  ├─ mock/
      └─ common/
           └─ js/
               └─ fetch.js
  │ 
  └─ mod/
       └─ index.html
  │ 
  └─ base/
      └─ common/
           ├─ css/
               └─ style.css
           └─ js/
               └─ fetch.js
      └─ index.html
```
という構成で、適切に設定した後にこのローカルサーバーを起動してブラウザでアクセスすると、ページで使用される各ファイルは以下のように取得されます。

| URL | レスポンスで返されるファイルの格納先 |
|---|---|
| http://localhost:8000/common/js/fetch.js | mock |
| http://localhost:8000/common/css/style.css | base |
| http://localhost:8000/index.html | mod |

もし、改修作業中に別プロジェクトの本番リリースが入り、その反映を取り込まなければならない場合でも、何も考えずbaseにリリースされたファイルを含む一式を入れて、全部上書きすれば反映を取り込むことができます。

## カスタムヘッダでファイル格納先のディレクトリ名を確認できます。

上記の例でいうと以下のようになります。
| URL | Customized-Source-Directory |
|---|---|
| http://localhost:8000/common/js/fetch.js | www/mock |
| http://localhost:8000/common/css/style.css | www/base |
| http://localhost:8000/index.html | www/mod |

# 使い方

作業中

# 注意点

- 文字コードはUTF-8のみに対応していると思います。Shift-JIS、EUC-JPだと文字化けします。
